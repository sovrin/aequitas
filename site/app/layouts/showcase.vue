<template>
  <div>
    <slot />
    <nav class="showcase-bar" aria-label="Showcase">
      <NuxtLink to="/" class="btn" data-size="s"
        ><i class="icon" data-icon="arrow-left" data-size="s"></i> Docs</NuxtLink
      >
      <NuxtLink to="/showcase/dashboard" class="btn" data-size="s" data-variant="ghost"
        >Dashboard</NuxtLink
      >
      <NuxtLink to="/showcase/settings" class="btn" data-size="s" data-variant="ghost"
        >Settings</NuxtLink
      >
      <NuxtLink to="/showcase/landing" class="btn" data-size="s" data-variant="ghost"
        >Landing</NuxtLink
      >
      <NuxtLink to="/showcase/kitchen-sink" class="btn" data-size="s" data-variant="ghost"
        >Kitchen sink</NuxtLink
      >
      <button
        class="btn"
        data-size="s"
        data-variant="ghost"
        data-theme-set="light"
        aria-label="Light theme"
      >
        <i class="icon" data-icon="sun"></i>
      </button>
      <button
        class="btn"
        data-size="s"
        data-variant="ghost"
        data-theme-set="dark"
        aria-label="Dark theme"
      >
        <i class="icon" data-icon="moon"></i>
      </button>
    </nav>
  </div>
</template>
