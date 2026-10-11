<script setup lang="ts">
import { layoutEntries, layoutGroups } from "~/catalog";
</script>

<template>
  <div>
    <DocsPageHeader
      group="Layouts"
      title="Every layout."
      :lede="`${layoutEntries.length} page shapes and application layouts, from the shell that frames an app to the panes inside it.`"
    />
    <DocsIndex :entries="layoutEntries" :groups="layoutGroups" base="layouts" />
  </div>
</template>
