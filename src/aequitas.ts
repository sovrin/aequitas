/*! aequitas — behaviours. Optional; the CSS works without it. */

type Tone = "accent" | "success" | "warning" | "danger" | "info";

type Root = Document | HTMLElement;

const q = <T extends Element>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/** Like q(), with the root itself when it matches: enhancers find their element even when the
 *  observer hands them that element (rows added to a .table enhance the table). */
const own = <T extends Element>(sel: string, root: ParentNode = document): T[] =>
  root instanceof Element && root.matches(sel) ? [root as T, ...q<T>(sel, root)] : q<T>(sel, root);

/** Adjacent <input> in a group, skipping decorative siblings such as <hr>. */
const sibInput = (el: Element, dir: "next" | "previous"): HTMLInputElement | null => {
  let n = dir === "next" ? el.nextElementSibling : el.previousElementSibling;
  while (n && !(n instanceof HTMLInputElement))
    n = dir === "next" ? n.nextElementSibling : n.previousElementSibling;
  return n;
};

/** Tabs: <div class="tabs" role="tablist"> with [role=tab][aria-controls]. */
function tabs(root: Root): void {
  for (const list of own<HTMLElement>('[role="tablist"]', root)) {
    if (list.dataset.ae != null) continue;
    list.dataset.ae = "";
    const items = q<HTMLElement>('[role="tab"]', list);
    const select = (tab: HTMLElement) => {
      for (const t of items) {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = t.getAttribute("aria-controls");
        if (panel) document.getElementById(panel)?.toggleAttribute("hidden", !on);
      }
    };
    // Roving tabindex and panels from the start, not only after the first switch.
    const current = items.find((t) => t.getAttribute("aria-selected") === "true") ?? items[0];
    if (current) select(current);
    list.addEventListener("click", (e) => {
      const tab = (e.target as Element).closest<HTMLElement>('[role="tab"]');
      if (tab && items.includes(tab)) select(tab);
    });
    list.addEventListener("keydown", (e) => {
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (i < 0) return;
      // Arrows follow the reading direction: → is "next" in LTR, "previous" in RTL.
      const ahead = list.matches(":dir(rtl)") ? -1 : 1;
      const step = {
        ArrowRight: ahead,
        ArrowLeft: -ahead,
        Home: -i,
        End: items.length - 1 - i,
      }[e.key];
      if (step === undefined) return;
      e.preventDefault();
      const next = items[(i + step + items.length) % items.length];
      next.focus();
      select(next);
    });
  }
}

/** Click actions: [data-open="#id"] calls showModal() (dialog) or showPopover(); [data-close] closes the
 *  nearest dialog/popover; [data-toast] shows a toast; [data-dismiss] removes the nearest .alert, .toast or
 *  .chip (or the nearest ancestor matching its value). */
