<script setup lang="ts">
import { findLayout } from "~/catalog";
const route = useRoute();
const entry = computed(() => findLayout(String(route.params.slug)));
if (!entry.value) throw createError({ statusCode: 404, statusMessage: "No such layout" });
</script>

<template>
  <DocsEntry v-if="entry" :entry="entry" base="layouts" />
</template>
