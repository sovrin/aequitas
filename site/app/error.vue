<script setup lang="ts">
import type { NuxtError } from "#app";
// Any unknown route or failed render lands here, inside the docs shell so the nav stays at hand.
const props = defineProps<{ error: NuxtError }>();
const missing = computed(() => props.error.statusCode === 404);
useHead({ title: `${missing.value ? "Not found" : "Error"} · aequitas` });
const search = () => window.dispatchEvent(new CustomEvent("docs:search"));
</script>

<template>
  <NuxtLayout>
    <section class="page-intro">
      <p class="eyebrow">{{ error.statusCode }}</p>
      <h1 class="display">{{ missing ? "Not on the scale." : "Something broke." }}</h1>
      <p class="lead">
        {{
          missing
            ? "There is no page at this address. It may have moved, or the link was mistyped."
            : "This page failed to render. Reloading usually fixes it."
        }}
      </p>
      <div class="cluster">
        <button class="btn" data-variant="primary" @click="search">
          <i class="icon" data-icon="search"></i>Search the docs
        </button>
        <NuxtLink
          class="btn"
          to="/components"
          @click.prevent="clearError({ redirect: '/components' })"
          >Browse components</NuxtLink
        >
        <NuxtLink
          class="btn"
          data-variant="ghost"
          to="/"
          @click.prevent="clearError({ redirect: '/' })"
          >Home</NuxtLink
        >
      </div>
    </section>
  </NuxtLayout>
</template>