function actions(root: Root): void {
  // A busy control ignores the pointer in CSS; this stops Enter and Space too, before any handler
  // of the page's own can run the action a second time.
  root.addEventListener(
    "click",
    (e) => {
      if ((e.target as Element).closest?.('[aria-busy="true"]:is(button, a, .btn)')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    { capture: true },
  );
  root.addEventListener("click", (e) => {
    const t = e.target as Element;
    const opener = t.closest<HTMLElement>("[data-open]");
    if (opener) {
      const el = document.querySelector<HTMLElement>(opener.dataset.open!);
      if (el instanceof HTMLDialogElement) el.showModal();
      else el?.showPopover?.();
    }
    const closer = t.closest<HTMLElement>("[data-close]");
    if (closer) {
      const dlg = closer.closest("dialog");
      if (dlg) dlg.close(closer.dataset.close || undefined);
      else closer.closest<HTMLElement>("[popover]")?.hidePopover();
    }
    const toaster = t.closest<HTMLElement>("[data-toast]");
    if (toaster)
      toast(toaster.dataset.toast || "", {
        title: toaster.dataset.toastTitle,
        tone: toaster.dataset.toastTone as Tone | undefined,
      });
    const dismiss = t.closest<HTMLElement>("[data-dismiss]");
    const gone = dismiss?.closest<HTMLElement>(dismiss.dataset.dismiss || ".alert, .toast, .chip");
    if (gone) {
      const region = gone.matches(".toast") ? gone.parentElement : null;
      if (gone.contains(document.activeElement)) {
        // A toast hands focus on within its stack, else back to where it was before the stack took
        // it, never to whatever happens to come next on the page (which would scroll it there).
        if (!region) refocus(gone);
        else if (!refocus(gone, region)) {
          const back = cameFrom.get(region);
          if (back?.isConnected) back.focus({ preventScroll: true });
          else (document.activeElement as HTMLElement).blur();
        }
      }
      if (region) dismissToast(gone);
      else gone.remove();
    }
  });
  // Where focus was before it moved into a toast stack, to return it there.
  root.addEventListener("focusin", (e) => {
    const region = (e.target as Element).closest?.(".toasts");
    const from = (e as FocusEvent).relatedTarget as HTMLElement | null;
    if (region && !region.contains(from))
      from ? cameFrom.set(region, from) : cameFrom.delete(region);
  });
}

const cameFrom = new WeakMap<Element, HTMLElement>();

const focusables =
  'a[href], area[href], button, input:not([type="hidden"]), select, textarea, summary, iframe, [tabindex], [contenteditable]:not([contenteditable="false"])';

/** Before removing `gone` with focus inside it: focus the next focusable element after it, else the one
 *  before, within `scope`: by default an open dialog or popover if it sits in one. In a .tag-input that
 *  is the next chip's button, or the input. Says whether it found one. */
function refocus(
  gone: Element,
  scope: ParentNode = gone.parentElement?.closest("dialog[open], [popover]") ?? document,
): boolean {
  const all = q<HTMLElement>(focusables, scope).filter(
    (el) =>
      el.tabIndex >= 0 &&
      !gone.contains(el) &&
      !el.closest("[data-leaving]") &&
      !el.matches(":disabled") &&
      el.checkVisibility(),
  );
  const after = (el: Element) =>
    gone.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING;
  const next = all.find(after) ?? all.findLast((el) => !after(el));
  next?.focus();
  return !!next;
}

/** Natural heights of stacked toasts, measured while each is laid out at full size. */
const heights = new WeakMap<Element, number>();
const stacks = new WeakMap<HTMLElement, HTMLElement[]>();

/** Toast stack: the newest toast in front, older ones peeking out behind it (CSS, under
 *  .toasts[data-stacked]). Sets each toast's place from the front (--i), its offset in the list a
 *  hovered or focused stack fans out into (--y), and the heights both layouts need. Runs again
 *  whenever the region's toasts change; `fresh` re-measures a toast whose content just arrived. */
function stack(region: HTMLElement, fresh?: Element): void {
  const items = q<HTMLElement>(":scope > .toast:not([data-leaving])", region).reverse();
  const prev = stacks.get(region);
  if (!fresh && prev?.length === items.length && prev.every((t, i) => t === items[i])) return;
  stacks.set(region, items);
  if (fresh) heights.delete(fresh);
  const gap = parseFloat(getComputedStyle(region).rowGap) || 0;
  // Measure every toast before writing to any, so layout is read once, not once per toast.
  for (const t of items) if (!heights.has(t)) heights.set(t, t.offsetHeight);
  let y = 0;
  items.forEach((t, i) => {
    t.style.setProperty("--i", String(i));
    t.style.setProperty("--y", `${y}px`);
    t.toggleAttribute("data-behind", i > 0);
    y += heights.get(t)! + gap;
  });
  region.style.setProperty("--_n", String(items.length));
  region.style.setProperty("--_front", `${items[0] ? heights.get(items[0]) : 0}px`);
  region.style.setProperty("--_list", `${Math.max(0, y - gap)}px`);
  region.toggleAttribute("data-stacked", true);
}

/** The leave each toast is on, so one taken back mid-way (rescueToast) is not removed after all. */
const leaves = new WeakMap<Element, number>();
let leaving = 0;
/** Each toast()'s listeners, released as soon as it is removed. */
const offs = new WeakMap<Element, AbortController>();

/** Re-measures a toast whose size changes after it arrived (zoom, text spacing, a narrower
 *  viewport), so the stack's offsets never go stale. Created on first use: not at import, where
 *  there may be no DOM. */
let resized: ResizeObserver | undefined;
const watchSize = (el: Element) =>
  (resized ??= new ResizeObserver((entries) => {
    for (const { target } of entries) {
      // The content is watched, not the toast: a toast behind the front one is collapsed to the
      // front's height, and that size must never be taken for its own.
      const t = target.parentElement;
      const region = t?.parentElement;
      if (t?.isConnected && region?.matches(".toasts")) stack(region, t);
    }
  })).observe(el);

/** Sends a toast out: it leaves from where it sits while the rest of the stack closes ranks, and
 *  is removed once its own transitions end. `how` is "swipe" for one flicked away sideways; any
 *  other leave goes back towards the edge it came in from. */
function dismissToast(el: HTMLElement, how = ""): void {
  if (!el.isConnected || el.dataset.leaving != null) return;
  el.dataset.leaving = how;
  const id = ++leaving;
  leaves.set(el, id);
  const region = el.parentElement;
  if (region?.matches(".toasts")) stack(region);
  const remove = () => {
    if (leaves.get(el) !== id) return;
    el.remove();
    if (el.firstElementChild) resized?.unobserve(el.firstElementChild);
    offs.get(el)?.abort();
  };
  // Waits for the transitions themselves: transitionend names physical properties, so waiting
  // for one by name is fragile. None running means at once.
  Promise.allSettled(el.getAnimations().map((a) => a.finished)).then(remove);
  // A safety net, should an animation never settle.
  setTimeout(remove, 1000);
}

/** Takes back a toast on its way out: it rejoins the stack from wherever it was caught. */
function rescueToast(el: HTMLElement): void {
  leaves.delete(el);
  delete el.dataset.leaving;
  if (el.parentElement?.matches(".toasts")) stack(el.parentElement);
}

/** The page's fixed toast region, created once and early (init) so it is already a live region
 *  when the first toast lands in it: one created together with its content is often not read. */
function toastRegion(): HTMLElement {
  const fixed = q<HTMLElement>(".toasts").find((r) => getComputedStyle(r).position === "fixed");
  const region = fixed ?? Object.assign(document.createElement("div"), { className: "toasts" });
  if (!region.hasAttribute("aria-live")) region.setAttribute("aria-live", "polite");
  if (!fixed) document.body.append(region);
  return region;
}

let live: HTMLElement | undefined;
/** The polite, visually hidden region announce() speaks through. Made by init() before anything is
 *  said, and again if a page swapped its body out from under it. */
function liveRegion(): HTMLElement {
  if (!live?.isConnected) {
    live = document.createElement("div");
    live.setAttribute("aria-live", "polite");
    // Inline, not .sr-only: the utilities are not in aequitas.core.css.
    live.style.cssText =
      "position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap";
    document.body.append(live);
  }
  return live;
}

/** Says a change that has no visible announcement of its own (a copy, a stepped value, a tag
 *  added or removed). */
function announce(message: string): void {
  const region = liveRegion();
  region.textContent = "";
  requestAnimationFrame(() => (region.textContent = message));
}

/** Rubber band: the further past a boundary, the less it follows; real things slow before they stop. */
const rubber = (d: number, size: number) => (d * size * 0.55) / (size + 0.55 * Math.abs(d));

/**
 * Toast swipe. A stacked toast follows the pointer sideways 1:1 once it has moved ~10px more across
 * than down. Released, the gesture is projected forward as a scroll would decelerate it; landing past
 * half its width towards the stack's screen edge (either way for a centred stack) it leaves that way at
 * the finger's speed, else it springs back. The other way it rubber-bands. A leaving toast can be
 * caught again.
 */
function swipe(root: Root): void {
  root.addEventListener("pointerdown", (e) => {
    const down = e as PointerEvent;
    const t = down.target as Element;
    const el = t.closest?.<HTMLElement>(".toasts[data-stacked] > .toast");
    if (!el || down.button !== 0 || t.closest("button, a, input, select, textarea")) return;
    const width = el.offsetWidth;
    // Which way is out: towards the nearer side of the screen; a centred stack goes either way.
    const box = el.getBoundingClientRect();
    const mid = (box.left + box.right) / 2 / innerWidth;
    const out = mid > 0.6 ? 1 : mid < 0.4 ? -1 : 0;
    // From where it is on screen, not where it was headed: a toast caught mid-leave stays put.
    const from = parseFloat(getComputedStyle(el).translate) || 0;
    let dx = from;
    const place = (x: number) => {
      dx = x;
      el.style.setProperty("--_dx", `${x}px`);
      el.style.setProperty("--_dxo", String(Math.max(0, 1 - Math.abs(x) / width)));
    };
    if (el.dataset.leaving != null) {
      el.toggleAttribute("data-swiping", true);
      place(from);
      rescueToast(el);
    }
    let dragging = false;
    const trail: { x: number; t: number }[] = [];
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== down.pointerId) return;
      const x = ev.clientX - down.clientX;
      if (!dragging) {
        if (Math.abs(x) < 10 || Math.abs(x) < Math.abs(ev.clientY - down.clientY)) return;
        dragging = true;
        el.setPointerCapture(down.pointerId);
        el.toggleAttribute("data-swiping", true);
        getSelection()?.removeAllRanges();
      }
      trail.push({ x: ev.clientX, t: ev.timeStamp });
      while (trail.length > 2 && ev.timeStamp - trail[0].t > 100) trail.shift();
      const to = from + x;
      // The wrong way, it resists.
      place(out && Math.sign(to) !== out ? rubber(to, width) : to);
    };
    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== down.pointerId) return;
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      el.removeAttribute("data-swiping");
      if (!dragging && !from) return;
      const [a, b] = [trail[0], trail.at(-1)];
      const v = a && b && b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
      // Where a scroll decelerating at 0.998 would come to rest.
      const rest = dx + (v / 1000) * (0.998 / (1 - 0.998));
      const way = Math.sign(rest);
      if (ev.type === "pointerup" && way && (!out || way === out) && Math.abs(rest) > width / 2) {
        // Off the screen on that side, at the finger's speed: the easing opens at a slope of 2,
        // so it covers the distance in 2 × distance ÷ speed, held between a blink and a beat.
        const now = el.getBoundingClientRect();
        const to = dx + (way > 0 ? innerWidth - now.left : -now.right);
        const ms = ((2 * Math.abs(to - dx)) / Math.max(Math.abs(v), 1)) * 1000;
        el.style.setProperty("--_swipe", `${Math.min(400, Math.max(120, ms))}ms`);
        place(to);
        dismissToast(el, "swipe");
      } else place(0);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
  });
}

