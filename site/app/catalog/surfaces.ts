import type { Entry } from "./types";

export const surfaces: Entry[] = [
  {
    slug: "card",
    title: "Card",
    group: "Surfaces",
    lede: "Frosted glass with a top specular. Hover deepens the shadow; nothing moves.",
    owns: [".card"],
    anatomy: [
      [
        ".card",
        "Any block element, usually `<article>`. A frosted layer with a medium shadow and the specular top edge. It is an inline-size container, so its children can use container queries.",
      ],
      [
        "> img / .media / .frame",
        "Optional. As the first child it bleeds to the card's edges, and the next child gets extra space above.",
      ],
      ["> *", "Content. Each child after the first is spaced from the one before."],
    ],
    demos: [
      {
        title: "Cards",
        html: `<div class="grid">
  <article class="card" data-interactive>
    <h4>Frosted</h4>
    <p class="text-muted">Blurs whatever sits behind it.</p>
  </article>
  <article class="card" data-solid>
    <h4>Solid</h4>
    <p class="text-muted">Opt out of blur with <code>data-solid</code>.</p>
  </article>
  <article class="card" data-size="s" aria-busy="true">
    <h4>Busy</h4>
    <p class="text-muted">Content dims; squares pulse.</p>
  </article>
</div>`,
      },
      {
        title: "Media card",
        html: `<article class="card" style="max-inline-size: 20rem">
  <div class="media"><div style="background: linear-gradient(135deg, var(--ae-accent), var(--ae-info)); block-size: 100%"></div></div>
  <h4>Aurora 01</h4>
  <p class="text-muted">A leading image bleeds to the edges.</p>
</article>`,
      },
      {
        title: "Fitted card",
        html: `<div class="cluster">
  <b>Theme</b>
  <div class="card" data-fit data-size="s">
    <div class="segmented" role="radiogroup" aria-label="Theme">
      <label><input type="radio" name="fit" /><span>Light</span></label>
      <label><input type="radio" name="fit" checked /><span>System</span></label>
      <label><input type="radio" name="fit" /><span>Dark</span></label>
    </div>
  </div>
</div>`,
        note: "data-fit sizes the card to its content: a floating layer for a control in a header or toolbar.",
      },
    ],
    attrs: [
      [
        "data-interactive",
        "Deepens the shadow on hover. Only the look: put a real link or button inside for the action.",
      ],
      [
        "data-solid",
        "Opaque surface, no blur. For cards over busy backgrounds or stacked on other glass.",
      ],
      ["data-size=s", "Compact card: `--ae-space-4` padding. Default `--ae-space-5`."],
      [
        "data-flush",
        "No padding, and contents clipped to the corners, for a table or image that fills the card.",
      ],
      [
        "data-fit",
        "Shrinks the card to its content. A fitted card is no longer a size container, so container queries inside it stop applying.",
      ],
      [
        "aria-busy=true",
        "Dims and blurs the content and pulses three squares over it; the card ignores the pointer.",
      ],
      [
        "data-featured",
        "Only inside `.pricing`: fills the card with the tone and inverts its text. See Pricing.",
      ],
    ],
    a11y: [
      "A card is a plain box. Use `<article>` with a heading when it stands on its own, so it shows up in heading navigation.",
      "`data-interactive` doesn't make the card clickable or focusable. Put the action in a link or button inside, usually on the heading.",
      "`aria-busy` blocks the pointer but not the keyboard, and the dimmed content is still read out. Disable controls inside if they must not be used while loading.",
    ],
    related: ["list", "frost", "pricing", "window"],
    keywords: "panel tile box container glass",
  },
  {
    slug: "frost",
    title: "Frost",
    group: "Surfaces",
    lede: "Make anything glass. Translucent fill, blur and saturation, set by three tokens.",
    owns: [".frost"],
    anatomy: [
      [
        ".frost",
        "Any element. Sets the translucent fill and the backdrop blur and removes the border. No padding, radius or shadow: add those yourself.",
      ],
    ],
    demos: [
      {
        title: "Frost",
        html: `<div class="frost p-5" style="max-inline-size: 22rem">
  <b>Any element</b>
  <p class="text-muted text-s">Falls back to a solid surface without backdrop-filter, under reduced transparency or forced colours.</p>
</div>`,
      },
    ],
    attrs: [
      [
        "--ae-frost-bg",
        "The fill: the surface colour at 66% (light) or 72% (dark). Dialogs, popovers and the combobox list set a thicker mix so text stays legible.",
      ],
      ["--ae-frost-filter", "The backdrop filter: `blur(var(--ae-blur-m)) saturate(1.8)`."],
      [
        "--ae-frost-edge",
        "The specular top edge as an inset `box-shadow`. Cards and lists add it; on `.frost` add it yourself.",
      ],
    ],
    a11y: [
      "Translucency lowers contrast over busy backgrounds. Under `prefers-reduced-transparency`, forced colours or `prefers-contrast: more` the fill turns solid and the blur is dropped.",
      "Without `backdrop-filter` support the fill is the plain surface colour, so text never sits on an unblurred see-through layer.",
    ],
    related: ["card", "dialog", "navbar"],
    keywords: "glass blur translucent backdrop-filter material",
  },
  {
    slug: "list",
    title: "List",
    group: "Surfaces",
    lede: "An inset grouped list. Rows can be links or buttons; group headers stick while their group scrolls.",
    owns: [".list"],
    anatomy: [
      [".list", "Frosted container with a medium shadow. Rows are its direct children."],
      ["> a / > button", "Interactive row: hover and press fill, and a chevron drawn at the end."],
      ["> div", "Static row: same layout, no hover and no chevron."],
      [
        "> h6",
        "Optional group header between rows. Sticks to the top while its group scrolls, when the list has a height and `overflow-y: auto`.",
      ],
    ],
    demos: [
      {
        title: "Inset list",
        html: `<div class="list" style="max-inline-size: 24rem">
  <a href="#"><span class="avatar" data-size="s" aria-hidden="true">NL</span> Northlight <span class="end text-muted">Owner</span></a>
  <a href="#"><span class="avatar" data-size="s" data-tone="success" aria-hidden="true">AT</span> Atlas <span class="end text-muted">Editor</span></a>
  <div><span class="spinner" aria-hidden="true"><span></span></span> <span class="text-muted">Syncing…</span></div>
</div>`,
      },
      {
        title: "Group headers and handles",
        html: `<div class="list" style="max-inline-size: 24rem; max-block-size: 11rem; overflow-y: auto">
  <h6>Today</h6>
  <div><span class="handle" aria-hidden="true"></span> Review glass thickness <span class="end caption">09:41</span></div>
  <div><span class="handle" aria-hidden="true"></span> Ship presets <span class="end caption">11:00</span></div>
  <h6>Tomorrow</h6>
  <div><span class="handle" aria-hidden="true"></span> Docs: layouts</div>
  <div><span class="handle" aria-hidden="true"></span> RTL audit</div>
  <div><span class="handle" aria-hidden="true"></span> Icon set</div>
</div>`,
      },
    ],
    attrs: [
      [
        "aria-busy=true",
        "Dims and blurs the rows and pulses three squares over them; the list ignores the pointer.",
      ],
    ],
    keys: [
      ["Tab", "Moves between link and button rows. Static rows are skipped."],
      ["Enter", "Follows a link row or activates a button row; a button row also answers Space."],
    ],
    a11y: [
      'Rows are direct children, so the list is not a `<ul>`. Add `role="list"` and `role="listitem"` when the count matters to listeners.',
      "Use `<a href>` for rows that open something and `<button>` for rows that act. The chevron is decorative and drawn on both.",
      "Group headers are `<h6>`, so they appear as level-6 headings. Keep that in mind in the page outline.",
    ],
    related: ["card", "table", "settings"],
    keywords: "rows inset grouped ios list view",
  },
  {
    slug: "accordion",
    title: "Accordion",
    group: "Surfaces",
    lede: "Native details/summary. Height animates through ::details-content and interpolate-size, no JS.",
    owns: [".accordion"],
    anatomy: [
      [
        "details.accordion",
        "One collapsible section. Consecutive accordions are divided by a hairline.",
      ],
      [
        "> summary",
        "The always-visible header and toggle. The native marker is hidden; a chevron at the end turns when open.",
      ],
      [
        "> (content)",
        "Everything after the summary: the panel, in muted text. Its height animates open and closed.",
      ],
    ],
    demos: [
      {
        title: "Accordion",
        html: `<div style="max-inline-size: 28rem">
  <details class="accordion" open><summary>What is φ doing here?</summary>Every spacing, type, radius, blur and motion step is a power of the golden ratio.</details>
  <details class="accordion"><summary>Why no outlines?</summary>Surfaces separate by tone and shadow. A stroke is only drawn between list items.</details>
  <details class="accordion"><summary>Can I round the corners?</summary>Set <code>data-radius="soft"</code> or any <code>--ae-radius-m</code>.</details>
</div>`,
      },
    ],
    attrs: [
      [
        "open",
        "Native. Expands the section; the browser toggles it when the summary is activated.",
      ],
      [
        "name=<text>",
        "Native. Accordions sharing a `name` form an exclusive group: opening one closes the others.",
      ],
    ],
    keys: [["Enter / Space", "On the summary: opens or closes the section."]],
    a11y: [
      "`<summary>` is exposed as a button with its expanded state, so no ARIA is needed.",
      "Keep the summary to text. Links or buttons inside it are hard to reach and conflict with the toggle.",
      "Browsers without `::details-content` open and close at once; the content is unchanged.",
    ],
    related: ["tree", "list", "card"],
    keywords: "details summary collapse expand disclosure faq",
  },
];
