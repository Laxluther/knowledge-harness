/* ============================================================
   Dispatch agent — finds work that goes beyond the book.

   RSS in, links out. It never writes prose: entries carry the
   publisher's own title and excerpt, so there is nothing for a
   model to get factually wrong. The model's only job is to
   judge, against the book, whether an item is new enough to
   keep — which is classification, not generation, and is what
   a local model is actually reliable at.

     node agent/run.mjs --dry-run     fetch + rank, write nothing
     node agent/run.mjs               write, test, commit, push
     node agent/run.mjs --no-push     write and test, stop there
   ============================================================ */
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { baselinePrompt } from "./baseline.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CFG = JSON.parse(fs.readFileSync(join(ROOT, "agent", "feeds.json"), "utf8"));
const STATE_DIR = join(ROOT, "agent", "state");
const SEEN_PATH = join(STATE_DIR, "seen.json");
const ARTICLES_PATH = join(ROOT, "content", "articles.js");

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");
const NO_PUSH = argv.includes("--no-push");
const LIST = argv.includes("--list"); // print candidates and stop, for tuning filters
const OLLAMA = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "gemma3:27b";
const UA = "Mozilla/5.0 (compatible; KnowledgeHarnessBot/1.0; +https://laxluther.github.io/knowledge-harness/)";

const log = (...a) => console.log(...a);

/* ---------- 1. fetch ---------- */

function decode(s = "") {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
};

function parseFeed(xml, feed) {
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  return blocks.map((b) => {
    // Atom puts the URL in an attribute; RSS uses a text node.
    let url = tag(b, "link");
    if (!url) {
      const m = b.match(/<link[^>]*href="([^"]+)"/i);
      url = m ? m[1] : "";
    }
    const date = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated");
    const excerpt = tag(b, "description") || tag(b, "summary") || tag(b, "content");
    return {
      title: tag(b, "title"),
      url: url.trim(),
      date: date ? new Date(date).toISOString() : null,
      excerpt: excerpt.slice(0, 400),
      source: feed.name,
      tier: feed.tier,
      kind: feed.kind || "post",
    };
  });
}

async function fetchFeed(feed) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(feed.url, { headers: { "User-Agent": UA, Accept: "application/rss+xml, application/atom+xml, application/xml, */*" }, signal: ctl.signal, redirect: "follow" });
    clearTimeout(t);
    if (!r.ok) return { feed, items: [], error: `HTTP ${r.status}` };
    return { feed, items: parseFeed(await r.text(), feed) };
  } catch (e) {
    clearTimeout(t);
    return { feed, items: [], error: e.name === "AbortError" ? "timeout" : e.message };
  }
}

/* ---------- 2. cheap filters, before the model sees anything ---------- */

function preFilter(items, seen) {
  const block = CFG.titleBlocklist.map((p) => new RegExp(p, "i"));
  const cutoff = Date.now() - CFG.maxAgeDays * 864e5;
  const kept = [];
  const drops = { seen: 0, old: 0, junk: 0, thin: 0, noise: 0, dupe: 0 };
  // The same post shows up under several Medium tags, so dedupe within the
  // run by url and by normalised title, not just against the seen set.
  const runUrls = new Set();
  const runTitles = new Set();
  for (const it of items) {
    if (!it.url || !it.title) { drops.thin++; continue; }
    if (seen.has(it.url)) { drops.seen++; continue; }
    const titleKey = it.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (runUrls.has(it.url) || runTitles.has(titleKey)) { drops.dupe++; continue; }
    runUrls.add(it.url);
    runTitles.add(titleKey);
    if (it.date && new Date(it.date).getTime() < cutoff) { drops.old++; continue; }
    if (block.some((re) => re.test(it.title))) { drops.junk++; continue; }
    // repo feeds: skip mechanical commits, keep substantive ones
    if (it.kind === "repo" && /^(chore|ci|build|bump|merge|revert|typo|fix lint|update readme)/i.test(it.title)) { drops.noise++; continue; }
    if (it.title.length < 12) { drops.thin++; continue; }
    kept.push(it);
  }
  return { kept, drops };
}

/* ---------- 3. rank, in one batched call ---------- */

