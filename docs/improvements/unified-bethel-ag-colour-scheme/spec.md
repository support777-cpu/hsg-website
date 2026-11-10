# Spec: Unified Bethel AG colour scheme

Status: draft
Author: Udeet Gulati
Intent: [intent.md](./intent.md)
Skills: frontend-design
Decision: [ADR 0003](../../adr/0003-spirit-in-blue-visual-direction.md)

## Outcome

- All public routes use the exact Bethel AG [theme palette](../../adr/0003-spirit-in-blue-visual-direction.md#theme-palette).
- `#0c0c0e` is the uninterrupted page and major-section background.
- Route-sized cobalt, acid, olive, and light bands are removed.
- Hierarchy comes from spacing, typography, borders, media, and bounded dark surfaces.
- Sky blue identifies links, actions, selection, current state, and keyboard focus.
- Semantic red remains limited to errors and destructive actions.
- Content, typography, imagery, layout, route structure, and behaviour stay unchanged.

## Scope

| In scope | Out of scope |
| --- | --- |
| Shared CSS colour primitives and semantic tokens | Bethel AG layout, copy, imagery, or assets |
| Shared header, navigation, footer, controls, selection, scrollbars, and focus | Typography or spacing redesign |
| `/`, `/about`, `/give`, `/watch`, `/contact`, `/events`, error, and not-found surfaces | New content or route behaviour |
| Route-local colour overrides and hard-coded CSS colours | Light theme or theme switcher |
| Colour assertions and browser accessibility coverage | Logo artwork recolouring |

## Palette source

- Use the exact values and roles in [ADR 0003 Theme palette](../../adr/0003-spirit-in-blue-visual-direction.md#theme-palette).
- Transparent and `currentColor` remain valid functional values.
- Disabled states and media overlays may apply alpha to a listed token.
- Text colours must stay opaque.

## Semantic tokens

- Define the Bethel AG primitives once in `src/app/globals.css`.
- Map Tailwind/shadcn tokens to the primitives.
- Make route selectors consume semantic tokens rather than hex literals.

| Semantic token | Primitive |
| --- | --- |
| `--background`, `--sidebar` | Surface |
| `--foreground`, `--card-foreground`, `--popover-foreground`, `--sidebar-foreground` | Text primary |
| `--card`, `--secondary`, `--sidebar-accent` | Surface alternate |
| `--popover`, `--muted` | Surface sunken |
| `--muted-foreground` | Text muted |
| `--primary`, `--sidebar-primary` | Accent primary |
| `--primary-foreground`, `--sidebar-primary-foreground` | On light accent |
| `--accent` | Accent strong |
| `--accent-foreground` | On light accent |
| `--destructive` | Semantic red |
| `--border`, `--input`, `--sidebar-border` | Border |
| `--ring`, `--sidebar-ring` | Accent strong |

- Replace legacy colour names such as `--ink`, `--paper`, `--mist`, `--acid`,
  `--cobalt`, `--band`, `--band-ink`, and `--band-link` with role-based names.
- Remove route-local overrides that reinterpret a shared token for a light surface.
- Keep one dark `:root` token set and `color-scheme: dark`.
- Do not add system-preference, `.light`, or alternate theme token sets.
- Map chart tokens only from the palette and keep adjacent series distinguishable.

## Interaction states

| Element/state | Treatment |
| --- | --- |
| Text link | Accent light; Accent strong on hover |
| Current navigation | Accent strong plus the existing non-colour indicator |
| Primary action | Accent primary fill with On light accent text |
| Primary hover/active | Accent strong fill with On light accent text |
| Secondary/ghost action | Dark surface change; Accent light text where needed |
| Keyboard focus | 2px Accent strong outline with the existing offset |
| Selection | Accent primary fill with On light accent text |
| Error/destructive text | Semantic red text on a dark surface |
| Destructive action | Semantic red fill with White text |
| Disabled | Existing opacity cue plus disabled semantics; never colour alone |

- Do not pair White text with Accent primary; its contrast ratio is `2.77:1`.
- Do not use Text faint for normal-sized readable text; it is `4.04:1` on Surface.
- Border is decorative only. Use Text faint or an accent where a control boundary
  must satisfy `3:1` non-text contrast.

## Surface rules

- Body, header, footer, page wrappers, and every major route section use Surface.
- Surface alternate and Surface sunken stay inside bounded cards, menus, controls,
  overlays, media fallbacks, or grouped-content panels.
- A bounded blue-band component may use the exact start/end gradient and Blue band
  text; it must not become a full-width route section or alternate page ground.
- Night stays behind media or overlays and must not alternate with Surface by section.
- Media and existing images retain their authored colours.
- Section separation must not depend on a background-colour change.

## Route migration

| Surface | Required colour treatment |
| --- | --- |
| Shared shell | Surface body, sticky header, and footer; Border dividers; sky-blue navigation states |
| Home | Surface hero and all sections; dark bounded event, scripture, sermon, and visit groupings |
| About | Surface scene copy and section ground; dark bounded information plates; media plates keep images |
| Give | Surface page and major panels; dark scripture/help groupings; sky-blue Give action |
| Watch | Surface live, testimony, and sermon sections; dark bounded testimony, scripture, and media panels |
| Contact | Surface across the two-column page and strip; dark bounded arrival/help groupings |
| Events | Surface timeline and Sunday region; dark bounded event/menu panels; optional bounded blue-band feature |
| Error/not found | Surface shell; sky-blue recovery action; semantic red only for the error state |

## Accessibility

- Normal text meets WCAG AA `4.5:1`; large text meets `3:1`.
- Interactive component boundaries and focus indicators meet `3:1` against adjacent colours.
- Existing 44px target, keyboard, reduced-motion, heading, and landmark contracts stay.
- `/about` and `/watch` run Axe colour-contrast checks without route-specific rule suppression.
- Embedded and remote media keep a dark palette fallback while loading or failing.

### Validated reference pairs

| Foreground / background | Ratio |
| --- | --- |
| Text primary / Surface | `17.78:1` |
| Text body / Surface | `9.49:1` |
| Text muted / Surface | `6.02:1` |
| Accent light / Surface | `11.72:1` |
| On light accent / Accent primary | `6.04:1` |
| White / Semantic red | `4.58:1` |
| Semantic red text / Surface | `7.06:1` |
| Blue band text / Blue band end | `8.57:1` |

## Compatibility and precedence

- [ADR 0003](../../adr/0003-spirit-in-blue-visual-direction.md) is authoritative for
  composition, typography, the exact theme palette, and colour constraints.
- Older feature specs remain authoritative for layout, content, and interaction, but
  their named colours and alternating bands are not authoritative.
- The logo artwork and its embedded colours remain unchanged.

## Verification

| Level | Contract |
| --- | --- |
| CSS unit | Exact primitives and semantic mappings exist; superseded opaque CSS values and light-theme overrides are absent |
| Route unit | Colour-specific assertions use the new tokens and no longer require cobalt, acid, olive, or light bands |
| Browser | Computed body and major-section backgrounds are Surface on every public route at phone, tablet, and desktop widths |
| Browser | Controls, navigation, selection, menus, media fallbacks, error states, and destructive states use their assigned exact values |
| Accessibility | Axe reports no serious or critical violations, including colour contrast, on every public route |
| Visual | Page flow remains continuous and dark; dark card boundaries and text hierarchy remain perceivable without alternating section bands |

## Acceptance criteria

- Every primitive matches [ADR 0003 Theme palette](../../adr/0003-spirit-in-blue-visual-direction.md#theme-palette).
- No opaque UI colour outside the palette remains in `src/app/globals.css`.
- Every major public-route section resolves to Surface.
- No light theme or section-sized light/cobalt/acid/olive background remains.
- Interaction and semantic states match [Interaction states](#interaction-states).
- All requirements in [Accessibility](#accessibility) pass.
- Content, typography, imagery, layout, route structure, and behaviour are unchanged.

## Concerns

| Topic | Required handling |
| --- | --- |
| Existing visual assertions | Update `src/app/globals.test.ts`, route tests, and Playwright colour assertions together with token migration |
| Suppressed contrast checks | Remove `/about` and `/watch` colour-contrast exceptions from `e2e/accessibility.spec.ts` |
| Logo palette | Keep `public/brand/hsg-logo.jpg` unchanged even though its embedded colours are outside the UI palette |
