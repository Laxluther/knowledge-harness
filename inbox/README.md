# Inbox — handwritten notes in, library notes out

Drop scans here. Nothing in this folder is served by the site; it is a
staging area, and the conversion is a review step, not an automatic one.

## How to use it

1. Put images or PDFs of your notes in `inbox/`. Any filename is fine —
   `2026-08-23-attention.jpg`, `IMG_4471.HEIC`, `retrieval-scratch.pdf`.
   A subfolder per session is fine too.

2. Tell Claude: **"convert the inbox"**.

3. What comes back, per scan:
   - a proposed **title** and one-line **summary**
   - the transcribed content, written up as prose in the house voice
   - a proposed **track and module**, with the reasoning
   - the **topics** the tagger derived
   - anything illegible, flagged rather than guessed

4. You approve, adjust, or reject each one. Approved notes are written
   into the right `content/part-N.js` — or into `content/notes.js` if
   they do not belong to an existing module yet.

5. The original scan moves to `inbox/filed/` so the folder always shows
   only what is still waiting.

## Why there is a review step

Filing is the part that is expensive to get wrong. A note in the wrong
module is worse than an unfiled one — you will not find it, and you will
not know it is missing. The tagger is good at "this is about retrieval";
it is not good at "this belongs in module 03 rather than 06". That call
stays with you, which is what the "inbox → I file it" choice meant.

## Unfiled notes are first-class

A note does not need a module. `content/notes.js` holds notes with no
home yet; they appear on the shelf under **Notebook**, are searchable,
and show up in the topography like anything else. Group them into a
module later, when enough of them are pointing the same direction.

Shape of an entry in `content/notes.js`:

```js
window.NOTES = [
  {
    id: "attention-margins-2026-08",     // stable, unique
    title: "Why the scaling factor is √d_k",
    short: "The one-line reason, from the margin of a paper",
    hook: "<p>…</p>",
    explain: "<p>…</p>",
    analogy: "<p>…</p>",
    example: "<p>…</p>",
    takeaways: ["…", "…"],
    quiz: [],                            // optional
    source: "inbox/filed/2026-08-23-attention.jpg",
    // topics are derived automatically; set them only to override
  },
];
```

`source` is worth keeping. When a written note disagrees with what you
remember, the scan is the record of what you actually wrote down.
