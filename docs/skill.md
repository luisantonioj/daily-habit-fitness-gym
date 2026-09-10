# `grill-me` Requirements Interview Skill

## Purpose

`grill-me` is a reusable pre-implementation interview workflow for product, website, and application requests that are underspecified or have meaningful product/architecture tradeoffs.

Its purpose is to turn an initial request into a decision-complete implementation plan before code or other durable project changes are made.

## Activation boundary

Use this workflow when the user asks to clarify requirements, plan a build, establish project context, or make architecture decisions before implementation. Do not use it for a simple factual answer, a small unambiguous edit, or a task whose requirements are already complete.

## Interview behavior

1. Inspect the repository, configuration, existing docs, and likely entry points before asking about facts that can be discovered locally.
2. Identify the current state, goal, audience, scope, constraints, and unknowns.
3. Ask exactly one meaningful question at a time.
4. Prefer the question interface when available; provide two to four mutually exclusive options and mark the recommended default.
5. Ask only questions that materially change the product, architecture, data, testing, rollout, or acceptance criteria.
6. Explain why a question matters when the tradeoff is non-obvious.
7. Maintain a decision ledger so answered questions are not repeated.
8. Separate confirmed facts, user preferences, recommended defaults, and unresolved owner content.
9. When technical claims depend on current provider behavior, verify them against primary documentation.
10. Do not write implementation code, mutate the repository, or create external resources while the interview is still resolving high-impact decisions.

## Decision ledger

Track these dimensions:

- Goal and success criteria.
- Target audience and user problems.
- Launch scope and explicit out-of-scope items.
- Content, brand, and asset ownership.
- Technology and hosting preferences.
- Data sources, schema, privacy, and retention.
- API and integration behavior.
- Error, retry, and abuse scenarios.
- Testing and accessibility expectations.
- Deployment, operations, and handoff.

## Recommendation behavior

When several approaches are reasonable:

- Recommend the smallest approach that satisfies the stated goal.
- Make the tradeoff explicit.
- Do not silently add accounts, payments, analytics, CMS features, or sensitive data collection.
- Keep provider-specific choices configurable when the user has not selected a provider and the choice does not affect the product contract.

## Completion behavior

The interview is complete only when an implementer can proceed without making product decisions. The final response must contain one complete `<proposed_plan>` block with:

- A clear title and summary.
- Implementation changes grouped by subsystem.
- Public interfaces, schemas, integrations, and failure behavior where relevant.
- Tests and acceptance criteria.
- Explicit assumptions and defaults.

Do not ask “should I proceed?” after presenting the complete plan. The user decides whether to leave interview mode and request implementation.

## Daily Habit Fitness Gym example

For this project, the workflow should confirm or preserve the decisions in `docs/context.md` and `docs/architecture.md`, including the beginner-focused audience, lead-generation scope, Google Sheet storage, Resend email, Vercel deployment, privacy boundary, and coach content confirmation process.

## Packaging

The version-controlled installable package lives in `skills/grill-me/`:

- `SKILL.md` contains the runtime instructions.
- `agents/openai.yaml` contains user-facing metadata and invocation policy.

Keep this project-facing specification synchronized with meaningful behavior changes to the package.
