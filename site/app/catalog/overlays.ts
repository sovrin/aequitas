import type { Entry } from "./types";

export const overlays: Entry[] = [
  {
    slug: "dialog",
    title: "Dialog",
    group: "Overlays",
    lede: "The native dialog on thick glass with a blurred backdrop. Opens with data-open; closes with data-close.",
    owns: ["dialog"],
    anatomy: [
      [
        "dialog",
        "A native `<dialog>` with an `id` for the opener to point at. Thicker frost than a card, padded, at most one measure wide.",
      ],
      [
        "> form[method=dialog]",
        "Optional. Any submit button inside it closes the dialog and sets `returnValue` to the button's `value`.",
      ],
      ['[data-open="#id"]', "The opener, anywhere on the page. Usually a `.btn`."],
      [
        "[data-close]",
        "Optional close control inside the dialog, for when it isn't in a `method=dialog` form.",
      ],
    ],
    demos: [
      {
        title: "Dialog",
        html: `<button class="btn" data-open="#dlg-demo">Open dialog</button>
<dialog id="dlg-demo" data-light-dismiss aria-labelledby="dlg-demo-title">
  <form method="dialog" class="stack">
    <h3 id="dlg-demo-title">Discard changes?</h3>
    <p class="text-muted">You have unsaved edits. They'll be lost if you leave now.</p>
    <div class="cluster">
      <button class="btn" data-variant="primary" data-tone="danger">Discard</button>
      <button class="btn" data-variant="ghost" value="cancel">Keep editing</button>
    </div>
  </form>
</dialog>`,
      },
      {
        title: "Small, with data-close",
        note: "No form here: the button closes the dialog through aequitas.js.",
        html: `<button class="btn" data-open="#dlg-small">Small dialog</button>
<dialog id="dlg-small" data-size="s" aria-labelledby="dlg-small-title">
  <div class="stack">
    <h4 id="dlg-small-title">Saved</h4>
    <p class="text-muted">Northlight is up to date.</p>
    <button class="btn" data-close>Close</button>
  </div>
</dialog>`,
      },
    ],
    attrs: [
      [
        "data-size",
        "Width: `s` is about 29rem, `l` a full container, `full` covers the viewport edge to edge. Default one measure.",
      ],
      ["data-light-dismiss", "A click on the backdrop closes the dialog (aequitas.js)."],
      [
        "data-open=<selector>",
        "On the opener: aequitas.js calls `showModal()` on the dialog the selector finds.",
      ],
      [
        "data-close=<value>",
        "On a control inside: closes the nearest dialog, passing the value (if any) as `returnValue`.",
      ],
      [
        "open",
        "Set by the browser while shown; the dialog fades and springs in, the backdrop blurs.",
      ],
    ],
    js: 'Clicking a `[data-open="#id"]` element calls `showModal()` on that dialog, a `[data-close]` element closes the dialog it sits in, and `data-light-dismiss` closes on a backdrop click. Without it, call `showModal()` and `close()` yourself; a `method=dialog` form and Esc still close it.',
    keys: [
      ["Esc", "Closes the modal dialog (native)."],
      [
        "Tab / Shift Tab",
        "Moves through the dialog's controls; the page behind is inert while it is open.",
      ],
    ],
    a11y: [
      "Label the dialog: `aria-labelledby` pointing at its heading, or `aria-label`.",
      "`showModal()` moves focus into the dialog and back to the opener on close. Put `autofocus` on the control that should take focus first.",
      "Always leave a visible way out (a cancel or close button); backdrop clicks are not discoverable and do nothing without `data-light-dismiss`.",
    ],
    related: ["drawer", "palette", "lightbox", "popover"],
    keywords: "modal confirm overlay showModal",
  },
  {
    slug: "drawer",
    title: "Drawer",
    group: "Overlays",
    lede: "A dialog that slides in from an edge: end by default, or start, or bottom as a sheet.",
    owns: ["dialog.drawer"],
    anatomy: [
      [
        "dialog.drawer",
        "A native `<dialog>`, full height and about 29rem wide, fixed to an edge. Opened like any dialog.",
      ],
      [
        "> form[method=dialog]",
        'Optional. Wrap the content so a `value="cancel"` button closes it.',
      ],
    ],
    demos: [
      {
        title: "Drawer",
        html: `<div class="cluster">
  <button class="btn" data-open="#drw-end">From the end</button>
  <button class="btn" data-open="#drw-bottom">Bottom sheet</button>
</div>
<dialog class="drawer" id="drw-end" data-light-dismiss aria-labelledby="drw-end-title">
  <form method="dialog" class="stack gap-5">
    <div class="page-header"><div><h6>Project</h6><h3 id="drw-end-title">Northlight</h3></div><button class="btn" data-variant="ghost" data-size="s" value="cancel">Close</button></div>
    <dl><dt>Owner</dt><dd>Ada</dd><dt>Pages</dt><dd>128</dd></dl>
    <button class="btn" data-variant="primary">Save changes</button>
  </form>
</dialog>
<dialog class="drawer" id="drw-bottom" data-side="bottom" data-light-dismiss aria-labelledby="drw-bottom-title">
  <form method="dialog" class="stack gap-4">
    <h4 id="drw-bottom-title">Share</h4>
    <div class="list"><button type="button">Copy link</button><button type="button">Invite people</button></div>
    <button class="btn" data-variant="ghost" value="cancel">Cancel</button>
  </form>
</dialog>`,
      },
      {
        title: "From the start",
        html: `<button class="btn" data-open="#drw-start">Navigation</button>
<dialog class="drawer" id="drw-start" data-side="start" data-light-dismiss aria-label="Navigation">
  <nav class="stack gap-3">
    <a href="#">Pages</a>
    <a href="#">Media</a>
    <a href="#">Settings</a>
    <button class="btn" data-variant="ghost" data-close>Close</button>
  </nav>
</dialog>`,
      },
    ],
    attrs: [
      [
        "data-side",
        "The edge it slides in from. `bottom` is full width, as tall as its content up to 85% of the viewport. Default end edge.",
      ],
      [
        "data-light-dismiss",
        "A click on the backdrop closes it (aequitas.js). Expected on drawers.",
      ],
      ["data-open=<selector>", "On the opener: aequitas.js calls `showModal()` on the drawer."],
      ["data-close=<value>", "On a control inside: closes the drawer."],
    ],
    js: "Opens, closes and light-dismisses exactly like Dialog: `[data-open]`, `[data-close]`, `data-light-dismiss`. Without it, call `showModal()` and `close()` yourself.",
    keys: [
      ["Esc", "Closes the drawer (native, as a modal dialog)."],
      ["Tab / Shift Tab", "Stays among the drawer's controls; the page behind is inert."],
    ],
    a11y: [
      "A drawer is a modal dialog: give it `aria-label` or `aria-labelledby` its heading.",
      "Put a visible close button in it. On touch screens there is no Esc key, and the backdrop is a thin strip on narrow viewports.",
    ],
    related: ["dialog", "sidebar"],
    keywords: "sheet offcanvas slide-over panel",
  },
  {
    slug: "popover",
    title: "Popover",
    group: "Overlays",
    lede: "Anchored content on thick glass. For anything richer than a tooltip and lighter than a dialog.",
    owns: [".popover"],
    anatomy: [
      [
        "button[popovertarget]",
        "The invoker. `popovertarget` names the popover's `id` and makes the button its anchor.",
      ],
      [
        ".popover[popover]",
        "The panel: any element with the `popover` attribute and an `id`. Sized to its content, at most about 29rem wide.",
      ],
    ],
    demos: [
      {
        title: "Popover",
        html: `<button class="btn" popovertarget="pop-demo">Details</button>
<div class="popover" popover id="pop-demo">
  <div class="stack gap-2">
    <b>Northlight</b>
    <p class="text-s text-muted">Last published 2 hours ago by Ada. 128 pages, 3 collaborators.</p>
    <button class="btn" data-size="s">Open project</button>
  </div>
</div>`,
      },
    ],
    attrs: [
      [
        "popover",
        'Required. `popover` (auto) closes on Esc and outside clicks and closes other auto popovers; `popover="manual"` stays until closed.',
      ],
      [
        "popovertarget=<id>",
        "On the invoking button: toggles the popover and anchors it below the button, flipping when it would be clipped.",
      ],
      [
        "data-open=<selector>",
        "On the opener: aequitas.js calls `showPopover()`. No anchor is set this way, so prefer `popovertarget`.",
      ],
      ["data-close", "On a control inside: aequitas.js hides the popover it sits in."],
    ],
    js: 'A `[data-open="#id"]` element calls `showPopover()` on that popover, a `[data-close]` control inside hides it, and `aria-expanded` on each invoker (by `popovertarget` or `data-open`) follows the popover as it opens and closes. Without it, `popovertarget` still toggles the popover natively.',
    keys: [
      ["Enter / Space", "On the invoker: toggles the popover (native)."],
      ["Esc", "Closes an auto popover (native)."],
    ],
    a11y: [
      "The browser links `popovertarget` to the popover and exposes its expanded state on the button; a `<div>` with no role is read as plain content.",
      "Focus does not move into the popover on open. With `popovertarget`, Tab from the invoker goes into the popover next; opened any other way, it sits wherever it is in source order.",
      "Anchoring needs CSS anchor positioning; where it is missing the popover still opens but is not placed against its button.",
    ],
    related: ["menu", "tooltip"],
    keywords: "popup flyout dropdown anchor",
  },
  {
    slug: "menu",
    title: "Menu",
    group: "Overlays",
    lede: "A popover anchored to its button, with separators, group labels, shortcuts, checks and destructive items.",
    owns: [".menu"],
    anatomy: [
      ["button[popovertarget]", "The invoker; it becomes the menu's anchor."],
      [".menu[popover]", "The panel, anchored below the invoker and flipped when clipped."],
      [
        "> button, > a",
        "Items, full width. A trailing `<kbd>` is pushed to the end as a shortcut hint.",
      ],
      ["> h6", "Optional group label."],
      ["> hr", "Optional separator, edge to edge."],
    ],
    demos: [
      {
        title: "Menu",
        html: `<button class="btn" popovertarget="menu-demo">Actions</button>
<div class="menu" popover id="menu-demo">
  <h6>View</h6>
  <button role="menuitemcheckbox" aria-checked="true">Show hidden <kbd>⌘.</kbd></button>
  <button role="menuitemcheckbox" aria-checked="false">Compact rows</button>
  <hr />
  <button>Rename <kbd>↵</kbd></button>
  <button>Duplicate <kbd>⌘D</kbd></button>
  <hr />
  <button data-tone="danger">Move to trash <kbd>⌫</kbd></button>
</div>`,
      },
    ],
    attrs: [
      [
        "popover",
        "Required. Auto popovers close on Esc, on an outside click, and when another menu opens.",
      ],
      ["popovertarget=<id>", "On the invoker: toggles and anchors the menu."],
      ["aria-checked=true|false", "On an item: reserves a check column; `true` shows a ✓."],
      ["data-tone=danger", "On an item: colours its text, for destructive actions."],
      ["data-close", "On an item: aequitas.js hides the menu when it is clicked."],
    ],
    js: "A click on a `[data-close]` item hides the menu, and `aria-expanded` on the invoker follows the menu as it opens and closes. Without it, `popovertarget` still opens and closes the menu natively, but items leave it open until you hide it.",
    keys: [
      ["Enter / Space", "On the invoker: toggles the menu; on an item: activates it (native)."],
      ["Tab / Shift Tab", "Moves between items. There is no arrow-key navigation."],
      ["Esc", "Closes the menu (native popover)."],
    ],
    a11y: [
      'The items are plain buttons in tab order. Only add `role="menu"` and `role="menuitem"` if you also script arrow-key focus, since those roles promise it.',
      "`aria-checked` draws the check but is only announced on an element with a checkable role such as `menuitemcheckbox`.",
      "Clicking an item does not close the menu by itself: add `data-close`, or call `hidePopover()` in your handler.",
    ],
    related: ["popover", "menubar", "palette"],
    keywords: "dropdown context menu actions",
  },
  {
    slug: "palette",
    title: "Command palette",
    group: "Overlays",
    lede: "A ⌘K dialog: a large search input over grouped options with shortcut hints.",
    owns: ["dialog.palette"],
    anatomy: [
      [
        "dialog.palette",
        "A native `<dialog>` about 47rem wide, centred and set high on the screen, with no padding.",
      ],
      [
        "> .icon:first-child",
        "Optional glyph before the input, muted until there is a term. Needs the icon set.",
      ],
      ["> input.input", "Direct child. Large, borderless, with a hairline below."],
      ["[role=listbox]", "The results, scrolling past half the viewport height."],
      ["> h6", "Optional group label inside the listbox. Hidden when none of its options match."],
      [
        "> [role=option]",
        "One result. Text matching the search is drawn in the accent; a trailing `<kbd>` is pushed to the end.",
      ],
      ["> .icon, small", "Optional, in an option: a leading glyph and a muted second label."],
      [".empty[hidden]", "Optional, after the listbox: aequitas.js shows it when nothing matches."],
      ["> footer", "Optional key legend below the results. Hidden on touch screens."],
    ],
    demos: [
      {
        title: "Palette",
        html: `<button class="btn" data-open="#pal-demo">Command palette <kbd>⌘K</kbd></button>
<dialog class="palette" id="pal-demo" data-light-dismiss aria-label="Command palette">
  <i class="icon" data-icon="search"></i>
  <input class="input" placeholder="Search projects, people, commands…" aria-label="Search" autofocus />
  <div role="listbox" aria-label="Projects and commands">
    <h6>Recent</h6>
    <div role="option" data-close><i class="icon" data-icon="folder"></i> Northlight <small>Project</small></div>
    <div role="option" data-close><i class="icon" data-icon="user"></i> Ada Lovelace <small>Design</small></div>
    <div role="option" data-close><i class="icon" data-icon="folder"></i> Atlas <small>Project</small></div>
    <h6>Commands</h6>
    <div role="option" data-close><i class="icon" data-icon="plus"></i> New project <kbd>⌘N</kbd></div>
    <div role="option" data-close data-keywords="dark light appearance"><i class="icon" data-icon="circle-half"></i> Toggle theme <kbd>⌘T</kbd></div>
    <div role="option" data-close data-keywords="people member"><i class="icon" data-icon="user-plus"></i> Invite to project</div>
  </div>
  <div class="empty" hidden>
    <h4>Nothing for “<span data-term></span>”</h4>
    <p>Try a project name or a command.</p>
  </div>
  <footer><span><kbd>↑</kbd><kbd>↓</kbd>Move</span><span><kbd>↵</kbd>Run</span><span><kbd>Esc</kbd>Close</span></footer>
</dialog>`,
      },
    ],
    attrs: [
      [
        "aria-selected=true",
        "On an option: the keyboard's place in the list, tinted with an accent edge. aequitas.js moves it.",
      ],
      [
        "data-keywords=<words>",
        'On an option: extra words it matches, beyond its text ("dark" finds Toggle theme).',
      ],
      ["data-term", "Inside `.empty`: aequitas.js writes the search term into it."],
      ["data-close", "On an option: closes the palette when it runs (aequitas.js)."],
      ["data-light-dismiss", "A click on the backdrop closes the palette (aequitas.js)."],
      ["data-open=<selector>", "On the opener: aequitas.js calls `showModal()` on the palette."],
      [
        "data-manual",
        "On the dialog: aequitas.js does not filter or navigate it, for results you render yourself.",
      ],
    ],
    js: "Opens and closes like Dialog. aequitas.js filters the options as you type, moves the highlight, runs the highlighted option on Enter and clears the search each time the palette opens. Matching text is drawn with the CSS Custom Highlight API, so your markup is never rewritten; a `[data-manual]` palette can call `markMatches(listbox, term)` after rendering. The ⌘K shortcut and what each option does are yours to wire: listen for `click` on the options.",
    keys: [
      ["↑ / ↓", "Moves the highlight through the matching options, wrapping at the ends."],
      ["Enter", "Clicks the highlighted option."],
      ["Esc", "Closes the palette (native, as a modal dialog)."],
    ],
    a11y: [
      'aequitas.js gives the input `role="combobox"`, `aria-controls` and `aria-activedescendant`, so the highlighted result is announced while focus stays in the input.',
      'Label the listbox for what it holds; without a label aequitas.js names it "Results". The `<h6>` group labels are not exposed as groups unless you wrap each set in `role="group"` with a label.',
      "Keep `autofocus` on the input so typing starts at once.",
    ],
    related: ["combobox", "dialog", "menu"],
    keywords: "cmdk command k quick open spotlight search",
  },
  {
    slug: "lightbox",
    title: "Lightbox",
    group: "Overlays",
    lede: "A dialog with no chrome: the media floats on a heavily blurred backdrop.",
    owns: ["dialog.lightbox"],
    anatomy: [
      ["dialog.lightbox", "A native `<dialog>` with no fill, padding or shadow of its own."],
      [
        "> img, > video",
        "The media, a direct child, at most 85% of the viewport height, with a large shadow.",
      ],
      ["> form[method=dialog]", "Optional, for a close button."],
    ],
    demos: [
      {
        title: "Lightbox",
        html: `<button class="btn" data-open="#lb-demo">Open lightbox</button>
<dialog class="lightbox" id="lb-demo" data-light-dismiss aria-label="Image viewer">
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='989'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%233b6ee6'/%3E%3Cstop offset='1' stop-color='%2347b8a0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E" alt="A golden-ratio gradient" width="1600" height="989" />
</dialog>`,
      },
    ],
    attrs: [
      [
        "data-light-dismiss",
        "A click on the backdrop closes it (aequitas.js). Without it only Esc does.",
      ],
      [
        "data-open=<selector>",
        "On the thumbnail or button: aequitas.js calls `showModal()` on the lightbox.",
      ],
    ],
    js: "Opens and closes like Dialog. Paging between images is not included.",
    keys: [["Esc", "Closes the lightbox (native, as a modal dialog)."]],
    a11y: [
      "The image needs real `alt` text; it is the only content.",
      'Label the dialog (`aria-label`) so it is announced as more than "dialog".',
      'Add a close button in a `<form method="dialog">` for touch users, who have no Esc key.',
    ],
    related: ["media", "dialog"],
    keywords: "image viewer zoom gallery",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    group: "Overlays",
    lede: "Attribute-driven. Shows on hover and keyboard focus after a short delay.",
    owns: ["[data-tip]"],
    anatomy: [
      [
        "[data-tip]",
        "Any element. The text is drawn by its `::after`, above it by default, on one line.",
      ],
    ],
    demos: [
      {
        title: "Tooltips",
        html: `<div class="cluster">
  <button class="btn" data-tip="Above by default">Hover me</button>
  <button class="btn" data-tip="Below" data-tip-side="bottom">Below</button>
  <button class="btn" data-tip="To the end" data-tip-side="end">End</button>
</div>`,
      },
    ],
    attrs: [
      [
        "data-tip=<text>",
        "The tooltip text. Shown after 400 ms of hover or keyboard focus, hidden at once.",
      ],
      ["data-tip-side=bottom|end", "Where it sits. Default above."],
    ],
    a11y: [
      "It shows on `:focus-visible`, so it only reaches keyboard users on focusable elements.",
      "Generated text is not a reliable description: browsers may fold it into a button's accessible name or skip it. Keep the essential label in the element (or `aria-label`) and treat the tip as a hint.",
      "Nothing shows on touch. Don't hide information only there.",
      "It is a single nowrap line positioned against the element, so an `overflow: hidden` ancestor can clip it.",
    ],
    related: ["popover", "button"],
    keywords: "tip hint title hover",
  },
];
