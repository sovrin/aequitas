<script setup lang="ts">
definePageMeta({ layout: "showcase" });
useHead({ title: "Landing · showcase · aequitas" });
</script>

<template>
  <div class="page">
    <header class="navbar" data-shrink>
      <strong>Northlight</strong>
      <nav class="cluster"><a href="#">Product</a><a href="#">Pricing</a><a href="#">Docs</a></nav>
      <span class="end cluster gap-2"
        ><a href="#" class="btn" data-size="s" data-variant="ghost">Sign in</a
        ><a href="#" class="btn" data-size="s" data-variant="primary">Start free</a></span
      >
    </header>
    <main>
      <div class="container">
        <section class="hero" data-center>
          <h6>Introducing Northlight 2</h6>
          <h1>Publish in proportion.</h1>
          <p>
            The calm CMS. One ratio for every space, glass only where it floats, and nothing you
            have to fight.
          </p>
          <div class="cluster">
            <button class="btn" data-variant="primary" data-size="l">Start free</button
            ><button class="btn" data-size="l">Watch the film</button>
          </div>
        </section>
        <div class="logos mb-8">
          <span>Acme</span><span>Globex</span><span>Initech</span><span>Umbrella</span
          ><span>Hooli</span>
        </div>
        <div class="stats mb-8">
          <div class="stat"><b>12k</b><span>teams</span></div>
          <div class="stat"><b>99.98%</b><span>uptime</span></div>
          <div class="stat"><b>&lt;50 ms</b><span>publish latency</span></div>
          <div class="stat"><b>φ</b><span>one ratio</span></div>
        </div>
        <section class="split mb-8" data-reveal>
          <div class="stack gap-4">
            <h6>Editor</h6>
            <h2>Write like it's paper.</h2>
            <p class="lead">
              A measure of 65 characters, a leading of φ, and nothing in the margins until you ask.
            </p>
            <a href="#" class="btn">See the editor</a>
          </div>
          <div class="window">
            <header><span>Untitled — Northlight</span></header>
            <div class="p-5 prose">
              <h3>On proportion</h3>
              <p>Long-form text gets its rhythm from the same ratio as the interface around it.</p>
              <p><span class="skeleton" style="inline-size: 60%"></span></p>
            </div>
          </div>
        </section>
        <section class="stack gap-5 mb-8" data-reveal>
          <div class="text-center stack gap-2">
            <h6>Pricing</h6>
            <h2>Simple, like the rest.</h2>
          </div>
          <div class="pricing">
            <div class="card">
              <h4>Starter</h4>
              <p class="price">€0<small>/mo</small></p>
              <ul>
                <li>1 site</li>
                <li>Community support</li>
              </ul>
              <button class="btn">Start free</button>
            </div>
            <div class="card" data-featured>
              <h4>Pro</h4>
              <p class="price">€12<small>/mo</small></p>
              <ul>
                <li>Unlimited sites</li>
                <li>Priority support</li>
                <li>Presets &amp; density</li>
              </ul>
              <button class="btn">Upgrade</button>
            </div>
            <div class="card">
              <h4>Team</h4>
              <p class="price">€48<small>/mo</small></p>
              <ul>
                <li>SSO</li>
                <li>Audit log</li>
                <li>Shared libraries</li>
              </ul>
              <button class="btn">Contact sales</button>
            </div>
          </div>
        </section>
      </div>
    </main>
    <footer class="footer">
      <div class="container grid" style="--min: 10rem">
        <div>
          <strong style="color: var(--ae-text)">Northlight</strong>
          <p>Built with aequitas.</p>
        </div>
        <div>
          <h6>Product</h6>
          <ul>
            <li><a href="#">Editor</a></li>
            <li><a href="#">Publishing</a></li>
          </ul>
        </div>
        <div>
          <h6>Company</h6>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>
