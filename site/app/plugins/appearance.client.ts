import { setTheme } from "@aequitas/aequitas.js";

// Applies and persists the shared appearance, once for the whole app. The prerendered HTML carries the
// defaults and the head script (nuxt.config.ts) has already applied the saved values to <html>, so the
// sync after hydration only updates the controls and must not re-apply or animate anything.
export default defineNuxtPlugin((nuxtApp) => {
  const { theme, accent, density, radius } = useAppearance();
  let synced = false;

  const apply = (attr: string, v: string) => {
    if (v) document.documentElement.dataset[attr] = v;
    else delete document.documentElement.dataset[attr];
    try {
      localStorage.setItem(`docs-${attr}`, v);
    } catch {}
  };

  nuxtApp.hook("app:mounted", () => {
    try {
      const t = localStorage.getItem("ae-theme");
      theme.value = t === "light" || t === "dark" ? t : "auto";
      accent.value = localStorage.getItem("docs-accent") ?? "";
      density.value = localStorage.getItem("docs-density") ?? "";
      radius.value = localStorage.getItem("docs-radius") ?? "";
    } catch {}
    // Watchers run before the next render; flip the flag after them so the sync itself is inert.
    nextTick(() => (synced = true));
  });

  // The theme reveal grows from the control that changed it: the last thing pressed, or the focused
  // control when the change came from the keyboard.
  let pressed: { el: Element; at: number } | undefined;
  addEventListener("pointerdown", (e) => (pressed = { el: e.target as Element, at: e.timeStamp }), {
    capture: true,
    passive: true,
  });
  const origin = () => {
    const el =
      pressed && performance.now() - pressed.at < 1000 ? pressed.el : document.activeElement;
    return el && el !== document.body ? (el.closest("label, button") ?? el) : undefined;
  };

  // Theme buttons elsewhere (the Behaviours page, showcases) switch through the library directly;
  // mirror them into the shared state so the panel agrees, without switching a second time.
  addEventListener(
    "click",
    (e) => {
      const b = (e.target as Element).closest<HTMLElement>("button[data-theme-set]");
      const v = b?.dataset.themeSet;
      if (!synced || (v !== "light" && v !== "dark" && v !== "auto")) return;
      synced = false;
      theme.value = v;
      nextTick(() => (synced = true));
    },
    { capture: true },
  );

  watch(theme, (v) => synced && setTheme(v, origin()));
  // Presets apply directly: accent is only colour, and density and shape glide by themselves, as the
  // framework interpolates its unit and radius tokens.
  watch(accent, (v) => synced && apply("accent", v));
  watch(density, (v) => synced && apply("density", v));
  watch(radius, (v) => synced && apply("radius", v));
});
