/*
 * aequitas-check: lints markup against what the built CSS really styles.
 *   - unknown classes (with "did you mean" and Bootstrap/Tailwind translations)
 *   - data-* values aequitas does not style, or data-* on elements it does not apply to
 *   - var(--ae-*) tokens that do not exist, <i class="icon"> without data-icon
 * Bundled by scripts/ai.ts into dist/aequitas-check.mjs with the manifest inlined; no dependencies.
 *
 *   node dist/aequitas-check.mjs [--css app.css] [--allow 'docs-*'] [--json] <file|dir|->...
 */
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Anchor, Manifest } from "./manifest.js";

declare const __AE_MANIFEST__: Manifest | undefined;

export type Problem = {
  line: number;
  col: number;
  severity: "error" | "warning";
  rule: "unknown-class" | "attr-value" | "attr-scope" | "unknown-token" | "icon";
  message: string;
  hint?: string;
};

export type Options = {
  manifest?: Manifest;
  /** Extra class names or `prefix*` patterns that are fine (the project's own CSS). */
  allow?: string[];
  /** Extra places aequitas' data-* attributes are styled (the project's own CSS, from attrsIn). */
  attrs?: Record<string, Anchor[]>;
};

/** Habits from other frameworks, translated. Also rendered into the AI docs. */
export const translations: [string, string][] = [
  ["btn-primary", '.btn[data-variant="primary"]'],
  ["btn-secondary", ".btn"],
  ["btn-light", ".btn"],
  ["btn-outline-*", ".btn"],
  ["btn-ghost", '.btn[data-variant="ghost"]'],
  ["btn-danger", '.btn[data-variant="primary"][data-tone="danger"]'],
  ["btn-success", '.btn[data-variant="primary"][data-tone="success"]'],
  ["btn-sm", '.btn[data-size="s"]'],
  ["btn-lg", '.btn[data-size="l"]'],
  ["btn-link", "button.link"],
  ["btn-close", "button.btn[data-icon][data-dismiss] with an x icon"],
  ["button", ".btn"],
  ["form-control", ".input"],
  ["form-select", ".select"],
  ["form-group", ".field"],
  ["form-label", "<label> inside .field"],
  ["form-check", "a native checkbox/radio, no class"],
  ["form-switch", 'input[type="checkbox"][role="switch"]'],
  ["invalid-feedback", ".field > [data-error]"],
  ["is-invalid", '[aria-invalid="true"]'],
  ["modal", "<dialog> (open with [data-open], close with [data-close])"],
  ["modal-dialog", "<dialog>"],
  ["modal-content", "<dialog>"],
  ["modal-lg", 'dialog[data-size="l"]'],
  ["offcanvas", 'dialog.drawer[data-side="start|end|bottom"]'],
  ["dropdown", ".menu as a [popover], opened by [data-open]"],
  ["dropdown-menu", ".menu"],
  ["dropdown-item", "<button> or <a> inside .menu"],
  ["nav-tabs", ".tabs"],
  ["nav-pills", ".segmented"],
  ["list-group", ".list"],
  ["list-unstyled", 'ul[data-variant="plain"]'],
  ["list-inline", 'ul[data-variant="inline"]'],
  ["alert-success", '.alert[data-tone="success"]'],
  ["alert-warning", '.alert[data-tone="warning"]'],
  ["alert-danger", '.alert[data-tone="danger"]'],
  ["alert-info", '.alert[data-tone="info"]'],
  ["alert-error", '.alert[data-tone="danger"]'],
  ["badge-*", '.badge[data-tone="…"]'],
  ["card-body", "plain children of .card"],
  ["card-header", "plain children of .card"],
  ["card-footer", "plain children of .card"],
  ["card-title", "a heading inside .card"],
  ["spinner-border", ".spinner"],
  ["progress-bar", "<progress>"],
  ["placeholder", ".skeleton"],
  ["tooltip", '[data-tip="…"] on any element'],
  ["table-striped", ".table[data-striped]"],
  ["table-sm", '.table[data-size="s"]'],
  ["table-hover", ".table (hover is the default)"],
  ["table-responsive", ".table-scroll"],
  ["container-fluid", '.container[data-size="full"]'],
  ["col", ".grid or .cols-n"],
  ["col-*", ".cols-n on the parent, .col-span-n on the child"],
  ["d-flex", ".flex (or .cluster / .stack)"],
  ["d-none", ".hidden"],
  ["d-block", ".block"],
  ["d-grid", ".grid"],
  ["d-inline-flex", ".inline-flex"],
  ["flex-column", ".flex-col (or .stack)"],
  ["align-items-center", ".items-center"],
  ["justify-content-between", ".justify-between"],
  ["justify-content-center", ".justify-center"],
  ["justify-content-end", ".justify-end"],
  ["space-y-*", ".stack (+ .gap-n)"],
  ["space-x-*", ".cluster (+ .gap-n)"],
  ["text-primary", ".text-accent"],
  ["text-secondary", ".text-muted"],
  ["text-gray-*", ".text-muted"],
  ["text-sm", ".text-s"],
  ["text-base", ".text-m"],
  ["text-lg", ".text-l"],
  ["text-truncate", ".truncate"],
  ["bg-primary", ".bg-accent"],
  ["bg-white", ".bg-surface"],
  ["bg-light", ".bg-sunken"],
  ["bg-gray-*", ".bg-sunken"],
  ["bg-body", ".bg-page"],
  ["fw-bold", "<strong>"],
  ["font-bold", "<strong>"],
  ["font-semibold", "<strong>"],
  ["visually-hidden", ".sr-only"],
  ["img-fluid", ".max-w-full"],
  ["rounded", ".radius-m"],
  ["rounded-lg", ".radius-l"],
  ["rounded-circle", ".radius-full"],
  ["rounded-pill", ".radius-full"],
  ["shadow", ".shadow-m"],
  ["shadow-sm", ".shadow-s"],
  ["shadow-md", ".shadow-m"],
  ["shadow-lg", ".shadow-l"],
  ["border", ".hairline"],
  ["border-b", ".hairline-b"],
  ["border-bottom", ".hairline-b"],
  ["border-top", ".hairline-t"],
  ["display-*", ".display"],
  ["sm:*", "m:* (aequitas breakpoints: s: < 48rem, m: ≥ 48rem, l: ≥ 64rem, xl: ≥ 80rem)"],
  ["md:*", "m:*"],
  ["lg:*", "l:*"],
];

