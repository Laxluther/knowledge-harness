/* ============================================================
   Browser checks — drives the real site in Chromium.
     * no console / page errors on any page
     * no horizontal overflow at 375px (mobile)
     * a quiz can actually be completed and scored
   Usage:
     node tests/browser.test.mjs            full sweep (~2 min)
     node tests/browser.test.mjs --quick    one chapter per part
     node tests/browser.test.mjs --only /articles.html
   ============================================================ */
import { chromium } from "playwright";
import { start } from "./serve.mjs";

const args = process.argv.slice(2);
const QUICK = args.includes("--quick");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

const CHAPTERS = { 1: 8, 2: 5, 3: 8, 4: 5, 5: 5, 6: 5, 7: 5 };
const PORT = 8788; // distinct from the dev server so both can run
const BASE = `http://127.0.0.1:${PORT}`;

function urls() {
  if (ONLY) return [ONLY];
  const out = ["/index.html"];
  for (const [p, n] of Object.entries(CHAPTERS)) {
    out.push(`/part-${p}/map.html`, `/part-${p}/revise.html`);
    const chs = QUICK ? [1] : Array.from({ length: n }, (_, i) => i + 1);
    for (const c of chs) out.push(`/part-${p}/ch-${String(c).padStart(2, "0")}.html`);
  }
  return out;
}

const server = await start(PORT);
const browser = await chromium.launch();
const problems = [];
let checked = 0;

async function sweep(label, viewport, checkOverflow) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(`[${label} ${page.url()}] pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`[${label} ${page.url()}] console: ${m.text()}`);
  });
  for (const u of urls()) {
    const res = await page.goto(BASE + u, { waitUntil: "networkidle" }).catch((e) => {
      problems.push(`[${label} ${u}] navigation failed: ${e.message}`);
      return null;
    });
    if (!res) continue;
    if (res.status() >= 400) problems.push(`[${label} ${u}] HTTP ${res.status()}`);
    await page.waitForTimeout(250);
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

/* ---- a quiz must be completable and score correctly ---- */
if (!ONLY) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(`[quiz] pageerror: ${e.message}`));
  await page.goto(`${BASE}/part-1/ch-01.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const answers = await page.evaluate(() => {
    const ch = window.PART_DATA.chapters.find((c) => c.id === "p1-c1");
    return ch.quiz.map((q) => q.answer);
  });
  await page.evaluate(() => document.getElementById("challenge-section")?.scrollIntoView());
  const cards = await page.$$(".q-card");
  if (cards.length !== answers.length) {
    problems.push(`[quiz] rendered ${cards.length} cards for ${answers.length} questions`);
  } else {
    for (let i = 0; i < cards.length; i++) {
      const opts = await cards[i].$$(".q-option");
      await opts[answers[i]].click();
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(600);
    const score = await page.$eval("#result-score", (el) => el.textContent).catch(() => null);
    const expected = `${answers.length} / ${answers.length} correct`;
    if (score !== expected) problems.push(`[quiz] expected "${expected}", got "${score}"`);
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
