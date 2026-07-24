/* ============================================================
   Asteroid field — small drifting rock decorations for the map
   scenes, giving the astronaut/rocket something to fly past.
   ============================================================ */

const Asteroids = (() => {
  function markup(seed) {
    // A handful of irregular rock silhouettes, picked by seed.
    const shapes = [
      "polygon(20% 0%, 80% 5%, 100% 40%, 90% 85%, 55% 100%, 15% 90%, 0% 55%)",
      "polygon(30% 0%, 75% 10%, 100% 45%, 80% 90%, 40% 100%, 5% 70%, 0% 30%)",
      "polygon(10% 15%, 60% 0%, 100% 30%, 95% 70%, 60% 100%, 20% 95%, 0% 55%)",
    ];
    return shapes[seed % shapes.length];
  }

  function mount(count = 5) {
    const field = document.createElement("div");
    field.className = "asteroid-field";
    field.setAttribute("aria-hidden", "true");
    for (let i = 0; i < count; i++) {
      const a = document.createElement("span");
      a.className = "asteroid";
      const size = 14 + Math.random() * 22;
      const top = Math.random() * 90;
      const dur = 50 + Math.random() * 55;
      const delay = -Math.random() * dur;
      const spin = 20 + Math.random() * 30;
      const spinDir = i % 2 === 0 ? "normal" : "reverse";
      a.style.width = `${size}px`;
      a.style.height = `${size}px`;
      a.style.top = `${top}%`;
      a.style.clipPath = markup(i);
      a.style.animationDuration = `${dur}s, ${spin}s`;
      a.style.animationDelay = `${delay}s, ${delay}s`;
      a.style.animationDirection = `normal, ${spinDir}`;
      field.appendChild(a);
    }
    document.body.appendChild(field);
  }

  return { mount };
})();
