<script setup lang="ts">
import { toast } from "@aequitas/aequitas.js";
const demoToast = () => toast("Northlight is live.", { title: "Published.", tone: "success" });
const api = `import { init, bind, enhance, toast, setTheme, markMatches } from "./aequitas.js";

toast("Northlight is live.", { title: "Published.", tone: "success", duration: 4000 });
setTheme("dark", button); // "light" | "dark" | "auto", revealed from the button
init(); // bind() + enhance(); call enhance() again after rendering new content
markMatches(list, "term"); // highlight a term in the options of a dialog.palette[data-manual]`;
</script>

<template>
  <div>
    <DocsPageHeader
      group="Behaviours"
      title="Behaviours"
      lede="Five kilobytes, gzipped, of TypeScript for what HTML cannot do alone."
    />
    <section class="section stack gap-6" id="behaviours">
      <div class="stack measure">
        <h2>Behaviours.</h2>
        <p class="text-muted">
          <code>aequitas.js</code> is optional and self-initialising. Everything is driven by
          attributes; set <code>data-ae-manual</code> on <code>&lt;html&gt;</code> to call
          <code>init()</code> yourself — or <code>bind()</code> once and
          <code>enhance()</code> after each render in an SPA, as this site does.
        </p>
      </div>
      <table class="table" data-size="s">
        <thead>
          <tr>
            <th>Hook</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>[role=tablist]</code></td>
            <td>Click and arrow-key tab switching; toggles <code>aria-controls</code> panels</td>
          </tr>
          <tr>
            <td><code>[data-open="#id"]</code>, <code>[data-close]</code></td>
            <td>Opens dialogs or popovers, closes the nearest one</td>
          </tr>
          <tr>
            <td><code>dialog[data-light-dismiss]</code></td>
            <td>Closes when the backdrop is clicked</td>
          </tr>
          <tr>
            <td><code>[data-dismiss]</code></td>
            <td>
              Removes the nearest <code>.alert</code>, <code>.toast</code> or <code>.chip</code>, or
              the nearest ancestor matching its value
            </td>
          </tr>
          <tr>
            <td><code>[data-toast]</code></td>
            <td>
              Shows a toast with that message; <code>data-toast-title</code> and
              <code>data-toast-tone</code> set its title and tone
            </td>
          </tr>
          <tr>
            <td><code>[data-theme-set]</code></td>
            <td>Light / dark / auto with a view transition, persisted</td>
          </tr>
          <tr>
            <td><code>input[type=range][data-output]</code></td>
            <td>Keeps the track fill and an output element in sync</td>
          </tr>
          <tr>
            <td><code>.number &gt; button[data-step]</code>, <code>[data-toggle]</code></td>
            <td>Stepper buttons; pressed-state toggles</td>
          </tr>
          <tr>
            <td><code>.tag-input</code>, <code>.otp</code></td>
            <td>Enter / Backspace chip editing; auto-advance, backspace and paste</td>
          </tr>
          <tr>
            <td><code>.combobox</code></td>
            <td>
              Opens on focus, filters as you type, arrow and Enter selection,
              <code>aria-activedescendant</code> on the highlight
            </td>
          </tr>
          <tr>
            <td><code>dialog.palette</code></td>
            <td>
              Filters options and group labels as you type, marks matches, ↑/↓ and Enter;
              <code>[data-manual]</code> leaves it to you
            </td>
          </tr>
          <tr>
            <td><code>.toc</code></td>
            <td>Marks the section currently in view</td>
          </tr>
          <tr>
            <td><code>[data-copy]</code></td>
            <td>Copies a <code>.code</code> block, or the given selector</td>
          </tr>
          <tr>
            <td><code>.dropzone</code></td>
            <td><code>data-active</code> while files are dragged over it</td>
          </tr>
          <tr>
            <td><code>[popovertarget]</code>, <code>[data-open]</code> on a popover</td>
            <td><code>aria-expanded</code> follows the popover</td>
          </tr>
          <tr>
            <td><code>.input-group &gt; [data-password]</code></td>
            <td>Toggles the input between hidden and shown; sets <code>aria-pressed</code></td>
          </tr>
          <tr>
            <td><code>.table</code> with row checkboxes, <code>.selection-bar</code></td>
            <td>
              Header box selects all (indeterminate when partial), rows get
              <code>aria-selected</code>; the bar shows the count in
              <code>[data-selected]</code> and <code>[data-clear]</code> clears it
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="section stack gap-6" id="api">
      <div class="stack measure">
        <h2>API.</h2>
        <p class="text-muted">
          Six functions, also bundled as one <code>aequitas</code> object. Import the module
          directly when you need them.
        </p>
      </div>
      <DocsCode label="app.js" lang="js" :code="api" />
      <div class="cluster">
        <button class="btn" data-variant="primary" @click="demoToast">Try a toast</button>
        <button class="btn" data-open="#dlg">Open a dialog</button>
        <button class="btn" data-theme-set="dark">Dark</button>
        <button class="btn" data-theme-set="light">Light</button>
        <button class="btn" data-variant="ghost" data-theme-set="auto">Auto</button>
      </div>
    </section>
    <dialog id="dlg" data-light-dismiss data-size="s">
      <form method="dialog" class="stack">
        <h3>Opened with data-open</h3>
        <p class="text-muted">
          And closed with <code>data-close</code>, or by clicking the backdrop.
        </p>
        <div class="cluster">
          <button class="btn" data-variant="primary" data-close>Done</button>
        </div>
      </form>
    </dialog>
  </div>
</template>
