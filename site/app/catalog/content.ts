import type { Entry } from "./types";

export const content: Entry[] = [
  {
    slug: "typography",
    title: "Typography",
    group: "Content",
    lede: "Headings sit on the √φ type scale, h6 at φ^-½ up to h1 at φ³; body leading is φ. Roles for eyebrow, lead, display and caption.",
    owns: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "dl",
      ".eyebrow",
      ".lead",
      ".display",
      ".caption",
      "ul",
    ],
    anatomy: [
      [
        "h1 … h6",
        "Styled bare. Large headings get lighter and tighter; `h6` is a small muted label.",
      ],
      [".eyebrow", "Small tracked capitals above a heading. Any element."],
      [".lead", "Introductory paragraph, a step up and muted."],
      [".display", "Headline type above `h1`, for heroes and covers. Any element."],
      [".caption", "Small muted text under media or beside data."],
      [
        "blockquote > cite",
        "Quote with an accent rule on its start edge; an optional `<cite>` sits on its own line.",
      ],
      ["dl > dt + dd", "Two-column term and value grid; terms are muted."],
      [
        'ul[data-variant="check|inline|plain"]',
        "List variants: check marks, a wrapping row, or no markers at all.",
      ],
    ],
    demos: [
      {
        title: "Scale",
        html: `<div class="stack gap-2">
  <h1>Heading one</h1>
  <h2>Heading two</h2>
  <h3>Heading three</h3>
  <h4>Heading four</h4>
  <h5>Heading five</h5>
  <h6>Heading six</h6>
  <p>Body text at the base size, with a line-height of φ. <a href="#">A link.</a></p>
  <p class="eyebrow">Eyebrow</p><p class="lead">Lead paragraph, a step up and muted.</p><p class="caption">Caption, a step down.</p>
</div>`,
      },
      {
        title: "Display",
        html: `<div class="stack gap-2">
  <p class="eyebrow">Introducing</p>
  <p class="display">Proportion, shipped.</p>
</div>`,
      },
      {
        title: "Quotes and lists",
        html: `<div class="stack gap-4">
  <blockquote>Good design is as little design as possible.<cite>Dieter Rams</cite></blockquote>
  <dl><dt>Base</dt><dd>1rem</dd><dt>Ratio</dt><dd>1.618</dd></dl>
  <ul data-variant="check"><li>Squares</li><li>No outlines</li></ul>
  <ul data-variant="inline"><li>Inline</li><li>list</li><li>items</li></ul>
</div>`,
      },
    ],
    attrs: [
      [
        "data-variant=check|inline|plain",
        "On a `ul` or `ol`: accent check marks, a wrapping row, or no markers and no indent.",
      ],
    ],
    a11y: [
      "Pick heading levels by structure, not size. For a big line that is not a heading use `.display`; for a small one, a heading with `.caption` or `.eyebrow`.",
      "`.eyebrow` uppercases with CSS. Write the text in normal case so screen readers don't spell it out.",
      'The list variants remove the markers, which makes Safari drop list semantics. Add `role="list"` when the count matters.',
    ],
    related: ["prose", "code", "hero"],
    keywords: "type headings fonts text scale eyebrow lead caption blockquote",
  },
  {
    slug: "code",
    title: "Code",
    group: "Content",
    lede: "Inline code and keys, and a block with a filename header and a copy action.",
    owns: ["code", "kbd", "pre", "mark", ".code"],
    anatomy: [
      ["code", "Inline code on a small tinted fill."],
      ["kbd", "One key or one shortcut per element; a bottom hairline makes it read as a keycap."],
      ["mark", "Highlighted text on a warning tint."],
      ["figure.code", "Block with a header. A bare `<pre>` works too, without the header."],
      ["> figcaption", "Filename, monospace and muted, with an optional copy button at the end."],
      ["> pre > code", "The code. Scrolls sideways when lines are long."],
    ],
    demos: [
      {
        title: "Inline",
        html: `<p>Press <kbd>⌘</kbd> <kbd>K</kbd> to search, set <code>--ae-hue</code>, or <mark>highlight</mark> anything.</p>`,
      },
      {
        title: "Block",
        html: `<figure class="code">
  <figcaption>tokens/scale.css <button class="btn" data-size="s" data-copy>Copy</button></figcaption>
  <pre><code>--ae-phi: 1.618034;
--ae-space-5: round(calc(var(--ae-unit) * var(--ae-phi)), 1px);</code></pre>
</figure>`,
      },
    ],
    attrs: [
      [
        "data-copy=<selector>",
        "On a button: aequitas.js copies the text of the element the selector names. Bare, it copies the `<pre>` of the closest `.code`.",
      ],
    ],
    js: 'Clicking a `[data-copy]` button writes the text to the clipboard and shows "Copied" on the button for a moment. Without aequitas.js the button renders but does nothing.',
    a11y: [
      'The "Copied" label swap is not reliably announced. Pair it with a toast when the confirmation matters.',
      'A `<pre>` that scrolls sideways needs `tabindex="0"` in browsers that don\'t make scroll containers focusable, so keyboard users can reach the overflow.',
      "Symbols such as `⌘` are read inconsistently. Name the key in the surrounding text when it matters.",
      "`<mark>` is not announced by most screen readers. Say why the text is highlighted when that is the point.",
    ],
    related: ["typography", "swatches", "button"],
    keywords: "pre kbd keyboard shortcut snippet copy mark highlight",
  },
  {
    slug: "icon",
    title: "Icon",
    group: "Content",
    lede: "Mask-based icons in currentColor with squared caps. The full set lives in the reference.",
    owns: [".icon"],
    anatomy: [
      [
        "i.icon[data-icon]",
        "An empty element; `data-icon` picks the glyph. One em square, coloured by the text colour. Ships in `aequitas.icons.css`, alongside `aequitas.css`.",
      ],
    ],
    demos: [
      {
        title: "Icons",
        html: `<div class="cluster text-l">
  <i class="icon" data-icon="search"></i>
  <i class="icon text-success" data-icon="check"></i>
  <i class="icon text-warning" data-icon="warning"></i>
  <i class="icon text-danger" data-icon="trash"></i>
  <i class="icon" data-icon="calendar" data-size="l"></i>
  <i class="icon" data-icon="sun" data-size="xl"></i>
</div>`,
      },
    ],
    attrs: [
      ["data-icon", "The glyph, by name. Required: without it the icon is a filled square."],
      ["data-size", "Scales the icon against the surrounding text. Default 1em."],
    ],
    a11y: [
      "The `<i>` is empty, so it announces nothing. When an icon is the only content of a control, put the label on the control (`aria-label`).",
      'An icon that carries meaning on its own needs `role="img"` and an `aria-label`; otherwise add `aria-hidden="true"`.',
    ],
    related: ["button", "badge"],
    keywords: "glyph symbol svg mask",
  },
  {
    slug: "divider",
    title: "Divider",
    group: "Content",
    lede: "A hairline with an optional label. The only line the system draws between siblings.",
    owns: ["hr", ".divider"],
    anatomy: [
      ["hr", "A bare 1px hairline, no border."],
      [".divider", "A short label centred between two hairlines that fill the remaining width."],
    ],
    demos: [
      {
        title: "Divider",
        html: `<div class="stack gap-4"><hr /><div class="divider">or</div></div>`,
      },
    ],
    a11y: [
      "`<hr>` is announced as a separator. Use it when the break is in the content, not only for decoration.",
      '`.divider` is plain text between two drawn lines; its label is read in sequence, so it must make sense read aloud ("or").',
    ],
    related: ["list", "toolbar"],
    keywords: "hr separator rule line",
  },
  {
    slug: "media",
    title: "Media",
    group: "Content",
    lede: "Golden-ratio media that covers its box, with a caption overlaid on a dark gradient.",
    owns: [".media"],
    anatomy: [
      ["figure.media", "Golden-ratio box on a tinted fill, clipping its content."],
      ["> img | > video | > div", "The media, stretched to cover the box."],
      ["> figcaption", "Optional caption laid over the bottom edge in light text on a gradient."],
    ],
    demos: [
      {
        title: "Media",
        html: `<figure class="media" style="max-inline-size: 20rem"><div style="background: linear-gradient(135deg, var(--ae-success), var(--ae-info)); block-size: 100%"></div><figcaption>Aurora 02</figcaption></figure>`,
      },
    ],
    a11y: [
      'An `<img>` inside needs `alt`. When the `<figcaption>` already describes it, `alt=""` avoids reading the same thing twice.',
      "The caption sits on whatever the image shows. The gradient keeps it readable on most images; check it on very light ones.",
    ],
    related: ["frame", "carousel", "card", "lightbox"],
    keywords: "image figure photo video caption",
  },
  {
    slug: "frame",
    title: "Frame",
    group: "Content",
    lede: "A box with a fixed aspect ratio that crops its content to fit. Golden unless told otherwise.",
    owns: [".frame"],
    anatomy: [
      [".frame", "Ratio box on a tinted fill, clipping overflow."],
      ["> *", "Any child, usually an `<img>` or `<video>`, stretched to cover the box."],
    ],
    demos: [
      {
        title: "Frames",
        html: `<div class="row">
  <div class="frame bg-fill place-center text-s text-muted" data-ratio="square">1:1</div>
  <div class="frame bg-fill place-center text-s text-muted">φ</div>
  <div class="frame bg-fill place-center text-s text-muted" data-ratio="video">16:9</div>
</div>`,
      },
      {
        title: "Portrait",
        html: `<div class="frame bg-fill place-center text-s text-muted" data-ratio="portrait" style="max-inline-size: 8rem">1:φ</div>`,
      },
    ],
    attrs: [
      ["data-ratio", "`golden` φ:1 is the default; `square` is 1:1, `video` 16:9, `portrait` 1:φ."],
    ],
    a11y: [
      "The frame is a plain box and adds no semantics. Put `alt` on the image inside, or wrap it in a `<figure>` with a caption.",
      "Cropping can cut off what the image is about. Keep important detail near the centre, or describe it in the `alt`.",
    ],
    related: ["media", "card", "grid"],
    keywords: "aspect ratio crop image video thumbnail",
  },
  {
    slug: "carousel",
    title: "Carousel",
    group: "Content",
    lede: "Scroll-snap with native ::scroll-marker dots where the browser supports them.",
    owns: [".carousel"],
    anatomy: [
      [
        ".carousel",
        "Horizontal scroll container that snaps; the scrollbar is hidden. Dots follow it where `::scroll-marker` is supported.",
      ],
      ["> *", "The items, usually `figure.media`. Each snaps to the start edge."],
    ],
    demos: [
      {
        title: "Carousel",
        html: `<div class="carousel" role="region" aria-label="Aurora gallery" tabindex="0">
  <figure class="media" aria-label="Slide 1 of 4"><div style="background: linear-gradient(135deg, var(--ae-accent), var(--ae-info)); block-size: 100%"></div><figcaption>Aurora 01</figcaption></figure>
  <figure class="media" aria-label="Slide 2 of 4"><div style="background: linear-gradient(135deg, var(--ae-success), var(--ae-info)); block-size: 100%"></div><figcaption>Aurora 02</figcaption></figure>
  <figure class="media" aria-label="Slide 3 of 4"><div style="background: linear-gradient(135deg, var(--ae-warning), var(--ae-danger)); block-size: 100%"></div><figcaption>Aurora 03</figcaption></figure>
  <figure class="media" aria-label="Slide 4 of 4"><div style="background: linear-gradient(135deg, var(--ae-danger), var(--ae-accent)); block-size: 100%"></div><figcaption>Aurora 04</figcaption></figure>
</div>`,
      },
    ],
    attrs: [
      ["--item=<length>", "Width of each item. Default φ⁶ rem, capped at the carousel's width."],
    ],
    keys: [["← / →", "Scrolls the focused carousel; it snaps to the nearest item."]],
    a11y: [
      'Give the carousel a name: `role="region"` with an `aria-label`, or wrap it in a labelled `<section>`. Give each item an `aria-label` too ("Slide 1 of 4"): the dots are links to the items and take their name from it.',
      "The scrollbar is hidden and dots only appear where `::scroll-marker` is supported. Make sure part of the next item shows, so it is clear there is more.",
      'Keyboard users scroll it once it has focus. Where scroll containers are not focusable by default, add `tabindex="0"`.',
    ],
    related: ["media", "scroll-fades", "snap", "lightbox"],
    keywords: "slider slideshow gallery scroll snap",
  },
  {
    slug: "swatches",
    title: "Swatches",
    group: "Content",
    lede: "For documenting tokens: a φ-ratio colour block with a monospace label.",
    owns: [".swatches", ".swatch"],
    anatomy: [
      [".swatches", "Auto-fill grid of swatches."],
      ["> .swatch", "The label as text. The colour block is drawn above it from `--swatch`."],
    ],
    demos: [
      {
        title: "Swatches",
        html: `<div class="swatches">
  <div class="swatch" style="--swatch: var(--ae-accent)">accent</div>
  <div class="swatch" style="--swatch: var(--ae-success)">success</div>
  <div class="swatch" style="--swatch: var(--ae-warning)">warning</div>
  <div class="swatch" style="--swatch: var(--ae-danger)">danger</div>
  <div class="swatch" style="--swatch: var(--ae-info)">info</div>
  <div class="swatch" style="--swatch: var(--ae-surface)">surface</div>
</div>`,
      },
    ],
    attrs: [[".swatch[--swatch=<colour>]", "The colour of the block. Any colour or token."]],
    a11y: [
      "The colour block is a pseudo-element and is invisible to screen readers. The label must name the colour or token; add the value in text if it matters.",
    ],
    related: ["swatch-group", "code", "colour"],
    keywords: "colour color palette tokens",
  },
  {
    slug: "scroll-fades",
    title: "Scroll fades",
    group: "Content",
    lede: "Edges fade only on the side that has more to scroll, driven by the scroll position itself.",
    owns: [".scroll-x", ".scroll-y"],
    anatomy: [
      [
        ".scroll-x",
        "Scrolls sideways with a hidden scrollbar; the start and end edges fade while there is more to scroll that way.",
      ],
      [".scroll-y", "The same, vertically. Give it a `max-block-size`."],
    ],
    demos: [
      {
        title: "Horizontal scroll",
        html: `<div class="scroll-x cluster" style="flex-wrap: nowrap; padding-block: var(--ae-space-1)">
  <span class="chip">Aurora</span><span class="chip">Borealis</span><span class="chip">Cirrus</span><span class="chip">Cumulus</span><span class="chip">Halo</span><span class="chip">Nimbus</span><span class="chip">Parhelion</span><span class="chip">Stratus</span><span class="chip">Twilight</span><span class="chip">Zodiacal</span><span class="chip">Corona</span><span class="chip">Glory</span>
</div>`,
      },
      {
        title: "Vertical scroll",
        html: `<ul class="scroll-y" data-variant="plain" style="max-block-size: 8rem; max-inline-size: 20rem">
  <li>Aurora</li><li>Borealis</li><li>Cirrus</li><li>Cumulus</li><li>Halo</li><li>Nimbus</li><li>Parhelion</li><li>Stratus</li><li>Twilight</li><li>Zodiacal</li>
</ul>`,
      },
    ],
    a11y: [
      "The fade is a mask and the scrollbar is hidden, so nothing tells a screen reader the area scrolls. Keep the content reachable in reading order.",
      'Where scroll containers are not focusable by default, add `tabindex="0"` so the area can be scrolled from the keyboard.',
      "Without scroll-driven animation support the edges do not fade at all; the area still scrolls.",
    ],
    related: ["carousel", "tabs", "snap"],
    keywords: "overflow mask fade scroll shadow",
  },
  {
    slug: "visually-hidden",
    title: "Visually hidden",
    group: "Content",
    lede: "Text for screen readers only: clipped to a single pixel, still read aloud and still in the tab order.",
    owns: [".sr-only"],
    anatomy: [
      [
        ".sr-only",
        "Any element. Absolutely positioned, 1×1px, clipped and unwrapped, so it takes no space and draws nothing.",
      ],
    ],
    demos: [
      {
        title: "Extra context",
        note: 'The links read "Edit Atlas" and "Edit Harbor" to a screen reader; sighted users see "Edit".',
        html: `<ul class="stack gap-2" data-variant="plain">
  <li>Atlas <a href="#">Edit<span class="sr-only"> Atlas</span></a></li>
  <li>Harbor <a href="#">Edit<span class="sr-only"> Harbor</span></a></li>
</ul>`,
      },
      {
        title: "Names for visual options",
        note: "The swatch picker shows colours; .sr-only gives each radio a name a screen reader can read.",
        html: `<div class="swatch-group" role="radiogroup" aria-label="Tint">
  <label style="--swatch: var(--ae-accent)"><input type="radio" name="vh" checked /><span class="sr-only">Accent</span></label>
  <label style="--swatch: var(--ae-success)"><input type="radio" name="vh" /><span class="sr-only">Green</span></label>
  <label style="--swatch: var(--ae-danger)"><input type="radio" name="vh" /><span class="sr-only">Red</span></label>
</div>`,
      },
    ],
    a11y: [
      "Use it to add context the visual layout already gives (which row a button acts on), not to hide content from everyone. For that, use `hidden`.",
      "Don't put it on a focusable element: it stays in the tab order but its focus ring is clipped away. Hide the text inside the control instead.",
      "Prefer `aria-label` for naming a single control; `.sr-only` is for text inside the flow of a sentence or a list.",
    ],
    related: ["rating", "swatch-group", "skip-link"],
    keywords: "sr-only screen reader only visually hidden accessible text a11y",
  },
];
