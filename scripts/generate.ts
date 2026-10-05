/*
 * Generates the utility layer, the icon set and the docs manifests.
 * Output: src/_generated/*.css (bundled by lightningcss) and site/app/generated/*.json.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { icons } from "./icons.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = root + "src/_generated/";
const docs = root + "site/app/generated/";

type Rule = { cls: string; css: string; group: string; note?: string };
const rules: Rule[] = [];
const add = (group: string, cls: string, css: string, note?: string) =>
  rules.push({ group, cls, css, note });

/* ---- Spacing: φ scale 0–8 plus auto, logical sides ---- */
const steps = ["0", "1", "2", "3", "4", "5", "6", "7", "8"] as const;
const space = (n: string) => (n === "0" ? "0" : `var(--ae-space-${n})`);
const sides: Record<string, string[]> = {
  "": ["margin"],
  x: ["margin-inline"],
  y: ["margin-block"],
  t: ["margin-block-start"],
  b: ["margin-block-end"],
  s: ["margin-inline-start"],
  e: ["margin-inline-end"],
};
for (const [suffix, props] of Object.entries(sides)) {
  for (const n of steps)
    add("spacing", `m${suffix}-${n}`, props.map((p) => `${p}: ${space(n)}`).join("; "));
  add("spacing", `m${suffix}-auto`, props.map((p) => `${p}: auto`).join("; "));
  for (const n of steps)
    add(
      "spacing",
      `p${suffix}-${n}`,
      props.map((p) => `${p.replace("margin", "padding")}: ${space(n)}`).join("; "),
    );
}
for (const n of steps) {
  add("spacing", `gap-x-${n}`, `column-gap: ${space(n)}`);
  add("spacing", `gap-y-${n}`, `row-gap: ${space(n)}`);
}

/* ---- Layout ---- */
const responsive: Rule[] = []; // subset that also gets breakpoint variants
const addR = (group: string, cls: string, css: string, note?: string) => {
  add(group, cls, css, note);
  responsive.push({ group, cls, css });
};
for (const d of ["block", "inline", "inline-block", "flex", "inline-flex", "grid", "contents"])
  addR("display", d, `display: ${d}`);
addR("display", "hidden", "display: none");
addR("flex", "flex-row", "flex-direction: row");
addR("flex", "flex-col", "flex-direction: column");
add("flex", "flex-wrap", "flex-wrap: wrap");
add("flex", "flex-nowrap", "flex-wrap: nowrap");
add("flex", "flex-1", "flex: 1 1 0%");
add("flex", "flex-auto", "flex: 1 1 auto");
add("flex", "flex-none", "flex: none");
add("flex", "grow", "flex-grow: 1");
add("flex", "shrink-0", "flex-shrink: 0");
for (const a of ["start", "center", "end", "stretch", "baseline"])
  addR("flex", `items-${a}`, `align-items: ${a}`);
for (const j of ["start", "center", "end", "between", "around", "evenly"])
  addR(
    "flex",
    `justify-${j}`,
    `justify-content: ${["between", "around", "evenly"].includes(j) ? "space-" + j : j}`,
  );
add("flex", "self-start", "align-self: start");
add("flex", "self-center", "align-self: center");
add("flex", "self-end", "align-self: end");
addR("flex", "order-first", "order: -1");
addR("flex", "order-last", "order: 1");
for (let i = 1; i <= 6; i++)
  addR("grid", `cols-${i}`, `grid-template-columns: repeat(${i}, minmax(0, 1fr))`);
addR(
  "grid",
  "cols-auto",
  "grid-template-columns: repeat(auto-fit, minmax(min(var(--min, calc(1rem * pow(var(--ae-phi), 5))), 100%), 1fr))",
  "set --min",
);
for (let i = 2; i <= 6; i++) addR("grid", `col-span-${i}`, `grid-column: span ${i}`);
addR("grid", "col-full", "grid-column: 1 / -1");
add("grid", "place-center", "place-items: center");
add("grid", "place-content-center", "place-content: center");

/* ---- Position & sizing ---- */
for (const p of ["static", "relative", "absolute", "fixed", "sticky"])
  add("position", p, `position: ${p}`);
add("position", "inset-0", "inset: 0");
add("position", "top-0", "inset-block-start: 0");
add("position", "bottom-0", "inset-block-end: 0");
add("position", "start-0", "inset-inline-start: 0");
add("position", "end-0", "inset-inline-end: 0");
for (const z of [0, 1, 2, 3, 10, 20, 50]) add("position", `z-${z}`, `z-index: ${z}`);
add("sizing", "w-full", "inline-size: 100%");
add("sizing", "w-auto", "inline-size: auto");
add("sizing", "w-fit", "inline-size: fit-content");
add("sizing", "w-screen", "inline-size: 100vw");
add("sizing", "h-full", "block-size: 100%");
add("sizing", "h-auto", "block-size: auto");
add("sizing", "h-screen", "block-size: 100dvh");
add("sizing", "min-h-screen", "min-block-size: 100dvh");
add("sizing", "min-w-0", "min-inline-size: 0");
add("sizing", "max-w-full", "max-inline-size: 100%");
add("sizing", "max-w-measure", "max-inline-size: var(--ae-measure)");
add("sizing", "max-w-container", "max-inline-size: var(--ae-container)");
for (const n of ["3", "4", "5", "6", "7", "8"])
  add("sizing", `size-${n}`, `inline-size: ${space(n)}; block-size: ${space(n)}`, "square");
