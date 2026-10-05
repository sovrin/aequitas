<script setup lang="ts">
import utilities from "~/generated/utilities.json";

const groups = computed(() => {
  const by = new Map<string, typeof utilities.rules>();
  for (const r of utilities.rules) by.set(r.group, [...(by.get(r.group) ?? []), r]);
  return [...by.entries()];
});
const query = ref("");
const filtered = (rules: typeof utilities.rules) =>
  rules.filter((r) => {
    const q = query.value.trim().toLowerCase();
    return !q || r.cls.toLowerCase().includes(q) || r.css.toLowerCase().includes(q);
  });
const isResponsive = (cls: string) => utilities.responsive.includes(cls);

// Hand-written helpers in src/utilities.css and src/layout/pages.css, outside the generated set.
const helpers: { cls: string; desc: string; to?: string }[] = [
  { cls: ".hide-s", desc: "Hidden below 48rem." },
  { cls: ".hide-l", desc: "Hidden from 48rem up." },
  {
    cls: ".light-only",
    desc: "Shown only in the light theme, forced or from the system; e.g. a dark logo.",
  },
  { cls: ".dark-only", desc: "Shown only in the dark theme." },
  { cls: ".scrollbar-thin", desc: "Thin native scrollbar." },
  { cls: ".scrollbar-none", desc: "No scrollbar; the element still scrolls." },
  { cls: ".gap-1 … .gap-8", desc: "Gap of a flex or grid container, on the φ space scale." },
  { cls: ".end", desc: "Pushes an item to the far end of a flex row." },
  { cls: ".mono", desc: "Monospace font; the same as .font-mono." },
  {
    cls: ".sr-only",
    desc: "Visually hidden, still read by screen readers.",
    to: "/components/visually-hidden",
  },
  { cls: ".frost", desc: "Frosted glass on any element.", to: "/components/frost" },
  {
    cls: ".scroll-x · .scroll-y",
    desc: "Edge fades while there is more to scroll.",
    to: "/components/scroll-fades",
  },
];
</script>

<template>
  <div>
    <DocsPageHeader
      group="Reference"
      title="Utilities"
      lede="Single-purpose classes on the φ scale, generated at build time, with responsive and container variants."
    />
    <section class="section stack gap-6" id="utilities">
      <div class="stack measure">
        <h2>Utilities.</h2>
        <p class="text-muted">
          {{ utilities.rules.length }} single-purpose classes on the φ scale, generated at build
          time. Classes marked <span class="badge" data-tone="info">responsive</span> also exist as
          <code>s:</code> (&lt;48rem), <code>m:</code> (≥48rem), <code>l:</code> (≥64rem) and
          <code>xl:</code> (≥80rem) variants, e.g. <code>m:flex</code>, and as container variants
          <code>cq-s:</code> (&lt;32rem), <code>cq-m:</code> (≥32rem) and
          <code>cq-l:</code> (≥48rem), measured against the nearest <code>.cq</code> ancestor. Not
          needed? Use <code>aequitas.core.css</code>.
        </p>
        <div class="input-group" style="max-inline-size: 24rem">
          <span><i class="icon" data-icon="search"></i></span>
          <input
            class="input"
            v-model="query"
            type="search"
            placeholder="Filter classes…"
            aria-label="Filter classes"
          />
        </div>
      </div>
      <div v-if="!query" class="stack gap-3">
        <h6>Helpers</h6>
        <div class="table-scroll">
          <table class="table" data-size="s" data-hover="false">
            <tbody>
              <tr v-for="h in helpers" :key="h.cls">
                <td style="inline-size: 14rem">
                  <code>{{ h.cls }}</code>
                </td>
                <td class="text-muted text-s">
                  {{ h.desc }}
                  <NuxtLink v-if="h.to" :to="h.to">More</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-for="[group, rules] in groups" :key="group" class="stack gap-3">
        <template v-if="filtered(rules).length">
          <h6 style="text-transform: capitalize">{{ group }}</h6>
          <div class="table-scroll">
            <table class="table" data-size="s" data-hover="false">
              <tbody>
                <tr v-for="r in filtered(rules)" :key="r.cls">
                  <td style="inline-size: 14rem">
                    <code>.{{ r.cls }}</code>
                    <span
                      v-if="isResponsive(r.cls)"
                      class="badge"
                      data-tone="info"
                      style="margin-inline-start: var(--ae-space-2)"
                      >responsive</span
                    >
                  </td>
                  <td class="text-muted mono text-s">
                    {{ r.css }}<span v-if="r.note"> · {{ r.note }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
