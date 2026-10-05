<script setup lang="ts">
const props = defineProps<{ group: string; title: string; lede: string }>();
useHead({ title: `${props.title} · aequitas` });
</script>

<template>
  <header class="page-intro">
    <p class="eyebrow">{{ group }}</p>
    <h1 class="display">{{ title }}</h1>
    <p class="lead">{{ lede }}</p>
    <slot />
  </header>
</template>
