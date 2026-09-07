/* ============================================================
   Browser checks — drives the real site in Chromium.
     * no console / page errors on any page
     * no horizontal overflow at 375px (mobile)
     * every nav destination resolves
     * search, facets and the self-check actually work
   Usage:
     node tests/browser.test.mjs            full sweep (~2 min)
     node tests/browser.test.mjs --quick    one note per module
     node tests/browser.test.mjs --only /labs.html
   ============================================================ */
import { chromium } from "playwright";
import { start } from "./serve.mjs";

const args = process.argv.slice(2);
const QUICK = args.includes("--quick");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

const NOTES = { 1: 8, 2: 5, 3: 8, 4: 5, 5: 5, 6: 5, 7: 5 };
const TRACKS = ["agentic", "ai-research", "system-design", "ml-math", "inference-eng", "notation"];
const PORT = 8788; // distinct from the dev server so both can run
const BASE = `http://127.0.0.1:${PORT}`;

function urls() {
  if (ONLY) return [ONLY];
  const out = [
    "/index.html",
    "/browse.html",
    "/roadmap.html",
    "/topography.html",
    "/decoder.html",
    "/labs.html",
    "/articles.html",
    // filtered views must survive a cold load from the URL alone
    "/browse.html?track=system-design",
    "/browse.html?module=part-3&topic=retrieval",
    "/browse.html?status=written",
    "/browse.html?q=attention",
  ];
  for (const t of TRACKS) out.push(`/track.html?id=${t}`, `/roadmap.html?track=${t}`);
  for (const [p, n] of Object.entries(NOTES)) {
    out.push(`/part-${p}/revise.html`);
    const chs = QUICK ? [1] : Array.from({ length: n }, (_, i) => i + 1);
    for (const c of chs) out.push(`/part-${p}/ch-${String(c).padStart(2, "0")}.html`);
  }
  return out;
}

const server = await start(PORT);
const browser = await chromium.launch();
const problems = [];
let checked = 0;