async function rank(candidates) {
  const list = candidates
    .map((c, i) => `[${i}] (${c.source}, tier ${c.tier}) ${c.title}\n    ${c.excerpt.slice(0, 200)}`)
    .join("\n");

  const prompt = `${baselinePrompt()}

CANDIDATE ARTICLES FOUND TODAY
${list}

TASK
Decide which candidates are worth this reader's time. Keep an item ONLY if it does at least one of:
  - reports a genuinely new technique, model, tool or result
  - goes deeper than the book on a concept it only introduces
  - is a first-party playbook, cookbook or official guide (tier 1)
Reject anything that:
  - re-explains a concept already listed as covered
  - is marketing, a listicle, a personal anecdote, or engagement bait
  - is a routine code change with no conceptual content

Return ONLY a JSON array, no prose, no markdown fence. Each element:
  {"i": <index>, "keep": true|false, "score": 1-10, "extends": "<book concept it builds on, or null>", "why": "<max 12 words>"}
Score 8+ only for things that genuinely advance beyond the book. Be harsh: most items should be keep:false.`;

  const r = await fetch(`${OLLAMA}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, stream: false, options: { temperature: 0.2, num_ctx: 8192 } }),
  });
  if (!r.ok) throw new Error(`Ollama HTTP ${r.status} — is it running? (${OLLAMA})`);
  const raw = (await r.json()).response || "";
  const m = raw.match(/\[[\s\S]*\]/);
  if (!m) throw new Error("model did not return a JSON array:\n" + raw.slice(0, 300));
  return JSON.parse(m[0]);
}

/* ---------- 4. write ---------- */

function writeArticles(existing, additions) {
  const merged = [...additions, ...existing]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 200); // keep the file bounded
  const body = `/* ============================================================
   Dispatches - the daily reading list.

   Written by agent/run.mjs, not by hand. Every entry is a LINK
   plus the publisher's own excerpt; nothing here is generated
   prose. \`extends\` names the book chapter the item builds on,
   which is also how the ranker justified keeping it.
   ============================================================ */

window.ARTICLES_UPDATED = ${JSON.stringify(new Date().toISOString())};

window.ARTICLES = ${JSON.stringify(merged, null, 2)};
`;
  fs.writeFileSync(ARTICLES_PATH, body);
  return merged.length;
}

function loadExisting() {
  if (!fs.existsSync(ARTICLES_PATH)) return [];
  const w = {};
  try {
    new Function("window", fs.readFileSync(ARTICLES_PATH, "utf8"))(w);
    return w.ARTICLES || [];
  } catch {
    return [];
  }
}

/* ---------- main ---------- */

fs.mkdirSync(STATE_DIR, { recursive: true });
const seen = new Set(fs.existsSync(SEEN_PATH) ? JSON.parse(fs.readFileSync(SEEN_PATH, "utf8")) : []);

log(`Fetching ${CFG.feeds.length} feeds…`);
const results = await Promise.all(CFG.feeds.map(fetchFeed));
const failed = results.filter((r) => r.error);
if (failed.length) failed.forEach((f) => log(`  ! ${f.feed.name}: ${f.error}`));
const all = results.flatMap((r) => r.items);
log(`  ${all.length} items from ${results.length - failed.length}/${results.length} feeds`);

const { kept, drops } = preFilter(all, seen);
log(`Pre-filter: ${kept.length} candidates (dropped ${drops.seen} seen, ${drops.old} old, ${drops.dupe} duplicate, ${drops.junk} clickbait, ${drops.noise} repo noise, ${drops.thin} thin)`);

if (!kept.length) {
  log("Nothing new today.");
  process.exit(0);
}

// Tier 1 first, then newest — so the batch the model sees leads with signal.
kept.sort((a, b) => a.tier - b.tier || String(b.date).localeCompare(String(a.date)));
const batch = kept.slice(0, 40);

if (LIST) {
  log(`\nCandidates the model would see (${batch.length}):`);
  for (const [i, c] of batch.entries()) {
    log(`  [${String(i).padStart(2)}] t${c.tier} ${c.source.padEnd(22)} ${c.title.slice(0, 78)}`);
  }
  process.exit(0);
}

log(`Ranking ${batch.length} candidates with ${MODEL}…`);
let verdicts;
try {
  verdicts = await rank(batch);
} catch (e) {
  console.error(`\nRanking failed: ${e.message}`);
  process.exit(1);
}

const picks = verdicts
  .filter((v) => v.keep && batch[v.i])
  .sort((a, b) => (b.score || 0) - (a.score || 0))
  .slice(0, CFG.maxPerRun)
  .map((v) => {
    const c = batch[v.i];
    return {
      title: c.title,
      url: c.url,
      source: c.source,
      date: c.date || new Date().toISOString(),
      excerpt: c.excerpt.slice(0, 260),
      extends: v.extends && v.extends !== "null" ? v.extends : null,
      score: v.score,
      status: "live",
    };
  });

log(`\nKept ${picks.length} of ${batch.length}:`);
for (const p of picks) log(`  ${String(p.score).padStart(2)}  ${p.source.padEnd(22)} ${p.title.slice(0, 72)}`);

if (DRY) {
  log("\n--dry-run: nothing written.");
  process.exit(0);
}
if (!picks.length) {
  log("\nNothing worth publishing today.");
  process.exit(0);
}

const total = writeArticles(loadExisting(), picks);
batch.forEach((c) => seen.add(c.url));
fs.writeFileSync(SEEN_PATH, JSON.stringify([...seen].slice(-4000), null, 0));
log(`\nWrote content/articles.js (${total} items total)`);

/* ---------- 5. gate on the tests, then ship ---------- */

const run = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32" });

// Appending a link can't realistically break the page — the file is written
// with JSON.stringify and every field is escaped at render time. So the
// routine gate is just the ~1s content check, which is what actually catches
// a malformed url, an unparseable date, or a duplicate slipping through.
// The browser sweep is only worth it after changing articles.html itself.
log("\nChecking…");
try {
  run("node", ["tests/content.test.mjs"]);
  if (argv.includes("--verify")) run("node", ["tests/browser.test.mjs", "--only", "/articles.html"]);
} catch {
  console.error("\nCheck failed — reverting articles.js and NOT pushing.");
  run("git", ["checkout", "--", "content/articles.js"]);
  process.exit(1);
}

if (NO_PUSH) {
  log("\n--no-push: staged locally, not pushed.");
  process.exit(0);
}

log("\nPushing…");
const stamp = new Date().toISOString().slice(0, 10);
run("git", ["add", "content/articles.js"]);
run("git", ["commit", "-m", `Dispatches: ${picks.length} new item${picks.length === 1 ? "" : "s"} (${stamp})`]);
run("git", ["push", "origin", "main"]);
log("Done.");
