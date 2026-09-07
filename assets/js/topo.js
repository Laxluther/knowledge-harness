/* ============================================================
   Topo — force-directed concept graph.

   A small velocity-Verlet layout, written out rather than pulled
   in, because the whole job is ~300 nodes and ~400 edges and a
   graph library would be an order of magnitude more code than the
   simulation it is hiding.

   The layout is settled up front over a fixed number of ticks and
   then drawn once. A permanently running simulation looks alive
   but makes the map unreadable — you can never point at the same
   thing twice. Dragging re-settles locally instead.
   ============================================================ */

const Topo = (() => {
  const W = 1000;
  const H = 720;

  function simulate(nodes, edges, { ticks = 420 } = {}) {
    const index = Object.fromEntries(nodes.map((n, i) => [n.id, i]));

    // deterministic start: same graph, same picture, every reload.
    // A random seed means the map you learned yesterday is gone today.
    nodes.forEach((n, i) => {
      const a = (i / nodes.length) * Math.PI * 2;
      const r = 120 + ((i * 37) % 190);
      n.x = W / 2 + Math.cos(a) * r;
      n.y = H / 2 + Math.sin(a) * r;
      n.vx = 0;
      n.vy = 0;
    });

    const links = edges
      .map((e) => ({ s: index[e.source], t: index[e.target], w: e.weight }))
      .filter((l) => l.s != null && l.t != null);

    /* The graph has several disconnected components. They feel no
       spring toward each other, only repulsion, so a weak centering
       force lets a small cluster drift to the edge — and because the
       whole cloud is then scaled to fit, one stray group shrinks
       everything else into an unreadable band. Gravity is therefore
       strong relative to repulsion: components stay in one frame. */
    const REPEL = 520;
    const SPRING = 0.02;
    const REST = 58;
    const CENTRE = 0.006;
    const DAMP = 0.85;
    const MAX_STEP = 14; // no single tick may fling a node across the canvas

    for (let tick = 0; tick < ticks; tick++) {
      // cooling: big moves early, fine adjustment late
      const heat = 1 - tick / ticks;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) { d2 = 1; dx = (i - j) * 0.1 || 0.1; dy = 0.1; }
          const f = REPEL / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        }
      }

      for (const l of links) {
        const a = nodes[l.s];
        const b = nodes[l.t];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        // a heavier shared-topic overlap pulls harder
        const f = (d - REST) * SPRING * Math.min(l.w, 4);
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }

      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * CENTRE;
        n.vy += (H / 2 - n.y) * CENTRE;
        n.vx *= DAMP;
        n.vy *= DAMP;

        let dx = n.vx * heat;
        let dy = n.vy * heat;
        const step = Math.hypot(dx, dy);
        if (step > MAX_STEP) {
          dx = (dx / step) * MAX_STEP;
          dy = (dy / step) * MAX_STEP;
        }
        n.x += dx;
        n.y += dy;
      }
    }

    // Fit the settled cloud to the frame. Scale is uniform so the
    // shape is not distorted, which means one axis has slack left
    // over — that slack is split evenly rather than all landing at
    // the bottom, or the graph sits in a corner of its own box.
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const pad = 40;
    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    const s = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);
    const offX = (W - spanX * s) / 2;
    const offY = (H - spanY * s) / 2;

    nodes.forEach((n) => {
      n.x = offX + (n.x - minX) * s;
      n.y = offY + (n.y - minY) * s;
    });

    return { nodes, links };
  }

  return { simulate, W, H };
})();
