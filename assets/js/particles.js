/* ============================================================
   Ambient particle field — drifting signal sparks in the
   background. Purely decorative, mounted once per page.
   ============================================================ */

const Particles = (() => {
  function mount(count = 22) {
    const field = document.createElement("div");
    field.className = "particle-field";
    field.setAttribute("aria-hidden", "true");
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle" + (i % 3 === 0 ? " particle--amber" : "");
      const left = Math.random() * 100;
      const size = 2 + Math.random() * 3;
      const dur = 14 + Math.random() * 18;
      const delay = -Math.random() * dur;
      const drift = (Math.random() * 70 - 35).toFixed(0);
      p.style.left = `${left}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.animationDuration = `${dur}s`;
      p.style.animationDelay = `${delay}s`;
      p.style.setProperty("--drift", `${drift}px`);
      field.appendChild(p);
    }
    document.body.appendChild(field);
  }

  return { mount };
})();
