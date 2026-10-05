<template>
  <div>
    <DocsPageHeader
      group="Foundations"
      title="Material"
      lede="Surfaces separate by tone and shadow, never by outline. Glass is for layers that float; controls are flat tints."
    />
    <section class="section stack gap-5" id="colour">
      <h2>Colour.</h2>
      <p class="text-muted measure">
        Everything is OKLCH and derives from two hues: <code>--ae-hue</code> for the accent and
        <code>--ae-neutral-hue</code> for the greys. Light and dark follow the system; force one
        with <code>data-theme</code>.
      </p>
      <div class="swatches">
        <div class="swatch" style="--swatch: var(--ae-bg)">bg</div>
        <div class="swatch" style="--swatch: var(--ae-bg-sunken)">bg-sunken</div>
        <div class="swatch" style="--swatch: var(--ae-surface)">surface</div>
        <div class="swatch" style="--swatch: var(--ae-fill)">fill</div>
        <div class="swatch" style="--swatch: var(--ae-text)">text</div>
        <div class="swatch" style="--swatch: var(--ae-text-muted)">text-muted</div>
        <div class="swatch" style="--swatch: var(--ae-accent)">accent</div>
        <div class="swatch" style="--swatch: var(--ae-success)">success</div>
        <div class="swatch" style="--swatch: var(--ae-warning)">warning</div>
        <div class="swatch" style="--swatch: var(--ae-danger)">danger</div>
        <div class="swatch" style="--swatch: var(--ae-info)">info</div>
      </div>
    </section>
    <section class="section stack gap-5" id="glass">
      <h2>Glass.</h2>
      <p class="text-muted measure">
        Frost is a translucent fill, blur and saturation, with one specular on the top edge. Cards
        use a 66–72% mix; modal layers use 82–88% so content stays legible over anything. It falls
        back to solid surfaces without <code>backdrop-filter</code>, under reduced transparency or
        forced colours.
      </p>
      <div class="grid">
        <div class="card">
          <h6>Card · 66 / 72%</h6>
          <p class="text-muted text-s">Inline surface.</p>
        </div>
        <div class="popover" style="position: static; display: block; opacity: 1; scale: 1">
          <h6>Popover · 88 / 82%</h6>
          <p class="text-muted text-s">Floating layer.</p>
        </div>
        <div class="card" data-solid>
          <h6>Solid</h6>
          <p class="text-muted text-s"><code>data-solid</code>, or any control.</p>
        </div>
      </div>
    </section>
    <section class="section stack gap-5" id="depth">
      <h2>Depth.</h2>
      <p class="text-muted measure">
        Shadows are layered: a contact, a key and an ambient layer, large blur, low alpha. Key and
        ambient offsets sit on the space scale, each blur two steps above its offset; contact layers
        are whole pixels. Never a stroke.
      </p>
      <div class="grid">
        <div class="card" style="box-shadow: var(--ae-shadow-s)"><code>--ae-shadow-s</code></div>
        <div class="card" style="box-shadow: var(--ae-shadow-m)"><code>--ae-shadow-m</code></div>
        <div class="card" style="box-shadow: var(--ae-shadow-l)"><code>--ae-shadow-l</code></div>
      </div>
    </section>
  </div>
</template>
