/* ============================================================
   Shared app utilities: diagram renderer + status bar builder.
   Used by both gamified quest pages and the Simple revise page.
   ============================================================ */

const App = (() => {
  let diagramSeq = 0;
  const registry = {};

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
      default:
        return "";
    }
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
      <div class="diagram-bars__label" id="${id}-caption">Random initialization — before training</div>
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
        if (caption) caption.textContent = "Random initialization — before training";
      }

      function trained() {
        pts.forEach((el, i) => {
          const p = spec.points[i];
          el.style.left = `${p.x}%`;
          el.style.top = `${p.y}%`;
        });
        if (caption) caption.textContent = "After training — similar meaning ends up as nearby vectors";
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
      <div class="rw-climb-label">P(policy picks the safer response) over training <span id="${id}-stepnum">— step 1</span></div>
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
        stepLabel.textContent = `— step ${i + 1}: ${spec.steps[i]}%`;
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

  /* ---- Part V: crew mascots acting out an orchestration pattern ---- */
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
    const tierGap = 118;
    // Kept in sync with .crew-stage's max-width in quest.css — this is the
    // coordinate system nodes are positioned in, so a mismatch leaves nodes
    // spilling past the actual rendered box on narrow viewports.
    const stageW = 400;
    const positions = {};
    tierKeys.forEach((t, ti) => {
      const row = tiers[t];
      const gapX = stageW / (row.length + 1);
      row.forEach((n, i) => {
        positions[n.id] = { x: gapX * (i + 1), y: 54 + ti * tierGap };
      });
    });
    const stageH = 54 + (tierKeys.length - 1) * tierGap + 70;

    const edgesSvg = spec.flow
      .map((f) => {
        const a = positions[f.from];
        const b = positions[f.to];
        return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="crew-edge" />`;
      })
      .join("");

    const nodesHtml = spec.nodes
      .map((n) => {
        const p = positions[n.id];
        if (n.role === "board") {
          return `<div class="crew-board" id="${id}-${n.id}" style="left:${p.x}px;top:${p.y}px">
            <div class="crew-board__icon">▤</div>
            <div class="crew-node__label">${n.label}</div>
          </div>`;
        }
        return `<div class="crew-mascot${n.role === "captain" ? " is-captain" : ""}" id="${id}-${n.id}" style="left:${p.x}px;top:${p.y}px">
          ${Astronaut.markup()}
          <div class="crew-node__label">${n.label}</div>
        </div>`;
      })
      .join("");

    return `<div class="diagram" id="${id}" data-diagram-type="crew">
      <div class="crew-task">Task → <span>"${spec.task}"</span></div>
      <div class="crew-stage" style="height:${stageH}px">
        <svg class="crew-svg" width="${stageW}" height="${stageH}">${edgesSvg}</svg>
        ${nodesHtml}
        <div class="crew-packet" id="${id}-packet"></div>
      </div>
      <div class="crew-status" id="${id}-status">${(spec.statusSteps && spec.statusSteps[0]) || ""}</div>
    </div>`;
  }

  function activateCrew(root) {
    root.querySelectorAll('[data-diagram-type="crew"]').forEach((diagramEl) => {
      const id = diagramEl.id;
      const spec = registry[id];
      if (!spec || spec.__started || typeof Astronaut === "undefined") return;
      spec.__started = true;

      const stage = diagramEl.querySelector(".crew-stage");
      const packet = document.getElementById(`${id}-packet`);
      const statusEl = document.getElementById(`${id}-status`);
      const nodeEl = (nid) => document.getElementById(`${id}-${nid}`);
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

      let stepI = 0;
      function status() {
        if (statusEl && spec.statusSteps && spec.statusSteps.length) {
          statusEl.textContent = spec.statusSteps[stepI % spec.statusSteps.length];
          stepI++;
        }
      }

      async function runFlow(reverse) {
        const hops = reverse ? [...spec.flow].map((f) => ({ from: f.to, to: f.from })).reverse() : spec.flow;
        if (spec.parallel) {
          hops.forEach((f) => bounce(nodeEl(f.to)));
          status();
          await wait(900);
        } else {
          for (const f of hops) {
            const a = centerOf(nodeEl(f.from));
            const b = centerOf(nodeEl(f.to));
            packet.style.transition = "none";
            packet.style.opacity = "1";
            packet.style.left = `${a.x}px`;
            packet.style.top = `${a.y}px`;
            void packet.offsetWidth;
            packet.style.transition = "";
            packet.style.left = `${b.x}px`;
            packet.style.top = `${b.y}px`;
            await wait(540);
            bounce(nodeEl(f.to));
            status();
            packet.style.opacity = "0";
            await wait(280);
          }
        }
      }

      async function cycle() {
        await runFlow(false);
        if (spec.roundTrip) {
          await wait(260);
          await runFlow(true);
        }
        bounce(nodeEl(spec.nodes[0].id));
        await wait(1900);
      }

      (async function loop() {
        for (;;) {
          await cycle();
        }
      })();
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

  return { renderDiagram, renderFormulas, activateBars, activateAttention, activateEmbed, activateDiagrams, buildStatusBar, xpPct };
})();
