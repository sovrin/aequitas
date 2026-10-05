<script setup lang="ts">
import pkg from "../../../package.json";
const route = useRoute();
const menu = ref<HTMLDialogElement>();
watch(
  () => route.path,
  () => menu.value?.close(),
);
</script>

<template>
  <div class="shell docs-shell" data-header style="--header: 3.25rem">
    <header class="navbar docs-topbar">
      <button class="btn" data-size="s" data-icon aria-label="Menu" data-open="#docs-menu">
        <i class="icon" data-icon="menu"></i>
      </button>
      <NuxtLink to="/" class="brand"><DocsMark /><span>aequitas</span></NuxtLink>
      <span class="end cluster gap-1"><DocsSearch compact /><DocsAppearance /></span>
    </header>

    <aside class="sidebar docs-sidebar">
      <div class="docs-sidebar-head">
        <NuxtLink to="/" class="brand" data-size="l">
          <DocsMark />
          <span class="brand-text"><b>aequitas</b><small>design language</small></span>
        </NuxtLink>
        <div class="sidebar-tools">
          <DocsSearch />
          <DocsAppearance />
        </div>
      </div>
      <DocsNav />
      <footer class="docs-sidebar-foot">
        <span class="badge" data-variant="outline">v{{ pkg.version }}</span>
        <a href="#" class="caption" data-quiet>MIT</a>
      </footer>
    </aside>

    <main id="main">
      <div class="docs-main">
        <article>
          <slot />
          <DocsPrevNext />
        </article>
        <DocsToc />
      </div>
      <footer class="footer">
        <div class="container grid" style="--min: 10rem">
          <div class="stack gap-2">
            <strong style="color: var(--ae-text)"><DocsMark /> aequitas</strong>
            <p>A minimal design language, in proportion.</p>
          </div>
          <div>
            <h6>Framework</h6>
            <ul>
              <li><NuxtLink to="/foundations/proportion">Foundations</NuxtLink></li>
              <li><NuxtLink to="/components/button">Components</NuxtLink></li>
              <li><NuxtLink to="/reference/utilities">Reference</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h6>Builds</h6>
            <ul>
              <li><code>aequitas.min.css</code></li>
              <li><code>aequitas.core.min.css</code></li>
              <li><code>aequitas.min.js</code></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>

    <dialog ref="menu" class="drawer docs-menu" data-side="start" id="docs-menu" data-light-dismiss>
      <div class="stack gap-4">
        <div class="cluster">
          <NuxtLink to="/" class="brand"><DocsMark /><span>aequitas</span></NuxtLink>
          <button
            class="btn end"
            data-size="s"
            data-variant="ghost"
            data-close
            aria-label="Close menu"
          >
            <i class="icon" data-icon="x"></i>
          </button>
        </div>
        <DocsNav />
      </div>
    </dialog>
    <DocsPalette />
  </div>
</template>