/** Icon names other sets use, mapped to this set's. */
export const iconSynonyms: Record<string, string> = {
  close: "x",
  times: "x",
  cross: "x",
  cancel: "x",
  delete: "trash",
  remove: "trash",
  settings: "settings-gear",
  gear: "settings-gear",
  cog: "settings-gear",
  options: "sliders",
  pencil: "edit",
  add: "plus",
  person: "user",
  account: "user",
  house: "home",
  email: "mail",
  envelope: "mail",
  error: "alert-circle",
  alert: "warning",
  danger: "alert-circle",
  question: "help",
  time: "clock",
  reload: "refresh",
  notification: "bell",
  notifications: "bell",
  logout: "log-out",
  "sign-out": "log-out",
  login: "log-in",
  "sign-in": "log-in",
  dots: "more",
  ellipsis: "more",
  kebab: "more-vertical",
  hamburger: "menu",
  bars: "menu",
  "caret-down": "chevron-down",
  "caret-up": "chevron-up",
  "caret-left": "chevron-left",
  "caret-right": "chevron-right",
  magnifier: "search",
  "external-link": "external",
};

/** Former aequitas names, class or attribute, so markup written against them says what replaced them. */
const renamed: Record<string, string> = {
  "link-quiet": "a[data-quiet]",
  "data-compact": 'data-size="s" on .table',
  "data-padding": 'data-size="s" on .card for a compact one, data-flush for no padding',
  "data-centered": "data-center",
  "data-lede": 'class="lead"',
  "list-plain": 'ul[data-variant="plain"]',
  "list-inline": 'ul[data-variant="inline"]',
  "list-check": 'ul[data-variant="check"]',
};

