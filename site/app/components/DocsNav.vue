<script setup lang="ts">
import { sections, groupOf, groupIcons } from "~/utils/nav";
// Two-level navigation. Group open state is the reader's and persists; the current group is always open.
const route = useRoute();
const root = ref<HTMLElement>();
const open = reactive(new Set<string>());
const KEY = "docs-nav-open";

const persist = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify([...open]));
  } catch {}
};
const ensureCurrent = () => {
  const g = groupOf(route.path);
  if (g) open.add(g);
};
// After the current group has opened and laid out, bring the active link into the nav's own scroll area.
const scrollActive = () =>
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const nav = root.value;
      const a = nav?.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!nav || !a) return;
      const top = a.offsetTop - nav.clientHeight / 2 + a.offsetHeight / 2;
      nav.scrollTo({ top: Math.max(0, top), behavior: "instant" as ScrollBehavior });
    }),
  );
const toggle = (g: string) => {
  open.has(g) ? open.delete(g) : open.add(g);
  persist();
};

// The prerendered HTML opens only the current group. The reader's saved groups are opened by an inline
// script before first paint, and read again here on the client so hydration matches that DOM.
if (import.meta.client) {
  try {
    for (const g of JSON.parse(localStorage.getItem(KEY) ?? "[]")) open.add(g);
  } catch {}
}
ensureCurrent();
useHead({
  script: [
    {
      key: KEY,
      tagPosition: "bodyClose",
      innerHTML: `try{var o=JSON.parse(localStorage.getItem("${KEY}")||"[]");document.querySelectorAll(".docs-nav details[data-group]").forEach(function(d){if(o.indexOf(d.dataset.group)>-1)d.open=true})}catch(e){}`,
    },
  ],
});
onMounted(() => nextTick(scrollActive));
watch(
  () => route.path,
  () => {
    ensureCurrent();
    nextTick(scrollActive);
  },
);
</script>

<template>
  <nav ref="root" class="docs-nav scroll-y" aria-label="Documentation">
    <section v-for="s in sections" :key="s.title" class="docs-nav-section">
      <h6>{{ s.title }}</h6>
      <NuxtLink v-for="l in s.links ?? []" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
      <details
        v-for="g in s.groups ?? []"
        :key="g.group"
        :data-group="g.group"
        :open="open.has(g.group)"
      >
        <summary @click.prevent="toggle(g.group)">
          <i class="icon" :data-icon="groupIcons[g.group] ?? 'grid'" aria-hidden="true"></i>
          <span>{{ g.group }}</span>
          <span class="docs-nav-count">{{ g.links.length }}</span>
        </summary>
        <div class="docs-nav-group">
          <NuxtLink v-for="l in g.links" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
        </div>
      </details>
    </section>
  </nav>
</template>
