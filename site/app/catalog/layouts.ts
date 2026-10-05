import type { Entry } from "./types";

const side = `<nav class="sidebar" aria-label="Workspace"><h6>Workspace</h6><a href="#" aria-current="page"><i class="icon" data-icon="home"></i><span>Overview</span></a><a href="#"><i class="icon" data-icon="file"></i><span>Pages</span></a><a href="#"><i class="icon" data-icon="image"></i><span>Media</span></a><a href="#"><i class="icon" data-icon="settings-gear"></i><span>Settings</span></a><footer><a href="#"><span class="avatar" data-size="s" aria-hidden="true">AL</span><span>Ada</span></a></footer></nav>`;
const main = (label = "main") => `<main class="p-5"><div class="ph">${label}</div></main>`;
const shell = (attrs: string, inner: string) =>
  `<div class="preview"><div class="shell"${attrs}>${inner}</div></div>`;

export const layouts: Entry[] = [
  {
    slug: "shell",
    title: "Shell",
    group: "Shells",
    lede: "One .shell, seven attributes. The sidebar is a container: narrow it and it becomes a rail by itself; leave it out and its column goes too.",
    owns: [".shell", ".main", ".inspector"],
    anatomy: [
      [
        ".shell",
        "Full-height grid (at least `100dvh`) that places its children by class. Under 48rem it stops being a grid: everything stacks in source order.",
      ],
      [
        "> header.navbar",
        "Optional, with `data-header`: spans the top row across every column and, from 48rem, is exactly `--header` tall, so the sticky panels line up under it. Below that it grows if its links wrap.",
      ],
      [
        "> nav.sidebar",
        "Optional. The sidebar column; see Sidebar. Sticky, scrolls on its own, and switches to its rail layout when the column is narrower than 7rem. Under 48rem it becomes a horizontally scrolling row. Without one the shell drops the side column and its area: header, main and inspector need no `--sidebar: 0`.",
      ],
      [
        "> main",
        "The working column. A `<main>` or any element with `.main`; it may shrink below its content width. With `data-fill` it is a column exactly as tall as the viewport leaves it.",
      ],
      [
        "main > [data-grow]",
        "With `data-fill`: the child that takes the height the others leave, such as a `.stage`.",
      ],
      [
        "> aside.inspector",
        "Optional, with `data-inspector`: the trailing properties column. Sticky and scrolling like the sidebar, with wider padding and a hairline on its start edge. Under 48rem it drops below the main column.",
      ],
      [
        ".inspector > header, .inspector > .tabs",
        "Optional header part, as the first child: it stays put while what follows scrolls. Each child after it scrolls on its own, so give it one body, or tab panels of which one is shown.",
      ],
    ],
    demos: [
      { title: "Default", preview: true, html: shell("", side + main()) },
      { title: "Rail · data-rail", preview: true, html: shell(" data-rail", side + main()) },
      {
        title: "Header · data-header",
        preview: true,
        html: shell(
          " data-header",
          `<header class="navbar"><strong>Northlight</strong><nav class="cluster"><a href="#" aria-current="page">Pages</a><a href="#">Media</a></nav><span class="end"><button class="btn" data-size="s" data-variant="primary">Publish</button></span></header>` +
            side +
            main(),
        ),
      },
      {
        title: "Inspector · data-inspector",
        preview: true,
        html: shell(
          " data-inspector",
          side +
            main("canvas") +
            `<aside class="inspector" aria-label="Inspector"><h6>Selection</h6><div class="field"><label for="ins-width">Width</label><input class="input" id="ins-width" value="618" /></div><div class="field"><label for="ins-opacity">Opacity</label><input type="range" id="ins-opacity" value="62" /></div><label><input type="checkbox" role="switch" checked /> Visible</label></aside>`,
        ),
      },
      {
        title: 'Trailing · data-side="end"',
        preview: true,
        html: shell(' data-side="end"', main() + side),
      },
      { title: "Floating · data-float", preview: true, html: shell(" data-float", side + main()) },
      {
        title: "Editor · no sidebar, data-header data-inspector data-float data-fill",
        note: "No sidebar, so no side column. The main column is exactly as tall as the viewport leaves it, its stage takes what the other rows leave, and the inspector's tabs stay put while its body scrolls.",
        preview: true,
        html: `<div class="preview"><div class="shell" data-header data-inspector data-float data-fill style="block-size: 26rem">
  <header class="navbar"><strong>Sketchpad</strong><span class="end"><button class="btn" data-size="s" data-variant="primary">Export</button></span></header>
  <main>
    <div class="page-header"><h4>Untitled</h4></div>
    <div class="stage" data-grow><canvas width="1600" height="900" class="bg-fill" role="img" aria-label="Preview"></canvas></div>
    <div class="cluster text-s text-muted">1600 × 900 · 16:9</div>
  </main>
  <aside class="inspector" aria-label="Inspector">
    <div class="tabs" role="tablist" aria-label="Settings">
      <button role="tab" aria-selected="true" aria-controls="ed-look" id="ed-look-tab">Look</button>
      <button role="tab" aria-selected="false" aria-controls="ed-out" id="ed-out-tab">Output</button>
    </div>
    <div role="tabpanel" id="ed-look" aria-labelledby="ed-look-tab" tabindex="0">
      <div class="stack" data-divided>
        <section class="stack gap-3"><h5 class="eyebrow">Frame</h5><div class="segmented" data-fill role="radiogroup" aria-label="Frame"><label><input type="radio" name="ed-frame" checked /><span>16:9</span></label><label><input type="radio" name="ed-frame" /><span>1:1</span></label><label><input type="radio" name="ed-frame" /><span>9:16</span></label></div></section>
        <section class="stack gap-3"><h5 class="eyebrow">Colour</h5><div class="field"><label for="ed-op">Opacity</label><input type="range" id="ed-op" value="62" /></div></section>
        <section class="stack gap-3"><h5 class="eyebrow">Labels</h5><label><input type="checkbox" role="switch" checked /> Show numbers</label></section>
      </div>
    </div>
    <div role="tabpanel" id="ed-out" aria-labelledby="ed-out-tab" tabindex="0" hidden><p class="text-s text-muted">Output settings.</p></div>
  </aside>
</div></div>`,
      },
    ],
    attrs: [
      [
        "data-rail",
        "Narrows the sidebar column to `--rail`. The sidebar notices its own width: headings and group summaries hide, labels drop under the icons.",
      ],
      [
        "data-collapsible",
        "Full sidebar from 64rem, a rail below that. No script: it follows the viewport width.",
      ],
      [
        "data-header",
        "Adds a top row that a `.navbar` child spans across every column. The navbar is made exactly `--header` tall from 48rem, so nothing needs measuring.",
      ],
      [
        ".shell[--header=<length>]",
        "Height of the header row and of its navbar (from 48rem; below, the navbar's minimum). The sidebar and inspector stick this far from the top and shorten by the same amount. With `data-header` φ^2.5 ≈ 3.3 units (`--ae-unit`, so it follows the density), else `0px`.",
      ],
      [
        "data-inspector",
        "Adds a third, trailing column for an `.inspector`, `--inspector` wide. Combines with `data-header`.",
      ],
      [
        "data-side=end",
        "Moves the sidebar to the trailing side and its hairline to the start edge. Default start. With `data-inspector`, the inspector moves to the start.",
      ],
      [
        "data-float",
        "Insets the shell by a step on every side and floats the sidebar and the inspector as glass panels with shadow and frost edge. With `data-header` they stick a step below the header. Under 48rem they lie flat again.",
      ],
      [
        "data-fill",
        "Makes the shell exactly one viewport tall, for editors: nothing scrolls the page. Main becomes a column of the height the header, padding and gaps leave (scrolling if its content needs more), and its `[data-grow]` child takes what the other children leave. The side panels scroll inside their rows. Under 48rem the shell stacks and the page scrolls as usual.",
      ],
      [
        "main > [data-grow]",
        "With `data-fill`: grows to fill the main column. It shrinks only as far as its flex minimum: a scrolling element to nothing, a `.stage` to its φ⁵ ≈ 11rem, anything else to its content, after which main scrolls.",
      ],
      [".shell[--sidebar=<length>]", "Sidebar column width. Default φ⁶ ≈ 18rem."],
      [
        ".shell[--rail=<length>]",
        "Sidebar width with `data-rail` or a collapsed `data-collapsible`. Default φ³ ≈ 4.2rem; keep it under 7rem or the sidebar keeps its full layout.",
      ],
      [".shell[--inspector=<length>]", "Inspector column width. Default φ⁶ ≈ 18rem."],
    ],
    a11y: [
      "The working column should be the `<main>` landmark, and a `.skip-link` pointing at it the first thing in `<body>`, so keyboard users can pass the sidebar.",
      'With a `.navbar` and a `nav.sidebar` there are two `<nav>` landmarks: give each an `aria-label` ("Primary", "Workspace"). Give an `aside.inspector` one too.',
      'Columns are placed by grid area, so source order is free; under 48rem the shell stacks in source order. With `data-side="end"` put the sidebar after `<main>` in the markup if it should also be read after it.',
      'With `data-fill` the page itself never scrolls from 48rem up: main and the side panels scroll inside. Not every browser lets the keyboard into a scroller that holds nothing focusable (Safari doesn\'t), so give such a scroller `tabindex="0"` (a tab panel without controls, as in the demo), and make `<main tabindex="-1">` the skip link\'s target. A `.stage` scales its media down instead of clipping it.',
      "From 48rem the navbar is exactly `--header` tall; below that it is at least that tall and grows when its links wrap, so zoomed and reflowed text stays inside it.",
      'In the rail the labels are still there, only smaller (or visually hidden with the sidebar\'s `data-labels="hidden"`): keep each label in its `<span>` so the link has a name, and hide glyph icons with `aria-hidden="true"`.',
    ],
    related: ["sidebar", "navbar", "master-detail"],
    keywords: "app shell sidebar rail inspector layout frame chrome editor viewport fill",
  },
  {
    slug: "container",
    title: "Container and stacks",
    group: "Pages",
    lede: "Page width is φ⁹ rem; text measure is 40ch·φ. Stack and cluster carry the rhythm.",
    owns: [".container", ".measure", ".stack", ".cluster", ".section", ".golden"],
    anatomy: [
      [
        ".container",
        "Centres a block at the page width (`--ae-container`, φ⁹ ≈ 76rem) and keeps a gutter on each side when the viewport is narrower.",
      ],
      [
        ".measure",
        "Caps a block at the text measure (`--ae-measure`, 40ch·φ ≈ 65ch). Use it for running text outside `.prose`.",
      ],
      [
        ".stack",
        "Vertical flex column, one unit (`--ae-space-4`) between children. Change the gap with `.gap-1` … `.gap-8`. With `data-divided`, a hairline between children.",
      ],
      [
        ".cluster",
        "Flex row that wraps and centres items vertically, with a gap of 1/φ unit. Also takes `.gap-n`.",
      ],
      [
        "> .end",
        "On an item in a cluster (or any flex row): pushes it and everything after it to the end.",
      ],
      [
        ".section",
        "Vertical rhythm between page bands: block padding of φ³ rem (`--ae-space-7`) above and below.",
      ],
      [".golden", "Any box at the golden ratio: `aspect-ratio` φ : 1 (`--ae-ratio`)."],
    ],
    demos: [
      {
        title: "Container sizes",
        html: `<div class="stack gap-1 bg-fill p-2">
  <div class="container ph" data-size="s">s · φ⁸ ≈ 47rem</div>
  <div class="container ph">m · φ⁹ ≈ 76rem</div>
  <div class="container ph" data-size="l">l · 96rem</div>
  <div class="container ph" data-size="full">full</div>
</div>`,
      },
      {
        title: "Stack and cluster",
        html: `<div class="stack gap-3">
  <div class="cluster"><span class="ph">cluster</span><span class="ph">wraps</span><span class="ph">inline</span><span class="ph end">end</span></div>
  <div class="stack gap-2"><div class="ph">stack</div><div class="ph">vertical</div></div>
</div>`,
      },
      {
        title: "Divided stack · data-divided",
        html: `<div class="stack" data-divided style="max-inline-size: 20rem">
  <section class="stack gap-2"><h4 class="eyebrow">Frame</h4><p class="text-s text-muted">Aspect and margins.</p></section>
  <section class="stack gap-2"><h4 class="eyebrow">Colour</h4><p class="text-s text-muted">Palette and opacity.</p></section>
  <section class="stack gap-2"><h4 class="eyebrow">Labels</h4><p class="text-s text-muted">Numbers and names.</p></section>
</div>`,
      },
      {
        title: "Section and golden",
        html: `<div class="bg-fill">
  <section class="section container">
    <div class="golden ph place-center" style="max-inline-size: 16rem">φ : 1</div>
  </section>
</div>`,
      },
    ],
    attrs: [
      [
        ".container[data-size]",
        "Narrower or wider page. Default φ⁹ ≈ 76rem; `s` is φ⁸ ≈ 47rem, `l` φ^9.5 ≈ 97rem, `full` the whole width less the gutters.",
      ],
      [".container[--ae-container=<length>]", "Any other cap width. This is what `s` and `l` set."],
      [
        ".stack[data-divided]",
        "Divides the children with a hairline: every child after the first gets the line along its top. `data-divided` sets its own step, φ ≈ 1.6 units (`--ae-space-5`), on both sides of the line; a `.gap-n` changes only the space above it. A border, not a shadow, so a child's own shadow is kept.",
      ],
      [".measure[--ae-measure=<length>]", "Any other line length. Default 40ch·φ."],
    ],
    a11y: [
      "These are layout only: they add no landmarks or roles. Put the page's `<main>`, `<header>` and `<section>` elements inside or around them.",
      "Stacks and clusters keep source order, so reading and tab order match what is seen. Keep `.measure` on long text so lines stay readable at any zoom.",
    ],
    related: ["split", "grid", "prose"],
    keywords: "container max-width measure stack cluster section golden ratio layout wrapper",
  },
  {
    slug: "split",
    title: "Split",
    group: "Pages",
    lede: "Two columns in 1 : φ, wrapping when narrower than twice the basis.",
    owns: [".split"],
    anatomy: [
      [".split", "Wrapping flex row. Exactly two children."],
      ["> :first-child", "The narrow side, growing 1 (φ with `data-flip`)."],
      [
        "> :last-child",
        "The wide side, growing φ (1 with `data-flip`). The narrow side keeps at least `--basis`, the wide side `--basis · φ`; below that they wrap onto two rows, so side by side the ratio is always exact.",
      ],
    ],
    demos: [
      {
        title: "Split",
        html: `<div class="split"><div class="ph" style="min-block-size: 6rem">1</div><div class="ph">φ</div></div>`,
      },
      {
        title: "Flipped",
        html: `<div class="split" data-flip><div class="ph" style="min-block-size: 6rem">φ</div><div class="ph">1</div></div>`,
      },
    ],
    attrs: [
      [
        "data-flip",
        "Swaps the ratio so the first child is the wide one. The order stays the same.",
      ],
      [
        "--basis=<length>",
        "Minimum width of each side; the split wraps when it can't give both. Default φ⁶ ≈ 18rem.",
      ],
    ],
    a11y: [
      "`data-flip` changes widths, not order: reading and tab order follow the markup, so put first what should be read first and flip the ratio to suit.",
    ],
    related: ["panes", "with-aside"],
    keywords: "two columns sidebar golden ratio layout",
  },
  {
    slug: "grid",
    title: "Grid, bento, masonry",
    group: "Pages",
    lede: "Auto-fit grids with a φ⁶ minimum, dense bento spans, and CSS-columns masonry.",
    owns: [".grid", ".bento", ".masonry"],
    anatomy: [
      [
        ".grid",
        "Auto-fit grid: as many equal columns of at least `--min` as fit, never wider than the container.",
      ],
      [
        ".bento",
        "Auto-fit grid of φ⁵ cells with dense packing: later items fill holes left by wide ones.",
      ],
      [
        ".bento > [data-span] / [data-rows]",
        "Optional spans on a cell. Under 48rem every cell drops back to one.",
      ],
      [
        ".masonry",
        "CSS columns of at least `--min`. Items flow down the first column, then the next, and never break across two.",
      ],
    ],
    demos: [
      {
        title: "Grid",
        html: `<div class="grid" style="--min: 8rem"><div class="ph">a</div><div class="ph">b</div><div class="ph">c</div><div class="ph">d</div></div>`,
      },
      {
        title: "Bento",
        html: `<div class="bento">
  <div class="card" data-span="2" data-rows="2"><div class="stat"><b>12,480</b><span>Active users</span></div></div>
  <div class="card"><div class="stat"><b>98.2%</b><span>Uptime</span></div></div>
  <div class="card"><span class="delta" data-trend="up">+12.4%</span><p class="text-s text-muted">Conversion</p></div>
  <div class="card" data-span="2"><p class="text-s text-muted">Wide card</p></div>
</div>`,
      },
      {
        title: "Masonry",
        html: `<div class="masonry" style="--min: 9rem">
  <div class="ph" style="min-block-size: 5rem">a</div><div class="ph" style="min-block-size: 9rem">b</div><div class="ph" style="min-block-size: 6rem">c</div>
  <div class="ph" style="min-block-size: 7rem">d</div><div class="ph" style="min-block-size: 4rem">e</div><div class="ph" style="min-block-size: 8rem">f</div>
</div>`,
      },
    ],
    attrs: [
      [".grid[--min=<length>]", "Minimum column width. Default φ⁶ ≈ 18rem."],
      ["data-span=2|3", "On a `.bento` child: spans that many columns."],
      ["data-rows=2", "On a `.bento` child: spans two rows."],
      [".bento[--min=<length>]", "Minimum cell width and row height. Default φ⁵ ≈ 11rem."],
      [".masonry[--min=<length>]", "Minimum column width. Default φ⁶ ≈ 18rem."],
    ],
    a11y: [
      "Masonry fills top to bottom, column by column, so the eye scans across while reading and tab order go down. Use it for items whose order doesn't matter.",
      "Bento's dense packing can move a later item into an earlier hole, so the visual order may not match the tab order. Keep focusable cells in an order that still makes sense.",
    ],
    related: ["container", "switcher"],
    keywords: "auto-fit columns tiles dashboard pinterest",
  },
  {
    slug: "switcher",
    title: "Switcher and row",
    group: "Pages",
    lede: "Side by side until the container is narrower than --threshold, then stacked; or equal columns in a row.",
    owns: [".switcher", ".row"],
    anatomy: [
      [
        ".switcher",
        "Wrapping flex row. Its children share the width equally until the switcher is narrower than `--threshold`, then each takes a full row. All switch at once, never two-and-one.",
      ],
      [".row", "One row of equal columns, however many children. Stacks under a 48rem viewport."],
    ],
    demos: [
      {
        title: "Switcher",
        html: `<div class="switcher"><div class="ph">one</div><div class="ph">two</div><div class="ph">three</div></div>`,
      },
      {
        title: "Row",
        html: `<div class="row"><div class="ph">one</div><div class="ph">two</div></div>`,
      },
    ],
    attrs: [
      [
        ".switcher[--threshold=<length>]",
        "Container width below which the children stack. Default φ^7.5 ≈ 37rem.",
      ],
    ],
    a11y: [
      "Switching only changes the layout: the children keep their source order when they stack, so write them in reading order.",
      "The switcher responds to its own width, not the viewport's, so it also stacks when zoomed text makes the container narrow.",
    ],
    related: ["grid", "split"],
    keywords: "responsive columns stack equal row breakpoint container query",
  },
  {
    slug: "with-aside",
    title: "Content with aside",
    group: "Pages",
    lede: "An article beside a sticky aside, on either side; stacks under 64rem.",
    owns: [".with-aside"],
    anatomy: [
      [".with-aside", "Grid: one column under 64rem, the content plus an `--aside` column above."],
      [
        "> article",
        "The content, first in the markup. Any element works; it may shrink below its content width.",
      ],
      [
        "> aside",
        "Must be an `<aside>` element. From 64rem it sticks a step below the top of the scroller while the content scrolls past.",
      ],
    ],
    demos: [
      {
        title: "With aside",
        html: `<div class="with-aside"><article class="ph" style="min-block-size: 9rem">article</article><aside class="ph">aside · sticky</aside></div>`,
      },
    ],
    attrs: [
      ["data-side=start", "From 64rem, puts the aside before the content. Default end."],
      ["--aside=<length>", "Aside column width. Default φ⁶ ≈ 18rem."],
    ],
    a11y: [
      '`data-side="start"` moves the aside with `order`, so it shows first but is still read and tabbed after the article. If it should be read first (a table of contents, say), the markup order is what counts.',
      "An `<aside>` is a complementary landmark; give it an `aria-label` when the page has more than one.",
    ],
    related: ["toc", "split"],
    keywords: "sidebar sticky aside article two columns",
  },
  {
    slug: "cover",
    title: "Cover and centre",
    group: "Pages",
    lede: "Full-height pages: a cover with header and footer and a centred middle, or one centred thing.",
    owns: [".cover", ".center"],
    anatomy: [
      [
        ".cover",
        "Full-height flex column (at least `100dvh`) with gutter padding and a step between children.",
      ],
      ["> header", "Optional, first: sits flush with the top."],
      [
        "> [data-center]",
        "The middle. Auto margins push it to the vertical centre of the space left over.",
      ],
      ["> footer", "Optional, last: sits flush with the bottom."],
      [".center", "Full-height grid with gutter padding that centres its one child both ways."],
      [".center > *", "The single child, as wide as the space allows up to φ⁷ ≈ 29rem."],
    ],
    demos: [
      {
        title: "Cover",
        preview: true,
        html: `<div class="preview"><div class="cover" style="min-block-size: 14rem">
  <header class="cluster"><strong>aequitas</strong><a class="end" href="#">Docs</a></header>
  <div data-center class="stack text-center"><h3>Centred, whatever the height.</h3></div>
  <footer class="text-s text-muted">© 2026</footer>
</div></div>`,
      },
      {
        title: "Centre",
        preview: true,
        html: `<div class="preview"><div class="center" style="min-block-size: 14rem"><div class="card stack gap-3" style="max-inline-size: 18rem"><h4>Sign in</h4><input class="input" type="email" placeholder="Email" aria-label="Email" /><button class="btn" data-variant="primary">Continue</button></div></div></div>`,
      },
    ],
    attrs: [
      [
        "data-center",
        "On one child of `.cover`: centres it vertically between whatever comes before and after.",
      ],
    ],
    a11y: [
      "When a cover or centre is the whole page, the centred part is the content: make it (or the `.center` itself) the `<main>` landmark, with `<header>` and `<footer>` around it.",
    ],
    related: ["panes", "page"],
    keywords: "full height hero splash centre center vertical login",
  },
  {
    slug: "panes",
    title: "Panes",
    group: "Pages",
    lede: "Two full-height panes in 1 : φ. The quiet side and the working side.",
    owns: [".panes"],
    anatomy: [
      [".panes", "Full-height grid (at least `100dvh`): one column under 64rem, 1 : φ above."],
      [
        "> section",
        "Two panes. Each centres its content vertically, padded `--ae-space-7` block and a gutter inline. Add `.bg-fill` to the quiet one.",
      ],
    ],
    demos: [
      {
        title: "Panes",
        preview: true,
        html: `<div class="preview"><div class="panes" style="min-block-size: 16rem">
  <section class="bg-fill"><div class="stack gap-2"><h4>Welcome back</h4><p class="text-muted text-s">The quiet side.</p></div></section>
  <section><form class="stack gap-3" style="max-inline-size: 22rem"><div class="field"><label for="pn-email">Email</label><input class="input" id="pn-email" type="email" /></div><button class="btn" data-variant="primary" type="button">Sign in</button></form></section>
</div></div>`,
      },
    ],
    attrs: [
      ["data-flip", "From 64rem, makes the first pane the wide one. The order stays the same."],
    ],
    a11y: [
      "`data-flip` swaps the widths, not the panes. Under 64rem they stack in markup order, so the quiet side, if it comes first, sits above the form on a phone.",
      "Make the working pane the `<main>` landmark, or wrap both panes in one, so the form is reachable from the landmark list.",
    ],
    related: ["split", "cover"],
    keywords: "two panes split screen login sign in auth",
  },
  {
    slug: "prose",
    title: "Prose",
    group: "Pages",
    lede: "Long-form text with its rhythm on φ and headings one step down from the page scale.",
    owns: [".prose"],
    anatomy: [
      [
        ".prose",
        "Wrapper for rendered text, capped at the text measure. Direct children are spaced one unit apart.",
      ],
      [
        "> h2 / h3 / h4",
        "Headings, one size step down from the page scale, with a wider gap above and a narrow one below.",
      ],
      ["> p.lead", "Optional opening paragraph, set larger and muted: the typography `.lead`."],
      [
        "> figure / pre / table / .code / .media / blockquote",
        "Block content, given more room above and below than paragraphs.",
      ],
      ["> hr", "Section break with the widest gap."],
      ["img", "Images anywhere inside fill the measure."],
    ],
    demos: [
      {
        title: "Prose",
        html: `<div class="prose">
  <h2>On proportion</h2>
  <p class="lead">Long-form text gets its rhythm from the same ratio as the interface around it.</p>
  <p>Paragraphs are spaced one unit apart; headings open a φ² gap above and close a φ⁻¹ gap below.</p>
  <h3>A smaller heading</h3>
  <p>Headings inside prose step down one notch, so an article never shouts over its own chrome.</p>
  <blockquote>Good design is as little design as possible.<cite>Dieter Rams</cite></blockquote>
</div>`,
      },
    ],
    a11y: [
      "Headings shrink but keep their level. Choose `h2`, `h3`, `h4` for the outline under the page's `h1`, not for the size you want.",
    ],
    related: ["typography", "container"],
    keywords: "article markdown rich text content typography",
  },
  {
    slug: "settings",
    title: "Settings",
    group: "Application",
    lede: "Preference rows: label and description at the start, the control at the end.",
    owns: [".settings"],
    anatomy: [
      [
        ".settings",
        "The group: a raised panel with shadow and frost edge. Rows are divided by hairlines.",
      ],
      ["> h6", "Optional group heading above the rows."],
      [
        "> .setting",
        "One row: two columns, text and control. Under 40rem the control drops below the text.",
      ],
      [
        "> .setting > div",
        "The text: a `<b>` name and an optional `<small>` description, shown muted.",
      ],
      ["> .setting > :last-child", "The control: a switch, segmented control, select or button."],
    ],
    demos: [
      {
        title: "Settings",
        html: `<div class="settings" style="max-inline-size: 36rem">
  <h6>General</h6>
  <div class="setting"><div><b id="st-ap">Appearance</b><small>Follows the system unless you choose.</small></div><div class="segmented" role="radiogroup" aria-labelledby="st-ap"><label><input type="radio" name="ap" /><span>Light</span></label><label><input type="radio" name="ap" checked /><span>Auto</span></label><label><input type="radio" name="ap" /><span>Dark</span></label></div></div>
  <div class="setting"><div><b id="st-rt">Reduce transparency</b><small id="st-rt-d">Solid surfaces instead of glass.</small></div><input type="checkbox" role="switch" aria-labelledby="st-rt" aria-describedby="st-rt-d" /></div>
  <div class="setting"><div><b id="st-ac">Accent</b></div><div class="select"><select class="input" aria-labelledby="st-ac"><option>Blue</option><option>Purple</option><option>Graphite</option></select></div></div>
</div>`,
      },
    ],
    a11y: [
      "The `<b>` name is not a label. Tie it to the control: give the name an `id` and the control `aria-labelledby`, or make the name a `<label for>`; point `aria-describedby` at the `<small>`.",
      'A group of radios (as in a segmented control) needs the name too: put `aria-labelledby` on the `role="radiogroup"` element.',
    ],
    related: ["list", "form-layouts"],
    keywords: "preferences options toggles rows",
  },
  {
    slug: "master-detail",
    title: "Master–detail",
    group: "Application",
    lede: "A list beside its detail. Under 48rem only one shows, chosen with data-view.",
    owns: [".master-detail"],
    anatomy: [
      [
        ".master-detail",
        "Full-height grid (at least `100dvh`): a φ⁶ ≈ 18rem list column and the detail. One column under 48rem.",
      ],
      [
        "> :first-child",
        "The master, usually a `.list`. Scrolls on its own, with a hairline on its end edge.",
      ],
      ["> :last-child", "The detail of the selected item."],
    ],
    demos: [
      {
        title: "Master–detail",
        preview: true,
        html: `<div class="preview"><div class="master-detail" style="min-block-size: 14rem">
  <div class="list" style="box-shadow: none">
    <a href="#" aria-current="page">Northlight <span class="end caption">2h</span></a>
    <a href="#">Atlas <span class="end caption">1d</span></a>
    <a href="#">Harbor <span class="end caption">3d</span></a>
  </div>
  <div class="p-5 stack gap-3"><div class="page-header"><div><h6>Project</h6><h4>Northlight</h4></div><button class="btn" data-size="s">Edit</button></div><p class="text-muted text-s">Detail pane.</p></div>
</div></div>`,
      },
    ],
    attrs: [
      [
        "data-view=list|detail",
        "Under 48rem, which side shows; the other is hidden. Default `list`. Switching it is up to you.",
      ],
    ],
    a11y: [
      'Under 48rem the hidden side is `display: none`, gone for screen readers too. When you switch to `detail`, move focus to its heading and offer a way back that sets `data-view="list"`.',
      'Mark the selected row with `aria-current="page"` (or `"true"`) so the list says which item the detail belongs to. The `.list` tints it and draws the accent edge.',
    ],
    related: ["shell", "list"],
    keywords: "list detail split view inbox",
  },
  {
    slug: "page",
    title: "Page, bleed, overlay",
    group: "Application",
    lede: "A sticky-footer page, a full-bleed section, and an overlay that covers its parent.",
    owns: [".page", ".bleed", ".overlay"],
    anatomy: [
      [".page", "Full-height flex column (at least `100dvh`), often the `<body>` itself."],
      [
        ".page > header / footer",
        "Optional, at their natural height. The footer stays at the bottom however short the page.",
      ],
      [".page > main", "Must be a `<main>` element: it grows to fill the space between."],
      [
        ".bleed",
        "A section inside a centred container that breaks out to the full viewport width.",
      ],
      [
        ".overlay",
        "Covers its parent edge to edge with a blurred, translucent veil and centres its content (a spinner, a message). The parent is made `position: relative` for you.",
      ],
    ],
    demos: [
      {
        title: "Page",
        preview: true,
        html: `<div class="preview"><div class="page" style="min-block-size: 12rem"><header class="p-3 text-s">header</header><main class="p-3 ph">main grows</main><footer class="p-3 text-s text-muted">footer</footer></div></div>`,
      },
      {
        title: "Overlay",
        html: `<div class="card" style="min-block-size: 8rem"><p class="text-muted text-s">Content underneath.</p><div class="overlay"><span class="spinner" role="status" aria-label="Loading"><span></span></span></div></div>`,
      },
    ],
    a11y: [
      "`.page` only grows a `<main>`, so the landmark comes with the layout; keep the site header and footer as `<header>` and `<footer>` beside it.",
      'An `.overlay` blocks the pointer, not the keyboard: the content under it stays focusable. Set `inert` on that content, or `aria-busy="true"` on the parent while it loads.',
    ],
    related: ["cover", "card"],
    keywords: "sticky footer full bleed overlay veil loading",
  },
  {
    slug: "snap",
    title: "Snap sections",
    group: "Application",
    lede: "Full-screen sections that snap on scroll, for presentations and landing stories.",
    owns: [".snap"],
    anatomy: [
      [
        ".snap",
        "A viewport-tall scroller (`100dvh`) with mandatory vertical snapping and no visible scrollbar.",
      ],
      [
        "> section",
        "Each slide: at least the viewport tall, snaps to its top edge, centres its content vertically.",
      ],
    ],
    demos: [
      {
        title: "Snap",
        preview: true,
        html: `<div class="preview"><div class="snap" style="block-size: 14rem"><section style="min-block-size: 14rem"><h3>One</h3></section><section class="bg-fill" style="min-block-size: 14rem"><h3>Two</h3></section><section style="min-block-size: 14rem"><h3>Three</h3></section></div></div>`,
      },
    ],
    a11y: [
      'The scrollbar is hidden, so nothing shows there is more. Make the scroller keyboard-reachable (a focusable control in each section, or `tabindex="0"` and an `aria-label` on the `.snap`) so arrow keys and Page Down work.',
      "Snapping is mandatory: a section with more content than the viewport can be hard to read to the end. Keep each one short enough to fit.",
    ],
    related: ["cover", "carousel"],
    keywords: "slides fullpage presentation scroll snap story",
  },
];
