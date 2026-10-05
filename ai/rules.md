## How to write aequitas markup

1. **Use semantic HTML first, then a component class.** Many components are native elements with no class at all: `<dialog>`, `<progress>`, `<meter>`, `<details>`, `<fieldset>`, `input[type=checkbox]`, `input[type=checkbox][role=switch]`, `input[type=range]`, `<kbd>`, `<mark>`. Others are a class: `.btn`, `.card`, `.input`, `.table`, `.menu`, `.alert`. Some classes go on a wrapper, not the control: `.field` wraps label, control, hint and `[data-error]`; `.select` wraps a `<select class="input">`; `.input-group` wraps an input and its affixes. Always take the structure from the reference demo.
2. **Variants are `data-*` attributes, never modifier classes.** Write `<button class="btn" data-variant="primary">`, not `.btn-primary`. The same vocabulary recurs everywhere:
   - `data-variant`: `primary · ghost` on `.btn`, `solid · outline` on `.badge`, `plain · inline · check` on `ul`/`ol`
   - `data-size`: `s · l` (`.badge` and `.testimonial` take only `l`, `.card` and `.table` only `s`; `.container` and `dialog` add `full`, `.icon` adds `xl`)
   - `data-tone`: `accent · success · warning · danger · info`
   - placement: `data-side` (drawer, shell, with-aside), `data-tip-side` (tooltips) and `data-position` (the `.toasts` region). Don't move one onto another component.
3. **State is ARIA, not classes.** Use `aria-busy="true"` for loading, `aria-pressed` for toggles, `aria-current="page|step|date"` for the current item, `aria-invalid="true"` for errors, `aria-selected` for selection, `aria-sort` on `th`, and `disabled`. Never add `.active`, `.is-loading` or `.disabled`.
   - The components draw every state: hover and press as tone steps (`--ae-fill` → `--ae-fill-hover` → `--ae-fill-active`), "on" as a 2px accent edge. Don't add movement (`scale`, `translate`) or extra colour to controls.
   - Never let colour alone carry meaning: a toned button or badge always has a label, and two states are never told apart by hue only.
4. **Lay out with the primitives before writing CSS.**
   - `.stack` stacks vertically.
   - `.cluster` is a wrapping row.
   - `.split` is two columns at 1 : φ.
   - `.grid` is auto-fit columns (`--min` sets the minimum width).
   - `.container` and `.measure` set max widths.
   - `.section` adds vertical rhythm.
   - `.center` centres content.
   - Set gaps with `.gap-1` … `.gap-8`. `.end` pushes an item to the far end of a cluster.
5. **All spacing is on the φ scale.** Use steps 1–8 (`.p-4`, `.mb-3`, `.gap-5`, `var(--ae-space-4)`). Never use px or arbitrary rem values.
6. **Colour, radius, shadow, blur and type come from tokens.** Use `var(--ae-text)`, `--ae-text-muted`, `--ae-surface`, `--ae-accent`, `--ae-border`, `--ae-radius-m`, `--ae-shadow-m` and so on. For text in a tone, use its ink (`--ae-accent-ink`, `--ae-danger-ink`, `--ae-tone-ink`, …): the tone itself is for fills, edges and rings and is too light to read as text. Never hard-code hex, rgb or oklch values. To retheme, set `--ae-hue` / `--ae-neutral-hue`, or `data-accent` on `<html>`.
7. **Use the global presets on `<html>`:**
   - `data-theme="light|dark"` (omit to follow the OS)
   - `data-accent`, `data-density="compact|spacious"`, `data-radius="soft|round"`, `data-type="serif|humanist|mono"`
8. **Icons are `<i class="icon" data-icon="name"></i>`.** They need `aequitas.icons.css`. Only use names from the icon list; there are no `fa-*` or `bi-*` classes. If you guess a name, the checker suggests the closest real one (`close` → `x`, `settings` → `settings-gear`). Sizes are `data-size="s|l|xl"`. Icon-only buttons are `<button class="btn" data-icon aria-label="…">`.
9. **Overrides go in unlayered CSS.** aequitas lives in `@layer ae.*`, so any unlayered rule wins. Never use `!important`, and never restyle a component that already has the variant you need.
10. **Behaviours are attributes too** (with `aequitas.js`):
    - `[data-open="#id"]` opens a dialog or popover, `[data-close]` closes it, and `dialog[data-light-dismiss]` closes on a backdrop click.
    - `[data-dismiss]` removes the nearest alert, toast or chip (or the ancestor its value selects).
    - `[data-theme-set]` switches the theme.
    - `[role=tablist]` makes tabs work.
    - `[data-copy]` copies a code block.
    - `[data-password]` in an `.input-group` reveals a password; a `.table` with row checkboxes gets select-all and drives a sibling `.selection-bar`.
    - `toast()`, `setTheme()` and `markMatches()` are exported from the module, with `init()`, `bind()` and `enhance()` for driving it yourself.
    - `[data-toast="message"]` shows a toast (`data-toast-title`, `data-toast-tone`). `[data-theme-set]` works on buttons and on radios.
    - `[data-toggle]` on a button with `aria-pressed` flips it; `.number > button[data-step]` steps its input; `input[type=range][data-output="id"]` writes its value into that element; a `.range-pair` of two ranges fills between them and keeps them from crossing.
    - `.combobox` and `dialog.palette` filter and highlight as you type (`dialog.palette[data-manual]` opts out); `.tag-input` turns Enter into chips; `.otp` advances between cells and takes pastes; `.dropzone` gets `data-active` during a drag (`.dropzone[data-page]` during a drag anywhere over the page); `.toc` sets `aria-current` on the link whose section is in view.
    - Don't write JavaScript for these.
11. **Don't invent anything.** If a class, attribute value or token isn't in this reference, it doesn't exist. Compose existing pieces instead.
12. **Verify.** Run `{{check}} <files>` on every file you write, and fix every error before you finish. Pass `--css <file>` for the project's own stylesheet so its classes, and the `data-*` values it styles on them, count as known. If it warns that one of your classes is also an aequitas component, rename yours or use the component.
