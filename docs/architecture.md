# System Architecture

## Overview

The application is a single Next.js App Router project deployed on Vercel. The landing page is rendered by Next.js and the small backend is implemented with server-side Route Handlers. Google Sheets is the only v1 data store. Resend handles transactional email.

```text
Visitor browser
    |
    v
Next.js landing page + lead form
    |
    | POST /api/leads
    v
Lead validation and submission service
    |                    \
    |                     \--> Resend lead confirmation
    v
Google Sheet: Leads

Vercel Cron --> GET /api/cron/leads-digest
                    |
                    +--> read unsent digest rows
                    +--> Resend coach digest
                    +--> mark digest status in Google Sheet
```

## Application structure

```text
app/
  layout.tsx             Global metadata and shell
  page.tsx               Landing page composition
  api/
    leads/route.ts       Public lead submission endpoint
    cron/leads-digest/route.ts  Protected daily digest endpoint
components/
  landing/               Page sections and reusable content blocks
  lead-form/             Form, fields, validation messages, status UI
lib/
  validation/            Zod schemas and normalized input
  sheets/                Google Sheets client and row operations
  email/                 Resend client and email templates
  time/                  Timezone and display helpers
public/brand/             Supplied Daily Habit logo lockup and mark
public/media/             Approved local media
tests/                    Unit, integration, accessibility, and E2E coverage
```

The landing page remains a single route. Theme state is a client-side presentation concern: `<html data-theme="dark|light">` is the source of truth, `daily-habit-theme` is the browser persistence key, and no theme value is sent to the lead API or stored with a lead.

The logo is rendered from local assets only. `daily-habit-mark.png` is used for compact navigation and `daily-habit-logo.png` is used where the full brand lockup is appropriate. The UI must not depend on the external image URLs or invented content included in the Stitch export.

## Lead submission contract

### `POST /api/leads`

Request JSON:

```json
{
  "name": "Alex Santos",
  "email": "alex@example.com",
  "phone": "+63 900 000 0000",
  "preferredContactMethod": "email",
  "fitnessGoal": "Build a consistent workout routine",
  "message": "I am new to strength training.",
  "consent": true,
  "honeypot": "",
  "source": "website",
  "utmSource": "facebook",
  "utmMedium": "social",
  "utmCampaign": "",
  "idempotencyKey": "optional-client-generated-key"
}
```

Rules:

- `name`, `email`, `preferredContactMethod`, `fitnessGoal`, and `consent` are required.
- `phone`, `message`, and UTM values are optional.
- Email must be syntactically valid and normalized before storage.
- The honeypot must be empty.
- Consent must be explicitly true.
- The endpoint must not accept or store health/medical data.

Success response:

```json
{
  "ok": true,
  "leadId": "generated-server-id"
}
```

Error behavior:

- `400` for invalid input.
- `429` for a rejected rate/spam submission when protection is added.
- `500` for a storage failure, with a safe generic message.
- Provider details are logged server-side only.

The Sheet append is the success boundary. If the append succeeds but email fails, return a successful submission state and preserve the lead; record the notification failure in the row.

## Daily digest contract

### `GET /api/cron/leads-digest`

- Accept only authenticated scheduled requests with `Authorization: Bearer <CRON_SECRET>`.
- Read rows where `digest_sent_at` is blank and `staff_status` is not `do-not-contact`.
- Send a concise digest to `COACH_EMAIL`.
- Mark included rows with digest status and sent timestamp after successful delivery.
- Leave rows unmarked when the digest fails so the next run can retry.
- Return a generic status without exposing lead contents to the caller.

The digest is intentionally at-least-once. If the email succeeds but the Sheet update fails, a later digest may repeat a row; the lead ID and timestamp make that visible to the coach.

## Google Sheet design

The tab is named `Leads`, with one header row followed by append-only submissions:

| Column | Owner | Purpose |
| --- | --- | --- |
| `lead_id` | Application | Unique identifier. |
| `submitted_at` | Application | UTC submission timestamp. |
| `name` | Application | Lead name. |
| `email` | Application | Required contact email. |
| `phone` | Application | Optional phone number. |
| `preferred_contact_method` | Application | Preferred follow-up channel. |
| `fitness_goal` | Application | Lead intent. |
| `message` | Application | Optional visitor message. |
| `consent_at` | Application | UTC timestamp of consent. |
| `source` | Application | Primary acquisition source. |
| `utm_source` | Application | Optional campaign attribution. |
| `utm_medium` | Application | Optional campaign attribution. |
| `utm_campaign` | Application | Optional campaign attribution. |
| `lead_confirmation_status` | Application | `pending`, `sent`, or `failed`. |
| `lead_confirmation_sent_at` | Application | UTC send timestamp. |
| `digest_status` | Application | `pending`, `sent`, or `failed`. |
| `digest_sent_at` | Application | UTC digest timestamp. |
| `staff_status` | Coach | Manual follow-up status. |
| `staff_notes` | Coach | Manual notes. |

The application must append values in this exact order. Staff may edit only staff-owned fields and should not rename or reorder headers without updating the architecture and implementation together.

## Service boundaries

- `sheetsClient`: authenticates with the server-side service account and performs append/read/update operations.
- `leadService`: validates, normalizes, assigns IDs, writes the row, and coordinates notification status.
- `emailClient`: wraps Resend and exposes typed lead-confirmation and coach-digest operations.
- `timeService`: creates UTC timestamps and formats dates in `Asia/Manila`.
- `utmService`: extracts allowlisted attribution values from the page URL.

Provider SDKs must not be called directly from React components.

## Environment variables

```text
GOOGLE_SHEETS_SPREADSHEET_ID
GOOGLE_SHEETS_LEADS_RANGE
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
RESEND_API_KEY
EMAIL_FROM
COACH_EMAIL
CRON_SECRET
NEXT_PUBLIC_SITE_URL
LEADS_TIME_ZONE=Asia/Manila
```

Only `NEXT_PUBLIC_SITE_URL` is safe for browser exposure. All other values are server-only.

## Security and reliability

- Validate every field on the server even if the browser already validates it.
- Include a hidden honeypot and avoid returning detailed failure causes.
- Use a same-origin form endpoint; do not expose Google or Resend APIs to the client.
- Add request throttling or an additional CAPTCHA provider if real spam exceeds the honeypot's protection.
- Keep the cron secret in Vercel environment variables.
- Escape or safely render all lead content in email templates.
- Do not log full email addresses, phone numbers, message contents, credentials, or private keys.
- Preserve the Sheet row when email operations fail.
- Treat duplicate cron delivery as possible and keep digest processing observable through status columns and logs.

## Deployment

- Deploy the Next.js application to Vercel.
- Configure the production environment variables.
- Configure a `vercel.json` daily cron for `/api/cron/leads-digest`.
- Use 00:00 UTC as the default schedule for 08:00 Asia/Manila.
- Verify the production domain in Resend before enabling real confirmation emails.
- Test the Sheet append, lead email, and digest against a test spreadsheet and test recipient before launch.

## Operational failure rules

- If validation fails: show field-level errors and create no side effects.
- If Sheet append fails: show a retryable generic error and do not claim the lead was registered.
- If lead confirmation fails after append: show success, keep the lead, and mark confirmation `failed`.
- If digest email fails: retain unsent rows and mark the digest attempt `failed`.
- If the digest update fails after email delivery: allow a repeat on the next run and use `lead_id` to identify duplicates.
