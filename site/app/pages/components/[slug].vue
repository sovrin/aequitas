<script setup lang="ts">
import { findComponent } from "~/catalog";
const route = useRoute();
const entry = computed(() => findComponent(String(route.params.slug)));
if (!entry.value) throw createError({ statusCode: 404, statusMessage: "No such component" });
</script>

<template>
  <DocsEntry v-if="entry" :entry="entry" base="components" />
</template>
