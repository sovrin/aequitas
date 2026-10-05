// The tab icon wears the reader's accent and theme. public/favicon.svg is the template (and the
// fallback without JS or relative colours, following the system scheme): its <style> is replaced by
// tile stops re-derived from the live --ae-accent and glyph ink from --ae-accent-contrast, redrawn
// every frame while a preset change crossfades the accent, so the icon glides with the page, and
// again when the theme flips.
const STYLE = /<style>[\s\S]*?<\/style>/;
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
    if (!template) return;
    // The probe inherits the page's color-scheme, so light-dark() resolves to the theme on show.
    // The same offsets as the static file: lighter and cooler at the top, deeper at the bottom.
    const top = hex("oklch(from var(--ae-accent) calc(l + 0.11) calc(c * 0.8) calc(h - 3))");
    const bottom = hex("oklch(from var(--ae-accent) calc(l - 0.08) c calc(h + 5))");
    const ink = hex("var(--ae-accent-contrast)");
    const key = top + bottom + ink;
    if (key === last) return;
    last = key;
    const style = `<style>.top{stop-color:${top}}.bottom{stop-color:${bottom}}.ink{fill:${ink}}</style>`;
    link.href = `data:image/svg+xml,${encodeURIComponent(template.replace(STYLE, style))}`;
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
  // Changes that do not transition (reduced motion, a first preset, the theme) still land on the
  // next frame; without a data-theme the system scheme decides.
  new MutationObserver(() => requestAnimationFrame(draw)).observe(root, {
    attributes: true,
    attributeFilter: ["data-accent", "data-theme", "style"],
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () =>
    requestAnimationFrame(draw),
  );

  fetch("/favicon.svg")
    .then((r) => r.text())
    .then((svg) => {
      if (!STYLE.test(svg)) return;
      template = svg;
      document.body.append(probe);
      document.head.append(link);
      draw();
    })
    .catch(() => {});
});
