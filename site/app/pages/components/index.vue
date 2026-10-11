<script setup lang="ts">
import { components, componentGroups } from "~/catalog";
const groups = componentGroups.filter((g) => components.some((e) => e.group === g)).length;
</script>

<template>
  <div>
    <DocsPageHeader
      group="Components"
      title="Every component."
      :lede="`${components.length} components in ${groups} groups. Each page has live examples, the markup they render and every attribute the CSS answers to.`"
    />
    <DocsIndex :entries="components" :groups="componentGroups" base="components" />
  </div>
</template>
