/*
 * Reads the built CSS and records what markup it actually styles: every class, every data-*
 * attribute with the values it is matched on (and on which element/classes), and every --ae-*
 * custom property. Feeds the checker (scripts/check.ts) and the AI docs (scripts/ai.ts).
 */
import { readFile } from "node:fs/promises";
import { transform } from "lightningcss";
import type { Selector, SelectorComponent } from "lightningcss";

/** One place a data-* attribute is matched: the element/classes it sits on, and its values. */
export type Anchor = {
  tag?: string;
  classes: string[];
  /** Values matched with `[attr="value"]`. */
  values: string[];
  /** Also matched bare, `[attr]`. */
  bare: boolean;
  /** For a tag-only compound: the classes of the compound before it (`.menu a[x]` → ["menu"]). */
  within?: string[];
};

export type Manifest = {
  classes: string[];
  attrs: Record<string, Anchor[]>;
  tokens: string[];
};

type Compound = {
  tag?: string;
  classes: string[];
  attrs: [string, string | null][];
  within?: string[];
};

export async function buildManifest(files: string[]): Promise<Manifest> {
  const classes = new Set<string>();
  const tokens = new Set<string>();
  const attrs = new Map<string, Map<string, Anchor>>();

  const record = (c: Compound) => {
    for (const [name, value] of c.attrs) {
      if (!name.startsWith("data-")) continue;
      const anchors = attrs.get(name) ?? attrs.set(name, new Map()).get(name)!;
      const sorted = [...new Set(c.classes)].sort();
      const within = c.within?.length ? [...new Set(c.within)].sort() : undefined;
      const key = `${c.tag ?? ""}|${sorted.join(".")}|${within?.join(".") ?? ""}`;
      const a =
        anchors.get(key) ??
        anchors
          .set(key, {
            tag: c.tag,
            classes: sorted,
            values: [],
            bare: false,
            ...(within && { within }),
          })
          .get(key)!;
      if (value === null) a.bare = true;
      else if (!a.values.includes(value)) a.values.push(value);
    }
  };

  // Splits a selector at combinators and expands each compound into the element shapes it matches.
  const visit = (sel: Selector): Compound[] => {
    const out: Compound[] = [];
    let part: SelectorComponent[] = [];
    for (const c of [...sel, { type: "combinator", value: "descendant" } as SelectorComponent]) {
      if (c.type !== "combinator") {
        part.push(c);
        continue;
      }
      if (part.length) {
        // A compound with no class of its own is only styled in the context of the one before it.
        const context = out.at(-1)?.classes;
        out.push(
          ...expand(part).map((c) =>
            !c.classes.length && context?.length ? { ...c, within: context } : c,
          ),
        );
      }
      part = [];
    }
    return out;
  };

  const expand = (parts: SelectorComponent[]): Compound[] => {
    let acc: Compound[] = [{ classes: [], attrs: [] }];
    for (const c of parts) {
      if (c.type === "type") for (const a of acc) a.tag = c.name.toLowerCase();
      else if (c.type === "class") {
        classes.add(c.name);
        for (const a of acc) a.classes.push(c.name);
      } else if (c.type === "attribute") {
        const op = c.operation;
        if (op && op.operator !== "equal") continue; // ^= *= etc. are not enumerations
        for (const a of acc) a.attrs.push([c.name, op ? op.value : null]);
      } else if (c.type === "pseudo-class") {
        if (c.kind === "root") for (const a of acc) a.tag = "html";
        else if (c.kind === "is" || c.kind === "where" || c.kind === "any") {
          // :is(.a, .b)[x] matches .a[x] or .b[x]: one compound per alternative.
          const alts = c.selectors.flatMap((s) => {
            const cs = visit(s);
            cs.slice(0, -1).forEach(record);
            return cs.slice(-1);
          });
          if (alts.length)
            acc = acc.flatMap((a) =>
              alts.map((alt) => ({
                tag: alt.tag ?? a.tag,
                classes: [...a.classes, ...alt.classes],
                attrs: [...a.attrs, ...alt.attrs],
              })),
            );
        } else if (c.kind === "not") {
          // :not([x="v"]) still names a valid value of x for this element; its classes are not required.
          for (const s of c.selectors) {
            const cs = visit(s);
            cs.slice(0, -1).forEach(record);
            for (const a of acc) a.attrs.push(...(cs.at(-1)?.attrs ?? []));
          }
        } else if (c.kind === "has") {
          for (const s of c.selectors) visit(s).forEach(record);
        }
      }
    }
    return acc;
  };

  for (const file of files) {
    const raw = await readFile(file);
    // Pass 1 lowers nesting so every selector is complete; pass 2 reads them.
    const flat = transform({ filename: file, code: raw, targets: { chrome: 100 << 16 } }).code;
    transform({
      filename: file,
      code: flat,
      visitor: {
        Selector(sel) {
          visit(sel).forEach(record);
          return sel;
        },
      },
    });
    const text = flat.toString();
    for (const m of text.matchAll(/(--ae-[\w-]+)\s*:/g)) tokens.add(m[1]);
    for (const m of text.matchAll(/@property\s+(--ae-[\w-]+)/g)) tokens.add(m[1]);
  }

  return {
    classes: [...classes].sort(),
    attrs: Object.fromEntries(
      [...attrs].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, [...v.values()]]),
    ),
    tokens: [...tokens].sort(),
  };
}
