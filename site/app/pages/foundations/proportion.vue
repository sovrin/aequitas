<script setup lang="ts">
const scale = `:root {
  --ae-phi: 1.618034;
  --ae-space-1: calc(var(--ae-unit) * pow(var(--ae-phi), -3)); /* 0.236 */
  --ae-space-4: var(--ae-unit);                                  /* 1     */
  --ae-space-5: calc(var(--ae-unit) * var(--ae-phi));            /* 1.618 */
  --ae-text-l:  calc(var(--ae-text-base) * pow(var(--ae-phi), 0.5));
  --ae-leading-normal: var(--ae-phi);
  --ae-container: calc(1rem * pow(var(--ae-phi), 9));            /* ≈ 76rem */
  --ae-measure: calc(40ch * var(--ae-phi));                      /* ≈ 65ch */
}`;
</script>

<template>
  <div>
    <DocsPageHeader
      group="Foundations"
      title="Proportion"
      lede="One number, φ, and every scale derives from it with pow(). Change the base; the proportions hold."
    />
    <section class="section stack gap-6" id="scale">
      <div class="stack measure" data-reveal>
        <h2>One ratio, every scale.</h2>
        <p class="text-muted">
          Space steps by φ. Type steps by √φ. Radii, blur and motion follow. Change the base and the
          proportions hold.
        </p>
      </div>
      <div class="split" data-reveal>
        <div class="card stack">
          <h6>Space · 1rem × φⁿ</h6>
          <div class="scale-row">
            <span>−3 · 0.24</span>
            <div class="bar" style="--n: -3"></div>
          </div>
          <div class="scale-row">
            <span>−2 · 0.38</span>
            <div class="bar" style="--n: -2"></div>
          </div>
          <div class="scale-row">
            <span>−1 · 0.62</span>
            <div class="bar" style="--n: -1"></div>
          </div>
          <div class="scale-row">
            <span>0 · 1.00</span>
            <div class="bar" style="--n: 0"></div>
          </div>
          <div class="scale-row">
            <span>1 · 1.62</span>
            <div class="bar" style="--n: 1"></div>
          </div>
          <div class="scale-row">
            <span>2 · 2.62</span>
            <div class="bar" style="--n: 2"></div>
          </div>
          <div class="scale-row">
            <span>3 · 4.24</span>
            <div class="bar" style="--n: 3"></div>
          </div>
        </div>
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