/** Toasts. aequitas.toast("Saved.", { tone: "success" })
 *  A danger toast is role="alert", any other role="status". It leaves after `duration` ms (default 4000;
 *  Infinity stays until dismissed). Every timer in the stack waits while the stack is hovered or holds
 *  focus, or the page is hidden, and counts again from the start after. */
export function toast(
  message: string,
  opts: { tone?: Tone; title?: string; duration?: number } = {},
): HTMLElement {
  // The page's fixed region: one shown in place (a demo, a preview) is not where toasts pop up.
  let region = q<HTMLElement>(".toasts").find((r) => getComputedStyle(r).position === "fixed");
  region ??= toastRegion();
  const stage = region;
  const el = document.createElement("div");
  el.className = "toast";
  // The region is the polite live region; an error interrupts as an alert of its own.
  if (opts.tone === "danger") el.setAttribute("role", "alert");
  if (opts.tone) el.dataset.tone = opts.tone;
  const body = document.createElement("div");
  if (opts.title) {
    const b = document.createElement("strong");
    b.textContent = opts.title + " ";
    body.append(b);
  }
  body.append(message);
  // In from the start, so the live region announces only the message, not "Dismiss" with it.
  const close = Object.assign(document.createElement("button"), {
    type: "button",
    className: "btn",
    textContent: "×",
  });
  Object.assign(close.dataset, { size: "s", variant: "ghost", icon: "", dismiss: "" });
  close.setAttribute("aria-label", "Dismiss");
  el.append(close);
  region.append(el);
  const off = new AbortController();
  offs.set(el, off);
  const leave = () => {
    hold();
    dismissToast(el);
  };
  // An error stays until it is dismissed: it may be read slowly, or with a magnifier far away.
  const ms = opts.duration ?? (opts.tone === "danger" ? Infinity : 4000);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const hold = () => clearTimeout(timer);
  const busy = () => stage.matches(":hover") || stage.contains(document.activeElement);
  // setTimeout fires at once for Infinity, so a toast that stays never starts one.
  const run = () => {
    hold();
    // Gone: stop listening. Leaving: nothing to count, unless it is caught and kept.
    if (!el.isConnected) return off.abort();
    if (el.dataset.leaving != null) return;
    if (Number.isFinite(ms) && body.isConnected && !document.hidden && !busy())
      timer = setTimeout(leave, ms);
  };
  // The whole stack waits while it is open to be read: under the pointer or holding focus, and
  // while the page is hidden.
  const { signal } = off;
  stage.addEventListener("pointerenter", hold, { signal });
  stage.addEventListener("focusin", hold, { signal });
  stage.addEventListener("pointerleave", run, { signal });
  stage.addEventListener(
    "focusout",
    (e) => stage.contains(e.relatedTarget as Node | null) || run(),
    { signal },
  );
  document.addEventListener("visibilitychange", () => (document.hidden ? hold() : run()), {
    signal,
  });
  // Live regions announce changes, not arrivals: insert it empty, fill it a frame later. The
  // countdown starts with the message, so a toast raised in a hidden tab waits to be seen.
  requestAnimationFrame(() => {
    el.prepend(body);
    stack(stage, el);
    watchSize(body);
    run();
  });
  return el;
}

