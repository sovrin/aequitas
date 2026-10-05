<!--
  The aequitas mark on the .brand-mark tile, in currentColor so it follows the accent and shape
  presets. Same geometry as public/favicon.svg; at this size the blur behind the glass would be
  under a pixel, so the stem simply dims where it passes behind the disc.
-->
<template>
  <span class="brand-mark" aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="currentColor">
      <rect x="30" y="7.75" width="4" height="9.25" />
      <rect x="30" y="17" width="4" height="30" fill-opacity=".5" />
      <rect x="30" y="47" width="4" height="9.25" />
      <circle cx="32" cy="32" r="15" fill-opacity=".3" />
    </svg>
  </span>
</template>
