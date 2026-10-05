<script setup lang="ts">
// October 2026 starts on a Thursday; a fixed demo month.
const days = [
  ...[28, 29, 30].map((d) => ({ d, outside: true })),
  ...Array.from({ length: 31 }, (_, i) => ({ d: i + 1, outside: false })),
  { d: 1, outside: true },
];
</script>

<template>
  <div class="calendar-grid">
    <span v-for="w in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="w">{{ w }}</span>
    <button
      v-for="(x, i) in days"
      :key="i"
      :data-outside="x.outside || undefined"
      :aria-current="!x.outside && x.d === 2 ? 'date' : undefined"
      :data-range="!x.outside && x.d >= 12 && x.d <= 16 ? '' : undefined"
      :aria-selected="!x.outside && (x.d === 12 || x.d === 16) ? 'true' : undefined"
    >
      {{ x.d }}
    </button>
  </div>
</template>
