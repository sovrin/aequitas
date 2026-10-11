# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Design-minded developers and designers** who choose a framework for its visual coherence and theme it through its attributes and tokens instead of overriding it.
- **Front-end developers building app UIs** such as dashboards, tools, settings and admin screens. They want semantic HTML and one stylesheet, with no build step and no utility-class soup.

Coding agents get first-class reference material (`llms.txt`, the skill, `aequitas-check`), but they serve these two groups and are not an audience of their own.

## Product Purpose

aequitas is a CSS design language. Its parts are one stylesheet (`aequitas.css`, or `aequitas.core.css` without utilities), an optional icon sheet, and an optional ~8 kB ESM behaviour module (`aequitas.js`). You write semantic HTML, add a component class, and pick variants with `data-*` attributes. The docs site (`site/`, Nuxt, prerendered) is how people evaluate and learn it: a page per component and layout with live specimens, anatomy and API, plus foundations, reference pages and four showcases.

Success means someone can build a coherent, accessible interface without tuning a single value by hand.

## Positioning

**One ratio, everything derived.** Space, type, radius, blur, motion, shadow, tint and layout are all powers of φ (`--ae-phi: 1.618034`). Neighbouring frameworks pick their scales one by one, and that is the claim they cannot copy. Its honesty is part of the claim: the README names what is deliberately _off_ the scale (hairlines, focus rings, the 24px pointer floor, breakpoints, colour, glyph geometry). Any new value, component or doc sentence has to either derive from φ or join that list on purpose.

## Operating Context

- People reach for it by linking `aequitas.css` and optionally `aequitas.js`. Fonts (Geist) ship in `dist/fonts/`.
- Theming happens on `<html>` through `data-theme`, `data-accent`, `data-density`, `data-radius` and `data-type`, or through `--ae-hue` and `--ae-neutral-hue`.
- Everything sits in `@layer ae.*`, so a user's unlayered CSS wins without `!important`.
- Evaluating it means reading the docs site: specimens, then showcases (dashboard, settings, landing, kitchen sink).

## Capabilities and Constraints

- Variants are `data-*` attributes and state is ARIA. There are no `.btn-primary` or `.active` classes.
- Component groups: controls, surfaces, content, app, chrome, marketing, layout, utilities, and 377 mask icons (see README).
- `dist/` also ships `tokens.json`, `manifest.json` (every class, `data-*` value and token the CSS styles) and `aequitas-check`, which validates markup against the manifest.
- Status: **pre-release**, v0.1.0, not published to npm, MIT licence.

## Brand Commitments

- The name is always lowercase: **aequitas**.
- The mark is a golden rectangle cut into squares (`.github/banner.svg`). The docs favicon follows the theme.
- The house voice already in the README and docs is short, declarative and plain. It states the rule and why ("Every proportion is a power of it."). It uses British spelling (colour, behaviours).

## Evidence on Hand

- Measured facts: core CSS ~21 kB gzipped, JS ~8 kB gzipped, 377 icons, the φ token table and its stated exceptions.
- The docs site itself, with its live specimens and four showcases (`site/app/pages/showcase/`).
- **There are no adopters, testimonials, logos, benchmarks, download counts or case studies.** Future pages must not invent them. Any social proof on the showcase landing page is demo content and must read as demo content.

## Product Principles

1. **Derive, don't tune.** A value earns its place as a power of φ or as a named, justified exception.
2. **Semantic markup is the API.** Classes name components, attributes choose variants, ARIA carries state.
3. **The user's CSS wins.** Layers, not specificity fights.
4. **State what is true and measurable.** Sizes, counts and exceptions are stated plainly, and nothing is claimed beyond them.
5. **Optional means optional.** The CSS works alone. The JS only does what HTML can't.

## Accessibility & Inclusion

These are commitments the framework already makes, and future work must keep them:

- colour never carries meaning alone (persistent states add a 2px accent edge)
- a 24px minimum pointer target
- `prefers-contrast`, `forced-colors`, `prefers-reduced-motion` and `prefers-reduced-transparency` are handled throughout, and frost falls back to solid surfaces
- RTL is supported
