import { bind, enhance } from "@aequitas/aequitas.js";

const FALLBACK = { name: "page", mode: "out-in" } as const;

export default defineNuxtPlugin((nuxtApp) => {
  // Delegated listeners once; per-element enhancements after every page render.
  // The tick lets components that render on page:finish (e.g. the TOC) land first.
  bind();
  const run = () => nextTick(() => enhance());
  nuxtApp.hook("app:mounted", run);
  nuxtApp.hook("page:finish", run);

  // Route changes animate with the View Transitions API when it is usable; otherwise the
  // Vue page transition takes over. A failed transition never blocks navigation.
  // Within the docs layout the transition is scoped to the article, so the sidebar and TOC are never
  // captured: they keep rendering live instead of showing a stale snapshot until the swap is done.
  // Without element-scoped transitions the Vue transition does that job, since it only wraps the page.
  const router = useRouter();
  router.beforeResolve(async (to, from) => {
    // A hidden document pauses requestAnimationFrame, which both APIs rely on: no transition then.
    const visible = document.visibilityState === "visible";
    // The initial navigation has nothing to transition from: render the first page straight away.
    const initial = from.matched.length === 0;
    const sameLayout = (to.meta.layout ?? "default") === (from.meta.layout ?? "default");
    const article = sameLayout ? document.querySelector<HTMLElement>(".docs-main > article") : null;
    const scope = article ? ("startViewTransition" in article ? article : null) : document;
    const usable =
      visible &&
      !initial &&
      to.path !== from.path &&
      typeof scope?.startViewTransition === "function" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    to.meta.pageTransition = usable || !visible || initial ? false : FALLBACK;
    if (!usable) return;

    let finish!: () => void;
    const rendered = new Promise<void>((r) => (finish = r));
    try {
      const transition = scope!.startViewTransition(() => rendered);
      nuxtApp.hookOnce("page:finish", () => finish());
      transition.finished.catch(() => {});
      await transition.ready;
    } catch {
      finish();
    }
  });
});
