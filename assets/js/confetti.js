/* ============================================================
   Confetti — a short-lived burst of spark particles for
   celebratory moments (level up, badge unlock).
   ============================================================ */

const Confetti = (() => {
  function burst(x, y, { count = 22, colors = ["ion", "amber"] } = {}) {
    const root = document.createElement("div");
    root.className = "confetti-root";
    root.style.left = `${x}px`;
    root.style.top = `${y}px`;
    document.body.appendChild(root);

    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      const color = colors[i % colors.length];
      s.className = `confetti-piece confetti-piece--${color}`;
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
      const dist = 60 + Math.random() * 90;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 30;
      const rot = Math.random() * 360;
      s.style.setProperty("--dx", `${dx}px`);
      s.style.setProperty("--dy", `${dy}px`);
      s.style.setProperty("--rot", `${rot}deg`);
      s.style.animationDelay = `${Math.random() * 80}ms`;
      root.appendChild(s);
    }

    window.setTimeout(() => root.remove(), 1400);
  }

  function burstFromEl(el, opts) {
    if (!el) return burst(window.innerWidth / 2, window.innerHeight / 3, opts);
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, opts);
  }

  return { burst, burstFromEl };
})();
