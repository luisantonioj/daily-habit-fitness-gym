# Agent and Coding Rules

This document is the working agreement for contributors and coding agents. Product decisions live in `docs/context.md`; system decisions live in `docs/architecture.md`; visual decisions live in `docs/design.md`.

## Task workflow

1. Read the relevant documentation before changing code.
2. Inspect the repository and current implementation before asking questions or editing.
3. Keep each task focused on one behavior or subsystem.
4. If a decision changes, update the relevant documentation before changing the implementation.
5. Implement in a small vertical slice where practical.
6. Add or update tests with behavior changes.
7. Run the relevant checks before committing.
8. Review the staged diff for unrelated changes, secrets, private data, or invented business copy.

## Git rules

- Use the `codex/` branch prefix for implementation branches.
- Use the grouped commit sequence in the approved implementation plan.
- Prefer imperative, scoped commit messages such as `feat: add lead submission pipeline`.
- Do not mix documentation, design, backend, and test concerns when they can be committed separately.
- Never rewrite or discard user work without explicit instruction.
- Never commit `.env` files, private keys, service-account JSON, real lead rows, or private coach media.

## TypeScript and React

- Use TypeScript strict mode.
- Prefer explicit types at service and API boundaries.
- Validate untrusted input at the boundary with Zod.
- Keep server-only modules separate from client components.
- Do not import Google credentials, Resend clients, or server environment access into browser bundles.
- Use React components with one clear responsibility.
- Prefer semantic HTML and native browser behavior before adding custom abstractions.
- Keep content data separate from layout components when it improves editability.

## Naming and files

- Use PascalCase for React component names and files when the project convention requires component filenames.
- Use camelCase for variables, functions, and object properties.
- Use kebab-case for URL segments and scripts.
- Use descriptive service names such as `appendLead`, `sendLeadConfirmation`, and `sendCoachDigest`.
- Use `route.ts` only for HTTP route handlers and keep provider calls in `lib/` services.
- Keep public assets under `public/media/` with descriptive filenames.

## Content and design safety

- Do not invent hours, prices, equipment, certifications, testimonials, outcomes, or addresses.
- Use `[OWNER TO CONFIRM]` until the coach approves business content.
- Use coach-provided media only after usage approval.
- Do not scrape or download social media media as a substitute for approved assets.
- Keep copy welcoming and beginner-friendly without medical promises or guaranteed results.

## API and data rules

- Treat Google Sheets as an external system that can fail or be slow.
- Return safe, generic client errors; do not expose provider errors, credentials, stack traces, or Sheet identifiers.
- Store the lead before sending notifications so a notification failure cannot erase a lead.
- Make notification status visible in the Sheet for recovery and support.
- Store timestamps in UTC and render them in `Asia/Manila` where human-readable.
- Keep staff-managed fields separate from application-owned fields.

## Quality gates

At minimum, run the checks relevant to the current group:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Run browser and accessibility checks before the final feature commit. Documentation-only commits must pass `git diff --check` and must not contain unresolved implementation decisions that affect the next group.
