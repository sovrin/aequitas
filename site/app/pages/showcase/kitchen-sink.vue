<script setup lang="ts">
import { components, layoutEntries } from "~/catalog";
definePageMeta({ layout: "showcase" });
useHead({ title: "Kitchen sink · showcase · aequitas" });
const all = [...layoutEntries, ...components];
</script>

<template>
  <div class="container stack gap-7 p-6">
    <div class="page-intro">
      <p class="eyebrow">Showcase</p>
      <h1 class="display">Kitchen sink.</h1>
      <p class="lead">
        Every demo in the catalog on one page: {{ all.length }} entries,
        {{ all.reduce((n, e) => n + e.demos.length, 0) }} demos.
      </p>
    </div>
    <section v-for="e in all" :key="e.slug" :id="e.slug" class="stack gap-4">
      <div class="page-header">
        <div>
          <h6>{{ e.group }}</h6>
          <h3>{{ e.title }}</h3>
        </div>
        <NuxtLink
          :to="`/${layoutEntries.includes(e) ? 'layouts' : 'components'}/${e.slug}`"
          class="btn"
          data-size="s"
          data-variant="ghost"
          >Docs <i class="icon" data-icon="arrow-right" data-size="s"></i
        ></NuxtLink>
      </div>
      <div v-for="d in e.demos" :key="d.title" class="stack gap-2">
        <span class="caption">{{ d.title }}</span>
        <div v-html="d.html"></div>
      </div>
    </section>
  </div>
</template>
