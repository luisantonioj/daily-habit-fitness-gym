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

The current brand assets are supplied separately from coach media. Confirm that the files in `public/brand/` are the approved Daily Habit logo lockup and kettlebell/lightning mark before deployment. Keep the logo unchanged; replace it only with a newer coach-approved asset in a focused commit.

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

The current Stitch adaptation intentionally keeps the sample image URLs remote. Verify that each `lh3.googleusercontent.com` asset still loads, has acceptable usage rights, and matches its alt text before production. Later coach media may be copied into `public/media/` after approval.

### Exact sample-content approval inventory

The current frontend intentionally publishes the sample values from `content/site.ts` as temporary content. The coach must review each category, not only the placeholder strings:

| Category | Current sample material requiring approval |
| --- | --- |
| Claims and metrics | Beginner-first positioning, “500+ Strong,” “88% Milestone,” “412 members,” coach coverage, 24/7 access, sanitization, and other performance or safety statements. |
| People and social proof | Coach Sarah, Coach Marcus, Elena M., David K., Priya S., their roles, member durations, portraits, quotes, and permission to publish. |
| Memberships | Starter Habit, Guided Habit, All-In Milestone, tier descriptions, “Standard/Guided/Premium” price placeholders, inclusions, exclusions, and cancellation language. |
| Services and amenities | Habit circuits, coaching formats, equipment guidance, locker and shower amenities, parking, kiosk/check-in, and virtual-tour feature claims. |
| Visit details | Metro Central Athletic Complex, address placeholder, operating-hours rows, contact email/phone placeholder, parking statement, directions label, and facility hours. |
| Media and branding | Every remote `lh3.googleusercontent.com` URL, image subject, crop, alt text, poster/caption needs, usage rights, local logo files, and footer certification wording. |

Approval must be recorded before public launch. A sample value can be replaced with confirmed copy or removed; do not silently turn an unconfirmed sample value into an official claim.

### Content replacement procedure

1. Update the relevant typed value or media object in `content/site.ts`; keep the section IDs, form field names, and API contract unchanged.
2. For coach media, add the approved file under `public/media/` and record rights, focal crop, alt text, caption, poster, and transcript details in the handoff checklist.
3. Remove the replaced remote URL only after its replacement has been approved and tested. If a remote host must remain, update `next.config.ts` and the media availability check together.
4. Review both themes and mobile/desktop crops, then run lint, typecheck, unit/API tests, Playwright/Axe checks, and the production build.
5. Commit content and media changes separately from backend or infrastructure changes, using a message that identifies the approved content update.

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

- Verify dark mode is the default and the light-mode toggle persists after reload.
- Review both themes for contrast, logo treatment, focus states, and responsive layout.
- Replace all `[OWNER TO CONFIRM]` copy.
- Approve or replace every exact Stitch sample claim, name, metric, price placeholder, testimonial, amenity, address, hour, contact detail, and remote image listed above.
- Replace media placeholders with approved assets.
- Add the final privacy notice link and text.
- Verify page title, description, social preview, and canonical URL.
- Test the page on mobile and desktop.
- Test keyboard navigation and reduced motion.
- Run lint, typecheck, unit tests, browser tests, and production build.
- Submit a test lead and confirm all notification states.
- Confirm the coach knows that the Sheet is the v1 lead list.

## Visual QA handoff

Review the deployed page at minimum at 320px, 390px, 768px, and 1440px widths in both themes. Confirm that the logo is legible, the header CTA and theme toggle remain reachable, mobile navigation opens and closes by keyboard, no section causes horizontal scrolling, and all focus indicators remain visible. Check the hero and media placeholders for stable aspect ratios, verify that yellow actions use dark text, and confirm the light theme remains within the Daily Habit black/white/yellow/slate palette.

Before launch, verify every copied sample claim and replace or approve it through the coach handoff: exact gym name/tagline, address and directions, hours, contact/social links, rates and inclusions, services and facilities, coach/team claims, metrics, testimonials with permission, amenities, privacy wording, and remote photos/videos. Do not treat the sample as independently verified merely because it is in the repository.

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