const glob = (pattern: string) =>
  new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "(.*)")}$`);
const translationRes = translations.map(([from, to]) => [glob(from), to] as const);

function distance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
const nearest = (word: string, pool: Iterable<string>) => {
  let best: string | undefined;
  let score = word.length > 4 ? 3 : 2;
  for (const c of pool) {
    const d = distance(word, c);
    if (d < score) [best, score] = [c, d];
  }
  return best;
};

/* ---- Markup scanning: start tags with attributes and positions, no dependencies ---- */

type Attr = { name: string; value: string | null; dynamic: boolean; at: number };
type Tag = { name: string; attrs: Attr[]; at: number };

function* scan(src: string): Generator<Tag> {
  let i = 0;
  while ((i = src.indexOf("<", i)) !== -1) {
    if (src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i + 4);
      i = end === -1 ? src.length : end + 3;
      continue;
    }
    const m = /^<([a-zA-Z][\w:.-]*)/.exec(src.slice(i, i + 80));
    if (!m) {
      i++;
      continue;
    }
    const tag: Tag = { name: m[1].toLowerCase(), attrs: [], at: i };
    let j = i + m[0].length;
    let selfClosing = false;
    while (j < src.length) {
      while (/\s/.test(src[j] ?? "")) j++;
      if (src[j] === ">" || j >= src.length) break;
      if (src.startsWith("/>", j)) {
        selfClosing = true;
        j++;
        break;
      }
      if (src[j] === "{") {
        j = skipBraces(src, j); // JSX spread
        continue;
      }
      const at = j;
      const name = /^[^\s=>/"'{]+/.exec(src.slice(j, j + 200))?.[0];
      if (!name) {
        j++;
        continue;
      }
      j += name.length;
      while (/\s/.test(src[j] ?? "")) j++;
      let value: string | null = null;
      let dynamic = /^[:@#[(*]|^v-|^x-bind|^bind:/.test(name);
      if (src[j] === "=") {
        j++;
        while (/\s/.test(src[j] ?? "")) j++;
        const q = src[j];
        if (q === '"' || q === "'") {
          const end = src.indexOf(q, j + 1);
          value = src.slice(j + 1, end === -1 ? undefined : end);
          j = end === -1 ? src.length : end + 1;
        } else if (q === "{") {
          const end = skipBraces(src, j);
          value = src.slice(j, end);
          dynamic = true;
          j = end;
        } else {
          value = /^[^\s>]*/.exec(src.slice(j))![0];
          j += value.length;
        }
      }
      tag.attrs.push({ name, value, dynamic, at });
    }
    yield tag;
    i = j + 1;
    if (!selfClosing && (tag.name === "script" || tag.name === "style")) {
      const end = src.toLowerCase().indexOf(`</${tag.name}`, i);
      i = end === -1 ? src.length : end;
    }
  }
}

function skipBraces(src: string, j: number): number {
  let depth = 0;
  for (; j < src.length; j++) {
    const c = src[j];
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return j + 1;
    else if (c === '"' || c === "'" || c === "`") {
      const end = src.indexOf(c, j + 1);
      j = end === -1 ? src.length : end;
    }
  }
  return j;
}

const templated = /[{}$%<>()]|^\[|\]$/;
/** The attribute a framework binding sets: :data-icon, v-bind:data-icon, [attr.data-icon], data-icon={x}. */
const bound = (name: string) =>
  name
    .replace(/^(?::|v-bind:|bind:|x-bind:|\[(?:attr\.)?)/, "")
    .replace(/\]$/, "")
    .toLowerCase();

/* ---- Checking ---- */

let defaultManifest: Manifest | undefined;
function loadManifest(): Manifest {
  if (typeof __AE_MANIFEST__ !== "undefined") return __AE_MANIFEST__;
  return (defaultManifest ??= JSON.parse(
    readFileSync(new URL("../dist/manifest.json", import.meta.url), "utf8"),
  ));
}

