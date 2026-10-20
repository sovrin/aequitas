<!-- The Northlight app header the dashboard and settings showcases share. NuxtLink marks the
     current page with aria-current, which the navbar draws. -->
<template>
  <!-- The thin frost the sidebar uses, not the bar default: the aurora shows through. -->
  <header class="navbar" style="--ae-frost-bg: inherit">
    <div class="cluster flex-nowrap gap-2">
      <strong class="cluster gap-2">
        <ShowcaseMark />
        <span class="hide-s">Northlight</span>
      </strong>
      <span class="text-muted hide-s" aria-hidden="true">/</span>
      <button
        class="btn"
        data-size="s"
        type="button"
        popovertarget="ws-menu"
        aria-label="Workspace: Field Notes"
      >
        <span class="avatar" data-size="s" data-tone="info" aria-hidden="true">FN</span>
        <span class="hide-s">Field Notes</span>
        <span class="badge hide-s">Team</span>
        <i class="icon" data-icon="chevron-down" data-size="s"></i>
      </button>
    </div>
    <nav class="cluster" aria-label="Main">
      <NuxtLink to="/showcase/dashboard">Home</NuxtLink><a href="#">Pages</a><a href="#">Schedule</a
      ><a href="#">Media</a>
    </nav>
    <div class="end cluster flex-nowrap gap-2">
      <button class="btn" data-size="s" data-variant="primary" type="button" aria-label="New page">
        <i class="icon" data-icon="plus"></i><span class="hide-s">New page</span>
      </button>
      <button
        class="btn"
        data-size="s"
        data-variant="ghost"
        data-icon
        data-count="2"
        type="button"
        aria-label="Notifications, 2 unread"
      >
        <i class="icon" data-icon="bell"></i>
      </button>
      <button
        class="btn"
        data-size="s"
        data-variant="ghost"
        data-icon
        type="button"
        popovertarget="me-menu"
        aria-label="Account: Ada Lovelace"
      >
        <span class="avatar" data-size="s" data-status="online" aria-hidden="true">AL</span>
      </button>
    </div>
  </header>
  <!-- Menus sit outside the navbar, whose link styles would otherwise reach their items. -->
  <div class="menu" popover id="ws-menu">
    <h6>Workspaces</h6>
    <button aria-pressed="true">
      <span class="avatar" data-size="s" data-tone="info" aria-hidden="true">FN</span> Field Notes
      <kbd>⌘1</kbd>
    </button>
    <button aria-pressed="false">
      <span class="avatar" data-size="s" data-tone="success" aria-hidden="true">HP</span>
      Harbor Press <kbd>⌘2</kbd>
    </button>
    <button aria-pressed="false">
      <span class="avatar" data-size="s" data-tone="warning" aria-hidden="true">SH</span>
      Studio Hale <kbd>⌘3</kbd>
    </button>
    <hr />
    <NuxtLink to="/showcase/settings"
      ><i class="icon" data-icon="settings-gear"></i> Workspace settings</NuxtLink
    >
    <button><i class="icon" data-icon="plus"></i> New workspace</button>
  </div>
  <div class="menu" popover id="me-menu">
    <h6>Ada Lovelace</h6>
    <a href="#"><i class="icon" data-icon="user"></i> Profile</a>
    <button data-theme-set="light"><i class="icon" data-icon="sun"></i> Light</button>
    <button data-theme-set="dark"><i class="icon" data-icon="moon"></i> Dark</button>
    <hr />
    <button><i class="icon" data-icon="log-out"></i> Sign out</button>
  </div>
</template>
