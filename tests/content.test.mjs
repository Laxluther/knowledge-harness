/* ============================================================
   Content integrity — pure Node, no browser, runs in ~1s.
   The gate anything writing content has to pass: it catches
   malformed data long before a browser would.
   ============================================================ */
import fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];
const fail = (m) => issues.push(m);

/* Load the real files into one shared window, exactly as a page does,
   so the test exercises the same build path the site uses. */
const w = {};
function load(rel) {
  new Function("window", fs.readFileSync(join(ROOT, rel), "utf8"))(w);
}

for (let p = 1; p <= 7; p++) {
  try {
    load(`content/part-${p}.js`);
  } catch (e) {
    fail(`part-${p}: failed to parse — ${e.message}`);
  }
}
for (const f of ["content/syllabus.js", "content/notes.js", "content/notation.js", "content/library.js"]) {
  try {
    load(f);
  } catch (e) {
    fail(`${f}: failed to parse — ${e.message}`);
  }
}

/* ---- 1. written notes are structurally sound ---- */
let questions = 0;
const answerDist = { 0: 0, 1: 0, 2: 0, 3: 0 };

for (let p = 1; p <= 7; p++) {
  const d = (w.PARTS || {})[`part-${p}`];
  if (!d || !Array.isArray(d.chapters)) {
    fail(`part-${p}: missing PART_DATA.chapters`);
    continue;
  }

  for (const c of d.chapters) {
    for (const k of ["hook", "explain", "analogy", "example", "takeaways", "plain", "quiz", "diagram"]) {
      if (!c[k]) fail(`${c.id}: missing "${k}"`);
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

  // revise.html renders every note of a module on one page, so a marker
  // id collision there silently breaks arrowheads
  const src = fs.readFileSync(join(ROOT, "content", `part-${p}.js`), "utf8");
  const markers = [...src.matchAll(/<marker id="([^"]+)"/g)].map((m) => m[1]);
  const dupes = [...new Set(markers.filter((v, i) => markers.indexOf(v) !== i))];
  if (dupes.length) fail(`part-${p}: duplicate SVG marker ids — ${dupes.join(", ")}`);
}

/* ---- 2. quiz answers must not cluster in one position ---- */
if (questions) {
  const worst = Math.max(...Object.values(answerDist));
  if (worst / questions > 0.45) {
    fail(`quiz answers cluster in one position (${Math.round((worst / questions) * 100)}% — should be near 25%). Re-shuffle.`);
  }
}

/* ---- 3. the syllabus is well formed ---- */
const syl = w.SYLLABUS || {};
if (!Array.isArray(syl.tracks) || !syl.tracks.length) fail("syllabus.js: no tracks");
const trackIds = new Set();
const moduleIds = new Set();
for (const t of syl.tracks || []) {
  for (const k of ["id", "title", "tagline", "hue", "modules"]) {
    if (!t[k]) fail(`syllabus track "${t.id || "?"}": missing "${k}"`);
  }
  if (trackIds.has(t.id)) fail(`syllabus: duplicate track id "${t.id}"`);
  trackIds.add(t.id);

  for (const m of t.modules || []) {
    if (!m.id || !m.title) fail(`syllabus module in "${t.id}": missing id or title`);
    if (moduleIds.has(m.id)) fail(`syllabus: duplicate module id "${m.id}"`);
    moduleIds.add(m.id);
    if (!Array.isArray(m.lessons) || !m.lessons.length) fail(`syllabus module "${m.id}": no lessons`);
    if (new Set(m.lessons).size !== (m.lessons || []).length) fail(`syllabus module "${m.id}": duplicate lesson titles`);
  }
}

/* ---- 4. the library assembles correctly ---- */
const L = w.Library;
if (!L) {
  fail("library.js: window.Library was not created");
} else {
  const ids = new Set();
  for (const n of L.notes) {
    if (ids.has(n.id)) fail(`library: duplicate note id "${n.id}"`);
    ids.add(n.id);
    if (!n.title) fail(`library: note "${n.id}" has no title`);
    if (!["written", "planned"].includes(n.status)) fail(`library: note "${n.id}" has bad status "${n.status}"`);
    if (n.status === "written" && !n.href) fail(`library: written note "${n.id}" has no href`);
    if (n.status === "planned" && n.href) fail(`library: planned note "${n.id}" should not have an href`);
    if (!n.topics.length) fail(`library: note "${n.id}" has no topics — it will not appear in any facet`);
  }

  // every written note must have a page on disk, or the library links to nothing
  for (const n of L.notes.filter((x) => x.status === "written" && x.href)) {
    if (!fs.existsSync(join(ROOT, n.href))) fail(`library: "${n.id}" points at missing file ${n.href}`);
  }

  // a note with one topic can never form an edge; the graph needs two
  const thin = L.notes.filter((n) => n.topics.length < 2);
  if (thin.length > L.notes.length * 0.35) {
    fail(`library: ${thin.length}/${L.notes.length} notes have fewer than 2 topics — the topography will be sparse`);
  }

  const edges = L.relations();
  if (!edges.length) fail("library: no relations at all — the topography would be empty");

  console.log(`  library: ${L.counts.tracks} tracks, ${L.counts.modules} modules, ${L.counts.notes} notes ` +
              `(${L.counts.written} written / ${L.counts.planned} outlined), ${L.counts.topics} topics`);
  console.log(`  graph:   ${edges.length} relations, ${edges.filter((e) => e.crossTrack).length} cross a track`);
}

/* ---- 5. notation entries are well formed ---- */
const notation = w.NOTATION || [];
if (!notation.length) fail("notation.js: no symbols");
const glyphs = new Set();
for (const s of notation) {
  for (const k of ["g", "name", "say", "means", "domain", "level"]) {
    if (!s[k]) fail(`notation "${s.g || s.name || "?"}": missing "${k}"`);
  }
  if (glyphs.has(s.g)) fail(`notation: duplicate glyph "${s.g}"`);
  glyphs.add(s.g);
  if (!["basic", "mid", "advanced"].includes(s.level)) fail(`notation "${s.g}": bad level "${s.level}"`);
}
console.log(`  notation: ${notation.length} symbols`);

/* ---- 6. the articles feed, if present ---- */
const articlesPath = join(ROOT, "content", "articles.js");
if (fs.existsSync(articlesPath)) {
  try {
    const a = {};
    new Function("window", fs.readFileSync(articlesPath, "utf8"))(a);
    const list = a.ARTICLES || [];
    if (!Array.isArray(list)) fail("articles.js: ARTICLES is not an array");
    const seen = new Set();
    for (const [i, x] of list.entries()) {
      for (const k of ["title", "url", "source", "date"]) if (!x[k]) fail(`articles[${i}]: missing "${k}"`);
      if (x.url && !/^https?:\/\//.test(x.url)) fail(`articles[${i}]: url is not absolute — ${x.url}`);
      if (x.url && seen.has(x.url)) fail(`articles[${i}]: duplicate url — ${x.url}`);
      seen.add(x.url);
      if (x.date && isNaN(new Date(x.date))) fail(`articles[${i}]: unparseable date — ${x.date}`);
    }
    console.log(`  articles: ${list.length} items`);
  } catch (e) {
    fail(`articles.js: failed to parse — ${e.message}`);
  }
}

/* ---- 7. nothing still references the removed gating layer ---- */
const GONE = ["buildStatusBar", "MapRenderer", "QuestRender.mount", "Progress.", "Toast.", "Asteroids."];
for (const file of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
  const src = fs.readFileSync(join(ROOT, file), "utf8");
  for (const g of GONE) if (src.includes(g)) fail(`${file}: still references removed "${g}"`);
}
for (let p = 1; p <= 7; p++) {
  const dir = join(ROOT, `part-${p}`);
  if (!fs.existsSync(dir)) continue;
  if (fs.existsSync(join(dir, "map.html"))) fail(`part-${p}/map.html still exists — the gated map was removed`);
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
    const src = fs.readFileSync(join(dir, file), "utf8");
    for (const g of GONE) if (src.includes(g)) fail(`part-${p}/${file}: still references removed "${g}"`);
  }
}

console.log(`  quiz:    ${questions} questions, spread ${JSON.stringify(answerDist)}`);

if (issues.length) {
  console.error(`\nCONTENT: ${issues.length} issue(s)\n` + issues.map((i) => "  ✕ " + i).join("\n"));
  process.exit(1);
}
console.log("CONTENT: OK");
