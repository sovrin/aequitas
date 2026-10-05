<script setup lang="ts">
useHead({ title: "aequitas · a minimal design language" });
const install = `<link rel="stylesheet" href="aequitas.min.css">
<script type="module" src="aequitas.min.js"><\/script>`;
</script>

<template>
  <div>
    <section class="hero-split" id="top">
      <div class="stack gap-5">
        <p class="eyebrow">A CSS design language</p>
        <h1 class="display">Glass, in proportion.</h1>
        <p class="lead">
          Space, type, radius, blur and motion are all powers of φ. Surfaces separate by tone and
          shadow, never by outline. Glass only where it floats. Squares throughout.
        </p>
        <div class="cluster">
          <NuxtLink class="btn" data-variant="primary" data-size="l" to="/components/button"
            >Browse components</NuxtLink
          >
          <NuxtLink class="btn" data-size="l" to="/foundations/proportion">How it's built</NuxtLink>
        </div>
        <div class="stats">
          <div class="stat"><b>φ</b><span>one ratio</span></div>
          <div class="stat"><b>20 kB</b><span>core, gzipped</span></div>
          <div class="stat"><b>6 kB</b><span>optional JS, gzipped</span></div>
          <div class="stat"><b>0</b><span>outlines</span></div>
        </div>
      </div>
      <DocsPhiTiles />
    </section>
    <section class="section stack gap-5 overview" id="overview">
      <h2>Start here.</h2>
      <p class="text-muted measure">
        One page per component and layout, each with its markup and attributes; four showcases
        compose them into real screens.
      </p>
      <div class="grid">
        <NuxtLink
          class="card"
          data-interactive
          to="/foundations/proportion"
          style="text-decoration: none; color: inherit"
        >
          <h4>Foundations</h4>
          <p class="text-muted">The φ scales, colour and material, accent and density presets.</p>
        </NuxtLink>
        <NuxtLink
          class="card"
          data-interactive
          to="/layouts/shell"
          style="text-decoration: none; color: inherit"
        >
          <h4>Layouts</h4>
          <p class="text-muted">Shells, page shapes and application layouts, one page each.</p>
        </NuxtLink>
        <NuxtLink
          class="card"
          data-interactive
          to="/components/button"
          style="text-decoration: none; color: inherit"
        >
          <h4>Components</h4>
          <p class="text-muted">Every component on its own page, with markup and attributes.</p>
        </NuxtLink>
        <NuxtLink
          class="card"
          data-interactive
          to="/showcase/dashboard"
          style="text-decoration: none; color: inherit"
        >
          <h4>Showcases</h4>
          <p class="text-muted">A dashboard, settings, a landing page and the kitchen sink.</p>
        </NuxtLink>
        <NuxtLink
          class="card"
          data-interactive
          to="/behaviours"
          style="text-decoration: none; color: inherit"
        >
          <h4>Behaviours</h4>
          <p class="text-muted">A 6 kB module that wires up what HTML can't do alone.</p>
        </NuxtLink>
      </div>
      <DocsCode label="Install" lang="html" :code="install" />
    </section>
  </div>
</template>