let restyling = 0;

/** Apply a page-wide colour change in one piece. Nothing transitions on its own, and with view
 *  transitions the page swaps as a single snapshot: revealed in a circle from `origin` (the control,
 *  or a point), or crossfaded without one. */
function restyle(update: () => void, origin?: Element | { x: number; y: number }): void {
  const html = document.documentElement;
  let at = origin as { x: number; y: number } | undefined;
  if (origin instanceof Element) {
    const box = origin.getBoundingClientRect();
    at = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  }
  if (at) {
    const r = Math.hypot(Math.max(at.x, innerWidth - at.x), Math.max(at.y, innerHeight - at.y));
    html.style.setProperty("--ae-reveal-x", `${at.x}px`);
    html.style.setProperty("--ae-reveal-y", `${at.y}px`);
    html.style.setProperty("--ae-reveal-r", `${r}px`);
  }
  // [data-ae-restyle] turns off transitions, so no control trails behind the rest, and drops named
  // view-transition groups (sidebars, articles…), which would run their own navigation animations.
  const id = ++restyling;
  // A newer change may have overtaken this one; it owns the attribute then.
  const settle = () => restyling === id && delete html.dataset.aeRestyle;
  html.dataset.aeRestyle = at ? "reveal" : "fade";
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    // Styles must be computed once with transitions off, so wait a frame before restoring them.
    return void requestAnimationFrame(() => requestAnimationFrame(settle));
  }
  const t = document.startViewTransition(update);
  // `ready` rejects when the transition is skipped (hidden tab, a newer change); the update still runs.
  t.ready.catch(() => {});
  t.finished.finally(settle);
}

/** Theme: [data-theme-set="light|dark|auto"] on buttons or radios. Switches through restyle(), so it
 *  is revealed from `origin` when given. Persists to localStorage and an `ae-theme` cookie (readable
 *  server-side). */
export function setTheme(
  mode: "light" | "dark" | "auto",
  origin?: Element | { x: number; y: number },
): void {
  const html = document.documentElement;
  const apply = () => {
    if (mode === "auto") delete html.dataset.theme;
    else html.dataset.theme = mode;
    try {
      localStorage.setItem("ae-theme", mode);
    } catch {}
    // Mirror into a cookie so a server can render data-theme and the switch state on first paint.
    document.cookie = `ae-theme=${mode}; path=/; max-age=31536000; samesite=lax`;
  };
  // Dark to auto on a dark system (and the like) changes nothing on screen: no transition for it.
  const scheme = (m?: string) =>
    m === "light" || m === "dark"
      ? m
      : matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  if (scheme(html.dataset.theme) === scheme(mode)) return apply();
  restyle(apply, origin);
}

/** Reflect the saved theme on <html> and on any theme radios. */
function themeSync(root: Root): void {
  try {
    const saved = localStorage.getItem("ae-theme");
    const html = document.documentElement;
    if ((saved === "light" || saved === "dark") && html.dataset.theme !== saved)
      html.dataset.theme = saved;
    for (const r of own<HTMLInputElement>("input[data-theme-set]", root)) {
      r.checked = r.dataset.themeSet === (saved ?? "auto");
    }
  } catch {}
}

/** Theme switches: button[data-theme-set] on click, input[data-theme-set] on change. */
function theme(root: Root): void {
  root.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLElement>("button[data-theme-set]");
    if (b) setTheme(b.dataset.themeSet as never, b);
  });
  root.addEventListener("change", (e) => {
    const r = e.target as HTMLInputElement;
    if (r.matches("input[data-theme-set]") && r.checked) {
      setTheme(r.dataset.themeSet as never, r.closest("label") ?? r);
    }
  });
}

/** Range fill: --value for the track, and the [data-output] element's text. */
const fill = (r: HTMLInputElement) => {
  const min = Number(r.min || 0);
  const max = Number(r.max || 100);
  r.style.setProperty("--value", `${((Number(r.value) - min) / (max - min)) * 100}%`);
  const out = r.dataset.output && document.getElementById(r.dataset.output);
  if (out) out.textContent = r.value;
};

/** Range pair: the two ranges never cross, and the pair's --from and --to follow them. The thumb
 *  moved last sits on top (data-top); at a shared value, the one that can still move away does. */
const pair = (box: Element, moved?: HTMLInputElement) => {
  const [a, b] = q<HTMLInputElement>(':scope > input[type="range"]', box);
  if (!a || !b) return;
  if (Number(a.value) > Number(b.value)) {
    if (moved === b) b.value = a.value;
    else a.value = b.value;
  }
  const at = (r: HTMLInputElement) => {
    const min = Number(r.min || 0);
    const max = Number(r.max || 100);
    return ((Number(r.value) - min) / (max - min)) * 100;
  };
  (box as HTMLElement).style.setProperty("--from", `${at(a)}%`);
  (box as HTMLElement).style.setProperty("--to", `${at(b)}%`);
  const top = a.value === b.value ? (at(a) > 50 ? a : b) : (moved ?? b);
  a.toggleAttribute("data-top", top === a);
  b.toggleAttribute("data-top", top === b);
};

