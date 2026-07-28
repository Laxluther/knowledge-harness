/* ============================================================
   Shared app utilities: diagram renderer + status bar builder.
   Used by both gamified quest pages and the Simple revise page.
   ============================================================ */

const App = (() => {
  let diagramSeq = 0;
  const registry = {};
  // Crew diagram coordinate-system width — shared between renderCrew's node
  // layout and activateCrew's packet motion, and kept in sync with
  // .crew-stage's max-width in quest.css (see the comment at its use below).
  const CREW_STAGE_W = 400;

  function renderDiagram(spec, { animated = true } = {}) {
    if (!spec) return "";
    switch (spec.type) {
      case "pipeline":
        return renderPipeline(spec, animated);
      case "compare":
        return renderCompare(spec, animated);
      case "stack":
        return renderStack(spec, animated);
      case "bars":
        return renderBars(spec, animated);
      case "attention":
        return renderAttention(spec);
      case "embed":
        return renderEmbed(spec);
      case "trainloop":
        return renderTrainLoop(spec);
      case "persona":
        return renderPersona(spec);
      case "reward":
        return renderReward(spec);
      case "radar":
        return renderRadar(spec);
      case "crew":
        return renderCrew(spec);
      case "snake":
        return renderSnake(spec);
      case "vectorstrip":
        return renderVectorStrip(spec);
      case "figure":
        return renderFigure(spec);
      case "scene":
        return renderScene(spec);
      case "pixscene":
        return typeof Pixel !== "undefined" ? Pixel.renderScene(spec) : "";
      default:
        return "";
    }
  }

  // Theatrical "scene": the astronaut mascot physically walks a horizontal
  // stage between labelled stations, thinking, picking up a file, carrying
  // it back, and delivering it — acting out a concept step by step instead
  // of showing an abstract node graph. Used to explain flows where a
  // "go fetch something and bring it back" narrative is the whole point
  // (retrieval, tool calls, the agent loop).
  function renderScene(spec) {
    const id = `scene-${diagramSeq++}`;
    registry[id] = spec;

    const stationsHtml = spec.stations
      .map(
        (s) => `<div class="scene-station${s.kind ? ` scene-station--${s.kind}` : ""}" id="${id}-st-${s.id}" style="left:${s.x}%">
          <div class="scene-station__box">${s.glyph || "▤"}</div>
          <div class="scene-station__label">${s.label}</div>
          ${s.holdsFile ? `<div class="scene-station__file" id="${id}-file">▤</div>` : ""}
        </div>`
      )
      .join("");

    return `<div class="diagram" id="${id}" data-diagram-type="scene">
      ${spec.question ? `<div class="scene-question">Q → <span>"${spec.question}"</span></div>` : ""}
      <div class="scene-stage">
        <div class="scene-ground"></div>
        ${stationsHtml}
        <div class="scene-actor" id="${id}-actor">
          <div class="scene-actor__bubble" id="${id}-bubble" data-speech></div>
          ${Pixel.markup("red", 44)}
        </div>
      </div>
      <div class="scene-answer" id="${id}-answer">${spec.answer || ""}</div>
      <div class="crew-status" id="${id}-status">${(spec.steps[0] && spec.steps[0].say) || ""}</div>
    </div>`;
  }

  function activateScene(root) {
    root.querySelectorAll('[data-diagram-type="scene"]').forEach((diagramEl) => {
      const id = diagramEl.id;
      const spec = registry[id];
      if (!spec || spec.__started || typeof Pixel === "undefined") return;
      spec.__started = true;

      const stage = diagramEl.querySelector(".scene-stage");
      const actor = document.getElementById(`${id}-actor`);
      const bubble = document.getElementById(`${id}-bubble`);
      const statusEl = document.getElementById(`${id}-status`);
      const answerEl = document.getElementById(`${id}-answer`);
      const fileEl = document.getElementById(`${id}-file`);
      const stationX = (sid) => spec.stations.find((s) => s.id === sid).x;
      // Stop just short of a station, pulled toward stage centre, so the
      // astronaut stands beside the box in the open corridor rather than
      // covering it.
      const approachX = (sid) => {
        const x = stationX(sid);
        return x < 50 ? x + 9 : x - 9;
      };
      const wait = (ms) => new Promise((r) => window.setTimeout(r, ms));
      const bounce = (sid) => {
        const el = document.getElementById(`${id}-st-${sid}`);
        if (!el) return;
        el.classList.add("is-active");
        window.setTimeout(() => el.classList.remove("is-active"), 700);
      };

      // start position (instant, no walk)
      let posId = spec.start || spec.stations[0].id;
      actor.style.transition = "none";
      actor.style.left = `${approachX(posId)}%`;
      void actor.offsetWidth;
      actor.style.transition = "";

      function say(text) {
        if (statusEl) statusEl.textContent = text || "";
      }

      async function runStep(step) {
        say(step.say);
        // walk to a station if the step targets a different one
        if (step.to && step.to !== posId) {
          actor.classList.add("is-walking");
          actor.style.left = `${approachX(step.to)}%`;
          await wait(1150);
          actor.classList.remove("is-walking");
          posId = step.to;
        }
        if (step.think) {
          bubble.textContent = "";
          bubble.innerHTML = `<span class="astro-dot"></span><span class="astro-dot"></span><span class="astro-dot"></span>`;
          bubble.classList.add("is-visible");
          await wait(step.hold || 1500);
          bubble.classList.remove("is-visible");
        }
        if (step.pickup) {
          if (fileEl) fileEl.classList.add("is-taken");
          actor.classList.add("is-carrying");
          bounce(posId);
          await wait(step.hold || 900);
        }
        if (step.deliver) {
          actor.classList.remove("is-carrying");
          bounce(posId);
          if (answerEl) answerEl.classList.add("is-visible");
          await wait(step.hold || 1900);
        }
        if (!step.think && !step.pickup && !step.deliver) {
          await wait(step.hold || 850);
        }
      }

      async function cycle() {
        for (const step of spec.steps) {
          await runStep(step);
        }
        // reset for the next loop
        await wait(700);
        if (answerEl) answerEl.classList.remove("is-visible");
        actor.classList.remove("is-carrying");
        if (fileEl) fileEl.classList.remove("is-taken");
        actor.style.transition = "none";
        actor.style.left = `${approachX(spec.start || spec.stations[0].id)}%`;
        void actor.offsetWidth;
        actor.style.transition = "";
        posId = spec.start || spec.stations[0].id;
        await wait(600);
      }

      (async function loop() {
        for (;;) await cycle();
      })();
    });
  }

  // A literal look at what an embedding actually is: a row of numbers.
  // Rows placed together so similar tokens visibly share a color pattern
  // and a dissimilar token visibly doesn't — ties directly into cosine
  // similarity rather than just showing an abstract 2D scatter.
  function renderVectorStrip(spec) {
    const rows = spec.rows
      .map((r) => {
        const cells = r.values
          .map((v) => {
            const mag = Math.min(1, Math.abs(v)).toFixed(2);
            const sign = v >= 0 ? "pos" : "neg";
            return `<div class="vecstrip__cell vecstrip__cell--${sign}" style="--mag:${mag}"><span>${v.toFixed(2)}</span></div>`;
          })
          .join("");
        return `<div class="vecstrip__row">
          <div class="vecstrip__label">${r.label}</div>
          <div class="vecstrip__cells">${cells}</div>
        </div>`;
      })
      .join("");
    return `<div class="diagram" data-diagram-type="vectorstrip">
      ${spec.caption ? `<div class="diagram-bars__label">${spec.caption}</div>` : ""}
      <div class="vecstrip">${rows}</div>
      ${spec.note ? `<div class="vecstrip__note">${spec.note}</div>` : ""}
    </div>`;
  }

  function pipelineStages(stages, animated, delayOffset = 0) {
    return stages
      .map((s, i) => {
        const delay = animated ? `${(i * 90) + delayOffset}ms` : "0ms";
        const arrow =
          i < stages.length - 1
            ? `<div class="diagram-pipeline__arrow"></div>`
            : "";
        return `<div class="diagram-pipeline__stage">
          <div class="diagram-pipeline__box" style="animation-delay:${delay}">${s}</div>
          ${arrow}
        </div>`;
      })
      .join("");
  }

  function renderPipeline(spec, animated) {
    const id = `pipe-${diagramSeq++}`;
    registry[id] = spec;
    const loop = spec.loop
      ? `<div class="diagram-pipeline__loop">↻ repeats billions of times</div>`
      : "";
    return `<div class="diagram" id="${id}" data-diagram-type="pipeline">
      ${spec.label ? `<div class="diagram-bars__label">${spec.label}</div>` : ""}
      <div class="diagram-pipeline">${pipelineStages(spec.stages, animated)}${loop}</div>
    </div>`;
  }

  function renderCompare(spec, animated) {
    const id = `cmp-${diagramSeq++}`;
    registry[id] = spec;
    const query = spec.query ? `<div class="diagram-query">Input → <span>"${spec.query}"</span></div>` : "";
    function col(side, isLeft, extraDelay) {
      const outcome = side.outcome
        ? `<div class="diagram-outcome" data-kind="${side.outcome.kind}"><span class="diagram-outcome__icon">${side.outcome.icon}</span><span>${side.outcome.text}</span></div>`
        : "";
      return `<div class="diagram-compare__col diagram-compare__col--${isLeft ? "left" : "right"}">
        <div class="diagram-compare__col-label">${side.label}</div>
        <div class="diagram-pipeline">${pipelineStages(side.stages, animated, extraDelay)}</div>
        ${outcome}
      </div>`;
    }
    return `<div class="diagram" id="${id}" data-diagram-type="compare">
      ${query}
      <div class="diagram-compare">
        ${col(spec.left, true, 0)}
        ${col(spec.right, false, 200)}
      </div>
    </div>`;
  }

  function renderStack(spec, animated) {
    const id = `stack-${diagramSeq++}`;
    registry[id] = spec;
    const blocks = spec.stages
      .map((s, i) => {
        const delay = animated ? `${i * 110}ms` : "0ms";
        return `<div class="diagram-stack__block" style="animation-delay:${delay}">${s}</div>`;
      })
      .join("");
    return `<div class="diagram" id="${id}" data-diagram-type="stack">
      <div class="diagram-stack">
        <div class="diagram-stack__label">${spec.label || ""}</div>
        <div class="diagram-stack__bracket">${blocks}</div>
      </div>
    </div>`;
  }

  function renderBars(spec, animated) {
    const id = `bars-${diagramSeq++}`;
    registry[id] = spec;
    const max = Math.max(...spec.bars.map((b) => b.value));
    const cols = spec.bars
      .map((b, i) => {
        const pct = Math.round((b.value / max) * 100);
        const delay = animated ? i * 90 : 0;
        return `<div class="diagram-bars__col" data-idx="${i}">
          <div class="diagram-bars__val">${b.value}${spec.unit ?? "%"}</div>
          <div class="diagram-bars__fill" data-target="${pct}" style="transition-delay:${delay}ms"></div>
          <div class="diagram-bars__tok">${b.label}</div>
        </div>`;
      })
      .join("");
    const sampleRow = spec.noSample
      ? ""
      : `<div class="diagram-bars__sample" id="${id}-sample">🎲 sampling next token…</div>`;
    return `<div class="diagram" id="${id}" data-diagram-type="bars">
      <div class="diagram-bars__label">${spec.label || ""}</div>
      <div class="diagram-bars">${cols}</div>
      ${sampleRow}
    </div>`;
  }

  function weightedPick(bars) {
    const total = bars.reduce((s, b) => s + b.value, 0);
    let r = Math.random() * total;
    for (const b of bars) {
      r -= b.value;
      if (r <= 0) return b;
    }
    return bars[0];
  }

  function activateBars(root) {
    root.querySelectorAll('[data-diagram-type="bars"]').forEach((diagramEl) => {
      diagramEl.querySelectorAll(".diagram-bars__fill").forEach((el) => {
        const target = el.getAttribute("data-target");
        requestAnimationFrame(() => {
          el.style.height = `${target}%`;
        });
      });

      const id = diagramEl.id;
      const spec = registry[id];
      if (!spec || spec.__started) return;
      spec.__started = true;
      if (spec.noSample) return;
      const sampleEl = document.getElementById(`${id}-sample`);
      const cols = [...diagramEl.querySelectorAll(".diagram-bars__col")];

      function sampleOnce() {
        const pick = weightedPick(spec.bars);
        const pickIdx = spec.bars.indexOf(pick);
        cols.forEach((c) => c.classList.remove("is-sampled"));
        const col = cols[pickIdx];
        if (col) col.classList.add("is-sampled");
        if (sampleEl) sampleEl.innerHTML = `🎲 sampled → <strong>${pick.label}</strong>`;
      }

      window.setTimeout(() => {
        sampleOnce();
        window.setInterval(sampleOnce, 2400);
      }, 1000);
    });
  }

  function renderAttention(spec) {
    const id = `attn-${diagramSeq++}`;
    registry[id] = spec;
    const tokens = spec.tokens
      .map((t, i) => `<span class="attn-token" data-idx="${i}">${t}</span>`)
      .join("");
    return `<div class="diagram">
      <div class="diagram-bars__label" id="${id}-caption">Attention from <strong>${spec.tokens[spec.sequence[0].query]}</strong></div>
      <div class="attn-wrap" id="${id}">
        <svg class="attn-svg"></svg>
        <div class="attn-tokens">${tokens}</div>
      </div>
    </div>`;
  }

  function activateAttention(root) {
    root.querySelectorAll(".attn-wrap").forEach((wrap) => {
      const id = wrap.id;
      const spec = registry[id];
      if (!spec || spec.__started) return;
      spec.__started = true;

      const svg = wrap.querySelector(".attn-svg");
      const tokenEls = [...wrap.querySelectorAll(".attn-token")];
      const caption = document.getElementById(`${id}-caption`);
      let step = 0;

      function draw() {
        const entry = spec.sequence[step % spec.sequence.length];
        step++;
        if (caption) caption.innerHTML = `Attention from <strong>${spec.tokens[entry.query]}</strong>`;
        tokenEls.forEach((el, i) => {
          el.classList.toggle("is-query", i === entry.query);
          el.classList.toggle("is-target", Object.prototype.hasOwnProperty.call(entry.weights, i));
        });

        const rootRect = wrap.getBoundingClientRect();
        svg.setAttribute("width", rootRect.width);
        svg.setAttribute("height", rootRect.height);
        svg.innerHTML = "";
        const qEl = tokenEls[entry.query];
        if (!qEl) return;
        const qRect = qEl.getBoundingClientRect();
        const qx = qRect.left - rootRect.left + qRect.width / 2;
        const qy = qRect.top - rootRect.top + qRect.height / 2;

        Object.entries(entry.weights).forEach(([idxStr, w]) => {
          const idx = Number(idxStr);
          const tEl = tokenEls[idx];
          if (!tEl) return;
          const tRect = tEl.getBoundingClientRect();
          const tx = tRect.left - rootRect.left + tRect.width / 2;
          const ty = tRect.top - rootRect.top + tRect.height / 2;
          const lift = 24 + w * 60;
          const midY = Math.min(qy, ty) - lift;
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", `M ${qx} ${qy} Q ${(qx + tx) / 2} ${midY}, ${tx} ${ty}`);
          path.setAttribute("class", `attn-link${w >= 0.35 ? " is-strong" : ""}`);
          path.style.strokeWidth = `${1 + w * 8}`;
          path.style.opacity = `${0.3 + w * 0.7}`;
          svg.appendChild(path);
        });
      }

      draw();
      window.setInterval(draw, 3400);
    });
  }

  function renderEmbed(spec) {
    const id = `embed-${diagramSeq++}`;
    registry[id] = spec;
    const dots = spec.points
      .map(
        (p, i) =>
          `<div class="embed-point" data-idx="${i}" data-cluster="${p.cluster}"><span class="embed-dot"></span><span class="embed-label">${p.label}</span></div>`
      )
      .join("");
    return `<div class="diagram">
      <div class="diagram-bars__label" id="${id}-caption">Random initialization - before training</div>
      <div class="embed-panel" id="${id}">${dots}</div>
    </div>`;
  }

  function activateEmbed(root) {
    root.querySelectorAll(".embed-panel").forEach((panel) => {
      const id = panel.id;
      const spec = registry[id];
      if (!spec || spec.__started) return;
      spec.__started = true;

      const caption = document.getElementById(`${id}-caption`);
      const pts = [...panel.querySelectorAll(".embed-point")];

      function scramble() {
        pts.forEach((el) => {
          el.style.left = `${6 + Math.random() * 84}%`;
          el.style.top = `${10 + Math.random() * 76}%`;
        });
        if (caption) caption.textContent = "Random initialization - before training";
      }

      function trained() {
        pts.forEach((el, i) => {
          const p = spec.points[i];
          el.style.left = `${p.x}%`;
          el.style.top = `${p.y}%`;
        });
        if (caption) caption.textContent = "After training - similar meaning ends up as nearby vectors";
      }

      scramble();
      window.setTimeout(trained, 1500);
      window.setInterval(() => {
        scramble();
        window.setTimeout(trained, 1500);
      }, 5600);
    });
  }

  // Progression is shown purely via the "is-charged" glow moving between
  // boxes — no traveling dot. A dot small enough to read as a packet was
  // never big enough to avoid resting directly on top of box text.
  function runFlowLoop(container, items, { tick = 900 } = {}) {
    let i = 0;
    items[0].classList.add("is-charged");

    window.setInterval(() => {
      i = (i + 1) % items.length;
      items.forEach((el, idx) => el.classList.toggle("is-charged", idx === i));
    }, tick);
  }

  function activatePipelineFlow(root) {
    root.querySelectorAll('[data-diagram-type="pipeline"]').forEach((diagramEl) => {
      const spec = registry[diagramEl.id];
      if (!spec || spec.__started) return;
      spec.__started = true;
      const pipelineEl = diagramEl.querySelector(".diagram-pipeline");
      const boxes = [...pipelineEl.querySelectorAll(".diagram-pipeline__box")];
      if (boxes.length) runFlowLoop(pipelineEl, boxes);
    });
  }

  function activateStackFlow(root) {
    root.querySelectorAll('[data-diagram-type="stack"]').forEach((diagramEl) => {
      const spec = registry[diagramEl.id];
      if (!spec || spec.__started) return;
      spec.__started = true;
      const bracket = diagramEl.querySelector(".diagram-stack__bracket");
      const blocks = [...bracket.querySelectorAll(".diagram-stack__block")];
      if (blocks.length) runFlowLoop(bracket, blocks, { tick: 900 });
    });
  }

  function activateCompareFlow(root) {
    root.querySelectorAll('[data-diagram-type="compare"]').forEach((diagramEl) => {
      const spec = registry[diagramEl.id];
      if (!spec || spec.__started) return;
      spec.__started = true;

      const colEls = [...diagramEl.querySelectorAll(".diagram-compare__col")];
      const cols = colEls.map((colEl, ci) => {
        const pipelineEl = colEl.querySelector(".diagram-pipeline");
        const boxes = [...pipelineEl.querySelectorAll(".diagram-pipeline__box")];
        const outcome = colEl.querySelector(".diagram-outcome");
        return { pipelineEl, boxes, outcome, side: ci === 0 ? spec.left : spec.right };
      });
      const maxLen = Math.max(...cols.map((c) => c.boxes.length));

      function reset() {
        cols.forEach((c) => {
          c.boxes.forEach((b) => b.classList.remove("is-charged"));
          if (c.outcome) c.outcome.classList.remove("is-visible", "is-miss", "is-match");
        });
      }

      function step(i) {
        cols.forEach((c) => {
          if (i < c.boxes.length) {
            c.boxes.forEach((b, bi) => b.classList.toggle("is-charged", bi === i));
          }
        });
      }

      function finish() {
        cols.forEach((c) => {
          if (c.outcome) {
            c.outcome.classList.add("is-visible", c.side.outcome?.kind === "miss" ? "is-miss" : "is-match");
          }
        });
      }

      function cycle() {
        reset();
        let i = 0;
        const timer = window.setInterval(() => {
          i++;
          if (i < maxLen) {
            step(i);
          } else {
            window.clearInterval(timer);
            finish();
          }
        }, 900);
      }

      cycle();
      window.setInterval(cycle, maxLen * 900 + 2800);
    });
  }

  /* ---- Ch.4: pretraining loop (guess vs actual, shrinking loss) ---- */
  function renderTrainLoop(spec) {
    const id = `tl-${diagramSeq++}`;
    registry[id] = spec;
    const tokens = spec.context.map((t) => `<span class="tl-token">${t}</span>`).join("");
    return `<div class="diagram" id="${id}" data-diagram-type="trainloop">
      <div class="tl-step" id="${id}-step">step 1 / ${spec.steps.length}</div>
      <div class="tl-context">
        <div class="tl-tokens">${tokens}</div>
        <div class="tl-arrow">→</div>
        <div class="tl-slot" id="${id}-slot">?</div>
      </div>
      <div class="tl-readout">
        <span>model guesses <strong id="${id}-guess">…</strong></span>
        <span id="${id}-conf" class="tl-conf">0% confident</span>
      </div>
      <div class="tl-loss-row">
        <span class="tl-loss-label">loss</span>
        <div class="tl-loss-track"><div class="tl-loss-fill" id="${id}-lossfill"></div></div>
        <span class="tl-loss-val" id="${id}-lossval">–</span>
      </div>
      <div class="tl-target">target: <strong>${spec.target}</strong></div>
    </div>`;
  }

  function activateTrainLoop(root) {
    root.querySelectorAll('[data-diagram-type="trainloop"]').forEach((diagramEl) => {
      const id = diagramEl.id;
      const spec = registry[id];
      if (!spec || spec.__started) return;
      spec.__started = true;

      const slot = document.getElementById(`${id}-slot`);
      const guessEl = document.getElementById(`${id}-guess`);
      const confEl = document.getElementById(`${id}-conf`);
      const lossFill = document.getElementById(`${id}-lossfill`);
      const lossVal = document.getElementById(`${id}-lossval`);
      const stepEl = document.getElementById(`${id}-step`);
      const maxLoss = Math.max(...spec.steps.map((s) => s.loss));

      let i = 0;
      function render() {
        const s = spec.steps[i];
        const correct = s.guess === spec.target;
        slot.textContent = s.guess;
        slot.classList.toggle("is-correct", correct);
        slot.classList.toggle("is-wrong", !correct);
        guessEl.textContent = `"${s.guess}"`;
        confEl.textContent = `${s.conf}% confident`;
        lossVal.textContent = s.loss.toFixed(1);
        lossFill.style.width = `${Math.min(100, (s.loss / maxLoss) * 100)}%`;
        lossFill.classList.toggle("is-low", s.loss / maxLoss < 0.35);
        stepEl.textContent = `step ${i + 1} / ${spec.steps.length}`;
      }

      render();
      window.setInterval(() => {
        i = (i + 1) % spec.steps.length;
        render();
      }, 1700);
    });
  }

  /* ---- Ch.5: fine-tuning persona toggle ---- */
  function renderPersona(spec) {
    const id = `ps-${diagramSeq++}`;
    registry[id] = spec;
    const pills = spec.personas
      .map((p, i) => `<span class="ps-pill${i === 0 ? " is-active" : ""}" data-i="${i}">${p.label}</span>`)
      .join("");
    return `<div class="diagram" id="${id}" data-diagram-type="persona">
      <div class="ps-prompt">Same frozen model → prompt: <span>"${spec.prompt}"</span></div>
      <div class="ps-switch">${pills}</div>
      <div class="ps-output" id="${id}-out"><span>${spec.personas[0].text}</span></div>
    </div>`;
  }

  function activatePersona(root) {
    root.querySelectorAll('[data-diagram-type="persona"]').forEach((diagramEl) => {
      const id = diagramEl.id;
      const spec = registry[id];
      if (!spec || spec.__started) return;
      spec.__started = true;

      const pills = [...diagramEl.querySelectorAll(".ps-pill")];
      const out = document.getElementById(`${id}-out`);
      let i = 0;

      window.setInterval(() => {
        i = (i + 1) % spec.personas.length;
        pills.forEach((p, pi) => p.classList.toggle("is-active", pi === i));
        out.classList.add("is-swapping");
        window.setTimeout(() => {
          out.innerHTML = `<span>${spec.personas[i].text}</span>`;
          out.classList.remove("is-swapping");
        }, 260);
      }, 3400);
    });
  }

  /* ---- Ch.6: RLHF reward + preference optimization ---- */
  function renderReward(spec) {
    const id = `rw-${diagramSeq++}`;
    registry[id] = spec;
    function card(side, data) {
      return `<div class="rw-card" data-side="${side}">
        <div class="rw-text">${data.text}</div>
        <div class="rw-score-track"><div class="rw-score-fill" data-target="${data.score}"></div></div>
        <div class="rw-score-label">reward score: <strong>${data.score}</strong></div>
      </div>`;
    }
    return `<div class="diagram" id="${id}" data-diagram-type="reward">
      <div class="rw-prompt">Prompt → <span>"${spec.prompt}"</span></div>
      <div class="rw-candidates">${card("a", spec.a)}${card("b", spec.b)}</div>
      <div class="rw-climb-label">P(policy picks the safer response) over training <span id="${id}-stepnum">- step 1</span></div>
      <div class="rw-climb-track"><div class="rw-climb-fill" id="${id}-climb"></div></div>
    </div>`;
  }

  function activateReward(root) {
    root.querySelectorAll('[data-diagram-type="reward"]').forEach((diagramEl) => {
      const id = diagramEl.id;
      const spec = registry[id];
      if (!spec || spec.__started) return;
      spec.__started = true;

      diagramEl.querySelectorAll(".rw-score-fill").forEach((el) => {
        requestAnimationFrame(() => {
          el.style.width = `${el.getAttribute("data-target")}%`;
        });
      });

      const climb = document.getElementById(`${id}-climb`);
      const stepLabel = document.getElementById(`${id}-stepnum`);
      let i = 0;

      function render() {
        climb.style.width = `${spec.steps[i]}%`;
        stepLabel.textContent = `- step ${i + 1}: ${spec.steps[i]}%`;
      }

      window.setTimeout(() => {
        render();
        window.setInterval(() => {
          i = (i + 1) % spec.steps.length;
          render();
        }, 1500);
      }, 900);
    });
  }

  /* ---- Ch.8: evaluation radar ---- */
  function renderRadar(spec) {
    const id = `radar-${diagramSeq++}`;
    registry[id] = spec;
    const n = spec.axes.length;
    const cx = 130,
      cy = 130,
      maxR = 96;
    const angleFor = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const pointAt = (i, r) => {
      const a = angleFor(i);
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    };

    const rings = [0.25, 0.5, 0.75, 1]
      .map((f) => {
        const pts = spec.axes.map((_, i) => pointAt(i, maxR * f).join(",")).join(" ");
        return `<polygon points="${pts}" class="radar-ring" />`;
      })
      .join("");

    const spokes = spec.axes
      .map((_, i) => {
        const [x, y] = pointAt(i, maxR);
        return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="radar-spoke" />`;
      })
      .join("");

    const labels = spec.axes
      .map((a, i) => {
        const [x, y] = pointAt(i, maxR + 22);
        return `<text x="${x}" y="${y}" class="radar-label" text-anchor="middle" dominant-baseline="middle">${a.label}</text>`;
      })
      .join("");

    const dataPts = spec.axes.map((a, i) => pointAt(i, (a.value / 100) * maxR).join(",")).join(" ");

    return `<div class="diagram" id="${id}" data-diagram-type="radar">
      <div class="diagram-bars__label">${spec.label || "Evaluation portfolio"}</div>
      <svg class="radar-svg" viewBox="0 0 260 260">
        ${rings}
        ${spokes}
        <polygon points="${dataPts}" class="radar-data" id="${id}-poly" />
        ${labels}
      </svg>
    </div>`;
  }

  function activateRadar(root) {
    root.querySelectorAll('[data-diagram-type="radar"]').forEach((diagramEl) => {
      const id = diagramEl.id;
      if (!registry[id] || registry[id].__started) return;
      registry[id].__started = true;
      const poly = document.getElementById(`${id}-poly`);
      if (poly) poly.classList.add("is-live");
    });
  }

  // A small tome that agents hand to each other — the "work product" moving
  // through the crew, replacing the abstract dot packet.
  const CREW_BOOK = `<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
    <rect x="5" y="4" width="14" height="16" rx="1.6" fill="var(--panel-raised)" stroke="var(--ion)" stroke-width="1.7"/>
    <line x1="8.7" y1="4.4" x2="8.7" y2="19.6" stroke="var(--ion)" stroke-width="1.3"/>
    <line x1="11" y1="8.5" x2="16" y2="8.5" stroke="var(--amber)" stroke-width="1.3"/>
    <line x1="11" y1="11.5" x2="16" y2="11.5" stroke="var(--amber)" stroke-width="1.3"/>
    <line x1="11" y1="14.5" x2="14.5" y2="14.5" stroke="var(--amber)" stroke-width="1.3"/>
  </svg>`;

  // A bespoke, self-contained illustration: the content supplies a themed
  // inline SVG (using the design tokens as colours) plus an optional title and
  // caption. For one-off concept diagrams that don't fit a reusable engine.
  function renderFigure(spec) {
    const id = `fig-${diagramSeq++}`;
    return `<div class="diagram fig" id="${id}" data-diagram-type="figure">
      ${spec.title ? `<div class="fig__title">${spec.title}</div>` : ""}
      <div class="fig__body">${spec.svg}</div>
      ${spec.caption ? `<div class="fig__caption">${spec.caption}</div>` : ""}
    </div>`;
  }

  /* ---- Part V: crew mascots acting out an orchestration pattern. A tome
     travels between them (parallel to the line, never over a character), and
     the receiving agent narrates the step in a thinking bubble. ---- */
  function renderCrew(spec) {
    const id = `crew-${diagramSeq++}`;
    registry[id] = spec;

    const tiers = {};
    spec.nodes.forEach((n) => {
      (tiers[n.tier] = tiers[n.tier] || []).push(n);
    });
    const tierKeys = Object.keys(tiers)
      .map(Number)
      .sort((a, b) => a - b);
    const tierGap = 150; // room for a thinking bubble in the gutter between tiers
    // Kept in sync with .crew-stage's max-width in quest.css — this is the
    // coordinate system nodes are positioned in, so a mismatch leaves nodes
    // spilling past the actual rendered box on narrow viewports.
    const stageW = CREW_STAGE_W;
    const topPad = 78; // room for a thinking bubble above the top tier
    const positions = {};
    tierKeys.forEach((t, ti) => {
      const row = tiers[t];
      const gapX = stageW / (row.length + 1);
      row.forEach((n, i) => {
        positions[n.id] = { x: gapX * (i + 1), y: topPad + ti * tierGap };
      });
    });
    const stageH = topPad + (tierKeys.length - 1) * tierGap + 72;

    const edgesSvg = spec.flow
      .map((f) => {
        const a = positions[f.from];
        const b = positions[f.to];
        if (f.via) {
          return `<path d="M ${a.x} ${a.y} Q ${f.via.x} ${f.via.y} ${b.x} ${b.y}" class="crew-edge" fill="none" />`;
        }
        return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="crew-edge" />`;
      })
      .join("");

    const nodesHtml = spec.nodes
      .map((n) => {
        const p = positions[n.id];
        const bubble = `<div class="crew-bubble" id="${id}-bub-${n.id}"></div>`;
        if (n.role === "board") {
          return `<div class="crew-board" id="${id}-${n.id}" style="left:${p.x}px;top:${p.y}px">
            ${bubble}
            <div class="crew-board__icon">▤</div>
            <div class="crew-node__label">${n.label}</div>
          </div>`;
        }
        const isCaptain = n.role === "captain";
        return `<div class="crew-mascot${isCaptain ? " is-captain" : ""}" id="${id}-${n.id}" style="left:${p.x}px;top:${p.y}px">
          ${bubble}
          ${Pixel.markup(isCaptain ? "wizard" : "red", isCaptain ? 52 : 40)}
          <div class="crew-node__label">${n.label}</div>
        </div>`;
      })
      .join("");

    return `<div class="diagram" id="${id}" data-diagram-type="crew">
      <div class="crew-task">Task → <span>"${spec.task}"</span></div>
      <div class="crew-stage" style="height:${stageH}px">
        <svg class="crew-svg" width="${stageW}" height="${stageH}">${edgesSvg}</svg>
        ${nodesHtml}
        <div class="crew-packet" id="${id}-packet">${CREW_BOOK}</div>
      </div>
    </div>`;
  }

  function activateCrew(root) {
    root.querySelectorAll('[data-diagram-type="crew"]').forEach((diagramEl) => {
      const id = diagramEl.id;
      const spec = registry[id];
      if (!spec || spec.__started || typeof Pixel === "undefined") return;
      spec.__started = true;

      const stage = diagramEl.querySelector(".crew-stage");
      const packet = document.getElementById(`${id}-packet`);
      const nodeEl = (nid) => document.getElementById(`${id}-${nid}`);
      const bubbleEl = (nid) => document.getElementById(`${id}-bub-${nid}`);
      const wait = (ms) => new Promise((r) => window.setTimeout(r, ms));

      function centerOf(el) {
        const r = el.getBoundingClientRect();
        const sr = stage.getBoundingClientRect();
        return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 };
      }

      function bounce(el) {
        if (!el) return;
        el.classList.add("is-receiving");
        window.setTimeout(() => el.classList.remove("is-receiving"), 620);
      }

      // One thinking bubble at a time — the agent currently holding the tome.
      let shownBub = null;
      let stepI = 0;
      function thinkOn(nid, text, below) {
        if (shownBub) shownBub.classList.remove("is-visible");
        const bub = bubbleEl(nid);
        if (bub) {
          bub.textContent = text || "";
          bub.classList.toggle("crew-bubble--below", !!below);
          bub.classList.add("is-visible");
          shownBub = bub;
        }
      }
      function think(nid) {
        const steps = spec.statusSteps || [];
        thinkOn(nid, steps[stepI % (steps.length || 1)]);
        stepI++;
      }

      function placePacket(p, instant) {
        if (instant) packet.style.transition = "none";
        packet.style.left = `${p.x}px`;
        packet.style.top = `${p.y}px`;
        if (instant) { void packet.offsetWidth; packet.style.transition = ""; }
      }

      // Carry the tome in a lane offset perpendicular to the line, so it runs
      // parallel to the connector and never sits on a character.
      function laneEnds(a, b) {
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        // Clear of the ~20px-wide character plus the ~10px-wide tome, with a
        // small gap so the book never touches the sprite.
        const off = 26, px = (-dy / len) * off, py = (dx / len) * off;
        return { a: { x: a.x + px, y: a.y + py }, b: { x: b.x + px, y: b.y + py } };
      }

      async function hop(fromId, toId) {
        const lane = laneEnds(centerOf(nodeEl(fromId)), centerOf(nodeEl(toId)));
        placePacket(lane.a, true);
        packet.style.opacity = "1";
        void packet.offsetWidth;
        placePacket(lane.b, false); // slow glide (CSS ~1000ms ease-in-out)
        await wait(1050);
        bounce(nodeEl(toId));
        think(toId);
        await wait(1700); // dwell so the bubble can be read
        packet.style.opacity = "0";
        await wait(320);
      }

      async function runFlow(reverse) {
        const hops = reverse ? [...spec.flow].map((f) => ({ from: f.to, to: f.from })).reverse() : spec.flow;
        if (spec.parallel) {
          // Fan out: every recipient pulses together, and the phases are
          // narrated in one bubble below the coordinator — a single centred
          // caption instead of colliding per-agent bubbles.
          const dispatcher = hops[0].from;
          const steps = spec.statusSteps || [];
          for (let k = 0; k < steps.length; k++) {
            hops.forEach((f) => bounce(nodeEl(f.to)));
            thinkOn(dispatcher, steps[k], true);
            await wait(2300);
          }
          if (shownBub) { shownBub.classList.remove("is-visible"); shownBub = null; }
        } else {
          for (const f of hops) await hop(f.from, f.to);
        }
      }

      async function cycle() {
        await runFlow(false);
        // Parallel already narrates its full dispatch→work→report→merge arc,
        // so it doesn't need a reverse pass (which would bubble off the top).
        if (spec.roundTrip && !spec.parallel) {
          await wait(300);
          await runFlow(true);
        }
        await wait(1400);
        if (shownBub) { shownBub.classList.remove("is-visible"); shownBub = null; }
        await wait(600);
      }

      (async function loop() {
        for (;;) {
          await cycle();
        }
      })();
    });
  }

  /* ---- Serpentine pipeline: a single sprite walks a snaking chain of
     labelled stations, narrating the current step in a thinking bubble
     above its head. Connectors run edge-to-edge (never through a label)
     and the whole thing flows top-to-bottom so it uses vertical space
     instead of a wide horizontal strip. ---- */
  const SNAKE_W = 320; // viewBox coordinate width (scales to fit via %)
  // Shared geometry so renderSnake and activateSnake can never drift apart.
  // Boustrophedon: each row reverses direction, so consecutive steps are
  // always horizontally adjacent (same row) or vertically adjacent (same
  // column) — every connector is a clean straight segment, edge to edge.
  function snakeLayout(spec) {
    const COLS = spec.cols || 2;
    const boxW = 82, boxH = 38, rowGap = 124, firstTop = 196;
    const wizX = SNAKE_W / 2, wizCY = 100, wizH = 50;
    const colX = COLS === 2 ? [92, 228]
      : Array.from({ length: COLS }, (_, c) => (SNAKE_W / (COLS + 1)) * (c + 1));
    const steps = spec.steps.map((s, i) => {
      const row = Math.floor(i / COLS);
      const inRow = i % COLS;
      const col = row % 2 === 0 ? inRow : COLS - 1 - inRow;
      const x = colX[col];
      const top = firstTop + row * rowGap;
      return { ...s, i, row, col, x, top, cy: top + boxH / 2 };
    });
    const rows = Math.ceil(steps.length / COLS);
    const stageH = firstTop + (rows - 1) * rowGap + boxH + 28;
    return { COLS, boxW, boxH, wizX, wizCY, wizH, steps, stageH };
  }

  function renderSnake(spec) {
    const id = `snake-${diagramSeq++}`;
    registry[id] = spec;
    const { boxW, boxH, wizX, wizCY, wizH, steps, stageH } = snakeLayout(spec);
    const pctX = (x) => `${((x / SNAKE_W) * 100).toFixed(3)}%`;

    let edges = "";
    for (let i = 0; i < steps.length - 1; i++) {
      const a = steps[i], b = steps[i + 1];
      if (a.row === b.row) {
        const x1 = a.x + (b.x > a.x ? boxW / 2 : -boxW / 2);
        const x2 = b.x + (b.x > a.x ? -boxW / 2 : boxW / 2);
        edges += `<line x1="${x1}" y1="${a.cy}" x2="${x2}" y2="${a.cy}" class="snake-edge" marker-end="url(#sk-arrow-${id})"/>`;
      } else {
        edges += `<line x1="${a.x}" y1="${a.cy + boxH / 2}" x2="${a.x}" y2="${b.cy - boxH / 2}" class="snake-edge" marker-end="url(#sk-arrow-${id})"/>`;
      }
    }

    // Wizard (the user-facing agent) hands the query down to the first
    // station; the finished answer loops back up the left gutter to it.
    const first = steps[0], last = steps[steps.length - 1];
    const midY = (wizCY + wizH / 2 + first.top) / 2;
    const intro = `<path d="M ${wizX} ${wizCY + wizH / 2} L ${wizX} ${midY} L ${first.x} ${midY} L ${first.x} ${first.top}" class="snake-edge" fill="none" marker-end="url(#sk-arrow-${id})"/>`;
    const gx = 12;
    const ret = `<path d="M ${last.x - boxW / 2} ${last.cy} L ${gx + 8} ${last.cy} Q ${gx} ${last.cy} ${gx} ${last.cy - 8} L ${gx} ${wizCY + 8} Q ${gx} ${wizCY} ${gx + 8} ${wizCY} L ${wizX - wizH / 2 - 2} ${wizCY}" class="snake-return" id="${id}-return" fill="none" marker-end="url(#sk-arrow-gold-${id})"/>`;

    const boxesHtml = steps
      .map(
        (s) => `<div class="snake-box" id="${id}-box-${s.i}" style="left:${pctX(s.x)};top:${s.top}px;width:${boxW}px">
          ${s.glyph ? `<div class="snake-box__glyph">${s.glyph}</div>` : ""}
          <div class="snake-box__label">${s.label}</div>
        </div>`
      )
      .join("");

    return `<div class="diagram snake-flow" id="${id}" data-diagram-type="snake">
      <div class="snake-stage" style="height:${stageH}px">
        <svg class="snake-svg" viewBox="0 0 ${SNAKE_W} ${stageH}" height="${stageH}" preserveAspectRatio="none">
          <defs>
            <marker id="sk-arrow-${id}" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--line-bright)"/></marker>
            <marker id="sk-arrow-gold-${id}" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--amber)"/></marker>
          </defs>
          ${ret}${intro}${edges}
        </svg>
        ${boxesHtml}
        <div class="snake-wizard" id="${id}-wizard" style="left:${pctX(wizX)};top:${wizCY}px">
          <div class="snake-bubble snake-bubble--wizard" id="${id}-wizbubble"></div>
          <div class="snake-wizard__art">${Pixel.markup("wizard", wizH)}</div>
        </div>
        <div class="snake-actor" id="${id}-actor">
          <div class="snake-bubble" id="${id}-bubble"></div>
          <div class="snake-actor__art">${Pixel.markup("red", 32)}</div>
        </div>
      </div>
    </div>`;
  }

  function activateSnake(root) {
    root.querySelectorAll('[data-diagram-type="snake"]').forEach((diagramEl) => {
      const id = diagramEl.id;
      const spec = registry[id];
      if (!spec || spec.__started || typeof Pixel === "undefined") return;
      spec.__started = true;

      const { boxW, wizX, wizCY, wizH, steps } = snakeLayout(spec);
      const actor = document.getElementById(`${id}-actor`);
      const bubble = document.getElementById(`${id}-bubble`);
      const wizBubble = document.getElementById(`${id}-wizbubble`);
      const returnEl = document.getElementById(`${id}-return`);
      const wait = (ms) => new Promise((r) => window.setTimeout(r, ms));
      const pct = (x) => `${((x / SNAKE_W) * 100).toFixed(3)}%`;

      // Stand beside the box on its inner side (toward centre), level with its
      // top edge — clear of every connector, near enough to the centre that
      // the thinking bubble reads without clipping the stage.
      const standAt = (s) => ({ x: s.x + (s.col === 0 ? 1 : -1) * (boxW / 2 + 17), y: s.top - 2 });
      // Beside the wizard (not on top of it) when handing off the query/answer,
      // and clear of the return path that arrives on the wizard's left.
      const wizStand = { x: wizX + wizH / 2 + 22, y: wizCY };
      let cur = wizStand;

      // Walk time scales with distance so a long vertical drop takes longer
      // than a short nudge — constant, natural pace rather than a fixed snap.
      const moveDur = (a, b) => Math.max(560, Math.min(1400, Math.hypot(b.x - a.x, b.y - a.y) * 8.5));
      function moveTo(c, instant) {
        const dur = instant ? 0 : moveDur(cur, c);
        if (instant) {
          actor.style.transition = "none";
        } else {
          actor.style.transition = "";
          actor.style.transitionDuration = `${dur}ms`;
        }
        actor.style.left = pct(c.x);
        actor.style.top = `${c.y}px`;
        if (instant) { void actor.offsetWidth; actor.style.transition = ""; }
        cur = c;
        return dur;
      }
      const show = (el, text) => { el.textContent = text || ""; el.classList.add("is-visible"); };
      const hide = (el) => el.classList.remove("is-visible");
      const box = (i) => document.getElementById(`${id}-box-${i}`);

      moveTo(wizStand, true);

      async function cycle() {
        // 1. The wizard (user-facing agent) receives the query.
        show(wizBubble, `"${spec.task}"`);
        await wait(2800);
        hide(wizBubble);
        // 2. The courier walks the pipeline, narrating each stage in its bubble.
        for (let i = 0; i < steps.length; i++) {
          hide(bubble);
          actor.classList.add("is-walking");
          const dur = moveTo(standAt(steps[i]), false);
          await wait(dur + 90);
          actor.classList.remove("is-walking");
          const b = box(i);
          if (b) b.classList.add("is-active");
          show(bubble, steps[i].say);
          const say = steps[i].say || "";
          await wait(Math.min(4000, 1800 + say.length * 20)); // slow, readable
          if (b) { b.classList.remove("is-active"); b.classList.add("is-done"); }
        }
        // 3. The finished answer is carried back to the wizard.
        hide(bubble);
        if (returnEl) returnEl.classList.add("is-live");
        actor.classList.add("is-walking", "is-carrying");
        const backDur = moveTo(wizStand, false);
        await wait(backDur + 120);
        actor.classList.remove("is-walking");
        show(wizBubble, spec.answer || "Grounded, cited answer delivered.");
        await wait(3200);
        actor.classList.remove("is-carrying");
        if (returnEl) returnEl.classList.remove("is-live");
        hide(wizBubble);
        // 4. Reset for the next loop.
        await wait(500);
        steps.forEach((_, i) => { const b = box(i); if (b) b.classList.remove("is-done", "is-active"); });
        moveTo(wizStand, true);
        await wait(400);
      }

      (async function loop() { for (;;) await cycle(); })();
    });
  }

  function activateDiagrams(root) {
    activateBars(root);
    activateAttention(root);
    activateEmbed(root);
    activatePipelineFlow(root);
    activateStackFlow(root);
    activateCompareFlow(root);
    activateTrainLoop(root);
    activatePersona(root);
    activateReward(root);
    activateRadar(root);
    activateCrew(root);
    activateSnake(root);
    activateScene(root);
    if (typeof Pixel !== "undefined") Pixel.activateScenes(root);
  }

  // Renders every diagram a chapter defines — `diagram`, then `diagram2`,
  // `diagram3`, ... for as many as are present. Content isn't capped at a
  // fixed number of slots, so a concept can carry as many figures as it needs.
  function renderDiagramSet(chapter, opts) {
    const gap = (opts && opts.gap) || "var(--sp-4)";
    const out = [];
    for (let i = 1; i <= 12; i++) {
      const spec = chapter[i === 1 ? "diagram" : `diagram${i}`];
      if (!spec) continue;
      if (out.length) out.push(`<div style="height:${gap}"></div>`);
      out.push(renderDiagram(spec, opts));
    }
    return out.join("");
  }

  function renderFormulas(math) {
    if (!math || !math.length) return "";
    return `<div class="formula-list">
      ${math
        .map(
          (m) => `<div class="formula-block">
            <div class="formula-block__expr">${m.expr}</div>
            <div class="formula-block__note">${m.note}</div>
          </div>`
        )
        .join("")}
    </div>`;
  }

  function xpPct(xp) {
    return Progress.levelProgress(xp).pct;
  }

  function buildStatusBar({ homeHref = "index.html", toggle = null } = {}) {
    const state = Progress.getState();
    const lvl = Progress.levelProgress(state.xp);
    const toggleHtml = toggle
      ? `<div class="mode-toggle">
          <a href="${toggle.mode === "quest" ? "#" : toggle.mapHref}" class="${toggle.mode === "quest" ? "is-active" : ""}">Quest</a>
          <a href="${toggle.mode === "revise" ? "#" : toggle.reviseHref}" class="${toggle.mode === "revise" ? "is-active" : ""}">Revise</a>
        </div>`
      : "";
    return `
      <div class="statusbar">
        <a class="statusbar__brand" href="${homeHref}">
          <svg class="statusbar__brand-mark" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7l9 5 9-5-9-5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          <span class="statusbar__brand-text"><span class="statusbar__brand-text--soft">Knowledge</span> Harness</span>
        </a>
        <div class="statusbar__streak" title="Day streak"><span class="statusbar__streak-icon">🔥</span> ${state.streak}</div>
        <div class="xp-bar" title="Level ${lvl.level}">
          <div class="xp-bar__track"><div class="xp-bar__fill" style="--xp-pct:${lvl.pct}%"></div></div>
          <div class="xp-bar__label">Lv.${lvl.level}</div>
        </div>
        ${toggleHtml}
        ${typeof Theme !== "undefined" ? Theme.markup() : ""}
      </div>`;
  }

  document.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".btn, .map-controls button, .q-option, .mode-toggle a");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    el.classList.add("ripple-host");
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });

  return { renderDiagram, renderDiagramSet, renderFormulas, activateBars, activateAttention, activateEmbed, activateDiagrams, buildStatusBar, xpPct };
})();
