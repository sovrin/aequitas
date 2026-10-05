// The tab icon wears the reader's accent. public/favicon.svg is the template (and the fallback without
// JS or relative colours): its two tile stops are re-derived from the live --ae-accent-light, and
// redrawn every frame while a preset change crossfades it, so the icon glides with the page.
const TOP = "#3c95f0";
const BOTTOM = "#004fc8";
const ACCENT = "--ae-accent-light";

export default defineNuxtPlugin(() => {
  if (!CSS.supports("color", "oklch(from red l c h)")) return;
  const root = document.documentElement;

  // Resolves any CSS colour to sRGB hex: the probe resolves var() and relative colours, the canvas
  // gamut-maps whatever space the browser hands back.
  const probe = document.createElement("i");
  probe.hidden = true;
  const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext(
    "2d",
    { willReadFrequently: true },
  )!;
  const hex = (css: string) => {
    probe.style.color = css;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = getComputedStyle(probe).color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  };

  // The last icon link wins, and one of our own is never rewritten by the head manager.
  const link = Object.assign(document.createElement("link"), {
    rel: "icon",
    type: "image/svg+xml",
  });
  let template = "";
  let last = "";
  const draw = () => {
    const base = getComputedStyle(root).getPropertyValue(ACCENT).trim();
    if (!template || !base || base === last) return;
    last = base;
    // The same offsets as the static file: lighter and cooler at the top, deeper at the bottom.
    const svg = template
      .replace(TOP, hex(`oklch(from ${base} calc(l + 0.11) calc(c * 0.8) calc(h - 3))`))
      .replace(BOTTOM, hex(`oklch(from ${base} calc(l - 0.08) c calc(h + 5))`));
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  let frame = 0;
  const follow = () => {
    draw();
    frame = requestAnimationFrame(follow);
  };
  const ours = (e: TransitionEvent) => e.target === root && e.propertyName === ACCENT;
  root.addEventListener("transitionstart", (e) => {
    if (ours(e) && !frame) frame = requestAnimationFrame(follow);
  });
  const settle = (e: TransitionEvent) => {
    if (!ours(e)) return;
    cancelAnimationFrame(frame);
    frame = 0;
    draw();
  };
  root.addEventListener("transitionend", settle);
  root.addEventListener("transitioncancel", settle);
  // Changes that do not transition (reduced motion, a first preset) still land on the next frame.
  new MutationObserver(() => requestAnimationFrame(draw)).observe(root, {
    attributes: true,
    attributeFilter: ["data-accent", "style"],
  });

  fetch("/favicon.svg")
    .then((r) => r.text())
    .then((svg) => {
      if (!svg.includes(TOP) || !svg.includes(BOTTOM)) return;
      template = svg;
      document.body.append(probe);
      document.head.append(link);
      draw();
    })
    .catch(() => {});
});
