/* ============================================================
   Toast notification engine — in-app achievement popups.
   ============================================================ */

const Toast = (() => {
  function root() {
    let el = document.getElementById("toast-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast-root";
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    return el;
  }

  function show({ type = "xp", icon = "⚡", title, desc, duration = 3200 }) {
    const r = root();
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.innerHTML = `
      <div class="toast__icon">${icon}</div>
      <div>
        <div class="toast__title">${title}</div>
        ${desc ? `<div class="toast__desc">${desc}</div>` : ""}
      </div>
    `;
    r.appendChild(el);
    window.setTimeout(() => {
      el.classList.add("is-leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, duration);
  }

  function xp(amount, desc) {
    show({ type: "xp", icon: "⚡", title: `+${amount} XP`, desc });
  }

  function badge(label) {
    show({ type: "badge", icon: "🏆", title: "Badge unlocked", desc: label, duration: 4000 });
  }

  function levelUp(level) {
    show({ type: "badge", icon: "✨", title: `Level ${level}`, desc: "New tier reached", duration: 4000 });
  }

  function streak(n) {
    show({ type: "xp", icon: "🔥", title: `${n}-day streak`, desc: "Keep it going" });
  }

  return { show, xp, badge, levelUp, streak };
})();
