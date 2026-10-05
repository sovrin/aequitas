import type { Entry } from "./types";

export const navigation: Entry[] = [
  {
    slug: "navbar",
    title: "Navbar",
    group: "Navigation",
    lede: "A full-bleed toolbar: material with one hairline below. Can shrink as the page scrolls.",
    owns: [".navbar"],
    anatomy: [
      [
        "header.navbar",
        "Sticky to the top, frosted, full bleed. Its content lines up with the page container.",
      ],
      [
        "> strong, > nav",
        "Brand and link groups in one row. Every `<a>` inside is a quiet, small link.",
      ],
      ["> .end", "Optional. The `.end` utility pushes trailing actions to the far side."],
    ],
    demos: [
      {
        title: "Navbar",
        html: `<div class="card" data-flush>
  <header class="navbar" style="position: static">
    <strong>Northlight</strong>
    <nav class="cluster"><a href="#" aria-current="page">Pages</a><a href="#">Media</a><a href="#">Settings</a></nav>
    <span class="end"><button class="btn" data-size="s" data-variant="primary">Publish</button></span>
  </header>
</div>`,
      },
    ],
    attrs: [
      [
        "data-shrink",
        "Tightens the padding and adds a shadow over the first ~11rem of page scroll. Scroll-driven, no JS; ignored where `animation-timeline` is unsupported.",
      ],
      ["aria-current=page", "On a link: full text colour and an accent underline."],
    ],
    a11y: [
      "Wrap the links in a `<nav>` with an `aria-label` when the page has more than one navigation landmark.",
      'Mark the current link with `aria-current="page"`; the underline alone is not announced.',
    ],
    related: ["shell", "tabbar", "menubar"],
    keywords: "header topbar appbar",
  },
  {
    slug: "sidebar",
    title: "Sidebar",
    group: "Navigation",
    lede: "The shell's navigation column: groups, icon slots, a footer, and a rail form when narrow.",
    owns: [".sidebar"],
    anatomy: [
      [
        "nav.sidebar",
        "A sticky, scrolling column. Usually the first child of a `.shell`, which sets its width (see Shell).",
      ],
      [
        "> h6, > details > summary",
        "Group headings. A `<details>` group collapses; its summary carries a chevron.",
      ],
      [
        "a",
        "One destination. Optional `> i` icon slot and a `> span` label, which the rail form needs.",
      ],
      ["> footer", "Optional. Pushed to the bottom, for the account or settings."],
    ],
    demos: [
      {
        title: "Sidebar",
        preview: true,
        html: `<div class="preview"><div class="shell" style="min-block-size: 16rem">
  <nav class="sidebar" aria-label="Main">
    <details open><summary>Workspace</summary>
      <a href="#" aria-current="page"><i class="icon" data-icon="home"></i><span>Overview</span></a>
      <a href="#"><i class="icon" data-icon="file"></i><span>Pages</span></a>
      <a href="#"><i class="icon" data-icon="image"></i><span>Media</span></a>
    </details>
    <details><summary>You</summary><a href="#"><i class="icon" data-icon="settings-gear"></i><span>Settings</span></a></details>
    <footer><a href="#"><span class="avatar" data-size="s">AL</span><span>Ada</span></a></footer>
  </nav>
  <main class="p-5 text-muted text-s">Main content</main>
</div></div>`,
      },
      {
        title: "Rail, labels hidden",
        note: 'The shell\'s data-rail makes the column narrow; data-labels="hidden" leaves only the icons.',
        preview: true,
        html: `<div class="preview"><div class="shell" data-rail style="min-block-size: 16rem">
  <nav class="sidebar" aria-label="Main" data-labels="hidden">
    <a href="#" aria-current="page"><i class="icon" data-icon="home"></i><span>Overview</span></a>
    <a href="#"><i class="icon" data-icon="file"></i><span>Pages</span></a>
    <a href="#"><i class="icon" data-icon="image"></i><span>Media</span></a>
  </nav>
  <main class="p-5 text-muted text-s">Main content</main>
</div></div>`,
      },
    ],
    attrs: [
      ["aria-current=page", "On a link: accent text, tint and an accent edge on the start side."],
      [
        "data-labels",
        "In the rail form, hides the `<span>` labels visually (they stay readable to screen readers). Default shows them small under the icon.",
      ],
    ],
    a11y: [
      'Use `<nav>` with an `aria-label` ("Main") so it is a named landmark.',
      'In the rail form give every link a `<span>` label, even with `data-labels="hidden"`: it is the link\'s accessible name.',
      "Under 48rem the sidebar becomes a horizontal scrolling row and hides headings and the footer, so don't put anything there that has no other route.",
    ],
    related: ["shell", "tree", "navbar"],
    keywords: "side nav rail navigation drawer",
  },
  {
    slug: "tabs",
    title: "Tabs",
    group: "Navigation",
    lede: "An underline indicator on the selected tab. aequitas.js adds click and arrow-key switching.",
    owns: [".tabs"],
    anatomy: [
      [
        ".tabs[role=tablist]",
        "The row, with a hairline below. The underline slides to the selected tab where anchor positioning is supported.",
      ],
      [
        "> [role=tab]",
        "Direct children, usually `<button>`s, each with `aria-selected` and `aria-controls`.",
      ],
      [
        "[role=tabpanel]",
        "One per tab, anywhere on the page, with the `id` the tab points at. Inactive panels carry `hidden`.",
      ],
    ],
    demos: [
      {
        title: "Tabs",
        html: `<div class="stack gap-3">
  <div class="tabs" role="tablist">
    <button role="tab" aria-selected="true" aria-controls="tp1">Overview</button>
    <button role="tab" aria-selected="false" aria-controls="tp2">Activity</button>
    <button role="tab" aria-selected="false" aria-controls="tp3">Settings</button>
  </div>
  <p id="tp1" role="tabpanel" class="text-muted">Everything at a glance.</p>
  <p id="tp2" role="tabpanel" class="text-muted" hidden>Recent changes, newest first.</p>
  <p id="tp3" role="tabpanel" class="text-muted" hidden>Preferences for this project.</p>
</div>`,
      },
    ],
    attrs: [
      ["role=tablist", "Required on `.tabs`: aequitas.js enhances every `[role=tablist]`."],
      ["aria-selected=true|false", "On a tab: `true` draws the underline and full text colour."],
      ["aria-controls=<id>", "On a tab: the panel aequitas.js shows when the tab is selected."],
      ["hidden", "On a panel: hides it. aequitas.js toggles it."],
    ],
    js: "Clicking a tab, or moving with the arrow keys, sets `aria-selected` on it and `false` on the rest, makes it the only tab with `tabindex=0`, and toggles `hidden` on each tab's `aria-controls` panel. Without it the tabs render, but switching panels is up to you.",
    keys: [
      ["← / →", "Moves to and selects the previous or next tab, wrapping at the ends."],
      ["Home / End", "Moves to and selects the first or last tab."],
    ],
    a11y: [
      "Name the tablist with `aria-label` or `aria-labelledby`, and point each panel back at its tab with `aria-labelledby`.",
      "aequitas.js sets a roving `tabindex` as soon as it enhances the list, so Tab lands on the selected tab and the arrows move between tabs.",
      "In right-to-left pages the arrows follow the reading direction: ← moves to the next tab.",
    ],
    related: ["segmented", "toc"],
    keywords: "tablist tab panel",
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    group: "Navigation",
    lede: "Where you are, with slashes between the steps.",
    owns: [".breadcrumb"],
    anatomy: [
      ["ol.breadcrumb", "An ordered list in one wrapping row, small and muted."],
      ["> li", "One step. Each after the first gets a `/` before it."],
      ["> li > a", "Link to an ancestor; the last step is plain text."],
    ],
    demos: [
      {
        title: "Breadcrumb",
        html: `<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="#">Projects</a></li>
    <li><a href="#">Northlight</a></li>
    <li aria-current="page">Settings</li>
  </ol>
</nav>`,
      },
    ],
    attrs: [["aria-current=page", "On the last step: full text colour."]],
    a11y: [
      'Wrap the list in `<nav aria-label="Breadcrumb">` so it is announced as a landmark.',
      'Mark the current step with `aria-current="page"`.',
      "The slashes are CSS generated content; some screen readers announce them.",
    ],
    related: ["pagination", "page-header"],
    keywords: "crumbs path trail",
  },
  {
    slug: "pagination",
    title: "Pagination",
    group: "Navigation",
    lede: "Square page buttons; the current page is solid.",
    owns: [".pagination"],
    anatomy: [
      ["nav.pagination", "An inline row with small gaps."],
      [
        "> a, > button",
        "Direct children: page links, plus previous and next. Use `<button>` where a control can be `disabled`.",
      ],
      ["> span", "Optional, unstyled: an ellipsis between ranges."],
    ],
    demos: [
      {
        title: "Pagination",
        html: `<nav class="pagination" aria-label="Pages">
  <button disabled aria-label="Previous"><i class="icon" data-icon="chevron-left"></i></button>
  <a href="#" aria-current="page">1</a>
  <a href="#">2</a>
  <a href="#">3</a>
  <span class="place-center px-2 text-muted">…</span>
  <a href="#">12</a>
  <a href="#" aria-label="Next"><i class="icon" data-icon="chevron-right"></i></a>
</nav>`,
      },
    ],
    attrs: [
      ["aria-current=page", "On the current page: solid fill in the tone colour."],
      ["disabled", "On a `<button>`: dimmed and ignores the pointer."],
      [
        "data-tone=accent|success|warning|danger|info",
        "Colours the current page's fill. Default accent.",
      ],
    ],
    a11y: [
      'Label the `<nav>` (`aria-label="Pages"`) so it is distinct from the main navigation.',
      "Previous and next are icon-only: they need an `aria-label`.",
      'Mark the current page with `aria-current="page"`; the fill alone is not announced.',
    ],
    related: ["breadcrumb", "table"],
    keywords: "pager pages paging",
  },
  {
    slug: "steps",
    title: "Steps",
    group: "Navigation",
    lede: "A sequence, so numbering is earned. A track per step; done steps show a check.",
    owns: [".steps"],
    anatomy: [
      ["ol.steps", "An ordered list in a row of equal columns."],
      [
        "> li",
        "One step: a 2px track above its label. With numbers, a square counter sits above or beside it.",
      ],
    ],
    demos: [
      {
        title: "Horizontal",
        html: `<ol class="steps" data-numbered>
  <li data-done>Account</li>
  <li aria-current="step">Workspace</li>
  <li>Members</li>
  <li>Billing</li>
</ol>`,
      },
      {
        title: "Vertical",
        html: `<ol class="steps" data-vertical data-numbered style="max-inline-size: 16rem">
  <li data-done>Email sent</li>
  <li aria-current="step">Enter code</li>
  <li>Done</li>
</ol>`,
      },
    ],
    attrs: [
      [
        "aria-current=step",
        "On a step: the current one. Accent track, full text colour; with numbers, a solid accent counter.",
      ],
      [
        "data-done",
        "On a step: completed. Accent track; with numbers, a check in place of the counter.",
      ],
      [
        "data-numbered",
        "Shows a counter on each step and turns on the done check and current fill.",
      ],
      [
        "data-vertical",
        "Stacks the steps, counter beside the label and no track. Counters always show in this form; `data-numbered` adds the states.",
      ],
    ],
    a11y: [
      'Mark the current step with `aria-current="step"`; it is the only state announced.',
      'Done is visual only. Add hidden text ("completed") inside the step if it matters to the reader.',
      "Counters are generated content, but the `<ol>` already announces each position.",
    ],
    related: ["timeline", "progress"],
    keywords: "stepper wizard progress steps",
  },
  {
    slug: "toc",
    title: "Table of contents",
    group: "Navigation",
    lede: "A sticky on-page nav with an accent rail on the section in view (aequitas.js tracks it).",
    owns: [".toc"],
    anatomy: [
      ["nav.toc", "Sticky near the top of its column. Place it in an aside next to the content."],
      [
        "> ul > li > a",
        'One link per section, `href="#id"`, with a hairline rail on its start edge.',
      ],
      ["li > ul", "Optional subsections, indented one step."],
    ],
    demos: [
      {
        title: "TOC",
        html: `<nav class="toc" style="position: static; max-inline-size: 14rem" aria-label="On this page">
  <ul>
    <li><a href="#" aria-current="true">Overview</a>
      <ul><li><a href="#">Material</a></li><li><a href="#">Proportion</a></li></ul>
    </li>
    <li><a href="#">Components</a></li>
  </ul>
</nav>`,
      },
    ],
    attrs: [
      [
        "aria-current",
        "On a link: the section in view. Full text colour and an accent rail. Any value matches.",
      ],
    ],
    js: 'Watches each section a `href="#id"` link points at and sets `aria-current` on the link whose section crosses a band about a fifth of the way down the viewport, removing it from the others. Without it, set `aria-current` yourself.',
    a11y: [
      'Label the `<nav>` (`aria-label="On this page"`) so it is distinct from site navigation.',
      'aequitas.js sets `aria-current="true"` on the link for the section in view, so screen readers announce it as current.',
    ],
    related: ["tabs", "with-aside"],
    keywords: "on this page contents scrollspy",
  },
  {
    slug: "tree",
    title: "Tree",
    group: "Navigation",
    lede: "Nested details with chevrons and indent guides. For files, folders and anything hierarchical.",
    owns: [".tree"],
    anatomy: [
      ["ul.tree", "The root list, unstyled."],
      ["li > details > summary", "A branch. The summary gets a chevron that turns when open."],
      ["details > ul", "The branch's children, indented with a hairline guide."],
      ["li > a, li > span", "A leaf: a link, or a span for something not navigable."],
    ],
    demos: [
      {
        title: "Tree",
        html: `<ul class="tree" style="max-inline-size: 18rem">
  <li><details open><summary>src</summary>
    <ul>
      <li><details open><summary>tokens</summary><ul>
        <li><a href="#" aria-current="true">scale.css</a></li>
        <li><a href="#">color.css</a></li>
      </ul></details></li>
      <li><details><summary>components</summary><ul><li><a href="#">button.css</a></li></ul></details></li>
      <li><a href="#">aequitas.css</a></li>
    </ul>
  </details></li>
  <li><a href="#">README.md</a></li>
</ul>`,
      },
    ],
    attrs: [
      [
        "aria-current",
        "On a leaf link: accent text, tint and an accent edge. Use `page` for navigation, `true` for a selection.",
      ],
      ["open", "On a `<details>`: the branch starts expanded."],
    ],
    keys: [
      ["Enter / Space", "On a summary: opens or closes the branch (native)."],
      ["Tab / Shift Tab", "Moves through summaries and links in order."],
    ],
    a11y: [
      "This is nested disclosures, not an ARIA `tree`: there is no arrow-key navigation, and each summary announces its own expanded state.",
      'Don\'t add `role="tree"` without scripting the tree keyboard pattern to go with it.',
      "Wrap it in a labelled `<nav>` when it is site navigation.",
    ],
    related: ["accordion", "sidebar"],
    keywords: "file tree folders hierarchy explorer",
  },
  {
    slug: "skip-link",
    title: "Skip link",
    group: "Navigation",
    lede: "The first link on the page, hidden above the viewport until it receives keyboard focus.",
    owns: [".skip-link"],
    anatomy: [
      [
        'a.skip-link[href="#main"]',
        "The first focusable element in `<body>`. Fixed to the top-start corner, translated out of view until `:focus-visible`.",
      ],
      [
        "main#main",
        "The target. Any element with the matching `id` works; `<main>` is the usual one.",
      ],
    ],
    demos: [
      {
        title: "Skip link",
        note: "Click into the preview and press Tab: the link slides in from the top.",
        html: `<a class="skip-link" href="#examples">Skip to content</a>`,
      },
    ],
    keys: [
      [
        "Tab",
        "From the top of the page, the first press focuses the skip link and slides it into view.",
      ],
      ["Enter", "Follows it: focus moves to the target, past the navigation."],
    ],
    a11y: [
      "Put it first in `<body>`, before the navbar and sidebar, so it is the first tab stop.",
      "It stays in the accessibility tree while hidden: screen readers list it like any link.",
      'If the target is not focusable by default and focus seems to stay put in some browsers, add `tabindex="-1"` to it.',
    ],
    related: ["navbar", "sidebar", "shell"],
    keywords: "skip to content bypass blocks accessibility a11y keyboard",
  },
];
