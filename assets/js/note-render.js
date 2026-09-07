/* ============================================================
   NoteRender — renders one written note.

   Replaces the old QuestRender. What changed and why:

   The XP economy is gone — no points, no levels, no streaks, no
   badges, no locked next node. Those exist to make a stranger
   come back tomorrow. This is one person's own library, and being
   awarded 90 points by yourself for reading your own notes is
   theatre.

   The quiz stays, because checking whether you actually absorbed
   something is a real reason to re-read a note. It just no longer
   pays out; it tells you which parts to go back to.

   The mascot stays too. It reacts to answers, which is the one
   place a companion has something to say.
   ============================================================ */

const NoteRender = (() => {
  const SECTION = {
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

  function remember(id) {
    try {
      localStorage.setItem("booklet-last", id);
      const seen = JSON.parse(localStorage.getItem("booklet-seen") || "{}");
      seen[id] = new Date().toISOString().slice(0, 10);
      localStorage.setItem("booklet-seen", JSON.stringify(seen));
    } catch (e) {
      /* private mode — the page still reads fine, it just won't be
         remembered on the home screen */
    }
  }

  function mount() {
    const L = window.Library;
    const note = L.byId(window.CHAPTER_ID);
    if (!note) return;

    const siblings = L.notesIn(note.module);
    const i = siblings.findIndex((n) => n.id === note.id);
    const prev = i > 0 ? siblings[i - 1] : null;
    const next = i < siblings.length - 1 ? siblings[i + 1] : null;

    Particles.mount(12);
    astro = Pixel.mountCompanion();
    Shell.mount({ active: "browse", prefix: "../" });

    /* The section/prose/diagram classes are kept exactly as they were.
       `.prose` is only ever styled as a descendant of `.quest-section`
       in quest.css, so renaming the wrapper would silently strip the
       typography off every note in the library. New markup gets new
       names; anything the old stylesheet already dresses keeps its. */
    const root = document.getElementById("quest-root");
    root.innerHTML = `
      <article class="note wrap wrap--narrow">
        <header class="note-head">
          <div class="crumb">
            <a href="../index.html">Shelf</a><span>/</span>
            <a href="../track.html?id=${encodeURIComponent(note.track)}">${esc(note.trackTitle)}</a><span>/</span>
            <a href="../browse.html?module=${encodeURIComponent(note.module)}">${esc(note.moduleTitle)}</a>
          </div>
          <span class="page-head__eyebrow">Note ${String(note.n).padStart(2, "0")}</span>
          <h1 class="note-head__title">${esc(note.title)}</h1>
          <p class="note-head__short">${esc(note.short || "")}</p>
          <div class="note-head__tags">
            ${(note.topics || []).map((t) => `<a class="chip" href="../browse.html?topic=${t}">${esc(L.topicLabel(t))}</a>`).join("")}
          </div>
        </header>

        <section class="quest-section" data-section>
          <div class="quest-section__label"><span class="quest-section__icon">${SECTION.concept}</span><span class="eyebrow">The concept</span></div>
          ${note.plain ? `<div class="plain-note"><span class="plain-note__tag">In plain terms</span><div class="prose">${note.plain}</div></div>` : ""}
          <div class="prose">${note.hook}${note.explain}</div>
        </section>

        <section class="quest-section" data-section>
          <div class="quest-section__label"><span class="quest-section__icon">${SECTION.diagram}</span><span class="eyebrow">Visualise it</span></div>
          ${App.renderDiagramSet(note)}
        </section>

        ${note.math ? `<section class="quest-section" data-section>
          <div class="quest-section__label"><span class="quest-section__icon">${SECTION.math}</span><span class="eyebrow">The maths</span></div>
          ${App.renderFormulas(note.math)}
        </section>` : ""}

        <section class="quest-section" data-section>
          <div class="quest-section__label"><span class="quest-section__icon">${SECTION.analogy}</span><span class="eyebrow">The intuition</span></div>
          <div class="quest-analogy prose">${note.analogy}</div>
        </section>

        <section class="quest-section" data-section>
          <div class="quest-section__label"><span class="quest-section__icon">${SECTION.example}</span><span class="eyebrow">In practice</span></div>
          <div class="quest-example prose">${note.example}</div>
        </section>

        <section class="quest-section" data-section>
          <div class="quest-section__label"><span class="quest-section__icon">${SECTION.takeaways}</span><span class="eyebrow">Worth keeping</span></div>
          <ul class="quest-takeaways">
            ${note.takeaways.map((t, k) => `<li><span class="quest-takeaways__mark">${k + 1}</span><span>${t}</span></li>`).join("")}
          </ul>
        </section>

        <section class="challenge" data-section id="check">
          <div class="challenge__intro">
            <span class="eyebrow">${SECTION.challenge} Self-check</span>
            <h2>Did it land?</h2>
            <p>${note.quiz.length} questions. Nothing is scored or saved — a wrong answer just points at the part worth re-reading.</p>
          </div>
          <div id="quiz-list"></div>
          <div class="challenge__result" id="check-result" hidden></div>
        </section>

        <nav class="note-nav">
          ${prev ? `<a class="note-nav__link" href="${fileFor(prev)}"><span class="note-nav__dir">← Previous</span><span class="note-nav__name">${esc(prev.title)}</span></a>` : `<span></span>`}
          ${next ? `<a class="note-nav__link note-nav__link--next" href="${fileFor(next)}"><span class="note-nav__dir">Next →</span><span class="note-nav__name">${esc(next.title)}</span></a>` : `<span></span>`}
        </nav>
      </article>`;

    renderQuiz(note);
    revealOnScroll();
    remember(note.id);

    document.getElementById("foot").innerHTML = Shell.foot({ prefix: "../" });
  }

  /* sibling notes live in the same folder, so only the file name changes */
  function fileFor(note) {
    return `ch-${String(note.n).padStart(2, "0")}.html`;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function renderQuiz(note) {
    const list = document.getElementById("quiz-list");
    const answers = new Array(note.quiz.length).fill(null);

    note.quiz.forEach((q, qi) => {
      const card = document.createElement("div");
      card.className = "q-card";
      card.innerHTML = `
        <div class="q-card__prompt">${qi + 1}. ${q.q}</div>
        <div class="q-card__options">
          ${q.options.map((opt, oi) => `<button class="q-option" type="button" data-oi="${oi}">${opt}</button>`).join("")}
        </div>
        <div class="q-card__explain">${q.explain}</div>`;
      list.appendChild(card);

      card.querySelectorAll(".q-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          const oi = Number(btn.dataset.oi);
          card.querySelectorAll(".q-option").forEach((b) => (b.disabled = true));

          if (oi === q.answer) {
            btn.classList.add("is-correct");
            Pixel.react(astro, "happy", { speech: pick(["Nice.", "Exactly.", "That's it.", "Yes."]) });
          } else {
            btn.classList.add("is-wrong");
            card.querySelector(`[data-oi="${q.answer}"]`).classList.add("is-correct");
            Pixel.react(astro, "sad", { speech: pick(["Check the highlight", "Not quite", "Read the note below"]) });
          }

          card.querySelector(".q-card__explain").classList.add("is-visible");
          answers[qi] = oi === q.answer;
          if (answers.every((a) => a !== null)) finish(note, answers);
        });
      });
    });
  }

  function finish(note, answers) {
    const correct = answers.filter(Boolean).length;
    const total = answers.length;
    const box = document.getElementById("check-result");

    /* No pass mark and no reward. The result is a reading
       instruction: everything right means move on, anything wrong
       means the note is worth another pass. */
    const missed = answers.map((ok, i) => (ok ? null : i + 1)).filter(Boolean);

    box.hidden = false;
    box.innerHTML = `
      <div class="challenge__result-score">${correct} / ${total}</div>
      <p>${
        missed.length === 0
          ? "All of it landed. Worth coming back to in a month to see if it stuck."
          : `Question${missed.length > 1 ? "s" : ""} ${missed.join(", ")} slipped — the explanation under each is the bit to re-read.`
      }</p>
      <div class="challenge__actions">
        <button class="btn-quiet" type="button" id="again">Try again</button>
        <a class="btn-plate" href="../browse.html?module=${encodeURIComponent(note.module)}">Back to ${esc(note.moduleTitle)}</a>
      </div>`;

    document.getElementById("again").addEventListener("click", () => location.reload());
    box.scrollIntoView({ behavior: "smooth", block: "center" });

    if (missed.length === 0) {
      Confetti.burstFromEl(box.querySelector(".challenge__result-score"), { count: 22 });
      Pixel.react(astro, "happy", { speech: "Clean sweep" });
    }
  }

  function revealOnScroll() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          App.activateDiagrams(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-section]").forEach((s) => io.observe(s));
  }

  return { mount };
})();
