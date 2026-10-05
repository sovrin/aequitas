import type { Entry } from "./types";

export const inputs: Entry[] = [
  {
    slug: "field",
    title: "Field",
    group: "Inputs",
    lede: "A label, a control and a hint stacked as one. The error message waits until the field has been touched.",
    owns: [".field", "label"],
    anatomy: [
      [
        ".field",
        "Column wrapper with a small gap. Add `data-inline` to put the label beside the control.",
      ],
      ["> label", "Small, medium-weight caption. Point its `for` at the control's `id`."],
      ["> .input", "The control: an `.input`, a `.select`, an `.input-group` or any other input."],
      ["> small", "Optional hint in muted text. Hidden while the error shows."],
      [
        "> [data-error]",
        "Optional error message in the danger colour. Hidden until the control is invalid.",
      ],
    ],
    demos: [
      {
        title: "Field",
        html: `<div class="field">
  <label for="in1" data-required>Project name</label>
  <input class="input" id="in1" placeholder="Northlight" required aria-describedby="in1-hint in1-error" />
  <small id="in1-hint">Used in URLs and exports.</small>
  <span data-error id="in1-error">Enter a name.</span>
</div>`,
      },
      {
        title: "Inline field",
        html: `<div class="field" data-inline>
  <label for="in2">Email</label>
  <input class="input" id="in2" type="email" placeholder="ada@northlight.app" aria-describedby="in2-hint" />
  <small id="in2-hint">We'll send the invite here.</small>
</div>`,
      },
    ],
    attrs: [
      [
        "data-error",
        'On a child of `.field`: the error message. Shown once the control matches `:user-invalid` or carries `aria-invalid="true"`, and then it replaces the `<small>` hint.',
      ],
      [
        "label[data-required]",
        "Appends a danger-coloured asterisk. Pair it with `required` on the control; the marker alone validates nothing.",
      ],
      [
        ".field[data-inline]",
        "Two columns: the label (at least 8rem) beside the control, with hint and error under the control.",
      ],
      [
        "aria-invalid=true",
        "On the control: shows the error message straight away, without waiting for the user. Use it for errors from the server.",
      ],
      [
        "required",
        "On the control: native validation. The browser reports `:user-invalid` only after the user has edited or left the control, so an untouched form shows no errors.",
      ],
    ],
    a11y: [
      "Connect the label with `for` and `id`; the field's layout expects the label and the control as siblings. A placeholder is not a label.",
      "The hint and error are not linked to the control by the CSS. Give them ids and list them in the control's `aria-describedby` so they are read with it.",
      "The asterisk is generated content and may not be read. `required` on the control is what announces the field as required.",
      'Errors revealed by `:user-invalid` appear silently. For errors that arrive after submit, set `aria-invalid="true"` and move focus to the first invalid field.',
    ],
    related: ["input", "textarea", "form-layouts", "checkbox"],
    keywords: "form group label hint help text error validation required",
  },
  {
    slug: "input",
    title: "Input",
    group: "Inputs",
    lede: "Filled, with a hairline along the bottom so an empty field can be found; the ring comes on focus. Validation appears only after you leave a field.",
    owns: [".input"],
    anatomy: [
      [
        "input.input",
        "Any text-like `<input>`, a `<textarea>`, or the `<select>` inside `.select`. Fills the inline size of its container.",
      ],
    ],
    demos: [
      {
        title: "States",
        note: "Edit the email and leave the field: :user-invalid draws the danger ring.",
        html: `<div class="stack gap-3">
  <input class="input" placeholder="Default" aria-label="Default" />
  <input class="input" type="email" value="ada@" aria-label="Email" required />
  <input class="input" value="Disabled" aria-label="Disabled" disabled />
</div>`,
      },
      {
        title: "Sizes",
        html: `<div class="stack gap-3">
  <input class="input" data-size="s" placeholder="Small" aria-label="Small" />
  <input class="input" placeholder="Default" aria-label="Default" />
  <input class="input" data-size="l" placeholder="Large" aria-label="Large" />
</div>`,
      },
      {
        title: "Server-side error",
        note: "aria-invalid draws the same ring as :user-invalid, for errors the browser can't detect.",
        html: `<div class="field" style="max-inline-size: 20rem">
  <label for="in-taken">Project name</label>
  <input class="input" id="in-taken" value="atlas" aria-invalid="true" aria-describedby="in-taken-error" />
  <span data-error id="in-taken-error">That name is taken. Try another.</span>
</div>`,
      },
    ],
    attrs: [
      [
        "data-size",
        "Smaller or larger padding and type, matching the button sizes. Default sits between.",
      ],
      [
        "required",
        "With `required` or any other constraint (`type=email`, `pattern`, `min`), an invalid value draws an inset danger ring once the user has edited or left the control (`:user-invalid`).",
      ],
      ["disabled", "Halves the opacity."],
      [
        "aria-invalid=true",
        "Draws the danger ring, and inside a `.field` reveals the `[data-error]` message. Use it for errors the browser cannot detect, such as a name already taken.",
      ],
      ["placeholder=<text>", "Muted hint text inside the empty control."],
    ],
    keys: [
      ["Tab", "Moves focus in; the accent ring appears on keyboard focus only (`:focus-visible`)."],
    ],
    a11y: [
      "Every input needs a label: a `<label for>` (see Field) or, where there is no visible label, an `aria-label`.",
      "The danger ring is colour only. Pair it with an error message in the field so the problem is stated in words.",
      "In forced-colours mode the fill disappears, so the input gets a 1px system-colour border to keep its shape.",
    ],
    related: ["field", "input-group", "textarea", "search"],
    keywords: "text field textbox form-control",
  },
  {
    slug: "textarea",
    title: "Textarea",
    group: "Inputs",
    lede: "A multi-line input that grows with what you type, starting at three lines.",
    owns: ["textarea"],
    anatomy: [
      [
        "textarea.input",
        "Same fill, focus ring and invalid ring as `.input`. Every `<textarea>` gets `field-sizing: content` and a minimum of three lines from the reset.",
      ],
    ],
    demos: [
      {
        title: "Textarea",
        note: "field-sizing: content — grows with what you type.",
        html: `<div class="field">
  <label for="ta">Description</label>
  <textarea class="input" id="ta" placeholder="Grows as you type"></textarea>
</div>`,
      },
    ],
    attrs: [
      [
        "required",
        "As on `.input`: once the user has left it empty, `:user-invalid` draws the danger ring.",
      ],
      ["disabled", "Halves the opacity."],
    ],
    keys: [
      ["Enter", "Inserts a line break; it does not submit the form."],
      ["Tab", "Leaves the textarea; it does not insert a tab character."],
    ],
    a11y: [
      "Label it like any input, with `<label for>` or `aria-label`.",
      "Because it grows with its content, set a `max-block-size` when the text can get long, or the page reflows on every line.",
    ],
    related: ["input", "field", "composer"],
    keywords: "multiline text area autosize auto-grow",
  },
  {
    slug: "input-group",
    title: "Input group",
    group: "Inputs",
    lede: "Prefix and suffix cells around an input, sharing one focus ring.",
    owns: [".input-group"],
    anatomy: [
      [".input-group", "Filled row. Draws the focus ring when anything inside has focus."],
      ["> .input", "The control. Takes the remaining width and drops its own fill and ring."],
      [
        "> span",
        "Any other child is a prefix or suffix cell: small, muted, centred, never wrapping. Text, an icon or a `<kbd>`.",
      ],
    ],
    demos: [
      {
        title: "Input group",
        html: `<div class="input-group">
  <span>https://</span>
  <input class="input" placeholder="northlight" aria-label="Subdomain" />
  <span>.app</span>
</div>`,
      },
      {
        title: "With icon",
        html: `<div class="input-group" style="max-inline-size: 20rem">
  <span><i class="icon" data-icon="search"></i></span>
  <input class="input" type="search" placeholder="Search…" aria-label="Search" />
  <span><kbd>⌘K</kbd></span>
</div>`,
      },
    ],
    a11y: [
      "The prefix and suffix are not part of the input's name. Label the input itself, and reference a meaningful affix (a unit, a domain) with `aria-describedby`.",
      "Icon cells are decorative; the search icon does not replace a label.",
    ],
    related: ["input", "search", "button"],
    keywords: "addon prefix suffix adornment affix",
  },
  {
    slug: "password",
    title: "Password",
    group: "Inputs",
    lede: "A password input with a reveal button: one tap shows what you typed, another hides it again.",
    owns: [".input-group", "[data-password]"],
    anatomy: [
      [".input-group", "Holds the input and the button and draws one focus ring around both."],
      [
        "> input.input[type=password]",
        'The password itself. Give it `autocomplete="current-password"` or `"new-password"`.',
      ],
      [
        "> button.btn[data-password]",
        'The reveal toggle: `data-icon`, `aria-pressed="false"` and an `aria-label`. Transparent, muted until hover, with no pressed edge.',
      ],
      [
        "> button > i.icon × 2",
        "Two icons: the first shows while hidden, the second while revealed (`eye`, `eye-off`).",
      ],
    ],
    demos: [
      {
        title: "Password",
        html: `<div class="field" style="max-inline-size: 20rem">
  <label for="pw1">Password</label>
  <div class="input-group">
    <input class="input" id="pw1" type="password" value="northlight" autocomplete="current-password" />
    <button class="btn" type="button" data-icon data-password aria-pressed="false" aria-label="Show password"><i class="icon" data-icon="eye"></i><i class="icon" data-icon="eye-off"></i></button>
  </div>
</div>`,
      },
      {
        title: "New password",
        html: `<div class="field" style="max-inline-size: 20rem">
  <label for="pw2" data-required>New password</label>
  <div class="input-group">
    <input class="input" id="pw2" type="password" minlength="12" required autocomplete="new-password" aria-describedby="pw2-hint pw2-error" />
    <button class="btn" type="button" data-icon data-password aria-pressed="false" aria-label="Show password"><i class="icon" data-icon="eye"></i><i class="icon" data-icon="eye-off"></i></button>
  </div>
  <small id="pw2-hint">At least 12 characters.</small>
  <span data-error id="pw2-error">Use 12 characters or more.</span>
</div>`,
      },
    ],
    attrs: [
      [
        "data-password",
        "On the button: aequitas.js toggles the input in the same group between `password` and `text`.",
      ],
      [
        "aria-pressed=true|false",
        "Revealed or not. aequitas.js sets it; the CSS swaps the two icons on it.",
      ],
      [
        "autocomplete=current-password|new-password",
        "Tells password managers whether to fill or to suggest.",
      ],
    ],
    js: 'A click on `[data-password]` switches the first `<input>` in the button\'s parent between `type="password"` and `type="text"` and sets `aria-pressed` to match. Without it the button does nothing, and the input stays a normal password field.',
    keys: [["Enter / Space", "On the button: reveals or hides the password."]],
    a11y: [
      'Keep the `aria-label` fixed ("Show password"); `aria-pressed` announces whether it is on. Changing both would say the same thing twice.',
      'Use `type="button"` so the toggle never submits the form.',
      "The browser's own reveal button (Edge) is hidden inside the group so there is only one.",
    ],
    related: ["input", "input-group", "field"],
    keywords: "password reveal show hide eye toggle login",
  },
  {
    slug: "select",
    title: "Select",
    group: "Inputs",
    lede: "The native select with a masked chevron. For search-as-you-type, use the combobox.",
    owns: [".select"],
    anatomy: [
      [
        ".select",
        "Wrapper that draws the chevron at the end. Required: a `<select>` cannot draw it itself.",
      ],
      [
        "> select.input",
        "The native select, with its own arrow removed and room left for the chevron.",
      ],
    ],
    demos: [
      {
        title: "Select",
        html: `<div class="field" style="max-inline-size: 20rem">
  <label for="sel1">Region</label>
  <div class="select">
    <select class="input" id="sel1">
      <option>Europe West</option>
      <option>US East</option>
      <option>Asia Pacific</option>
    </select>
  </div>
</div>`,
      },
    ],
    attrs: [["disabled", "On the `<select>`: halves the opacity, as on `.input`."]],
    keys: [
      ["Space / Alt ↓", "Opens the native list."],
      [
        "↑ / ↓",
        "Moves through the options. Native behaviour; whether the list opens first depends on the platform.",
      ],
    ],
    a11y: [
      "It is a native `<select>`, so role, value and keyboard come from the browser. Label it with `<label for>`.",
      "The chevron ignores the pointer, so a click on it reaches the select underneath.",
    ],
    related: ["combobox", "input", "field"],
    keywords: "dropdown picker option native",
  },
  {
    slug: "combobox",
    title: "Combobox",
    group: "Inputs",
    lede: "An input whose option list anchors beneath it with CSS anchor positioning. Filters as you type.",
    owns: [".combobox", ".combobox-list"],
    anatomy: [
      [".combobox", "Wrapper. Makes its `.input` the anchor for the list."],
      [
        "> input.input",
        'The text field, with `role="combobox"`, `aria-expanded` and `aria-controls` pointing at the list.',
      ],
      [
        "> .combobox-list",
        'Frosted listbox, `popover="manual"`. Anchors below the input at its width and flips above when there is no room.',
      ],
      [
        "> [role=option]",
        "One row per option: an avatar or icon, the label, and an optional `<small>` pushed to the end.",
      ],
    ],
    demos: [
      {
        title: "Combobox",
        html: `<div class="field" style="max-inline-size: 22rem">
  <label for="cb1">Assignee</label>
  <div class="combobox">
    <input class="input" id="cb1" role="combobox" aria-expanded="false" aria-controls="cbl1" placeholder="Search people…" autocomplete="off" />
    <div class="combobox-list" role="listbox" id="cbl1" popover="manual">
      <div role="option" aria-selected="true"><span class="avatar" data-size="s" aria-hidden="true">AL</span> Ada Lovelace <small class="text-muted">Owner</small></div>
      <div role="option"><span class="avatar" data-size="s" data-tone="success" aria-hidden="true">MK</span> Mika Kim <small class="text-muted">Editor</small></div>
      <div role="option"><span class="avatar" data-size="s" data-tone="warning" aria-hidden="true">JR</span> Jun Rao <small class="text-muted">Viewer</small></div>
    </div>
  </div>
</div>`,
      },
    ],
    attrs: [
      [
        "aria-selected=true",
        "On an option: the highlighted row, with a fill and an accent edge at the start. aequitas.js moves it with the arrow keys.",
      ],
      [
        "aria-expanded=true|false",
        "On the input: whether the list is open. aequitas.js keeps it in sync.",
      ],
      ["aria-controls=<id>", "On the input: the id of the `.combobox-list`."],
      [
        "popover=manual",
        "On the list. Required: the list is a popover, hidden until `showPopover()`.",
      ],
      [
        "data-value=<text>",
        "On an option: the value written into the input when it is picked. Default `textContent`.",
      ],
    ],
    js: "aequitas.js opens the list on focus and as you type, hides options whose text does not contain the input's value and highlights the first match; ↑/↓ move the highlight, and Enter or a click writes the option's `data-value` (or its text) into the input and fires `change`. Esc and blur close the list and `aria-expanded` follows. Without it, the list is a plain popover: open, filter and pick are up to you.",
    keys: [
      [
        "↓ / ↑",
        "Opens the list and moves the highlight through the visible options, wrapping at the ends.",
      ],
      ["Enter", "Picks the highlighted option and closes the list."],
      ["Esc", "Closes the list."],
    ],
    a11y: [
      'Label the input with `<label for>`, and give the list `role="listbox"` with `role="option"` rows. aequitas.js gives the input `role="combobox"`, `aria-expanded`, `aria-autocomplete` and `aria-controls` (and the list an `id` if it has none); write them yourself without it.',
      "Focus stays in the input; aequitas.js points `aria-activedescendant` at the highlighted option (giving it an `id` if it has none), so screen readers announce it as it moves.",
      'Set `autocomplete="off"` so the browser\'s own suggestions do not cover the list.',
    ],
    related: ["select", "tag-input", "palette", "menu"],
    keywords: "autocomplete typeahead autosuggest listbox",
  },
  {
    slug: "search",
    title: "Search",
    group: "Inputs",
    lede: "The native search input, with the browser's clear button redrawn as a small muted cross.",
    owns: ["input[type=search]"],
    anatomy: [
      [
        "input.input[type=search]",
        "An `.input` of type search. In WebKit and Blink its cancel button is replaced by a masked cross in the muted text colour.",
      ],
    ],
    demos: [
      {
        title: "Search",
        html: `<div class="field" style="max-inline-size: 20rem">
  <label for="s1">Search</label>
  <input class="input" id="s1" type="search" value="aurora" />
</div>`,
      },
    ],
    keys: [
      ["Esc", "Clears the field in most browsers (native)."],
      ["Enter", "Submits the surrounding form, if any."],
    ],
    a11y: [
      'Label it, or give it an `aria-label` when only an icon says what it searches. For a site search, wrap it in `<search>` or `role="search"`.',
      "The clear button is the browser's own control, restyled; it is not keyboard-focusable, so Esc is the keyboard route.",
    ],
    related: ["input-group", "input", "palette"],
    keywords: "search field clear cancel button",
  },
  {
    slug: "date-time",
    title: "Date and time",
    group: "Inputs",
    lede: "Native date and time pickers on the input fill, with the picker icon dimmed until hover and inverted on dark themes.",
    owns: ["input[type=date]", "input[type=time]"],
    anatomy: [
      [
        "input.input[type=date]",
        "An `.input` of type date, time or datetime-local (month and week too). The browser draws the segments and the picker.",
      ],
      [
        "::-webkit-calendar-picker-indicator",
        "The picker icon in WebKit and Blink: 60% opacity, full on hover, inverted on dark themes so it stays visible.",
      ],
    ],
    demos: [
      {
        title: "Date and time",
        html: `<div class="cluster">
  <div class="field"><label for="d1">Due</label><input class="input" id="d1" type="date" value="2026-10-14" /></div>
  <div class="field"><label for="t1">At</label><input class="input" id="t1" type="time" value="09:41" /></div>
  <div class="field"><label for="dt1">Starts</label><input class="input" id="dt1" type="datetime-local" value="2026-10-14T09:41" /></div>
</div>`,
      },
    ],
    attrs: [
      [
        "min=<value>",
        "Native: the earliest date or time the picker offers. A typed value outside it is `:user-invalid` and gets the danger ring.",
      ],
      ["max=<value>", "Native: the latest date or time."],
      [
        "required",
        "As on `.input`: an empty value is `:user-invalid` once the user has left the field.",
      ],
    ],
    keys: [
      ["← / →", "Moves between the day, month and year segments (native)."],
      ["↑ / ↓", "Changes the focused segment (native)."],
    ],
    a11y: [
      "The browser announces the segments and the picker; the input still needs its own label.",
      "For a date picker that is always visible, use the calendar.",
    ],
    related: ["calendar", "input", "field"],
    keywords: "date picker time picker datetime calendar",
  },
  {
    slug: "colour",
    title: "Colour picker",
    group: "Inputs",
    lede: "The native colour input cut down to a square of input fill, with the swatch inset by one step.",
    owns: ["input[type=color]"],
    anatomy: [
      [
        "input.input[type=color]",
        "A square, `--ae-space-6` on each side, with the swatch inset by `--ae-space-1`. A click opens the system colour picker.",
      ],
    ],
    demos: [
      {
        title: "Colour picker",
        html: `<div class="field">
  <label for="c1">Tint</label>
  <input class="input" id="c1" type="color" value="#3b6ee6" />
</div>`,
      },
    ],
    attrs: [["value=<hex>", "Native: the chosen colour as `#rrggbb`. Default `#000000`."]],
    keys: [["Enter / Space", "Opens the system colour picker (native)."]],
    a11y: [
      "The swatch shows the colour, not its name. Label the input, and show the value as text beside it when the exact colour matters.",
      "For a fixed set of colours, a swatch picker is quicker and announces each choice by name.",
    ],
    related: ["swatch-group", "swatches", "input"],
    keywords: "color picker colour input hex",
  },
  {
    slug: "number",
    title: "Number stepper",
    group: "Inputs",
    lede: "A number input between decrement and increment buttons, sharing one focus ring.",
    owns: [".number"],
    anatomy: [
      [".number", "Filled inline row. Draws the focus ring when anything inside has focus."],
      ["> button", "Decrement before, increment after. Square, muted until hover."],
      [
        "> input[type=number]",
        "Four characters wide, centred, tabular figures, native spinners hidden.",
      ],
    ],
    demos: [
      {
        title: "Stepper",
        html: `<div class="number">
  <button type="button" aria-label="Decrease" data-step="-1">−</button>
  <input type="number" value="3" min="1" aria-label="Seats" />
  <button type="button" aria-label="Increase" data-step="1">+</button>
</div>`,
      },
    ],
    attrs: [
      [
        "data-step=<n>",
        "On a button: a negative value steps down, a positive one up. The amount comes from the input's `step`, not from this value.",
      ],
      ["min=<n>", "Native, on the input: the stepper stops here."],
      ["max=<n>", "Native, on the input: the stepper stops here."],
      [
        "step=<n>",
        "Native, on the input: the amount each button press or arrow key changes the value. Default `1`.",
      ],
    ],
    js: "A click on `.number > button[data-step]` calls `stepDown()` or `stepUp()` on the input, by the sign of `data-step`, and dispatches an `input` event. Without aequitas.js the buttons do nothing, but the input still takes typing and the arrow keys.",
    keys: [["↑ / ↓", "In the input: steps the value up or down (native)."]],
    a11y: [
      "The buttons are icon-only: give each an `aria-label`. The input needs one too when there is no visible label.",
      'Use `type="button"` on the buttons, or they submit the surrounding form.',
    ],
    related: ["range", "input"],
    keywords: "stepper spinner quantity counter increment decrement",
  },
  {
    slug: "tag-input",
    title: "Tag input",
    group: "Inputs",
    lede: "Chips inside an input-like container. Enter adds, Backspace removes the last.",
    owns: [".tag-input"],
    anatomy: [
      [".tag-input", "Filled, wrapping row. Draws the focus ring when the input inside has focus."],
      ["> .chip", 'One chip per tag, each with a remove `<button data-dismiss=".chip">`.'],
      ["> input", "The typing field, last. Takes the remaining width, at least 8 characters."],
    ],
    demos: [
      {
        title: "Tag input",
        html: `<div class="tag-input">
  <span class="chip">design <button data-dismiss=".chip" aria-label="Remove design">×</button></span>
  <span class="chip">q4 <button data-dismiss=".chip" aria-label="Remove q4">×</button></span>
  <input placeholder="Add label…" aria-label="Add label" />
</div>`,
      },
    ],
    attrs: [
      [
        "data-dismiss=.chip",
        "On a chip's button: aequitas.js removes the closest `.chip` on click.",
      ],
    ],
    js: "Enter in the input turns its text into a chip, with a labelled remove button, placed before the input; Backspace in the empty input removes the chip before it; a chip's remove button removes it and moves focus to the next chip or the input; a click on the container's empty space focuses the input. The chips are markup only, not form values: read them from the DOM or mirror them into a hidden input. Without aequitas.js the chips render but adding and removing is up to you.",
    keys: [
      ["Enter", "Adds the typed text as a chip."],
      ["Backspace", "In the empty input: removes the last chip."],
    ],
    a11y: [
      "The input has no visible label inside the box: give it an `aria-label`, or label the whole field with a `<label for>` outside.",
      'Each remove button needs an `aria-label` that names its tag ("Remove design"); aequitas.js does this for the chips it creates.',
      "Removing a chip with its button removes the focused element; aequitas.js moves focus to the next chip's button, or to the input after the last chip.",
    ],
    related: ["chip", "combobox"],
    keywords: "tags chips token input multi-value labels",
  },
  {
    slug: "otp",
    title: "One-time code",
    group: "Inputs",
    lede: "Single-character cells that auto-advance, step back on Backspace and accept a pasted code.",
    owns: [".otp"],
    anatomy: [
      [".otp", "Inline row of cells."],
      [
        "> input",
        'One per character, with `maxlength="1"` and `placeholder=" "`. A filled, valid cell takes an accent tint.',
      ],
      ["> hr", "Optional separator between groups of cells. Skipped by the focus movement."],
    ],
    demos: [
      {
        title: "OTP",
        html: `<div class="otp" role="group" aria-label="Verification code">
  <input inputmode="numeric" pattern="\\d" maxlength="1" placeholder=" " autocomplete="one-time-code" aria-label="Digit 1" />
  <input inputmode="numeric" pattern="\\d" maxlength="1" placeholder=" " aria-label="Digit 2" />
  <input inputmode="numeric" pattern="\\d" maxlength="1" placeholder=" " aria-label="Digit 3" />
  <hr />
  <input inputmode="numeric" pattern="\\d" maxlength="1" placeholder=" " aria-label="Digit 4" />
  <input inputmode="numeric" pattern="\\d" maxlength="1" placeholder=" " aria-label="Digit 5" />
  <input inputmode="numeric" pattern="\\d" maxlength="1" placeholder=" " aria-label="Digit 6" />
</div>`,
      },
    ],
    attrs: [
      [
        'placeholder=" "',
        "Required for the filled tint: a cell tints once its placeholder is no longer shown and its value is valid.",
      ],
      ["pattern=<regex>", "Native: a cell whose character does not match stays untinted."],
      ["maxlength=1", "Native: one character per cell."],
      ["inputmode=numeric", "Native: brings up the number pad on touch keyboards."],
    ],
    js: "Typing a character moves focus to the next cell, skipping the `<hr>`; Backspace in an empty cell moves back. A paste keeps only the digits, spreads them across the cells from the first, and focuses the last one filled. Without aequitas.js the cells are independent inputs.",
    keys: [
      ["Backspace", "In an empty cell: moves focus to the previous cell."],
      ["Ctrl V / ⌘ V", "Pastes the code across all cells."],
    ],
    a11y: [
      'Label each cell ("Digit 1") and wrap the row in an element with `role="group"` and an `aria-label` that names the code.',
      'Add `autocomplete="one-time-code"` to the first cell so the browser can offer a code from SMS.',
      "The paste handler drops everything but digits, so it only suits numeric codes.",
    ],
    related: ["input", "field"],
    keywords: "otp pin code verification 2fa one-time password",
  },
  {
    slug: "file-input",
    title: "File input",
    group: "Inputs",
    lede: "The native file input in the input fill, with its browse button drawn as a flat tinted button.",
    owns: ["input[type=file]"],
    anatomy: [
      [
        "input.input[type=file]",
        "Smaller padding and type than a text input, muted file name, pointer cursor.",
      ],
      [
        "::file-selector-button",
        "The browser's browse button, restyled: one step darker fill, full radius, darker again on hover.",
      ],
    ],
    demos: [
      {
        title: "File input",
        html: `<div class="field" style="max-inline-size: 24rem">
  <label for="file1">Attachment</label>
  <input class="input" id="file1" type="file" />
  <small>PDF or PNG, up to 10 MB.</small>
</div>`,
      },
      {
        title: "Multiple and disabled",
        html: `<div class="stack gap-3" style="max-inline-size: 24rem">
  <input class="input" type="file" multiple accept="image/*" aria-label="Photos" />
  <input class="input" type="file" disabled aria-label="Attachment (disabled)" />
</div>`,
      },
    ],
    attrs: [
      [
        "accept=<types>",
        "File types to offer in the picker, e.g. `image/*` or `.pdf,.png`. A hint, not validation.",
      ],
      ["multiple", "Lets the user pick several files; the input then shows a count."],
      ["disabled", "Halves the opacity, as on every `.input`."],
      ["required", "As on `.input`: once left empty, `:user-invalid` draws the danger ring."],
    ],
    keys: [["Enter / Space", "Opens the file picker."]],
    a11y: [
      "Label it like any input. The browse button's text comes from the browser and is in the user's language; don't try to replace it.",
      "For a large drop target, use the dropzone. It wraps the same input, so keyboard and screen-reader behaviour stay native.",
    ],
    related: ["dropzone", "input", "field"],
    keywords: "file upload browse attach input type=file",
  },
  {
    slug: "dropzone",
    title: "Dropzone",
    group: "Inputs",
    lede: "A file target. The dashed outline is the one dashed line in the system, because a target needs one.",
    owns: [".dropzone"],
    anatomy: [
      [
        "label.dropzone",
        "The target: a `<label>`, so a click anywhere opens the file picker. Centred, muted text.",
      ],
      ["> input[type=file]", "Covers the whole zone, invisible. Takes the drop and the click."],
      ["strong", "The main line, in full text colour. The rest of the text stays muted."],
    ],
    demos: [
      {
        title: "Dropzone",
        html: `<label class="dropzone">
  <input type="file" multiple />
  <strong>Drop files here</strong>
  or click to browse · up to 25 MB
</label>`,
      },
    ],
    attrs: [
      [
        "data-active",
        "The hover look: accent tint and accent outline. aequitas.js sets it while files are dragged over the zone and removes it on leave or drop.",
      ],
      ["multiple", "Native, on the input: accept more than one file."],
      ["accept=<types>", "Native, on the input: limits the picker to these file types."],
    ],
    js: "While files are dragged over the zone, aequitas.js sets `data-active`, and removes it when they leave the zone or are dropped. Without it the zone still takes the drop and the click, but doesn't light up during a drag.",
    keys: [["Enter / Space", "On the focused file input: opens the file picker (native)."]],
    a11y: [
      "The label's text is the file input's accessible name, so write it as an instruction.",
      "The input is invisible but focusable; keyboard focus lights the zone through `:has(:focus-visible)`.",
      'The browser\'s own file name display is hidden. List the chosen files yourself, in an element with `aria-live="polite"`.',
    ],
    related: ["input", "field", "progress"],
    keywords: "file upload drop drag and drop attachment",
  },
  {
    slug: "form-layouts",
    title: "Form layouts",
    group: "Inputs",
    lede: "Fields that flow into columns, fieldsets that group them, and a sticky action bar for long forms.",
    owns: [".form-grid", ".action-bar", "fieldset"],
    anatomy: [
      [
        ".form-grid",
        "Auto-fit grid: as many columns as fit at a 14rem minimum, one column on narrow screens.",
      ],
      ["> .field", "Fields flow into the columns in source order."],
      ["> [data-span=full]", "Takes the whole row: a wide field, or the buttons."],
      ["fieldset", "Groups related controls in a column with a gap. No border, no padding."],
      ["> legend", "The group's caption: small and medium-weight, like a field label."],
      [
        ".action-bar",
        "Frosted bar, sticky at the bottom of its scroll container, with a hairline above. Buttons sit at the end.",
      ],
    ],
    demos: [
      {
        title: "Form grid",
        html: `<form class="form-grid">
  <div class="field"><label for="fg-first">First name</label><input class="input" id="fg-first" /></div>
  <div class="field"><label for="fg-last">Last name</label><input class="input" id="fg-last" /></div>
  <div class="field" data-span="full"><label for="fg-email">Email</label><input class="input" id="fg-email" type="email" /></div>
  <div class="cluster" data-span="full"><button class="btn" data-variant="primary" type="button">Save</button><button class="btn" data-variant="ghost" type="reset">Reset</button></div>
</form>`,
      },
      {
        title: "Fieldset",
        html: `<fieldset>
  <legend>Visibility</legend>
  <label><input type="radio" name="vis" checked /> Private</label>
  <label><input type="radio" name="vis" /> Team</label>
  <label><input type="radio" name="vis" /> Public</label>
</fieldset>`,
      },
      {
        title: "Action bar",
        preview: true,
        html: `<div class="preview" style="min-block-size: 7rem; display: grid; align-content: end"><div class="action-bar"><button class="btn" data-variant="ghost">Discard</button><button class="btn" data-variant="primary">Save changes</button></div></div>`,
      },
    ],
    attrs: [
      ["data-span=full", "On a child of `.form-grid`: spans every column."],
      ["disabled", "On a `<fieldset>`: native; disables every control inside it."],
    ],
    a11y: [
      "Group radio buttons and related checkboxes in a `<fieldset>` with a `<legend>`: the legend is announced as the group's name.",
      "The grid reorders nothing; tab order follows the source, so write the fields in reading order.",
      "Put the action bar after the fields in the source so it is reached last, as it is seen. It is hidden when printing.",
    ],
    related: ["field", "settings", "grid"],
    keywords: "form grid columns fieldset legend sticky footer save bar",
  },
];
