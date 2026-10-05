<script setup lang="ts" generic="T">
// Windowed .grid: only the rows near the viewport are in the DOM. Cells must share one height.
// Columns come from the browser's own auto-fill track count, so `--min` works as on .grid.
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{ items: T[]; itemKey?: (item: T) => PropertyKey; overscan?: number }>(),
  { itemKey: (item: T) => item as PropertyKey, overscan: 2 },
);

const root = ref<HTMLElement>();
const grid = ref<HTMLElement>();
const ready = ref(false);
const cols = ref(1);
const rowHeight = ref(0);
const gap = ref(0);
const start = ref(0);
const end = ref(0);

const rows = computed(() => Math.ceil(props.items.length / cols.value));
const total = computed(() => Math.max(0, rows.value * rowHeight.value - gap.value));
// Before mount (and in the prerendered HTML) show a plain first page; the window takes over on mount.
const slice = computed(() =>
  ready.value
    ? props.items.slice(start.value * cols.value, end.value * cols.value)
    : props.items.slice(0, 48),
);

const update = () => {
  if (!root.value || !rowHeight.value) return;
  const top = -root.value.getBoundingClientRect().top;
  const clamp = (n: number) => Math.min(rows.value, Math.max(0, n));
  start.value = clamp(Math.floor(top / rowHeight.value) - props.overscan);
  end.value = clamp(Math.ceil((top + innerHeight) / rowHeight.value) + props.overscan);
};

const measure = () => {
  if (!grid.value) return;
  const cell = grid.value.firstElementChild as HTMLElement | null;
  if (cell) {
    const cs = getComputedStyle(grid.value);
    cols.value = Math.max(1, cs.gridTemplateColumns.split(" ").length);
    gap.value = parseFloat(cs.rowGap) || 0;
    rowHeight.value = cell.offsetHeight + gap.value;
  }
  ready.value = true;
  update();
};

let frame = 0;
const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(update);
};
let observer: ResizeObserver | undefined;
onMounted(() => {
  measure();
  observer = new ResizeObserver(() => measure());
  observer.observe(root.value!);
  // Capture catches whichever ancestor actually scrolls (window or the shell's main).
  addEventListener("scroll", schedule, { capture: true, passive: true });
  addEventListener("resize", schedule, { passive: true });
});
onBeforeUnmount(() => {
  observer?.disconnect();
  cancelAnimationFrame(frame);
  removeEventListener("scroll", schedule, { capture: true });
  removeEventListener("resize", schedule);
});
watch(
  () => props.items,
  () => nextTick(measure),
);
</script>

<template>
  <div
    ref="root"
    :style="
      ready
        ? {
            boxSizing: 'border-box',
            // Without this the browser re-anchors on every padding change and scrolls in a loop.
            overflowAnchor: 'none',
            blockSize: `${total}px`,
            paddingBlockStart: `${start * rowHeight}px`,
          }
        : undefined
    "
  >
    <div
      ref="grid"
      v-bind="$attrs"
      class="grid"
      style="grid-template-columns: repeat(auto-fill, minmax(min(var(--min), 100%), 1fr))"
    >
      <template v-for="item in slice" :key="itemKey(item)">
        <slot :item="item" />
      </template>
    </div>
  </div>
</template>
