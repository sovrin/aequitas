<script setup lang="ts">
import pkg from "../../../package.json";
const build = `git clone https://github.com/sovrin/aequitas.git
cd aequitas
pnpm install
pnpm build   # writes dist/`;
const link = `<link rel="stylesheet" href="aequitas.min.css" />
<link rel="stylesheet" href="aequitas.icons.min.css" /> <!-- optional -->
<script type="module" src="aequitas.min.js"><\/script> <!-- optional -->`;
const theme = `<html data-theme="dark" data-accent="teal" data-density="compact" data-radius="soft">`;
const hue = `:root {
  --ae-hue: 160;         /* the accent */
  --ae-neutral-hue: 200; /* the greys lean toward it */
}`;
const check = `node dist/aequitas-check.mjs index.html src/**/*.html`;
</script>

<template>
  <div>
    <DocsPageHeader
      group="Start"
      title="Install"
      lede="One stylesheet, linked. The icons and the behaviours are separate files you add only if you use them."
    />
    <section class="section stack gap-4" id="get">
      <div class="alert" data-tone="info">
        <i class="icon" data-icon="info"></i>
        <div>
          <strong>Pre-release, v{{ pkg.version }}.</strong>
          aequitas is not on npm yet. Build it from the repository.
        </div>
      </div>
      <h2>Get the files.</h2>
      <p class="text-muted measure">
        The build writes everything to <code>dist/</code>. Copy the files you need, and keep
        <code>fonts/</code> next to the stylesheets: they load Geist from <code>./fonts/</code>.
      </p>
      <DocsCode label="Terminal" lang="sh" :code="build" />
      <div class="table-scroll">
        <table class="table entry-table" data-size="s" data-hover="false">
          <tbody>
            <tr>
              <td class="entry-key"><code>aequitas.min.css</code></td>
              <td class="text-muted">Components, layouts and utilities.</td>
            </tr>
            <tr>
              <td class="entry-key"><code>aequitas.core.min.css</code></td>
              <td class="text-muted">The same without utilities.</td>
            </tr>
            <tr>
              <td class="entry-key"><code>aequitas.icons.min.css</code></td>
              <td class="text-muted">The icon set, as masks in <code>currentColor</code>.</td>
            </tr>
            <tr>
              <td class="entry-key"><code>aequitas.min.js</code></td>
              <td class="text-muted">
                The <NuxtLink to="/behaviours">behaviours</NuxtLink>, about 8 kB gzipped. ESM, typed
                by <code>aequitas.d.ts</code>.
              </td>
            </tr>
            <tr>
              <td class="entry-key"><code>fonts/</code></td>
              <td class="text-muted">Geist and Geist Mono, referenced by the stylesheets.</td>
            </tr>
            <tr>
              <td class="entry-key"><code>tokens.json</code>, <code>manifest.json</code></td>
              <td class="text-muted">
                Every token with its raw value; every class, <code>data-*</code> value and token the
                CSS styles.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section class="section stack gap-4" id="link">
      <h2>Link it.</h2>
      <p class="text-muted measure">
        Then write semantic HTML, add a component class and pick variants with
        <code>data-*</code> attributes. State is ARIA: there is no <code>.active</code>.
      </p>
      <DocsCode label="HTML" lang="html" :code="link" />
    </section>
    <section class="section stack gap-4" id="theme">
      <h2>Theme it.</h2>
      <p class="text-muted measure">
        Presets are attributes on <code>&lt;html&gt;</code> or any subtree. Light and dark follow
        the system unless <code>data-theme</code> says otherwise. For any other colour, set the two
        hues; everything else derives from them.
      </p>
      <DocsCode label="HTML" lang="html" :code="theme" />
      <DocsCode label="CSS" lang="css" :code="hue" />
      <p class="text-muted measure">
        Everything sits in <code>@layer ae.*</code>, so your own unlayered CSS wins without
        <code>!important</code>. <NuxtLink to="/foundations/presets">See every preset</NuxtLink>.
      </p>
    </section>
    <section class="section stack gap-4" id="check">
      <h2>Check it.</h2>
      <p class="text-muted measure">
        <code>aequitas-check</code> reads your markup against what the CSS actually styles: unknown
        classes (with the aequitas name for Bootstrap and Tailwind habits), <code>data-*</code>
        values it doesn't style, misplaced attributes, unknown tokens and unnamed icons.
      </p>
      <DocsCode label="Terminal" lang="sh" :code="check" />
      <p class="text-muted measure">
        Coding agents get the same reference: <code>llms.txt</code>, <code>llms-full.txt</code>,
        <code>AGENTS.md</code> and a skill in <code>skills/</code>, all in <code>dist/</code>.
      </p>
    </section>
  </div>
</template>
