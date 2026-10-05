<script setup lang="ts">
import iconNames from "~/generated/icons.json";
const query = ref("");
const shown = computed(() =>
  iconNames.filter((n) => !query.value || n.includes(query.value.toLowerCase())),
);
</script>

<template>
  <div>
    <DocsPageHeader
      group="Reference"
      title="Icons"
      lede="377 mask icons in currentColor with squared caps and joins. A separate file: aequitas.icons.css."
    />
    <section class="section stack gap-6" id="icons">
      <div class="stack measure">
        <p class="text-muted">
          <code>&lt;i class="icon" data-icon="search"&gt;&lt;/i&gt;</code> — sizes via
          <code>data-size="s|l|xl"</code>, colour from <code>currentColor</code>. Families (arrows,
          chevrons, corners, files, folders, users, calendars…) are derived from one definition by
          rotation, so they stay consistent.
        </p>
        <div class="input-group" style="max-inline-size: 24rem">
          <span><i class="icon" data-icon="search"></i></span>
          <input
            class="input"
            v-model="query"
            type="search"
            placeholder="Filter icons…"
            aria-label="Filter icons"
          />
          <span class="caption">{{ shown.length }}</span>
        </div>
      </div>
      <DocsVirtualGrid v-slot="{ item: n }" :items="shown" style="--min: 7rem">
        <div class="card stack gap-2 items-center text-center" style="padding: var(--ae-space-4)">
          <i class="icon" :data-icon="n" data-size="xl"></i>
          <code class="text-xs truncate" style="max-inline-size: 100%" :title="n">{{ n }}</code>
        </div>
      </DocsVirtualGrid>
      <div class="cluster">
        <button class="btn" data-variant="primary">
          <i class="icon" data-icon="plus"></i> New
        </button>
        <button class="btn"><i class="icon" data-icon="download"></i> Export</button>
        <button class="btn" data-icon aria-label="Settings">
          <i class="icon" data-icon="sliders"></i>
        </button>
        <span class="badge" data-tone="success"
          ><i class="icon" data-icon="check" data-size="s"></i> Done</span
        >
        <span class="text-muted"><i class="icon" data-icon="clock"></i> 2 min</span>
      </div>
    </section>
  </div>
</template>
