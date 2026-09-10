# Project Context

## Vision

Daily Habit Fitness Gym should feel like a practical, welcoming place where people can start or restart training without feeling judged. The website should turn the gym's “make fitness a habit” idea into a clear next step: contact the coach and learn how to begin.

## Primary audience

The primary audience is local beginners and people returning to exercise. They may be unsure about gym etiquette, equipment, routines, or whether the gym is suitable for them. The page should reduce uncertainty before asking for contact details.

Secondary audiences include casual local members and more experienced lifters looking for a nearby gym.

## Business goals

- Increase qualified inquiries from social and direct traffic.
- Give the coach a simple, dependable list of new leads.
- Make the gym's offer, location, schedule, and next step easy to understand.
- Build trust through real gym imagery, clear language, and approved social proof.

## Core features

- Single-page landing page with clear section navigation.
- Beginner-friendly value proposition and primary registration CTA.
- Services, equipment, membership/rate, and facilities content.
- Coach-approved image and video gallery.
- Testimonials or other social proof when supplied.
- FAQ, location, hours, contact details, and social links.
- Lead form collecting contact and intent information.
- Google Sheet persistence.
- Immediate confirmation page state and automated email to the lead.
- Daily coach digest email.

## User flows

### Social discovery flow

1. Visitor discovers the gym through Facebook or another social channel.
2. Visitor lands on the website and sees a clear beginner-friendly promise.
3. Visitor scans benefits, gym experience, media, practical details, and FAQs.
4. Visitor selects a CTA and completes the registration form.
5. Server validates the form and writes the lead to the `Leads` sheet.
6. Visitor sees a success state and receives a confirmation email.
7. Coach receives the lead in the next daily digest and follows up manually.

### Validation failure flow

1. Visitor submits missing, malformed, or invalid information.
2. The form identifies the problem beside the relevant field.
3. No Sheet row or email is created until validation succeeds.

### Partial notification failure flow

1. A valid lead is stored in the Sheet first.
2. If an email notification fails, the lead remains preserved.
3. The application records notification status for operational follow-up.
4. The coach can use the Sheet as the authoritative lead list.

## Lead information

The first release collects only:

- Name.
- Required email.
- Optional phone number.
- Preferred contact method.
- Fitness goal.
- Optional message.
- Privacy consent.
- Basic attribution metadata.

Do not collect medical history, diagnoses, injury details, or other sensitive health information in this form.

## Content still required from the coach

The following must be supplied or confirmed before launch:

- Exact gym name and approved tagline.
- Address, map link, hours, phone number, and social links.
- Membership rates, offers, inclusions, and any restrictions.
- Available equipment, facilities, programs, and coaching services.
- Coach/team biography and approved claims.
- Testimonials with permission to publish.
- Photos, videos, captions, alt-text context, and usage approval.
- Preferred lead follow-up method and digest recipient.
- Privacy contact and approved privacy notice wording.

The supplied Facebook page is a reference link, not an authoritative source for unconfirmed copy.

## Constraints

- The repository starts with no application code or existing conventions.
- Google Sheets is the v1 system of record; no separate database is planned.
- Credentials and personal lead data must remain server-side and private.
- The design must work well on mobile because social traffic is expected.
- Coach-provided media arrives later, so the page must support temporary approved placeholders.
- Final visual styling must remain adaptable until the mockup is provided.
- Vercel cron uses UTC and may have plan-specific timing behavior.

## Out of scope for v1

- Online payment or membership checkout.
- Member accounts, attendance, progress tracking, or subscriptions.
- Admin dashboard or CMS.
- Automated sales/chat workflows.
- Medical or detailed fitness assessments.
- Scraping or reusing unapproved Facebook media.
