<script setup lang="ts">
// A highlighted .code block with a copy button. The copy action reads the <pre>'s text, so the
// token spans never reach the clipboard. Until the highlight resolves it shows the plain code.
import { escape } from "~/utils/inline";
import { highlight, type Lang } from "~/utils/highlight";
const props = defineProps<{ code: string; lang: Lang; label?: string }>();
const source = computed(() => props.code.trim());

// Keyed by content, so a prerendered block hydrates from the payload instead of loading Shiki.
const hash = (s: string) => [...s].reduce((h, c) => (h * 33) ^ c.charCodeAt(0), 5381) >>> 0;
const { data } = useAsyncData(
  () => `hl-${props.lang}-${hash(source.value).toString(36)}`,
  () => highlight(source.value, props.lang),
);
const html = computed(() => data.value ?? escape(source.value));
</script>

<template>
  <figure class="code docs-code">
    <figcaption>
      {{ label ?? lang }} <button class="btn" data-size="s" data-copy>Copy</button>
    </figcaption>
    <pre tabindex="0"><code :data-lang="lang" v-html="html"></code></pre>
  </figure>
</template>
