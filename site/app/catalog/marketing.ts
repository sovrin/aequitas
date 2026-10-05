import type { Entry } from "./types";

export const marketing: Entry[] = [
  {
    slug: "hero",
    title: "Hero",
    group: "Marketing",
    lede: "Eyebrow, display headline, lede and actions. Centred or start-aligned.",
    owns: [".hero"],
    anatomy: [
      ["section.hero", "Grid of stacked parts with generous block padding."],
      ["> h6", "Optional eyebrow above the headline."],
      ["> h1", "The headline, held to 14 characters per line so it breaks into a block."],
      ["> p", "The lede, at the large size in muted text, held to a reading measure."],
      ["> .cluster", "Optional row of actions; one primary button, the rest default."],
    ],
    demos: [
      {
        title: "Hero",
        html: `<section class="hero" data-center style="padding-block: var(--ae-space-6)">
  <h6>Introducing</h6>
  <h1>Proportion, shipped.</h1>
  <p>One ratio for every space, size and radius. Glass only where it floats.</p>
  <div class="cluster"><button class="btn" data-variant="primary" data-size="l">Get started</button><button class="btn" data-size="l">Read the docs</button></div>
</section>`,
      },
    ],
    attrs: [["data-center", "Centres every part and its text. Default start-aligned."]],
    a11y: [
      "Keep one `<h1>` per page; the hero's is usually it.",
      'The `<h6>` eyebrow lands in the heading outline above the `<h1>`. Use `<p class="eyebrow">` if it shouldn\'t.',
      "Give the `<section>` an accessible name (`aria-labelledby` on the `<h1>`) if you want it listed as a region.",
    ],
    related: ["stat", "pricing", "cover"],
    keywords: "landing header banner headline jumbotron",
  },
  {
    slug: "features",
    title: "Feature grid",
    group: "Marketing",
    lede: "What the product does, in a few short blocks: an icon in the tone, a title and a sentence each.",
    owns: [".features"],
    anatomy: [
      [
        ".features",
        "Auto-fit grid; columns at least φ⁶ rem (`--min`) wide, so it goes from one to four columns on its own.",
      ],
      ["> div", "One feature. Its children stack with a small gap and lose their margins."],
      [
        "> div > i.icon:first-child",
        "Optional. One and a half times larger, in `--ae-tone`, with a little extra space below.",
      ],
      ["> div > h4, p", "The title, a step larger than body text, and a muted description."],
    ],
    demos: [
      {
        title: "Feature grid",
        html: `<div class="features">
  <div><i class="icon" data-icon="zap"></i><h4>Fast by default</h4><p>No runtime: plain CSS that the browser already knows how to draw.</p></div>
  <div><i class="icon" data-icon="layers"></i><h4>Frosted layers</h4><p>Glass for what floats, flat tints for what you press.</p></div>
  <div><i class="icon" data-icon="shield"></i><h4>Accessible</h4><p>State in ARIA, focus always visible, contrast modes handled.</p></div>
</div>`,
      },
      {
        title: "Centred, toned",
        html: `<div class="features" data-center data-tone="success" style="--min: 12rem">
  <div><i class="icon" data-icon="check-circle"></i><h4>Free to start</h4><p>No card needed.</p></div>
  <div><i class="icon" data-icon="users"></i><h4>Built for teams</h4><p>Roles and review.</p></div>
  <div><i class="icon" data-icon="globe"></i><h4>Everywhere</h4><p>Edge-hosted.</p></div>
</div>`,
      },
    ],
    attrs: [
      ["data-center", "Centres each feature's icon and text."],
      [
        "data-tone=accent|success|warning|danger|info",
        "Colours the icons. Set it on the grid, or on one feature.",
      ],
      ["--min=<length>", "Minimum column width. Default φ⁶ ≈ 18rem."],
    ],
    a11y: [
      "The icons are decorative; the title carries the meaning, so no label is needed on the `<i>`.",
      "Use a heading level that fits the page outline. `h4` is styled here, but `h3` under a section's `h2` is often right; restyle with a utility if needed.",
    ],
    related: ["hero", "pricing", "testimonial"],
    keywords: "features benefits grid marketing landing icons",
  },
  {
    slug: "pricing",
    title: "Pricing",
    group: "Marketing",
    lede: "Tiers as cards; the featured tier is solid in the tone.",
    owns: [".pricing", ".price"],
    anatomy: [
      [
        ".pricing",
        "Grid of tiers that wraps to fewer columns as space runs out. Cards align to the top.",
      ],
      ["> .card", "One tier: name, price, features, action, evenly spaced."],
      ["p.price", "The figure, large with tabular numbers. Usable outside a pricing grid."],
      ["p.price > small", "The period (`/mo`), small and muted."],
      [
        ".card > ul",
        "Feature list. Each item gets a check mark in the accent, with wrapped lines hanging clear of it.",
      ],
      [".card > .btn", "The tier's action. Inverted on the featured card."],
    ],
    demos: [
      {
        title: "Pricing",
        html: `<div class="pricing">
  <div class="card"><h4>Starter</h4><p class="price">€0<small>/mo</small></p><ul><li>1 project</li><li>Community support</li></ul><button class="btn">Start free</button></div>
  <div class="card" data-featured><h4>Pro</h4><p class="price">€12<small>/mo</small></p><ul><li>Unlimited projects</li><li>Priority support</li></ul><button class="btn">Upgrade</button></div>
  <div class="card"><h4>Team</h4><p class="price">€48<small>/mo</small></p><ul><li>SSO</li><li>Audit log</li></ul><button class="btn">Contact sales</button></div>
</div>`,
      },
    ],
    attrs: [
      [
        ".card[data-featured]",
        "On one tier inside `.pricing`: solid tone fill with contrast text and an inverted button, no blur.",
      ],
      [
        ".card[data-tone=accent|success|warning|danger|info]",
        "Changes the tone the featured card is filled with. Default accent.",
      ],
    ],
    a11y: [
      "The check marks are CSS-generated content, which some screen readers read aloud before each feature.",
      '"Featured" is only a fill. Say why in text ("Most popular") so it reaches everyone.',
      '`/mo` is read literally. Add `.sr-only` text such as "per month" if the abbreviation is unclear.',
      "Name each tier with a heading so screen reader users can jump between them.",
    ],
    related: ["choice-card", "card", "hero"],
    keywords: "plans tiers price table subscription",
  },
  {
    slug: "testimonial",
    title: "Testimonial",
    group: "Marketing",
    lede: "A customer's words in quotation marks, with a face and a name underneath.",
    owns: [".testimonial"],
    anatomy: [
      [
        "figure.testimonial",
        "Stacks the quote over the caption. Works on its own or as `.card.testimonial` in a grid.",
      ],
      [
        "> blockquote",
        "The quote, a step larger and in full text colour. Curly quotation marks are added; don't type them.",
      ],
      [
        "> figcaption",
        "Who said it: an optional `.avatar`, then a `<span>` with the name in `<b>` and the role after it.",
      ],
    ],
    demos: [
      {
        title: "Testimonial",
        html: `<figure class="testimonial" style="max-inline-size: 30rem">
  <blockquote>We replaced three component libraries with one stylesheet. The product finally looks like one product.</blockquote>
  <figcaption><span class="avatar" data-tone="success">MK</span><span><b>Mika Kim</b> Design lead, Harbor</span></figcaption>
</figure>`,
      },
      {
        title: "Large and centred",
        html: `<figure class="testimonial" data-size="l" data-center>
  <blockquote>The calmest interface we have shipped.</blockquote>
  <figcaption><span><b>Jun Rao</b> CTO, Atlas</span></figcaption>
</figure>`,
      },
      {
        title: "In cards",
        html: `<div class="grid" style="--min: 14rem">
  <figure class="card testimonial">
    <blockquote>Setup took an afternoon.</blockquote>
    <figcaption><span class="avatar" data-size="s">AL</span><span><b>Ada</b> Northlight</span></figcaption>
  </figure>
  <figure class="card testimonial">
    <blockquote>Our docs read better than our app now.</blockquote>
    <figcaption><span class="avatar" data-size="s" data-tone="info">JR</span><span><b>Jun</b> Atlas</span></figcaption>
  </figure>
</div>`,
      },
    ],
    attrs: [
      ["data-size=l", "A display-size quote, for a single testimonial between page sections."],
      ["data-center", "Centres the quote and caption."],
    ],
    a11y: [
      "`<figure>` with a `<figcaption>` ties the quote to its author for screen readers.",
      "The quotation marks are generated content; most screen readers do not read them, which is what you want.",
      "If you cite a source, put the link in the caption, or in a `cite` attribute on the `<blockquote>`.",
    ],
    related: ["features", "hero", "card", "avatar"],
    keywords: "testimonial quote customer review social proof marketing",
  },
  {
    slug: "logos",
    title: "Logo cloud",
    group: "Marketing",
    lede: "Customer marks in a quiet row: greyscale and muted until hovered.",
    owns: [".logos"],
    anatomy: [
      [
        ".logos",
        "Centred row that wraps, with wide gaps. Text marks are set in muted, medium weight.",
      ],
      [
        "> *",
        "One mark each: text, `<img>` or `<svg>`. Greyscale at reduced opacity; full opacity on hover.",
      ],
    ],
    demos: [
      {
        title: "Logos",
        html: `<div class="logos"><span>Acme</span><span>Globex</span><span>Initech</span><span>Umbrella</span><span>Hooli</span></div>`,
      },
    ],
    a11y: [
      'Logo images need `alt` with the company name; an inline `<svg>` needs `role="img"` and an `aria-label`.',
      "Hover only lifts opacity. Linked logos rely on the global focus ring for keyboard users.",
      'Precede the row with a short heading or sentence ("Trusted by") so a list of names has context.',
    ],
    related: ["hero", "stat"],
    keywords: "customers brands trusted by social proof",
  },
];
