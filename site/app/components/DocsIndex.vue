<script setup lang="ts">
import { byGroup, type Entry } from "~/catalog";
import { groupIcons, groupId } from "~/utils/nav";
// One section per group: its name on the narrow side of a golden split, its pages on the wide side.
const props = defineProps<{ entries: Entry[]; groups: string[]; base: "components" | "layouts" }>();
const grouped = computed(() => byGroup(props.entries, props.groups));
</script>

<template>
  <div>
    <nav class="cluster gap-2 docs-index-jump" aria-label="Groups">
      <a v-for="g in grouped" :key="g.group" class="chip" :href="`#${groupId(g.group)}`">
        {{ g.group }}
      </a>
    </nav>
    <section
      v-for="g in grouped"
      :id="groupId(g.group)"
      :key="g.group"
      class="section split docs-index-group"
    >
      <h2>
        <i class="icon" :data-icon="groupIcons[g.group] ?? 'grid'" aria-hidden="true"></i>
        {{ g.group }}
        <span class="docs-nav-count">{{ g.entries.length }}</span>
      </h2>
      <ul class="docs-index-list" data-variant="plain">
        <li v-for="e in g.entries" :key="e.slug">
          <NuxtLink :to="`/${base}/${e.slug}`">
            <b>{{ e.title }}</b>
            <span>{{ e.lede }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
