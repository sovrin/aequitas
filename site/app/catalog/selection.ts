import type { Entry } from "./types";

const days = (() => {
  let h = "";
  for (const w of ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]) h += `<span>${w}</span>`;
  for (const d of [28, 29, 30])
    h += `<button data-outside aria-label="${d} September 2026">${d}</button>`;
  for (let d = 1; d <= 31; d++) {
    const a = d === 2 ? ' aria-current="date"' : "";
    const r = d >= 12 && d <= 16 ? " data-range" : "";
    const end = d === 12 || d === 16;
    const s = end ? ' aria-pressed="true"' : "";
    const l = ` aria-label="${d} October 2026${end ? ", selected" : ""}${r ? ", in range" : ""}"`;
    h += `<button${a}${r}${s}${l}>${d}</button>`;
  }
  return h + `<button data-outside aria-label="1 November 2026">1</button>`;
})();

export const selection: Entry[] = [
  {
    slug: "checkbox",
    title: "Checkbox",
    group: "Selection",
    lede: "A square box that fills with the accent and draws a tick when checked. No class needed.",
    owns: ["input[type=checkbox]"],
    anatomy: [
      [
        "label",
        "Optional but recommended. A label whose direct child is a checkbox lines box and text up in a row, with a gap and a pointer cursor.",
      ],
      [
        "> input[type=checkbox]",
        "The native checkbox, no class. Box and tick snap to even pixels so the tick stays centred.",
      ],
    ],
    demos: [
      {
        title: "Checkbox",
        html: `<div class="cluster">
  <label><input type="checkbox" checked /> Notify team</label>
  <label><input type="checkbox" /> Email me a copy</label>
</div>`,
      },
      {
        title: "Group",
        html: `<fieldset>
  <legend>Notify me about</legend>
  <label><input type="checkbox" checked /> Comments</label>
  <label><input type="checkbox" checked /> Mentions</label>
  <label><input type="checkbox" /> Weekly digest</label>
</fieldset>`,
      },
    ],
    attrs: [["checked", "Fills the box with the accent and springs the tick in."]],
    keys: [
      ["Space", "Toggles the focused checkbox."],
      ["Tab / Shift Tab", "Moves between checkboxes; each is its own tab stop."],
    ],
    a11y: [
      "Wrap the input in its `<label>` (or point a `<label for>` at it) so the text is its name and a click on the text toggles it.",
      "Group related checkboxes in a `<fieldset>` with a `<legend>`; the legend is read before each option.",
      "A disabled box dims and its label turns muted; still say in the text why it can't be changed. `indeterminate` (set from script) draws a bar instead of the tick and is announced as mixed.",
      "Focus shows the shared ring around the box.",
    ],
    related: ["radio", "switch", "choice-card", "chip"],
    keywords: "check box tick",
  },
  {
    slug: "radio",
    title: "Radio",
    group: "Selection",
    lede: "Square, with a centred square dot. It rounds only under the soft and round radius presets.",
    owns: ["input[type=radio]"],
    anatomy: [
      ["fieldset", "Groups the options; the `<legend>` names the group."],
      [
        "> label",
        "One per option. A label whose direct child is a radio lines dot and text up in a row.",
      ],
      [
        "label > input[type=radio]",
        "The native radio, no class. All radios in a group share a `name`.",
      ],
    ],
    demos: [
      {
        title: "Radio",
        html: `<div class="cluster">
  <label><input type="radio" name="r1" checked /> Weekly</label>
  <label><input type="radio" name="r1" /> Monthly</label>
</div>`,
      },
      {
        title: "Radio group",
        html: `<fieldset>
  <legend>Delivery</legend>
  <label><input type="radio" name="ship" checked /> Standard · 3–5 days</label>
  <label><input type="radio" name="ship" /> Express · next day</label>
  <label><input type="radio" name="ship" /> Collect in store</label>
</fieldset>`,
      },
    ],
    attrs: [
      ["checked", "Fills the box with the accent and springs the dot in. One per group."],
      [
        "name=<text>",
        "Radios with the same name form one group: checking one unchecks the others.",
      ],
    ],
    keys: [
      ["↑ / ↓ / ← / →", "Moves to the previous or next radio in the group and checks it."],
      ["Space", "Checks the focused radio when none in the group is checked."],
      ["Tab", "Enters the group at the checked radio, and leaves it; the group is one tab stop."],
    ],
    a11y: [
      'Put a group in a `<fieldset>` with a `<legend>`, or give its container `role="radiogroup"` and an `aria-label`.',
      "With none checked, Tab lands on the first radio and the arrow keys check as they move, so check a sensible default when there is one.",
      "A disabled radio dims and its label turns muted. Say why the option is unavailable, or leave it out.",
    ],
    related: ["checkbox", "segmented", "choice-card", "form-layouts"],
    keywords: "radio button option group",
  },
  {
    slug: "switch",
    title: "Switch",
    group: "Selection",
    lede: 'A checkbox with role="switch", drawn as a φ : 1 track whose thumb slides across.',
    owns: ["input[role=switch]"],
    anatomy: [
      ["label", "Optional but recommended. Lines track and text up in a row, as for a checkbox."],
      [
        "> input[type=checkbox][role=switch]",
        'The native checkbox with `role="switch"`, no class. The track is φ : 1; the thumb is its `::after`.',
      ],
    ],
    demos: [
      {
        title: "Switch",
        html: `<div class="cluster">
  <label><input type="checkbox" role="switch" checked /> Public</label>
  <label><input type="checkbox" role="switch" /> Allow comments</label>
</div>`,
      },
    ],
    attrs: [
      [
        "role=switch",
        "Required. Swaps the checkbox box for the track and thumb, and makes screen readers announce on and off.",
      ],
      ["checked", "Fills the track with the accent and slides the thumb to the end."],
    ],
    keys: [["Space", "Toggles the switch."]],
    a11y: [
      'Name the setting, not the action: "Public", not "Make public". The switch announces on or off itself.',
      "Use a switch for a setting that applies at once; for a choice that is submitted with a form, use a checkbox.",
      "A disabled switch dims and its label turns muted. In right-to-left pages the thumb travels the other way.",
    ],
    related: ["checkbox", "settings"],
    keywords: "toggle on off",
  },
  {
    slug: "segmented",
    title: "Segmented control",
    group: "Selection",
    lede: "Radio inputs in a tinted track; the chosen segment lifts onto a surface.",
    owns: [".segmented"],
    anatomy: [
      [".segmented", 'The tinted track. Give it `role="radiogroup"` and an `aria-label`.'],
      ["> label", "One per segment."],
      ["label > input[type=radio]", "Covers the segment, invisible. All inputs share a `name`."],
      [
        "label > span",
        "The segment text. With anchor positioning, one shared surface slides under the checked segment; without it, the checked span gets the surface.",
      ],
    ],
    demos: [
      {
        title: "Segmented",
        html: `<div class="segmented" role="radiogroup" aria-label="Range">
  <label><input type="radio" name="seg" /><span>Day</span></label>
  <label><input type="radio" name="seg" checked /><span>Week</span></label>
  <label><input type="radio" name="seg" /><span>Month</span></label>
</div>`,
      },
    ],
    attrs: [
      [
        "checked",
        "On one input: the segment that starts selected. With none checked, no surface is drawn.",
      ],
    ],
    keys: [
      ["← / →", "Moves the selection to the previous or next segment."],
      ["Tab", "Enters the control at the checked segment; the control is one tab stop."],
    ],
    a11y: [
      'It is a native radio group, so screen readers announce "Week, radio button, 2 of 3" without extra markup.',
      '`role="radiogroup"` with an `aria-label` names the group; the radios already group by `name`.',
      "Focus draws the ring on the segment's span, not on the hidden input.",
      "The slide is turned off under reduced motion.",
    ],
    related: ["radio", "tabs", "button-group"],
    keywords: "pill toggle group",
  },
  {
    slug: "range",
    title: "Range",
    group: "Selection",
    lede: "A thin tinted track with a square of frosted glass for a thumb; the fill follows --value, which aequitas.js keeps in sync.",
    owns: ["input[type=range]"],
    anatomy: [
      [
        "input[type=range]",
        "The native range, no class. The track fills with the tone up to `--value`; the thumb is a square of glass tinted in the tone, so the fill shows through it and reaches exactly as far into it as the value. It takes a deeper tint under the pointer and a deeper shadow while held.",
      ],
      [
        "[id]",
        "Optional output element anywhere on the page, referenced by `data-output`. Shows the current value.",
      ],
    ],
    demos: [
      {
        title: "Range",
        html: `<div class="field">
  <label for="rg">Opacity · <span id="rgv">62</span>%</label>
  <input type="range" id="rg" value="62" data-output="rgv" />
</div>`,
      },
      {
        title: "Tone",
        html: `<div class="field">
  <label for="rg2">Volume</label>
  <input type="range" id="rg2" value="80" data-tone="success" />
</div>`,
      },
    ],
    attrs: [
      [
        "--value=<percent>",
        "How far the track is filled. Default `0%`. aequitas.js sets it from `value`, `min` and `max`.",
      ],
      ["data-output=<id>", "Id of an element whose text aequitas.js keeps equal to the value."],
      ["data-tone=accent|success|warning|danger|info", "Colours the fill. Default accent."],
      ["min=<n>", "Native lower bound; the fill is measured from it. Default `0`."],
      ["max=<n>", "Native upper bound. Default `100`."],
    ],
    js: "On load and on every `input` event, aequitas.js sets `--value` from the range's `value`, `min` and `max`, and writes the value into the `data-output` element. Without it the thumb moves but the fill stays at whatever `--value` you set.",
    keys: [
      ["← / ↓", "Decreases by one `step`."],
      ["→ / ↑", "Increases by one `step`."],
      ["Home / End", "Jumps to `min` or `max`."],
      ["PageUp / PageDown", "Moves in larger steps."],
    ],
    a11y: [
      "Label it with `<label for>`; the slider announces its own value.",
      "The demo's output sits inside the `<label>`, so it also becomes part of the name. That is fine for a short number; move it out of the label for anything longer.",
      'Add `aria-valuetext` when the number needs a unit to make sense ("62 percent").',
      "Focus draws the ring on the thumb.",
      "The value reads from where the tone fill ends against the track (3:1 or more); the glass thumb itself is deliberately quiet against the page.",
    ],
    related: ["number", "progress", "meter"],
    keywords: "slider",
  },
  {
    slug: "choice-card",
    title: "Choice card",
    group: "Selection",
    lede: "A selectable card around a radio or checkbox. Selection is the one state that earns a ring.",
    owns: [".choice"],
    anatomy: [
      ["label.choice", "The card: a filled row that is the label for its input."],
      ["> input[type=radio]", "A radio or checkbox, drawn as usual at the start of the card."],
      ["> span", "The text column."],
      ["span > b", "The option's title."],
      ["span > small", "Optional detail line, muted."],
    ],
    demos: [
      {
        title: "Plans",
        html: `<div class="stack gap-2" style="max-inline-size: 24rem">
  <label class="choice"><input type="radio" name="plan" /><span><b>Starter</b><small>Free · 1 project</small></span></label>
  <label class="choice"><input type="radio" name="plan" checked /><span><b>Pro</b><small>€12 / month · unlimited</small></span></label>
  <label class="choice"><input type="radio" name="plan" /><span><b>Team</b><small>€48 / month · SSO, audit log</small></span></label>
</div>`,
      },
    ],
    attrs: [
      ["checked", "On the input: tints the card with the accent and draws a 1.5px accent ring."],
    ],
    keys: [
      ["↑ / ↓ / ← / →", "With radios: moves the selection between cards."],
      ["Space", "With checkboxes: toggles the focused card."],
    ],
    a11y: [
      "The whole card is the label, so its name is the title plus the detail line. Keep the detail short.",
      'Group the cards in a `<fieldset>` with a `<legend>` (or `role="radiogroup"` with an `aria-label`) so the question is read with the options.',
      "Keyboard focus replaces the selection ring with the focus ring while the card has focus.",
    ],
    related: ["radio", "checkbox", "pricing"],
    keywords: "option card plan picker",
  },
  {
    slug: "rating",
    title: "Rating",
    group: "Selection",
    lede: "Five squares, not stars. Pure CSS fill via :has(), with a hover preview.",
    owns: [".rating"],
    anatomy: [
      ["fieldset.rating", "The row. Name it with `aria-label` or a `<legend>`."],
      ["> label", "One square per value, in ascending order."],
      [
        "label > input[type=radio]",
        "Covers the square, invisible. All share a `name`; `value` is the score.",
      ],
      ["label > span.sr-only", "The number, as the radio's accessible name."],
    ],
    demos: [
      {
        title: "Rating",
        html: `<fieldset class="rating" aria-label="Rating">
  <label><input type="radio" name="rate" value="1" /><span class="sr-only">1</span></label>
  <label><input type="radio" name="rate" value="2" /><span class="sr-only">2</span></label>
  <label><input type="radio" name="rate" value="3" checked /><span class="sr-only">3</span></label>
  <label><input type="radio" name="rate" value="4" /><span class="sr-only">4</span></label>
  <label><input type="radio" name="rate" value="5" /><span class="sr-only">5</span></label>
</fieldset>`,
      },
    ],
    attrs: [
      [
        "checked",
        "On one radio: that square and every one before it fill with the warning colour.",
      ],
      ["value=<n>", "The score the form submits."],
    ],
    keys: [
      ["← / →", "Lowers or raises the rating by one."],
      ["Tab", "Enters the rating at the checked square; the rating is one tab stop."],
    ],
    a11y: [
      'Each radio needs a name: the visually hidden number (or "3 of 5") in `span.sr-only`.',
      "Hovering previews a value by filling up to the pointer; the checked value shows again when the pointer leaves.",
      'Once a value is checked it can\'t be cleared with the keyboard. Add a separate reset if "no rating" must be possible.',
    ],
    related: ["radio", "swatch-group"],
    keywords: "stars score review",
  },
  {
    slug: "swatch-group",
    title: "Swatch picker",
    group: "Selection",
    lede: "Colour choices as radio squares; the chosen one gets a two-ring halo.",
    owns: [".swatch-group"],
    anatomy: [
      [".swatch-group", "A wrapping row of swatches."],
      ["> label", "One square per colour, filled with its `--swatch`."],
      ["label > input[type=radio]", "Covers the square, invisible. All share a `name`."],
      ["label > span.sr-only", "The colour's name, as the radio's accessible name."],
    ],
    demos: [
      {
        title: "Swatch picker",
        html: `<div class="swatch-group" role="radiogroup" aria-label="Label colour">
  <label style="--swatch: var(--ae-accent)"><input type="radio" name="sw" checked /><span class="sr-only">Accent</span></label>
  <label style="--swatch: var(--ae-info)"><input type="radio" name="sw" /><span class="sr-only">Blue</span></label>
  <label style="--swatch: var(--ae-danger)"><input type="radio" name="sw" /><span class="sr-only">Red</span></label>
  <label style="--swatch: var(--ae-warning)"><input type="radio" name="sw" /><span class="sr-only">Amber</span></label>
  <label style="--swatch: var(--ae-success)"><input type="radio" name="sw" /><span class="sr-only">Green</span></label>
</div>`,
      },
    ],
    attrs: [
      ["--swatch=<colour>", "On each label: the colour of its square."],
      [
        "checked",
        "On one radio: draws a background-coloured gap and a text-coloured ring around its square.",
      ],
    ],
    keys: [["← / →", "Moves the selection to the previous or next colour."]],
    a11y: [
      "Every swatch needs its colour named in `span.sr-only`; the square alone says nothing to a screen reader.",
      'Name the group: wrap it in a `<fieldset>` with a `<legend>`, or add `role="radiogroup"` and an `aria-label`.',
      "Selection is shown by the rings, not by colour, so it reads on any swatch.",
    ],
    related: ["rating", "swatches", "colour"],
    keywords: "colour picker color palette",
  },
  {
    slug: "calendar",
    title: "Calendar",
    group: "Selection",
    lede: "A month grid with today, selection and range states. Presentational; wire it to your own dates.",
    owns: [".calendar", ".calendar-grid"],
    anatomy: [
      [".calendar", "Wrapper, sized to its grid."],
      ["> header", "The month title and the previous/next buttons, spaced apart."],
      [".calendar-grid", "Seven equal columns."],
      ["> span", "Weekday headings, muted. Seven, in display order."],
      ["> button", "One per day, including the leading and trailing days of the adjacent months."],
    ],
    demos: [
      {
        title: "Calendar",
        html: `<div class="calendar">
  <header>
    <b>October 2026</b>
    <div class="btn-group">
      <button class="btn" data-size="s" data-icon aria-label="Previous month"><i class="icon" data-icon="chevron-left"></i></button>
      <button class="btn" data-size="s" data-icon aria-label="Next month"><i class="icon" data-icon="chevron-right"></i></button>
    </div>
  </header>
  <div class="calendar-grid">${days}</div>
</div>`,
      },
    ],
    attrs: [
      [
        "aria-pressed=true",
        "On a day: solid accent, and announced as pressed. The selected day, or both ends of a range. `aria-selected=true` draws the same, for a day inside a `role=gridcell`.",
      ],
      ["aria-current=date", "On today: accent text and a 2px underline."],
      [
        "button[data-range]",
        "Days inside a range: a light accent tint. Mark the ends too; `aria-pressed` draws over it.",
      ],
      ["button[data-outside]", "Days from the adjacent months: muted at half opacity."],
      ["disabled", "An unavailable day: faded, ignores the pointer."],
    ],
    keys: [
      [
        "Tab",
        "Moves through the day buttons one at a time. There is no arrow-key grid navigation.",
      ],
      ["Enter / Space", "Activates the focused day; what that does is up to your script."],
    ],
    a11y: [
      'A day button\'s text is only a number. Give each an `aria-label` with the full date ("12 October 2026").',
      'Use `aria-pressed="true"` on the selected day: `aria-selected` is not exposed on a plain `<button>`. Say a day is inside a range in its label too ("13 October 2026, in range").',
      '`aria-current="date"` is valid on any element and announces today.',
      "The previous/next buttons are icon-only and need an `aria-label`, as in the demo.",
    ],
    related: ["date-time", "button-group"],
    keywords: "date picker month",
  },
];
