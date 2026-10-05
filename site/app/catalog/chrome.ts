import type { Entry } from "./types";

export const chrome: Entry[] = [
  {
    slug: "window",
    title: "Window",
    group: "App chrome",
    lede: "A window frame with squared traffic lights. For product shots and apps that want to feel native.",
    owns: [".window"],
    anatomy: [
      [
        ".window",
        "Surface with a large shadow. A grid: title bar, then a body row that takes the rest and clips.",
      ],
      [
        "> header",
        "Title bar on a tinted fill with a hairline below. Draws the three squared lights itself, before its content.",
      ],
      ["header > span", "The title, centred in the space after the lights."],
      ["> div", "The body: anything. Give it its own padding; the window adds none."],
      ["> .statusbar", "Optional third child, a strip along the bottom."],
    ],
    demos: [
      {
        title: "Window",
        html: `<div class="window" style="max-inline-size: 28rem">
  <header><span>Northlight — Overview</span></header>
  <div class="p-5 stack gap-3">
    <div class="page-header"><div><h6>Project</h6><h4>Overview</h4></div><button class="btn" data-size="s" data-variant="primary">Invite</button></div>
    <p class="text-muted text-s">Window content.</p>
  </div>
  <div class="statusbar"><span>Ready</span><span class="end">Ln 12, Col 48</span></div>
</div>`,
      },
    ],
    a11y: [
      "The traffic lights are a `::before` pseudo-element: they are not buttons and screen readers skip them. Don't imply they close or minimise anything.",
      "When the window is a product shot, mark it `inert` so its sample buttons stay out of the tab order.",
      "The title is a plain `<span>`. If it names a real region, label the window with `aria-labelledby` pointing at it.",
    ],
    related: ["menubar", "statusbar", "shell"],
    keywords: "frame traffic lights mac app mockup",
  },
  {
    slug: "menubar",
    title: "Menubar",
    group: "App chrome",
    lede: "Top-level menus in a row, each opening a popover menu.",
    owns: [".menubar"],
    anatomy: [
      ["nav.menubar", "Row of top-level items, 1px apart."],
      [
        "> button",
        "A top-level item. `popovertarget` points it at a `.menu`; an `<a>` works for items that navigate.",
      ],
      [".menu[popover]", "The menu each item opens, anchored below it. See Menu."],
    ],
    demos: [
      {
        title: "Menubar",
        html: `<nav class="menubar">
  <button popovertarget="mb-file-demo">File</button>
  <button popovertarget="mb-edit-demo">Edit</button>
  <button>View</button>
  <button>Help</button>
</nav>
<div class="menu" popover id="mb-file-demo"><button>New <kbd>⌘N</kbd></button><button>Open… <kbd>⌘O</kbd></button><hr /><button>Close <kbd>⌘W</kbd></button></div>
<div class="menu" popover id="mb-edit-demo"><button>Undo <kbd>⌘Z</kbd></button><button>Redo <kbd>⇧⌘Z</kbd></button></div>`,
      },
    ],
    attrs: [
      [
        "popovertarget=<id>",
        "On an item: the id of the `.menu` popover it toggles. Native, no script.",
      ],
      [
        "aria-expanded=true",
        "Holds the item's hover fill while its menu is open. aequitas.js keeps it in sync with the popover; without it, set it yourself.",
      ],
    ],
    js: "When a menu opens or closes, aequitas.js sets `aria-expanded` on every item that targets it (by `popovertarget` or `data-open`), so the item holds its fill while its menu is open. Without it the menus still open and close natively; only the open style is lost.",
    keys: [
      ["Tab / Shift Tab", "Moves between items, and into an open menu."],
      ["Enter / Space", "Opens or closes the item's menu."],
      ["Esc", "Closes the open menu (native popover light dismiss)."],
    ],
    a11y: [
      'The items are ordinary buttons in a `<nav>`; Tab reaches each one. Don\'t add `role="menubar"` or `role="menu"` unless you also implement arrow-key navigation, which aequitas does not provide.',
      "`popovertarget` exposes the expanded state to assistive tech by itself; `aria-expanded` here is only for the open style.",
      "Keyboard shortcuts in `<kbd>` are visual hints. Bind them yourself, or leave them out.",
    ],
    related: ["menu", "window", "toolbar"],
    keywords: "menu bar file edit app menus",
  },
  {
    slug: "statusbar",
    title: "Statusbar",
    group: "App chrome",
    lede: "A thin bottom strip for state: position, encoding, counts.",
    owns: [".statusbar"],
    anatomy: [
      [".statusbar", "Tinted strip with a hairline above. Small, muted, tabular figures."],
      ["> span", "One item each, spaced evenly."],
      ["> .end", "The `.end` utility pushes an item, and everything after it, to the end edge."],
    ],
    demos: [
      {
        title: "Statusbar",
        html: `<div class="statusbar"><span>Ready</span><span>UTF-8</span><span class="end">Ln 12, Col 48</span></div>`,
      },
    ],
    a11y: [
      'The strip is silent to screen readers when it changes. Put `role="status"` on the item that updates ("Saved", "3 errors") so the change is announced.',
      "Muted extra-small text is meant for glanceable detail. Anything the user must act on belongs in an alert or toast.",
    ],
    related: ["window", "navbar"],
    keywords: "status bar footer strip",
  },
  {
    slug: "page-header",
    title: "Page header",
    group: "App chrome",
    lede: "Eyebrow and title at the start, actions at the end.",
    owns: [".page-header"],
    anatomy: [
      [
        ".page-header",
        "Row with the title block at the start and actions at the end, aligned to the bottom edge. Wraps when narrow.",
      ],
      ["> div", "Title block: an optional `<h6>` eyebrow, then the heading."],
      ["> div > h6", "Optional eyebrow: project, section or parent page. Spaced off the title."],
      ["> .cluster", "Actions. A single button can sit there directly."],
    ],
    demos: [
      {
        title: "Page header",
        html: `<div class="page-header">
  <div><h6>Northlight</h6><h3>Overview</h3></div>
  <div class="cluster gap-2"><button class="btn" data-size="s">Share</button><button class="btn" data-size="s" data-variant="primary">Invite</button></div>
</div>`,
      },
    ],
    a11y: [
      "Use the heading level the page needs, usually `<h1>` for the page title; the size follows the element, so pick level first.",
      'The `<h6>` eyebrow joins the heading outline above the title. If that reads badly, put the eyebrow in a `<p class="eyebrow">` instead.',
    ],
    related: ["breadcrumb", "hero"],
    keywords: "title bar heading actions",
  },
  {
    slug: "handle",
    title: "Handle",
    group: "App chrome",
    lede: "A drag grip of two dotted columns for rows the user can reorder.",
    owns: [".handle"],
    anatomy: [
      [
        "span.handle",
        "Inline grip in `currentColor` at reduced opacity, with a grab cursor. Place it first in the row.",
      ],
    ],
    demos: [
      {
        title: "Handle",
        html: `<div class="list" style="max-inline-size: 20rem"><div><span class="handle" aria-hidden="true"></span> Drag me</div><div><span class="handle" aria-hidden="true"></span> Or me</div></div>`,
      },
    ],
    a11y: [
      'The handle only draws the grip; dragging is up to your script. Hide the bare grip with `aria-hidden="true"`.',
      "Dragging is pointer-only. Offer a keyboard way to reorder too, such as move up and move down buttons.",
      'If the grip itself is focusable, make it a `<button>` with an `aria-label` like "Reorder Invoices".',
    ],
    related: ["list", "resizable", "shell"],
    keywords: "drag grip sortable reorder grabber",
  },
  {
    slug: "resizable",
    title: "Resizable",
    group: "App chrome",
    lede: "A panel the user resizes by its corner, with CSS alone.",
    owns: [".resizable"],
    anatomy: [
      [
        ".resizable",
        "Any block. Gets the browser's resize grip in its end corner and scrolls what overflows. At least φ^4.5 ≈ 8.7rem wide, never wider than its container.",
      ],
    ],
    demos: [
      {
        title: "Resizable",
        html: `<div class="resizable bg-fill p-4 text-s text-muted" style="inline-size: 60%; min-block-size: 4rem">Drag the corner →</div>`,
      },
      {
        title: "Both axes",
        html: `<div class="resizable bg-fill p-4 text-s text-muted" data-axis="both" style="inline-size: 60%; min-block-size: 4rem">Drag the corner, either way</div>`,
      },
    ],
    attrs: [
      [
        "data-axis",
        "Which way the panel resizes. Without it, inline only. `block` also sets a φ³ ≈ 4.2rem minimum height; `both` resizes either way.",
      ],
    ],
    a11y: [
      "The resize grip is pointer-only; there is no keyboard way to resize. Never hide content that only becomes reachable by resizing.",
      "Overflow scrolls instead of clipping, so content stays reachable at any size.",
    ],
    related: ["handle", "panes", "split"],
    keywords: "resize drag corner panel",
  },
  {
    slug: "dock",
    title: "Dock",
    group: "App chrome",
    lede: "A floating glass bar of square app buttons; the current one carries a marker below.",
    owns: [".dock"],
    anatomy: [
      [
        "nav.dock",
        "Fixed, centred above the bottom gutter, over the content. Leave room at the end of the page so it doesn't cover the last lines.",
      ],
      ["> a", "Square tile on a tinted fill. A `<button>` works too."],
      ["a > i.icon", "The tile's icon, at the large text size."],
    ],
    demos: [
      {
        title: "Dock",
        preview: true,
        html: `<div class="preview" style="min-block-size: 8rem"><nav class="dock"><a href="#" aria-current="page" aria-label="Home"><i class="icon" data-icon="home"></i></a><a href="#" aria-label="Mail"><i class="icon" data-icon="mail"></i></a><a href="#" aria-label="Calendar"><i class="icon" data-icon="calendar"></i></a><a href="#" aria-label="Settings"><i class="icon" data-icon="sliders"></i></a></nav></div>`,
      },
    ],
    attrs: [
      ["aria-current=page", "On a tile: draws the small square marker below it. Any value works."],
    ],
    a11y: [
      'Tiles are icon-only: give each an `aria-label` ("Mail"), or the link has no name.',
      'Mark the current tile with `aria-current="page"`; the marker is its visual and it is announced.',
      'Label the `<nav>` (`aria-label="Apps"`) when the page has another navigation landmark.',
    ],
    related: ["tabbar", "fab"],
    keywords: "launcher app bar floating",
  },
  {
    slug: "tabbar",
    title: "Tab bar",
    group: "App chrome",
    lede: "Bottom navigation for phones: icon over label, the current one in the accent.",
    owns: [".tabbar"],
    anatomy: [
      [
        "nav.tabbar",
        "Fixed to the bottom edge, full width, with a hairline above. Items share the width equally; the bottom padding clears the home indicator.",
      ],
      ["> a", "One destination: icon stacked over a short label."],
      ["a > i", "The icon, at the large text size."],
    ],
    demos: [
      {
        title: "Tab bar",
        preview: true,
        html: `<div class="preview" style="min-block-size: 8rem"><nav class="tabbar"><a href="#" aria-current="page"><i class="icon" data-icon="home"></i>Home</a><a href="#"><i class="icon" data-icon="search"></i>Search</a><a href="#"><i class="icon" data-icon="bookmark"></i>Library</a><a href="#"><i class="icon" data-icon="user"></i>You</a></nav></div>`,
      },
    ],
    attrs: [
      ["aria-current=page", "On a link: accent colour and an edge along its top. Any value works."],
    ],
    a11y: [
      'These are links in a `<nav>`, not ARIA tabs: don\'t add `role="tab"`. Mark the current one with `aria-current="page"`.',
      "The current item shows an edge as well as the accent, so it doesn't rely on colour.",
      "Keep the visible label; the icon is decorative next to it.",
    ],
    related: ["dock", "navbar"],
    keywords: "bottom navigation mobile tab bar",
  },
  {
    slug: "footer",
    title: "Footer",
    group: "App chrome",
    lede: "The end of a page: small muted type, link columns and a hairline above. No fill of its own.",
    owns: [".footer"],
    anatomy: [
      [
        "footer.footer",
        "Generous block padding, a 1px hairline on the top edge, small muted text.",
      ],
      [
        "> .container.grid",
        "Optional: the columns. `.grid` with a smaller `--min` gives one column per group.",
      ],
      ["h6", "Column heading, with a little space below."],
      ["ul > li > a", "Unstyled list; links inherit the muted colour and brighten on hover."],
    ],
    demos: [
      {
        title: "Footer",
        html: `<footer class="footer">
  <div class="container grid" style="--min: 10rem">
    <div class="stack gap-2">
      <strong>Northlight</strong>
      <p>Design systems, in proportion.</p>
    </div>
    <nav aria-label="Product">
      <h6>Product</h6>
      <ul><li><a href="#">Features</a></li><li><a href="#">Pricing</a></li><li><a href="#">Changelog</a></li></ul>
    </nav>
    <nav aria-label="Company">
      <h6>Company</h6>
      <ul><li><a href="#">About</a></li><li><a href="#">Careers</a></li><li><a href="#">Contact</a></li></ul>
    </nav>
  </div>
</footer>`,
      },
    ],
    a11y: [
      "Use a `<footer>` that is a direct child of `<body>` (or of the page wrapper), so it maps to the `contentinfo` landmark.",
      'Wrap each link column in `<nav aria-label="…">` when it is navigation, so the landmarks are told apart.',
      "Footer links are muted until hover; they keep the global focus ring, so keyboard users still see where they are.",
    ],
    related: ["navbar", "statusbar", "page"],
    keywords: "site footer bottom links copyright",
  },
];
