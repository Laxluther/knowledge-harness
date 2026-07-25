/* ============================================================
   QuestRender — renders one gamified chapter (quest) page from
   the shared content data, handles the challenge quiz + XP flow.
   ============================================================ */

const QuestRender = (() => {
  const SECTION_ICONS = {
    concept: "◆",
    diagram: "▦",
    math: "∑",
    analogy: "◈",
    example: "▶",
    takeaways: "✓",
    challenge: "⚡",
  };

  let astro = null;

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function mount() {
    const part = window.PART_DATA;
    const chapter = part.chapters.find((c) => c.id === window.CHAPTER_ID);
    const chapterMap = Object.fromEntries(part.chapters.map((c) => [c.id, c]));

    Particles.mount(16);
    astro = Astronaut.mountCompanion();
    document.body.insertAdjacentHTML("afterbegin", `<div class="grid-backdrop"></div>`);
    document.body.insertAdjacentHTML(
      "afterbegin",
      App.buildStatusBar({
        homeHref: "../index.html",
        toggle: { mapHref: "map.html", reviseHref: "revise.html", mode: "quest" },
      })
    );

    const root = document.getElementById("quest-root");
    root.innerHTML = `
      <header class="quest-hero container">
        <div class="quest-hero__crumb enter-up" style="animation-delay:0ms">
          <a href="map.html">${part.title}</a><span>/</span><span>Chapter ${chapter.n}</span>
        </div>
        <div class="quest-hero__num eyebrow enter-up" style="animation-delay:60ms">CHAPTER ${String(chapter.n).padStart(2, "0")}</div>
        <h1 class="enter-up" style="animation-delay:120ms">${chapter.title}</h1>
        <p class="quest-hero__short enter-up" style="animation-delay:200ms">${chapter.short}</p>
        <div class="quest-hero__meta enter-up" style="animation-delay:280ms">
          <span class="badge badge--amber">⚡ ${chapter.xp} XP</span>
          <span class="badge" id="status-badge">In progress</span>
        </div>
      </header>

      <section class="quest-section container" data-section>
        <div class="quest-section__label"><span class="quest-section__icon" style="font-size:1.1rem">${SECTION_ICONS.concept}</span><span class="eyebrow">The Concept</span></div>
        <div class="prose">${chapter.hook}${chapter.explain}</div>
      </section>

      <section class="quest-section container" data-section>
        <div class="quest-section__label"><span class="quest-section__icon" style="font-size:1.1rem">${SECTION_ICONS.diagram}</span><span class="eyebrow">Visualize It</span></div>
        ${App.renderDiagram(chapter.diagram)}
        ${chapter.diagram2 ? `<div style="height:var(--sp-4)"></div>${App.renderDiagram(chapter.diagram2)}` : ""}
        ${chapter.diagram3 ? `<div style="height:var(--sp-4)"></div>${App.renderDiagram(chapter.diagram3)}` : ""}
      </section>

      ${chapter.math ? `<section class="quest-section container" data-section>
        <div class="quest-section__label"><span class="quest-section__icon" style="font-size:1.1rem">${SECTION_ICONS.math}</span><span class="eyebrow">The Math</span></div>
        ${App.renderFormulas(chapter.math)}
      </section>` : ""}

      <section class="quest-section container" data-section>
        <div class="quest-section__label"><span class="quest-section__icon" style="font-size:1.1rem">${SECTION_ICONS.analogy}</span><span class="eyebrow">The Intuition</span></div>
        <div class="quest-analogy prose">${chapter.analogy}</div>
      </section>

      <section class="quest-section container" data-section>
        <div class="quest-section__label"><span class="quest-section__icon" style="font-size:1.1rem">${SECTION_ICONS.example}</span><span class="eyebrow">In Practice</span></div>
        <div class="quest-example prose">${chapter.example}</div>
      </section>

      <section class="quest-section container" data-section>
        <div class="quest-section__label"><span class="quest-section__icon" style="font-size:1.1rem">${SECTION_ICONS.takeaways}</span><span class="eyebrow">Key Takeaways</span></div>
        <ul class="quest-takeaways">
          ${chapter.takeaways.map((t, i) => `<li><span class="quest-takeaways__mark">${i + 1}</span><span>${t}</span></li>`).join("")}
        </ul>
      </section>

      <section class="challenge container" data-section id="challenge-section">
        <div class="challenge__intro">
          <span class="eyebrow">${SECTION_ICONS.challenge} Challenge</span>
          <h2>Prove it to unlock the next node</h2>
          <p>Answer all ${chapter.quiz.length} questions. XP is awarded once, the first time you clear it.</p>
        </div>
        <div id="quiz-list"></div>
        <div class="challenge__result" id="challenge-result" style="display:none">
          <div class="challenge__result-score" id="result-score"></div>
          <p id="result-msg"></p>
          <div class="challenge__actions" id="result-actions"></div>
        </div>
      </section>
    `;

    if (Progress.isCompleted(chapter.id)) {
      document.getElementById("status-badge").textContent = "✓ Mastered";
      document.getElementById("status-badge").classList.add("badge--amber");
    }

    renderQuiz(chapter, part, chapterMap);
    setupRevealObserver();
  }

  function renderQuiz(chapter, part, chapterMap) {
    const list = document.getElementById("quiz-list");
    const answers = new Array(chapter.quiz.length).fill(null);

    chapter.quiz.forEach((q, qi) => {
      const card = document.createElement("div");
      card.className = "q-card";
      card.innerHTML = `
        <div class="q-card__prompt">${qi + 1}. ${q.q}</div>
        <div class="q-card__options">
          ${q.options
            .map((opt, oi) => `<button class="q-option" data-oi="${oi}">${opt}</button>`)
            .join("")}
        </div>
        <div class="q-card__explain">${q.explain}</div>
      `;
      list.appendChild(card);

      card.querySelectorAll(".q-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          const oi = Number(btn.dataset.oi);
          card.querySelectorAll(".q-option").forEach((b) => (b.disabled = true));
          if (oi === q.answer) {
            btn.classList.add("is-correct");
            Astronaut.react(astro, "happy", { speech: pick(["Nice!", "Exactly.", "Correct!", "Yes!"]) });
          } else {
            btn.classList.add("is-wrong");
            card.querySelector(`[data-oi="${q.answer}"]`).classList.add("is-correct");
            Astronaut.react(astro, "sad", { speech: pick(["Close — check the highlight", "Not quite", "Read the note below"]) });
          }
          card.querySelector(".q-card__explain").classList.add("is-visible");
          answers[qi] = oi === q.answer;
          if (answers.every((a) => a !== null)) finishQuiz(chapter, part, chapterMap, answers);
        });
      });
    });
  }

  function finishQuiz(chapter, part, chapterMap, answers) {
    const correct = answers.filter(Boolean).length;
    const total = answers.length;
    const pct = Math.round((correct / total) * 100);

    const resultBox = document.getElementById("challenge-result");
    const scoreEl = document.getElementById("result-score");
    const msgEl = document.getElementById("result-msg");
    const actionsEl = document.getElementById("result-actions");

    scoreEl.textContent = `${correct} / ${total} correct`;
    resultBox.style.display = "block";
    resultBox.classList.add("enter-up");
    resultBox.scrollIntoView({ behavior: "smooth", block: "center" });

    const passed = pct >= 75;

    if (passed) {
      const { alreadyCompleted, xp, streak } = Progress.completeChapter(chapter.id, chapter.xp);
      msgEl.textContent = alreadyCompleted
        ? "Already mastered — nice review."
        : "Chapter cleared. The next node on the map just lit up.";

      if (!alreadyCompleted) {
        window.setTimeout(() => Confetti.burstFromEl(scoreEl), 150);
        Astronaut.react(astro, "happy", { speech: "Chapter cleared!" });
        Toast.xp(chapter.xp, chapter.title);
        const wasFirst = Object.values(chapterMap).filter((c) => Progress.isCompleted(c.id)).length === 1;
        if (wasFirst && Progress.awardBadge(part.badges.first.id)) {
          window.setTimeout(() => {
            Toast.badge(part.badges.first.label);
            Confetti.burstFromEl(document.querySelector(".xp-bar"), { count: 30 });
          }, 900);
        }
        const allDone = part.chapters.every((c) => Progress.isCompleted(c.id));
        if (allDone && Progress.awardBadge(part.badges.complete.id)) {
          window.setTimeout(() => {
            Toast.badge(part.badges.complete.label);
            Confetti.burstFromEl(document.querySelector(".xp-bar"), { count: 40 });
          }, 1600);
        }
        const lvlBefore = Progress.levelFromXp(xp - chapter.xp);
        const lvlAfter = Progress.levelFromXp(xp);
        if (lvlAfter > lvlBefore) {
          window.setTimeout(() => {
            Toast.levelUp(lvlAfter);
            Confetti.burstFromEl(document.querySelector(".xp-bar"), { count: 30 });
          }, 2300);
        }
        refreshStatusBar();
      }
    } else {
      msgEl.textContent = "Under 75% — scroll up, re-read the concept, and try again.";
      actionsEl.innerHTML = `<button class="btn btn--ghost" onclick="location.reload()">Retry challenge</button>`;
      Astronaut.react(astro, "sad", { speech: "So close — try again" });
      return;
    }

    const children = part.edges.filter(([f]) => f === chapter.id).map(([, t]) => t);
    let nextHtml = `<a class="btn btn--ghost" href="map.html">Back to map</a>`;
    if (children.length === 1) {
      const nextCh = chapterMap[children[0]];
      nextHtml = `<a class="btn btn--ghost" href="map.html">Map</a><a class="btn btn--primary" href="ch-${String(nextCh.n).padStart(2, "0")}.html">Next: ${nextCh.title} →</a>`;
    } else if (children.length > 1) {
      nextHtml = `<a class="btn btn--primary" href="map.html">Choose your next path →</a>`;
    }
    actionsEl.innerHTML = nextHtml;
  }

  function refreshStatusBar() {
    const state = Progress.getState();
    const lvl = Progress.levelProgress(state.xp);
    const fill = document.querySelector(".xp-bar__fill");
    const label = document.querySelector(".xp-bar__label");
    if (fill) fill.style.setProperty("--xp-pct", `${lvl.pct}%`);
    if (label) label.textContent = `Lv.${lvl.level}`;
    const streakEl = document.querySelector(".statusbar__streak");
    if (streakEl) streakEl.innerHTML = `<span class="statusbar__streak-icon">🔥</span> ${state.streak}`;
  }

  function setupRevealObserver() {
    const sections = document.querySelectorAll("[data-section]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            App.activateDiagrams(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => io.observe(s));
  }

  return { mount };
})();
