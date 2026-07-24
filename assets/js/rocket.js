/* ============================================================
   Rocket mascot — the astronaut's parked ride, sits on the
   opposite side of the current map node.
   ============================================================ */

const Rocket = (() => {
  function markup() {
    return `
      <svg class="rocket-svg" viewBox="0 0 60 112" width="60" height="112">
        <ellipse class="rocket-shadow" cx="30" cy="104" rx="15" ry="4"></ellipse>
        <g class="rocket-body-group">
          <path class="rocket-flame" d="M20 84 Q30 104 40 84 Q30 94 20 84 Z"></path>
          <path class="rocket-fin rocket-fin-left" d="M18 60 L2 82 L18 76 Z"></path>
          <path class="rocket-fin rocket-fin-right" d="M42 60 L58 82 L42 76 Z"></path>
          <path class="rocket-hull" d="M30 4 C44 4 46 42 46 58 C46 74 39 84 30 84 C21 84 14 74 14 58 C14 42 16 4 30 4 Z"></path>
          <circle class="rocket-window" cx="30" cy="40" r="8.5"></circle>
          <circle class="rocket-window-inner" cx="30" cy="40" r="4"></circle>
          <path class="rocket-stripe" d="M15 56 L45 56"></path>
        </g>
      </svg>`;
  }

  function mountOnMap(container, x, y, { side = -1 } = {}) {
    const el = document.createElement("div");
    el.className = "rocket rocket--map";
    el.style.left = `${x + side * 76}px`;
    el.style.top = `${y - 10}px`;
    el.innerHTML = markup();
    container.appendChild(el);
    return el;
  }

  return { mountOnMap };
})();