function watch(page, label) {
  page.on("pageerror", (e) => problems.push(`[${label} ${page.url()}] pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`[${label} ${page.url()}] console: ${m.text()}`);
  });
  page.on("requestfailed", (r) => {
    // a missing stylesheet or script is silent in the console but fatal on the page
    if (/\.(css|js|png|svg)$/.test(r.url())) problems.push(`[${label}] failed request: ${r.url()}`);
  });
}

async function sweep(label, viewport, checkOverflow) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  watch(page, label);

  for (const u of urls()) {
    const res = await page.goto(BASE + u, { waitUntil: "networkidle" }).catch((e) => {
      problems.push(`[${label} ${u}] navigation failed: ${e.message}`);
      return null;
    });
    if (!res) continue;
    if (res.status() >= 400) problems.push(`[${label} ${u}] HTTP ${res.status()}`);
    await page.waitForTimeout(220);

    if (checkOverflow) {
      const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (o > 0) problems.push(`[${label} ${u}] horizontal overflow: ${o}px`);
    }
    checked++;
  }
  await ctx.close();
}

await sweep("desktop", { width: 1280, height: 900 }, false);
await sweep("mobile", { width: 375, height: 812 }, true);

if (!ONLY) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  /* ---- every nav link must resolve ---- */
  {
    const page = await ctx.newPage();
    watch(page, "nav");
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
    const hrefs = await page.$$eval(".shell-nav__link", (els) => els.map((e) => e.getAttribute("href")));
    if (hrefs.length < 5) problems.push(`[nav] only ${hrefs.length} nav links rendered`);
    for (const h of hrefs) {
      const r = await page.goto(`${BASE}/${h}`, { waitUntil: "domcontentloaded" }).catch(() => null);
      if (!r || r.status() >= 400) problems.push(`[nav] ${h} → ${r ? r.status() : "failed"}`);
    }
    await page.close();
  }

  /* ---- home search narrows and reaches a real note ---- */
  {
    const page = await ctx.newPage();
    watch(page, "search");
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
    await page.fill("#q", "retrieval");
    await page.waitForTimeout(250);
    const hits = await page.$$eval(".hit", (els) => els.length);
    if (!hits) problems.push("[search] typing 'retrieval' produced no hits");

    await page.fill("#q", "zzzzqqq");
    await page.waitForTimeout(250);
    const empty = await page.$eval(".hit", (el) => el.textContent).catch(() => "");
    if (!/nothing yet/i.test(empty)) problems.push("[search] no-match state did not render");
    await page.close();
  }

  /* ---- browse facets actually filter, and combine ---- */
  {
    const page = await ctx.newPage();
    watch(page, "browse");
    await page.goto(`${BASE}/browse.html`, { waitUntil: "networkidle" });

    const all = await page.$$eval(".note-card", (e) => e.length);
    await page.click('[data-track="system-design"]');
    await page.waitForTimeout(250);
    const filtered = await page.$$eval(".note-card", (e) => e.length);

    if (!(filtered > 0 && filtered < all)) {
      problems.push(`[browse] track filter did not narrow: ${all} → ${filtered}`);
    }

    // the module row is hidden until a track is chosen
    const modRowVisible = await page.$eval("#module-row", (el) => !el.hidden);
    if (!modRowVisible) problems.push("[browse] module facets did not appear after choosing a track");

    // written-only must return only openable notes
    await page.click('[data-status="written"]');
    await page.waitForTimeout(250);
    const plannedShown = await page.$$eval(".note-card.is-planned", (e) => e.length);
    if (plannedShown) problems.push(`[browse] 'written' filter still showed ${plannedShown} outlined notes`);

    await page.click("#clear");
    await page.waitForTimeout(250);
    const cleared = await page.$$eval(".note-card", (e) => e.length);
    if (cleared !== all) problems.push(`[browse] clear did not restore: ${all} → ${cleared}`);
    await page.close();
  }

  /* ---- a planned note must never be a link ---- */
  {
    const page = await ctx.newPage();
    watch(page, "planned");
    await page.goto(`${BASE}/browse.html?status=planned`, { waitUntil: "networkidle" });
    const bad = await page.$$eval("a.note-card.is-planned", (e) => e.length);
    if (bad) problems.push(`[planned] ${bad} outlined notes rendered as clickable links`);
    await page.close();
  }

  /* ---- the self-check scores, and awards nothing ---- */
  {
    const page = await ctx.newPage();
    watch(page, "check");
    await page.goto(`${BASE}/part-1/ch-01.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const answers = await page.evaluate(() => window.Library.byId("p1-c1").quiz.map((q) => q.answer));
    await page.evaluate(() => document.getElementById("check")?.scrollIntoView());
    await page.waitForTimeout(200);

    const cards = await page.$$(".q-card");
    if (cards.length !== answers.length) {
      problems.push(`[check] rendered ${cards.length} cards for ${answers.length} questions`);
    } else {
      for (let i = 0; i < cards.length; i++) {
        const opts = await cards[i].$$(".q-option");
        await opts[answers[i]].click();
        await page.waitForTimeout(110);
      }
      await page.waitForTimeout(600);
      const score = await page.$eval(".challenge__result-score", (el) => el.textContent.trim()).catch(() => null);
      if (score !== `${answers.length} / ${answers.length}`) {
        problems.push(`[check] expected "${answers.length} / ${answers.length}", got "${score}"`);
      }
      // reading a note is remembered; nothing else is
      const stored = await page.evaluate(() => ({
        last: localStorage.getItem("booklet-last"),
        legacy: localStorage.getItem("booklet_progress_v1"),
      }));
      if (stored.last !== "p1-c1") problems.push(`[check] last-read not recorded (got ${stored.last})`);
      if (stored.legacy) problems.push("[check] the old XP store is still being written");
    }
    await page.close();
  }

  /* ---- the KV-cache lab recomputes when a dial moves ---- */
  {
    const page = await ctx.newPage();
    watch(page, "lab");
    await page.goto(`${BASE}/labs.html`, { waitUntil: "networkidle" });
    const before = await page.$eval("#out-total", (el) => el.textContent);
    await page.selectOption("#d-model", "70,80,8,8192");
    await page.waitForTimeout(200);
    const after = await page.$eval("#out-total", (el) => el.textContent);
    if (before === after) problems.push("[lab] changing the model did not change the KV total");
    if (/NaN|undefined/.test(after)) problems.push(`[lab] produced a bad number: ${after}`);
    await page.close();
  }

  /* ---- the topography draws something ---- */
  {
    const page = await ctx.newPage();
    watch(page, "topo");
    await page.goto(`${BASE}/topography.html`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const { nodes, edges } = await page.evaluate(() => ({
      nodes: document.querySelectorAll(".topo-node").length,
      edges: document.querySelectorAll(".topo-edge").length,
    }));
    if (nodes < 50) problems.push(`[topo] only ${nodes} nodes drawn`);
    if (edges < 50) problems.push(`[topo] only ${edges} edges drawn`);
    await page.close();
  }

  await ctx.close();
}

await browser.close();
server.close();

console.log(`  checked ${checked} page loads`);
if (problems.length) {
  console.error(`\nBROWSER: ${problems.length} problem(s)\n` + [...new Set(problems)].map((p) => "  ✕ " + p).join("\n"));
  process.exit(1);
}
console.log("BROWSER: OK");
