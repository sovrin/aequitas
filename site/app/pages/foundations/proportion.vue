<script setup lang="ts">
const scale = `:root {
  --ae-phi: 1.618034;
  --ae-space-1: round(calc(var(--ae-unit) * pow(var(--ae-phi), -3)), 1px); /* 0.236 */
  --ae-space-4: round(var(--ae-unit), 1px);                                /* 1     */
  --ae-space-5: round(calc(var(--ae-unit) * var(--ae-phi)), 1px);          /* 1.618 */
  --ae-text-l:  calc(var(--ae-text-base) * pow(var(--ae-phi), 0.5));
  --ae-leading-normal: var(--ae-phi);
  --ae-container: calc(1rem * pow(var(--ae-phi), 9));            /* ≈ 76rem */
  --ae-measure: calc(40ch * var(--ae-phi));                      /* ≈ 65ch */
}`;

const PHI = 1.618034;
// The base unit in rem. The demo below redeclares the scales from it, so everything inside reflows.
const unit = ref(1);
const MIN = 0.75;
const MAX = 1.5;
const steps = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
// Snapped like the tokens: whole pixels at a 16px root.
const px = (n: number) => Math.round(unit.value * 16 * PHI ** n);
const live = computed(() => ({
  "--ae-unit": `${unit.value}rem`,
  "--ae-text-base": `${unit.value}rem`,
}));
const value = computed(() => `${((unit.value - MIN) / (MAX - MIN)) * 100}%`);

const durations = [
  { name: "stagger", n: -3, ms: 220 * PHI ** -3 },
  { name: "fast", n: -1, ms: 220 / PHI },
  { name: "duration", n: 0, ms: 220 },
  { name: "slow", n: 1, ms: 220 * PHI },
];

// What is deliberately not a power of φ, and why. Mirrors the README's list.
const exceptions: [string, string][] = [
  ["Hairlines", "1px separators are device pixels: a fraction would blur or vanish."],
  ["The 1.5px stroke", "Field rings and chevron arms sit between a hairline and the state edge."],
  ["The 2px state edge", "“This one is on” must read at any density, so it never scales."],
  ["Focus rings", "2px gap, 2px ring: sized for visibility, not proportion."],
  ["24px pointer target", "An accessibility floor (WCAG 2.5.8), not a design choice."],
  ["Breakpoints", "48, 64 and 80rem. Media queries can't read custom properties."],
  ["Viewport caps", "Values such as 85dvh keep sheets and dialogs inside the screen."],
  ["Colour and alpha", "OKLCH lightness and chroma are tuned for contrast, not ratio."],
  ["Glyphs and markers", "Icons, chevrons and the mark keep the geometry they were drawn with."],
];
</script>

