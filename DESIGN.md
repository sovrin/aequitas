---
name: aequitas
description: A CSS design language proportioned on the golden ratio, with frosted glass where things float and flat tints where you click.
colors:
  instrument-blue: "oklch(0.55 0.2 255)"
  instrument-blue-night: "oklch(0.72 0.15 255)"
  instrument-blue-ink: "oklch(0.45 0.15 255)"
  cool-paper: "oklch(0.975 0.003 255)"
  cool-paper-sunken: "oklch(0.96 0.005 255)"
  sheet-white: "oklch(1 0 0)"
  graphite-ink: "oklch(0.21 0.02 255)"
  pencil-grey: "oklch(0.48 0.02 255)"
  night-glass: "oklch(0.14 0.008 255)"
  night-glass-sunken: "oklch(0.115 0.006 255)"
  night-sheet: "oklch(0.26 0.01 255)"
  moon-ink: "oklch(0.96 0.005 255)"
  moon-grey: "oklch(0.72 0.015 255)"
  tint-rest: "color-mix(in oklch, oklch(0.21 0.02 255) 7%, transparent)"
  tint-hover: "color-mix(in oklch, oklch(0.21 0.02 255) 11.3%, transparent)"
  tint-press: "color-mix(in oklch, oklch(0.21 0.02 255) 18.3%, transparent)"
  control-edge: "color-mix(in oklch, oklch(0.21 0.02 255) 52%, transparent)"
  success: "oklch(0.52 0.15 150)"
  warning: "oklch(0.55 0.14 65)"
  danger: "oklch(0.56 0.21 25)"
  info: "oklch(0.54 0.14 235)"
typography:
  display:
    fontFamily: "ui-sans-serif, -apple-system, 'SF Pro Text', system-ui, 'Geist Variable', 'Segoe UI', sans-serif"
    fontSize: "4.236rem"
    fontWeight: 420
    lineHeight: 1.062
    letterSpacing: "-0.042em"
  headline:
    fontFamily: "ui-sans-serif, -apple-system, 'SF Pro Text', system-ui, 'Geist Variable', 'Segoe UI', sans-serif"
    fontSize: "2.618rem"
    fontWeight: 480
    lineHeight: 1.128
    letterSpacing: "-0.03em"
  title:
    fontFamily: "ui-sans-serif, -apple-system, 'SF Pro Text', system-ui, 'Geist Variable', 'Segoe UI', sans-serif"
    fontSize: "1.618rem"
    fontWeight: 520
    lineHeight: 1.128
    letterSpacing: "-0.022em"
  body:
    fontFamily: "ui-sans-serif, -apple-system, 'SF Pro Text', system-ui, 'Geist Variable', 'Segoe UI', sans-serif"
    fontSize: "clamp(0.95rem, 0.92rem + 0.15vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.618
    fontFeature: "'calt', 'ss01', 'cv11'"
  label:
    fontFamily: "ui-sans-serif, -apple-system, 'SF Pro Text', system-ui, 'Geist Variable', 'Segoe UI', sans-serif"
    fontSize: "0.786rem"
    fontWeight: 500
    lineHeight: 1.618
  eyebrow:
    fontFamily: "ui-sans-serif, -apple-system, 'SF Pro Text', system-ui, 'Geist Variable', 'Segoe UI', sans-serif"
    fontSize: "0.618rem"
    fontWeight: 540
    letterSpacing: "0.12em"
  mono:
    fontFamily: "ui-monospace, 'SF Mono', 'Geist Mono Variable', Menlo, Consolas, monospace"
    fontSize: "0.786rem"
rounded:
  square: "0px"
  soft: "12px"
  round: "20px"
  pill: "999px"
spacing:
  space-0: "2px"
  space-1: "4px"
  space-2: "6px"
  space-3: "10px"
  space-4: "16px"
  space-5: "26px"
  space-6: "42px"
  space-7: "68px"
  space-8: "110px"
