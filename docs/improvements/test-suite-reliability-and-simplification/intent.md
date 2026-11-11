# Intent: Test suite reliability and simplification
Author: Udeet Gulati
Status: draft

## Problem
- The test suite has 8,094 lines for 5,069 lines of production code.
- Unit coverage contains 5,986 lines across 40 files; 26 files and 3,721 lines read or parse production source instead of exercising behavior.
- Source-regex tests lock JSX formatting, import choices, CSS selector spelling, declaration order, and colour-token names.
- `npm test` currently reports 290 passing and 4 failing tests; the failures reflect implementation or token drift rather than demonstrated behavior regressions.
- The latest default Playwright report contains 59 passing and 6 failing tests; five failures lock stale visual tokens and one expects an event that ended on 3 October 2026 to remain upcoming.
- `e2e/events.spec.ts` depends on the real clock while asserting dated repository content, so the test expires without a code regression.
- `playwright.config.ts` excludes `e2e/youtube-feed-failure.spec.ts`; the alternate `playwright.youtube.config.ts` suite has no package or Make target and is absent from the default E2E command.
- `package.json` and `Makefile` keep lint, unit, E2E, and build as separate commands; no repository-local CI workflow enforces a complete verification gate.
- Error-boundary tests search source text for `window.location.reload()` but do not click the recovery control or observe a reload.
- Playwright runs only Chromium despite browser-sensitive scrolling, snap, responsive, `<details>`, and `webcal:` behavior.
- Some E2E expectations import the same production content rendered by the page, so incorrect content can change the implementation and expectation together.
- Tests for completed plans, audits, and removed features remain in the runtime suite after their acceptance value has ended.

## Proposed outcome
- Establish clear lanes for pure logic, rendered component behavior, browser journeys, content invariants, and documentation validation.
- Keep focused logic tests for YouTube reads, external reads, event listing, calendar generation, diagnostics, and typed errors.
- Replace source-regex assertions with behavior tests or static tooling only where the rule remains valuable.
- Remove unit assertions already covered by a stronger browser or rendered-component test.
- Make dated E2E scenarios deterministic with a controlled clock or explicit fixture data.
- Test the Events empty state independently from the upcoming-event scenario.
- Expose the YouTube failure configuration through standard package and Make targets.
- Provide one verification target that runs lint, unit tests, both Playwright configurations, and build.
- Add a focused WebKit critical-path lane without copying the entire Chromium suite.
- Exercise error recovery controls as user interactions, including the observed reload side effect.
- Use independent expected values for business-critical content and structural assertions for content that is not copy-locked.
- Remove completed planning-document tests or move durable documentation rules to a dedicated docs validator.
- Record the retained, replaced, and deleted test files in the implementation plan.
- Success criteria:
  - Standard verification includes every maintained test suite.
  - Tests do not depend on the wall clock unless the clock is part of the scenario and controlled.
  - Behavior-preserving JSX, CSS ordering, import, or token refactors do not fail tests.
  - Each retained test protects a user-visible behavior, public contract, content invariant, or failure boundary.
  - Chromium and focused WebKit critical paths pass.
  - The verification target passes from a clean checkout.

## Affected users and systems
- Contributors and agents changing pages, content, styles, integrations, or error handling.
- Visitors relying on navigation, event dates, calendar links, responsive layouts, accessibility, and degraded YouTube states.
- Vitest configuration and tests under `src/`.
- Playwright configurations, fixtures, helpers, and tests under `e2e/`.
- `package.json`, `Makefile`, and repository-local CI configuration.
- Planning-document tests under `src/`.

## Constraints
- Preserve production behavior while restructuring the suite.
- Preserve meaningful regression coverage before deleting an assertion.
- Prefer accessible queries and observable outcomes over source text, CSS structure, or component internals.
- Keep external HTTP mocked at the boundary; do not call live YouTube or Instagram services in tests.
- Keep E2E data deterministic and isolated across workers.
- Keep failure artifacts only for failed runs.
- Do not make full pixel or token equality the default visual-regression strategy.
- Do not add a second component-test framework without a defined lane that Playwright cannot cover efficiently.
- Use file-scoped verification while revising tests; reserve the complete verification target for the final gate.

## Open questions
- Which source-level architectural rules should move to ESLint or a dedicated static validator?
- Which Chromium journeys form the minimum WebKit critical-path lane?
- Should rendered component behavior use the existing server-render approach or add React Testing Library with a browser-like environment?
- Which historical documentation tests still enforce an active policy and which can be deleted?
