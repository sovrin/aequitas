<template>
  <!-- A golden rectangle on a 34×21 grid, subdivided into squares. Every square is a live component. -->
  <div class="phi" data-stagger aria-hidden="true">
    <div class="tile animate-scale-in" style="grid-area: 1 / 1 / span 21 / span 21">
      <div class="window" style="inline-size: 100%; max-inline-size: 22rem">
        <header><span>Northlight</span></header>
        <div class="stack gap-3 p-4">
          <div class="field">
            <label>Project name</label><input class="input" data-size="s" value="Northlight" />
          </div>
          <div class="cluster">
            <label><input type="checkbox" role="switch" checked /> Public</label
            ><span class="badge" data-tone="success">Live</span>
          </div>
          <div class="cluster">
            <button class="btn" data-size="s" data-variant="primary">Publish</button
            ><button class="btn" data-size="s">Save draft</button>
          </div>
        </div>
      </div>
    </div>
    <div class="tile animate-scale-in" style="grid-area: 1 / 22 / span 13 / span 13">
      <div class="stack gap-3" style="inline-size: 100%; max-inline-size: 12rem">
        <div class="stat"><b>12,480</b><span>Active users</span></div>
        <span class="delta" data-trend="up">+12.4%</span>
        <progress value="62" max="100"></progress>
      </div>
    </div>
    <div class="tile animate-scale-in" style="grid-area: 14 / 27 / span 8 / span 8">
      <div class="segmented" role="radiogroup">
        <label><input type="radio" name="phi-seg" /><span>Day</span></label
        ><label><input type="radio" name="phi-seg" checked /><span>Week</span></label>
      </div>
    </div>
    <div class="tile animate-scale-in" style="grid-area: 17 / 22 / span 5 / span 5">
      <input type="checkbox" role="switch" checked aria-label="Switch" />
    </div>
    <div class="tile animate-scale-in" style="grid-area: 14 / 22 / span 3 / span 3">
      <span class="avatar" data-size="s">AL</span>
    </div>
    <div class="tile animate-scale-in" style="grid-area: 15 / 25 / span 2 / span 2">
      <span class="dot" data-tone="success"></span>
    </div>
    <div class="tile animate-scale-in" style="grid-area: 14 / 25 / span 1 / span 1"></div>
    <div class="tile animate-scale-in" style="grid-area: 14 / 26 / span 1 / span 1"></div>
  </div>
</template>