export function check(source: string, options: Options = {}): Problem[] {
  const manifest = options.manifest ?? loadManifest();
  const classes = new Set(manifest.classes);
  const allow = (options.allow ?? []).map(glob);
  const tokens = new Set(manifest.tokens);
  const problems: Problem[] = [];

  const lines = [0];
  for (let i = 0; i < source.length; i++) if (source[i] === "\n") lines.push(i + 1);
  const pos = (at: number) => {
    let lo = 0;
    let hi = lines.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lines[mid] <= at) lo = mid;
      else hi = mid - 1;
    }
    return { line: lo + 1, col: at - lines[lo] + 1 };
  };
  const report = (at: number, p: Omit<Problem, "line" | "col">) =>
    problems.push({ ...pos(at), ...p });

  for (const tag of scan(source)) {
    const classAttr = tag.attrs.find(
      (a) => (a.name === "class" || a.name === "className") && !a.dynamic && a.value !== null,
    );
    const own = new Set(
      (classAttr?.value ?? "")
        .replace(/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\$\{[\s\S]*?\}|<%[\s\S]*?%>|<\?[\s\S]*?\?>/g, " ")
        .split(/\s+/)
        .filter((c) => c && !templated.test(c)),
    );

    for (const cls of own) {
      if (classes.has(cls) || allow.some((re) => re.test(cls))) continue;
      const match = translationRes.find(([re]) => re.test(cls));
      const translation = renamed[cls] ?? match?.[1].replace("*", match[0].exec(cls)![1] ?? "*");
      const near = nearest(cls, classes);
      report(classAttr!.at, {
        severity: "error",
        rule: "unknown-class",
        message: `Unknown class "${cls}".`,
        hint: translation ? `Use ${translation}.` : near ? `Did you mean "${near}"?` : undefined,
      });
    }

    if (
      tag.name === "i" &&
      own.has("icon") &&
      !tag.attrs.some((a) => bound(a.name) === "data-icon")
    )
      report(tag.at, {
        severity: "error",
        rule: "icon",
        message: '<i class="icon"> needs data-icon="name".',
      });

    for (const attr of tag.attrs) {
      const name = attr.name.toLowerCase();
      const anchors: Anchor[] | undefined = manifest.attrs[name] && [
        ...manifest.attrs[name],
        ...(options.attrs?.[name] ?? []),
      ];
      if (!anchors && renamed[name]) {
        report(attr.at, {
          severity: "error",
          rule: "attr-scope",
          message: `${name} is no longer part of aequitas.`,
          hint: `Use ${renamed[name]}.`,
        });
        continue;
      }
      if (!anchors || attr.dynamic || (attr.value && templated.test(attr.value))) continue;
      const relevant = anchors.filter(
        (a) => (!a.tag || a.tag === tag.name) && a.classes.every((c) => own.has(c)),
      );
      const where = (list: Anchor[]) =>
        [
          ...new Set(
            list
              .map(
                (a) =>
                  (a.tag ?? "") +
                  a.classes.map((c) => "." + c).join("") +
                  (a.within ? ` inside .${a.within.join(".")}` : ""),
              )
              .filter(Boolean),
          ),
        ].join(", ");
      if (!relevant.length) {
        report(attr.at, {
          severity: "warning",
          rule: "attr-scope",
          message: `${name} has no effect on this element.`,
          hint: `aequitas styles it on ${where(anchors)}.`,
        });
        continue;
      }
      const values = [...new Set(relevant.flatMap((a) => a.values))];
      const bare = relevant.some((a) => a.bare);
      const value = attr.value ?? "";
      if (!values.length || values.includes(value) || (value === "" && bare)) continue;
      const synonym = name === "data-icon" ? iconSynonyms[value] : undefined;
      const near = synonym ?? (value ? nearest(value, values) : undefined);
      report(attr.at, {
        severity: "error",
        rule: "attr-value",
        message: value ? `${name}="${value}" is not styled here.` : `${name} needs a value here.`,
        hint:
          (near ? `Did you mean "${near}"? ` : "") +
          (values.length > 24
            ? `${values.length} values exist (see the icon list).`
            : `Valid: ${values.join(" · ")}${bare ? " (or bare)" : ""}.`),
      });
    }
  }

  for (const m of source.matchAll(/var\(\s*(--ae-[\w-]+)/g)) {
    if (tokens.has(m[1])) continue;
    const near = nearest(m[1], tokens);
    report(m.index!, {
      severity: "error",
      rule: "unknown-token",
      message: `Unknown token ${m[1]}.`,
      hint: near ? `Did you mean ${near}?` : undefined,
    });
  }

  return problems.sort((a, b) => a.line - b.line || a.col - b.col);
}

/** Class names defined by a stylesheet, for --css. Approximate on purpose: no CSS parser at runtime. */
export function classesIn(css: string): string[] {
  const stripped = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/url\([^)]*\)/g, "")
    .replace(/"[^"]*"|'[^']*'/g, "")
    .replace(/\{[^{}]*\}/g, "{}");
  return [
    ...new Set(
      [...stripped.matchAll(/\.(-?[_a-zA-Z][\w-]*(?:\\.[\w-]*)*)/g)].map((m) =>
        m[1].replace(/\\(.)/g, "$1"),
      ),
    ),
  ];
}

/** Where a stylesheet matches data-* attributes, for --css: `.brand[data-size="l"]` makes
 *  data-size="l" valid on .brand. Approximate like classesIn: only bare `[attr]` and exact
 *  `[attr="value"]` count, matches inside :not() and friends don't, and nested `&` compounds are
 *  skipped because their parent selector isn't resolved. */