components:
  button:
    backgroundColor: "{colors.tint-rest}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.square}"
    padding: "0 16px"
    height: "42px"
  button-hover:
    backgroundColor: "{colors.tint-hover}"
  button-active:
    backgroundColor: "{colors.tint-press}"
  button-primary:
    backgroundColor: "{colors.instrument-blue}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.square}"
    padding: "0 16px"
    height: "42px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.instrument-blue-ink}"
    rounded: "{rounded.square}"
    padding: "0 16px"
    height: "42px"
  input:
    backgroundColor: "{colors.tint-rest}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.square}"
    padding: "0 16px"
    height: "42px"
  chip:
    backgroundColor: "{colors.tint-rest}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.label}"
    padding: "0 10px"
    height: "33px"
  card:
    backgroundColor: "{colors.sheet-white}"
    rounded: "{rounded.square}"
    padding: "26px"
---

# Design System: aequitas

## Overview

**Creative North Star: "The Golden Instrument"**

aequitas is a precision tool. Every measure is read off one scale and none is set by eye: space, type, radius, blur, motion, shadow and tint are all powers of φ (1.618034). Where a value can't be on the scale, it is a deliberate, named exception: hairlines, the 1.5px stroke, the 2px state edge, focus rings, the 24px pointer floor, breakpoints, colour and glyph geometry. The instrument is calm because nothing in it is arbitrary. Its confidence comes from the measurements, not from decoration.

There are two materials and they never trade places. **Glass** belongs to things that float: cards on the canvas, navigation, menus, popovers, dialogs, toasts and docks. They are frosted over a soft aurora that gives the blur something to catch. **Tint** belongs to things you touch: buttons, inputs and chips are flat, translucent fills of the text colour. They answer the pointer by stepping down a φ ladder of tint, never by moving. Surfaces separate by tone and shadow, never by outline. Corners are square by default.

Density is medium and the type is quiet. Large type gets lighter and tighter, not heavier, so size carries the weight. The accent is a single user-set hue, Instrument Blue by default, spent on the primary action, focus and "this one is on". Ten presets and two custom-property knobs (`--ae-hue`, `--ae-neutral-hue`) retune the entire instrument without breaking a proportion.

**Key Characteristics:**

- One ratio, everything derived. Exceptions are named, never accidental.
- Glass where it floats, flat tint where you click.
- Square by default; the φ curve returns only through the `soft` and `round` presets.
- No outlines on surfaces. Depth comes from frost, shadow and a single specular top edge.
- Controls step down a tint ladder (7%, 7·φ, 7·φ²) and never move.
- OKLCH throughout, light and dark resolved with `light-dark()`.

## Colors

The palette is cool, near-neutral paper with one decisive accent hue. Neutrals carry a whisper of that hue (chroma 0.003–0.02), so the canvas always belongs to the accent.

### Primary

- **Instrument Blue** ({colors.instrument-blue}; {colors.instrument-blue-night} in dark): the single accent. It fills the primary button, focus rings, the 2px "on" edge, range fills and the aurora's lead field. It is the only saturated colour on a screen at rest.
- **Instrument Blue Ink** ({colors.instrument-blue-ink}): the accent when it has to be read as text, such as ghost buttons, links and pressed labels. It is derived from the accent and clamped to 4.5:1 on every surface and on its own tints.

### Neutral

