<script setup lang="ts">
import { enhance } from "@aequitas/aequitas.js";

// On-page table of contents, rebuilt from the article's sections after each page renders.
// Specimens inside a section become its nested items.
type Item = { id: string; label: string; children: { id: string; label: string }[] };
const items = ref<Item[]>([]);
const label = (el: Element | null | undefined) => el?.textContent?.trim().replace(/\.$/, "") ?? "";
const collect = () => {
  items.value = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".docs-main article > section[id], .docs-main article > div > section[id]",
    ),
  )
    .map((s) => ({
      id: s.id,
      // The section's first h2, wherever its layout puts it (foundation pages wrap it in a stack).
      label: label(s.querySelector("h2")),
      children: Array.from(s.querySelectorAll<HTMLElement>(":scope > .specimen[id]"))
        .map((sp) => ({ id: sp.id, label: label(sp.querySelector(":scope > header h3")) }))
        .filter((c) => c.label),
    }))
    .filter((i) => i.label);
};
const route = useRoute();
const nav = ref<HTMLElement | null>(null);
// The TOC renders after the plugin's own enhance() on page:finish (and from nothing, when the last
// page had none), so it wires up its own scroll tracking once its links are in the DOM.
const update = async () => {
  collect();
  await nextTick();
  if (nav.value?.parentElement) enhance(nav.value.parentElement);
};
onMounted(update);
useNuxtApp().hook("page:finish", update);
</script>

<template>
  <nav v-if="items.length > 1" ref="nav" :key="route.path" class="toc" aria-label="On this page">
    <ul>
      <li v-for="i in items" :key="i.id">
        <a :href="`#${i.id}`">{{ i.label }}</a>
        <ul v-if="i.children.length > 1">
          <li v-for="c in i.children" :key="c.id">
            <a :href="`#${c.id}`">{{ c.label }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