export function attrsIn(css: string): Record<string, Anchor[]> {
  const stripped = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/url\([^)]*\)/g, "")
    .replace(/\{[^{}]*\}/g, "{}");
  const out: Record<string, Anchor[]> = {};
  const compounds = stripped.matchAll(
    /(?:[\w-]|\.[\w-]+|#[\w-]+|\[[^\]]*\]|::?[\w-]+(?:\((?:[^()]|\([^()]*\))*\))?|&|\*)+/g,
  );
  for (const [compound] of compounds) {
    if (!compound.includes("[data-") || compound.includes("&")) continue;
    const own = compound.replace(/\((?:[^()]|\([^()]*\))*\)/g, "");
    const tag = /^[a-zA-Z][\w-]*/.exec(own)?.[0].toLowerCase();
    const classes = [...new Set([...own.matchAll(/\.([\w-]+)/g)].map((m) => m[1]))].sort();
    const attrs = own.matchAll(
      /\[\s*(data-[\w-]+)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s\]]+))\s*)?(?:[is]\s*)?\]/g,
    );
    for (const [, name, ...quoted] of attrs) {
      const value = quoted.find((v) => v !== undefined);
      const list = (out[name] ??= []);
      let anchor = list.find((a) => a.tag === tag && a.classes.join(".") === classes.join("."));
      if (!anchor) list.push((anchor = { tag, classes, values: [], bare: false }));
      if (value === undefined) anchor.bare = true;
      else if (!anchor.values.includes(value)) anchor.values.push(value);
    }
  }
  return out;
}

/* ---- CLI ---- */

const markupExt = new Set([
  ".html",
  ".htm",
  ".vue",
  ".svelte",
  ".astro",
  ".jsx",
  ".tsx",
  ".php",
  ".twig",
  ".njk",
  ".hbs",
  ".erb",
  ".liquid",
  ".md",
  ".mdx",
  ".css",
]);
const skipDirs = new Set(["node_modules", "dist", ".git", ".nuxt", ".output", ".next", "build"]);

function files(path: string): string[] {
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory()
      ? skipDirs.has(d.name)
        ? []
        : files(join(path, d.name))
      : markupExt.has(extname(d.name))
        ? [join(path, d.name)]
        : [],
  );
}

function cli(argv: string[]): number {
  const allow: string[] = [];
  const attrs: Record<string, Anchor[]> = {};
  const targets: string[] = [];
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") json = true;
    else if (a === "--allow") allow.push(...argv[++i].split(","));
    else if (a === "--css") {
      const css = readFileSync(argv[++i], "utf8");
      allow.push(...classesIn(css));
      for (const [name, anchors] of Object.entries(attrsIn(css)))
        (attrs[name] ??= []).push(...anchors);
    } else if (a === "-h" || a === "--help") {
      console.log(
        "usage: aequitas-check [--css file.css]... [--allow 'name,prefix-*'] [--json] <file|dir|->...\n" +
          "Checks markup against the classes, data-* values and tokens aequitas defines.",
      );
      return 0;
    } else targets.push(a);
  }
  if (!targets.length) return (cli(["--help"]), 2);

  const results: { file: string; problems: Problem[] }[] = [];
  for (const target of targets) {
    for (const file of target === "-" ? ["-"] : files(target)) {
      const source = readFileSync(file === "-" ? 0 : file, "utf8");
      const problems = file.endsWith(".css")
        ? check(source, { allow, attrs }).filter((p) => p.rule === "unknown-token")
        : check(source, { allow, attrs });
      if (problems.length) results.push({ file: file === "-" ? "<stdin>" : file, problems });
    }
  }

  const all = results.flatMap((r) => r.problems);
  const errors = all.filter((p) => p.severity === "error").length;
  if (json) console.log(JSON.stringify(results, null, 2));
  else {
    for (const { file, problems } of results)
      for (const p of problems)
        console.log(
          `${file}:${p.line}:${p.col}  ${p.severity}  ${p.message}${p.hint ? `  ${p.hint}` : ""}  [${p.rule}]`,
        );
    console.log(
      all.length
        ? `\n${errors} error(s), ${all.length - errors} warning(s) in ${results.length} file(s).`
        : "aequitas-check: no problems.",
    );
  }
  return errors ? 1 : 0;
}

const self = process.argv[1] && pathToFileURL(realpathSync(process.argv[1])).href;
if (import.meta.url === self) process.exitCode = cli(process.argv.slice(2));
