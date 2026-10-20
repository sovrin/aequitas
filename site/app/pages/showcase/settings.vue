<script setup lang="ts">
definePageMeta({ layout: "showcase" });
useHead({ title: "Settings · showcase · aequitas" });

// The save bar wakes up once anything in the form changes, and sleeps again on Discard or Save.
const dirty = ref(false);
</script>

<template>
  <div class="shell" data-header data-collapsible>
    <ShowcaseAppHeader />
    <nav class="sidebar" aria-label="Settings">
      <h6>Field Notes</h6>
      <a href="#" aria-current="page"
        ><i class="icon" data-icon="settings-gear"></i><span>Workspace</span></a
      >
      <a href="#"><i class="icon" data-icon="credit-card"></i><span>Plan and billing</span></a>
      <a href="#"><i class="icon" data-icon="layers"></i><span>Integrations</span></a>
      <a href="#"><i class="icon" data-icon="key"></i><span>API keys</span></a>
      <h6>You</h6>
      <a href="#"><i class="icon" data-icon="user"></i><span>Profile</span></a>
      <a href="#"><i class="icon" data-icon="bell"></i><span>Notifications</span></a>
      <footer>
        <NuxtLink to="/showcase/dashboard"
          ><i class="icon" data-icon="arrow-left"></i><span>Back to Home</span></NuxtLink
        >
      </footer>
    </nav>
    <main class="p-5">
      <form
        class="with-aside"
        style="--aside: 13rem; max-inline-size: 64rem"
        @input="dirty = true"
        @reset="dirty = false"
        @submit.prevent="dirty = false"
      >
        <article class="stack gap-7">
          <div class="page-header">
            <div>
              <nav aria-label="Breadcrumb">
                <ol class="breadcrumb">
                  <li><a href="#">Field Notes</a></li>
                  <li aria-current="page">Settings</li>
                </ol>
              </nav>
              <h2>Workspace settings</h2>
            </div>
          </div>

          <section id="general" class="stack gap-4" aria-labelledby="general-h">
            <div>
              <h4 id="general-h">General</h4>
              <p class="text-muted">How the workspace is named and where readers find it.</p>
            </div>
            <div class="card">
              <div class="form-grid">
                <div class="field">
                  <label for="ws-name" data-required>Workspace name</label>
                  <input
                    class="input"
                    id="ws-name"
                    value="Field Notes"
                    required
                    aria-describedby="ws-name-hint ws-name-error"
                  />
                  <small id="ws-name-hint">Shown in the editor and in emails to members.</small>
                  <span data-error id="ws-name-error">Give the workspace a name.</span>
                </div>
                <div class="field">
                  <label for="ws-url">Address</label>
                  <div class="input-group">
                    <input
                      class="input"
                      id="ws-url"
                      value="field-notes"
                      pattern="[a-z0-9-]+"
                      aria-describedby="ws-url-hint ws-url-error"
                    /><span>.northlight.app</span>
                  </div>
                  <small id="ws-url-hint">Lowercase letters, digits and hyphens.</small>
                  <span data-error id="ws-url-error">Use only a–z, 0–9 and hyphens.</span>
                </div>
                <div class="field" data-span="full">
                  <label for="ws-desc">Description</label>
                  <textarea class="input" id="ws-desc" aria-describedby="ws-desc-hint">
