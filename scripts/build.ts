import { execFile } from "node:child_process";
import { realpathSync } from "node:fs";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { bundle } from "lightningcss";
import { build as esbuild } from "esbuild";
import { generate } from "./generate.js";
import { ai } from "./ai.js";

const entry = fileURLToPath(new URL("../src/aequitas.css", import.meta.url));
const outDir = fileURLToPath(new URL("../dist/", import.meta.url));

// Baseline 2024-ish: light-dark(), nesting, @layer, container queries, :has().
const targets = {
  chrome: 123 << 16,
  safari: (18 << 16) | (0 << 8),
  firefox: 128 << 16,
};

export async function build(): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await generate();

  // Self-host the variable fonts next to the CSS.
  await mkdir(outDir + "fonts/", { recursive: true });
  for (const [pkg, file] of [
    ["geist", "geist-latin-wght-normal.woff2"],
    ["geist-mono", "geist-mono-latin-wght-normal.woff2"],
  ]) {
    await copyFile(
      new URL(`../node_modules/@fontsource-variable/${pkg}/files/${file}`, import.meta.url),
      outDir + "fonts/" + file,
    );
  }

  // Behaviours: one ESM file, plus a minified copy.
  for (const minify of [false, true]) {
    await esbuild({
      entryPoints: [fileURLToPath(new URL("../src/aequitas.ts", import.meta.url))],
      outfile: outDir + (minify ? "aequitas.min.js" : "aequitas.js"),
      bundle: true,
      format: "esm",
      target: ["chrome123", "safari18", "firefox128"],
      minify,
      sourcemap: minify,
      legalComments: "inline",
    });
  }

  // Type declaration for the behaviours module.
  await promisify(execFile)("pnpm", ["exec", "tsc", "-p", "tsconfig.types.json"], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
  });

  // Design tokens as JSON: every --ae-* declared in src/tokens/*.css, raw values.
  const tokens: Record<string, string> = {};
  const tokenDir = fileURLToPath(new URL("../src/tokens/", import.meta.url));
  for (const file of (await readdir(tokenDir)).sort()) {
    const text = await readFile(tokenDir + file, "utf8");
    for (const m of text.matchAll(/(--ae-[\w-]+):\s*([^;]+);/g))
      tokens[m[1]] ??= m[2].replace(/\s+/g, " ").trim();
  }
  await writeFile(outDir + "tokens.json", JSON.stringify(tokens, null, 2) + "\n");

  const entries = [
    ["aequitas", entry],
    ["aequitas.core", fileURLToPath(new URL("../src/core.css", import.meta.url))],
    ["aequitas.icons", fileURLToPath(new URL("../src/icons.css", import.meta.url))],
  ] as const;
  for (const [base, file] of entries) {
    for (const minify of [false, true]) {
      const { code, map } = bundle({ filename: file, minify, targets, sourceMap: minify });
      const name = `${base}${minify ? ".min" : ""}.css`;
      const suffix = minify ? `\n/*# sourceMappingURL=${name}.map */\n` : "";
      await writeFile(outDir + name, code + suffix);
      if (map) await writeFile(outDir + name + ".map", map);
      console.log(`${name}  ${(code.length / 1024).toFixed(1)} kB`);
    }
  }

  // Docs for AI agents, the checker and the skill; reads the CSS built above.
  await ai();
}

const self = process.argv[1] && pathToFileURL(realpathSync(process.argv[1])).href;
if (import.meta.url === self) await build();
