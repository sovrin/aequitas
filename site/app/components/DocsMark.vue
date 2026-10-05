<!--
  The aequitas mark on the .brand-mark tile: the same frost as public/favicon.svg and the README
  banner. The stem passes behind the glass disc, sharp outside and blurred through it, under a
  catch of light along the top. Drawn in currentColor, the accent's contrast ink, so it flips with
  the theme and forced colours keep it visible; only the catch stays white, being light rather than
  ink. The tile's gradient is in docs.css and follows the accent preset and the theme. Ids are per
  instance, since the mark appears more than once on a page.
-->
<script setup lang="ts">
const id = useId();
</script>

<template>
  <span class="brand-mark" aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="currentColor">
      <defs>
        <linearGradient :id="`${id}-catch`" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset=".5" stop-color="#fff" stop-opacity=".75" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <clipPath :id="`${id}-glass`"><circle cx="32" cy="32" r="15" /></clipPath>
        <mask :id="`${id}-clear`">
          <rect width="64" height="64" fill="#fff" />
          <circle cx="32" cy="32" r="15" fill="#000" />
        </mask>
        <filter :id="`${id}-blur`" x="-1" y="-1" width="3" height="3">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>
      <g :clip-path="`url(#${id}-glass)`">
        <rect
          x="30"
          y="7.75"
          width="4"
          height="48.5"
          fill-opacity=".85"
          :filter="`url(#${id}-blur)`"
        />
      </g>
      <circle cx="32" cy="32" r="15" fill-opacity=".24" />
      <path
        d="M19.44 24.75A14.5 14.5 0 0 1 44.56 24.75"
        fill="none"
        :stroke="`url(#${id}-catch)`"
        stroke-width="1"
      />
      <rect x="30" y="7.75" width="4" height="48.5" :mask="`url(#${id}-clear)`" />
    </svg>
  </span>
</template>
