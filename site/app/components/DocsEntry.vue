<script setup lang="ts">
import manifest from "@aequitas/manifest.json";
import { findComponent, findLayout } from "~/catalog";
import { apiRows, owned, type Manifest } from "~/catalog/api";
import type { Entry } from "~/catalog";
const props = defineProps<{ entry: Entry; base: "components" | "layouts" }>();
const related = computed(
  () =>
    (props.entry.related ?? [])
      .map((slug) => {
        const c = findComponent(slug);
        const l = findLayout(slug);
        return c
          ? { to: `/components/${slug}`, title: c.title }
          : l
            ? { to: `/layouts/${slug}`, title: l.title }
            : null;
      })
      .filter(Boolean) as { to: string; title: string }[],
);
const api = computed(() => apiRows(props.entry, manifest as Manifest));
const selectors = computed(() => owned(props.entry));
</script>

<template>
  <div>
    <DocsPageHeader :group="entry.group" :title="entry.title" :lede="entry.lede">
      <div class="entry-meta">
        <code v-for="s in selectors" :key="s">{{ s }}</code>
        <NuxtLink
          v-if="entry.js"
          to="/behaviours"
          class="badge"
          data-tone="info"
          data-tip="Needs aequitas.js for its behaviour"
          ><i class="icon" data-icon="zap" data-size="s"></i> aequitas.js</NuxtLink
        >
        <span v-else class="badge" data-variant="outline">CSS only</span>
      </div>
    </DocsPageHeader>

    <section class="section stack gap-5" id="examples">
      <h2>Examples</h2>
      <DocsSpecimen v-for="d in entry.demos" :key="d.title" :title="d.title" :note="d.note">
        <div v-html="d.html"></div>
      </DocsSpecimen>
    </section>

    <section v-if="entry.anatomy?.length" class="section stack gap-4" id="anatomy">
      <h2>Anatomy</h2>
      <div class="table-scroll">
        <table class="table entry-table" data-size="s" data-hover="false">
          <tbody>
            <tr v-for="[sel, role] in entry.anatomy" :key="sel">
              <td class="entry-key">
                <code>{{ sel }}</code>
              </td>
              <td class="text-muted" v-html="inline(role)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="api.length" class="section stack gap-4" id="api">
      <h2>API</h2>
      <div class="table-scroll">
        <table class="table entry-table" data-size="s" data-hover="false">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Values</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in api" :key="`${r.on}|${r.name}`">
              <td class="entry-key">
                <code>{{ r.name }}</code>
                <small v-if="r.on" class="caption"
                  >on <code>{{ r.on }}</code></small
                >
              </td>
              <td class="entry-values">
                <template v-if="r.values.length">
                  <code v-for="v in r.values" :key="v">{{ v }}</code>
                </template>
                <span v-else class="caption">boolean</span>
              </td>
              <td class="text-muted" v-html="inline(r.desc)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="entry.js" class="section stack gap-4" id="behaviour">
      <h2>Behaviour</h2>
      <p class="measure" v-html="inline(entry.js)"></p>
      <p class="caption measure">
        From <NuxtLink to="/behaviours">aequitas.js</NuxtLink>. It initialises itself; in an SPA,
        call <code>enhance()</code> after rendering new markup.
      </p>
    </section>

    <section
      v-if="entry.a11y?.length || entry.keys?.length"
      class="section stack gap-4"
      id="accessibility"
    >
      <h2>Accessibility</h2>
      <ul v-if="entry.a11y?.length" class="measure stack gap-2">
        <li v-for="(note, i) in entry.a11y" :key="i" v-html="inline(note)"></li>
      </ul>
      <div v-if="entry.keys?.length" class="table-scroll">
        <table class="table entry-table" data-size="s" data-hover="false">
          <thead>
            <tr>
              <th>Key</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[k, effect] in entry.keys" :key="k">
              <td class="entry-key">
                <template v-for="(part, i) in k.split(' ')" :key="i"
                  ><kbd v-if="part !== '/'">{{ part }}</kbd
                  ><span v-else class="caption"> / </span></template
                >
              </td>
              <td class="text-muted" v-html="inline(effect)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="related.length" class="section stack gap-3" id="related">
      <h6>Related</h6>
      <div class="cluster gap-2">
        <NuxtLink v-for="r in related" :key="r.to" :to="r.to" class="btn" data-size="s">{{
          r.title
        }}</NuxtLink>
      </div>
    </section>
  </div>
</template>
