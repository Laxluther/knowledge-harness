/* ============================================================
   Pixel — a tiny in-code pixel-art engine + sprite set + a
   two-character "scene" system for the concept explainers.

   Sprites are rasterised from geometric primitives (discs,
   capsules, rects) onto a small grid, then given a clean 1px
   outline and rendered as crisp SVG rects. All original art,
   so it is fully ours to animate, recolour and repose.
   ============================================================ */

const Pixel = (() => {
  const PAL = {
    o: "#12141f", // outline
    W: "#eef1f8", w: "#c2c7d8", s: "#a9afc6", // suit white / shade / boot
    V: "#7c5cff", v: "#b7a6ff", U: "#5a3fd6", // visor / shine / visor deep
    A: "#ffb454", a: "#ffd79a", B: "#e08a24", // amber / light / deep
    g: "#39405a", G: "#2a3048", // pack / dark panel
    c: "#4ee6dd", C: "#1c8f89", // drone eye / deep
    k: "#2a2f45", n: "#0e1119",
  };

  /* ---- rasteriser ---- */
  function makeGrid(w, h) {
    const g = [];
    for (let y = 0; y < h; y++) g.push(new Array(w).fill("."));
    g.w = w; g.h = h;
    return g;
  }
  function set(g, x, y, c) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= g.w || y >= g.h) return;
    g[y][x] = c;
  }
  function rect(g, x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(g, x + i, y + j, c);
  }
  function disc(g, cx, cy, r, c) {
    for (let y = Math.floor(cy - r); y <= cy + r; y++)
      for (let x = Math.floor(cx - r); x <= cx + r; x++) {
        const dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy <= r * r + r * 0.35) set(g, x, y, c);
      }
  }
  function ell(g, cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++)
      for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1.05) set(g, x, y, c);
      }
  }
  function rrect(g, x, y, w, h, r, c) {
    rect(g, x + r, y, w - 2 * r, h, c);
    rect(g, x, y + r, w, h - 2 * r, c);
    disc(g, x + r - 0.5, y + r - 0.5, r, c);
    disc(g, x + w - r - 0.5, y + r - 0.5, r, c);
    disc(g, x + r - 0.5, y + h - r - 0.5, r, c);
    disc(g, x + w - r - 0.5, y + h - r - 0.5, r, c);
  }
  function outline(g, oc) {
    oc = oc || "o";
    const add = [];
    for (let y = 0; y < g.h; y++)
      for (let x = 0; x < g.w; x++) {
        if (g[y][x] !== ".") continue;
        if (
          (x > 0 && g[y][x - 1] !== "." && g[y][x - 1] !== oc) ||
          (x < g.w - 1 && g[y][x + 1] !== "." && g[y][x + 1] !== oc) ||
          (y > 0 && g[y - 1][x] !== "." && g[y - 1][x] !== oc) ||
          (y < g.h - 1 && g[y + 1][x] !== "." && g[y + 1][x] !== oc)
        )
          add.push([x, y]);
      }
    add.forEach(([x, y]) => (g[y][x] = oc));
    return g;
  }
  function toSVG(g, px) {
    let r = "";
    for (let y = 0; y < g.h; y++)
      for (let x = 0; x < g.w; x++) {
        const ch = g[y][x];
        if (ch === ".") continue;
        r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${PAL[ch] || "#f0f"}"/>`;
      }
    return `<svg width="${g.w * px}" height="${g.h * px}" viewBox="0 0 ${g.w} ${g.h}">${r}</svg>`;
  }

  // small document, drawn onto an existing grid at unit coords (x,y) at
  // resolution S. Drawn before the outline pass so it is outlined with
  // the rest of the sprite.
  function fileOn(g, x, y, S) {
    S = S || 1;
    const R = (a, b, w, h, c) => rect(g, a * S, b * S, w * S, h * S, c);
    const RR = (a, b, w, h, r, c) => rrect(g, a * S, b * S, w * S, h * S, r * S, c);
    RR(x, y, 6, 8, 1, "a");
    R(x + 1, y + 2, 4, 1, "C");
    R(x + 1, y + 4, 4, 1, "C");
    R(x + 1, y + 6, 3, 1, "C");
  }

  /* ---- character builders ----
     All drawn in a 1× "unit" coordinate space but rasterised at
     resolution S (default 2) so the pixels are fine, not chunky.
     Scale-wrappers multiply every coordinate by S. */
  const RES = 2;

  function astronaut(pose) {
    pose = pose || {};
    const S = pose.res || RES;
    const legShift = pose.legShift || 0;
    const g = makeGrid(26 * S, 33 * S);
    const D = (x, y, r, c) => disc(g, x * S, y * S, r * S, c);
    const E = (x, y, rx, ry, c) => ell(g, x * S, y * S, rx * S, ry * S, c);
    const R = (x, y, w, h, c) => rect(g, x * S, y * S, w * S, h * S, c);
    const RR = (x, y, w, h, r, c) => rrect(g, x * S, y * S, w * S, h * S, r * S, c);
    const cx = 13;
    // antenna
    R(cx - 0.5, 1, 1, 4, "k");
    D(cx - 0.5, 1, 1.4, "A");
    // backpack
    RR(5, 13, 4, 12, 1.5, "g");
    D(6.5, 16, 1, "A");
    RR(17, 13, 4, 12, 1.5, "g");
    // legs
    RR(cx - 4.5 + legShift, 26, 3.5, 6, 1.4, "W");
    RR(cx + 1 - legShift, 26, 3.5, 6, 1.4, "W");
    R(cx - 4.5 + legShift, 30, 3.5, 2, "s");
    R(cx + 1 - legShift, 30, 3.5, 2, "s");
    // arms
    RR(3.5, 15, 3.5, 9, 1.5, "W");
    RR(19, 15 + (pose.armUp ? -4 : 0), 3.5, 9, 1.5, "W");
    // body
    RR(6, 15, 14, 13, 4, "W");
    R(16, 18, 3, 8, "w");
    // chest badge
    RR(10, 20, 6, 4, 1, "A");
    R(11, 21, 4, 2, "a");
    R(7, 26, 12, 1, "w");
    // helmet
    D(cx, 9, 8, "W");
    E(cx + 3, 12, 4, 3, "w");
    // visor
    RR(cx - 5.5, 6.5, 11, 7, 3, "U");
    E(cx, 10, 5, 3.2, "V");
    E(cx - 2.5, 8, 2, 1.4, "v");
    R(cx + 2, 8, 1, 1, "v");
    R(cx + 3, 8.5, 1, 1, "v");
    if (pose.carry) fileOn(g, 20, 8, S);
    outline(g, "o");
    return g;
  }

  function drone(pose) {
    pose = pose || {};
    const S = pose.res || RES;
    const g = makeGrid(20 * S, 22 * S);
    const D = (x, y, r, c) => disc(g, x * S, y * S, r * S, c);
    const E = (x, y, rx, ry, c) => ell(g, x * S, y * S, rx * S, ry * S, c);
    const R = (x, y, w, h, c) => rect(g, x * S, y * S, w * S, h * S, c);
    const RR = (x, y, w, h, r, c) => rrect(g, x * S, y * S, w * S, h * S, r * S, c);
    // rotor arms
    R(2, 4, 3, 1, "s");
    R(15, 4, 3, 1, "s");
    D(3, 4, 1.4, "a");
    D(17, 4, 1.4, "a");
    // body
    D(10, 10, 7, "A");
    E(12, 12, 5, 4, "B");
    // face plate
    RR(5, 8, 10, 6, 2.5, "W");
    // eye
    const ex = 10 + (pose.look || 0);
    E(ex, 11, 3, 2, "c");
    R(ex - 1, 10, 2, 2, "C");
    R(ex - 1.5, 10, 1, 1, "v");
    // thrusters
    R(7, 17, 2, 2, "g");
    R(11, 17, 2, 2, "g");
    if (pose.carry) fileOn(g, 7, 18, S);
    outline(g, "o");
    return g;
  }

  function shelf() {
    const S = RES;
    const g = makeGrid(30 * S, 15 * S);
    const R = (x, y, w, h, c) => rect(g, x * S, y * S, w * S, h * S, c);
    const RR = (x, y, w, h, r, c) => rrect(g, x * S, y * S, w * S, h * S, r * S, c);
    RR(0, 0, 30, 14, 1, "G");
    R(2, 2, 26, 3, "n");
    R(2, 7, 26, 3, "n");
    for (let i = 0; i < 6; i++) {
      R(3 + i * 4, 2, 2, 3, "a");
      R(4 + i * 4, 7, 2, 3, "A");
    }
    outline(g, "o");
    return g;
  }

  function bench() {
    const S = RES;
    const g = makeGrid(26 * S, 16 * S);
    const D = (x, y, r, c) => disc(g, x * S, y * S, r * S, c);
    const R = (x, y, w, h, c) => rect(g, x * S, y * S, w * S, h * S, c);
    const RR = (x, y, w, h, r, c) => rrect(g, x * S, y * S, w * S, h * S, r * S, c);
    RR(0, 4, 26, 10, 2, "G");
    D(8, 9, 3.5, "s");
    D(8, 9, 1.5, "G");
    R(14, 7, 8, 1.5, "A");
    R(14, 10, 6, 1.5, "a");
    outline(g, "o");
    return g;
  }

  function outbox() {
    const S = RES;
    const g = makeGrid(22 * S, 16 * S);
    const R = (x, y, w, h, c) => rect(g, x * S, y * S, w * S, h * S, c);
    const RR = (x, y, w, h, r, c) => rrect(g, x * S, y * S, w * S, h * S, r * S, c);
    RR(0, 3, 22, 11, 2, "G");
    R(5, 6, 12, 7, "W");
    R(5, 6, 1, 1, "o");
    for (let i = 0; i <= 6; i++) {
      R(5 + i, 6 + i, 1, 1, "s");
      R(17 - i, 6 + i, 1, 1, "s");
    }
    outline(g, "o");
    return g;
  }

  const BUILD = { astronaut, drone, shelf, bench, outbox };

  const cache = {};
  function spriteSVG(kind, pose, px) {
    const key = kind + JSON.stringify(pose || {}) + "@" + px;
    if (cache[key]) return cache[key];
    const g = BUILD[kind](pose || {});
    const svg = toSVG(g, px);
    cache[key] = svg;
    return svg;
  }

  /* ============================================================
     Image-sprite assets — the red cloaked character (an animation
     sheet, sliced to frames) and the wizard (single pose image).
     Base URL is derived from this script's own location so the
     paths work at any page depth and under a Pages subpath.
     ============================================================ */
  const SPRITE_BASE = (() => {
    const s = [...document.getElementsByTagName("script")].find((t) => (t.src || "").indexOf("pixel.js") >= 0);
    return s ? s.src.replace(/js\/pixel\.js.*$/, "sprites/") : "assets/sprites/";
  })();
  // red-char.png: 32px frames, 8 cols x 9 rows. A clean front idle/step pair.
  const RC = { frame: 32, cols: 8, rows: 9, idle: [[0, 6], [1, 6]] };

  function setRedFrame(el, col, row) {
    el.style.backgroundPosition = `${-col * el._fpx}px ${-row * el._fpx}px`;
  }
  function redSprite(fpx) {
    const el = document.createElement("div");
    el.className = "rc-sprite";
    el.style.width = `${fpx}px`;
    el.style.height = `${fpx}px`;
    el.style.backgroundImage = `url(${SPRITE_BASE}red-char.png)`;
    el.style.backgroundSize = `${RC.cols * fpx}px ${RC.rows * fpx}px`;
    el._fpx = fpx;
    setRedFrame(el, RC.idle[0][0], RC.idle[0][1]);
    return el;
  }
  function playRed(el, frames, ms) {
    stopRed(el);
    let i = 0;
    setRedFrame(el, frames[0][0], frames[0][1]);
    el._rtimer = window.setInterval(() => {
      i = (i + 1) % frames.length;
      setRedFrame(el, frames[i][0], frames[i][1]);
    }, ms);
  }
  function stopRed(el) {
    if (el && el._rtimer) { window.clearInterval(el._rtimer); el._rtimer = null; }
  }
  function wizardImg(w) {
    const img = document.createElement("img");
    img.className = "wiz-sprite";
    img.src = `${SPRITE_BASE}wizard.png`;
    img.width = w;
    return img;
  }
  function carryFile() {
    const d = document.createElement("div");
    d.className = "pix-carry";
    return d;
  }

  // Static HTML markup for a single character, for callers that build an
  // HTML string (e.g. the crew diagram) rather than DOM nodes. "wizard"
  // renders the study companion; anything else renders the red character's
  // idle frame. Same figures used everywhere — no astronaut left behind.
  function markup(kind, px) {
    px = px || 44;
    if (kind === "wizard") {
      return `<img class="wiz-sprite" src="${SPRITE_BASE}wizard.png" width="${px}" alt="" />`;
    }
    const [c, r] = RC.idle[0];
    return `<div class="rc-sprite" style="width:${px}px;height:${px}px;` +
      `background-image:url(${SPRITE_BASE}red-char.png);` +
      `background-size:${RC.cols * px}px ${RC.rows * px}px;` +
      `background-position:${-c * px}px ${-r * px}px"></div>`;
  }

  /* ============================================================
     Two-character scene: an actor walks a stage, thinks, picks up
     a file, carries it, hands it off, and delivers an answer.
     Actors are image sprites — "red" (animated) or "wizard"
     (static). Props stay pixel-drawn (shelf / bench / outbox).
     ============================================================ */
  let seq = 0;
  const reg = {};

  function renderScene(spec) {
    const id = `pix-${seq++}`;
    reg[id] = spec;
    const propHtml = (spec.props || [])
      .map(
        (p) =>
          `<div class="pix-prop" style="left:${p.x}%">
            <div class="pix-prop__art">${spriteSVG(p.kind, {}, 1.5)}</div>
            ${p.label ? `<div class="pix-label">${p.label}</div>` : ""}
          </div>`
      )
      .join("");
    const actorHtml = spec.actors
      .map(
        (a) =>
          `<div class="pix-actor" id="${id}-${a.id}" style="left:${a.x}%">
            <div class="pix-bubble" id="${id}-${a.id}-bub"></div>
            <div class="pix-actor__art" id="${id}-${a.id}-art"></div>
            ${a.label ? `<div class="pix-label">${a.label}</div>` : ""}
          </div>`
      )
      .join("");
    return `<div class="diagram pix-scene" id="${id}" data-diagram-type="pixscene">
      ${spec.question ? `<div class="pix-q">Q → <span>"${spec.question}"</span></div>` : ""}
      <div class="pix-stage">
        <div class="pix-ground"></div>
        ${propHtml}
        ${actorHtml}
      </div>
      <div class="pix-answer" id="${id}-answer">${spec.answer || ""}</div>
      <div class="crew-status" id="${id}-status">${(spec.steps[0] && spec.steps[0].say) || ""}</div>
    </div>`;
  }

  function activateScenes(root) {
    root.querySelectorAll('[data-diagram-type="pixscene"]').forEach((el) => {
      const id = el.id;
      const spec = reg[id];
      if (!spec || spec.__started) return;
      spec.__started = true;

      const statusEl = document.getElementById(`${id}-status`);
      const answerEl = document.getElementById(`${id}-answer`);
      const wait = (ms) => new Promise((r) => window.setTimeout(r, ms));

      const actors = {};
      spec.actors.forEach((a) => {
        const host = document.getElementById(`${id}-${a.id}-art`);
        host.classList.add(`is-${a.kind}`);
        let sprite = null;
        if (a.kind === "red") {
          sprite = redSprite(64);
          host.appendChild(sprite);
          playRed(sprite, RC.idle, 500);
        } else if (a.kind === "wizard") {
          host.appendChild(wizardImg(54));
        } else {
          host.innerHTML = spriteSVG(a.kind, {}, 1.5);
        }
        host.appendChild(carryFile());
        actors[a.id] = {
          spec: a,
          el: document.getElementById(`${id}-${a.id}`),
          host,
          sprite,
          bub: document.getElementById(`${id}-${a.id}-bub`),
          x: a.x,
          carrying: false,
        };
      });

      function say(t) { if (statusEl) statusEl.textContent = t || ""; }
      function setCarry(act, on) {
        act.carrying = on;
        act.host.classList.toggle("is-carrying", on);
      }
      function bounceProp(x) {
        let best = null, bd = 1e9;
        (spec.props || []).forEach((p, i) => {
          const d = Math.abs(p.x - x);
          if (d < bd) { bd = d; best = i; }
        });
        if (best == null) return;
        const pel = el.querySelectorAll(".pix-prop")[best];
        if (pel) { pel.classList.add("is-active"); window.setTimeout(() => pel.classList.remove("is-active"), 700); }
      }
      function startWalk(act, dir) {
        act.el.classList.add("is-away");
        if (act.spec.kind === "red" && act.sprite) {
          act.sprite.style.transform = dir < 0 ? "scaleX(-1)" : "none";
          playRed(act.sprite, RC.idle, 150);
        } else {
          act.el.classList.add("is-bobbing");
        }
      }
      function stopWalk(act) {
        if (act.spec.kind === "red" && act.sprite) playRed(act.sprite, RC.idle, 500);
        act.el.classList.remove("is-bobbing");
        if (Math.abs(act.x - act.spec.x) < 1) act.el.classList.remove("is-away");
      }

      async function runStep(step) {
        const act = actors[step.actor];
        say(step.say);
        if (step.think && act) {
          act.bub.innerHTML = `<span class="pix-dot"></span><span class="pix-dot"></span><span class="pix-dot"></span>`;
          act.bub.classList.add("is-visible");
          await wait(step.hold || 1400);
          act.bub.classList.remove("is-visible");
        }
        if (step.to != null && act) {
          startWalk(act, step.to - act.x);
          act.el.style.left = `${step.to}%`;
          act.x = step.to;
          await wait(step.dur || 1150);
          stopWalk(act);
        }
        if (step.pickup && act) {
          setCarry(act, true);
          bounceProp(act.x);
          await wait(step.hold || 850);
        }
        if (step.handoff && act) {
          const to = actors[step.handoff];
          setCarry(act, false);
          if (to) setCarry(to, true);
          await wait(step.hold || 950);
        }
        if (step.deliver && act) {
          if (answerEl) answerEl.classList.add("is-visible");
          bounceProp(act.x);
          await wait(step.hold || 1900);
        }
        if (!step.think && step.to == null && !step.pickup && !step.handoff && !step.deliver) {
          await wait(step.hold || 850);
        }
      }

      async function cycle() {
        for (const step of spec.steps) await runStep(step);
        await wait(700);
        if (answerEl) answerEl.classList.remove("is-visible");
        spec.actors.forEach((a) => {
          const act = actors[a.id];
          setCarry(act, false);
          act.el.classList.remove("is-away", "is-bobbing");
          if (act.sprite) act.sprite.style.transform = "none";
          act.el.style.transition = "none";
          act.el.style.left = `${a.x}%`;
          act.x = a.x;
          void act.el.offsetWidth;
          act.el.style.transition = "";
        });
        await wait(600);
      }

      (async function loop() {
        for (;;) await cycle();
      })();
    });
  }

  /* ============================================================
     Mascots — red character animates as the map guide; the wizard
     is the corner study companion. Same think/carry/react API the
     old astronaut exposed, so callers only swap the module name.
     ============================================================ */
  function mountOnMap(container, x, y) {
    const el = document.createElement("div");
    el.className = "pix-mascot pix-mascot--map";
    el.style.left = `${x + 46}px`; // stand just to the right of the node
    el.style.top = `${y}px`;
    const s = redSprite(40);
    el.appendChild(s);
    container.appendChild(el);
    playRed(s, RC.idle, 480);
    el._sprite = s;
    return el;
  }

  function mountCompanion() {
    const el = document.createElement("div");
    el.className = "pix-mascot pix-mascot--companion";
    el.innerHTML = `<div class="pix-bubble" data-speech></div>`;
    el.appendChild(wizardImg(66));
    el.appendChild(carryFile());
    document.body.appendChild(el);
    window.setTimeout(() => think(el, { ms: 650 }), 500);
    window.setTimeout(() => react(el, null, { speech: "Let's learn something." }), 1150);
    return el;
  }

  function react(el, mood, opts) {
    opts = opts || {};
    if (!el) return;
    el.classList.remove("is-happy", "is-sad");
    void el.offsetWidth;
    if (mood) el.classList.add(`is-${mood}`);
    const bub = el.querySelector("[data-speech]");
    if (bub && opts.speech) {
      bub.classList.remove("is-thinking");
      bub.textContent = opts.speech;
      bub.classList.add("is-visible");
      window.clearTimeout(bub._t);
      bub._t = window.setTimeout(() => bub.classList.remove("is-visible"), 2600);
    }
  }
  function think(el, opts) {
    opts = opts || {};
    const bub = el && el.querySelector("[data-speech]");
    if (!bub) return;
    bub.innerHTML = `<span class="pix-dot"></span><span class="pix-dot"></span><span class="pix-dot"></span>`;
    bub.classList.add("is-visible", "is-thinking");
    window.clearTimeout(bub._t);
    bub._t = window.setTimeout(() => bub.classList.remove("is-visible", "is-thinking"), opts.ms || 1500);
  }
  function carry(el, opts) {
    opts = opts || {};
    const cf = el && el.querySelector(".pix-carry");
    if (!cf) return;
    cf.classList.add("is-on");
    window.clearTimeout(el._ct);
    el._ct = window.setTimeout(() => cf.classList.remove("is-on"), opts.ms || 2200);
  }

  return {
    PAL, toSVG, spriteSVG, build: BUILD,
    renderScene, activateScenes,
    mountOnMap, mountCompanion, react, think, carry, markup,
    _prims: { makeGrid, rect, disc, ell, rrect, outline, fileOn },
  };
})();
