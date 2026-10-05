import type { Entry } from "./types";

export const data: Entry[] = [
  {
    slug: "table",
    title: "Table",
    group: "Data display",
    lede: "Hairlines between rows only. Sortable headers, a selection column, striped and compact variants.",
    owns: [".table", ".table-scroll"],
    anatomy: [
      [".table-scroll", "Optional wrapper that scrolls a wide table sideways instead of the page."],
      [
        "table.table",
        "A real `<table>` with `<thead>` and `<tbody>`. Numbers are tabular; rows hover-tint.",
      ],
      [
        "th[aria-sort]",
        "Optional sortable header. Draws a triangle that turns with the direction.",
      ],
      [
        "th > input[type=checkbox]",
        "Optional selection column: a cell holding only a checkbox shrinks to fit it.",
      ],
      ["td[data-num]", "Numeric cells and their header align to the end."],
    ],
    demos: [
      {
        title: "Table",
        html: `<div class="table-scroll">
  <table class="table" data-size="s" data-striped>
    <thead>
      <tr>
        <th><input type="checkbox" aria-label="Select all" /></th>
        <th aria-sort="ascending">Project</th>
        <th aria-sort="none">Owner</th>
        <th aria-sort="none" data-num>Pages</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr aria-selected="true"><td><input type="checkbox" checked aria-label="Select Atlas" /></td><td>Atlas</td><td>Mika</td><td data-num>42</td><td><span class="dot" data-tone="warning"></span> Review</td></tr>
      <tr><td><input type="checkbox" aria-label="Select Harbor" /></td><td>Harbor</td><td>Jun</td><td data-num>9</td><td><span class="dot"></span> Draft</td></tr>
      <tr><td><input type="checkbox" aria-label="Select Northlight" /></td><td>Northlight</td><td>Ada</td><td data-num>128</td><td><span class="dot" data-tone="success"></span> Live</td></tr>
    </tbody>
  </table>
</div>`,
      },
      {
        title: "Busy",
        note: "aria-busy dims the rows and pulses three squares over them.",
        html: `<table class="table" aria-busy="true">
  <thead><tr><th>Project</th><th data-num>Pages</th></tr></thead>
  <tbody>
    <tr><td>Atlas</td><td data-num>42</td></tr>
    <tr><td>Harbor</td><td data-num>9</td></tr>
  </tbody>
</table>`,
      },
    ],
    attrs: [
      [
        "data-num",
        "On a `th` or `td`: aligns the cell to the end, for figures that should line up.",
      ],
      [
        "th[aria-sort=ascending|descending|none]",
        "Sortable header. `none` shows a faint triangle; the other two show it solid, pointing the sort direction.",
      ],
      [
        "tr[aria-selected=true]",
        "Tints the row with the accent, for rows ticked in the selection column.",
      ],
      ["data-striped", "Tints every even body row."],
      ["data-size=s", "Tighter cell padding and smaller type, for dense data."],
      ["data-sticky", "Header cells stick to the top of the nearest scrolling ancestor."],
      ["data-fixed", "Fixed table layout: column widths come from the first row, not the content."],
      ["data-hover=false", "Turns off the row hover tint, for tables whose rows do nothing."],
      [
        "aria-busy=true",
        "Dims the content and pulses three squares over it; the table ignores the pointer.",
      ],
    ],
    js: 'With checkboxes in the `tbody`, a checkbox in the `thead` selects or clears every row, each checked row gets `aria-selected="true"`, the header box turns indeterminate for a partial selection, and a sibling `.selection-bar` shows the count. Without it, the checkboxes are plain inputs and the rows tint only where you set `aria-selected`.',
    a11y: [
      "`aria-sort` only draws the arrow; sorting is up to you. Put a `<button>` inside the `th` so the header can be sorted from the keyboard.",
      "`aria-selected` is not announced on rows of a plain table. The row's checkbox carries the state; give each one an `aria-label` naming the row.",
      'Keep `<th>` in `<thead>` so cells are announced with their column; use `<th scope="row">` for a row header.',
      'A `.table-scroll` wrapper that overflows needs `tabindex="0"` and an `aria-label` in browsers that don\'t make scroll containers focusable.',
    ],
    related: ["list", "stat", "dot", "checkbox"],
    keywords: "grid data rows columns sort datatable",
  },
  {
    slug: "selection-bar",
    title: "Selection bar",
    group: "Data display",
    lede: "A frosted bar that floats in while table rows are checked: the count, and what you can do with them.",
    owns: [".selection-bar"],
    anatomy: [
      [
        ".selection-bar[hidden]",
        "After the `.table` (or its `.table-scroll`), in the same parent. Sticky to the bottom of the scroll area, centred, frosted. Starts `hidden`.",
      ],
      ["> span > [data-selected]", "The count. aequitas.js writes the number into it."],
      ["> hr", "Optional vertical hairline between groups of actions."],
      ["> .btn", "Actions on the selection. A `[data-clear]` button unchecks every row."],
    ],
    demos: [
      {
        title: "Bulk actions",
        note: "Check a row or the header box: the bar slides in with the count. The header box turns indeterminate for a partial selection.",
        html: `<div>
  <div class="table-scroll">
    <table class="table" data-size="s">
      <thead>
        <tr><th><input type="checkbox" aria-label="Select all" /></th><th>Project</th><th>Owner</th><th data-num>Pages</th></tr>
      </thead>
      <tbody>
        <tr><td><input type="checkbox" aria-label="Select Atlas" /></td><td>Atlas</td><td>Mika</td><td data-num>42</td></tr>
        <tr><td><input type="checkbox" aria-label="Select Harbor" /></td><td>Harbor</td><td>Jun</td><td data-num>9</td></tr>
        <tr><td><input type="checkbox" aria-label="Select Northlight" /></td><td>Northlight</td><td>Ada</td><td data-num>128</td></tr>
      </tbody>
    </table>
  </div>
  <div class="selection-bar" role="region" aria-label="Bulk actions" hidden>
    <span><b data-selected>0</b> selected</span>
    <button class="btn" data-size="s"><i class="icon" data-icon="archive"></i> Archive</button>
    <button class="btn" data-size="s" data-variant="primary" data-tone="danger"><i class="icon" data-icon="trash"></i> Delete</button>
    <hr />
    <button class="btn" data-size="s" data-variant="ghost" data-clear>Clear</button>
  </div>
</div>`,
      },
    ],
    attrs: [
      [
        "hidden",
        "Hides the bar. aequitas.js removes it while at least one row is checked and sets it again at zero.",
      ],
      ["data-selected", "On the element inside the bar that holds the count."],
      ["data-clear", "On a button in the bar: unchecks every row of the table."],
      ["role=region", "With an `aria-label`, makes the bar a landmark people can jump to."],
    ],
    js: "A checkbox in the table's `thead` checks or unchecks every `tbody` checkbox. Any change sets `aria-selected=\"true\"` on checked rows, makes the header box indeterminate for a partial selection, writes the count into `[data-selected]` and toggles the bar's `hidden`. Without it, the checkboxes are plain inputs and the bar stays as you leave it.",
    keys: [
      ["Space", "On a row or header checkbox: toggles it, and the bar updates."],
      ["Tab", "Moves from the table into the bar's actions, which follow it in source order."],
    ],
    a11y: [
      'Give every checkbox a label naming its row (`aria-label="Select Atlas"`); the header one selects all.',
      'The count changes silently. If people need to hear it, add `aria-live="polite"` to the count\'s parent.',
      "Keep the bar right after the table in the markup so Tab reaches it next, whatever its sticky position on screen.",
    ],
    related: ["table", "toolbar", "form-layouts"],
    keywords: "bulk actions selection bar batch select all table rows",
  },
  {
    slug: "stat",
    title: "Stat",
    group: "Data display",
    lede: "A big tabular number over a small label. A row of them divides with hairlines on wide screens.",
    owns: [".stats", ".stat"],
    anatomy: [
      [
        ".stats",
        "Optional auto-fit grid of stats. From 48rem each stat after the first draws a hairline on its start edge.",
      ],
      ["> .stat", "One figure. Stacks its two children."],
      ["> b", "The number: large, light, tabular."],
      ["> span", "The label: small and muted. May hold a `.delta`."],
    ],
    demos: [
      {
        title: "Stats",
        html: `<div class="stats">
  <div class="stat"><b>12,480</b><span>Active users</span></div>
  <div class="stat"><b>98.2%</b><span>Uptime</span></div>
  <div class="stat"><b>€48k</b><span>MRR <span class="delta" data-trend="up">+12.4%</span></span></div>
</div>`,
      },
      {
        title: "Single",
        html: `<div class="stat"><b>128</b><span>Pages published</span></div>`,
      },
    ],
    a11y: [
      'The number is read before its label ("12,480 Active users"). Keep that order in the markup; the visual order follows it.',
      "Abbreviated figures such as `€48k` are read literally. Write the full value in the label, or in `.sr-only` text, when precision matters.",
    ],
    related: ["delta", "table", "hero"],
    keywords: "kpi metric figure number statistic",
  },
  {
    slug: "delta",
    title: "Delta",
    group: "Data display",
    lede: "A change in a figure: a small triangle and the value, green going up, red going down.",
    owns: [".delta"],
    anatomy: [
      ["span.delta", "The change as text, with the sign. The triangle is drawn before it."],
    ],
    demos: [
      {
        title: "Delta",
        html: `<div class="cluster">
  <span class="delta" data-trend="up">+12.4%</span>
  <span class="delta" data-trend="down">−3.1%</span>
  <span class="delta" data-trend="flat">0.0%</span>
</div>`,
      },
    ],
    attrs: [
      [
        "data-trend",
        "Direction. `up` is success-coloured with the triangle pointing up, `down` danger-coloured and turned over, `flat` a muted bar. Without it the triangle points up in muted text.",
      ],
    ],
    a11y: [
      "Colour and triangle are visual only. Keep the sign in the text (`+12.4%`, `−3.1%`) so the direction is announced.",
      "The colour follows direction, not meaning: a falling churn rate still shows red. Say what improved in the surrounding label when that matters.",
    ],
    related: ["stat", "badge", "board"],
    keywords: "trend change increase decrease percent",
  },
  {
    slug: "badge",
    title: "Badge",
    group: "Data display",
    lede: "A small tinted label. Tone-aware; solid and outline variants when the tint is not enough.",
    owns: [".badge"],
    anatomy: [["span.badge", "Short text. May hold a leading `.icon`; the gap is set for you."]],
    demos: [
      {
        title: "Badges",
        html: `<div class="cluster">
  <span class="badge">Draft</span>
  <span class="badge" data-tone="success">Published</span>
  <span class="badge" data-tone="warning">Review</span>
  <span class="badge" data-tone="danger">Blocked</span>
  <span class="badge" data-tone="info">Scheduled</span>
  <span class="badge" data-variant="solid" data-tone="success">Solid</span>
  <span class="badge" data-variant="outline">Outline</span>
  <span class="badge" data-dot data-tone="danger">Live</span>
  <span class="badge" data-size="l"><i class="icon" data-icon="check" data-size="s"></i> Large</span>
</div>`,
      },
    ],
    attrs: [
      [
        "data-tone=accent|success|warning|danger|info",
        "Colours the tint, the text, the outline and the dot. Default accent.",
      ],
      [
        "data-variant",
        "`solid` fills with the tone; `outline` drops the fill for a thin ring. Default light tint.",
      ],
      ["data-dot", "Adds a small square in the tone before the text."],
      ["data-size", "Larger padding and type. Default extra small."],
    ],
    a11y: [
      'A badge is plain text. Its tone adds no meaning for screen readers, so the word itself must say the status ("Blocked", not a red blank).',
      'A count badge next to a control ("Inbox 3") is read as part of the surrounding text; label the control so the number makes sense, e.g. "3 unread".',
    ],
    related: ["chip", "dot", "delta"],
    keywords: "label tag pill status",
  },
  {
    slug: "chip",
    title: "Chip",
    group: "Data display",
    lede: "A removable tag, or a filter when it wraps a checkbox.",
    owns: [".chip"],
    anatomy: [
      ["span.chip", "Removable tag: the label text, then an optional remove button."],
      [
        "> button",
        'Optional remove control, sized to the text. With `data-dismiss=".chip"` aequitas.js removes the chip.',
      ],
      ["label.chip", "Filter chip: a `<label>` wrapping its checkbox."],
      [
        "> input[type=checkbox]",
        "Stretched invisibly over the chip. Checked, the chip tints in its tone and draws an edge along the bottom.",
      ],
    ],
    demos: [
      {
        title: "Removable",
        html: `<div class="cluster gap-2">
  <span class="chip">Design <button data-dismiss=".chip" aria-label="Remove Design">×</button></span>
  <span class="chip">CSS <button data-dismiss=".chip" aria-label="Remove CSS">×</button></span>
</div>`,
      },
      {
        title: "Filters",
        html: `<div class="cluster gap-2">
  <label class="chip"><input type="checkbox" checked /> Design</label>
  <label class="chip"><input type="checkbox" /> Engineering</label>
  <label class="chip" data-tone="success"><input type="checkbox" checked /> Shipped</label>
</div>`,
      },
    ],
    attrs: [
      [
        "data-tone=accent|success|warning|danger|info",
        "On a filter chip, colours the checked tint and edge. Default accent.",
      ],
      [
        "button[data-dismiss=<selector>]",
        "On the remove button: aequitas.js removes the closest match. Without a value it removes the closest `.alert`, `.toast` or `.chip`.",
      ],
    ],
    js: "Clicking a `[data-dismiss]` button removes the closest chip (or whatever selector it names). Without aequitas.js the button renders but does nothing; filter chips are plain checkboxes and need no script.",
    keys: [
      ["Space", "Toggles a filter chip's checkbox."],
      ["Enter / Space", "Activates the remove button."],
    ],
    a11y: [
      'The remove button shows only `×`; give it an `aria-label` that names the chip ("Remove Design").',
      "Removing a chip moves nothing on its own; when focus was on the button, move it to the next chip or the input that made it.",
      "Filter chips are real checkboxes inside a `<label>`, so they announce their checked state. The state is shown by tint and edge, not colour alone.",
    ],
    related: ["badge", "tag-input", "checkbox"],
    keywords: "tag filter token pill removable",
  },
  {
    slug: "avatar",
    title: "Avatar",
    group: "Data display",
    lede: "Square initials or an image, three sizes, an overlap group and a status corner.",
    owns: [".avatar", ".avatar-group"],
    anatomy: [
      [".avatar-group", "Optional row that overlaps its avatars, each ringed in the page colour."],
      ["span.avatar", "Initials as text, tinted in the tone, or an image."],
      ["> img", "Optional photo; covers the square."],
    ],
    demos: [
      {
        title: "Avatars",
        html: `<div class="cluster">
  <span class="avatar" data-size="s">AL</span>
  <span class="avatar">AL</span>
  <span class="avatar" data-size="l" data-tone="success">MK</span>
  <div class="avatar-group">
    <span class="avatar">AL</span><span class="avatar" data-tone="success">MK</span><span class="avatar" data-tone="danger">JR</span><span class="avatar" data-tone="info">+4</span>
  </div>
  <span class="avatar" data-status="online">AL</span>
  <span class="avatar" data-status="away" data-tone="success">MK</span>
  <span class="avatar" data-status="busy" data-tone="danger">JR</span>
</div>`,
      },
    ],
    attrs: [
      [
        "data-tone=accent|success|warning|danger|info",
        "Colours the initials and their tint. Default accent.",
      ],
      ["data-size", "Smaller or larger square. Default sits between."],
      [
        "data-status=online|away|busy|offline",
        "Square in the bottom end corner: success, warning or danger. Any other value, or the bare attribute, shows it muted.",
      ],
    ],
    a11y: [
      'Initials are read as letters. Give the avatar `role="img"` and an `aria-label` with the person\'s name, or hide it with `aria-hidden="true"` when the name is printed beside it.',
      'A photo needs `alt` with the name, or `alt=""` when the name is already next to it.',
      "The status corner is a pseudo-element and is not announced. Add the status to the label or in `.sr-only` text.",
    ],
    related: ["dot", "comment", "list"],
    keywords: "user profile picture initials presence",
  },
  {
    slug: "dot",
    title: "Status dot",
    group: "Data display",
    lede: "A small square in a tone. Reads at a glance next to a label.",
    owns: [".dot"],
    anatomy: [
      [
        "span.dot",
        "Empty inline square, aligned to the middle of the line. Always next to a text label.",
      ],
    ],
    demos: [
      {
        title: "Dots",
        html: `<div class="cluster">
  <span><span class="dot" data-tone="success"></span> Live</span>
  <span><span class="dot" data-tone="warning"></span> Review</span>
  <span><span class="dot" data-tone="danger"></span> Blocked</span>
  <span><span class="dot"></span> Draft</span>
</div>`,
      },
    ],
    attrs: [
      ["data-tone=accent|success|warning|danger|info", "Colour of the square. Default accent."],
    ],
    a11y: [
      "The dot is empty and announces nothing. The label beside it carries the status; never use the dot alone.",
      'If it must stand alone, give it `role="img"` and an `aria-label` ("Live").',
    ],
    related: ["badge", "avatar", "table"],
    keywords: "status indicator presence light",
  },
  {
    slug: "properties",
    title: "Properties",
    group: "Data display",
    lede: "Key-value rows for detail panes and inspectors: muted keys, values that wrap, hairlines between rows.",
    owns: [".properties"],
    anatomy: [
      ["dl.properties", "Two columns, keys at most a third of the width. Small type."],
      ["> dt", "The key, muted. Exactly one per row."],
      [
        "> dd",
        "The value. A wrapping flex row, so badges, avatars and links sit inline; long values break anywhere rather than overflow.",
      ],
    ],
    demos: [
      {
        title: "Properties",
        html: `<dl class="properties" style="max-inline-size: 26rem">
  <dt>Status</dt><dd><span class="badge" data-tone="success">Live</span></dd>
  <dt>Owner</dt><dd><span class="avatar" data-size="s">AL</span> Ada Lovelace</dd>
  <dt>Pages</dt><dd class="tabular">128</dd>
  <dt>Domain</dt><dd><a href="#">northlight.app</a></dd>
  <dt>Updated</dt><dd><time datetime="2026-10-04">4 October 2026</time></dd>
</dl>`,
      },
      {
        title: "Stacked",
        note: "data-stacked puts each key above its value, for narrow inspectors.",
        html: `<dl class="properties" data-stacked style="max-inline-size: 16rem">
  <dt>Project ID</dt><dd class="mono">prj_7Hq2kd93mXa</dd>
  <dt>Region</dt><dd>Europe West</dd>
</dl>`,
      },
    ],
    attrs: [
      [
        "data-stacked",
        "Key above value in a single column, without hairlines between key and value.",
      ],
    ],
    a11y: [
      "A `<dl>` keeps each key paired with its value for screen readers; don't rebuild it from `<div>`s.",
      "Pair every `<dt>` with exactly one `<dd>`, directly inside the `<dl>`: the hairlines and columns count on it.",
      "If a value is editable, put the control in the `<dd>` and label it with the key (`aria-labelledby` pointing at the `<dt>`'s id).",
    ],
    related: ["typography", "settings", "card"],
    keywords: "key value description list details metadata inspector attributes dl",
  },
  {
    slug: "board",
    title: "Board",
    group: "Data display",
    lede: "Kanban columns that scroll and snap horizontally; cards inside are light glass.",
    owns: [".board"],
    anatomy: [
      [".board", "Horizontal row of fixed-width columns that scrolls and snaps."],
      ["> section.column", "One column on a tinted fill."],
      ["> header", "Column title, with an optional count `.badge` pushed to the end."],
      ["> .card", "Compact cards with a lighter shadow and a grab cursor. Any number."],
    ],
    demos: [
      {
        title: "Board",
        html: `<div class="board">
  <section class="column"><header>Backlog <span class="badge">2</span></header><div class="card"><b>Token docs</b><p class="text-s text-muted">Swatches for every tone.</p></div><div class="card"><b>RTL pass</b></div></section>
  <section class="column"><header>In progress <span class="badge" data-tone="info">1</span></header><div class="card"><b>Behaviours</b><div class="cluster gap-2"><span class="avatar" data-size="s">AL</span><span class="delta" data-trend="up">72%</span></div></div></section>
  <section class="column"><header>Done <span class="badge" data-tone="success">2</span></header><div class="card"><b>No outlines</b></div><div class="card"><b>Squares</b></div></section>
</div>`,
      },
    ],
    a11y: [
      "The grab cursor is a hint only; aequitas ships no drag and drop. Whatever moves cards must also work from the keyboard, e.g. a menu on each card.",
      "A `<section>` is only announced as a region when it has a name. Label each column with `aria-labelledby` pointing at its title.",
      'The board scrolls sideways. Where scroll containers are not focusable by default, give it `tabindex="0"` and an `aria-label`.',
    ],
    related: ["card", "list", "badge"],
    keywords: "kanban columns lanes tasks",
  },
  {
    slug: "timeline",
    title: "Timeline",
    group: "Data display",
    lede: "Events in order with a square marker and a hairline connector.",
    owns: [".timeline"],
    anatomy: [
      ["ol.timeline", "Ordered list of events, newest or oldest first as you choose."],
      ["> li", "One event: a square marker in the tone, joined to the next by a hairline."],
      ["> time", "The time, small and muted, in a fixed first column."],
      ["> div", "The event: a title (`<b>`) and an optional muted `<p>`."],
    ],
    demos: [
      {
        title: "Timeline",
        html: `<ol class="timeline" style="max-inline-size: 28rem">
  <li data-tone="success"><time>09:41</time><div><b>Published</b><p>Northlight v2 went live.</p></div></li>
  <li data-tone="info"><time>09:12</time><div><b>Review requested</b><p>Mika asked for a second pair of eyes.</p></div></li>
  <li><time>Yesterday</time><div><b>Draft created</b><p>Started from the blank template.</p></div></li>
</ol>`,
      },
    ],
    attrs: [
      [
        "data-tone=accent|success|warning|danger|info",
        "On an `li`: colours its marker. Default accent.",
      ],
    ],
    a11y: [
      "Use an `<ol>` so the order is announced with the item count.",
      'Give `<time>` a `datetime` attribute when the text is relative ("Yesterday").',
      "Marker colour is not announced; the event title carries what happened.",
    ],
    related: ["steps", "comment", "list"],
    keywords: "activity history feed log events",
  },
];
