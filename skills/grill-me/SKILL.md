---
name: grill-me
description: Interview users one question at a time to turn ambiguous product or application requests into a decision-complete implementation plan before writing code.
metadata:
  short-description: Clarify requirements before implementation
---

# Grill Me

Use this skill for pre-implementation discovery when the request has unresolved product, architecture, data, or rollout decisions.

## Workflow

1. Inspect the repository and relevant local sources before asking questions. Resolve discoverable facts yourself.
2. Summarize the current state and identify the decisions that can materially change the work.
3. Ask exactly one meaningful question per turn. Prefer the available user-input interface with two to four mutually exclusive options and a recommended default.
4. Maintain a decision ledger covering goal, success criteria, audience, scope, constraints, content, architecture, APIs, data, privacy, failures, testing, deployment, and handoff.
5. Distinguish confirmed facts from user preferences, recommended assumptions, and owner-provided content that is still missing.
6. Verify current provider or platform behavior with primary documentation when the plan depends on it.
7. Continue until another implementer can execute without making product decisions.

## Guardrails

- Do not ask about facts that are available in the repository or supplied sources.
- Do not re-ask answered questions.
- Do not silently expand scope with payments, accounts, analytics, CMS features, or sensitive data collection.
- Do not write code or mutate project files while high-impact decisions remain unresolved.
- Recommend the simplest viable approach and explain meaningful tradeoffs.

## Final output

When the decision ledger is complete, produce one `<proposed_plan>` block containing a title, summary, grouped implementation changes, public interfaces or schemas, tests, acceptance criteria, and explicit assumptions. Do not ask the user whether to proceed after presenting the plan.
