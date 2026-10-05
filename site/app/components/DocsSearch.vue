<script setup lang="ts">
// A search button; compact, it is the library's icon-only button. The palette itself is a single
// DocsPalette instance in the layout.
defineProps<{ compact?: boolean }>();
const open = () => window.dispatchEvent(new CustomEvent("docs:search"));
</script>

<template>
  <button
    class="btn search-btn"
    data-size="s"
    :data-icon="compact ? '' : undefined"
    @click="open"
    aria-label="Search (Command K)"
  >
    <i class="icon" data-icon="search"></i>
    <template v-if="!compact"><span>Search</span><kbd>⌘K</kbd></template>
  </button>
</template>
