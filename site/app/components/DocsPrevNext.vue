<script setup lang="ts">
import { pages } from "~/utils/nav";
const route = useRoute();
const i = computed(() => pages.findIndex((p) => p.to === route.path));
const prev = computed(() => (i.value > 0 ? pages[i.value - 1] : null));
const next = computed(() =>
  i.value >= 0 && i.value < pages.length - 1 ? pages[i.value + 1] : null,
);
</script>

<template>
  <nav v-if="prev || next" class="prevnext" aria-label="Pages">
    <NuxtLink v-if="prev" :to="prev.to" class="card" data-interactive rel="prev">
      <span class="caption"
        ><i class="icon" data-icon="arrow-left" data-size="s"></i> Previous</span
      >
      <b>{{ prev.label }}</b>
    </NuxtLink>
    <span v-else></span>
    <NuxtLink
      v-if="next"
      :to="next.to"
      class="card"
      data-interactive
      rel="next"
      style="text-align: end"
    >
      <span class="caption">Next <i class="icon" data-icon="arrow-right" data-size="s"></i></span>
      <b>{{ next.label }}</b>
    </NuxtLink>
  </nav>
</template>
