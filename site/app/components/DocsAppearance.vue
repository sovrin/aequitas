<script setup lang="ts">
// Appearance panel: theme, accent, density, shape. State and persistence live in useAppearance().
// Every option previews itself, so the panel is read at a glance rather than label by label.

// Hues as in tokens/presets.css. The swatch resolves them like --ae-accent does, so each shows the
// accent as it will look in the current scheme.
const accents: [value: string, name: string, hue: number, chroma?: number][] = [
  ["", "Blue", 255],
  ["indigo", "Indigo", 280],
  ["purple", "Purple", 305],
  ["pink", "Pink", 350],
  ["red", "Red", 25],
  ["orange", "Orange", 55],
  ["yellow", "Yellow", 90],
  ["green", "Green", 150],
  ["teal", "Teal", 195],
  ["graphite", "Graphite", 255, 0.01],
];

const themes = [
  ["light", "Light", "sun"],
  ["dark", "Dark", "moon"],
  ["auto", "Auto", "circle-half"],
] as const;

const densities = [
  ["compact", "Compact"],
  ["", "Default"],
  ["spacious", "Spacious"],
] as const;

const shapes = [
  ["", "Square"],
  ["soft", "Soft"],
  ["round", "Round"],
] as const;

const { theme, accent, density, radius } = useAppearance();
const id = useId();
const accentName = computed(() => accents.find((a) => a[0] === accent.value)?.[1] ?? "Blue");
</script>

<template>
  <button class="btn appearance-btn" data-size="s" :popovertarget="id" aria-label="Appearance">
    <!-- Coloured by --ae-accent, so it is right from first paint, before the controls sync. -->
    <span class="appearance-swatch"></span>
    <span class="sr-only">Appearance</span>
  </button>
  <div class="popover appearance" popover :id="id">
    <div class="appearance-body">
      <section :aria-labelledby="`${id}-theme`">
        <h3 :id="`${id}-theme`">Theme</h3>
        <div class="ap-options" role="radiogroup" :aria-labelledby="`${id}-theme`">
          <label v-for="[v, name, icon] in themes" :key="v">
            <input type="radio" :name="`ap-theme-${id}`" :value="v" v-model="theme" />
            <!-- A tiny page in each scheme; Auto shows both, split along the diagonal. -->
            <span class="ap-preview" aria-hidden="true">
              <span
                v-for="scheme in v === 'auto' ? ['light', 'dark'] : [v]"
                :key="scheme"
                class="theme-pane"
                :data-scheme="scheme"
              >
                <span class="theme-pane-side"></span>
                <span class="theme-pane-card"><span></span><span></span><span></span></span>
              </span>
            </span>
            <span class="ap-name"><i class="icon" :data-icon="icon"></i>{{ name }}</span>
          </label>
        </div>
      </section>

      <section :aria-labelledby="`${id}-accent`">
        <h3 :id="`${id}-accent`">
          Accent <span class="ap-value">{{ accentName }}</span>
        </h3>
        <div class="ap-swatches" role="radiogroup" :aria-labelledby="`${id}-accent`">
          <label
            v-for="[v, name, hue, chroma] in accents"
            :key="v"
            :style="{ '--hue': hue, '--chroma': chroma }"
            :title="name"
          >
            <input type="radio" :name="`ap-accent-${id}`" :value="v" v-model="accent" />
            <span class="sr-only">{{ name }}</span>
          </label>
        </div>
      </section>

      <section :aria-labelledby="`${id}-density`">
        <h3 :id="`${id}-density`">Density</h3>
        <div class="ap-options" data-short role="radiogroup" :aria-labelledby="`${id}-density`">
          <label v-for="[v, name] in densities" :key="v">
            <input type="radio" :name="`ap-density-${id}`" :value="v" v-model="density" />
            <!-- Three list rows, packed as tightly or loosely as the preset. -->
            <span
              class="ap-preview density-preview"
              :data-value="v || 'default'"
              aria-hidden="true"
            >
              <span v-for="n in 3" :key="n"><span></span><span></span></span>
            </span>
            <span class="ap-name">{{ name }}</span>
          </label>
        </div>
      </section>

      <section :aria-labelledby="`${id}-shape`">
        <h3 :id="`${id}-shape`">Shape</h3>
        <div class="ap-options" data-short role="radiogroup" :aria-labelledby="`${id}-shape`">
          <label v-for="[v, name] in shapes" :key="v">
            <input type="radio" :name="`ap-radius-${id}`" :value="v" v-model="radius" />
            <!-- A card and its button, cornered like the preset. -->
            <span class="ap-preview shape-preview" :data-value="v || 'square'" aria-hidden="true">
              <span><span></span><span></span></span>
            </span>
            <span class="ap-name">{{ name }}</span>
          </label>
        </div>
      </section>
    </div>
  </div>
</template>
