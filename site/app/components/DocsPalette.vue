<script setup lang="ts">
import { markMatches } from "@aequitas/aequitas.js";
import { index } from "~/utils/nav";
// ⌘K search over the site index, built on the framework's command palette. One instance per page.
const dlg = ref<HTMLDialogElement>();
const input = ref<HTMLInputElement>();
const list = ref<HTMLElement>();
const q = ref("");
const active = ref(0);
const router = useRouter();

const results = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return index.slice(0, 8);
  return index
    .map((e) => {
      const hay = `${e.title} ${e.page} ${e.keywords}`.toLowerCase();
      const score = e.title.toLowerCase().includes(term) ? 3 : hay.includes(term) ? 1 : 0;
      return { e, score };
    })
    .filter((r) => r.score)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.e)
    .slice(0, 10);
});
watch(results, () => {
  active.value = 0;
  // After the render, so the ranges land on the new result nodes.
  nextTick(() => list.value && markMatches(list.value, q.value));
});

const open = () => {
  q.value = "";
  dlg.value?.showModal();
  nextTick(() => input.value?.focus());
};
const close = () => dlg.value?.close();
const go = (to: string) => {
  close();
  router.push(to);
};
const move = (step: number) => {
  const n = results.value.length;
  if (!n) return;
  active.value = (active.value + step + n) % n;
  nextTick(() =>
    document.getElementById(`docs-result-${active.value}`)?.scrollIntoView({ block: "nearest" }),
  );
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") (e.preventDefault(), move(1));
  else if (e.key === "ArrowUp") (e.preventDefault(), move(-1));
  else if (e.key === "Enter" && !e.isComposing && results.value[active.value])
    (e.preventDefault(), go(results.value[active.value].to));
};
const hotkey = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    dlg.value?.open ? close() : open();
  }
};
onMounted(() => {
  window.addEventListener("keydown", hotkey);
  window.addEventListener("docs:search", open);
});
onUnmounted(() => {
  window.removeEventListener("keydown", hotkey);
  window.removeEventListener("docs:search", open);
});
</script>

<template>
  <!-- data-manual: the results are rendered here, so aequitas.js leaves filtering and keys to us. -->
  <dialog ref="dlg" class="palette" data-manual @click.self="close">
    <i class="icon" data-icon="search"></i>
    <input
      ref="input"
      v-model="q"
      class="input"
      role="combobox"
      aria-expanded="true"
      aria-autocomplete="list"
      aria-controls="docs-results"
      :aria-activedescendant="results.length ? `docs-result-${active}` : undefined"
      placeholder="Search components, layouts, utilities…"
      @keydown="onKey"
    />
    <div v-show="results.length" id="docs-results" ref="list" role="listbox" aria-label="Pages">
      <h6>{{ q ? "Results" : "Jump to" }}</h6>
      <div
        v-for="(r, i) in results"
        :id="`docs-result-${i}`"
        :key="r.to"
        role="option"
        :aria-selected="i === active"
        @pointermove="active = i"
        @click="go(r.to)"
      >
        <span>{{ r.title }}</span>
        <small>{{ r.page }}</small>
      </div>
    </div>
    <div v-if="!results.length" class="empty">
      <h4>Nothing for “{{ q.trim() }}”</h4>
      <p>Try a component name, like <code>combobox</code>.</p>
    </div>
    <footer>
      <span><kbd>↑</kbd><kbd>↓</kbd>Move</span>
      <span><kbd>↵</kbd>Open</span>
      <span><kbd>esc</kbd>Close</span>
    </footer>
  </dialog>
</template>
