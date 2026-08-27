# GlobalExplorer — Design System

**Direction: "The Atlas."** GlobalExplorer is pinned to the earth — every destination
carries its real coordinates, and the whole site is stitched together by a single
dashed route line and compass motif, like an expedition chart rather than a stock
travel template. Dark harbor-teal ink, brass instrument gold, and signal-flag red —
not the cream-and-terracotta or near-black-neon look every other AI-built site defaults to.

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0E2C2A` | Page background (deep harbor-teal navy) |
| `--ink-2` | `#153B37` | Panels, header, footer |
| `--ink-3` | `#1D4B45` | Card borders / hover surfaces on dark |
| `--parchment` | `#F2E9D3` | Card surfaces, chart-paper blocks |
| `--parchment-dim` | `#E7DABF` | Secondary parchment surface |
| `--brass` | `#C69A46` | Primary accent — dividers, eyebrows, icons |
| `--flag-red` | `#C1442E` | CTA buttons, interactive accent, alerts |
| `--mist` | `#A9C4BE` | Secondary text on dark backgrounds |
| `--ink-text` | `#12241F` | Body text on parchment |

Never substitute warm cream (#F4F1EA) + terracotta (#D97757) — that combination is
explicitly avoided in this system.

## Typography

- **Display — Fraunces** (variable serif, optical size "soft"): headlines, department
  numerals, pull quotes. Set large (clamp 2.4rem–5rem), weight 500–600, slight
  negative tracking.
- **Body — Public Sans**: paragraphs, nav, buttons, cards. Weight 400/600.
- **Utility/Data — IBM Plex Mono**: coordinates, prices, dates, form inputs,
  budget-calculator figures. Always uppercase + letter-spaced when used as a label.

Load once via Google Fonts in every page `<head>`:
`Fraunces:opsz,wght@9..144,400..700 | Public+Sans:wght@400;500;600;700 | IBM+Plex+Mono:wght@400;500;600`

## Layout & components

- **Header**: sticky, `--ink-2` background, brass hairline bottom border. Logo mark
  is a small compass rose (SVG, inline). Nav collapses to a hamburger under 860px.
- **Coordinate eyebrow**: every destination page opens its hero with the place's real
  lat/long in Plex Mono, brass color, letter-spaced — e.g. `36.1911° N, 74.4361° E`.
  This is the site's signature — never omit it on a destination page.
- **Dossier card** (`.dossier`): parchment background, 2px brass top rule, corner
  numeral in Fraunces, subtle drop shadow. Used for department cards and highlight
  cards inside pages.
- **Route line**: dashed SVG path (`stroke-dasharray`) connecting pins on the
  homepage hero map; animates in with `stroke-dashoffset` on load, respects
  `prefers-reduced-motion`.
- **Buttons**: `.btn-primary` = flag-red fill, parchment text, 2px offset shadow that
  tightens on hover (no border-radius pill shapes — corners are barely-rounded, 4px,
  to keep the instrument/chart feel). `.btn-ghost` = brass 1px border, transparent.
- **Footer**: `--ink-2`, three columns (About, Departments, Contact), brass hairline
  top border, compass mark repeated small and faded.

## Motion

- Homepage hero route line draws in once on load (1.4s ease).
- Cards lift 4px + shadow deepens on hover/focus.
- All transitions ≤ 220ms except the hero draw-in.
- `prefers-reduced-motion: reduce` disables the draw-in and lift, falls back to
  instant state changes.

## Spacing & grid

- Max content width: 1180px, 24px side gutters (16px under 480px).
- 8px base spacing unit. Section vertical rhythm: 96px desktop / 56px mobile.
- Card grids: `auto-fit, minmax(280px, 1fr)`.

## Accessibility floor

- All interactive elements have a visible 2px brass focus outline.
- Color contrast: parchment-on-ink and ink-text-on-parchment both exceed WCAG AA.
- Every image has descriptive alt text; icons that are decorative get `aria-hidden`.

## Images

Region and destination photos are real, freely-licensed (CC-BY-SA) images
sourced from Wikimedia Commons. They currently load from Commons' live
`Special:FilePath` endpoint, which requires an internet connection to render.

To bundle the photos as local files instead (recommended for offline viewing,
VS Code Live Preview without a proper Live Server, or an air-gapped
deployment), run once from the project root, on a machine with normal
internet access:

```
python3 download_images.py
```

This saves every photo into `assets/img/` and rewrites all HTML pages to
point at the local copies — no dependencies required, standard library only.
`image_manifest.json` holds the source-of-truth list of image keys → source
URLs if you ever want to re-run or extend it.
