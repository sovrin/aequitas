/*
 * Docs for AI agents, generated from the same sources as the docs site.
 *   dist/manifest.json            what the CSS styles (classes, data-* values, tokens)
 *   dist/aequitas-check.mjs       the markup checker, manifest inlined, no dependencies
 *   dist/llms.txt, llms-full.txt  compact and complete references (also served by the site)
 *   dist/AGENTS.md                a snippet for projects that use aequitas
 *   dist/skills/aequitas/         an Agent Skill: SKILL.md, references/, scripts/
 * Hand-written prose lives in ai/ (rules.md, SKILL.md); everything else comes from the catalog.
 */
import { chmod, copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build as esbuild } from "esbuild";
import { buildManifest, type Manifest } from "./manifest.js";
import { check, iconSynonyms, translations } from "./check.js";
import { icons } from "./icons.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = root + "dist/";

type Demo = { title: string; html: string; note?: string };
type Entry = {
  slug: string;
  title: string;
  group: string;
  lede: string;
  owns?: string[];
  anatomy?: [string, string][];
  demos: Demo[];
  attrs?: [string, string][];
  js?: string;
  keys?: [string, string][];
  a11y?: string[];
  related?: string[];
};
type ApiRow = { name: string; on?: string; values: string[]; desc: string };
type Api = { apiRows: (e: Entry, m: Manifest) => ApiRow[]; owned: (e: Entry) => string[] };
type Catalog = {
  components: Entry[];
  layoutEntries: Entry[];
  componentGroups: string[];
  layoutGroups: string[];
};
type Utilities = {
  breakpoints: Record<string, string>;
  containers: Record<string, string>;
  responsive: string[];
  rules: { cls: string; css: string; group: string; note?: string }[];
};

const read = (path: string) => readFile(root + path, "utf8");
const fence = (lang: string, code: string) => "```" + lang + "\n" + code.trim() + "\n```";
const cell = (s: string) => s.replace(/\|/g, "\\|");

