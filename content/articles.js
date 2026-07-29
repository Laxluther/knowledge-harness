/* ============================================================
   Dispatches — the daily reading list.

   Written by agent/run.mjs, not by hand. Every entry is a LINK
   plus the publisher's own excerpt; nothing here is generated
   prose. `extends` names the book chapter the item builds on,
   which is also how the ranker justified keeping it.
   ============================================================ */

window.ARTICLES_UPDATED = null;

window.ARTICLES = [];