/** Form helpers: range fill, number stepper buttons, tag input, OTP auto-advance, pressed toggles. */
function forms(root: Root): void {
  root.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.matches('.range-pair > input[type="range"]')) pair(t.parentElement!, t);
    if (t.matches('input[type="range"]')) fill(t);
    if (t.matches(".otp > input") && t.value) sibInput(t, "next")?.focus();
  });
  root.addEventListener("click", (e) => {
    const t = e.target as Element;
    const step = t.closest<HTMLElement>(".number > button[data-step]");
    if (step) {
      const input = step.parentElement!.querySelector("input")!;
      Number(step.dataset.step) < 0 ? input.stepDown() : input.stepUp();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      // Focus stays on the button, so the new value is said for it.
      announce(input.value);
    }
    const toggle = t.closest<HTMLElement>("[aria-pressed][data-toggle]");
    if (toggle)
      toggle.setAttribute("aria-pressed", String(toggle.getAttribute("aria-pressed") !== "true"));
    const tagBox = t.closest<HTMLElement>(".tag-input");
    if (tagBox && t === tagBox) tagBox.querySelector("input")?.focus();
  });
  root.addEventListener("keydown", (e) => {
    const { key } = e as KeyboardEvent;
    const t = e.target as HTMLInputElement;
    if (t.matches(".tag-input > input")) {
      if (key === "Enter" && t.value.trim()) {
        e.preventDefault();
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.append(t.value.trim(), " ");
        const x = document.createElement("button");
        x.type = "button";
        x.dataset.dismiss = ".chip";
        x.setAttribute("aria-label", `Remove ${t.value.trim()}`);
        x.textContent = "×";
        chip.append(x);
        t.before(chip);
        announce(`Added ${t.value.trim()}`);
        t.value = "";
      } else if (key === "Backspace" && !t.value) {
        const last = t.previousElementSibling;
        if (last?.matches(".chip")) {
          announce(`Removed ${last.firstChild?.textContent?.trim() ?? ""}`);
          last.remove();
        }
      }
    }
    if (t.matches(".otp > input") && key === "Backspace" && !t.value)
      sibInput(t, "previous")?.focus();
  });
  root.addEventListener("paste", (e) => {
    const t = e.target as HTMLInputElement;
    if (!t.matches(".otp > input")) return;
    const text = (e as ClipboardEvent).clipboardData?.getData("text").replace(/\D/g, "") ?? "";
    if (!text) return;
    e.preventDefault();
    const inputs = q<HTMLInputElement>("input", t.parentElement!);
    inputs.forEach((i, n) => (i.value = text[n] ?? ""));
    inputs[Math.min(text.length, inputs.length) - 1]?.focus();
  });
}

/** Password reveal: button[data-password] in an .input-group toggles its input between password and text. */
function password(root: Root): void {
  root.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLElement>("[data-password]");
    const input = b?.parentElement?.querySelector<HTMLInputElement>("input");
    if (!b || !input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    b.setAttribute("aria-pressed", String(show));
  });
}

const rowBoxes = (table: Element) => q<HTMLInputElement>('tbody input[type="checkbox"]', table);
const selectionBar = (table: Element) =>
  (table.closest(".table-scroll") ?? table).parentElement?.querySelector<HTMLElement>(
    ":scope > .selection-bar",
  );
function syncSelection(table: Element): void {
  const boxes = rowBoxes(table);
  const n = boxes.filter((b) => b.checked).length;
  for (const b of boxes) {
    const row = b.closest("tr");
    if (b.checked) row?.setAttribute("aria-selected", "true");
    else row?.removeAttribute("aria-selected");
  }
  const all = table.querySelector<HTMLInputElement>('thead input[type="checkbox"]');
  if (all) {
    all.checked = n > 0 && n === boxes.length;
    all.indeterminate = n > 0 && n < boxes.length;
  }
  const bar = selectionBar(table);
  if (!bar) return;
  const shown = bar.hidden && n > 0;
  bar.hidden = n === 0;
  const count = bar.querySelector("[data-selected]");
  if (!count) return;
  // A live region misses a change made in the tick it is un-hidden: write the count a frame later,
  // as it is then (another change may have come in between).
  if (shown)
    requestAnimationFrame(
      () => (count.textContent = String(rowBoxes(table).filter((b) => b.checked).length)),
    );
  // Only when it changed: enhance() runs on every DOM change, and a live region announces any write.
  else if (count.textContent !== String(n)) count.textContent = String(n);
}
/** Table selection: a header checkbox selects every row; rows get aria-selected; a sibling .selection-bar shows the count. */
function selection(root: Root): void {
  root.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    const table = t.matches('input[type="checkbox"]') ? t.closest(".table") : null;
    if (!table) return;
    if (t.closest("thead")) for (const b of rowBoxes(table)) b.checked = t.checked;
    syncSelection(table);
  });
  root.addEventListener("click", (e) => {
    const clear = (e.target as Element).closest(".selection-bar [data-clear]");
    const table = clear?.closest(".selection-bar")?.parentElement?.querySelector(".table");
    if (!table) return;
    for (const b of rowBoxes(table)) b.checked = false;
    syncSelection(table);
  });
}

const carriesFiles = (e: Event) =>
  Array.from((e as DragEvent).dataTransfer?.types ?? []).includes("Files");

/** Page dropzone: .dropzone[data-page] gets data-active while files are dragged anywhere over the
 *  page. While one exists the page is the target: dragover and drop are cancelled (except on a
 *  file input, which takes its own drop), so the browser never opens the file; read it from
 *  `event.dataTransfer.files` in your own drop listener. */
function pageDrop(root: Root): void {
  // dragenter and dragleave pair up across every element crossed; at zero the drag has left.
  let depth = 0;
  const zones = () => q<HTMLElement>(".dropzone[data-page]");
  const show = (on: boolean) => {
    for (const z of zones()) z.toggleAttribute("data-active", on);
  };
  const own = (e: Event) =>
    carriesFiles(e) && zones().length > 0 && !(e.target as Element).closest?.('input[type="file"]');
  root.addEventListener("dragenter", (e) => {
    if (!carriesFiles(e)) return;
    depth++;
    show(true);
  });
  root.addEventListener("dragleave", (e) => {
    if (!carriesFiles(e)) return;
    depth = Math.max(0, depth - 1);
    if (!depth) show(false);
  });
  root.addEventListener("dragover", (e) => {
    if (!own(e)) return;
    e.preventDefault();
    (e as DragEvent).dataTransfer!.dropEffect = "copy";
  });
  for (const type of ["drop", "dragend"])
    root.addEventListener(type, (e) => {
      depth = 0;
      show(false);
      if (type === "drop" && own(e)) e.preventDefault();
    });
}