add("sizing", "aspect-square", "aspect-ratio: 1");
add("sizing", "aspect-golden", "aspect-ratio: var(--ae-ratio)");
add("sizing", "aspect-video", "aspect-ratio: 16 / 9");
add("sizing", "object-cover", "object-fit: cover");
add("sizing", "object-contain", "object-fit: contain");

/* ---- Typography ---- */
for (const s of ["xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl"])
  add("typography", `text-${s}`, `font-size: var(--ae-text-${s})`);
add("typography", "font-sans", "font-family: var(--ae-font-sans)");
add("typography", "font-mono", "font-family: var(--ae-font-mono)");
for (const w of [400, 500, 600, 700]) add("typography", `weight-${w}`, `font-weight: ${w}`);
addR("typography", "text-start", "text-align: start");
addR("typography", "text-center", "text-align: center");
addR("typography", "text-end", "text-align: end");
add("typography", "uppercase", "text-transform: uppercase; letter-spacing: 0.08em");
add("typography", "normal-case", "text-transform: none; letter-spacing: 0");
add("typography", "italic", "font-style: italic");
add("typography", "tracking-tight", "letter-spacing: -0.03em");
add("typography", "tracking-wide", "letter-spacing: 0.06em");
add("typography", "leading-tight", "line-height: var(--ae-leading-tight)");
add("typography", "leading-normal", "line-height: var(--ae-leading-normal)");
add("typography", "leading-none", "line-height: 1");
add("typography", "nowrap", "white-space: nowrap");
add("typography", "break-words", "overflow-wrap: anywhere");
add("typography", "balance", "text-wrap: balance");
add("typography", "pretty", "text-wrap: pretty");
add("typography", "tabular", "font-variant-numeric: tabular-nums");
add("typography", "truncate", "overflow: hidden; text-overflow: ellipsis; white-space: nowrap");
add(
  "typography",
  "clamp-2",
  "display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden",
);
add(
  "typography",
  "clamp-3",
  "display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden",
);

/* ---- Colour ---- */
for (const t of ["accent", "success", "warning", "danger", "info"]) {
  add("colour", `text-${t}`, `color: var(--ae-${t}-ink)`);
  add("colour", `bg-${t}`, `background: var(--ae-${t}); color: var(--ae-${t}-contrast)`);
}
add("colour", "text-muted", "color: var(--ae-text-muted)");
add("colour", "text-body", "color: var(--ae-text)");
add("colour", "text-tone", "color: var(--ae-tone-ink)", "with data-tone");
add(
  "colour",
  "bg-tone",
  "background: var(--ae-tone); color: var(--ae-tone-contrast)",
  "with data-tone",
);
add(
  "colour",
  "bg-tint",
  "background: color-mix(in oklch, var(--ae-tone) var(--ae-tint-hover), transparent)",
  "with data-tone",
);
add("colour", "bg-fill", "background: var(--ae-fill)");
add("colour", "bg-surface", "background: var(--ae-surface)");
add("colour", "bg-sunken", "background: var(--ae-bg-sunken)");
add("colour", "bg-page", "background: var(--ae-bg)");
add("colour", "bg-transparent", "background: transparent");

/* ---- Edges, depth, shape ---- */
add("edges", "hairline", "box-shadow: inset 0 0 0 1px var(--ae-border)");
add("edges", "hairline-t", "box-shadow: inset 0 1px 0 var(--ae-border)");
add("edges", "hairline-b", "box-shadow: inset 0 -1px 0 var(--ae-border)");
add("edges", "hairline-s", "box-shadow: inset var(--ae-hairline-x) 0 0 var(--ae-border)");
add(
  "edges",
  "hairline-e",
  "box-shadow: inset calc(var(--ae-hairline-x) * -1) 0 0 var(--ae-border)",
);
add("edges", "shadow-s", "box-shadow: var(--ae-shadow-s)");
add("edges", "shadow-m", "box-shadow: var(--ae-shadow-m)");
add("edges", "shadow-l", "box-shadow: var(--ae-shadow-l)");
add("edges", "shadow-none", "box-shadow: none");
add("edges", "radius-0", "border-radius: 0");
add("edges", "radius-s", "border-radius: var(--ae-radius-s)");
add("edges", "radius-m", "border-radius: var(--ae-radius-m)");
add("edges", "radius-l", "border-radius: var(--ae-radius-l)");
add("edges", "radius-full", "border-radius: var(--ae-radius-full)");
add("edges", "ring", "box-shadow: var(--ae-ring)");

