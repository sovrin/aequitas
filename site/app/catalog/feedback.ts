import type { Entry } from "./types";

export const feedback: Entry[] = [
  {
    slug: "alert",
    title: "Alert",
    group: "Feedback",
    lede: "An inline message tinted by its tone. Errors say what happened and how to fix it.",
    owns: [".alert"],
    anatomy: [
      [".alert", "A frosted row tinted with its tone."],
      ["> div", "The message."],
      ["div > strong", "Optional lead phrase, in the tone colour: what happened."],
      ["> button[data-dismiss]", "Optional dismiss button after the message."],
    ],
    demos: [
      {
        title: "Alerts",
        html: `<div class="stack gap-3">
  <div class="alert" data-tone="success"><div><strong>Published.</strong> Your changes are live.</div></div>
  <div class="alert" data-tone="info"><div><strong>Heads up.</strong> Scheduled maintenance on Sunday.</div></div>
  <div class="alert" data-tone="danger"><div><strong>Couldn't save.</strong> The title is required. Add one and try again.</div><button class="btn" data-size="s" data-variant="ghost" data-dismiss>Dismiss</button></div>
</div>`,
      },
    ],
    attrs: [
      [
        "data-tone=accent|success|warning|danger|info",
        "Sets the tint and the colour of the `<strong>` lead. Default accent.",
      ],
      [
        "data-dismiss=<selector>",
        "On a button inside: aequitas.js removes the closest `.alert`, `.toast` or `.chip` on click, or the closest match of the selector you give.",
      ],
    ],
    js: "A click on a `[data-dismiss]` button removes the alert from the page; when focus was inside it, focus moves to the next focusable element (the previous one at the end of the page or dialog). Without aequitas.js the button does nothing until you wire it.",
    a11y: [
      'An alert has no role of its own. Add `role="alert"` to an error that appears after an action, `role="status"` to a confirmation; one already on the page at load needs neither.',
      'Tone is colour only. The `<strong>` lead carries the meaning in words ("Couldn\'t save.").',
      "Dismissing removes the alert while its button has focus; aequitas.js moves focus to the next focusable element so it doesn't fall back to the document. Move it yourself if somewhere else makes more sense, such as the field the error was about.",
    ],
    related: ["toast", "banner"],
    keywords: "callout notice message",
  },
  {
    slug: "toast",
    title: "Toast",
    group: "Feedback",
    lede: "A transient notice in a fixed corner. Enters with @starting-style; leaves with data-leaving.",
    owns: [".toast", ".toasts"],
    anatomy: [
      [
        ".toasts",
        "The fixed stack, bottom end by default. `toast()` creates it at the end of `<body>` when the page has none.",
      ],
      [
        "> .toast",
        'One frosted notice with `role="status"` (`role="alert"` for a failure). Slides and fades in on insertion.',
      ],
      ["div", "The message, with an optional `<strong>` title in the tone colour."],
    ],
    demos: [
      {
        title: "Trigger",
        note: "data-toast is the declarative form of toast() from aequitas.js.",
        html: `<div class="cluster">
  <button class="btn" data-toast="Northlight is live." data-toast-title="Published." data-toast-tone="success">Success toast</button>
  <button class="btn" data-toast="The title is required." data-toast-title="Couldn't save." data-toast-tone="danger">Error toast</button>
  <button class="btn" data-toast="Three files uploaded.">Plain toast</button>
</div>`,
      },
      {
        title: "Markup",
        html: `<div class="toast" role="status" data-tone="success" style="position: static; inline-size: fit-content"><div><strong>Published.</strong> Northlight is live.</div></div>`,
      },
      {
        title: "Region",
        note: "The .toasts region stacks toasts in a fixed corner. Shown in place here; on a page it is fixed to the viewport.",
        html: `<div class="toasts" data-position="top-end" style="position: static">
  <div class="toast" role="status" data-tone="success"><div><strong>Published.</strong> Northlight is live.</div></div>
  <div class="toast" role="status"><div>Three files uploaded.</div><button class="btn" data-size="s" data-variant="ghost" data-icon data-dismiss aria-label="Dismiss"><i class="icon" data-icon="x"></i></button></div>
</div>`,
      },
    ],
    attrs: [
      ["data-toast=<text>", "On any element: a click shows a toast with this message."],
      ["data-toast-title=<text>", "With `data-toast`: a bold title before the message."],
      [
        "data-toast-tone=accent|success|warning|danger|info",
        "With `data-toast`: the toast's tone.",
      ],
      [
        ".toast[data-tone=accent|success|warning|danger|info]",
        "Draws a small square in the tone before the message and colours the title. No square without it.",
      ],
      [".toasts[data-position]", "Which corner or edge the stack sits in. Default bottom end."],
      [
        ".toast[data-leaving]",
        "Exit state: fades and slides sideways. `toast()` sets it, then removes the element when the transition ends.",
      ],
    ],
    js: '`aequitas.toast(message, { title, tone, duration })` appends an empty `.toast` to `.toasts` (`role="alert"` for `tone: "danger"`, `role="status"` otherwise) and writes the message into it a frame later. After `duration` (default 4000 ms; `Infinity` keeps it) it sets `data-leaving` and removes it; the countdown pauses while the pointer is over the toast or focus is in it, and starts again from the top when both leave. A click on `[data-toast]` calls it with the element\'s `data-toast`, `data-toast-title` and `data-toast-tone`; a `[data-dismiss]` button inside a toast removes it at once and moves focus to the next focusable element. Without aequitas.js, toasts are markup you add and remove yourself.',
    a11y: [
      '`role="status"` makes a toast a polite live region, `role="alert"` an assertive one that interrupts; `toast()` picks `alert` for danger. Hand-written toasts need the role too.',
      "`toast()` inserts the live region empty and fills it on the next frame, since screen readers announce changes to a region, not a region that arrives already filled. Do the same when you add toasts yourself.",
      "A toast leaves after four seconds unless the pointer or focus is on it; pass `duration: Infinity` for one that stays until dismissed. Never put the only copy of an error, or an action the user must take, in a timed one: show it inline as well.",
    ],
    related: ["alert", "banner"],
    keywords: "snackbar notification",
  },
  {
    slug: "banner",
    title: "Banner",
    group: "Feedback",
    lede: "A full-width announcement in a solid tone.",
    owns: [".banner"],
    anatomy: [
      [
        ".banner",
        "A full-width row, centred, in the solid tone with its contrast colour for text. Links inside inherit that colour. Hidden in print.",
      ],
    ],
    demos: [
      {
        title: "Banner",
        html: `<div class="banner">Northlight 2.0 ships next week. <a href="#">Read the changelog</a></div>`,
      },
      {
        title: "Danger",
        html: `<div class="banner" data-tone="danger">Payment failed. <a href="#">Update your card</a></div>`,
      },
    ],
    attrs: [
      [
        "data-tone=accent|success|warning|danger|info",
        "Background colour; the text takes the tone's contrast colour. Default accent.",
      ],
    ],
    a11y: [
      'A banner has no role. If it appears after the page loads and must be heard, give it `role="status"` (or `role="alert"` for a failure).',
      "Links keep their underline, so they stay distinct when they take the banner's text colour.",
      "Say the problem in words: the danger tone alone does not.",
    ],
    related: ["alert", "toast", "navbar"],
    keywords: "announcement notice bar",
  },
  {
    slug: "progress",
    title: "Progress",
    group: "Feedback",
    lede: "The native <progress>, thin and square. Without a value it sweeps.",
    owns: ["progress"],
    anatomy: [["progress", "The native element, no class. Full width; the fill uses the tone."]],
    demos: [
      {
        title: "Progress",
        html: `<div class="stack gap-3">
  <progress value="62" max="100" aria-label="Upload"></progress>
  <progress aria-label="Loading"></progress>
</div>`,
      },
      {
        title: "Tones",
        html: `<div class="stack gap-3">
  <progress value="80" max="100" data-tone="success" aria-label="Checks passed"></progress>
  <progress value="35" max="100" data-tone="danger" aria-label="Checks failed"></progress>
</div>`,
      },
    ],
    attrs: [
      ["value=<n>", "How much is done. Leave it out for the indeterminate sweep."],
      ["max=<n>", "The total. Default `1`."],
      ["data-tone=accent|success|warning|danger|info", "Colours the fill. Default accent."],
    ],
    a11y: [
      "`<progress>` is a progressbar and announces its percentage. Label it with `<label for>` or `aria-label`.",
      "Without `value` it is announced as busy with no amount; use it only when the length is unknown.",
      'Put `aria-busy="true"` on the region being loaded, and say what is happening in text ("Uploading 3 of 5").',
    ],
    related: ["meter", "loading-bar", "spinner"],
    keywords: "progress bar",
  },
  {
    slug: "meter",
    title: "Meter",
    group: "Feedback",
    lede: "The native <meter>, coloured by band: good, fair or poor against low, high and optimum.",
    owns: ["meter"],
    anatomy: [
      [
        "meter",
        "The native element, no class. Full width; the fill is success, warning or danger by band.",
      ],
    ],
    demos: [
      {
        title: "Bands",
        html: `<div class="stack gap-3">
  <meter value="0.82" min="0" max="1" low="0.3" high="0.7" optimum="1" aria-label="Battery · 82%"></meter>
  <meter value="0.5" min="0" max="1" low="0.3" high="0.7" optimum="1" aria-label="Battery · 50%"></meter>
  <meter value="0.2" min="0" max="1" low="0.3" high="0.7" optimum="1" aria-label="Battery · 20%"></meter>
</div>`,
      },
      {
        title: "Lower is better",
        note: "optimum below low flips the bands: a high value is now the poor one.",
        html: `<div class="field">
  <label for="m1">Storage · 82% used</label>
  <meter id="m1" value="0.82" min="0" max="1" low="0.3" high="0.7" optimum="0"></meter>
</div>`,
      },
    ],
    attrs: [
      ["value=<n>", "The measurement."],
      ["min=<n>", "Lower end of the scale. Default `0`."],
      ["max=<n>", "Upper end of the scale. Default `1`."],
      ["low=<n>", "Top of the low band."],
      ["high=<n>", "Bottom of the high band."],
      [
        "optimum=<n>",
        "Where good is. The band it falls in draws in success, the next in warning, the far one in danger.",
      ],
    ],
    a11y: [
      "`<meter>` has the meter role and announces its value. Label it with `<label for>` or `aria-label`.",
      'The band is colour only; put the number or a word in the label ("82% used").',
      "Use `<progress>` for work being done; a meter is a measurement within a known range.",
    ],
    related: ["progress", "stat"],
    keywords: "gauge level quota",
  },
  {
    slug: "loading-bar",
    title: "Loading bar",
    group: "Feedback",
    lede: "A thin accent line along the top of the viewport while a page or request loads.",
    owns: [".loading-bar"],
    anatomy: [
      [
        ".loading-bar",
        "One empty element per page. Fixed to the top edge above everything else, two pixels tall, invisible until active.",
      ],
    ],
    demos: [
      {
        title: "Loading bar",
        note: "Fixed to the top of the viewport; toggle data-active, then data-done.",
        html: `<div class="loading-bar" data-active style="position: static"></div>`,
      },
    ],
    attrs: [
      [
        "data-active",
        "Shows the bar and grows it towards 85% over 2.5 s, slowing as it goes. Set it when the request starts.",
      ],
      [
        "data-done",
        "Fills the bar, then fades it out. Wins over `data-active`, so you can add it without removing that; clear both before the next start.",
      ],
    ],
    a11y: [
      "The bar is decorative and ignores the pointer; screen readers get nothing from it.",
      'Announce loading where it happens: `aria-busy="true"` on the region being replaced, or a `role="status"` message.',
    ],
    related: ["progress", "spinner", "skeleton"],
    keywords: "top bar nprogress page load",
  },
  {
    slug: "spinner",
    title: "Spinner",
    group: "Feedback",
    lede: "Three pulsing squares, not a ring. The same motion appears inside busy buttons and cards.",
    owns: [".spinner"],
    anatomy: [
      ["span.spinner", "Inline; the squares take the current text colour."],
      [
        "> span",
        "Required: the middle square. The outer two are the spinner's own pseudo-elements.",
      ],
    ],
    demos: [
      {
        title: "Spinner",
        html: `<div class="cluster">
  <span class="spinner" role="status" aria-label="Loading"><span></span></span>
  <span class="cluster gap-2"><span class="spinner" aria-hidden="true"><span></span></span><span class="text-muted">Syncing two more…</span></span>
  <i class="icon animate-spin" data-icon="refresh"></i>
</div>`,
      },
    ],
    a11y: [
      'On its own, give it `role="status"` and an `aria-label` so it is announced.',
      'Next to visible text that already says what is happening, mark the spinner `aria-hidden="true"` instead, so it isn\'t read twice.',
      'For a button or card that is loading, use `aria-busy="true"` on it rather than a spinner inside.',
    ],
    related: ["skeleton", "button", "progress"],
    keywords: "loader loading busy",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    group: "Feedback",
    lede: "Placeholders that shimmer while content loads; static under reduced motion.",
    owns: [".skeleton"],
    anatomy: [
      [
        ".skeleton",
        "A block placeholder, at least 1em tall. Size it like the content it stands in for, or put placeholder text in it: the text sets the size and stays invisible.",
      ],
    ],
    demos: [
      {
        title: "Skeleton",
        html: `<div class="stack gap-2" aria-hidden="true" style="max-inline-size: 20rem">
  <span class="skeleton" style="inline-size: 70%"></span>
  <span class="skeleton" style="inline-size: 90%"></span>
  <span class="skeleton" style="inline-size: 45%"></span>
</div>`,
      },
    ],
    a11y: [
      'Hide skeletons with `aria-hidden="true"` on their wrapper, as in the demo.',
      'Mark the region that is loading `aria-busy="true"`, and clear it when the content arrives.',
      "Skeletons ignore the pointer and are hidden in print.",
    ],
    related: ["spinner", "progress"],
    keywords: "placeholder shimmer loading",
  },
  {
    slug: "empty",
    title: "Empty state",
    group: "Feedback",
    lede: "An empty screen is an invitation to act, not a mood.",
    owns: [".empty"],
    anatomy: [
      [".empty", "A centred column with generous padding; text is muted."],
      ["> i.icon", "Optional illustration icon."],
      ["> h4", "What is missing, in the full text colour."],
      ["> p", "One line on how to fill it."],
      ["> .btn", "Optional: the action that fills it."],
    ],
    demos: [
      {
        title: "Empty",
        html: `<div class="empty">
  <i class="icon" data-icon="grid" data-size="xl" style="opacity: .5"></i>
  <h4>No reports yet</h4>
  <p>Create one and it appears here.</p>
  <button class="btn" data-variant="primary" data-size="s">New report</button>
</div>`,
      },
    ],
    a11y: [
      "Only a direct `<h4>` child gets the full text colour; use that level, or restyle the heading yourself if your outline needs another.",
      'The icon is decorative. Name the action in the button ("New report", not "Get started").',
    ],
    related: ["card", "cover"],
    keywords: "blank zero state no results",
  },
];
