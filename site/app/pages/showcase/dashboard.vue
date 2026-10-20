<script setup lang="ts">
definePageMeta({ layout: "showcase" });
useHead({ title: "Dashboard · showcase · aequitas" });

// ⌘K / Ctrl+K opens the palette from anywhere on the page, as the search field says it does.
const onKey = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    document.querySelector<HTMLDialogElement>("#cmd")?.showModal();
  }
};
onMounted(() => addEventListener("keydown", onKey));
onBeforeUnmount(() => removeEventListener("keydown", onKey));
</script>

<template>
  <div class="shell" data-header>
    <ShowcaseAppHeader />

    <main>
      <div class="container stack gap-7 py-7">
        <section
          class="stack gap-5 mx-auto w-full"
          style="max-inline-size: 42rem"
          aria-labelledby="home-h"
        >
          <div class="text-center stack gap-2">
            <h2 id="home-h">Pick up where you left off</h2>
            <p class="lead">Two drafts are waiting on you, and three pages go live today.</p>
          </div>
          <button class="btn w-full justify-start" type="button" data-open="#cmd">
            <i class="icon" data-icon="search"></i>
            <span class="text-muted">Search or run a command…</span>
            <kbd class="ms-auto hide-s">⌘K</kbd>
          </button>
          <div class="list">
            <a href="#">
              <i class="icon" data-icon="pencil"></i>
              <span>Continue <b>Why we stopped using sprints</b></span>
              <span class="end caption">Edited 12 min ago</span>
            </a>
            <a href="#">
              <i class="icon" data-icon="eye"></i>
              <span>Review <b>October changelog</b></span>
              <span class="end caption">Mika asked at 09:12</span>
            </a>
            <a href="#">
              <i class="icon" data-icon="file-plus"></i>
              <span>New page from the <b>Essay</b> template</span>
              <span class="end caption">Used 14 times</span>
            </a>
          </div>
        </section>

        <section class="stack gap-4" aria-labelledby="drafts-h">
          <div class="page-header">
            <div>
              <h4 id="drafts-h">Your drafts</h4>
              <p class="text-muted">4 of 41 in the workspace, most recently edited first.</p>
            </div>
            <a href="#" class="btn" data-size="s" data-variant="ghost"
              >All drafts <i class="icon" data-icon="arrow-right"></i
            ></a>
          </div>
          <div class="grid" style="--min: 15rem">
            <article class="card" data-interactive>
              <div class="cluster gap-2">
                <span class="badge">Essays</span><span class="badge" data-dot>Draft</span>
              </div>
              <h5><a href="#" data-quiet>Why we stopped using sprints</a></h5>
              <p class="text-s text-muted">
                Two-week cycles made every essay feel late. What we do instead, and what it cost.
              </p>
              <div class="field">
                <label class="text-s" for="d1">2,140 of 2,500 words</label>
                <meter
                  id="d1"
                  value="2140"
                  min="0"
                  max="2500"
                  low="1000"
                  high="2000"
                  optimum="2500"
                ></meter>
              </div>
              <div class="cluster justify-between">
                <div class="avatar-group" role="img" aria-label="Ada and Jun are editing">
                  <span class="avatar" data-size="s">AL</span
                  ><span class="avatar" data-size="s" data-tone="warning">JR</span>
                </div>
                <span class="caption">12 min ago</span>
              </div>
            </article>
            <article class="card" data-interactive>
              <div class="cluster gap-2">
                <span class="badge">Changelog</span
                ><span class="badge" data-tone="info" data-dot>In review</span>
              </div>
              <h5><a href="#" data-quiet>October changelog</a></h5>
              <p class="text-s text-muted">
                Ten presets, a density knob and the new busy squares. Goes out with Newsletter #42.
              </p>
              <div class="field">
                <label class="text-s" for="d2">820 of 800 words</label>
                <meter
                  id="d2"
                  value="820"
                  min="0"
                  max="800"
                  low="300"
                  high="600"
                  optimum="800"
                ></meter>
              </div>
              <div class="cluster justify-between">
                <div class="avatar-group" role="img" aria-label="Mika and Ada are editing">
                  <span class="avatar" data-size="s" data-tone="success">MK</span
                  ><span class="avatar" data-size="s">AL</span>
                </div>
                <span class="caption">1 h ago</span>
              </div>
            </article>
            <article class="card" data-interactive>
              <div class="cluster gap-2">
                <span class="badge">Guides</span
                ><span class="badge" data-tone="warning" data-dot>Changes requested</span>
              </div>
              <h5><a href="#" data-quiet>Field guide to the type scale</a></h5>
              <p class="text-s text-muted">
                Sade asked for real examples in the third section before it can go to review.
              </p>
              <div class="field">
                <label class="text-s" for="d3">3,410 of 4,000 words</label>
                <meter
                  id="d3"
                  value="3410"
                  min="0"
                  max="4000"
                  low="1600"
                  high="3200"
                  optimum="4000"
                ></meter>
              </div>
              <div class="cluster justify-between">
                <span class="avatar" data-size="s" aria-label="Ada is editing" role="img">AL</span>
                <span class="caption">Yesterday</span>
              </div>
            </article>
            <article class="card" data-interactive>
              <div class="cluster gap-2">
                <span class="badge">Jobs</span><span class="badge" data-dot>Draft</span>
              </div>
              <h5><a href="#" data-quiet>Hiring: senior editor</a></h5>
              <p class="text-s text-muted">
                Still missing the salary band and who the role reports to.
              </p>
              <div class="field">
                <label class="text-s" for="d4">640 of 1,200 words</label>
                <meter
                  id="d4"
                  value="640"
                  min="0"
                  max="1200"
                  low="480"
                  high="960"
                  optimum="1200"
                ></meter>
              </div>
              <div class="cluster justify-between">
                <span class="avatar" data-size="s" aria-label="Ada is editing" role="img">AL</span>
                <span class="caption">3 days ago</span>
              </div>
            </article>
          </div>
        </section>

        <div class="split" data-flip>
          <section class="card stack gap-4" aria-labelledby="today-h">
            <div class="page-header">
              <div>
                <h4 id="today-h">Going live today</h4>
                <p class="text-muted">Tuesday 21 October, Europe/Berlin.</p>
              </div>
              <a href="#" class="btn" data-size="s" data-variant="ghost"
                ><i class="icon" data-icon="calendar"></i> Schedule</a
              >
            </div>
            <ol class="timeline">
              <li data-tone="success">
                <time datetime="2026-10-21T09:00">09:00</time>
                <div>
                  <b>Autumn reading list</b>
                  <p>Published by Jun. 412 reads so far.</p>
                </div>
              </li>
              <li data-tone="warning">
                <time datetime="2026-10-21T12:30">12:30</time>
                <div>
                  <b>Brand guidelines, revised</b>
                  <p>
                    2 broken links. The link check will warn, not block. <a href="#">Fix them</a>
                  </p>
                </div>
              </li>
              <li data-tone="info">
                <time datetime="2026-10-21T17:00">17:00</time>
                <div>
                  <b>Newsletter #42</b>
                  <p>Ready. Sends to 3,904 subscribers with the October changelog.</p>
                </div>
              </li>
            </ol>
          </section>

          <section class="card stack gap-4" aria-labelledby="others-h">
            <h4 id="others-h">Since you were last here</h4>
            <ul class="stack gap-3" role="list">
              <li class="cluster gap-3 flex-nowrap items-start">
                <span class="avatar" data-size="s" data-tone="success" aria-hidden="true">MK</span>
                <p class="text-s">
                  <b>Mika</b> asked you to review <a href="#">October changelog</a>.
                  <span class="caption">09:12</span>
                </p>
              </li>
              <li class="cluster gap-3 flex-nowrap items-start">
                <span class="avatar" data-size="s" data-tone="info" aria-hidden="true">SO</span>
                <p class="text-s">
                  <b>Sade</b> requested changes on <a href="#">Field guide to the type scale</a>.
                  <span class="caption">Yesterday</span>
                </p>
              </li>
              <li class="cluster gap-3 flex-nowrap items-start">
                <span class="avatar" data-size="s" data-tone="warning" aria-hidden="true">JR</span>
                <p class="text-s">
                  <b>Jun</b> commented: “Can we cut the second section?”
                  <span class="caption">Yesterday</span>
                </p>
              </li>
            </ul>
            <div class="alert" data-tone="info">
              <div>
                <strong>Pricing FAQ is 14 months old.</strong> It had 1,204 reads this month.
                <a href="#">Review it</a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer class="statusbar">
        <span><span class="dot" data-tone="success"></span> Build passing</span>
        <span>Synced 2 min ago</span>
        <span class="hide-s">English · Deutsch</span>
        <span class="end">128 pages · 41 drafts</span>
        <span class="hide-s">3 editors online</span>
      </footer>
    </main>

    <dialog class="palette" id="cmd" data-light-dismiss aria-label="Search and commands">
      <i class="icon" data-icon="search"></i>
      <input
        class="input"
        placeholder="Search pages, people and commands…"
        aria-label="Search"
        autofocus
      />
      <div role="listbox" aria-label="Pages, people and commands">
        <div role="group" aria-label="Recent pages">
          <h6 aria-hidden="true">Recent pages</h6>
          <div role="option" data-close>
            <i class="icon" data-icon="file-text"></i> Why we stopped using sprints
            <small>Essays · draft</small>
          </div>
          <div role="option" data-close>
            <i class="icon" data-icon="file-text"></i> October changelog
            <small>Changelog · in review</small>
          </div>
          <div role="option" data-close>
            <i class="icon" data-icon="file-text"></i> Field guide to the type scale
            <small>Guides · draft</small>
          </div>
        </div>
        <div role="group" aria-label="Commands">
          <h6 aria-hidden="true">Commands</h6>
          <div role="option" data-close>
            <i class="icon" data-icon="file-plus"></i> New page <kbd>⌘N</kbd>
          </div>
          <div role="option" data-close data-keywords="publish now release">
            <i class="icon" data-icon="send"></i> Publish scheduled changes now
          </div>
          <div role="option" data-close data-keywords="image upload photo">
            <i class="icon" data-icon="upload"></i> Upload media
          </div>
          <div role="option" data-close data-keywords="links broken check">
            <i class="icon" data-icon="link"></i> Check links across the site
          </div>
        </div>
        <div role="group" aria-label="People">
          <h6 aria-hidden="true">People</h6>
          <div role="option" data-close data-keywords="editor">
            <i class="icon" data-icon="user"></i> Mika Kovač <small>Editor</small>
          </div>
          <div role="option" data-close data-keywords="reviewer">
            <i class="icon" data-icon="user"></i> Sade Okafor <small>Reviewer</small>
          </div>
        </div>
      </div>
      <div class="empty" hidden>
        <h4>Nothing for “<span data-term></span>”</h4>
        <p>Try a page title, a person or a command.</p>
      </div>
      <footer>
        <span><kbd>↑</kbd><kbd>↓</kbd>Move</span><span><kbd>↵</kbd>Open</span
        ><span><kbd>Esc</kbd>Close</span>
      </footer>
    </dialog>
  </div>
</template>