/** Dropzone: data-active while files are dragged over it. */
function dropzone(root: Root): void {
  const set = (e: Event, on: boolean) => {
    const zone = (e.target as Element).closest?.(".dropzone");
    if (!zone) return;
    // dragleave fires when moving onto a child; only clear when the pointer leaves the zone.
    const to = (e as DragEvent).relatedTarget as Node | null;
    if (!on && e.type === "dragleave" && to && zone.contains(to)) return;
    zone.toggleAttribute("data-active", on);
  };
  root.addEventListener("dragenter", (e) => set(e, true));
  root.addEventListener("dragover", (e) => set(e, true));
  root.addEventListener("dragleave", (e) => set(e, false));
  root.addEventListener("drop", (e) => set(e, false));
}

let comboboxes = 0;

/** Combobox: opens its list on focus/typing, filters options by text, selects on click/Enter. */
function combobox(root: Root): void {
  for (const box of own<HTMLElement>(".combobox", root)) {
    if (box.dataset.ae != null) continue;
    box.dataset.ae = "";
    const input = box.querySelector<HTMLInputElement>("input");
    const list = box.querySelector<HTMLElement>(".combobox-list");
    if (!input || !list) continue;
    const n = ++comboboxes;
    list.id ||= `ae-combobox-${n}`;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", list.id);
    // A unique anchor per combobox, for browsers with anchor positioning but no anchor-scope.
    const anchor = `--ae-combobox-${n}`;
    input.style.setProperty("anchor-name", anchor);
    list.style.setProperty("position-anchor", anchor);
    const options = () => q<HTMLElement>('[role="option"]:not([hidden])', list);
    const open = () => {
      list.showPopover?.();
      input.setAttribute("aria-expanded", "true");
    };
    const close = () => {
      list.hidePopover?.();
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    };
    // The highlight is aria-selected on the option and aria-activedescendant on the input,
    // so screen readers follow it while focus stays in the text field.
    const highlight = (target?: HTMLElement) => {
      for (const o of q<HTMLElement>('[role="option"]', list))
        o.setAttribute("aria-selected", String(o === target));
      if (!target) return input.removeAttribute("aria-activedescendant");
      target.id ||= `${list.id}-${q('[role="option"]', list).indexOf(target)}`;
      input.setAttribute("aria-activedescendant", target.id);
      target.scrollIntoView({ block: "nearest" });
    };
    const filter = () => {
      const term = input.value.trim().toLowerCase();
      for (const o of q<HTMLElement>('[role="option"]', list))
        o.hidden = !!term && !o.textContent!.toLowerCase().includes(term);
      highlight(options()[0]);
    };
    const pick = (o: HTMLElement) => {
      input.value = (o.dataset.value ?? o.textContent ?? "").trim();
      close();
      input.dispatchEvent(new Event("change", { bubbles: true }));
    };
    input.addEventListener("focus", open);
    input.addEventListener("input", () => {
      filter();
      open();
    });
    input.addEventListener("blur", () => setTimeout(close, 120));
    input.addEventListener("keydown", (e) => {
      const opts = options();
      const i = opts.findIndex((o) => o.getAttribute("aria-selected") === "true");
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && opts.length) {
        e.preventDefault();
        open();
        const down = e.key === "ArrowDown";
        const n =
          i < 0 ? (down ? 0 : opts.length - 1) : (i + (down ? 1 : -1) + opts.length) % opts.length;
        highlight(opts[n]);
      } else if (e.key === "Enter" && i >= 0 && !e.isComposing) {
        e.preventDefault();
        pick(opts[i]);
      } else if (e.key === "Escape" && input.getAttribute("aria-expanded") === "true") {
        // One Escape closes the suggestions only; a dialog around the field waits for the next.
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    });
    list.addEventListener("mousedown", (e) => {
      const o = (e.target as Element).closest<HTMLElement>('[role="option"]');
      if (o) {
        e.preventDefault();
        pick(o);
      }
    });
  }
}

/** The ranges each root has drawn into the shared ae-match highlight, replaced on every new term. */
const marked = new WeakMap<Element, Range[]>();

/**
 * Draws `term` wherever it appears in the options under `root` (keyboard hints aside), styled by
 * ::highlight(ae-match). Uses the Custom Highlight API, so no markup changes; an empty term
 * clears it. The palette calls it on every keystroke; call it yourself from a [data-manual] one.
 */
export function markMatches(root: Element, term: string): void {
  if (typeof Highlight !== "function" || !("highlights" in CSS)) return;
  let hl = CSS.highlights.get("ae-match");
  if (!hl) CSS.highlights.set("ae-match", (hl = new Highlight()));
  for (const r of marked.get(root) ?? []) hl.delete(r);
  const ranges: Range[] = [];
  const needle = term.trim().toLowerCase();
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = needle && walk.nextNode(); n; n = walk.nextNode()) {
    const el = n.parentElement;
    if (!el?.closest('[role="option"]') || el.closest("kbd, [hidden]")) continue;
    const text = n.textContent!.toLowerCase();
    for (let i = text.indexOf(needle); i >= 0; i = text.indexOf(needle, i + needle.length)) {
      const r = new Range();
      r.setStart(n, i);
      r.setEnd(n, i + needle.length);
      hl.add(r);
      ranges.push(r);
    }
  }
  marked.set(root, ranges);
}

let palettes = 0;

/**
 * Command palette: filters options as you type, moves the highlight with ↑/↓ and clicks it on
 * Enter. dialog.palette[data-manual] is left alone, for palettes that render their own results.
 */