Essays, guides and the changelog from the Field Notes studio.</textarea>
                  <small id="ws-desc-hint">Used for search results and link previews.</small>
                </div>
                <div class="field">
                  <label for="ws-lang">Default language</label>
                  <div class="select">
                    <select class="input" id="ws-lang">
                      <option selected>English (UK)</option>
                      <option>English (US)</option>
                      <option>Deutsch</option>
                      <option>Français</option>
                    </select>
                  </div>
                </div>
                <div class="field">
                  <label for="ws-tz">Time zone</label>
                  <div class="select">
                    <select class="input" id="ws-tz">
                      <option>Europe/London</option>
                      <option selected>Europe/Berlin</option>
                      <option>America/New_York</option>
                    </select>
                  </div>
                </div>
                <div class="field" data-span="full">
                  <label for="ws-logo">Logo</label>
                  <label class="dropzone">
                    <input type="file" id="ws-logo" accept="image/svg+xml,image/png" />
                    <strong>Drop an SVG or PNG</strong>
                    or click to browse · square, at least 256 px
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section id="members" class="stack gap-4" aria-labelledby="members-h">
            <div class="page-header">
              <div>
                <h4 id="members-h">Members</h4>
                <p class="text-muted">5 of 8 seats used on the Team plan.</p>
              </div>
              <button class="btn" data-size="s" type="button">
                <i class="icon" data-icon="credit-card"></i> Add seats
              </button>
            </div>
            <meter
              value="5"
              min="0"
              max="8"
              high="7"
              optimum="0"
              aria-label="Seats · 5 of 8 used"
            ></meter>
            <div class="card stack gap-4" data-flush>
              <div class="cluster gap-2 p-5 pb-0">
                <div class="input-group flex-1">
                  <span><i class="icon" data-icon="user-plus"></i></span
                  ><input
                    class="input"
                    type="email"
                    placeholder="name@example.com"
                    aria-label="Invite by email"
                  />
                </div>
                <div class="select">
                  <select class="input" aria-label="Role for the invite">
                    <option>Editor</option>
                    <option>Reviewer</option>
                    <option>Admin</option>
                  </select>
                </div>
                <button class="btn" type="button">Send invite</button>
              </div>
              <div class="table-scroll">
                <table class="table" data-size="s" style="min-inline-size: 36rem">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Last active</th>
                      <th><span class="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="cluster gap-3">
                          <span class="avatar" data-size="s" aria-hidden="true">AL</span>
                          <span
                            ><b>Ada Lovelace</b><br /><small class="text-muted"
                              >ada@field-notes.org</small
                            ></span
                          >
                        </div>
                      </td>
                      <td>Owner</td>
                      <td><time datetime="2026-10-21">Now</time></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cluster gap-3">
                          <span class="avatar" data-size="s" data-tone="success" aria-hidden="true"
                            >MK</span
                          >
                          <span
                            ><b>Mika Kovač</b><br /><small class="text-muted"
                              >mika@field-notes.org</small
                            ></span
                          >
                        </div>
                      </td>
                      <td>
                        <div class="select">
                          <select class="input" data-size="s" aria-label="Role for Mika Kovač">
                            <option>Admin</option>
                            <option selected>Editor</option>
                            <option>Reviewer</option>
                          </select>
                        </div>
                      </td>
                      <td><time datetime="2026-10-21T09:12">09:12</time></td>
                      <td>
                        <button
                          class="btn"
                          data-size="s"
                          data-variant="ghost"
                          data-icon
                          type="button"
                          aria-label="Remove Mika Kovač"
                        >
                          <i class="icon" data-icon="user-minus"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cluster gap-3">
                          <span class="avatar" data-size="s" data-tone="warning" aria-hidden="true"
                            >JR</span
                          >
                          <span
                            ><b>Jun Rahman</b><br /><small class="text-muted"
                              >jun@field-notes.org</small
                            ></span
                          >
                        </div>
                      </td>
                      <td>
                        <div class="select">
                          <select class="input" data-size="s" aria-label="Role for Jun Rahman">
                            <option>Admin</option>
                            <option selected>Editor</option>
                            <option>Reviewer</option>
                          </select>
                        </div>
                      </td>
                      <td><time datetime="2026-10-20">Yesterday</time></td>
                      <td>
                        <button
                          class="btn"
                          data-size="s"
                          data-variant="ghost"
                          data-icon
                          type="button"
                          aria-label="Remove Jun Rahman"
                        >
                          <i class="icon" data-icon="user-minus"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cluster gap-3">
                          <span class="avatar" data-size="s" data-tone="info" aria-hidden="true"
                            >SO</span
                          >
                          <span
                            ><b>Sade Okafor</b><br /><small class="text-muted"
                              >sade@field-notes.org</small
                            ></span
                          >
                        </div>
                      </td>
                      <td>
                        <div class="select">
                          <select class="input" data-size="s" aria-label="Role for Sade Okafor">
                            <option>Admin</option>
                            <option>Editor</option>
                            <option selected>Reviewer</option>
                          </select>
                        </div>
                      </td>
                      <td><time datetime="2026-10-14">14 Oct</time></td>
                      <td>
                        <button
                          class="btn"
                          data-size="s"
                          data-variant="ghost"
                          data-icon
                          type="button"
                          aria-label="Remove Sade Okafor"
                        >
                          <i class="icon" data-icon="user-minus"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cluster gap-3">
                          <span class="avatar" data-size="s" aria-hidden="true">LM</span>
                          <span
                            ><b>lena.m@studio-hale.de</b><br /><small class="text-muted"
                              >Invited 3 days ago</small
                            ></span
                          >
                        </div>
                      </td>
                      <td>
                        <span class="badge" data-tone="warning" data-dot>Invite pending</span>
                      </td>
                      <td>—</td>
                      <td>
                        <button class="btn" data-size="s" data-variant="ghost" type="button">
                          Resend
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="publishing" class="stack gap-4" aria-labelledby="publishing-h">
            <div>
              <h4 id="publishing-h">Publishing</h4>
              <p class="text-muted">What has to happen before a page goes live.</p>
            </div>
            <div class="settings">
              <div class="setting">
                <div>
                  <b id="pub-review">Require a review</b
                  ><small id="pub-review-d"
                    >A page can only be scheduled once a reviewer approves it.</small
                  >
                </div>
                <input
                  type="checkbox"
                  role="switch"
                  checked
                  aria-labelledby="pub-review"
                  aria-describedby="pub-review-d"
                />
              </div>
              <div class="setting">
                <div>
                  <b id="pub-who">Who can approve</b
                  ><small id="pub-who-d">Owners and admins can always approve.</small>
                </div>
                <div class="tag-input" style="inline-size: 18rem">
                  <span class="chip"
                    >Sade Okafor
                    <button type="button" data-dismiss=".chip" aria-label="Remove Sade Okafor">
                      ×
                    </button></span
                  >
                  <span class="chip"
                    >Mika Kovač
                    <button type="button" data-dismiss=".chip" aria-label="Remove Mika Kovač">
                      ×
                    </button></span
                  >
                  <input
                    placeholder="Add a reviewer…"
                    aria-labelledby="pub-who"
                    aria-describedby="pub-who-d"
                  />
                </div>
              </div>
              <div class="setting">
                <div>
                  <b id="pub-time">Default publish time</b
                  ><small id="pub-time-d">New schedules start here, in Europe/Berlin.</small>
                </div>
                <input
                  class="input"
                  type="time"
                  value="09:00"
                  style="inline-size: 9rem"
                  aria-labelledby="pub-time"
                  aria-describedby="pub-time-d"
                />
              </div>
              <div class="setting">
                <div>
                  <b id="pub-links">Block on broken links</b
                  ><small id="pub-links-d">Checks every link when a page is scheduled.</small>
                </div>
                <div class="segmented" role="radiogroup" data-size="s" aria-labelledby="pub-links">
                  <label><input type="radio" name="pub-links" /><span>Off</span></label
                  ><label><input type="radio" name="pub-links" checked /><span>Warn</span></label
                  ><label><input type="radio" name="pub-links" /><span>Block</span></label>
                </div>
              </div>
              <div class="setting">
                <div>
                  <b id="pub-archive">Archive untouched drafts</b
                  ><small id="pub-archive-d"
                    >Archived drafts stay searchable and can be restored.</small
                  >
                </div>
                <div class="select">
                  <select
                    class="input"
                    data-size="s"
                    aria-labelledby="pub-archive"
                    aria-describedby="pub-archive-d"
                  >
                    <option>Never</option>
                    <option>After 90 days</option>
                    <option selected>After 6 months</option>
                    <option>After a year</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section id="notifications" class="stack gap-4" aria-labelledby="notifications-h">
            <div>
              <h4 id="notifications-h">Notifications</h4>
              <p class="text-muted">Your own alerts. Other members choose theirs.</p>
            </div>
            <div class="settings">
              <div class="setting">
                <div>
                  <b id="nt-rv">Someone asks me to review</b
                  ><small>Including re-reviews after changes.</small>
                </div>
                <div class="cluster flex-nowrap gap-4" role="group" aria-labelledby="nt-rv">
                  <label><input type="checkbox" role="switch" checked /> Email</label>
                  <label><input type="checkbox" role="switch" checked /> In app</label>
                </div>
              </div>
              <div class="setting">
                <div>
                  <b id="nt-cm">Someone comments on my page</b
                  ><small>Replies to your own comments always notify.</small>
                </div>
                <div class="cluster flex-nowrap gap-4" role="group" aria-labelledby="nt-cm">
                  <label><input type="checkbox" role="switch" /> Email</label>
                  <label><input type="checkbox" role="switch" checked /> In app</label>
                </div>
              </div>
              <div class="setting">
                <div>
                  <b id="nt-fail">A scheduled page fails to publish</b
                  ><small>Broken links, a missing image or a build error.</small>
                </div>
                <div class="cluster flex-nowrap gap-4" role="group" aria-labelledby="nt-fail">
                  <label><input type="checkbox" role="switch" checked /> Email</label>
                  <label><input type="checkbox" role="switch" checked /> In app</label>
                </div>
              </div>
              <div class="setting">
                <div>
                  <b id="nt-stale">A page I own goes stale</b
                  ><small>Not edited for a year, or reads fell by half.</small>
                </div>
                <div class="cluster flex-nowrap gap-4" role="group" aria-labelledby="nt-stale">
                  <label><input type="checkbox" role="switch" /> Email</label>
                  <label><input type="checkbox" role="switch" checked /> In app</label>
                </div>
              </div>
              <div class="setting">
                <div>
                  <b id="nt-digest">Reading digest</b
                  ><small id="nt-digest-d">Reads and finished reads for the pages you own.</small>
                </div>
                <div class="segmented" role="radiogroup" data-size="s" aria-labelledby="nt-digest">
                  <label><input type="radio" name="nt-digest" /><span>Off</span></label
                  ><label><input type="radio" name="nt-digest" /><span>Daily</span></label
                  ><label><input type="radio" name="nt-digest" checked /><span>Weekly</span></label>
                </div>
              </div>
            </div>
          </section>

          <section id="domain" class="stack gap-4" aria-labelledby="domain-h">
            <div>
              <h4 id="domain-h">Custom domain</h4>
              <p class="text-muted">Serve the workspace from an address you own.</p>
            </div>
            <div class="alert" data-tone="warning">
              <div>
                <strong>notes.field-notes.org isn't connected yet.</strong> We can't find its CNAME
                record. Add the record below at your DNS provider; changes can take up to an hour to
                arrive.
              </div>
              <button class="btn" data-size="s" type="button">
                <i class="icon" data-icon="refresh"></i> Check again
              </button>
            </div>
            <div class="card">
              <dl class="properties">
                <dt>Domain</dt>
                <dd>notes.field-notes.org</dd>
                <dt>Status</dt>
                <dd><span class="badge" data-tone="warning" data-dot>Waiting for DNS</span></dd>
                <dt>Record type</dt>
                <dd class="mono">CNAME</dd>
                <dt>Name</dt>
                <dd class="mono">notes</dd>
                <dt>Value</dt>
                <dd>
                  <span class="mono">field-notes.northlight.app</span>
                  <button
                    class="btn"
                    data-size="s"
                    data-variant="ghost"
                    data-icon
                    type="button"
                    aria-label="Copy the value"
                  >
                    <i class="icon" data-icon="copy"></i>
                  </button>
                </dd>
                <dt>Last checked</dt>
                <dd><time datetime="2026-10-21T09:40">Today, 09:40</time></dd>
              </dl>
            </div>
          </section>

          <section id="danger" class="stack gap-4" aria-labelledby="danger-h">
            <div>
              <h4 id="danger-h">Danger zone</h4>
              <p class="text-muted">These change the workspace for everyone in it.</p>
            </div>
            <div class="settings">
              <div class="setting">
                <div>
                  <b>Export everything</b
                  ><small>All 128 pages as Markdown, with media and history, in one ZIP.</small>
                </div>
                <button class="btn" data-size="s" type="button">
                  <i class="icon" data-icon="download"></i> Export
                </button>
              </div>
              <div class="setting">
                <div>
                  <b>Transfer ownership</b
                  ><small>The new owner is billed from the next cycle. You become an admin.</small>
                </div>
                <button class="btn" data-size="s" type="button">Transfer…</button>
              </div>
              <div class="setting">
                <div>
                  <b>Delete workspace</b
                  ><small>Removes every page, draft and member. This can't be undone.</small>
                </div>
                <button
                  class="btn"
                  data-size="s"
                  data-variant="primary"
                  data-tone="danger"
                  type="button"
                  data-open="#del"
                >
                  Delete…
                </button>
              </div>
            </div>
          </section>

          <div class="action-bar">
            <span class="me-auto text-s text-muted hide-s" aria-live="polite">{{
              dirty ? "You have unsaved changes." : "All changes saved."
            }}</span>
            <button class="btn" data-variant="ghost" type="reset" :disabled="!dirty">Discard</button
            ><button class="btn" data-variant="primary" type="submit" :disabled="!dirty">
              Save changes
            </button>
          </div>
        </article>
        <aside class="hidden l:block">
          <nav class="toc" aria-label="On this page">
            <ul>
              <li><a href="#general" aria-current="true">General</a></li>
              <li><a href="#members">Members</a></li>
              <li><a href="#publishing">Publishing</a></li>
              <li><a href="#notifications">Notifications</a></li>
              <li><a href="#domain">Custom domain</a></li>
              <li><a href="#danger">Danger zone</a></li>
            </ul>
          </nav>
        </aside>
      </form>
      <dialog id="del" data-light-dismiss data-size="s" aria-labelledby="del-h">
        <form method="dialog" class="stack">
          <h3 id="del-h">Delete Field Notes?</h3>
          <p class="text-muted">
            All 128 pages, 41 drafts and their history go, and the 5 members lose access. Export
            first if you want a copy.
          </p>
          <div class="field">
            <label for="del-confirm">Type <b>field-notes</b> to confirm</label
            ><input
              class="input"
              id="del-confirm"
              autocomplete="off"
              pattern="field-notes"
              required
            />
          </div>
          <div class="cluster">
            <button class="btn" data-variant="primary" data-tone="danger">Delete workspace</button
            ><button class="btn" data-variant="ghost" value="cancel" formnovalidate>Cancel</button>
          </div>
        </form>
      </dialog>
    </main>
  </div>
</template>