- **Cool Paper** ({colors.cool-paper}): the light canvas (`--ae-bg`). **Cool Paper, Sunken** ({colors.cool-paper-sunken}) is used for wells and code.
- **Sheet White** ({colors.sheet-white}): the solid surface beneath frost (`--ae-surface`). Frost shows it at 66% (thin) or 88% (thick) over the blur.
- **Graphite Ink** ({colors.graphite-ink}): body text. It is also the base of every control tint.
- **Pencil Grey** ({colors.pencil-grey}): muted text, lead paragraphs, eyebrows and captions.
- **Night Glass** ({colors.night-glass}), **Night Glass, Sunken** ({colors.night-glass-sunken}), **Night Sheet** ({colors.night-sheet}), **Moon Ink** ({colors.moon-ink}) and **Moon Grey** ({colors.moon-grey}): the dark-scheme counterparts of canvas, well, surface, text and muted text.
- **Control Edge** ({colors.control-edge}): the 3:1 boundary that only _findable controls_ get (an empty field's bottom rule, a track, an off switch). Surfaces never get one.

### Tones

- **Success** ({colors.success}), **Warning** ({colors.warning}), **Danger** ({colors.danger}) and **Info** ({colors.info}) each carry a `-contrast` and an `-ink` sibling. Components read the active `--ae-tone*` triple, and `data-tone` swaps it.

### Named Rules

**The One Hue Rule.** The accent is a single hue, `--ae-hue`, and the neutrals lean toward `--ae-neutral-hue`. Never hard-code a second brand colour. Retune the knobs instead.

**The Ink Rule.** A tone used as text uses its `-ink` token. The raw tone is for fills, edges and rings only.

**The Aurora Rule.** Frost needs something to blur. `<html data-aurora>` gives the page canvas three soft radial fields derived from the accent (lead hue, +55°, −60°). Glass over a flat colour is just a grey box, so pages built on glass should turn it on. The aurora is still unless `data-aurora="drift"` asks it to move. `--ae-aurora-seed` places the fields: each turns about the page centre by a multiple of the golden angle, so a seed is a layout, not a random draw.

## Typography

**Display, Body and Label Font:** the platform UI sans first (SF Pro on Apple), then Geist Variable (shipped in `dist/fonts/`), then Segoe UI and other system sans fonts.
**Mono Font:** ui-monospace and SF Mono, then Geist Mono Variable.

**Character:** a single system sans tuned with `ss01` and `cv11`, so it reads as native on any OS. Hierarchy comes from size and tracking, not from heavy weight. The presets swap the family wholesale (`serif`, `humanist`, `mono`).

### Hierarchy

The scale steps by √φ (1.272) from a fluid base, `--ae-text-base`. Sizes below are at a 1rem base.

- **Display** (420, 4.236rem, line-height 1.062, −0.042em): the `.display` hero line. It is the lightest and tightest text in the system.
- **Headline** (h1 at 460 and 4.236rem, −0.038em; h2 at 480 and 2.618rem, −0.03em; line-height 1.128): page and section titles.
- **Title** (520; h3 at 2.058rem, h4 at 1.618rem; −0.022em): component and card headings. h5 is 1.272rem at 560, and h6 is 0.786rem at 560 in Pencil Grey.
- **Body** (400, fluid 0.95–1.0625rem, line-height φ = 1.618): running text, wrapped `pretty`, measure `40ch · φ` ≈ 65ch.
- **Label** (500, 0.786rem): field labels, buttons at `data-size="s"`, chips.
- **Eyebrow** (540, 0.618rem, +0.12em, uppercase, Pencil Grey): small capitals tracked open, set like a label.
- **Lead** (1.272rem, Pencil Grey): the intro paragraph under a display line.

### Named Rules

**The Lighter-When-Larger Rule.** Weight falls as size rises (h4 520 → h2 480 → h1 460 → display 420), and tracking tightens with it. Never bold a headline to make it louder. Step it up the scale.

**The Leading Rule.** Body leading is φ itself, headings use φ^¼ (1.128) and display uses φ^⅛ (1.062). No other line-heights.

## Layout

Space is a nine-step φ scale (`--ae-space-0…8`), `--ae-unit · φⁿ` for n = −4…4, snapped to whole pixels: 2, 4, 6, 10, 16, 26, 42, 68 and 110px at the default 1rem unit. `data-density` rescales the unit by φ^∓½ (0.786rem compact, 1.272rem spacious) and every step follows, on `<html>` or any subtree.

- **Container:** φ⁹ rem ≈ 76rem. **Measure:** 40ch · φ ≈ 65ch. **Gutter:** space-5.
- **Proportional splits:** `.split` and `.panes` divide 1 : φ, `.golden` divides φ : 1, and `--ae-ratio` is φ as an aspect ratio.
- **Composition primitives:** `.stack`, `.cluster`, `.grid`, `.switcher`, `.cover`, `.with-aside`, `.bento` and `.masonry`. Compose with these and the gap utilities before writing CSS.
- **Breakpoints** (the named exception, since media queries can't read tokens): `s` < 48rem, `m` ≥ 48rem, `l` ≥ 64rem, `xl` ≥ 80rem. Components prefer container queries (`cq-*:` variants, cards are size containers).
- **Control heights:** every control that sits in a row (buttons, fields, selects, steppers, segments, groups) takes its height from `--ae-control-size`: φ² units (42px), with `-s` (33px) and `-l` (53px) a φ^½ step either side, as the text sizes step, and its type from `--ae-control-text`. `data-size="s|l"` steps both together. Inline padding is the height ÷ φ². A row is level by construction; the kitchen sink's control-heights specimen shows it.
- **Row heights come from the same ladder.** Menu, option, nav, tree and menubar rows, chips, pagination squares and calendar days are the small size; tabs are the default; avatars take all three. A table row is one size taller than the controls it holds (default table: large rows; small table: default rows). The FAB is space-7, one φ step above the large size. Only content rows (lists, accordions, cards) still grow from their padding. The toolbar is the one half-step: small buttons in space-1 padding make 41px, since the ladder's 9px gap between s and m can't centre on whole pixels.

**The No-Hand-Tuned-Space Rule.** Every gap, padding and margin is a `--ae-space-*` step, a φ multiple of one, or a φ² division of `--ae-control-size` (a control's inline padding: 13, 16 or 20px). Any other 12px or 20px gap is a bug.

## Elevation & Depth

Depth is a hybrid of **frost and shadow**, and a stroke is never part of it. Floating layers are a translucent surface over `backdrop-filter: blur(φ rem) saturate(1.8)`. Bars, menus and toasts take a thicker fill (88–90% opacity) so text over scrolling content stays legible; the navbar and dialogs also take the deeper φ² rem blur. A frosted layer inside another in-flow one keeps its tint but not its blur; a list's sticky group header is the exception, since it blurs the rows scrolling under it. Every floating layer is lit by one specular inset highlight on its top edge, where light hits glass. Frost falls back to a solid Sheet White surface without `backdrop-filter`, under `prefers-reduced-transparency`, and in forced colours.

### Shadow Vocabulary

Each shadow has three layers: contact, key and ambient. The key and ambient offsets sit on the space scale, and each blur is two steps (φ²) above its offset. Alpha is low in light and much deeper in dark.

- **Shadow S** (`--ae-shadow-s`): resting chips of elevation such as tooltips and small popovers.
- **Shadow M** (`--ae-shadow-m`): the default for cards on the canvas.
- **Shadow L** (`--ae-shadow-l`): hover on interactive cards, plus dialogs, menus and toasts.

### Named Rules

**The No-Outline Rule.** Surfaces separate by tone and shadow, never by border. `border: 0` is the frost default. The only drawn lines are hairline separators inside a component and the control edge on findable controls.

**The Glass-Only-Floats Rule.** Frost is for layers that float above content. Controls are never glass. The single exception is the range thumb, the one part of a control that floats.

## Shapes

Square by default: `--ae-radius-m` is 0, so every derived radius (s = m/φ, l = m·φ, xl = m·φ²) is also 0, and "pill" is square too. The `soft` (φ^-½ ≈ 0.786rem) and `round` (φ^½ ≈ 1.272rem) presets bring the φ curve back to every component, with `corner-shape: round` and true pills at 999px. Shape changes glide, because the radius is a registered `<length>`. A layer whose rows or bars run to its edges takes a tighter corner than a card, so the curve never cuts into them: lists and windows take radius-m (their bars' content also starts at least that far in), and the command palette, with its taller header, takes radius-l. The brand mark repeats the geometry: a golden rectangle cut into squares. The busy indicator is three pulsing squares sized φ⁻² with φ⁻³ gaps, never a spinning circle.

**The Squares-Throughout Rule.** At default settings nothing is rounded: not buttons, avatars, chips or the busy indicator. Never hard-code a radius. Read `--ae-radius-*` so the presets keep working.

## Components

Controls are **quiet tints that never move**. Each is a flat, translucent fill of the text colour that steps down the tint ladder (rest 7%, hover 7·φ, press 7·φ²) with no lift, scale or outline. Persistent "on" states add a 2px accent edge, so colour never carries meaning alone. The edge sits along the bottom for horizontal sets and on the inline-start side for vertical sets, and it flips under RTL.

### Buttons

- **Shape:** square (radius-full, 0 by default); block size `--ae-control-size` (42px; `data-size` steps it and the type to the s or l size, never under the 24px target); inline padding is that height ÷ φ².
- **Default:** tinted. A 7% Graphite Ink fill with weight 500 and line-height 1.
- **Primary:** a solid Instrument Blue fill with contrast text. Hover and press mix the text colour in by the tint steps.
- **Ghost:** transparent with Instrument Blue Ink text. It takes an accent tint on hover.
- **Pressed (`aria-pressed`):** an accent tint, ink text, and a 2px bottom edge in the tone.
- **Busy (`aria-busy`):** the label goes transparent and three squares pulse in its place.
- **Focus:** a 2px canvas gap, then a 2px accent ring (`--ae-ring`).
- **Groups:** hairline separators, with corners only on the outer ends.

### Chips

- **Style:** a 7% tint fill with label type (0.786rem, 500) and space-1 × space-3 padding. The dismiss button is √φ em square.
- **State:** a chip wrapping an input acts as a filter toggle and takes the same accent tint and edge when checked.

### Cards / Containers

- **Corner style:** radius-l (0 by default).
- **Background:** thin frost over the aurora. `data-solid` drops it to Sheet White.
- **Shadow strategy:** Shadow M plus the specular top edge. `data-interactive` rises to Shadow L on hover, through shadow only.
- **Border:** none.
- **Internal padding:** space-5 (space-4 at `data-size="s"`), with space-3 rhythm between children. A leading image bleeds to the edges. Cards are inline-size containers.

### Inputs / Fields

- **Style:** a 7% tint fill with no border, square, and a 1px Control Edge rule along the bottom so an empty field can be found.
- **Focus:** inside out. An inset 1.5px accent stroke plus a 4px accent halo at 28%.
- **Error:** an inset 1.5px danger stroke, shown only once `:user-invalid` applies. Error text uses Danger Ink and replaces the hint.
- **Labels:** 0.786rem at weight 500 above the field, with space-2 between.

### Navigation

- **Navbar, sidebar, tabbar and dock** are thick-frost floating bars. Active items take the accent tint and the 2px edge (bottom for horizontal bars, inline-start for vertical ones). Sticky bars reserve scroll padding, so keyboard focus is never hidden underneath them.

### Busy squares (signature)

Busy squares are a vector mask of three φ-proportioned squares pulsing on a φ³ × 220ms beat. Button, card, list and table all reuse them through `aria-busy`, and they become static under reduced motion.

## Do's and Don'ts

### Do:

- **Do** derive every new value from φ through the existing tokens (`--ae-space-*`, `--ae-text-*`, `--ae-radius-*`, `--ae-duration-*`), or add it to the named exceptions on purpose.
- **Do** answer the pointer with tone: step `--ae-tint-rest` → `--ae-tint-hover` → `--ae-tint-press`.
- **Do** mark persistent "on" states with the 2px `--ae-edge` in the tone, and never with colour alone.
- **Do** put frost only on floating layers, and give them the specular top edge.
- **Do** use `-ink` tokens for coloured text, and keep 4.5:1 for text and 3:1 for control boundaries.
- **Do** read `--ae-radius-*`, so the `soft` and `round` presets keep working.
- **Do** keep motion on `--ae-ease` (cubic-bezier(0.2, 0, 0, 1)) and `--ae-ease-spring`. Spring settles with no overshoot. Durations are 220ms, ÷φ or ×φ, with a φ⁻³ stagger.

### Don't:

- **Don't** draw borders or outlines around surfaces. Separate them by tone and shadow.
- **Don't** move controls on hover or press (no translate, no scale, no lift).
- **Don't** hard-code px or rem gaps, radii or font sizes off the φ scale.
- **Don't** make controls glass, or put frost over a flat canvas with no aurora behind it.
- **Don't** bold large type. Larger text is lighter and tighter.
- **Don't** introduce a second accent hue, or hard-code colour where a `--ae-*` token exists.
- **Don't** use rounded spinners or bouncing easing. Busy states are squares, and motion decelerates without overshoot.
