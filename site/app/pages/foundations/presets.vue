<script setup lang="ts">
// Accent, density and shape drive the site-wide appearance (and the panel); type is a page-only demo.
const { accent, density, radius } = useAppearance();
const preset = (attr: string, e: Event) => {
  const v = (e.target as HTMLSelectElement).value;
  if (v) document.documentElement.dataset[attr] = v;
  else delete document.documentElement.dataset[attr];
};
</script>

<template>
  <div>
    <DocsPageHeader
      group="Foundations"
      title="Presets"
      lede="Attributes on <html> or any subtree. Accent, density, shape and type — the whole page follows."
    />
    <section class="section stack gap-5" id="presets">
      <h2>Try them.</h2>
      <div class="cluster">
        <div class="field">
          <label for="accent">Accent</label>
          <div class="select">
            <select class="input" id="accent" v-model="accent">
              <option value="">Blue</option>
              <option value="indigo">Indigo</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="teal">Teal</option>
              <option value="graphite">Graphite</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="density">Density</label>
          <div class="select">
            <select class="input" id="density" v-model="density">
              <option value="compact">Compact</option>
              <option value="">Default</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="radius">Shape</label>
          <div class="select">
            <select class="input" id="radius" v-model="radius">
              <option value="">Square</option>
              <option value="soft">Soft</option>
              <option value="round">Round</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="type">Type</label>
          <div class="select">
            <select class="input" id="type" @change="preset('type', $event)">
              <option value="">System</option>
              <option value="humanist">Humanist</option>
              <option value="serif">Serif</option>
              <option value="mono">Mono</option>
            </select>
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="card stack gap-3">
          <h4>A card</h4>
          <p class="text-muted">With a <a href="#">link</a> and controls.</p>
          <div class="cluster">
            <button class="btn" data-variant="primary">Primary</button
            ><button class="btn">Default</button
            ><span class="badge" data-tone="success">Badge</span>
          </div>
          <input class="input" placeholder="Input" />
        </div>
        <div class="card stack gap-3">
          <h6>Choices</h6>
          <label><input type="checkbox" checked /> Checkbox</label
          ><label><input type="checkbox" role="switch" checked /> Switch</label>
          <div class="segmented" role="radiogroup">
            <label><input type="radio" name="pv" checked /><span>One</span></label
            ><label><input type="radio" name="pv" /><span>Two</span></label>
          </div>
        </div>
      </div>
    </section>
    <section class="section stack gap-4" id="table">
      <h2>Attributes.</h2>
      <table class="table" data-size="s" data-hover="false">
        <tbody>
          <tr>
            <td><code>data-accent</code></td>
            <td class="text-muted">
              blue · indigo · purple · pink · red · orange · yellow · green · teal · graphite
            </td>
          </tr>
          <tr>
            <td><code>data-density</code></td>
            <td class="text-muted">
              compact · spacious — scales <code>--ae-unit</code>, every φ-derived space follows
            </td>
          </tr>
          <tr>
            <td><code>data-radius</code></td>
            <td class="text-muted">soft · round — the system is square by default</td>
          </tr>
          <tr>
            <td><code>data-type</code></td>
            <td class="text-muted">humanist · serif · mono</td>
          </tr>
          <tr>
            <td><code>data-theme</code></td>
            <td class="text-muted">light · dark — otherwise follows the system</td>
          </tr>
          <tr>
            <td><code>--ae-hue</code>, <code>--ae-neutral-hue</code></td>
            <td class="text-muted">any hue; the two knobs everything else derives from</td>
          </tr>
        </tbody>
      </table>
      <p class="text-muted text-s">
        Also honoured: <code>prefers-contrast: more</code>, <code>forced-colors</code>,
        <code>prefers-reduced-motion</code>, <code>prefers-reduced-transparency</code>.
      </p>
    </section>
  </div>
</template>
