<script setup lang="ts">
import { components, layoutEntries } from "~/catalog";
definePageMeta({ layout: "showcase" });
useHead({ title: "Kitchen sink · showcase · aequitas" });
const all = [...layoutEntries, ...components];
// Each row runs at one control size, set on every control with data-size; the row's token only
// draws the two rules.
const sizes = [
  ["s", "var(--ae-control-size-s)"],
  ["", undefined],
  ["l", "var(--ae-control-size-l)"],
] as const;
</script>

<template>
  <div class="container stack gap-7 p-6">
    <div class="page-intro">
      <p class="eyebrow">Showcase</p>
      <h1 class="display">Kitchen sink.</h1>
      <p class="lead">
        Every demo in the catalog on one page: {{ all.length }} entries,
        {{ all.reduce((n, e) => n + e.demos.length, 0) }} demos.
      </p>
    </div>
    <section id="control-heights" class="stack gap-4">
      <div class="page-header">
        <div>
          <h6>Foundations</h6>
          <h3>Control heights</h3>
        </div>
      </div>
      <p class="text-muted">
        Every control that sits in a row reads <code>--ae-control-size</code> and
        <code>--ae-control-text</code>; <code>data-size</code> steps both. The two rules mark the
        height: anything that crosses the lower one has drifted. A chip is always the small size, so
        it shows in that row only.
      </p>
      <div
        v-for="[size, token] in sizes"
        :key="size"
        class="cluster control-heights"
        :style="{ '--ae-control-size': token }"
      >
        <span class="caption">{{ size || "m" }}</span>
        <span v-if="size === 's'" class="chip">Chip</span>
        <span class="avatar" :data-size="size || undefined">AL</span>
        <button class="btn" :data-size="size || undefined">Button</button>
        <button class="btn" data-variant="primary" :data-size="size || undefined">Primary</button>
        <button class="btn" data-icon :data-size="size || undefined" aria-label="Search">
          <i class="icon" data-icon="search"></i>
        </button>
        <input
          class="input"
          :data-size="size || undefined"
          placeholder="Input"
          aria-label="Input"
        />
        <div class="select">
          <select class="input" :data-size="size || undefined" aria-label="Select">
            <option>Select</option>
          </select>
        </div>
        <input class="input" type="date" :data-size="size || undefined" aria-label="Date" />
        <div class="number" :data-size="size || undefined">
          <button type="button" aria-label="Decrease" data-step="-1">−</button>
          <input type="number" value="3" aria-label="Count" />
          <button type="button" aria-label="Increase" data-step="1">+</button>
        </div>
        <div class="segmented" :data-size="size || undefined">
          <label><input type="radio" :name="`ch-${size}`" checked /><span>One</span></label>
          <label><input type="radio" :name="`ch-${size}`" /><span>Two</span></label>
        </div>
        <div class="input-group" :data-size="size || undefined">
          <span>https://</span>
          <input class="input" aria-label="Address" />
        </div>
        <div class="tag-input" :data-size="size || undefined">
          <span class="chip">Tag</span>
          <input placeholder="Add…" aria-label="Add a tag" />
        </div>
      </div>
    </section>
    <section v-for="e in all" :key="e.slug" :id="e.slug" class="stack gap-4">
      <div class="page-header">
        <div>
          <h6>{{ e.group }}</h6>
          <h3>{{ e.title }}</h3>
        </div>
        <NuxtLink
          :to="`/${layoutEntries.includes(e) ? 'layouts' : 'components'}/${e.slug}`"
          class="btn"
          data-size="s"
          data-variant="ghost"
          >Docs <i class="icon" data-icon="arrow-right" data-size="s"></i
        ></NuxtLink>
      </div>
      <div v-for="d in e.demos" :key="d.title" class="stack gap-2">
        <span class="caption">{{ d.title }}</span>
        <div v-html="d.html"></div>
      </div>
    </section>
  </div>
</template>
