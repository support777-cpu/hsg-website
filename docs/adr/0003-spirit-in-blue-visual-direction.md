# 0003 Spirit in Blue composition and colour theme

- Status: proposed.
- Date: 2026-11-10.
- Amended: 2026-11-11.
- Decision owner: Udeet Gulati.

## Context and authority

- The user selected Spirit in Blue from three complete HTML landing-page concepts.
- The user required the church name as the title and a logo-only header.
- Visual reference: [selected HTML](../features/home-landing-page/design-reference/02-spirit-in-blue.html).
- Typography values: selected option in [tokens.json](../features/home-landing-page/design-reference/tokens.json).
- Content and interaction scope: [Home intent](../features/home-landing-page/intent.md), [Home UX](../features/home-landing-page/ux.md), and [ADR 0002](0002-public-navigation-and-recovery.md).
- Colour scope: [Unified Bethel AG colour scheme intent](../improvements/unified-bethel-ag-colour-scheme/intent.md). The theme palette below supersedes that intent’s uninterrupted Surface page ground.
- Home uses the church name as the main heading, Oswald and DM Sans, the Spirit in Blue composition, and the colour theme below.
- A pastor-name heading, Fraunces as the only typeface, the logo navy/blue/gold palette for UI, and a single reading column are outside this decision.

## Decisions

| Area | Selected treatment |
| --- | --- |
| Identity | Holy Spirit Generation is the main heading; leaders are named in the introduction. |
| Header | Existing HSG logo without adjacent brand text; retain an accessible Home link name. |
| Colour | Exact palette in [Theme palette](#theme-palette). The page ground is the Frost gradient. Header and footer are Night. Major sections are transparent. |
| Contrast | Dark-only; typography, spacing, borders, media, and bounded dark surfaces separate sections. |
| Typography | Oswald for uppercase display headings; DM Sans for body text, navigation, and supporting copy. |
| Hero | Large church-name heading beside a reserved portrait field; stack on narrow screens. |
| Highlights | Three announcement rows separated by fine rules; unpublished entries remain text. |
| Testimonies | Unequal desktop columns; readable stacked stories on mobile. |
| Sermons | Bounded dark channel feature beside a plain playlist list; only supplied URLs are linked. |
| Sunday services | Introductory block beside two service records; names, languages, and times remain associated. |
| Shape and depth | Flat rectangular surfaces, thin separators, and generous section spacing. |
| Responsive layout | Inline Menu disclosure and single-column content at narrow widths; all sections remain visible. |
| Motion | Static content; no entrance effects or autoplay. |

## Theme palette

| Role | Exact value | Use |
| --- | --- | --- |
| Night | `#000000` | Header, footer, and media backplates |
| Surface | `#0c0c0e` | Body colour behind the page gradient |
| Surface alternate | `#131316` | Bounded cards and grouped content |
| Surface sunken | `#1a1a1e` | Popovers, menus, inset controls, and nested panels |
| Frost start | `#000428` | Left stop of the page gradient |
| Frost end | `#004e92` | Right stop of the page gradient |
| Text primary | `#f4f4f5` | Primary copy |
| Text night | `#d4d4d8` | Supporting copy with stronger emphasis |
| Text body | `#b4b4bc` | Body and descriptive copy |
| Text muted | `#8e8e97` | Metadata and secondary copy |
| Text faint | `#71717a` | Large text, control boundaries, and decorative detail |
| Border | `#27272a` | Decorative dividers and card boundaries |
| Accent primary | `#0ea5e9` | Links, filled actions, and current navigation |
| Accent deep | `#0284c7` | Link hover |
| Accent strong | `#38bdf8` | Filled-control hover and focus |
| Accent light | `#7dd3fc` | Headings |
| White | `#ffffff` | Image-overlay icons and text on semantic red |
| On light accent | `#06202e` | Text and icons on sky-blue fills |
| Semantic red | `#e81820` | Error and destructive fills or boundaries |
| Semantic red text | `#ff6b70` | Error and destructive text on dark surfaces |
| Blue band start | `#041a2a` | Start of bounded blue-band components |
| Blue band end | `#0b3350` | End of bounded blue-band components |
| Blue band text | `#bad5e6` | Text within a blue-band component |

- Use no opaque UI colour outside this palette.
- Keep the website dark-only.
- Paint the page `linear-gradient(to right, Frost start, Frost end)`, fixed to the viewport.
- Keep major sections transparent so the Frost gradient stays the page ground.
- Paint the header and footer Night.
- Limit alternate and sunken surfaces to bounded components and overlays.
- Limit the blue band to bounded components, as a 160° gradient from Blue band start to Blue band end. Do not use it as a page section ground.
- Reserve semantic red for errors and destructive actions.
- Pair sky-blue fills with On light accent, not White.
- Keep Text faint out of normal-sized readable text.
- Meet WCAG AA text and non-text contrast requirements.

## Alternatives

| Alternative | Outcome |
| --- | --- |
| Midnight Journal | Not selected; retained in the reference folder. |
| Earth & Light | Not selected; retained in the reference folder. |

## Implementation boundaries

- Preserve the selected HTML as a composition reference, not the production route implementation or colour source.
- Implement shared navigation against ADR 0002; prototype query-string shells are demonstration behavior.
- Preserve missing-content states; placeholder portraits and unpublished entries are not approved final content.
- Use the church logo from `public/brand/hsg-logo.png`.
- Keep the gold and globe artwork. Its colours sit outside this palette.
- Keep the field outside the mark transparent so the header Night shows through.
- Reuse the local preview fonts or equivalent production font loading for the selected families.
- Retain keyboard focus, semantic headings, accessible navigation, and readable contrast during implementation.
- Desktop and mobile preview screenshots document the selected composition; production verification remains required.
