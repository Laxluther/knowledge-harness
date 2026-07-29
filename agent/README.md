# Dispatch agent

Finds work that goes **beyond the book** and adds it to `articles.html` as a link.

It never writes prose. Entries carry the publisher's own title and excerpt, so
there is nothing for a model to get factually wrong. The model's only job is to
judge, against the book, whether an item is new enough to keep.

## Running it

```bash
node agent/run.mjs --list      # show candidates, no model needed - for tuning filters
node agent/run.mjs --dry-run   # fetch + rank, write nothing
node agent/run.mjs --no-push   # write and check, stop before pushing
node agent/run.mjs             # write, check, commit, push
```

Needs Ollama running:

```bash
ollama serve
ollama pull gemma3:27b
```

Override the model or host if yours differ:

```bash
OLLAMA_MODEL=gemma3:27b OLLAMA_URL=http://127.0.0.1:11434 node agent/run.mjs
```

## How it decides

1. **Fetch** every feed in `feeds.json` (all 22 verified working).
2. **Cheap filters first**, before the model sees anything — already seen, older
   than `maxAgeDays`, duplicate across feeds, clickbait title patterns,
   mechanical repo commits. This is what removes ~98% of the volume.
3. **Rank in one batched call.** The prompt includes a digest of the book — its
   outline plus ~220 concepts it already covers — and asks which candidates go
   *beyond* that. Novelty is judged against the book, not against the model's
   training cutoff, which it cannot reason about reliably.
4. **Keep the top `maxPerRun`**, write `content/articles.js`, run the content
   check, commit and push.

If the check fails, `articles.js` is reverted and nothing is pushed.

## Tuning

Everything lives in `feeds.json`:

- `feeds[]` — add or remove sources. `tier` 1 is first-party and trusted,
  3 is high-volume and gets the most scepticism.
- `titleBlocklist` — regexes matched against titles, applied before the model.
- `maxPerRun` — how many items a single run may publish (default 5).
- `maxAgeDays` — how far back to look (default 3).

Use `--list` after any change to see what the model would be handed.

## Scheduling

Windows Task Scheduler, daily:

```
Program:   node
Arguments: agent\run.mjs
Start in:  S:\Booklet
```

It only publishes when it finds something, so a quiet day is a no-op rather
than an empty commit. If the machine is off the run is simply skipped —
`seen.json` means the next run picks up where it left off without repeats.

## State

`agent/state/seen.json` is gitignored — it's the record of URLs already
considered, capped at the last 4000.
