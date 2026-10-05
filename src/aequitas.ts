/*! aequitas — behaviours. Optional; the CSS works without it. */

type Tone = "accent" | "success" | "warning" | "danger" | "info";

type Root = Document | HTMLElement;

const q = <T extends Element>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/** Adjacent <input> in a group, skipping decorative siblings such as <hr>. */
const sibInput = (el: Element, dir: "next" | "previous"): HTMLInputElement | null => {
  let n = dir === "next" ? el.nextElementSibling : el.previousElementSibling;
  while (n && !(n instanceof HTMLInputElement))
    n = dir === "next" ? n.nextElementSibling : n.previousElementSibling;
  return n;
};

/** Tabs: <div class="tabs" role="tablist"> with [role=tab][aria-controls]. */
function tabs(root: Root): void {
  for (const list of q<HTMLElement>('[role="tablist"]', root)) {
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
      if (gone.contains(document.activeElement)) refocus(gone);
      gone.remove();
    }
  });
}

const focusables =
  'a[href], area[href], button, input:not([type="hidden"]), select, textarea, summary, iframe, [tabindex], [contenteditable]:not([contenteditable="false"])';

/** Before removing `gone` with focus inside it: focus the next focusable element after it, else the one
 *  before, within an open dialog or popover if it sits in one. In a .tag-input that is the next chip's
 *  button, or the input. */
function refocus(gone: Element): void {
  const scope = gone.parentElement?.closest("dialog[open], [popover]") ?? document;
  const all = q<HTMLElement>(focusables, scope).filter(
    (el) =>
      el.tabIndex >= 0 && !gone.contains(el) && !el.matches(":disabled") && el.checkVisibility(),
  );
  const after = (el: Element) =>
    gone.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING;
  (all.find(after) ?? all.findLast((el) => !after(el)))?.focus();
}

/** Toasts. aequitas.toast("Saved.", { tone: "success" })
 *  A danger toast is role="alert", any other role="status". It leaves after `duration` ms (default 4000;
 *  Infinity stays until dismissed), counted again from the start once the pointer or focus leaves it. */
export function toast(
  message: string,
  opts: { tone?: Tone; title?: string; duration?: number } = {},
): HTMLElement {
  let region = document.querySelector<HTMLElement>(".toasts");
  if (!region) {
    region = Object.assign(document.createElement("div"), { className: "toasts" });
    document.body.append(region);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", opts.tone === "danger" ? "alert" : "status");
  if (opts.tone) el.dataset.tone = opts.tone;
  const body = document.createElement("div");
  if (opts.title) {
    const b = document.createElement("strong");
    b.textContent = opts.title + " ";
    body.append(b);
  }
  body.append(message);
  region.append(el);
  const leave = () => {
    if (!el.isConnected || el.dataset.leaving != null) return;
    el.dataset.leaving = "";
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    // No transition (transition: none, a hidden tab) means no transitionend.
    setTimeout(() => el.remove(), 1000);
  };
  const ms = opts.duration ?? 4000;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const hold = () => clearTimeout(timer);
  // setTimeout fires at once for Infinity, so a toast that stays never starts one.
  const run = () => {
    hold();
    if (Number.isFinite(ms)) timer = setTimeout(leave, ms);
  };
  // Paused while read: under the pointer or holding focus.
  el.addEventListener("pointerenter", hold);
  el.addEventListener("focusin", hold);
  el.addEventListener("pointerleave", () => el.contains(document.activeElement) || run());
  el.addEventListener("focusout", (e) => {
    if (!el.contains(e.relatedTarget as Node | null) && !el.matches(":hover")) run();
  });
  // Live regions announce changes, not arrivals: insert it empty, fill it a frame later. The
  // countdown starts with the message, so a toast raised in a hidden tab waits to be seen.
  requestAnimationFrame(() => {
    el.append(body);
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
    if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
    for (const r of q<HTMLInputElement>("input[data-theme-set]", root)) {
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

/** Form helpers: range fill, number stepper buttons, tag input, OTP auto-advance, pressed toggles. */
function forms(root: Root): void {
  root.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
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
        t.value = "";
      } else if (key === "Backspace" && !t.value) {
        if (t.previousElementSibling?.matches(".chip")) t.previousElementSibling.remove();
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
  else count.textContent = String(n);
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
  for (const box of q<HTMLElement>(".combobox", root)) {
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
      } else if (e.key === "Escape") close();
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
  for (const dlg of q<HTMLDialogElement>("dialog.palette:not([data-manual])", root)) {
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
  for (const dlg of q<HTMLDialogElement>("dialog[data-light-dismiss]", root)) {
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
const tocs = new WeakMap<HTMLElement, { key: string; io?: IntersectionObserver }>();
function toc(root: Root): void {
  for (const nav of q<HTMLElement>(".toc", root)) {
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
}

/** The tip as a description, read after the name. Never replaces an aria-description of your own. */
const described = new WeakSet<Element>();
function describeTips(root: Root): void {
  for (const el of q<HTMLElement>("[data-tip]", root)) {
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
  invokers(root);
  copy(root);
  tips(root);
}

/** Per-element enhancements. Call after rendering new content (e.g. on SPA navigation). */
export function enhance(root: Root = document): void {
  tabs(root);
  combobox(root);
  palette(root);
  toc(root);
  describeTips(root);
  themeSync(root);
  for (const r of q<HTMLInputElement>('input[type="range"]', root)) fill(r);
  for (const t of q(".table", root))
    if (t.querySelector('tbody input[type="checkbox"]')) syncSelection(t);
  lightDismiss(root);
}

export function init(root: Root = document): void {
  bind(root);
  enhance(root);
}

export const aequitas = { init, bind, enhance, toast, setTheme, markMatches };

if (typeof document !== "undefined" && !document.documentElement.hasAttribute("data-ae-manual")) {
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", () => init())
    : init();
}
