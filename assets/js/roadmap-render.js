/* ============================================================
   RoadmapRender — one track as a single shape.

   Deliberately not force-directed. A force layout says "these
   things are related"; a track is a *sequence* — foundations
   before retrieval before orchestration — and a physics sim would
   scramble the one fact the reader most needs. So modules run in
   a boustrophedon: left to right, drop a row, right to left.
   Reading order is the layout.

   Each module carries a distinct silhouette so it stays
   identifiable at a glance and in the sidebar. Its notes radiate
   as satellites on the side facing away from the spine, and its
   label sits on the side facing the spine, so the two never
   collide no matter which row it is on.

   No lock state, no completion gates. This is a map of what
   exists, not a track you have to earn your way along.
   ============================================================ */

const RoadmapRender = (() => {
  const W = 1000;
  const COL_W = 232;
  const ROW_H = 300;
  const TOP = 150;

  const SHAPES = ["square", "diamond", "circle", "pentagon", "hexagon", "triangle", "star"];

  function shapePath(kind, r) {
    const poly = (n, rot = -Math.PI / 2) =>
      Array.from({ length: n }, (_, i) => {
        const a = rot + (i * 2 * Math.PI) / n;
        return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
      }).join(" ");

    switch (kind) {
      case "square":
        return `<rect x="${-r * 0.86}" y="${-r * 0.86}" width="${r * 1.72}" height="${r * 1.72}" />`;
      case "diamond":
        return `<polygon points="${poly(4, 0)}" />`;
      case "circle":
        return `<circle r="${r}" />`;
      case "pentagon":
        return `<polygon points="${poly(5)}" />`;
      case "hexagon":
        return `<polygon points="${poly(6, 0)}" />`;
      case "triangle":
        return `<polygon points="${poly(3)}" />`;
      case "star": {
        const pts = [];
        for (let i = 0; i < 12; i++) {
          const rad = i % 2 === 0 ? r : r * 0.5;
          const a = -Math.PI / 2 + (i * Math.PI) / 6;
          pts.push(`${(Math.cos(a) * rad).toFixed(2)},${(Math.sin(a) * rad).toFixed(2)}`);
        }
        return `<polygon points="${pts.join(" ")}" />`;
      }
      default:
        return `<circle r="${r}" />`;
    }
  }

  /* Boustrophedon placement. Rows of at most four, because past
     that the columns get too narrow for a two-line module title. */
  function layout(count) {
    const perRow = Math.min(4, Math.max(1, count));
    const rows = Math.ceil(count / perRow);
    const marginX = (W - (perRow - 1) * COL_W) / 2;

    return Array.from({ length: count }, (_, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      // every other row runs backwards, so the path never jumps
      const c = row % 2 === 0 ? col : perRow - 1 - col;
      return {
        x: marginX + c * COL_W,
        y: TOP + row * ROW_H,
        // satellites fan away from the middle of the row band
        outward: row % 2 === 0 ? -1 : 1,
        row,
      };
    });
  }

  function satellites(hub, count, r) {
    const shown = Math.min(count, 14);
    const radius = r + 34;
    const spread = Math.min(170, 30 + shown * 12);
    const centre = hub.outward < 0 ? -90 : 90; // degrees: up or down
    const start = centre - spread / 2;

    return Array.from({ length: shown }, (_, i) => {
      const t = shown === 1 ? 0.5 : i / (shown - 1);
      const a = ((start + t * spread) * Math.PI) / 180;
      return { x: hub.x + Math.cos(a) * radius, y: hub.y + Math.sin(a) * radius };
    });
  }

  function init({ container, modules, notesFor, prefix = "" }) {
    const pts = layout(modules.length);
    const rows = Math.ceil(modules.length / Math.min(4, Math.max(1, modules.length)));
    // room below the last row for its satellites and caption, no more
    const H = TOP + (rows - 1) * ROW_H + 135;

    const hubs = modules.map((m, i) => Object.assign({}, pts[i], { mod: m, shape: SHAPES[i % SHAPES.length] }));

    const spine = hubs
      .slice(0, -1)
      .map((h, i) => {
        const n = hubs[i + 1];
        return `<path class="rm-spine" d="M${h.x},${h.y} L${n.x},${n.y}" />`;
      })
      .join("");

    let sats = "";
    let marks = "";

    hubs.forEach((h) => {
      const mine = notesFor(h.mod.id);
      const accent = h.mod.accent;
      const r = 19 + Math.min(mine.length, 14) * 1.1;
      const pos = satellites(h, mine.length, r);

      mine.slice(0, pos.length).forEach((note, i) => {
        const p = pos[i];
        const planned = note.status === "planned";
        sats +=
          `<line class="rm-tether" x1="${h.x}" y1="${h.y}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" />` +
          `<a class="rm-sat${planned ? " is-planned" : ""}"${note.href ? ` href="${prefix}${note.href}"` : ""}
              data-title="${String(note.title).replace(/"/g, "&quot;")}"${planned ? ' data-planned="1"' : ""}>` +
          `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5.5" style="fill:${planned ? "none" : accent};stroke:${accent}" />` +
          `<circle class="rm-sat__hit" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="13" />` +
          `</a>`;
      });

      /* The label goes on the spine side, opposite the satellites.
         On the previous version everything sat below the hub and the
         bottom row's dots landed straight on its own caption. */
      const labelY = h.outward < 0 ? h.y + r + 24 : h.y - r - 30;

      marks += `
        <a class="rm-hub" href="${prefix}browse.html?module=${encodeURIComponent(h.mod.id)}">
          <g transform="translate(${h.x},${h.y})" style="color:${accent}">
            ${shapePath(h.shape, r)}
          </g>
          <text class="rm-hub__n" x="${h.x}" y="${h.y + 4}">${String(h.mod.n).padStart(2, "0")}</text>
          <text class="rm-hub__label" x="${h.x}" y="${labelY}">${escapeXml(h.mod.title)}</text>
          <text class="rm-hub__count" x="${h.x}" y="${labelY + 15}">${mine.length} note${mine.length === 1 ? "" : "s"}</text>
        </a>`;
    });

    container.innerHTML = `
      <svg class="rm" viewBox="0 0 ${W} ${H}" role="img"
           aria-label="${modules.length} modules laid out in reading order">
        <g class="rm-edges">${spine}${sats}</g>
        <g class="rm-nodes">${marks}</g>
      </svg>
      <div class="rm-tip" id="rm-tip" hidden></div>`;

    wireTips(container);
  }

  function escapeXml(s) {
    return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  /* A track can hold a hundred notes; a hundred labels on one canvas
     is unreadable, so a note names itself only when pointed at. */
  function wireTips(container) {
    const tip = container.querySelector("#rm-tip");
    if (!tip) return;

    const show = (el) => {
      tip.textContent = el.dataset.title + (el.dataset.planned ? " · not written yet" : "");
      tip.hidden = false;
      const box = container.getBoundingClientRect();
      const dot = el.getBoundingClientRect();
      tip.style.left = `${dot.left - box.left + dot.width / 2}px`;
      tip.style.top = `${dot.top - box.top - 8}px`;
    };
    const hide = () => { tip.hidden = true; };

    container.querySelectorAll(".rm-sat").forEach((el) => {
      el.addEventListener("mouseenter", () => show(el));
      el.addEventListener("mouseleave", hide);
      el.addEventListener("focus", () => show(el));
      el.addEventListener("blur", hide);
    });
  }

  return { init, SHAPES, shapePath };
})();
