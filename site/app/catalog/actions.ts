import type { Entry } from "./types";

export const actions: Entry[] = [
  {
    slug: "button",
    title: "Button",
    group: "Actions",
    lede: "Flat tinted fill by default; only the primary action is solid. Padding is block × φ inline.",
    owns: [".btn"],
    anatomy: [
      [
        "button.btn",
        "Any `<button>` or `<a>`. Use a link when it navigates, a button when it acts.",
      ],
      ["i.icon", "Optional leading or trailing icon; the gap is set for you."],
    ],
    demos: [
      {
        title: "Variants",
        html: `<div class="cluster">
  <button class="btn" data-variant="primary">Publish</button>
  <button class="btn">Save draft</button>
  <button class="btn" data-variant="ghost">Cancel</button>
  <button class="btn" data-variant="primary" data-tone="danger">Delete</button>
  <button class="btn" data-variant="primary" data-tone="success">Approve</button>
  <button class="btn" disabled>Disabled</button>
</div>`,
      },
      {
        title: "Sizes and icons",
        html: `<div class="cluster">
  <button class="btn" data-size="s">Small</button>
  <button class="btn">Default</button>
  <button class="btn" data-size="l">Large</button>
  <button class="btn" data-variant="primary"><i class="icon" data-icon="plus"></i> New</button>
  <button class="btn" data-icon aria-label="Settings"><i class="icon" data-icon="sliders"></i></button>
</div>`,
      },
      {
        title: "States",
        note: "aria-busy swaps the label for three pulsing squares; data-toggle flips aria-pressed.",
        html: `<div class="cluster">
  <button class="btn" data-variant="primary" aria-busy="true">Saving</button>
  <button class="btn" aria-busy="true">Loading</button>
  <button class="btn" aria-pressed="true" data-toggle>Pinned</button>
  <button class="btn" data-count="3">Inbox</button>
  <button class="btn" data-tip="Saves to disk">With tooltip</button>
</div>`,
      },
    ],
    attrs: [
      [
        "data-variant",
        "`primary` is the one solid action on a screen; `ghost` has no fill until hover. Default flat tint.",
      ],
      ["data-size", "Smaller or larger padding and type. Default sits between."],
      [
        "data-tone=accent|success|warning|danger|info",
        "Colours the primary fill, the ghost text and the pressed state.",
      ],
      ["data-icon", "Square, icon-only button. Needs an `aria-label`."],
      [
        "aria-busy=true",
        "Hides the label and pulses three squares in its place; the button ignores clicks.",
      ],
      [
        "aria-pressed=true|false",
        "Toggle state: tinted, with a 2px edge along the bottom so it reads without colour.",
      ],
      ["data-toggle", "With `aria-pressed`, aequitas.js flips the state on click."],
      [
        "disabled",
        'Dims and ignores the pointer. `aria-disabled="true"` looks the same but stays focusable.',
      ],
      [
        "data-count=<n>",
        "Count badge in the corner, from the attribute's value. Works on any element.",
      ],
      ["data-tip=<text>", "Tooltip text; see Tooltip."],
    ],
    js: "Clicking a `[data-toggle]` button flips its `aria-pressed` between `true` and `false`. Everything else is CSS.",
    keys: [["Enter / Space", "Activates a `<button>`. A link-button answers Enter only."]],
    a11y: [
      "Use a real `<button>` (or `<a href>` for navigation) so focus, Enter and Space work without script.",
      "Icon-only buttons need an `aria-label`; the icon itself is decorative.",
      "`aria-busy` blocks the pointer but not focus. Keep the label in the markup: screen readers still announce it.",
      'Tone never carries meaning alone: a danger button says what it does ("Delete", not "OK").',
    ],
    related: ["button-group", "link", "segmented", "fab"],
    keywords: "btn cta primary ghost submit",
  },
  {
    slug: "button-group",
    title: "Button group",
    group: "Actions",
    lede: "Buttons joined into one row, divided by a hairline instead of a gap.",
    owns: [".btn-group"],
    anatomy: [
      [".btn-group", "Inline row that removes the gaps."],
      [
        "> .btn",
        "Two or more buttons. Each after the first draws a 1px separator on its start edge.",
      ],
    ],
    demos: [
      {
        title: "Button group",
        html: `<div class="btn-group" role="group" aria-label="Range">
  <button class="btn" data-size="s">Day</button>
  <button class="btn" data-size="s">Week</button>
  <button class="btn" data-size="s">Month</button>
</div>`,
      },
      {
        title: "Primary",
        note: "Between two primary buttons the separator is a translucent line of the contrast colour.",
        html: `<div class="btn-group" role="group" aria-label="Publish">
  <button class="btn" data-variant="primary">Publish</button>
  <button class="btn" data-variant="primary" data-icon aria-label="More options"><i class="icon" data-icon="chevron-down"></i></button>
</div>`,
      },
    ],
    a11y: [
      'Give the group `role="group"` and an `aria-label` when the buttons only make sense together.',
      "For a single choice among options, use a segmented control: it is a radio group and announces the selection.",
    ],
    related: ["button", "segmented", "toolbar"],
    keywords: "btn-group joined buttons split button",
  },
  {
    slug: "link",
    title: "Link",
    group: "Actions",
    lede: "Underlined by default, quiet when inside navigation, and a button that looks like one.",
    owns: [".link"],
    anatomy: [
      [
        "a[href]",
        "Every link: accent colour, a faint underline that firms up on hover. No class needed.",
      ],
      [
        "a[data-quiet]",
        "Quiet link: inherits the surrounding colour; the underline appears only on hover.",
      ],
      [
        "button.link",
        "A `<button>` that acts but reads as inline text. Strips the button padding, border and fill.",
      ],
    ],
    demos: [
      {
        title: "Links",
        html: `<p>A <a href="#">default link</a>, a <a href="#" data-quiet>quiet link</a>, and <button class="link">a button styled as a link</button>.</p>`,
      },
    ],
    attrs: [
      [
        "a[data-quiet]",
        "Inherits the text colour and hides the underline until hover. For links in navigation, footers and dense lists.",
      ],
    ],
    keys: [["Enter", "Follows an `<a href>`. A `button.link` also answers Space."]],
    a11y: [
      "Use `<a href>` when it goes somewhere and `button.link` when it does something; the look is the same, the semantics are not.",
      'A quiet link has no colour cue and no underline at rest. Use it where the context already says "this is a link", such as a nav or a footer, not in running text.',
      "Link text should make sense on its own: screen readers list links out of context.",
    ],
    related: ["button", "breadcrumb"],
    keywords: "anchor href underline text button",
  },
  {
    slug: "fab",
    title: "Floating action button",
    group: "Actions",
    lede: "A fixed square at the bottom end of the viewport for the one primary action.",
    owns: [".fab"],
    anatomy: [
      [
        "button.fab",
        "Fixed to the bottom end corner, one gutter in, above page content. Solid tone fill and a large shadow.",
      ],
      [
        "> i.icon",
        "The icon, set at the large text size. A single character such as `+` also works.",
      ],
    ],
    demos: [
      {
        title: "FAB",
        preview: true,
        html: `<div class="preview" style="min-block-size: 8rem"><button class="fab" aria-label="New"><i class="icon" data-icon="plus"></i></button></div>`,
      },
    ],
    attrs: [
      ["aria-label=<text>", "Required: the button has no visible text."],
      ["data-tone=accent|success|warning|danger|info", "Colours the fill. Default accent."],
      ["data-tip=<text>", "Tooltip text; see Tooltip."],
    ],
    keys: [["Enter / Space", "Activates the button."]],
    a11y: [
      'It is icon-only, so it needs an `aria-label` that names the action ("New message", not "Plus").',
      "Being fixed, it sits on top of whatever scrolls under it. Leave room at the end of the page so the last content isn't covered.",
      "It comes wherever it is in the source for focus order, not where it appears. Place it near the content it acts on.",
    ],
    related: ["button", "dock"],
    keywords: "floating action primary fixed corner",
  },
  {
    slug: "toolbar",
    title: "Toolbar",
    group: "Actions",
    lede: "A row of icon buttons on a tinted track, with hairline separators where groups change.",
    owns: [".toolbar"],
    anatomy: [
      [".toolbar", "Inline row on a flat tinted track."],
      [
        "> .btn",
        'Buttons, usually `data-icon`. They have no fill until hovered, pressed or `aria-pressed="true"`.',
      ],
      ["> hr", "Optional 1px vertical separator between groups of buttons."],
    ],
    demos: [
      {
        title: "Toolbar",
        html: `<div class="toolbar" role="group" aria-label="Formatting">
  <button class="btn" data-icon aria-label="Bold"><i class="icon" data-icon="bold"></i></button>
  <button class="btn" data-icon aria-label="Italic"><i class="icon" data-icon="italic"></i></button>
  <hr />
  <button class="btn" data-icon aria-label="Link"><i class="icon" data-icon="link"></i></button>
  <button class="btn" data-icon aria-label="Copy"><i class="icon" data-icon="copy"></i></button>
</div>`,
      },
      {
        title: "Toggles",
        note: "A pressed button keeps its tint and bottom edge; data-toggle flips it on click.",
        html: `<div class="toolbar" role="group" aria-label="Alignment">
  <button class="btn" data-icon aria-label="Align left" aria-pressed="true" data-toggle><i class="icon" data-icon="align-left"></i></button>
  <button class="btn" data-icon aria-label="Align centre" aria-pressed="false" data-toggle><i class="icon" data-icon="align-center"></i></button>
  <button class="btn" data-icon aria-label="Align right" aria-pressed="false" data-toggle><i class="icon" data-icon="align-right"></i></button>
</div>`,
      },
    ],
    attrs: [
      [
        "> .btn[aria-pressed=true|false]",
        "Toggle buttons: the pressed one keeps its tint and edge. See Button.",
      ],
      ["> .btn[data-toggle]", "With `aria-pressed`, aequitas.js flips the state on click."],
    ],
    js: "Clicking a `.btn[data-toggle]` in the toolbar flips its `aria-pressed`. Nothing else is scripted: there is no arrow-key focus movement between buttons.",
    keys: [
      ["Tab", "Moves to the next button. Each button is its own tab stop."],
      ["Enter / Space", "Activates or toggles the focused button."],
    ],
    a11y: [
      "Every icon-only button needs an `aria-label`.",
      'Give the row `role="group"` and an `aria-label`. `role="toolbar"` promises arrow-key navigation, which aequitas.js does not provide; add it only with your own roving focus.',
      "The `<hr>` is announced as a separator between groups.",
    ],
    related: ["button", "button-group", "menubar", "navbar"],
    keywords: "formatting icon bar editor actions",
  },
];
