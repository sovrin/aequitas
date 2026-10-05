import type { HighlighterCore, ThemeRegistration } from "shiki/core";

// Shiki with the JavaScript regex engine (no wasm) and only the three grammars the docs use. It
// loads on first use: prerendered blocks arrive highlighted in the payload, so the client only
// fetches it when a specimen's code is opened.
export type Lang = "html" | "css" | "js";

// Colours are CSS variables, set in docs.css off the accent hue, so one theme serves light, dark
// and every accent.
const v = (name: string) => `var(--hl-${name})`;
const theme: ThemeRegistration = {
  name: "aequitas",
  colors: { "editor.foreground": "var(--ae-text)", "editor.background": "transparent" },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: v("comment"), fontStyle: "italic" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "keyword.operator",
        "punctuation.definition.tag",
        "punctuation.separator",
        "punctuation.terminator",
      ],
      settings: { foreground: v("punct") },
    },
    {
      scope: [
        "entity.name.tag",
        "keyword",
        "storage",
        "keyword.control.at-rule",
        "punctuation.definition.keyword",
      ],
      settings: { foreground: v("keyword") },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "support.type.property-name",
        "meta.object-literal.key",
        "variable.other.property",
      ],
      settings: { foreground: v("attr") },
    },
    { scope: ["string", "punctuation.definition.string"], settings: { foreground: v("string") } },
    {
      scope: [
        "constant",
        "keyword.other.unit",
        "variable.css",
        "variable.argument.css",
        "support.constant",
      ],
      settings: { foreground: v("constant") },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: v("function") },
    },
  ],
};

let highlighter: Promise<HighlighterCore> | undefined;
const load = () =>
  (highlighter ??= Promise.all([import("shiki/core"), import("shiki/engine/javascript")]).then(
    ([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [theme],
        langs: [
          import("shiki/langs/html.mjs"),
          import("shiki/langs/css.mjs"),
          import("shiki/langs/javascript.mjs"),
        ],
        engine: createJavaScriptRegexEngine(),
      }),
  ));

/** Source to the inner HTML of a <code>: one <span class="line"> per line, joined by newlines. */
export async function highlight(code: string, lang: Lang): Promise<string> {
  const html = (await load()).codeToHtml(code, {
    lang: lang === "js" ? "javascript" : lang,
    theme: "aequitas",
  });
  return html.match(/<code>([\s\S]*)<\/code>/)?.[1] ?? "";
}
