# Intent: Unified Bethel AG colour scheme
Author: Udeet Gulati
Status: draft

## Problem

- The website alternates strongly between ink, cobalt, acid, and light band backgrounds.
- The section-to-section background changes make the public pages feel visually fragmented.
- The current palette does not use the colours specified by [Bethel AG](https://bethelag.in/).

## Proposed outcome

- Replace the HSG palette with the measured Bethel AG colours listed in Constraints.
- Use the Bethel AG near-black surface family consistently across public routes.
- Use subtle dark surface variants only within components or overlays when separation is required.
- Use the Bethel AG sky blue for interactive accents.
- Use the Bethel AG white and cool-grey values for text and borders.
- Remove large alternating cobalt, acid, olive, and light section bands.
- Preserve clear hierarchy, legible content, and recognizable interactive states without relying on background-colour switching.

## Affected users and systems

- Visitors and members on all public routes.
- Shared colour tokens and global styles in `src/app/globals.css`.
- Page-specific surfaces and components under `src/app/` and `src/components/`.
- Visual assertions that encode the existing palette and section backgrounds.

## Constraints

- Use these colours measured from [Bethel AG](https://bethelag.in/) on 2026-11-10:
  - Backgrounds: night `#000000`, surface `#0c0c0e`, alternate surface `#131316`, and sunken surface `#1a1a1e`.
  - Text: primary `#f4f4f5`, night text `#d4d4d8`, body `#b4b4bc`, muted `#8e8e97`, and faint `#71717a`.
  - Borders: `#27272a`.
  - Accents: primary `#0ea5e9`, strong `#38bdf8`, light and accent text `#7dd3fc`, on-accent `#ffffff`, and on-light-accent `#06202e`.
  - Semantic red: primary `#e81820` and red text `#ff6b70`.
  - Blue band: start `#041a2a`, end `#0b3350`, and text `#bad5e6`.
- Build HSG colour tokens from the listed values; do not approximate or introduce replacement brand colours.
- Keep `#0c0c0e` as the dominant page and section background.
- Reserve the other dark surfaces and blue band values for content grouping, overlays, controls, and interaction states.
- Keep the website dark-only; do not define or retain a light theme.
- Retain semantic red for errors and destructive actions.
- Maintain accessible contrast for text, links, focus indicators, controls, and embedded content.
- Use Bethel AG as the colour source only; do not copy its layout, content, or assets.
- Keep content, route structure, typography, imagery, and functionality unchanged unless a colour treatment requires an accessibility adjustment.

## Open questions

- None.
