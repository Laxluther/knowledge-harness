/* ============================================================
   MapRenderer — pannable / zoomable branching node-link graph.
   Powers both the master map (Parts) and per-Part chapter maps.
   ============================================================ */

const MapRenderer = (() => {
  function init({ container, viewBox, nodes, edges, alwaysClickable = false, focusId = null }) {
    const [, , vbW, vbH] = viewBox.split(" ").map(Number);

    container.innerHTML = "";
    const canvas = document.createElement("div");
    canvas.className = "map-canvas";
    canvas.style.width = `${vbW}px`;
    canvas.style.height = `${vbH}px`;
    container.appendChild(canvas);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", vbW);
    svg.setAttribute("height", vbH);
    svg.setAttribute("viewBox", viewBox);
    canvas.appendChild(svg);

    const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

    edges.forEach(([fromId, toId], edgeIndex) => {
      const a = nodeById[fromId];
      const b = nodeById[toId];
      if (!a || !b) return;
      const midY = (a.y + b.y) / 2;
      const d = `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;

      const state = alwaysClickable
        ? edgeStateAlways(a, b)
        : edgeState(a, b);

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      path.setAttribute("class", `edge-path ${state === "complete" ? "is-complete" : state === "active" ? "is-active" : ""}`);
      svg.appendChild(path);

      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      window.setTimeout(() => {
        path.style.strokeDashoffset = "0";
      }, 60 + edgeIndex * 110);

      if (state === "active") {
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("r", "5");
        dot.setAttribute("class", "edge-pulse");
        const anim = document.createElementNS(svgNS, "animateMotion");
        anim.setAttribute("dur", "2.4s");
        anim.setAttribute("repeatCount", "indefinite");
        anim.setAttribute("path", d);
        dot.appendChild(anim);
        svg.appendChild(dot);
      }
    });

    nodes.forEach((n, nodeIndex) => {
      const el = document.createElement(n.state === "locked" && !alwaysClickable ? "div" : "a");
      const clickable = alwaysClickable || n.state !== "locked";
      if (clickable) el.setAttribute("href", n.href);
      el.className = `map-node ${n.isRegion ? "region-node" : ""} is-${n.state}`;
      el.style.left = `${n.x}px`;
      el.style.top = `${n.y}px`;
      el.style.animationDelay = `${nodeIndex * 70}ms`;

      const marker =
        n.state === "completed"
          ? `<span class="map-node__check">✓</span>`
          : n.state === "locked" && !alwaysClickable
          ? `<span class="map-node__lock">🔒</span>`
          : "";

      const spinClass = nodeIndex % 2 === 1 ? " spin-reverse" : "";
      const spinDelay = -(nodeIndex * 11) % 64;
      const planetAttr = n.variant ? ` data-planet="${n.variant}"` : "";

      el.innerHTML = `
        <div class="map-node__chip${spinClass}"${planetAttr}>
          <div class="map-node__surface" style="animation-delay:${spinDelay}s"></div>
          <div class="map-node__shade"></div>
          <span class="map-node__glyph">${n.icon || (n.n ?? "")}</span>
        </div>
        <div class="map-node__ring"></div>
        ${marker}
        <div class="map-node__label">${n.title}</div>
      `;

      if (!clickable) {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          Toast.show({ type: "xp", icon: "🔒", title: "Locked", desc: n.lockMsg || "Complete the connected chapter first" });
          el.animate(
            [{ transform: "translate(-50%,-50%) rotate(0deg)" }, { transform: "translate(-50%,-50%) rotate(-3deg)" }, { transform: "translate(-50%,-50%) rotate(3deg)" }, { transform: "translate(-50%,-50%) rotate(0deg)" }],
            { duration: 260 }
          );
        });
      }

      canvas.appendChild(el);
    });

    const focusNode = focusId ? nodeById[focusId] : null;
    if (focusNode && typeof Pixel !== "undefined") {
      Pixel.mountOnMap(canvas, focusNode.x, focusNode.y);
    } else if (focusNode && typeof Astronaut !== "undefined") {
      Astronaut.mountOnMap(canvas, focusNode.x, focusNode.y, { side: 1 });
    }
    setupPanZoom(container, canvas, vbW, vbH, nodes, focusNode);
  }

  function edgeState(a, b) {
    if (a.state === "completed" && b.state === "completed") return "complete";
    if (a.state === "completed" && b.state !== "locked") return "active";
    return "locked";
  }

  function edgeStateAlways(a, b) {
    if (a.state === "completed" && b.state === "completed") return "complete";
    if (a.state === "completed" || a.state === "unlocked") return "active";
    return "locked";
  }

  function setupPanZoom(viewport, canvas, vbW, vbH, nodes, focusNode) {
    let scale = 1;
    let tx = 0;
    let ty = 0;
    const pointers = new Map();
    let lastMid = null;
    let lastDist = null;
    let dragging = false;

    function apply() {
      canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }

    function fitToContent(animate = false) {
      const rect = viewport.getBoundingClientRect();
      const xs = nodes.map((n) => n.x);
      const ys = nodes.map((n) => n.y);
      const minX = Math.min(...xs) - 100;
      const maxX = Math.max(...xs) + 100;
      const minY = Math.min(...ys) - 100;
      const maxY = Math.max(...ys) + 140;
      const w = maxX - minX;
      const h = maxY - minY;
      const s = Math.min(rect.width / w, rect.height / h, 1);
      scale = Math.max(0.35, Math.min(s, 1.1));
      tx = rect.width / 2 - ((minX + maxX) / 2) * scale;
      ty = rect.height / 2 - ((minY + maxY) / 2) * scale - rect.height * 0.06;
      if (animate) {
        canvas.style.transition = `transform ${480}ms cubic-bezier(0.16,1,0.3,1)`;
        requestAnimationFrame(apply);
        window.setTimeout(() => (canvas.style.transition = ""), 500);
      } else {
        apply();
      }
    }

    function zoomAt(mx, my, newScale) {
      newScale = Math.max(0.35, Math.min(newScale, 2.2));
      const px = (mx - tx) / scale;
      const py = (my - ty) / scale;
      scale = newScale;
      tx = mx - px * scale;
      ty = my - py * scale;
      apply();
    }

    viewport.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".map-node") || e.target.closest(".map-controls")) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      viewport.setPointerCapture(e.pointerId);
      dragging = true;
      viewport.classList.add("is-dragging");
    });

    viewport.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 1 && dragging) {
        const pts = [...pointers.values()];
        const prev = lastMid || pts[0];
        const dx = pts[0].x - prev.x;
        const dy = pts[0].y - prev.y;
        tx += dx;
        ty += dy;
        lastMid = pts[0];
        apply();
      } else if (pointers.size === 2) {
        const pts = [...pointers.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        const rect = viewport.getBoundingClientRect();
        if (lastDist) {
          const ratio = dist / lastDist;
          zoomAt(mid.x - rect.left, mid.y - rect.top, scale * ratio);
        }
        lastDist = dist;
        lastMid = mid;
      }
    });

    function endPointer(e) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) lastDist = null;
      if (pointers.size === 0) {
        dragging = false;
        lastMid = null;
        viewport.classList.remove("is-dragging");
      } else if (pointers.size === 1) {
        lastMid = [...pointers.values()][0];
      }
    }
    viewport.addEventListener("pointerup", endPointer);
    viewport.addEventListener("pointercancel", endPointer);
    viewport.addEventListener("pointerleave", endPointer);

    viewport.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        const delta = -e.deltaY * 0.0016;
        zoomAt(e.clientX - rect.left, e.clientY - rect.top, scale * (1 + delta));
      },
      { passive: false }
    );

    const controls = document.createElement("div");
    controls.className = "map-controls";
    controls.innerHTML = `
      <button data-act="in" aria-label="Zoom in">+</button>
      <button data-act="out" aria-label="Zoom out">−</button>
      <button data-act="center" aria-label="Center map">⌖</button>
    `;
    viewport.appendChild(controls);
    controls.addEventListener("click", (e) => {
      const act = e.target.closest("button")?.dataset.act;
      const rect = viewport.getBoundingClientRect();
      if (act === "in") zoomAt(rect.width / 2, rect.height / 2, scale * 1.25);
      if (act === "out") zoomAt(rect.width / 2, rect.height / 2, scale * 0.8);
      if (act === "center") (focusNode ? focusOn(focusNode, 0.85, true) : fitToContent(true));
    });

    function focusOn(node, targetScale = 0.85, animate = false) {
      const rect = viewport.getBoundingClientRect();
      scale = targetScale;
      tx = rect.width / 2 - node.x * scale;
      ty = rect.height * 0.38 - node.y * scale;
      if (animate) {
        canvas.style.transition = `transform 480ms cubic-bezier(0.16,1,0.3,1)`;
        requestAnimationFrame(apply);
        window.setTimeout(() => (canvas.style.transition = ""), 500);
      } else {
        apply();
      }
    }

    window.setTimeout(() => (focusNode ? focusOn(focusNode) : fitToContent(false)), 0);
    window.addEventListener("resize", () => (focusNode ? focusOn(focusNode) : fitToContent(false)));
  }

  return { init };
})();
