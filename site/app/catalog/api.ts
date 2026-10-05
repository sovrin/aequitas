import type { Entry } from "./types";

/* The API table of an entry: the data-* attributes the built CSS matches on what the entry owns,
   merged with the catalog's own descriptions. Shared by the docs site and scripts/ai.ts. */

export type Anchor = {
  tag?: string;
  classes: string[];
  values: string[];
  bare: boolean;
  within?: string[];
};
export type Manifest = { classes: string[]; attrs: Record<string, Anchor[]>; tokens: string[] };
export type ApiRow = { name: string; on?: string; values: string[]; desc: string };

export const owned = (e: Entry): string[] => e.owns ?? [`.${e.slug}`];

/** `.btn` → { classes: ["btn"] }, `dialog.drawer` → { tag: "dialog", classes: ["drawer"] }. */
const parse = (sel: string) => {
  const tag = /^[a-z][a-z0-9]*/.exec(sel)?.[0];
  const classes = [...sel.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
  return { tag, classes };
};

const matches = (a: Anchor, sel: string) => {
  const s = parse(sel);
  if (s.classes.length)
    return s.classes.every((c) => a.classes.includes(c)) && (!s.tag || a.tag === s.tag);
  // A bare element owns only what is styled on it everywhere, not inside another component.
  return !!s.tag && a.tag === s.tag && !a.classes.length && !a.within;
};

/** `data-size`, `data-size=s|l`, `th[aria-sort]`, `.toasts[data-position=…]`. */
const key = (k: string) => {
  const m = /^(?:(.+?)\[)?([\w-]+)(?:="?([^"\]]*)"?)?\]?$/.exec(k.trim());
  if (!m) return { name: k, values: [] as string[] };
  return { on: m[1], name: m[2], values: m[3] ? m[3].split("|").filter(Boolean) : [] };
};

export function apiRows(e: Entry, manifest: Manifest): ApiRow[] {
  const rows: ApiRow[] = [];
  const sels = owned(e);
  for (const [name, anchors] of Object.entries(manifest.attrs))
    for (const sel of sels) {
      const hits = anchors.filter((a) => matches(a, sel));
      if (!hits.length) continue;
      rows.push({
        name,
        on: sels.length > 1 ? sel : undefined,
        values: [...new Set(hits.flatMap((a) => a.values))],
        desc: "",
      });
    }
  for (const [k, desc] of e.attrs ?? []) {
    const h = key(k);
    const row = rows.find((r) => r.name === h.name && (!h.on || !r.on || r.on === h.on));
    if (row) {
      row.desc = desc;
      row.values = [...new Set([...h.values, ...row.values])];
      row.on ??= h.on;
    } else rows.push({ name: h.name, on: h.on, values: h.values, desc });
  }
  // Catalog order first (it reads as a story), then whatever the CSS adds.
  const order = (e.attrs ?? []).map(([k]) => key(k).name);
  const rank = (r: ApiRow) => (order.includes(r.name) ? order.indexOf(r.name) : order.length);
  return rows.sort((a, b) => rank(a) - rank(b));
}
