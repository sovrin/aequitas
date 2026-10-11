<script setup lang="ts">
// A search button; compact, it is the library's icon-only button. The palette itself is a single
// DocsPalette instance in the layout.
defineProps<{ compact?: boolean }>();
const open = () => window.dispatchEvent(new CustomEvent("docs:search"));
// The hotkey takes either modifier; the hint shows the one this platform uses, after hydration.
const mod = ref("⌘");
onMounted(() => {
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) mod.value = "Ctrl ";
});
</script>

<template>
  <button
    class="btn search-btn"
    data-size="s"
    :data-icon="compact ? '' : undefined"
    @click="open"
    aria-label="Search"
    aria-keyshortcuts="Meta+K Control+K"
  >
    <i class="icon" data-icon="search"></i>
    <template v-if="!compact"
      ><span>Search</span><kbd>{{ mod }}K</kbd></template
    >
  </button>
</template>