/* ---- Misc ---- */
for (const o of [0, 25, 50, 75, 100]) add("misc", `opacity-${o}`, `opacity: ${o / 100}`);
add("misc", "overflow-hidden", "overflow: hidden");
add("misc", "overflow-auto", "overflow: auto");
add("misc", "overflow-x-auto", "overflow-x: auto");
add("misc", "overflow-y-auto", "overflow-y: auto");
add("misc", "overflow-clip", "overflow: clip");
add("misc", "cursor-pointer", "cursor: pointer");
add("misc", "cursor-default", "cursor: default");
add("misc", "select-none", "user-select: none");
add("misc", "pointer-none", "pointer-events: none");
add("misc", "invisible", "visibility: hidden");
add("misc", "transition", "transition: all var(--ae-duration) var(--ae-ease)");
add("misc", "transition-fast", "transition: all var(--ae-duration-fast) var(--ae-ease)");
add("misc", "transition-slow", "transition: all var(--ae-duration-slow) var(--ae-ease)");
add("misc", "cq", "container-type: inline-size", "container query root");
add("misc", "frost-filter", "backdrop-filter: var(--ae-frost-filter)");
add("misc", "print-hidden", "@media print { display: none !important }");
add("misc", "print-only", "display: none; @media print { display: revert }");

/* ---- Emit CSS ---- */
const esc = (cls: string) => cls.replace(/[:.]/g, (c) => "\\" + c);
const breakpoints: Record<string, string> = {
  s: "(width < 48rem)",
  m: "(width >= 48rem)",
  l: "(width >= 64rem)",
  xl: "(width >= 80rem)",
};
let css = "/* Generated by scripts/generate.ts — do not edit. */\n@layer ae.utilities {\n";
for (const r of rules) css += `  .${esc(r.cls)} { ${r.css}; }\n`;
for (const [bp, q] of Object.entries(breakpoints)) {
  css += `  @media ${q} {\n`;
  for (const r of responsive) css += `    .${esc(`${bp}:${r.cls}`)} { ${r.css}; }\n`;
  css += "  }\n";
}
// Container-query variants of the same subset: cq-m:flex etc. The nearest .cq ancestor is the container.
const containers: Record<string, string> = {
  "cq-s": "(inline-size < 32rem)",
  "cq-m": "(inline-size >= 32rem)",
  "cq-l": "(inline-size >= 48rem)",
};
for (const [bp, q] of Object.entries(containers)) {
  css += `  @container ${q} {\n`;
  for (const r of responsive) css += `    .${esc(`${bp}:${r.cls}`)} { ${r.css}; }\n`;
  css += "  }\n";
}
css += "}\n";

/* ---- Icons ---- */
const svg = (body: string) =>
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='square' stroke-linejoin='miter'>${body}</svg>`;
const uri = (s: string) =>
  "data:image/svg+xml," + s.replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E");
let iconCss = `/* Generated by scripts/generate.ts — do not edit. */
@layer ae.components {
  /* <i class="icon" data-icon="search"></i> — mask-based, coloured by currentColor. */
  .icon {
    display: inline-block;
    flex: none;
    inline-size: 1em;
    block-size: 1em;
    vertical-align: -0.125em;
    background: currentColor;
    mask: var(--_i) center / contain no-repeat;
  }
  /* Directional glyphs follow the writing direction; text alignment icons do not. */
  .icon:is([data-icon*="left"], [data-icon*="right"], [data-icon="undo"], [data-icon="redo"], [data-icon="reply"], [data-icon="forward"]):not([data-icon^="align-"], [data-icon="arrow-left-right"]):dir(rtl) {
    scale: -1 1;
  }
  .icon[data-size="s"] { font-size: calc(1em * pow(var(--ae-phi), -0.5)); }
  .icon[data-size="l"] { font-size: calc(1em * var(--ae-phi)); }
  .icon[data-size="xl"] { font-size: calc(1em * pow(var(--ae-phi), 1.5)); }
`;
for (const [name, body] of Object.entries(icons))
  iconCss += `  .icon[data-icon="${name}"] { --_i: url("${uri(svg(body))}"); }\n`;
iconCss += "}\n";

export async function generate(): Promise<void> {
  await mkdir(out, { recursive: true });
  await mkdir(docs, { recursive: true });
  await writeFile(out + "utilities.css", css);
  await writeFile(out + "icons.css", iconCss);
  await writeFile(
    docs + "utilities.json",
    JSON.stringify(
      {
        breakpoints,
        containers,
        responsive: responsive.map((r) => r.cls),
        rules: rules.map(({ cls, css, group, note }) => ({ cls, css, group, note })),
      },
      null,
      0,
    ),
  );
  await writeFile(docs + "icons.json", JSON.stringify(Object.keys(icons)));
  console.log(
    `utilities ${rules.length} + ${responsive.length * 4} responsive · icons ${Object.keys(icons).length}`,
  );
}

const self = process.argv[1] && pathToFileURL(realpathSync(process.argv[1])).href;
if (import.meta.url === self) await generate();
