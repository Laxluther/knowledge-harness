/* ============================================================
   Content integrity — pure Node, no browser, runs in ~1s.
   This is the gate the article agent must pass before pushing:
   it catches malformed content data long before a browser would.
   ============================================================ */
import fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];
const fail = (m) => issues.push(m);

function loadPart(n) {
  const src = fs.readFileSync(join(ROOT, "content", `part-${n}.js`), "utf8");
  const w = {};
  new Function("window", src)(w);
  return w.PART_DATA;
}

/* ---- 1. every part parses and is structurally sound ---- */
let chapters = 0;
let questions = 0;
const answerDist = { 0: 0, 1: 0, 2: 0, 3: 0 };

for (let p = 1; p <= 7; p++) {
  let d;
  try {
    d = loadPart(p);
  } catch (e) {
    fail(`part-${p}: failed to parse — ${e.message}`);
    continue;
  }
  if (!d || !Array.isArray(d.chapters)) {
    fail(`part-${p}: missing PART_DATA.chapters`);
    continue;
  }

  const ids = new Set(d.chapters.map((c) => c.id));
  for (const [a, b] of d.edges || []) {
    if (!ids.has(a)) fail(`part-${p}: edge references unknown chapter "${a}"`);
    if (!ids.has(b)) fail(`part-${p}: edge references unknown chapter "${b}"`);
  }

  for (const c of d.chapters) {
    chapters++;
    for (const k of ["hook", "explain", "analogy", "example", "takeaways", "plain", "quiz", "diagram"]) {
      if (!c[k]) fail(`${c.id}: missing "${k}"`);
    }
    for (const r of c.requires || []) {
      if (!ids.has(r)) fail(`${c.id}: requires unknown chapter "${r}"`);
    }

    // prose must have balanced inline tags, or the page renders broken
    for (const k of ["hook", "explain", "analogy", "example", "plain"]) {
      const s = c[k] || "";
      const open = (s.match(/<(p|strong|em|code|ul|li)\b/g) || []).length;
      const close = (s.match(/<\/(p|strong|em|code|ul|li)>/g) || []).length;
      if (open !== close) fail(`${c.id}.${k}: unbalanced tags (${open} open / ${close} close)`);
    }

    for (const [i, q] of (c.quiz || []).entries()) {
      questions++;
      if (!Array.isArray(q.options) || q.options.length < 2) fail(`${c.id} q${i}: needs at least 2 options`);
      if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) {
        fail(`${c.id} q${i}: answer index ${q.answer} out of range`);
      } else {
        answerDist[q.answer] = (answerDist[q.answer] || 0) + 1;
      }
      if (new Set(q.options).size !== q.options.length) fail(`${c.id} q${i}: duplicate options`);
      if (!q.explain) fail(`${c.id} q${i}: missing explain`);
    }
  }

  // SVG marker ids must be unique per part — revise.html renders every
  // chapter on one page, so a collision there silently breaks arrowheads.
  const src = fs.readFileSync(join(ROOT, "content", `part-${p}.js`), "utf8");
  const markers = [...src.matchAll(/<marker id="([^"]+)"/g)].map((m) => m[1]);
  const dupes = [...new Set(markers.filter((v, i) => markers.indexOf(v) !== i))];
  if (dupes.length) fail(`part-${p}: duplicate SVG marker ids — ${dupes.join(", ")}`);
}

/* ---- 2. quiz answers must not cluster in one position ---- */
if (questions) {
  const worst = Math.max(...Object.values(answerDist));
  const share = worst / questions;
  if (share > 0.45) {
    fail(`quiz answers cluster in one position (${Math.round(share * 100)}% — should be near 25%). Re-shuffle.`);
  }
}

/* ---- 3. the articles feed, if present, must be well formed ---- */
const articlesPath = join(ROOT, "content", "articles.js");
if (fs.existsSync(articlesPath)) {
  const w = {};
  try {
    new Function("window", fs.readFileSync(articlesPath, "utf8"))(w);
    const list = w.ARTICLES || [];
    if (!Array.isArray(list)) fail("articles.js: ARTICLES is not an array");
    const seen = new Set();
    for (const [i, a] of list.entries()) {
      for (const k of ["title", "url", "source", "date"]) {
        if (!a[k]) fail(`articles[${i}]: missing "${k}"`);
      }
      if (a.url && !/^https?:\/\//.test(a.url)) fail(`articles[${i}]: url is not absolute — ${a.url}`);
      if (a.url && seen.has(a.url)) fail(`articles[${i}]: duplicate url — ${a.url}`);
      seen.add(a.url);
      if (a.date && isNaN(new Date(a.date))) fail(`articles[${i}]: unparseable date — ${a.date}`);
    }
    console.log(`  articles feed: ${list.length} items, all well formed`);
  } catch (e) {
    fail(`articles.js: failed to parse — ${e.message}`);
  }
}

/* ---- report ---- */
console.log(`  parsed ${chapters} chapters, ${questions} quiz questions`);
console.log(`  answer spread: ${JSON.stringify(answerDist)}`);
if (issues.length) {
  console.error(`\nCONTENT: ${issues.length} issue(s)\n` + issues.map((i) => "  ✕ " + i).join("\n"));
  process.exit(1);
}
console.log("CONTENT: OK");
