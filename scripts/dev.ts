import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.js";

// Rebuild dist/ when src/ changes; Nuxt's own HMR picks the new CSS/JS up.
const root = fileURLToPath(new URL("../", import.meta.url));
await build();

let timer: NodeJS.Timeout | undefined;
watch(join(root, "src"), { recursive: true }, (_, file) => {
  if (String(file).includes("_generated")) return; // our own output
  clearTimeout(timer);
  timer = setTimeout(() => build().catch(console.error), 50);
});

const site = spawn("pnpm", ["--dir", "site", "dev", ...process.argv.slice(2)], {
  cwd: root,
  stdio: "inherit",
});
site.on("exit", (code) => process.exit(code ?? 0));
