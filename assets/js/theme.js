/* ============================================================
   Theme — light "parchment" vs dark "candlelight".
   The attribute itself is written to <html> by a tiny inline
   script in each page head, before first paint, so there is no
   flash of the wrong theme. This module only handles the toggle
   and persistence afterwards.
   ============================================================ */

const Theme = (() => {
  const KEY = "kh-theme";

  function current() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function apply(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    // Keep the browser/OS chrome (address bar, task switcher) in step.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "dark" ? "#16120c" : "#e9dcbe");
    const btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", String(mode === "dark"));
      btn.setAttribute("aria-label", mode === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function toggle() {
    const next = current() === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem(KEY, next);
    } catch (e) {
      /* private mode — the choice just won't survive a reload */
    }
    apply(next);
  }

  function markup() {
    return `<button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to dark theme" title="Switch theme">
      <span class="theme-toggle__sun" aria-hidden="true">☾</span>
      <span class="theme-toggle__moon" aria-hidden="true">☀</span>
    </button>`;
  }

  // Delegated so it works no matter when the status bar is injected.
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-theme-toggle]")) toggle();
  });
  document.addEventListener("DOMContentLoaded", () => apply(current()));

  return { current, apply, toggle, markup };
})();