export async function ai(): Promise<void> {
  // A runtime path keeps tsc out of the Nuxt app's extensionless imports.
  const catalogPath = root + "site/app/catalog/index.ts";
  const catalog = (await import(catalogPath)) as Catalog;
  const { apiRows, owned } = (await import(root + "site/app/catalog/api.ts")) as Api;
  const utilities = JSON.parse(await read("site/app/generated/utilities.json")) as Utilities;
  const tokenValues = JSON.parse(await read("dist/tokens.json")) as Record<string, string>;
  const readme = await read("README.md");
  const dts = await read("dist/aequitas.d.ts");
  const rules = await read("ai/rules.md");
  const skillTemplate = await read("ai/SKILL.md");
  const iconNames = Object.keys(icons);

  const manifest = await buildManifest([dist + "aequitas.css", dist + "aequitas.icons.css"]);
  await writeFile(dist + "manifest.json", JSON.stringify(manifest) + "\n");
  await bundleChecker(manifest);

  /* ---- Building blocks ---- */

  const all = [...catalog.components, ...catalog.layoutEntries];
  const classCounts = (html: string) => {
    const counts = new Map<string, number>();
    for (const m of html.matchAll(/class="([^"]*)"/g))
      for (const c of m[1].split(/\s+/))
        if (manifest.classes.includes(c)) counts.set(c, (counts.get(c) ?? 0) + 1);
    return counts;
  };
  const entryClasses = new Map(
    all.map((e) => [e.slug, classCounts(e.demos.map((d) => d.html).join("\n"))]),
  );
  // Each class belongs to the entry whose demos use it most; that entry lists it in the index.
  const utilityClasses = new Set(utilities.rules.map((r) => r.cls));
  const home = new Map<string, [slug: string, n: number]>();
  for (const [slug, counts] of entryClasses)
    for (const [c, n] of counts) if (n > (home.get(c)?.[1] ?? 0)) home.set(c, [slug, n]);
  // A class named like an entry (.card → Card, .stack → "Container and stacks") always belongs to it.
  const words = (e: Entry) => `${e.slug} ${e.title}`.toLowerCase().split(/[^a-z]+/);
  const named = (e: Entry, c: string) =>
    e.slug === c || words(e).some((w) => w === c || w === c + "s");
  for (const pass of [(e: Entry, c: string) => e.slug === c, named])
    for (const e of all)
      for (const c of entryClasses.get(e.slug)!.keys())
        if (home.get(c)![1] !== Infinity && pass(e, c)) home.set(c, [e.slug, Infinity]);
  const signature = (e: Entry) =>
    [...entryClasses.get(e.slug)!]
      .filter(([c]) => home.get(c)![0] === e.slug && !utilityClasses.has(c) && !/^gap-/.test(c))
      .sort((a, b) => home.get(b[0])![1] - home.get(a[0])![1] || b[1] - a[1])
      .slice(0, 4)
      .map(([c]) => c);

  const indexLine = (e: Entry) => {
    const cls = signature(e).map((c) => `\`.${c}\``);
    const attrs = [...new Set(apiRows(e, manifest).map((r) => `\`${r.name}\``))];
    return (
      `- **${e.title}**${cls.length ? ` ${cls.join(" ")}` : ""}: ${e.lede}` +
      (attrs.length ? ` Attributes: ${attrs.join(", ")}.` : "")
    );
  };
  const index = (entries: Entry[], groups: string[]) =>
    groups
      .map((g) => [g, entries.filter((e) => e.group === g)] as const)
      .filter(([, es]) => es.length)
      .map(([g, es]) => `### ${g}\n\n${es.map(indexLine).join("\n")}`)
      .join("\n\n");

  const entryMd = (e: Entry) => {
    const api = apiRows(e, manifest);
    return [
      `## ${e.title}`,
      `${e.group} · \`${e.slug}\` · ${owned(e)
        .map((s) => `\`${s}\``)
        .join(" ")}${e.js ? " · needs aequitas.js" : ""}. ${e.lede}`,
      e.anatomy?.length
        ? "| Part | Role |\n| --- | --- |\n" +
          e.anatomy.map(([k, v]) => `| \`${cell(k)}\` | ${cell(v)} |`).join("\n")
        : "",
      api.length
        ? "| Attribute | Values | Meaning |\n| --- | --- | --- |\n" +
          api
            .map(
              (r) =>
                `| \`${cell(r.on ? `${r.on}[${r.name}]` : r.name)}\` | ${cell(r.values.map((v) => `\`${v}\``).join(" "))} | ${cell(r.desc)} |`,
            )
            .join("\n")
        : "",
      e.js ? `Behaviour (aequitas.js): ${e.js}` : "",
      e.keys?.length
        ? "| Key | Effect |\n| --- | --- |\n" +
          e.keys.map(([k, v]) => `| ${cell(k)} | ${cell(v)} |`).join("\n")
        : "",
      e.a11y?.length ? "Accessibility:\n\n" + e.a11y.map((n) => `- ${n}`).join("\n") : "",
      ...e.demos.map(
        (d) => `### ${d.title}\n\n${d.note ? d.note + "\n\n" : ""}${fence("html", d.html)}`,
      ),
      e.related?.length ? `Related: ${e.related.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  };
  // Demo frames from the docs site's own stylesheet, not part of aequitas.
  const docsOnly = ["ph", "preview"];
  const docsNote =
    "> The demos use two docs-site helpers that are not part of aequitas: `.ph` is a placeholder box and `.preview` is a demo frame. Replace them with real content.";
  const entries = (list: Entry[], groups: string[]) =>
    [docsNote, ...groups.flatMap((g) => list.filter((e) => e.group === g)).map(entryMd)].join(
      "\n\n---\n\n",
    );

  // Compresses m-0 … m-8, m-auto into m-{0…8,auto}.
  const compress = (classes: string[]) => {
    const groups = new Map<string, string[]>();
    for (const c of classes) {
      const m = /^(.*)-(\d+|auto|full)$/.exec(c);
      const [prefix, suffix] = m ? [m[1], m[2]] : [c, ""];
      groups.set(prefix, [...(groups.get(prefix) ?? []), suffix]);
    }
    return [...groups]
      .map(([p, s]) =>
        s.length === 1 ? (s[0] ? `${p}-${s[0]}` : p) : `${p}-{${s.filter(Boolean).join(",")}}`,
      )
      .map((c) => `\`.${c}\``)
      .join(" ");
  };
  const byGroup = new Map<string, Utilities["rules"]>();
  for (const r of utilities.rules) byGroup.set(r.group, [...(byGroup.get(r.group) ?? []), r]);
  const variants = `Breakpoint variants, as a prefix: ${Object.entries(utilities.breakpoints)
    .map(([k, q]) => `\`${k}:\` ${q}`)
    .join(", ")}. Container variants (the nearest \`.cq\` ancestor): ${Object.entries(
    utilities.containers,
  )
    .map(([k, q]) => `\`${k}:\` ${q}`)
    .join(", ")}. Only these classes have variants: ${compress(utilities.responsive)}.`;
  // Numbered classes the layout layer defines outside the generated utilities (.gap-N).
  const layoutSteps = manifest.classes.filter(
    (c) => /^[a-z]+-\d+$/.test(c) && !utilityClasses.has(c) && !c.startsWith("delay-"),
  );
  const layoutLine = `- layout layer: ${compress(layoutSteps)} (\`.gap-N\` is the gap of a flex/grid container)`;
  const utilitiesShort = [
    ...[...byGroup].map(([g, rs]) => `- ${g}: ${compress(rs.map((r) => r.cls))}`),
    layoutLine,
    "",
    variants,
  ].join("\n");
  const utilitiesFull = [
    variants,
    layoutLine.slice(2),
    ...[...byGroup].map(
      ([g, rs]) =>
        `### ${g}\n\n| Class | CSS |\n| --- | --- |\n` +
        rs
          .map((r) => `| \`.${cell(r.cls)}\` | \`${cell(r.css)}\`${r.note ? ` (${r.note})` : ""} |`)
          .join("\n"),
    ),
  ].join("\n\n");

  const tokensFull =
    "| Token | Value |\n| --- | --- |\n" +
    manifest.tokens
      .map((t) => `| \`${t}\` | ${tokenValues[t] ? `\`${cell(tokenValues[t])}\`` : ""} |`)
      .join("\n");
  const tokensShort = manifest.tokens.map((t) => `\`${t}\``).join(" ");
  const iconsList = iconNames.join(", ");
  const translationsMd =
    "| Habit | In aequitas |\n| --- | --- |\n" +
    translations.map(([from, to]) => `| \`${cell(from)}\` | ${cell(to)} |`).join("\n") +
    "\n\nIcon names from other sets: " +
    Object.entries(iconSynonyms)
      .map(([from, to]) => `${from} → \`${to}\``)
      .join(", ") +
    ".";

  const section = (title: string) => {
    const start = readme.indexOf(`\n## ${title}`);
    if (start === -1) return "";
    const end = readme.indexOf("\n## ", start + 4);
    return readme.slice(start + 1, end === -1 ? undefined : end).trim();
  };
  const behaviours = [
    section("Behaviours (optional)").replace(/^## .*\n/, ""),
    "### API\n\n" + fence("ts", dts),
  ].join("\n\n");
  const concepts = ["The golden ratio", "Theming", "Frost", "Layers"]
    .map(section)
    .filter(Boolean)
    .map((s) => s.replace(/^## /, "### "))
    .join("\n\n");

  // Classes the catalog never shows: listed so nothing is hidden, but without examples.
  const shown = new Set([...entryClasses.values()].flatMap((m) => [...m.keys()]));
  const other = manifest.classes.filter(
    (c) => !shown.has(c) && !utilityClasses.has(c) && !c.includes(":") && c !== "icon",
  );
  // Every class needs a home in the docs: a demo, an entry's `owns`, or a reference page.
  const owns = new Set(
    all.flatMap((e) =>
      (e.owns ?? []).flatMap((s) => [...s.matchAll(/\.([\w-]+)/g)].map((m) => m[1])),
    ),
  );
  const referencePages = (
    await Promise.all(
      ["utilities", "motion", "icons"].map((p) => read(`site/app/pages/reference/${p}.vue`)),
    )
  ).join("\n");
  const range = (c: string) => /^(\w+)-\d+$/.exec(c)?.[1];
  const undocumented = other.filter(
    (c) =>
      !owns.has(c) &&
      !new RegExp(`\\.${c}\\b|\\b${c}\\b`).test(referencePages) &&
      !(range(c) && new RegExp(`\\.${range(c)}-1 … \\.${range(c)}-\\d`).test(referencePages)),
  );

  const summary =
    "> A minimal CSS design language with frost and blur, proportioned on the golden ratio (φ). Plain modern CSS: semantic HTML, a component class, variants as data-* attributes, an optional 7 kB ESM module for behaviours.";
  const files = [
    "Files: `aequitas.css` (components, layouts, utilities), `aequitas.core.css` (no utilities),",
    "`aequitas.icons.css` (icons, separate), `aequitas.js` (optional behaviours, ESM, self-initialising).",
    "",
    fence(
      "html",
      `<link rel="stylesheet" href="aequitas.css" />
<link rel="stylesheet" href="aequitas.icons.css" />
<script type="module" src="aequitas.js"></script>`,
    ),
  ].join("\n");
  const withCheck = (cmd: string) => rules.replaceAll("{{check}}", cmd).trim();

  /* ---- Outputs ---- */

  const llms = [
    "# aequitas",
    summary,
    files,
    withCheck("npx aequitas-check"),
    "## Components\n\n" + index(catalog.components, catalog.componentGroups),
    "## Layouts\n\n" + index(catalog.layoutEntries, catalog.layoutGroups),
    "## Utilities\n\n" + utilitiesShort,
    "## Coming from Bootstrap or Tailwind\n\n" + translationsMd,
    "## Icons\n\n" + `\`<i class="icon" data-icon="…">\` with one of: ${iconsList}.`,
    "## Tokens\n\n" + tokensShort,
    "## Optional\n\n- [llms-full.txt](llms-full.txt): every component and layout with its attribute table and complete markup, utility CSS, token values, the behaviours API",
  ].join("\n\n");

  const llmsFull = [
    "# aequitas",
    summary,
    files,
    withCheck("npx aequitas-check"),
    "## Concepts\n\n" + concepts,
    "## Coming from Bootstrap or Tailwind\n\n" + translationsMd,
    "# Components\n\n" + entries(catalog.components, catalog.componentGroups),
    "# Layouts\n\n" + entries(catalog.layoutEntries, catalog.layoutGroups),
    "# Behaviours\n\n" + behaviours,
    "# Utilities\n\n" + utilitiesFull,
    "# Tokens\n\n" + tokensFull,
    "# Icons\n\n" + iconsList,
    other.length ? "# Other classes\n\n" + other.map((c) => `\`.${c}\``).join(" ") : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const agents = [
    "# UI: aequitas",
    "This project's UI is built with aequitas. " + summary.slice(2),
    "The complete reference is `node_modules/aequitas/dist/llms-full.txt`. Read the section for a component before you use it.",
    withCheck("npx aequitas-check").replace(/^## /, "### "),
  ].join("\n\n");

  await writeFile(dist + "llms.txt", llms + "\n");
  await writeFile(dist + "llms-full.txt", llmsFull + "\n");
  await writeFile(dist + "AGENTS.md", agents + "\n");

  const skill = dist + "skills/aequitas/";
  await rm(skill, { recursive: true, force: true });
  await mkdir(skill + "references", { recursive: true });
  await mkdir(skill + "scripts", { recursive: true });
  const skillMd = skillTemplate
    .replace("{{rules}}", rules.trim())
    .replace(
      "{{index}}",
      [
        "### Components",
        index(catalog.components, catalog.componentGroups).replaceAll("### ", "#### "),
        "### Layouts",
        index(catalog.layoutEntries, catalog.layoutGroups).replaceAll("### ", "#### "),
      ].join("\n\n"),
    )
    .replaceAll("{{check}}", "node <skill-dir>/scripts/aequitas-check.mjs");
  const refs: Record<string, string> = {
    "components.md": "# Components\n\n" + entries(catalog.components, catalog.componentGroups),
    "layouts.md": "# Layouts\n\n" + entries(catalog.layoutEntries, catalog.layoutGroups),
    "utilities.md": "# Utilities\n\n" + utilitiesFull,
    "tokens.md": "# Tokens\n\n" + tokensFull,
    "icons.md":
      '# Icons\n\n`<i class="icon" data-icon="name">`, `data-size="s|l|xl"`.\n\n' + iconsList,
    "behaviours.md": "# Behaviours (aequitas.js)\n\n" + behaviours,
    "translations.md": "# Coming from Bootstrap or Tailwind\n\n" + translationsMd,
  };
  await writeFile(skill + "SKILL.md", skillMd);
  for (const [name, body] of Object.entries(refs))
    await writeFile(skill + "references/" + name, body + "\n");
  await copyFile(dist + "aequitas-check.mjs", skill + "scripts/aequitas-check.mjs");

  // The docs site serves both files at its root.
  await mkdir(root + "site/public", { recursive: true });
  await copyFile(dist + "llms.txt", root + "site/public/llms.txt");
  await copyFile(dist + "llms-full.txt", root + "site/public/llms-full.txt");

  // The demos are what agents copy, so they must pass the checker themselves.
  const findings = Object.entries(iconSynonyms)
    .filter(([, to]) => !iconNames.includes(to))
    .map(([from, to]) => `  iconSynonyms: ${from} → ${to}, which is not an icon`);
  if (undocumented.length)
    findings.push(`  classes without a docs page: ${undocumented.map((c) => "." + c).join(" ")}`);
  findings.push(
    ...all.flatMap((e) =>
      e.demos.flatMap((d) =>
        check(d.html, { manifest, allow: docsOnly }).map(
          (p) => `  ${e.slug} › ${d.title}:${p.line}  ${p.message}${p.hint ? "  " + p.hint : ""}`,
        ),
      ),
    ),
  );
  console.log(
    `llms.txt ${(llms.length / 1024).toFixed(1)} kB · llms-full.txt ${(llmsFull.length / 1024).toFixed(1)} kB · skill · check` +
      (findings.length
        ? `\ncatalog demos: ${findings.length} checker finding(s)\n${findings.join("\n")}`
        : ""),
  );
}

async function bundleChecker(manifest: Manifest): Promise<void> {
  const out = dist + "aequitas-check.mjs";
  await esbuild({
    entryPoints: [root + "scripts/check.ts"],
    outfile: out,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    define: { __AE_MANIFEST__: JSON.stringify(manifest) },
    banner: { js: "#!/usr/bin/env node" },
    legalComments: "none",
    logLevel: "warning",
  });
  await chmod(out, 0o755);
}

const self = process.argv[1] && pathToFileURL(realpathSync(process.argv[1])).href;
if (import.meta.url === self) await ai();
