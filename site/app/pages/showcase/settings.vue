<script setup lang="ts">
definePageMeta({ layout: "showcase" });
useHead({ title: "Settings · showcase · aequitas" });
</script>

<template>
  <div class="shell" data-collapsible>
    <nav class="sidebar">
      <h6>Settings</h6>
      <a href="#" aria-current="page"
        ><i class="icon" data-icon="sliders"></i><span>General</span></a
      >
      <a href="#"><i class="icon" data-icon="user"></i><span>Account</span></a>
      <a href="#"><i class="icon" data-icon="bell"></i><span>Notifications</span></a>
      <a href="#"><i class="icon" data-icon="lock"></i><span>Security</span></a>
      <a href="#"><i class="icon" data-icon="globe"></i><span>Language</span></a>
    </nav>
    <main class="p-6 stack gap-6" style="max-inline-size: 48rem">
      <div class="page-header">
        <div>
          <h6>Settings</h6>
          <h2>General</h2>
        </div>
      </div>
      <div class="settings">
        <h6>Appearance</h6>
        <div class="setting">
          <div><b>Theme</b><small>Follows the system unless you choose.</small></div>
          <div class="segmented" role="radiogroup">
            <label><input type="radio" name="th" data-theme-set="light" /><span>Light</span></label
            ><label
              ><input type="radio" name="th" data-theme-set="auto" checked /><span
                >Auto</span
              ></label
            ><label><input type="radio" name="th" data-theme-set="dark" /><span>Dark</span></label>
          </div>
        </div>
        <div class="setting">
          <div><b>Reduce transparency</b><small>Solid surfaces instead of glass.</small></div>
          <input type="checkbox" role="switch" />
        </div>
        <div class="setting">
          <div><b>Accent</b></div>
          <div class="swatch-group">
            <label style="--swatch: oklch(0.6 0.2 255)"
              ><input type="radio" name="ac" checked /><span class="sr-only">Blue</span></label
            ><label style="--swatch: oklch(0.6 0.2 305)"
              ><input type="radio" name="ac" /><span class="sr-only">Purple</span></label
            ><label style="--swatch: oklch(0.7 0.15 150)"
              ><input type="radio" name="ac" /><span class="sr-only">Green</span></label
            ><label style="--swatch: oklch(0.5 0.01 255)"
              ><input type="radio" name="ac" /><span class="sr-only">Graphite</span></label
            >
          </div>
        </div>
        <h6>Workspace</h6>
        <div class="setting">
          <div><b>Name</b></div>
          <input class="input" data-size="s" value="Northlight" style="inline-size: 14rem" />
        </div>
        <div class="setting">
          <div><b>Default density</b><small>Compact suits data views.</small></div>
          <div class="segmented" role="radiogroup">
            <label><input type="radio" name="dn" checked /><span>Comfortable</span></label
            ><label><input type="radio" name="dn" /><span>Compact</span></label>
          </div>
        </div>
        <div class="setting">
          <div><b>Seats</b><small>3 of 5 used.</small></div>
          <div class="number">
            <button type="button" aria-label="Decrease" data-step="-1">−</button
            ><input type="number" value="5" min="1" aria-label="Seats" /><button
              type="button"
              aria-label="Increase"
              data-step="1"
            >
              +
            </button>
          </div>
        </div>
        <h6>Danger zone</h6>
        <div class="setting">
          <div><b>Delete workspace</b><small>This cannot be undone.</small></div>
          <button
            class="btn"
            data-size="s"
            data-variant="primary"
            data-tone="danger"
            data-open="#del"
          >
            Delete…
          </button>
        </div>
      </div>
      <dialog id="del" data-light-dismiss data-size="s">
        <form method="dialog" class="stack">
          <h3>Delete Northlight?</h3>
          <p class="text-muted">All 128 pages and their history will be removed.</p>
          <div class="field">
            <label>Type the workspace name to confirm</label
            ><input class="input" placeholder="Northlight" />
          </div>
          <div class="cluster">
            <button class="btn" data-variant="primary" data-tone="danger">Delete workspace</button
            ><button class="btn" data-variant="ghost" value="cancel">Cancel</button>
          </div>
        </form>
      </dialog>
    </main>
  </div>
</template>
