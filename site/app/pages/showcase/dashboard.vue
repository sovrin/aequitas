<script setup lang="ts">
definePageMeta({ layout: "showcase" });
useHead({ title: "Dashboard · showcase · aequitas" });
</script>

<template>
  <div class="shell" data-collapsible data-header style="--header: 3.25rem">
    <header class="navbar">
      <strong>Northlight</strong>
      <nav class="cluster">
        <a href="#" aria-current="page">Overview</a><a href="#">Projects</a><a href="#">Members</a>
      </nav>
      <div class="end cluster gap-2">
        <div class="input-group" style="inline-size: 16rem">
          <span><i class="icon" data-icon="search"></i></span
          ><input class="input" data-size="s" type="search" placeholder="Search…" /><span
            ><kbd>⌘K</kbd></span
          >
        </div>
        <button class="btn" data-size="s" data-icon aria-label="Notifications" data-count="3">
          <i class="icon" data-icon="bell"></i>
        </button>
        <span class="avatar" data-size="s" data-status="online">AL</span>
      </div>
    </header>
    <nav class="sidebar">
      <details open>
        <summary>Workspace</summary>
        <a href="#" aria-current="page"
          ><i class="icon" data-icon="home"></i><span>Overview</span></a
        >
        <a href="#"><i class="icon" data-icon="grid"></i><span>Projects</span></a>
        <a href="#"><i class="icon" data-icon="user"></i><span>Members</span></a>
        <a href="#"><i class="icon" data-icon="calendar"></i><span>Schedule</span></a>
      </details>
      <details open>
        <summary>Reports</summary>
        <a href="#"><i class="icon" data-icon="list"></i><span>Usage</span></a>
        <a href="#"><i class="icon" data-icon="clock"></i><span>Activity</span></a>
      </details>
      <footer>
        <a href="#"><i class="icon" data-icon="sliders"></i><span>Settings</span></a>
      </footer>
    </nav>
    <main class="p-6 stack gap-6">
      <div class="page-header">
        <div>
          <h6>Thursday 2 October</h6>
          <h2>Good morning, Ada.</h2>
        </div>
        <div class="cluster gap-2">
          <button class="btn" data-size="s">Export</button
          ><button class="btn" data-size="s" data-variant="primary">
            <i class="icon" data-icon="plus"></i> New project
          </button>
        </div>
      </div>
      <div class="bento" style="--min: 12rem">
        <div class="card" data-span="2">
          <div class="stat">
            <b>12,480</b><span>Active users <span class="delta" data-trend="up">+12.4%</span></span>
          </div>
          <progress value="62" max="100" class="mt-4"></progress>
        </div>
        <div class="card">
          <div class="stat"><b>98.2%</b><span>Uptime</span></div>
        </div>
        <div class="card">
          <div class="stat">
            <b>€48k</b><span>MRR <span class="delta" data-trend="up">+3.1%</span></span>
          </div>
        </div>
        <div class="card" data-span="2" data-rows="2">
          <h6>Activity</h6>
          <ol class="timeline mt-3">
            <li data-tone="success">
              <time>09:41</time>
              <div>
                <b>Published</b>
                <p>Northlight v2 went live.</p>
              </div>
            </li>
            <li data-tone="info">
              <time>09:12</time>
              <div>
                <b>Review requested</b>
                <p>Mika asked for a second pair of eyes.</p>
              </div>
            </li>
            <li>
              <time>Yesterday</time>
              <div>
                <b>Draft created</b>
                <p>Started from the blank template.</p>
              </div>
            </li>
          </ol>
        </div>
        <div class="card" data-span="2">
          <h6>Team</h6>
          <div class="list mt-3" style="box-shadow: none; background: none">
            <a href="#"
              ><span class="avatar" data-size="s">AL</span> Ada
              <span class="end caption">Owner</span></a
            >
            <a href="#"
              ><span class="avatar" data-size="s" data-tone="success">MK</span> Mika
              <span class="end caption">Editor</span></a
            >
            <a href="#"
              ><span class="avatar" data-size="s" data-tone="warning">JR</span> Jun
              <span class="end caption">Viewer</span></a
            >
          </div>
        </div>
      </div>
      <div class="card">
        <div class="page-header mb-4">
          <div><h4>Projects</h4></div>
          <div class="segmented" role="radiogroup">
            <label><input type="radio" name="v" checked /><span>All</span></label
            ><label><input type="radio" name="v" /><span>Live</span></label
            ><label><input type="radio" name="v" /><span>Draft</span></label>
          </div>
        </div>
        <div class="table-scroll">
          <table class="table" data-size="s">
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Select all" /></th>
                <th aria-sort="ascending">Project</th>
                <th aria-sort="none">Owner</th>
                <th aria-sort="none" data-num>Pages</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" aria-label="Select" /></td>
                <td>Northlight</td>
                <td>Ada</td>
                <td data-num>128</td>
                <td><span class="badge" data-tone="success" data-dot>Live</span></td>
                <td>
                  <button
                    class="btn"
                    data-size="s"
                    data-variant="ghost"
                    data-icon
                    aria-label="More"
                  >
                    <i class="icon" data-icon="more"></i>
                  </button>
                </td>
              </tr>
              <tr aria-selected="true">
                <td><input type="checkbox" checked aria-label="Select" /></td>
                <td>Atlas</td>
                <td>Mika</td>
                <td data-num>42</td>
                <td><span class="badge" data-tone="warning" data-dot>Review</span></td>
                <td>
                  <button
                    class="btn"
                    data-size="s"
                    data-variant="ghost"
                    data-icon
                    aria-label="More"
                  >
                    <i class="icon" data-icon="more"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" aria-label="Select" /></td>
                <td>Harbor</td>
                <td>Jun</td>
                <td data-num>9</td>
                <td><span class="badge" data-dot>Draft</span></td>
                <td>
                  <button
                    class="btn"
                    data-size="s"
                    data-variant="ghost"
                    data-icon
                    aria-label="More"
                  >
                    <i class="icon" data-icon="more"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>
