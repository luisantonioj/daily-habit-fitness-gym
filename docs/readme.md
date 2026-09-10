# Daily Habit Fitness Gym

Daily Habit Fitness Gym is a mobile-first lead-generation website for a local gym. It is designed to make the gym approachable for beginners and people restarting their fitness journey, then turn interest into a qualified inquiry that the coach can follow up on.

## Product scope

The first release includes:

- A polished single-page landing experience.
- Coach-approved information about services, facilities, membership options, location, and hours.
- Coach-provided photos and videos once usage rights and final selections are confirmed.
- A registration form for interested visitors.
- Server-side persistence to a dedicated Google Sheet.
- An on-site success state and an automated confirmation email to the lead.
- A daily email digest for the coach.

The first release does not include payments, completed membership enrollment, accounts, an admin dashboard, a CMS, or medical/health intake.

## Technology stack

- Next.js App Router with TypeScript.
- React for UI composition.
- Tailwind CSS plus project CSS variables for responsive styling and design tokens.
- Zod for shared request validation.
- Google Sheets API for the `Leads` worksheet.
- Resend for transactional emails.
- Vercel for hosting and the daily cron trigger.
- Vitest and React Testing Library for unit and component tests.
- Playwright for browser-level lead-form coverage.

The Next.js server layer uses App Router Route Handlers under `app/api`. Keep Google and email credentials on the server; the browser must never receive them.

## Prerequisites

- Node.js LTS.
- npm.
- A Google Cloud project with the Sheets API enabled.
- A service account that has access to the dedicated Google Sheet.
- A Resend account and verified sending domain for production email.
- A Vercel project for production deployment.

## Local setup

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000` in a browser. Use the test and build commands below before creating a commit.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | ID of the dedicated lead spreadsheet. |
| `GOOGLE_SHEETS_LEADS_RANGE` | A1 range for the `Leads` table, for example `Leads!A:U`. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Server-side Google service account email. |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Server-side service account private key, with escaped newlines if required by the host. |
| `RESEND_API_KEY` | Resend API key. |
| `EMAIL_FROM` | Verified sender, for example `Daily Habit Fitness Gym <hello@example.com>`. |
| `COACH_EMAIL` | Destination for the daily lead digest. |
| `CRON_SECRET` | Secret used to protect the scheduled digest route. |
| `NEXT_PUBLIC_SITE_URL` | Canonical public site URL for email links and metadata. |
| `LEADS_TIME_ZONE` | Display timezone; default is `Asia/Manila`. |

Never commit `.env.local`, service-account JSON, private keys, or live lead data.

## Google Sheet setup

1. Create a private spreadsheet with a tab named `Leads`.
2. Add the exact header row defined in `docs/architecture.md`.
3. Share the spreadsheet with the Google service account as an editor.
4. Add the spreadsheet ID and range to the deployment environment.
5. Keep staff-managed follow-up fields available to the coach without changing the application-owned headers.

## Resend and Vercel setup

1. Verify the sending domain in Resend.
2. Create the required API key and configure the sender address.
3. Add all environment variables to local development and Vercel environments.
4. Configure the daily cron path in `vercel.json`.
5. Confirm the production cron request contains the expected `CRON_SECRET` authorization header.

The default daily digest is scheduled for 00:00 UTC, which corresponds to 08:00 in Asia/Manila. Vercel cron timing and plan limits must be checked during deployment.

## Project structure

```text
app/                    Next.js routes, layout, page, and API handlers
components/             Reusable landing-page and form components
lib/                    Validation, Google Sheets, email, and shared utilities
public/media/           Approved coach-provided photos and videos
tests/                  Unit, integration, accessibility, and browser tests
docs/                   Product, engineering, architecture, design, and skill context
skills/grill-me/        Installable requirements-interview skill package
```

## Useful commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Content ownership

Business claims, prices, hours, address, testimonials, coach biography, social links, and media must be confirmed by the coach before release. Until then, use `[OWNER TO CONFIRM]` rather than inventing content.

See the remaining documentation for the product context, engineering rules, architecture, design system, and `grill-me` workflow.