function palette(root: Root): void {
  for (const dlg of own<HTMLDialogElement>("dialog.palette:not([data-manual])", root)) {
    const input = dlg.querySelector<HTMLInputElement>(":scope > input");
    const list = dlg.querySelector<HTMLElement>('[role="listbox"]');
    if (!input || !list || list.dataset.ae != null) continue;
    list.dataset.ae = "";
    list.id ||= `ae-palette-${++palettes}`;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", list.id);
    if (!list.hasAttribute("aria-label") && !list.hasAttribute("aria-labelledby"))
      list.setAttribute("aria-label", "Results");
    const empty = dlg.querySelector<HTMLElement>(".empty");
    const all = () => q<HTMLElement>('[role="option"]', list);
    const shown = () => all().filter((o) => !o.hidden);
    // Same contract as the combobox: aria-selected on the option, aria-activedescendant on the input.
    const highlight = (target?: HTMLElement, scroll = true) => {
      for (const o of all()) o.setAttribute("aria-selected", String(o === target));
      if (!target) return input.removeAttribute("aria-activedescendant");
      target.id ||= `${list.id}-${all().indexOf(target)}`;
      input.setAttribute("aria-activedescendant", target.id);
      if (scroll) target.scrollIntoView({ block: "nearest" });
    };
    const filter = () => {
      const term = input.value.trim().toLowerCase();
      for (const o of all())
        o.hidden =
          !!term && !`${o.textContent} ${o.dataset.keywords ?? ""}`.toLowerCase().includes(term);
      // A group label goes with its options: hidden once none of them match.
      let label: HTMLElement | null = null;
      let any = false;
      for (const el of [...list.children, null] as (HTMLElement | null)[]) {
        if (!el || el.localName === "h6") {
          if (label) label.hidden = !any;
          label = el;
          any = false;
        } else if (el.getAttribute("role") === "option" && !el.hidden) any = true;
      }
      for (const g of q<HTMLElement>('[role="group"]', list))
        g.hidden = !g.querySelector('[role="option"]:not([hidden])');
      const matches = shown();
      if (empty) {
        empty.hidden = matches.length > 0;
        for (const t of q("[data-term]", empty)) t.textContent = input.value.trim();
      }
      highlight(matches[0]);
      markMatches(list, term);
    };
    filter();
    input.addEventListener("input", filter);
    input.addEventListener("keydown", (e) => {
      const opts = shown();
      const i = opts.findIndex((o) => o.getAttribute("aria-selected") === "true");
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && opts.length) {
        e.preventDefault();
        const down = e.key === "ArrowDown";
        const n =
          i < 0 ? (down ? 0 : opts.length - 1) : (i + (down ? 1 : -1) + opts.length) % opts.length;
        highlight(opts[n]);
      } else if (e.key === "Enter" && i >= 0 && !e.isComposing) {
        e.preventDefault();
        opts[i].click();
      }
    });
    // The pointer moves the one highlight rather than drawing a second one; no scroll, so the
    // list never shifts under the cursor. pointerdown too: a tap sends no pointermove first.
    const follow = (e: Event) => {
      const o = (e.target as Element).closest<HTMLElement>('[role="option"]');
      if (o && o.getAttribute("aria-selected") !== "true") highlight(o, false);
    };
    list.addEventListener("pointermove", follow);
    list.addEventListener("pointerdown", follow);
    // Every opening starts clean. Reset on open, not on close, so the exit fade shows what was there.
    dlg.addEventListener("toggle", (e) => {
      if ((e as ToggleEvent).newState !== "open") return;
      input.value = "";
      filter();
    });
  }
}

/** Light dismiss: dialog[data-light-dismiss] closes on a click outside its box. */
function lightDismiss(root: Root): void {
  for (const dlg of own<HTMLDialogElement>("dialog[data-light-dismiss]", root)) {
    if (dlg.dataset.ae != null) continue;
    dlg.dataset.ae = "";
    // The backdrop and the dialog's own padding both target the dialog; only outside its box closes.
    dlg.addEventListener("click", (e) => {
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const { clientX: x, clientY: y } = e as MouseEvent;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) dlg.close();
    });
  }
}

/** Table of contents: marks the link whose section is in view. Rebuilt whenever its links change,
 *  so a TOC a framework re-renders in place (new page, same <nav>) follows the new sections. */
const tocs = new Map<HTMLElement, { key: string; io?: IntersectionObserver }>();
function toc(root: Root): void {
  // A removed TOC stops watching its sections.
  for (const [nav, t] of tocs)
    if (!nav.isConnected) {
      t.io?.disconnect();
      tocs.delete(nav);
    }
  for (const nav of own<HTMLElement>(".toc", root)) {
    const links = q<HTMLAnchorElement>('a[href^="#"]', nav).filter((a) => a.hash.length > 1);
    const key = links.map((a) => a.hash).join(" ");
    const prev = tocs.get(nav);
    if (prev?.key === key) continue;
    prev?.io?.disconnect();
    tocs.delete(nav);
    const targets = links
      .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
      .filter(Boolean) as Element[];
    // Sections not rendered yet: try again on the next enhance().
    if (!targets.length || !("IntersectionObserver" in window)) continue;
    nav.dataset.ae = "";
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        for (const a of links)
          if (a.hash === `#${hit.target.id}`) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    tocs.set(nav, { key, io });
  }
}

/** Copy buttons: [data-copy="#selector"] copies that element's text; [data-copy] alone copies the nearest .code's <pre>. */
function copy(root: Root): void {
  root.addEventListener("click", async (e) => {
    const b = (e.target as Element).closest<HTMLElement>("[data-copy]");
    if (!b) return;
    const src = b.dataset.copy
      ? document.querySelector(b.dataset.copy)
      : b.closest(".code")?.querySelector("pre");
    if (!src || b.dataset.copied != null) return;
    try {
      await navigator.clipboard.writeText(src.textContent ?? "");
    } catch {
      return;
    }
    // Swap the label, not the markup: an icon inside the button comes back with it.
    const label = b.innerHTML;
    b.dataset.copied = "";
    b.textContent = "Copied";
    announce("Copied");
    setTimeout(() => {
      b.innerHTML = label;
      delete b.dataset.copied;
    }, 1200);
  });
}

