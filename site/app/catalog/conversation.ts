import type { Entry } from "./types";

export const conversation: Entry[] = [
  {
    slug: "thread",
    title: "Thread",
    group: "Conversation",
    lede: "Message bubbles; your own sit at the end in the tone.",
    owns: [".thread", ".bubble"],
    anatomy: [
      [".thread", "Column of bubbles."],
      [
        "> .bubble",
        "One message on a tinted fill at the start, held to a reading measure. Bubbles in a run from the same side sit closer together.",
      ],
      ["> .bubble[data-self]", "Your own message: at the end, solid in the tone."],
      [
        ".bubble > time",
        "Optional meta line below the text, extra small and muted. A `<small>` works the same.",
      ],
    ],
    demos: [
      {
        title: "Thread",
        html: `<div class="thread" style="max-inline-size: 26rem">
  <div class="bubble">Can we ship the glass without the rim?<time datetime="2026-10-05T09:38">09:38</time></div>
  <div class="bubble" data-self>Yes. Tone and shadow carry the edge now.<time datetime="2026-10-05T09:40">09:40</time></div>
  <div class="bubble" data-self>Pushing in a minute.</div>
  <div class="bubble">Perfect.</div>
</div>`,
      },
    ],
    attrs: [
      [".bubble[data-self]", "Marks a message as yours: end-aligned, tone fill, contrast text."],
      [
        ".bubble[data-tone=accent|success|warning|danger|info]",
        "Changes the tone of a `data-self` bubble. Default accent.",
      ],
    ],
    a11y: [
      "Side and colour are the only signs of who wrote a message. Add the sender in text, visible or `.sr-only`, so screen readers can tell.",
      'For a live conversation, put `role="log"` on `.thread` so new messages are announced as they arrive.',
      'Give `<time>` a `datetime` attribute; "09:38" alone has no date.',
    ],
    related: ["composer", "comment", "avatar"],
    keywords: "chat messages bubbles messenger",
  },
  {
    slug: "composer",
    title: "Composer",
    group: "Conversation",
    lede: "A message field that grows with what you type, and a send button beside it.",
    owns: [".composer"],
    anatomy: [
      [
        "form.composer",
        "Two columns: the field takes the space, the button sits at the end, aligned to the bottom as the field grows.",
      ],
      [
        "> textarea.input",
        'Grows with its content up to eight lines, then scrolls. `rows="1"` starts it at one line.',
      ],
      ["> .btn", "Send. Usually primary and icon-only (`data-icon`)."],
    ],
    demos: [
      {
        title: "Composer",
        html: `<form class="composer" style="max-inline-size: 26rem">
  <textarea class="input" rows="1" placeholder="Message…" aria-label="Message"></textarea>
  <button class="btn" data-variant="primary" data-icon aria-label="Send" type="button"><i class="icon" data-icon="arrow-up"></i></button>
</form>`,
      },
    ],
    keys: [
      ["Enter", "Inserts a new line. Sending on Enter is up to your script."],
      ["Tab", "Moves from the field to the send button."],
    ],
    a11y: [
      'The placeholder is not a label. Give the `<textarea>` an `aria-label` ("Message") or a visible `<label>`.',
      "The icon-only send button needs an `aria-label`.",
      "Growing relies on `field-sizing: content`; browsers without it keep the `rows` height and scroll.",
    ],
    related: ["thread", "textarea", "button"],
    keywords: "message input chat box send reply",
  },
  {
    slug: "comment",
    title: "Comment",
    group: "Conversation",
    lede: "Avatar, author, time, body and actions. Replies nest with a hairline.",
    owns: [".comment"],
    anatomy: [
      ["article.comment", "Two columns: avatar, then the comment."],
      ["> .avatar", "Who wrote it."],
      ["> div", "The comment column, stacked tightly."],
      ["div > header", "Author in `<b>`, then a `<time>`, small and muted, on one baseline."],
      ["div > p", "The body."],
      ["div > footer", "Actions as bare text buttons, extra small and muted until hovered."],
      ["div > .comment", "Optional replies: nested comments, indented behind a hairline."],
    ],
    demos: [
      {
        title: "Comment",
        html: `<article class="comment" style="max-inline-size: 28rem">
  <span class="avatar" aria-hidden="true">AL</span>
  <div>
    <header><b>Ada</b><time datetime="2026-10-05T08:12">2h</time></header>
    <p class="text-s">The φ scale reads much calmer at compact density.</p>
    <footer><button aria-label="Reply to Ada">Reply</button><button>Like · 3</button></footer>
    <article class="comment">
      <span class="avatar" data-size="s" data-tone="success" aria-hidden="true">MK</span>
      <div><header><b>Mika</b><time datetime="2026-10-05T09:12">1h</time></header><p class="text-s">Agreed. Let's make it the default for data views.</p><footer><button aria-label="Reply to Mika">Reply</button></footer></div>
    </article>
  </div>
</article>`,
      },
    ],
    a11y: [
      'Every comment has the same "Reply" button. Add an `aria-label` such as "Reply to Ada" so they differ out of context.',
      'Give `<time>` a `datetime` attribute; "2h" is relative and goes stale.',
      'Initials in the avatar duplicate the author name; mark the avatar `aria-hidden="true"` so the name isn\'t read twice.',
    ],
    related: ["thread", "timeline", "avatar"],
    keywords: "discussion reply nested feedback",
  },
];
