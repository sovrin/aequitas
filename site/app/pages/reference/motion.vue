<script setup lang="ts">
const loading = ref<HTMLElement>();
const bar = () => {
  const el = loading.value;
  if (!el) return;
  delete el.dataset.done;
  el.dataset.active = "";
  setTimeout(() => {
    delete el.dataset.active;
    el.dataset.done = "";
  }, 1600);
};
</script>

<template>
  <div>
    <DocsPageHeader
      group="Reference"
      title="Motion"
      lede="Entrance presets on the token durations, staggered with sibling-index(); all of it off under reduced motion."
    />
    <section class="section stack gap-6" id="motion">
      <div class="stack measure">
        <h2>Motion.</h2>
        <p class="text-muted">
          Entrance presets on the token durations, staggered with <code>data-stagger</code> (via
          <code>sibling-index()</code>) or a manual <code>--i</code>. All of it is off under reduced
          motion.
        </p>
        <p class="text-muted text-s">
          Presets: <code>.animate-fade-in</code> <code>.animate-slide-up</code>
          <code>.animate-slide-down</code> <code>.animate-scale-in</code> <code>.animate-spin</code>
          <code>.animate-blink</code>. Delays: <code>.delay-1 … .delay-5</code>, 60 ms apart (60–300
          ms).
        </p>
      </div>
      <div class="grid" data-stagger>
        <div class="card animate-slide-up"><code>.animate-slide-up</code></div>
        <div class="card animate-slide-up"><code>.animate-slide-up</code> · 2</div>
        <div class="card animate-slide-up"><code>.animate-slide-up</code> · 3</div>
        <div class="card animate-fade-in delay-3"><code>.animate-fade-in .delay-3</code></div>
        <div class="card animate-scale-in delay-4"><code>.animate-scale-in .delay-4</code></div>
        <div class="card">
          <i class="icon animate-spin" data-icon="refresh"></i> <code>.animate-spin</code>
          <span class="animate-blink">·</span> <code>.animate-blink</code>
        </div>
      </div>
      <div class="cluster">
        <button class="btn" @click="bar">Run loading bar</button>
        <a class="skip-link" href="#motion">Skip link (focus with Tab)</a>
      </div>
      <div class="loading-bar" ref="loading"></div>
    </section>
    <section class="section stack gap-5" id="scroll">
      <div class="stack measure">
        <h2>Scroll-driven.</h2>
        <p class="text-muted">
          No JavaScript: both run on <code>animation-timeline</code> and do nothing where it is
          unsupported or motion is reduced.
        </p>
      </div>
      <div class="table-scroll">
        <table class="table" data-size="s" data-hover="false">
          <tbody>
            <tr>
              <td style="inline-size: 14rem"><code>[data-reveal]</code></td>
              <td class="text-muted text-s">
                Fades, rises and unblurs as the element enters the viewport (from 5% to 55% of its
                entry).
              </td>
            </tr>
            <tr>
              <td><code>.parallax</code></td>
              <td class="text-muted text-s">
                Drifts with page scroll. <code>--depth</code> from <code>-1</code> (slower) to
                <code>1</code> (faster), default <code>0.5</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="grid">
        <div class="card" data-reveal><code>data-reveal</code></div>
        <div class="card" data-reveal><code>data-reveal</code></div>
        <div class="card" data-reveal><code>data-reveal</code></div>
      </div>
    </section>
  </div>
</template>