<template>
  <div>
    <DocsPageHeader
      group="Foundations"
      title="Proportion"
      lede="One number, φ, and every scale derives from it with pow(). Drag the base unit below: nothing else is set by hand, so everything follows."
    />
    <section class="section stack gap-6" id="scale">
      <div class="stack measure">
        <h2>One ratio, every scale.</h2>
        <p class="text-muted">
          Space steps by φ, type by √φ. The demo redeclares both scales from one unit, the way
          <code>data-density</code> does for a whole page.
        </p>
      </div>
      <div class="phi-live stack gap-5" :style="live">
        <div class="field phi-unit">
          <label for="phi-unit">Base unit</label>
          <div class="cluster gap-4">
            <input
              id="phi-unit"
              v-model.number="unit"
              type="range"
              :min="MIN"
              :max="MAX"
              step="0.01"
              :style="{ '--value': value }"
            />
            <output for="phi-unit">{{ unit.toFixed(2) }}rem</output>
          </div>
        </div>
        <div class="card stack">
          <h6>Space · unit × φⁿ, snapped to whole pixels</h6>
          <div
            class="phi-squares"
            role="img"
            :aria-label="`Space steps: ${steps.map(px).join(', ')} pixels`"
          >
            <figure v-for="n in steps" :key="n">
              <span :style="{ inlineSize: `var(--ae-space-${n + 4})` }"></span>
              <figcaption>{{ px(n) }}</figcaption>
            </figure>
          </div>
        </div>
        <div class="split">
          <div class="card stack">
            <h6>Type · base × φ^(n/2)</h6>
            <div class="type-row">
              <code>text-m</code><span style="font-size: var(--ae-text-m)">Quiet, legible</span>
            </div>
            <div class="type-row">
              <code>text-l</code><span style="font-size: var(--ae-text-l)">Quiet, legible</span>
            </div>
            <div class="type-row">
              <code>text-xl</code><span style="font-size: var(--ae-text-xl)">Quiet, legible</span>
            </div>
            <div class="type-row">
              <code>text-2xl</code><span style="font-size: var(--ae-text-2xl)">Quiet</span>
            </div>
            <div class="type-row">
              <code>text-3xl</code
              ><span style="font-size: var(--ae-text-3xl); letter-spacing: -0.04em">Quiet</span>
            </div>
          </div>
          <div class="card stack">
            <h6>Components · read the same tokens</h6>
            <h4>Northlight</h4>
            <p class="text-muted">
              Padding, gaps, type and the buttons below all come from the unit above.
            </p>
            <div class="cluster">
              <button class="btn" data-variant="primary">Publish</button>
              <button class="btn">Save draft</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section stack gap-5" id="other-scales">
      <div class="stack measure">
        <h2>Shape, blur and time.</h2>
        <p class="text-muted">
          The same ratio sets the corners once a shape preset brings them back, the depth of the
          glass and the length of every transition.
        </p>
      </div>
      <div class="grid phi-facets">
        <div class="card stack">
          <h6>Radius · radius-m × φⁿ, under <code>data-radius="round"</code></h6>
          <div class="phi-radii">
            <figure v-for="(r, i) in ['s', 'm', 'l', 'xl']" :key="r" :style="{ '--n': i - 1 }">
              <span></span>
              <figcaption>{{ r }}</figcaption>
            </figure>
          </div>
        </div>
        <div class="card stack">
          <h6>Blur · 1rem × φⁿ</h6>
          <div class="phi-blurs">
            <figure v-for="b in ['s', 'm', 'l']" :key="b">
              <span :style="{ backdropFilter: `blur(var(--ae-blur-${b}))` }"></span>
              <figcaption>blur-{{ b }}</figcaption>
            </figure>
          </div>
        </div>
        <div class="card stack">
          <h6>Motion · 220ms × φⁿ</h6>
          <div v-for="d in durations" :key="d.name" class="scale-row">
            <span>{{ Math.round(d.ms) }}ms</span>
            <div class="bar" :style="{ '--n': d.n + 3 }"></div>
          </div>
          <p class="caption">
            <NuxtLink to="/reference/motion">Easing and choreography</NuxtLink>
          </p>
        </div>
      </div>
    </section>
    <section class="section stack gap-5" id="off-the-scale">
      <div class="stack measure">
        <h2>Off the scale.</h2>
        <p class="text-muted">
          A few values are not powers of φ, on purpose. Each one is here so that nothing else has to
          be: any other value that is not on the scale is a bug.
        </p>
      </div>
      <div class="table-scroll">
        <table class="table entry-table" data-size="s" data-hover="false">
          <tbody>
            <tr v-for="[name, why] in exceptions" :key="name">
              <td class="entry-key">{{ name }}</td>
              <td class="text-muted">{{ why }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section class="section stack gap-4" id="tokens">
      <h2>Tokens.</h2>
      <p class="text-muted measure">
        Every <code>--ae-*</code> token is also exported as <code>dist/tokens.json</code> with its
        raw value, for JavaScript, Figma or your own build.
      </p>
      <DocsCode label="tokens/scale.css" lang="css" :code="scale" />
    </section>
  </div>
</template>
