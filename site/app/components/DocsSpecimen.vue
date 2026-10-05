<script setup lang="ts">
// A demo with its own markup one click away. The code is read from the rendered preview.
const props = defineProps<{ title: string; note?: string; id?: string }>();
const preview = ref<HTMLElement>();
const show = ref(false);
const html = ref("");

// Markup is printed from the DOM: an element stays on one line while it fits, otherwise its
// children break onto their own lines. Text keeps its tags on one line for longer, and mixed text
// and tags stay together, indented once.
const WIDTH = 80;
const TEXT_WIDTH = 120;
const RAW = new Set(["pre", "textarea"]);
const VOID = new Set([
  "area",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);
const flat = (s: string) => s.replace(/\s+/g, " ").trim();
const text = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const isText = (n: Node) => n.nodeType === Node.TEXT_NODE && !!n.textContent?.trim();

// Empty attributes print bare (`data-copy`, not `data-copy=""`), the way they are written.
const open = (e: Element) =>
  `<${e.localName}${[...e.attributes]
    .map((a) => (a.value ? ` ${a.name}="${attr(a.value)}"` : ` ${a.name}`))
    .join("")}>`;
const inner = (e: Element) => [...e.childNodes].map(serialize).join("");
function serialize(n: Node): string {
  if (n.nodeType === Node.TEXT_NODE) return text(n.textContent!);
  if (!(n instanceof Element)) return "";
  return VOID.has(n.localName) ? open(n) : `${open(n)}${inner(n)}</${n.localName}>`;
}

function format(n: Node, depth: number): string[] {
  const pad = "  ".repeat(depth);
  if (isText(n)) return [pad + text(flat(n.textContent!))];
  if (!(n instanceof Element)) return [];
  if (RAW.has(n.localName)) return [pad + serialize(n)];
  const one = flat(serialize(n));
  const kids = [...n.childNodes].filter((c) => c instanceof Element || isText(c));
  const fits = pad.length + one.length <= (kids.some(isText) ? TEXT_WIDTH : WIDTH);
  if (fits || !kids.length) return [pad + one];
  const close = `${pad}</${n.localName}>`;
  if (kids.some(isText)) return [pad + open(n), `${pad}  ${flat(inner(n))}`, close];
  return [pad + open(n), ...kids.flatMap((c) => format(c, depth + 1)), close];
}

function pretty(root: HTMLElement): string {
  const el = root.cloneNode(true) as HTMLElement;
  for (const e of el.querySelectorAll("*"))
    for (const a of [...e.attributes])
      if (a.name === "data-ae" || a.name.startsWith("data-v-")) e.removeAttribute(a.name);
  // Demos are mounted through a bare <div v-html>; print what is inside it.
  let top: Element = el;
  while (
    top.childNodes.length &&
    [...top.childNodes].filter((c) => c instanceof Element || isText(c)).length === 1 &&
    top.firstElementChild?.localName === "div" &&
    !top.firstElementChild.attributes.length
  )
    top = top.firstElementChild;
  return [...top.childNodes].flatMap((c) => format(c, 0)).join("\n");
}

const toggle = () => {
  if (!show.value && preview.value) html.value = pretty(preview.value);
  show.value = !show.value;
};
const slug = computed(
  () =>
    props.id ??
    props.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
);
</script>

<template>
  <section class="specimen" :id="slug">
    <header>
      <h3>
        <a :href="`#${slug}`" data-quiet>{{ title }}</a>
      </h3>
      <span v-if="note" class="caption">{{ note }}</span>
      <button class="btn" data-size="s" data-variant="ghost" :aria-pressed="show" @click="toggle">
        <i class="icon" data-icon="layout" data-size="s"></i>{{ show ? "Hide code" : "Code" }}
      </button>
    </header>
    <div ref="preview" class="specimen-preview"><slot /></div>
    <DocsCode v-if="show" class="specimen-code" lang="html" :code="html" />
  </section>
</template>
