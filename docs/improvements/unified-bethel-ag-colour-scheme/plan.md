# Plan: unified-bethel-ag-colour-scheme
Author: Udeet Gulati
Status: ready
Links: [intent](./intent.md) · [spec](./spec.md)

## Files that change

- Edit `src/app/globals.css` — `unified-bethel-ag-colour-scheme_1_1`, `unified-bethel-ag-colour-scheme_2_1`
- Edit `src/app/globals.test.ts` — `unified-bethel-ag-colour-scheme_1_1`, `unified-bethel-ag-colour-scheme_2_1`
- Edit `src/app/error.tsx` — `unified-bethel-ag-colour-scheme_1_1`
- Edit `src/app/error.test.tsx` — `unified-bethel-ag-colour-scheme_1_1`
- Edit `src/app/global-error.tsx` — `unified-bethel-ag-colour-scheme_1_1`
- Edit `src/app/global-error.test.tsx` — `unified-bethel-ag-colour-scheme_1_1`
- Edit `src/app/about/page.test.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `src/app/page.test.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `src/app/events/page.test.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `src/app/give/page.test.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `src/app/contact/page.test.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `src/app/watch/page.test.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `e2e/about.spec.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `e2e/watch.spec.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `e2e/accessibility.spec.ts` — `unified-bethel-ag-colour-scheme_2_1`
- Edit `e2e/errors.spec.ts` — `unified-bethel-ag-colour-scheme_1_1`

## Order of work

### Wave 1 (1 task)

id: unified-bethel-ag-colour-scheme_1_1
title: Replace the shared palette and shell states with exact Bethel AG semantic tokens
status: done
acceptance_criteria:
- `:root` defines every exact primitive in [ADR 0003 Theme palette](../../adr/0003-spirit-in-blue-visual-direction.md#theme-palette), maps the semantic Tailwind/shadcn tokens in [spec Semantic tokens](./spec.md#semantic-tokens), and keeps one `color-scheme: dark` token set.
- Legacy `--ink`, `--paper`, `--mist`, `--acid`, `--cobalt`, `--band`, `--band-ink`, and `--band-link` aliases and route-local reinterpretations are absent.
- Shared body, header, footer, navigation, links, selection, focus, controls, and scrollbars use role-based tokens and the [spec Interaction states](./spec.md#interaction-states); sky-blue fills use `#06202e` text.
- Error and global-error surfaces carry an error-specific class or equivalent selector so their error state uses semantic red while not-found stays neutral; recovery actions use the sky-blue interaction treatment.
- `globals.test.ts` fails when a palette value or semantic mapping drifts, when a legacy alias returns, when a light theme appears, or when an opaque CSS colour outside ADR 0003 is introduced.
- Error unit tests and `e2e/errors.spec.ts` distinguish semantic-red error state from the neutral not-found shell and verify the Surface background plus sky-blue recovery action.
files:
- src/app/globals.css
- src/app/globals.test.ts
- src/app/error.tsx
- src/app/error.test.tsx
- src/app/global-error.tsx
- src/app/global-error.test.tsx
- e2e/errors.spec.ts
depends_on: []

### Wave 2 (1 task)

**Most risky:** `unified-bethel-ag-colour-scheme_2_1`.

id: unified-bethel-ag-colour-scheme_2_1
title: Migrate every public route from alternating bands to the unified dark surface
status: done
acceptance_criteria:
- Home, About, Give, Watch, Contact, and Events implement their row in [spec Route migration](./spec.md#route-migration): body and every major section resolve to Surface `#0c0c0e` without light, cobalt, acid, olive, or blue route-sized bands.
- Surface alternate, Surface sunken, Night, and the blue-band gradient appear only in the bounded cards, menus, media backplates, overlays, controls, or grouped panels allowed by [spec Surface rules](./spec.md#surface-rules).
- All former hard-coded fallbacks and route overrides in `globals.css`, including About media letterboxing, Contact panels, Watch scripture/testimony panels, Events breakout/Sunday/menu surfaces, and Home hero/visit/channel/highlights, use exact ADR 0003 primitives through role-based tokens.
- Existing typography, spacing, layout, imagery, route structure, content, responsive stacking, and interaction behaviour remain unchanged.
- Route-level unit tests assert the new semantic treatments without retaining Spirit in Blue colour names or expectations.
- `e2e/accessibility.spec.ts` checks computed Surface backgrounds for the shell and major sections on `/`, `/about`, `/events`, `/watch`, `/contact`, and `/give` at 320px phone, 768px tablet, and 1280px desktop widths.
- Playwright checks exact accent, on-accent, bounded-surface, media-fallback, and semantic-state colours; `/about` and `/watch` run Axe without disabling `color-contrast`.
- Axe reports no serious or critical violations on every public route; failed contrast is fixed in CSS rather than suppressed.
files:
- src/app/globals.css
- src/app/globals.test.ts
- src/app/about/page.test.ts
- src/app/page.test.ts
- src/app/events/page.test.ts
- src/app/give/page.test.ts
- src/app/contact/page.test.ts
- src/app/watch/page.test.ts
- e2e/about.spec.ts
- e2e/watch.spec.ts
- e2e/accessibility.spec.ts
depends_on:
- unified-bethel-ag-colour-scheme_1_1

## Not doing

- Light mode or a theme switcher ([spec Scope](./spec.md#scope)).
- Layout, typography, spacing, content, imagery, or route-behaviour redesign ([intent Constraints](./intent.md#constraints)).
- Bethel AG layout, copy, imagery, or assets ([spec Scope](./spec.md#scope)).
- Recolouring `public/brand/hsg-logo.jpg` ([spec Compatibility and precedence](./spec.md#compatibility-and-precedence)).
- Keeping legacy colour aliases as a compatibility layer ([spec Semantic tokens](./spec.md#semantic-tokens)).

## Risks

- `src/app/globals.css` is a single shared 1,600-line stylesheet containing the shell and every route palette; a legacy-token replacement can silently affect unrelated selectors, so wave 2 must follow the token contract from wave 1.
- Current source-based tests lock old aliases and opaque colours across `globals.test.ts` and four route tests; partial migration leaves the suite inconsistent even when the browser rendering looks correct.
- About and Watch currently disable Axe `color-contrast`; removing those exceptions can expose multiple existing text/background failures that must all be corrected with ADR 0003 pairs.
- About image plates use `#2a160f` letterboxing and Playwright asserts it directly; the replacement must preserve `contain` sizing while changing only the fallback colour.
- Text faint is only `4.04:1` on Surface and cannot replace normal-sized copy; Border is decorative and cannot be the sole visible control boundary.
- White on Accent primary is `2.77:1`; any missed inherited White text on a sky-blue control fails the interaction contract.

## Acceptance criteria

| Check | Command or route | Pass |
| --- | --- | --- |
| Unit | `make test` | Palette allowlist, semantic mappings, error state, and route colour assertions are green. |
| Build | `make build` | Finishes with `Build succeeded`. |
| Lint | `make lint` | Zero warnings. |
| Browser | `make e2e` | Full Playwright suite is green with Axe colour contrast enabled on every route. |
| Computed colour | `/`, `/about`, `/events`, `/watch`, `/contact`, `/give`, unknown route | Surface is uninterrupted at phone, tablet, and desktop widths; bounded surfaces and states use their assigned exact values. |
| Human visual review | Same routes at 320px, 768px, and 1280px | Dark page flow is continuous; section hierarchy, card boundaries, media fallbacks, controls, focus, and readable text remain clear. |
| Missing infrastructure | Repository | No committed screenshot baselines or visual-regression runner; capture review screenshots manually and get human approval. |
