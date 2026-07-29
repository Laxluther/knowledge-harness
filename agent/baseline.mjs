/* ============================================================
   Baseline — what this reader already knows.

   The book is 41 chapters of settled material. An article that
   re-explains RAG or ReAct is not news *to this reader*, however
   well written it is. So we hand the ranker a compact digest of
   what's already covered and ask it to judge novelty against
   that, rather than against its own training cutoff (which it
   cannot reason about reliably).
   ============================================================ */
import fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function loadBook() {
  const parts = [];
  for (let p = 1; p <= 7; p++) {
    const w = {};
    new Function("window", fs.readFileSync(join(ROOT, "content", `part-${p}.js`), "utf8"))(w);
    parts.push(w.PART_DATA);
  }
  return parts;
}

/** Concepts the book explicitly names — its <strong> terms are the vocabulary. */
// Words that appear bolded for emphasis rather than as concept names.
const GENERIC = new Set(["use", "shared", "action", "prompts", "agents", "agent", "tools", "resources", "retrieve", "generation", "embedding", "chunking", "indexing", "incrementally"]);

export function knownConcepts() {
  const terms = new Set();
  for (const part of loadBook()) {
    for (const c of part.chapters) {
      for (const m of (c.explain || "").matchAll(/<strong>([^<]{3,50})<\/strong>/g)) {
        // drop parentheticals, surrounding quotes and trailing punctuation
        const t = m[1]
          .replace(/\s*\([^)]*\)\s*/g, " ")
          .replace(/^["'“”]+|["'“”.]+$/g, "")
          .replace(/[.,:;]$/, "")
          .trim()
          .toLowerCase();
        if (t.length > 2 && !/^\d/.test(t) && !GENERIC.has(t)) terms.add(t);
      }
    }
  }
  return [...terms].sort();
}

/** A short outline the model can hold in context without eating the budget. */
export function outline() {
  return loadBook()
    .map((part) => {
      const chs = part.chapters.map((c) => `  - ${c.title}: ${c.short}`).join("\n");
      return `${part.title}\n${chs}`;
    })
    .join("\n\n");
}

/** The full prompt fragment describing the reader's existing knowledge. */
export function baselinePrompt() {
  const concepts = knownConcepts();
  return `The reader has already written and published a 41-chapter book covering the material below.
Anything that merely re-explains this is NOT new to them, no matter how well written.

BOOK OUTLINE
${outline()}

CONCEPTS ALREADY COVERED IN DEPTH (${concepts.length} terms)
${concepts.join(", ")}`;
}

// `node agent/baseline.mjs` prints the digest, for eyeballing what the model sees.
if (process.argv[1] && fileURLToPath(import.meta.url).replace(/\\/g, "/").endsWith(process.argv[1].replace(/\\/g, "/").split("/").slice(-2).join("/"))) {
  const c = knownConcepts();
  console.log(baselinePrompt());
  console.error(`\n[${c.length} concepts, ~${Math.round(baselinePrompt().length / 4)} tokens]`);
}
