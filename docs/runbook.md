# Content Handoff and Deployment Runbook

This runbook is for the coach, project owner, and deployment operator. It completes the setup that cannot be safely invented in code.

## Coach content checklist

Confirm each item in writing before publishing it:

- Approved gym name, logo, tagline, and preferred tone.
- Exact address, map/directions URL, phone number, email, social URLs, and opening hours.
- Current membership rates, inclusions, promos, payment notes, and restrictions.
- Equipment, facilities, programs, coaching services, and beginner guidance.
- Coach/team names, biographies, certifications, and claims that may appear publicly.
- Testimonials, member names/descriptors, and permission to publish each quote.
- Privacy contact and approved privacy notice.
- Coach digest recipient and preferred follow-up method.

## Media handoff

For each photo or video, provide:

| Item | Required information |
| --- | --- |
| Filename | Descriptive filename and preferred display location. |
| Rights | Confirmation that the gym may publish it on the website. |
| Subject | Who or what is shown. |
| Alt text | Short description for visitors using assistive technology. |
| Crop | Preferred focal point for mobile and desktop. |
| Caption | Optional approved caption or context. |
| Video poster | Image to show before playback. |
| Video transcript | Text alternative for meaningful spoken content. |

Only approved assets should be copied into `public/media/`. Keep originals and private material outside the repository.

## Google Sheet provisioning

1. Create a private spreadsheet and a `Leads` tab.
2. Add the exact 19-column header order from `docs/architecture.md`.
3. Create or select a Google Cloud project and enable the Google Sheets API.
4. Create a service account and share the spreadsheet with its email as an editor.
5. Store the service account email and private key only in environment variables.
6. Use a separate test spreadsheet for local and staging checks.
7. Confirm the coach can edit `staff_status` and `staff_notes` without changing application-owned headers.

## Resend provisioning

1. Create a Resend project and API key.
2. Verify the production sending domain.
3. Configure a sender address using the verified domain.
4. Use a test recipient during staging.
5. Add the sender address, API key, and coach recipient to the deployment environment.
6. Confirm confirmation emails and coach digest emails arrive before launch.

## Vercel deployment

1. Import the repository and select the `codex/daily-habit-landing-page` branch or the approved release branch.
2. Configure all variables listed in `docs/readme.md` for the correct environment.
3. Deploy the application and verify the production URL.
4. Confirm `vercel.json` registers `/api/cron/leads-digest` with the daily UTC schedule.
5. Confirm the cron request is protected by `CRON_SECRET`.
6. Test the lead form with a real test email and the test Sheet.
7. Verify the Sheet row, lead confirmation, digest, and notification status columns.
8. Switch to the production Sheet and coach recipient only after the complete test passes.

The default digest schedule is `0 0 * * *` UTC, corresponding to 08:00 Asia/Manila. Vercel plan-specific timing and cron limits should be confirmed before promising an exact delivery minute.

## Prelaunch checklist

- Replace all `[OWNER TO CONFIRM]` copy.
- Replace media placeholders with approved assets.
- Add the final privacy notice link and text.
- Verify page title, description, social preview, and canonical URL.
- Test the page on mobile and desktop.
- Test keyboard navigation and reduced motion.
- Run lint, typecheck, unit tests, browser tests, and production build.
- Submit a test lead and confirm all notification states.
- Confirm the coach knows that the Sheet is the v1 lead list.

## Troubleshooting

### Leads are not appearing in the Sheet

Check the production environment variables, spreadsheet ID, range, service-account sharing, API enablement, and Vercel function logs. Do not expose credentials or provider error details to the visitor.

### A lead is saved but the confirmation email is missing

Check the row's `lead_confirmation_status`, Resend sender-domain verification, recipient address, API key, and Resend delivery logs. The lead remains valid in the Sheet and can be followed up manually.

### The daily digest is not delivered

Check the cron registration, `CRON_SECRET`, `COACH_EMAIL`, Resend delivery logs, and rows whose `digest_status` is `failed` or whose `digest_sent_at` is blank. Unsent rows remain retryable.

### Business information changed

Update the relevant content source and documentation first, then update the page in a focused commit. Rates, hours, address, testimonials, and claims require coach confirmation before deployment.

## Data handling

Keep the Sheet private and limit access to authorized staff. Confirm the desired retention period with the coach. Do not export, share, or log lead data beyond the stated follow-up purpose.
