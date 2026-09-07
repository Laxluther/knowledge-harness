/* ============================================================
   Shell — chrome builders shared by every library page.

   Pure string builders plus one enhancer. Nothing here owns
   state; pages pass in what they need and mount the result.
   ============================================================ */

const Shell = (() => {
  const NAV = [
    { id: "home", label: "Library", href: "index.html" },
    { id: "browse", label: "Browse", href: "browse.html" },
    { id: "roadmap", label: "Roadmap", href: "roadmap.html" },
    { id: "map", label: "Topography", href: "topography.html" },
    { id: "decoder", label: "Decoder", href: "decoder.html" },
    { id: "labs", label: "Labs", href: "labs.html" },
  ];

  /* A track owns a hue; its modules inherit it, and stay separable
     from each other by number and silhouette instead. Two accents
     live outside the module palette: `ion` is the house crimson,
     used by the one track that is actually written, and `amber` is
     the gilt reserved for imported pages. */
  function hue(name) {
    if (name === "ion" || name === "amber") return `var(--${name})`;
    return `var(--m-${name || "moon"})`;
  }

  const ACCENTS = ["--m-ember", "--m-ice", "--m-terra", "--m-verdant", "--m-violet", "--m-moon", "--m-lava"];

  function accentFor(n) {
    return `var(${ACCENTS[(Number(n) - 1) % ACCENTS.length]})`;
  }

  /* ---- the stacked-page shadow -------------------------------
     One hard shadow per note, stepped diagonally. No blur, so the
     edges stay crisp when the browser zooms. Capped at 12 because
     past that the stack stops reading as a stack and starts
     reading as a smear — the count in the footer carries the
     exact number anyway. */
  function edgeShadow(count) {
    const layers = [];
    const visible = Math.min(count, 12);
    // Alternating paper / line per step, so the eye reads discrete
    // sheets. A single repeated colour just smears into a drop
    // shadow and the count stops being legible.
    for (let i = 1; i <= visible; i++) {
      const c = i % 2 === 0 ? "var(--panel-raised)" : "var(--edge)";
      layers.push(`${i * 3}px ${i * 3}px 0 -1px ${c}`);
    }
    return layers.join(", ");
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ---- nav ---- */
  function nav({ active = "", prefix = "" } = {}) {
    const links = NAV.map(
      (l) =>
        `<a class="shell-nav__link" href="${prefix}${l.href}"${l.id === active ? ' aria-current="page"' : ""}>${l.label}</a>`
    ).join("");

    return `
      <nav class="shell-nav">
        <a class="shell-nav__brand" href="${prefix}index.html">
          <img class="shell-nav__sigil" src="${prefix}assets/sprites/wizard.png" alt="" />
          <span>booklet</span>
        </a>
        <div class="shell-nav__links">${links}</div>
        <div class="shell-nav__aside">
          <button class="chip" type="button" data-theme-toggle aria-label="Switch theme">Theme</button>
        </div>
      </nav>`;
  }

  /* ---- deck card ---------------------------------------------
     One builder for both levels of the hierarchy. `depth` is what
     the stack thickness encodes, and it changes meaning by level:
     a track is as thick as it has modules, a module is as thick as
     it has notes. Both answer the same question — how much is in
     here — at the right scale for what you are looking at. */
  function deckCard({ n, title, tagline, href, accent, depth, foot, index = 0 }) {
    // A hair of lean per card, so a row looks set down by hand rather
    // than laid out by a grid. Deterministic, so it never reshuffles
    // between reloads. Kept under a degree: past that it stops reading
    // as "placed" and starts reading as "broken".
    const tilt = [-0.7, 0.4, -0.3, 0.6, -0.55, 0.25, -0.4][index % 7];

    return `
      <a class="deck-card deal" href="${href}"
         style="--accent:${accent}; --edges:${edgeShadow(depth)}; --tilt:${tilt}deg; animation-delay:${index * 55}ms">
        <span class="deck-card__spine"></span>
        <div class="deck-card__n">${n == null ? "" : String(n).padStart(2, "0")}</div>
        <div class="deck-card__title">${esc(title)}</div>
        <div class="deck-card__tagline">${esc(tagline || "")}</div>
        <div class="deck-card__foot">
          <span>${foot}</span>
          <span aria-hidden="true">→</span>
        </div>
      </a>`;
  }

  function trackCard(track, index = 0, prefix = "") {
    const mods = track.modules.length || 1;
    // one line, always: "7 modules · 41 written" or "14 modules · 74 notes"
    const foot = track.written ? `${mods} modules · ${track.written} written` : `${mods} modules · ${track.count} notes`;

    return deckCard({
      n: null,
      title: track.title,
      tagline: track.tagline,
      href: `${prefix}track.html?id=${encodeURIComponent(track.id)}`,
      accent: hue(track.hue),
      depth: Math.max(mods, 1),
      foot,
      index,
    });
  }

  function moduleCard(mod, index = 0, prefix = "") {
    return deckCard({
      n: mod.n,
      title: mod.title,
      tagline: mod.tagline,
      href: `${prefix}browse.html?module=${encodeURIComponent(mod.id)}`,
      accent: hue(mod.hue),
      depth: mod.count,
      foot: `${mod.count} note${mod.count === 1 ? "" : "s"}`,
      index,
    });
  }

  /* ---- note card ----------------------------------------------
     A planned note is shown, not hidden. Knowing a subject is on
     the list but unwritten is useful; discovering later that it
     was silently missing is not. It renders as a card you cannot
     click, because there is nothing behind it yet. */
  function noteCard(note, { prefix = "" } = {}) {
    const accent = hue(note.hue);
    const tags = (note.topics || [])
      .slice(0, 3)
      .map((t) => `<span class="tag">${esc(window.Library.topicLabel(t))}</span>`)
      .join("");

    const where = note.moduleTitle
      ? `${esc(note.moduleTitle)} · ${String(note.n).padStart(2, "0")}`
      : "Unfiled";

    const body = `
      <span class="note-card__rule"></span>
      <span class="note-card__meta">${where}</span>
      <span class="note-card__title">${esc(note.title)}</span>
      ${note.short ? `<span class="note-card__short">${esc(note.short)}</span>` : `<span class="note-card__short"></span>`}
      <span class="note-card__tags">${tags}${
        note.status === "planned" ? `<span class="note-card__flag">Not written yet</span>` : ""
      }</span>`;

    return note.status === "planned"
      ? `<div class="note-card is-planned" style="--accent:${accent}">${body}</div>`
      : `<a class="note-card" href="${prefix}${note.href}" style="--accent:${accent}">${body}</a>`;
  }

  /* ---- footer ---- */
  function foot({ prefix = "" } = {}) {
    const c = window.Library.counts;
    return `
      <footer class="shell-foot wrap">
        <span>${c.tracks} tracks · ${c.modules} modules · ${c.notes} notes · ${c.written} written</span>
        <span>Kept by <a href="${prefix}index.html">Sanidhya Rana</a></span>
      </footer>`;
  }

  /* ---- mount ----
     Theme wiring is not done here: theme.js already listens for
     [data-theme-toggle] on the document, so adding a second
     handler would toggle twice per click and land back where it
     started. */
  function mount({ active = "", prefix = "" } = {}) {
    document.body.insertAdjacentHTML("afterbegin", `<div class="grid-backdrop"></div>` + nav({ active, prefix }));
  }

  return { nav, deckCard, trackCard, moduleCard, noteCard, foot, mount, hue, accentFor, edgeShadow, esc, NAV };
})();
