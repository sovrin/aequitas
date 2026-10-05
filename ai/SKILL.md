---
name: aequitas
description: Write UI markup with the aequitas CSS framework, a frosted-glass design language proportioned on the golden ratio. Use whenever a page, component, layout or template is built or edited in a project that loads aequitas.css, uses classes like .btn/.card/.stack/.cluster, or data-variant/data-tone attributes; also when styling, theming or debugging aequitas markup.
---

# aequitas

aequitas is plain modern CSS. You write semantic HTML, add a component class, and choose variants with `data-*` attributes. Space, type, radius, blur and motion all step by powers of the golden ratio, so there is nothing to tune by hand. An optional ESM module, `aequitas.js`, wires up behaviours declared through attributes.

{{rules}}

## Workflow

1. **Find the pieces.** Pick components and layouts from the index below. Then read the matching section of `references/components.md` or `references/layouts.md` (search for `## <Title>`). Each section has the attribute table and working markup.
2. **Copy the reference markup, then adapt it.** The demos are the canonical structure: the child elements, which element gets the class, and which attribute goes where. Keep that structure.
3. **Compose the layout** with `.stack`, `.cluster`, `.split`, `.grid` and the gap utilities before writing any CSS. If you need custom CSS, use `var(--ae-*)` tokens only (`references/tokens.md`).
4. **Check the markup:** `{{check}} <files>`, where `<skill-dir>` is this skill's base directory. It reports:
   - unknown classes, with a translation when the class comes from Bootstrap or Tailwind
   - `data-*` values aequitas does not style
   - attributes on elements they don't apply to
   - unknown tokens
   - icons without a name

   Fix everything and run it again until it is clean.

## References

- `references/components.md`: every component, with its attributes and markup
- `references/layouts.md`: page shells, page patterns and application layouts
- `references/utilities.md`: utility classes and their breakpoint/container variants
- `references/tokens.md`: every `--ae-*` custom property
- `references/icons.md`: every icon name
- `references/behaviours.md`: the `aequitas.js` attributes and API
- `references/translations.md`: Bootstrap/Tailwind habits → aequitas

## Index

{{index}}