/** Popover invokers: aria-expanded follows the popover, so a menubar item or menu button shows it is open. */
function invokers(root: Root): void {
  // toggle doesn't bubble; listen in the capture phase.
  root.addEventListener(
    "toggle",
    (e) => {
      const p = e.target as HTMLElement;
      if (!p.id || !p.hasAttribute("popover")) return;
      const id = CSS.escape(p.id);
      const open = (e as ToggleEvent).newState === "open";
      for (const b of q(`[popovertarget="${id}"], [data-open="#${id}"]`))
        b.setAttribute("aria-expanded", String(open));
    },
    true,
  );
}

/** Tooltips: Esc hides the [data-tip] under the pointer or focus (data-tip-dismissed) until both leave it. */
function tips(root: Root): void {
  root.addEventListener("keydown", (e) => {
    if ((e as KeyboardEvent).key !== "Escape") return;
    const focused = document.activeElement?.closest("[data-tip]");
    for (const el of [...q("[data-tip]:hover"), ...(focused ? [focused] : [])])
      el.setAttribute("data-tip-dismissed", "");
  });
  const clear = (e: Event) => {
    const el = e.target as Element;
    if (!el.matches?.("[data-tip-dismissed]")) return;
    // Still hovered or focused: it stays dismissed until the other one goes too.
    if (el.matches(e.type === "focusout" ? ":hover" : ":focus-visible")) return;
    el.removeAttribute("data-tip-dismissed");
  };
  root.addEventListener("focusout", clear);
  // mouseleave doesn't bubble; listen in the capture phase.
  root.addEventListener("mouseleave", clear, true);
  // Left while its tip was showing: the next tip within a beat opens at once (data-tip-instant).
  let shown = -Infinity;
  root.addEventListener(
    "pointerenter",
    (e) => {
      const el = e.target as Element;
      if (el.matches?.("[data-tip]") && e.timeStamp - shown < 300)
        el.setAttribute("data-tip-instant", "");
    },
    true,
  );
  root.addEventListener(
    "pointerleave",
    (e) => {
      const el = e.target as Element;
      if (!el.matches?.("[data-tip]")) return;
      // Mid-fade the computed opacity is the live one: above 0, the tip was on screen.
      if (Number(getComputedStyle(el, "::after").opacity) > 0) shown = e.timeStamp;
      el.removeAttribute("data-tip-instant");
    },
    true,
  );
}

/** The tip as a description, read after the name. Never replaces an aria-description of your own. */
const described = new WeakSet<Element>();
function describeTips(root: Root): void {
  for (const el of own<HTMLElement>("[data-tip]", root)) {
    if (el.hasAttribute("aria-description") && !described.has(el)) continue;
    el.setAttribute("aria-description", el.dataset.tip!);
    described.add(el);
  }
}

const bound = new WeakSet<Root>();

/** Delegated listeners. Once per root; safe to call again. */
export function bind(root: Root = document): void {
  if (bound.has(root)) return;
  bound.add(root);
  actions(root);
  theme(root);
  forms(root);
  password(root);
  selection(root);
  dropzone(root);
  pageDrop(root);
  invokers(root);
  copy(root);
  tips(root);
  swipe(root);
}

/** Per-element enhancements. init() reruns them on its own whenever the DOM changes; call it
 *  directly only to enhance a root init() does not watch. */
export function enhance(root: Root = document): void {
  tabs(root);
  combobox(root);
  palette(root);
  toc(root);
  describeTips(root);
  themeSync(root);
  for (const p of own(".range-pair", root)) pair(p);
  for (const r of own<HTMLInputElement>('input[type="range"]', root)) fill(r);
  for (const t of own(".table", root))
    if (t.querySelector('tbody input[type="checkbox"]')) syncSelection(t);
  lightDismiss(root);
  // Toasts written into the markup, or rendered by a framework, stack like toast()'s own.
  for (const r of own<HTMLElement>(".toasts", root)) stack(r);
}

const watched = new WeakSet<Root>();
/** The components enhance() keeps in sync with their content. */
const ENHANCED =
  '.table, .toc, .toasts, .range-pair, .combobox, [role="tablist"], dialog.palette, dialog[data-light-dismiss]';

/** Delegated listeners, enhancements, and a watch on the DOM: markup added or changed later (an SPA
 *  render, a fetched fragment) is enhanced as it lands, with nothing to call. Once per root. */
export function init(root: Root = document): void {
  bind(root);
  enhance(root);
  if (watched.has(root)) return;
  watched.add(root);
  // The live regions exist before anything is said into them.
  if (root === document) {
    toastRegion();
    liveRegion();
  }
  // Only where something changed: each record's parent, since the enhancers look below the root
  // they are given (a toast leaving its region restacks the region). Every enhancer skips what it
  // has already done.
  const mo = new MutationObserver((records) => {
    const changed = new Set<HTMLElement>();
    for (const { target } of records) {
      const parent = target.parentElement ?? (target instanceof HTMLElement ? target : null);
      // A change deep inside an enhanced component (a row in a table, a link in a nested list
      // of a .toc) re-enhances the component, not just the spot that changed.
      const el = parent?.closest<HTMLElement>(ENHANCED) ?? parent;
      if (!el) {
        changed.clear();
        enhance(root);
        break;
      }
      changed.add(el);
    }
    const all = [...changed];
    for (const el of all) if (!all.some((o) => o !== el && o.contains(el))) enhance(el);
    // Drop the changes enhance() just made itself, or they would call it again.
    mo.takeRecords();
  });
  mo.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-tip"],
  });
}

export const aequitas = { init, bind, enhance, toast, setTheme, markMatches };

if (typeof document !== "undefined" && !document.documentElement.hasAttribute("data-ae-manual")) {
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", () => init())
    : init();
}
