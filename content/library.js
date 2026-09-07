/* ============================================================
   Library — the flat note store.

   Everything in the site is a NOTE. A note is either:

     written — it has prose, diagrams and a quiz, and lives in
               content/part-N.js with its own page.
     planned — it exists as a title in content/syllabus.js. The
               ground is staked out; the body is not written.

   Both kinds sit in one list. Tracks and modules are a *view*
   over that list, never the storage shape, which is why a scanned
   page can arrive without anyone deciding where it belongs first
   and a planned lesson can become written without moving.

   Topics are derived, not hand-assigned, by the same keyword pass
   for every note — so facets and the concept graph populate
   themselves as material arrives.
   ============================================================ */

window.Library = (() => {
  const TOPICS = [
    { id: "tokenization", label: "Tokenization", terms: ["tokeniz", "byte-pair", "bpe", "subword", "vocabulary"] },
    { id: "embeddings", label: "Embeddings", terms: ["embedding", "word2vec", "latent space", "cosine similarity", "vector space"] },
    { id: "attention", label: "Attention", terms: ["attention", "self-attention", "multi-head", "softmax"] },
    { id: "architecture", label: "Architecture", terms: ["transformer", "residual stream", "layer norm", "feed-forward", "positional encoding", "from scratch", "llama", "deepseek", "qwen", "mixture of experts"] },
    { id: "training", label: "Training", terms: ["pretrain", "backprop", "gradient descent", "fine-tun", "training run", "loss function", "optimizer", "adam", "batch size", "sequence length", "swiglu", "learning rate"] },
    { id: "alignment", label: "Alignment", terms: ["rlhf", "alignment", "preference", "reward model", "dpo", "instruction tuning"] },
    { id: "sampling", label: "Sampling", terms: ["temperature", "top-k", "top-p", "nucleus", "greedy decoding", "beam search"] },
    { id: "prompting", label: "Prompting", terms: ["prompt", "few-shot", "zero-shot", "chain of thought", "chain-of-thought"] },
    { id: "context", label: "Context", terms: ["context window", "context length", "long context", "compaction"] },
    { id: "retrieval", label: "Retrieval", terms: ["retrieval", "rag", "vector database", "rerank", "chunking", "embedding index", "search engine", "inverted index"] },
    { id: "tools", label: "Tool use", terms: ["tool call", "tool use", "function call", "structured output", "json schema"] },
    { id: "agents", label: "Agents", terms: ["agent", "react loop", "task decomposition", "autonomy"] },
    { id: "multiagent", label: "Multi-agent", terms: ["multi-agent", "orchestrat", "handoff", "delegat", "supervisor"] },
    { id: "memory", label: "Memory", terms: ["memory", "scratchpad", "conversation history", "persistence"] },
    { id: "evaluation", label: "Evaluation", terms: ["eval", "benchmark", "elo", "llm-as-judge", "regression test", "metric", "cross-validation"] },
    { id: "inference", label: "Inference", terms: ["kv cache", "kv-cache", "throughput", "batching", "quantiz", "serving", "latency", "prefill", "decode"] },
    { id: "reliability", label: "Reliability", terms: ["guardrail", "fallback", "retry", "circuit breaker", "observability", "failure mode", "slo", "rate limiter"] },
    { id: "cost", label: "Cost", terms: ["cost per", "pricing", "token budget", "spend", "unit economics", "capacity planning"] },
    { id: "math", label: "Math", terms: ["probability", "entropy", "logit", "linear algebra", "likelihood", "matri", "derivat", "gradient", "calculus", "convex", "vector", "divergence", "jacobian", "norm", "eigen", "svd", "decomposition", "chain rule", "dot product", "statistic", "bayes", "regression", "distribution"] },
    { id: "scaling", label: "Scaling", terms: ["scaling law", "compute budget", "chinchilla", "emergent capabilit", "horizontal scaling", "sharding"] },
    { id: "distributed", label: "Distributed", terms: ["consensus", "raft", "replication", "partition", "consistent hashing", "leader election", "distributed lock", "cap theorem"] },
    { id: "storage", label: "Storage", terms: ["b-tree", "lsm", "sstable", "write-ahead log", "object storage", "index", "compaction", "durability"] },
    { id: "streaming", label: "Streaming", terms: ["kafka", "message queue", "event-driven", "stream processing", "task scheduler"] },
    { id: "caching", label: "Caching", terms: ["cache", "redis", "cdn", "eviction", "invalidation"] },
    { id: "deployment", label: "Deployment", terms: ["docker", "kubernetes", "ci/cd", "continuous integration", "deployment strateg", "mlops", "dvc", "mlflow"] },
    { id: "vision", label: "Vision", terms: ["convolutional", "cnn", "image", "style transfer", "deep dream", "captioning"] },
    { id: "generative", label: "Generative", terms: ["diffusion", "gan", "autoencoder", "variational", "generative"] },
    { id: "rl", label: "Reinforcement", terms: ["reinforcement", "policy gradient", "q-learning", "ppo", "grpo", "reward", "bellman"] },
    { id: "notation", label: "Notation", terms: ["notation", "glyph", "subscript", "superscript", "operator precedence", "set-builder"] },
    { id: "apis", label: "APIs", terms: ["rest", "grpc", "graphql", "api gateway", "rpc", "proxy", "load balancer", "idempot", "soap", "architectural style"] },
    { id: "realtime", label: "Realtime", terms: ["websocket", "polling", "server-sent", "news feed", "chat messaging", "feed system", "social graph", "sse"] },
    { id: "geo", label: "Geo", terms: ["geohash", "location-based", "ride sharing", "google maps", "proximity", "tinder", "yelp", "geospatial"] },
    { id: "preprocessing", label: "Preprocessing", terms: ["feature engineering", "data leakage", "missingness", "eda", "encoding", "data generation", "imputation"] },
    { id: "unsupervised", label: "Unsupervised", terms: ["clustering", "k-means", "pca", "factorization", "manifold", "density estimation", "anomaly detection"] },
    { id: "research", label: "Research", terms: ["research paper", "publish", "ablation", "reproducib", "experiment tracking", "self-study", "recursive model"] },
    { id: "tensors", label: "Tensors", terms: ["tensor", "reshape", "squeeze", "broadcast", "slicing", "transpos", "matmul", "flatten"] },
    { id: "frameworks", label: "Frameworks", terms: ["keras", "tensorflow", "pytorch", "estimator api", "layers api", "tfrecord", "dataset api", "save & restore", "ensemble", "hyper-parameter"] },
  ];

  const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

  const MAX_TOPICS = 4;
  const MIN_SCORE = 3;

  function plainText(html) {
    return String(html || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  function countHits(haystack, term) {
    if (!haystack) return 0;
    let n = 0;
    let i = haystack.indexOf(term);
    while (i !== -1) {
      n++;
      i = haystack.indexOf(term, i + term.length);
    }
    return n;
  }

  /* What a note is *about* shows up in its title and summary, not in
     the fact that a word appears once somewhere in the body. The
     headline surface scores heavily; the body only breaks ties.

     A planned note is nothing but a title, and titles like
     "Functions" or "Matrices" carry no topic signal on their own.
     So a note also inherits its module's heading — "Functions"
     inside "Math Fundamentals" is a maths note, and that is real
     information rather than a guess. Inherited signal is weighted
     below the note's own words so it can never outvote them. */
  function deriveTopics(note) {
    const head = plainText([note.title, note.short, (note.takeaways || []).join(" ")].join(" "));
    const context = plainText(note.context || "");
    const body = plainText([note.plain, note.hook, note.explain, note.analogy, note.example].join(" "));

    return TOPICS.map((t) => {
      let score = 0;
      for (const term of t.terms) {
        score += countHits(head, term) * 5;
        score += Math.min(countHits(context, term), 2) * 2;
        score += Math.min(countHits(body, term), 4);
      }
      return { id: t.id, score };
    })
      .filter((t) => t.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_TOPICS)
      .map((t) => t.id);
  }

  function slug(s) {
    return String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
  }

  /* ---- build ------------------------------------------------ */

  const notes = [];
  const modules = [];
  const tracks = [];

  /* --- track 1: the written one, assembled from content/part-N.js --- */
  const PART_ORDER = ["part-1", "part-2", "part-3", "part-4", "part-5", "part-6", "part-7"];

  const agenticModules = [];
  PART_ORDER.forEach((partId, mi) => {
    const part = (window.PARTS || {})[partId];
    if (!part) return;

    const mod = {
      id: part.id,
      track: "agentic",
      n: part.index != null ? part.index : mi + 1,
      title: part.title,
      tagline: part.tagline,
      hue: "ion",
      count: part.chapters.length,
      written: part.chapters.length,
      planned: 0,
    };
    agenticModules.push(mod);
    modules.push(mod);

    part.chapters.forEach((ch) => {
      const note = {
        id: ch.id,
        n: ch.n,
        title: ch.title,
        short: ch.short,
        plain: ch.plain,
        hook: ch.hook,
        explain: ch.explain,
        analogy: ch.analogy,
        example: ch.example,
        takeaways: ch.takeaways,
        quiz: ch.quiz,
        diagram: ch.diagram,
        diagram2: ch.diagram2,
        math: ch.math,
        track: "agentic",
        trackTitle: "Language Models → Agentic AI",
        module: part.id,
        moduleTitle: part.title,
        moduleN: mod.n,
        hue: "ion",
        status: "written",
        href: `${part.id}/ch-${String(ch.n).padStart(2, "0")}.html`,
      };
      note.topics = ch.topics || deriveTopics(note);
      notes.push(note);
    });
  });

  if (agenticModules.length) {
    tracks.push({
      id: "agentic",
      title: "Language Models → Agentic AI",
      tagline: "The long path — foundations through production systems",
      hue: "ion",
      modules: agenticModules,
      count: agenticModules.reduce((s, m) => s + m.count, 0),
      written: agenticModules.reduce((s, m) => s + m.written, 0),
      planned: 0,
    });
  }

  /* --- tracks 2..n: outlined in content/syllabus.js --- */
  ((window.SYLLABUS && window.SYLLABUS.tracks) || []).forEach((t) => {
    const trackModules = [];

    t.modules.forEach((m, mi) => {
      const mod = {
        id: m.id,
        track: t.id,
        n: mi + 1,
        title: m.title,
        tagline: m.tagline,
        hue: t.hue,
        count: m.lessons.length,
        written: 0,
        planned: m.lessons.length,
      };
      trackModules.push(mod);
      modules.push(mod);

      m.lessons.forEach((title, li) => {
        const note = {
          id: `${m.id}-${slug(title)}`,
          n: li + 1,
          title,
          short: "",
          track: t.id,
          trackTitle: t.title,
          module: m.id,
          moduleTitle: m.title,
          moduleN: mi + 1,
          hue: t.hue,
          status: "planned",
          href: null,
          context: `${m.title} ${m.tagline || ""} ${t.title}`,
        };
        note.topics = deriveTopics(note);
        notes.push(note);
      });
    });

    tracks.push({
      id: t.id,
      title: t.title,
      tagline: t.tagline,
      hue: t.hue,
      modules: trackModules,
      count: trackModules.reduce((s, m) => s + m.count, 0),
      written: 0,
      planned: trackModules.reduce((s, m) => s + m.planned, 0),
    });
  });

  /* --- imported notes: scanned pages, not yet filed --- */
  (window.NOTES || []).forEach((raw) => {
    const note = Object.assign(
      { status: "written", track: "notebook", trackTitle: "Notebook", module: null, moduleTitle: null, hue: "amber" },
      raw
    );
    note.topics = raw.topics || deriveTopics(note);
    if (!note.href) note.href = `notes/${note.id}.html`;
    notes.push(note);
  });

  const loose = notes.filter((n) => n.track === "notebook");
  if (loose.length) {
    tracks.push({
      id: "notebook",
      title: "Notebook",
      tagline: "Imported pages not yet filed into a module",
      hue: "amber",
      modules: [],
      count: loose.length,
      written: loose.length,
      planned: 0,
    });
  }

  /* ---- backfill from the module ------------------------------
     Some titles carry no signal at all on their own — "CIFAR-10",
     "cat, stack", "Video Data". Chasing those with ever more
     keywords is a losing game, and leaving them untagged drops
     them out of every facet and off the concept graph.

     So: a note with no topics of its own inherits the two topics
     that dominate its module. A lesson sitting among convolution
     and image lessons is a vision lesson, and saying so is a fair
     inference rather than a guess. Notes that tagged themselves
     are never touched. */
  const moduleTopicRank = {};
  notes.forEach((n) => {
    if (!n.module || !n.topics.length) return;
    const tally = (moduleTopicRank[n.module] = moduleTopicRank[n.module] || {});
    n.topics.forEach((t, i) => (tally[t] = (tally[t] || 0) + (n.topics.length - i)));
  });

  /* Top up to two, not just fill empties. A note carrying a single
     topic can never form an edge — relations need an overlap of two
     — so it drops off the concept graph entirely no matter how
     obviously it belongs beside its neighbours. Two is the floor
     that makes a note connectable at all. */
  const MIN_TOPICS = 2;

  notes.forEach((n) => {
    if (n.topics.length >= MIN_TOPICS || !n.module) return;
    const tally = moduleTopicRank[n.module];
    if (!tally) return;

    const inherited = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)
      .filter((t) => !n.topics.includes(t));

    n.borrowed = n.borrowed || [];
    while (n.topics.length < MIN_TOPICS && inherited.length) {
      const t = inherited.shift();
      n.topics.push(t);
      n.borrowed.push(t);
      n.inheritedTopics = true;
    }
  });

  const byId = Object.fromEntries(notes.map((n) => [n.id, n]));
  const trackById = Object.fromEntries(tracks.map((t) => [t.id, t]));
  const moduleById = Object.fromEntries(modules.map((m) => [m.id, m]));

  /* ---- topic index ---- */
  const topicCounts = {};
  notes.forEach((n) => n.topics.forEach((t) => (topicCounts[t] = (topicCounts[t] || 0) + 1)));
  const topics = TOPICS.filter((t) => topicCounts[t.id]).map((t) => ({
    id: t.id,
    label: t.label,
    count: topicCounts[t.id],
  }));

  /* ---- relations ---------------------------------------------
     Two notes are related when they share topics. The topography
     view thresholds on weight so the graph shows structure rather
     than a hairball. Cross-track edges are the interesting ones —
     they are where system design and inference turn out to be the
     same subject wearing different clothes. */
  function relations({ minWeight = 2, scope = null } = {}) {
    const pool = scope ? notes.filter((n) => n.track === scope) : notes;
    const edges = [];
    for (let i = 0; i < pool.length; i++) {
      for (let j = i + 1; j < pool.length; j++) {
        const a = pool[i];
        const b = pool[j];
        let shared = 0;
        let owned = 0;
        for (const t of a.topics) {
          if (!b.topics.includes(t)) continue;
          shared++;
          // "own" means the note's own words produced this topic, rather
          // than it being borrowed from the module to make the note
          // connectable at all
          const aOwns = !(a.borrowed || []).includes(t);
          const bOwns = !(b.borrowed || []).includes(t);
          if (aOwns || bOwns) owned++;
        }

        /* An edge needs at least one topic that one side actually
           earned. Without this, every note in a module that borrowed
           the same two topics links to every other one, and the map
           fills with dense balls that encode nothing but "these
           happen to sit in the same folder". */
        if (shared >= minWeight && owned >= 1) {
          edges.push({ source: a.id, target: b.id, weight: shared, crossTrack: a.track !== b.track });
        }
      }
    }
    return edges;
  }

  /* ---- search / facets ---- */
  function search(query, { topics: wantTopics = [], module = null, track = null, status = null } = {}) {
    const q = String(query || "").trim().toLowerCase();
    let out = notes;

    if (track) out = out.filter((n) => n.track === track);
    if (module) out = out.filter((n) => n.module === module);
    if (status) out = out.filter((n) => n.status === status);
    if (wantTopics.length) out = out.filter((n) => wantTopics.every((t) => n.topics.includes(t)));

    if (!q) return out.slice();

    return out
      .map((n) => {
        const title = n.title.toLowerCase();
        const short = String(n.short || "").toLowerCase();
        let score = 0;
        if (title.includes(q)) score += title.startsWith(q) ? 100 : 60;
        if (short.includes(q)) score += 25;
        if (String(n.moduleTitle || "").toLowerCase().includes(q)) score += 15;
        if (n.topics.some((t) => TOPIC_BY_ID[t] && TOPIC_BY_ID[t].label.toLowerCase().includes(q))) score += 20;
        if (n.status === "written" && plainText(n.explain).includes(q)) score += 8;

        /* The "written beats planned" bonus is a tiebreak between two
           notes that both matched — it must never be added to a note
           that matched nothing, or every written note scores above
           zero and the search returns the whole library. */
        if (score > 0 && n.status === "written") score += 5;

        return { n, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.n.title.localeCompare(b.n.title))
      .map((r) => r.n);
  }

  const written = notes.filter((n) => n.status === "written").length;

  return {
    notes,
    tracks,
    modules,
    topics,
    byId: (id) => byId[id],
    track: (id) => trackById[id],
    module: (id) => moduleById[id],
    notesIn: (moduleId) => notes.filter((n) => n.module === moduleId),
    topicLabel: (id) => (TOPIC_BY_ID[id] ? TOPIC_BY_ID[id].label : id),
    search,
    relations,
    deriveTopics,
    counts: {
      tracks: tracks.length,
      modules: modules.length,
      notes: notes.length,
      topics: topics.length,
      written,
      planned: notes.length - written,
    },
  };
})();
