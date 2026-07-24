/* ============================================================
   Astronaut mascot — mounts a small SVG companion, either
   floating on the map at the current node or pinned to the
   corner of a quest page, with reaction states.
   ============================================================ */

const Astronaut = (() => {
  function markup() {
    return `
      <svg class="astro-svg" viewBox="0 0 100 128" width="100" height="128">
        <ellipse class="astro-shadow" cx="50" cy="120" rx="20" ry="5"></ellipse>
        <g class="astro-body-group">
          <path class="astro-flame" d="M40 106 Q50 126 60 106 Q50 116 40 106 Z"></path>
          <rect class="astro-leg astro-leg-left" x="33" y="88" width="13" height="20" rx="6"></rect>
          <rect class="astro-leg astro-leg-right" x="54" y="88" width="13" height="20" rx="6"></rect>
          <rect class="astro-pack" x="29" y="52" width="12" height="32" rx="4"></rect>
          <circle class="astro-pack-light" cx="35" cy="61" r="2"></circle>
          <g class="astro-arm astro-arm-left"><rect x="16" y="56" width="12" height="27" rx="6"></rect></g>
          <rect class="astro-body" x="25" y="50" width="50" height="44" rx="18"></rect>
          <rect class="astro-badge" x="43" y="66" width="14" height="10" rx="2"></rect>
          <g class="astro-arm astro-arm-right"><rect x="72" y="56" width="12" height="27" rx="6"></rect></g>
          <rect class="astro-antenna" x="48" y="0" width="4" height="12" rx="2"></rect>
          <circle class="astro-antenna-tip" cx="50" cy="2" r="3.4"></circle>
          <circle class="astro-helmet" cx="50" cy="33" r="27"></circle>
          <path class="astro-visor" d="M25 33 a25 25 0 0 1 50 0 a25 27 0 0 1 -50 0 Z"></path>
          <path class="astro-visor-shine" d="M31 23 Q40 15 50 17"></path>
        </g>
      </svg>`;
  }

  function create(variant) {
    const el = document.createElement("div");
    el.className = `astro astro--${variant}`;
    el.innerHTML = markup() + (variant === "companion" ? `<div class="astro-speech" data-speech></div>` : "");
    return el;
  }

  function react(el, mood, { speech } = {}) {
    el.classList.remove("is-happy", "is-sad");
    void el.offsetWidth;
    if (mood) el.classList.add(`is-${mood}`);
    const bubble = el.querySelector("[data-speech]");
    if (bubble && speech) {
      bubble.textContent = speech;
      bubble.classList.add("is-visible");
      window.clearTimeout(bubble._hideTimer);
      bubble._hideTimer = window.setTimeout(() => bubble.classList.remove("is-visible"), 2600);
    }
  }

  function mountOnMap(container, x, y, { side = 1 } = {}) {
    const el = create("map");
    el.style.left = `${x + side * 76}px`;
    el.style.top = `${y - 14}px`;
    container.appendChild(el);
    return el;
  }

  function mountCompanion() {
    const el = create("companion");
    document.body.appendChild(el);
    window.setTimeout(() => react(el, null, { speech: "Let's learn something." }), 900);
    return el;
  }

  return { mountOnMap, mountCompanion, react, markup };
})();
