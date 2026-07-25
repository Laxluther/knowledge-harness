/* ============================================================
   Content data — Part III: Retrieval-Augmented Generation
   Single source of truth rendered by BOTH the gamified quest
   pages and the Simple-mode revise page.
   ============================================================ */

window.PART_DATA = {
  id: "part-3",
  index: 3,
  title: "Retrieval-Augmented Generation",
  tagline: "Every RAG variant, every pipeline step, especially the ones people skip",
  color: "ion",
  mapViewBox: "0 0 1000 1650",
  edges: [
    ["p3-c1", "p3-c2"],
    ["p3-c2", "p3-c3"],
    ["p3-c3", "p3-c4"],
    ["p3-c4", "p3-c5"],
    ["p3-c5", "p3-c6"],
    ["p3-c6", "p3-c7"],
    ["p3-c7", "p3-c8"],
  ],
  badges: {
    first: { id: "p3-first", label: "First Retrieval — completed your first RAG chapter" },
    complete: { id: "p3-complete", label: "Retrieval Architect — cleared all of Part III" },
  },
  chapters: [
    {
      id: "p3-c1",
      n: 1,
      title: "Why Retrieval — The Case for RAG",
      short: "Grounding generation in evidence, not just memory",
      requires: [],
      xp: 90,
      node: { x: 500, y: 90 },
      diagram: {
        type: "compare",
        query: "What was Acme Corp's exact Q3 2025 revenue?",
        left: {
          label: "Closed-book (parametric only)",
          stages: ["Search only the frozen weights", "No source for private / new data", "Best guess"],
          outcome: { icon: "✕", text: "fabricates a plausible-sounding number", kind: "miss" },
        },
        right: {
          label: "Open-book (RAG)",
          stages: ["Retrieve the actual filing", "Insert as context", "Answer grounded in evidence"],
          outcome: { icon: "✓", text: "quotes the real figure, with a citation", kind: "match" },
        },
      },
      diagram2: {
        type: "crew",
        task: "What was Acme Corp's exact Q3 2025 revenue?",
        nodes: [
          { id: "llm", label: "LLM", role: "captain", tier: 0 },
          { id: "kb", label: "Company Filings", role: "board", tier: 1 },
        ],
        flow: [{ from: "llm", to: "kb" }],
        roundTrip: true,
        statusSteps: [
          "LLM doesn't actually know this — it wasn't in training",
          "Sends a retrieval agent out to fetch it",
          "Agent finds the real filing and grabs the figure",
          "Returns it to the LLM",
          "LLM answers, grounded in the real document",
        ],
      },
      hook: "<p>LLMs are frozen the moment training ends, and they'll answer confidently whether or not they actually know. RAG is the fix that lets a model look something up instead of guessing.</p>",
      explain: `<p>A model's <strong>parametric knowledge</strong> — everything baked into its weights during pretraining — has two hard limits. It has a <strong>knowledge cutoff</strong>: anything that happened after training data was collected is simply invisible to it. And it has <strong>imperfect recall</strong>: facts are compressed lossily across billions of parameters, so obscure or long-tail information is often reconstructed wrong with full confidence — this is a major source of <strong>hallucination</strong>.</p>
      <p><strong>Retrieval-Augmented Generation</strong> (Lewis et al., 2020) addresses this by giving the model access to an external, updatable knowledge source at the moment of answering: retrieve the passages relevant to a query, then feed them into the model's context alongside the question, so generation is grounded in retrieved evidence rather than memory alone. This turns <strong>closed-book</strong> generation (answer from memory) into <strong>open-book</strong> generation (answer with the reference material in front of you).</p>
      <p>RAG specifically targets three failure modes: a <strong>knowledge cutoff</strong> (events after training), <strong>long-tail facts</strong> (rare information poorly memorized), and <strong>private or proprietary data</strong> (a company's internal docs were never in the training set, and for cost and confidentiality reasons, often shouldn't be). Compare this to fine-tuning (Part I, Chapter 5): fine-tuning bakes new behavior into the weights — expensive, static once trained, and unable to cite its sources. RAG keeps knowledge external and swappable — updating the index is cheap, and every answer can point back to exactly which passage it came from. The two are complementary: fine-tuning shapes <em>how</em> a model behaves, RAG supplies <em>what</em> it currently knows.</p>`,
      analogy:
        "<p>Fine-tuning is sending someone through years of schooling until facts become part of who they are. RAG is handing them a reference book to consult at the exact moment they need it — updatable overnight, and open to inspection afterward.</p>",
      example:
        "<p>Asked for Acme Corp's exact Q3 2025 revenue, a base LLM has nothing to draw on but statistical plausibility — it will produce a confident-sounding number that is simply invented. A RAG system instead retrieves the actual filing text and inserts it as context, so the model quotes the real figure instead of fabricating one — and can point to the source paragraph it came from.</p>",
      takeaways: [
        "Parametric knowledge has a hard cutoff and imperfect recall, which is a major source of hallucination on unseen or under-represented facts.",
        "RAG grounds generation in retrieved, external, updatable evidence instead of relying purely on memorized weights.",
        "RAG is the right tool for knowledge-cutoff, long-tail, and private/proprietary data; fine-tuning is the right tool for teaching behavior and format.",
        "RAG and fine-tuning are complementary — most serious production systems eventually use both.",
      ],
      quiz: [
        {
          q: "What causes an LLM to hallucinate a confident but wrong answer about a fact it was never trained on well?",
          options: [
            "A bug in the tokenizer",
            "Parametric knowledge has a training cutoff and imperfect, lossy recall of long-tail facts",
            "The model refuses to answer",
            "RAG was not disabled",
          ],
          answer: 1,
          explain: "Weights compress the training corpus lossily; obscure facts are reconstructed with false confidence rather than flagged as unknown.",
        },
        {
          q: "What does RAG fundamentally add to generation?",
          options: [
            "A larger vocabulary",
            "Retrieved, external, updatable evidence inserted into the context at answer time",
            "A second language model for translation",
            "A faster tokenizer",
          ],
          answer: 1,
          explain: "RAG turns closed-book generation (memory only) into open-book generation (memory plus retrieved reference material).",
        },
        {
          q: "Which scenario is RAG specifically well-suited for, versus fine-tuning?",
          options: [
            "Teaching the model a new response tone",
            "Answering questions about a company's private internal documents that change weekly",
            "Making the model refuse harmful requests",
            "Making the model faster at inference",
          ],
          answer: 1,
          explain: "Private, frequently-changing data is exactly the case where an updatable external index beats baking facts into frozen weights.",
        },
        {
          q: "Why are RAG and fine-tuning described as complementary rather than competing?",
          options: [
            "They can't be used in the same system",
            "Fine-tuning shapes behavior/format while RAG supplies current, external factual grounding",
            "RAG replaces the need for a language model entirely",
            "Fine-tuning is always strictly better",
          ],
          answer: 1,
          explain: "Production systems commonly fine-tune for role/behavior and use RAG for up-to-date or private factual content.",
        },
        {
          q: "What is the key difference between \"closed-book\" and \"open-book\" generation?",
          options: [
            "Closed-book is faster because it always skips retrieval",
            "Open-book generation retrieves and inserts reference material before answering; closed-book relies on memory alone",
            "There is no real difference",
            "Open-book generation never uses an LLM",
          ],
          answer: 1,
          explain: "This is the exam analogy made literal — RAG hands the model the reference material at question time instead of testing pure recall.",
        },
      ],
    },
    {
      id: "p3-c2",
      n: 2,
      title: "The RAG Pipeline End-to-End",
      short: "The full assembly line — and where naive RAG cuts corners",
      requires: ["p3-c1"],
      xp: 90,
      node: { x: 300, y: 300 },
      diagram: {
        type: "pipeline",
        stages: ["Ingest + parse", "Chunk", "Embed", "Index", "Query transform", "Retrieve", "Rerank", "Generate + cite"],
      },
      diagram2: {
        type: "crew",
        task: "What was Acme Corp's exact Q3 2025 revenue?",
        nodes: [
          { id: "sys", label: "RAG System", role: "captain", tier: 0 },
          { id: "ingest", label: "Ingest", role: "board", tier: 1 },
          { id: "chunk", label: "Chunk", role: "board", tier: 1 },
          { id: "embed", label: "Embed", role: "board", tier: 2 },
          { id: "index", label: "Index", role: "board", tier: 2 },
          { id: "rewrite", label: "Rewrite", role: "board", tier: 3 },
          { id: "retrieve", label: "Retrieve", role: "board", tier: 3 },
          { id: "rerank", label: "Rerank", role: "board", tier: 4 },
          { id: "generate", label: "Generate", role: "board", tier: 4 },
        ],
        flow: [
          { from: "sys", to: "ingest" },
          { from: "ingest", to: "chunk" },
          { from: "chunk", to: "embed" },
          { from: "embed", to: "index" },
          { from: "index", to: "rewrite" },
          { from: "rewrite", to: "retrieve" },
          { from: "retrieve", to: "rerank" },
          { from: "rerank", to: "generate" },
        ],
        roundTrip: true,
        statusSteps: [
          "Raw filings, PDFs and pages come in",
          "Parsed and split into retrievable chunks",
          "Each chunk is embedded into a vector",
          "Vectors land in the index, ready to be searched",
          "The raw question is rewritten into a sharper search query",
          "Top candidate chunks are retrieved from the index",
          "Candidates are reranked by finer-grained relevance",
          "Answer is generated, grounded in the reranked context — with a citation",
          "Grounded, cited answer flows back to the system",
        ],
      },
      hook: "<p>Before going deep on any single stage, see the whole assembly line — because the steps people skip when first prototyping are exactly the ones that quietly cap retrieval quality.</p>",
      explain: `<p>A real RAG system has roughly ten distinct stages: <strong>ingestion</strong> (collect raw source documents), <strong>parsing/cleaning</strong> (extract clean text and structure from PDFs, HTML, tables), <strong>chunking</strong> (split into retrievable units — Chapter 3), <strong>embedding</strong> (turn each chunk into a vector — Chapter 4), <strong>indexing</strong> (store vectors with metadata for fast search — Chapter 4), <strong>query processing</strong> (transform the user's raw question into a better search query — Chapter 5, and the first commonly-skipped step), <strong>retrieval</strong> (fetch candidate chunks — Chapter 5), <strong>reranking</strong> (reorder by finer-grained relevance — Chapter 6, the second commonly-skipped step), <strong>context construction</strong> (dedupe, order, and cite the assembled evidence — Chapter 6), and finally <strong>generation</strong> (the LLM answers, conditioned on that context), followed by ongoing <strong>evaluation and monitoring</strong> (Chapter 8).</p>
      <p>The critical insight this chapter exists to make explicit: a RAG system's answer quality is bounded by its <em>worst</em> stage, not its best. A frontier LLM fed badly-chunked, unranked, unfiltered context will still produce weak or hallucinated answers — the model can only work with what it's handed.</p>
      <p>This gives us useful vocabulary for the rest of the book. <strong>Naive RAG</strong> is the bare minimum — chunk, embed, index, retrieve top-k, generate — with no query transformation and no reranking. It's what most tutorials show, and it's fragile on anything but simple, well-phrased factual questions. <strong>Advanced RAG</strong> adds the pre-retrieval optimizations (query transformation) and post-retrieval optimizations (reranking, compression) that naive RAG skips. <strong>Modular RAG</strong> goes further, building the pipeline from swappable, independently upgradable components with routing logic between them, rather than one fixed chain.</p>`,
      analogy:
        "<p>RAG is a factory assembly line for answers. Skip the quality-inspection station (reranking) or the order-taking station (query transformation), and the defect still shows up in the final product — even if the very last machine on the line is state-of-the-art.</p>",
      example:
        "<p>A team ships \"naive RAG\": chunk, embed, retrieve the top 3, stuff them into the prompt, generate. It performs well in the demo on simple factual questions, then quietly fails on ambiguous or multi-part ones — because there's no query rewriting to disambiguate the question and no reranking to filter out near-miss chunks. Nothing crashes; the answers just get subtly worse, which is the most common way real RAG systems fail.</p>",
      takeaways: [
        "RAG is a pipeline of roughly ten distinct stages, not just \"embed and retrieve.\"",
        "Answer quality is bounded by the weakest stage in the chain, not by how good the LLM itself is.",
        "\"Naive RAG\" skips query transformation and reranking — the two most commonly missed upgrades.",
        "\"Advanced RAG\" adds pre-retrieval and post-retrieval optimization; \"Modular RAG\" makes the whole pipeline swappable and routable.",
      ],
      quiz: [
        {
          q: "Why can a state-of-the-art LLM still produce a weak RAG answer?",
          options: [
            "The LLM is too large",
            "Answer quality is bounded by the weakest pipeline stage — bad chunking or retrieval limits what the model can work with",
            "The LLM always ignores retrieved context",
            "RAG doesn't work with large models",
          ],
          answer: 1,
          explain: "The generator can only reason over what it's handed; every upstream stage caps the ceiling on the final answer.",
        },
        {
          q: "What defines \"naive RAG\" as this chapter uses the term?",
          options: [
            "A RAG system that uses no embeddings at all",
            "Chunk, embed, index, retrieve top-k, generate — with no query transformation and no reranking",
            "A RAG system that only works on short documents",
            "A RAG system with no vector database",
          ],
          answer: 1,
          explain: "Naive RAG is the bare-minimum pipeline most tutorials demonstrate, missing both commonly-skipped optimization stages.",
        },
        {
          q: "Where does query processing/transformation happen in the pipeline, and why does its position matter?",
          options: [
            "After generation, to fix the final answer",
            "Before retrieval — it improves the search query itself, so skipping it means retrieval starts from a worse query",
            "It replaces chunking entirely",
            "It only matters for sparse retrieval",
          ],
          answer: 1,
          explain: "Query transformation is a pre-retrieval stage; if skipped, every later stage inherits a suboptimal search query.",
        },
        {
          q: "What distinguishes \"Advanced RAG\" from \"naive RAG\"?",
          options: [
            "Advanced RAG uses a bigger LLM",
            "Advanced RAG adds pre-retrieval (query transformation) and post-retrieval (reranking, compression) optimization stages",
            "Advanced RAG skips chunking",
            "Advanced RAG never uses a vector database",
          ],
          answer: 1,
          explain: "The extra stages naive RAG omits are precisely what \"advanced\" adds back in.",
        },
        {
          q: "What does \"Modular RAG\" add on top of Advanced RAG?",
          options: [
            "Nothing — they are the same thing",
            "Swappable, independently upgradable components with routing logic between them, instead of one fixed chain",
            "A requirement to use exactly one embedding model forever",
            "Removal of the generation stage",
          ],
          answer: 1,
          explain: "Modular RAG treats each stage as a replaceable component with routing decisions, rather than a rigid linear pipeline.",
        },
      ],
    },
    {
      id: "p3-c3",
      n: 3,
      title: "Chunking Strategies",
      short: "The quiet decision that caps everything downstream",
      requires: ["p3-c2"],
      xp: 100,
      node: { x: 700, y: 510 },
      diagram: {
        type: "compare",
        query: "How much does the Enterprise plan cost?",
        left: {
          label: "Fixed-size chunking",
          stages: ["Cut every 500 characters", "Ignores structure", "Splits a pricing row mid-table"],
          outcome: { icon: "✕", text: "\"Enterprise plan\" and \"$40,000/yr\" end up in different chunks", kind: "miss" },
        },
        right: {
          label: "Structure-aware chunking",
          stages: ["Split on headers / paragraphs", "Fixed-size fallback only if a block is huge", "Table stays intact"],
          outcome: { icon: "✓", text: "the whole pricing row is retrievable as one unit", kind: "match" },
        },
      },
      hook: "<p>How you cut the text before anything else happens quietly determines the ceiling on your entire system's retrieval quality.</p>",
      explain: `<p>Documents are chunked because they're too long to embed as a single vector (one vector can't represent fifty pages without losing all granularity) and too long to stuff into every prompt wholesale. Chunking creates the addressable, retrievable units everything else operates on.</p>
      <p><strong>Fixed-size chunking</strong> splits every N tokens or characters — simple and fast, but structurally blind: it can slice a sentence, a table row, or a code block right down the middle, destroying the meaning that was supposed to be retrieved. <strong>Recursive / structure-aware chunking</strong> splits along natural boundaries first — paragraphs, sections, markdown headers — falling back to a fixed-size cut only when a block is too large on its own, preserving far more semantic integrity. <strong>Semantic chunking</strong> goes further, using embedding similarity between adjacent sentences to detect topic shifts and cutting exactly there, so each chunk stays topically coherent rather than arbitrarily sized.</p>
      <p><strong>Overlap</strong> — letting adjacent chunks share a small window of tokens, typically 10–20% — is a commonly-missed detail: without it, a fact that straddles a chunk boundary can become effectively unretrievable no matter how the query is phrased, because neither chunk alone contains the complete idea.</p>
      <p>Chunk size is a genuine tradeoff. Smaller chunks give more precise retrieval (less irrelevant text diluting each chunk's embedding) but lose surrounding context and multiply the number of vectors to search. Larger chunks preserve more context but dilute the embedding's relevance signal and cost more tokens once retrieved. Most production systems land somewhere in the 200–500 token range, tuned empirically per corpus.</p>
      <p>Finally, every chunk should carry <strong>metadata</strong> — source document, section title, page number, date — not just for citation, but to enable <strong>metadata filtering</strong> at retrieval time (e.g. "only search documents from 2024 onward"). This is another detail beginners often skip, treating the vector index as the only source of truth.</p>`,
      analogy:
        "<p>Fixed-size chunking is tearing a book into pages by ruler-measured thickness, sometimes slicing straight through a sentence. Structure-aware chunking is tearing along the chapter breaks that were already there.</p>",
      example:
        "<p>A 500-character fixed chunk boundary lands mid-row inside a pricing table, separating \"Enterprise plan\" from \"$40,000/year\" into two different chunks. A user asking \"how much does the Enterprise plan cost\" retrieves the chunk with the label but not the number — and the model either admits it doesn't know, or worse, hallucinates a plausible price to fill the gap.</p>",
      takeaways: [
        "Chunking is a make-or-break step — every downstream stage retrieves and reasons over these chunks, never the original document.",
        "Fixed-size chunking is simple but structurally blind; structure-aware and semantic chunking preserve meaning at some extra complexity.",
        "Overlap between adjacent chunks prevents facts straddling a boundary from becoming unretrievable — a commonly-skipped detail.",
        "Chunk size is a precision/context tradeoff, typically tuned in the 200–500 token range.",
        "Attaching metadata to every chunk enables filtering and citation — core functionality, not optional polish.",
      ],
      quiz: [
        {
          q: "Why is fixed-size chunking risky despite being the simplest approach?",
          options: [
            "It's too slow to compute",
            "It's structurally blind and can split a sentence, table row, or fact right down the middle",
            "It only works on very short documents",
            "It requires a GPU to run",
          ],
          answer: 1,
          explain: "Cutting purely by character/token count ignores document structure entirely, which can destroy meaning at the cut point.",
        },
        {
          q: "What problem does overlap between adjacent chunks solve?",
          options: [
            "It makes embedding faster",
            "It prevents a fact that straddles a chunk boundary from becoming unretrievable by either chunk alone",
            "It removes the need for metadata",
            "It reduces the total number of chunks",
          ],
          answer: 1,
          explain: "Without overlap, information split across a hard boundary can end up incomplete in both neighboring chunks.",
        },
        {
          q: "What is the core tradeoff in choosing chunk size?",
          options: [
            "Smaller chunks are always strictly better",
            "Smaller chunks give more precise retrieval but lose context; larger chunks keep context but dilute relevance signal and cost more tokens",
            "Chunk size has no effect on retrieval quality",
            "Larger chunks are always cheaper to retrieve",
          ],
          answer: 1,
          explain: "This precision-vs-context tradeoff is why chunk size is tuned empirically per corpus rather than fixed universally.",
        },
        {
          q: "What does semantic chunking use to decide where to cut?",
          options: [
            "A fixed character count only",
            "Embedding similarity between adjacent sentences, cutting where topics shift",
            "The file size of the document",
            "Random cut points",
          ],
          answer: 1,
          explain: "Semantic chunking detects topic boundaries via similarity drops between neighboring sentences, rather than an arbitrary length.",
        },
        {
          q: "Why does attaching metadata (date, source, section) to each chunk matter beyond citation?",
          options: [
            "It doesn't matter, metadata is just for display",
            "It enables metadata filtering at retrieval time, like restricting search to recent or authorized documents",
            "It makes chunks embed faster",
            "It replaces the need for chunking",
          ],
          answer: 1,
          explain: "Metadata filtering combines with vector similarity to enforce recency, permissions, and document type — pure similarity can't do this alone.",
        },
      ],
    },
    {
      id: "p3-c4",
      n: 4,
      title: "Embeddings & Vector Indexing",
      short: "Making millions of chunks searchable in milliseconds",
      requires: ["p3-c3"],
      xp: 100,
      node: { x: 500, y: 720 },
      diagram: {
        type: "pipeline",
        stages: ["Chunk text", "Embedding model", "Chunk vector", "ANN index (HNSW / IVF)", "Metadata store"],
      },
      diagram2: {
        type: "embed",
        points: [
          { label: "pricing", x: 22, y: 26, cluster: "animal" },
          { label: "billing", x: 30, y: 18, cluster: "animal" },
          { label: "refunds", x: 16, y: 38, cluster: "animal" },
          { label: "invoices", x: 26, y: 46, cluster: "animal" },
          { label: "2FA setup", x: 74, y: 62, cluster: "object" },
          { label: "password reset", x: 84, y: 56, cluster: "object" },
          { label: "login errors", x: 70, y: 78, cluster: "object" },
          { label: "onboarding", x: 50, y: 12, cluster: "verb" },
          { label: "team invites", x: 60, y: 18, cluster: "verb" },
        ],
      },
      hook: "<p>Part I, Chapter 2 embedded tokens. RAG needs the same idea applied to whole chunks — and then a way to search millions of them in milliseconds.</p>",
      explain: `<p>A <strong>chunk embedding</strong> is produced by an embedding model — often a dedicated one, separate from the generation LLM, such as OpenAI's text-embedding-3 or open models like BGE or E5 — that maps an entire chunk's text to one dense vector capturing its meaning. It's the same distributional principle from Part I, applied at passage granularity instead of token granularity.</p>
      <p>Comparing a query vector against millions of chunk vectors by brute force doesn't scale. This is where <strong>Approximate Nearest Neighbor (ANN)</strong> search comes in: algorithms like <strong>HNSW</strong> (Hierarchical Navigable Small World graphs) or <strong>IVF</strong> (Inverted File Index) trade a small amount of recall accuracy for enormous speed, making millisecond search over millions or billions of vectors practical without ever comparing against most of them.</p>
      <p>A <strong>vector database</strong> — Pinecone, Weaviate, Qdrant, Milvus, or pgvector as a Postgres extension — packages ANN indexing together with metadata storage, filtering, and update operations for production use. Combining vector similarity with structured <strong>metadata filtering</strong> (date range, document type, access permissions) is essential, not optional: a user should only retrieve documents they're authorized to see, and a query about current policy shouldn't surface a superseded 2019 version just because it's semantically similar. This is a commonly-missed capability when teams treat the vector index as the only source of truth.</p>
      <p>Unlike a model's frozen weights, a vector index can be updated <strong>incrementally</strong> as new documents arrive — but this needs an ingestion pipeline that re-chunks and re-embeds only what changed, upserts it, and deprecates stale entries, rather than rebuilding the entire index from scratch. Index freshness is a production concern that prototype-stage RAG systems frequently skip entirely, having only ever built the index once.</p>`,
      analogy:
        "<p>Brute-force nearest-neighbor search is checking every book in a library one at a time. An ANN index like HNSW is the library's floor-by-floor, shelf-by-shelf organization that lets you walk almost straight to the right shelf without checking the others.</p>",
      example:
        "<p>A support-docs RAG system embeds 200,000 help-article chunks. A user asks about resetting two-factor authentication — HNSW search returns the nearest ~50 candidates in a few milliseconds without ever comparing against most of the 200,000 vectors, and metadata filtering ensures only chunks from the current product version are even considered.</p>",
      math: [
        {
          expr: "cos(θ) = <span>q · c</span> ⁄ <span>‖q‖ ‖c‖</span>",
          note: "The same cosine similarity from Part I, Chapter 2 — now comparing a query vector <code>q</code> against a chunk vector <code>c</code> instead of two token vectors. It's the scoring function underneath dense retrieval in the next chapter.",
        },
      ],
      takeaways: [
        "Chunk embeddings apply the same distributional principle as token embeddings, at passage granularity, usually via a dedicated embedding model.",
        "ANN algorithms (HNSW, IVF) make millisecond search over millions of vectors possible by trading a little recall for a lot of speed.",
        "Vector databases combine ANN indexing with metadata storage and filtering for production use.",
        "Metadata filtering (permissions, dates, document type) is essential — pure vector similarity can't enforce access control or recency alone.",
        "A production index needs an incremental update strategy, not a one-time build — freshness is an ongoing pipeline concern.",
      ],
      quiz: [
        {
          q: "Why doesn't brute-force nearest-neighbor search scale to millions of chunk vectors?",
          options: [
            "Vectors can't be compared mathematically",
            "Comparing a query against every single vector directly becomes too slow at that scale",
            "Embeddings only work for small corpora",
            "Vector databases don't support brute force",
          ],
          answer: 1,
          explain: "Exhaustive comparison scales linearly with corpus size, which becomes impractical for millisecond search at millions/billions of vectors.",
        },
        {
          q: "What do ANN algorithms like HNSW trade off to achieve millisecond search?",
          options: [
            "They trade a small amount of recall accuracy for a large speed gain",
            "They trade embedding quality for storage space",
            "They trade chunk size for vocabulary size",
            "They eliminate the need for embeddings",
          ],
          answer: 0,
          explain: "ANN search finds approximately-nearest neighbors, not guaranteed-exact ones, in exchange for being dramatically faster.",
        },
        {
          q: "Why is metadata filtering essential alongside vector similarity search?",
          options: [
            "It makes embeddings smaller",
            "Pure similarity can't enforce access permissions, recency, or document type on its own",
            "It replaces the need for an embedding model",
            "It's only useful for debugging",
          ],
          answer: 1,
          explain: "A semantically similar but outdated or unauthorized document can rank highly on similarity alone — metadata filters are what exclude it.",
        },
        {
          q: "What does \"index freshness\" require that a one-time index build doesn't provide?",
          options: [
            "A bigger embedding model",
            "An incremental pipeline that re-chunks and re-embeds only changed documents and upserts/deprecates entries",
            "Switching to sparse retrieval",
            "Removing all metadata",
          ],
          answer: 1,
          explain: "Production corpora change continuously; the index needs an ongoing update strategy, not a single initial build.",
        },
        {
          q: "cos(θ) = (q·c)/(‖q‖‖c‖) is used to compare what, in this chapter's context?",
          options: [
            "Two chunk sizes",
            "A query vector against a chunk vector, to score semantic relevance",
            "Two different LLMs",
            "The number of tokens in two documents",
          ],
          answer: 1,
          explain: "Cosine similarity between the query embedding and each chunk embedding is the core scoring function for dense retrieval.",
        },
      ],
    },
    {
      id: "p3-c5",
      n: 5,
      title: "Retrieval Strategies",
      short: "Dense, sparse, hybrid, and fixing the query before you search",
      requires: ["p3-c4"],
      xp: 110,
      node: { x: 300, y: 930 },
      diagram: {
        type: "compare",
        query: "error code E-4021 troubleshooting",
        left: {
          label: "Dense-only retrieval",
          stages: ["Embeds query semantically", "Blurs the exact code \"E-4021\"", "Ranks by general similarity"],
          outcome: { icon: "✕", text: "retrieves the E-4029 article instead — close, but wrong", kind: "miss" },
        },
        right: {
          label: "Hybrid (dense + BM25, RRF)",
          stages: ["Dense catches the semantic intent", "BM25 catches the exact \"E-4021\" match", "Reciprocal Rank Fusion merges both"],
          outcome: { icon: "✓", text: "correctly retrieves the E-4021 article", kind: "match" },
        },
      },
      hook: "<p>\"Retrieval\" isn't one algorithm — it's a decision between several, and the single most commonly-skipped upgrade is combining more than one.</p>",
      explain: `<p><strong>Dense retrieval</strong> embeds the query with the same embedding model used for chunks, then finds the nearest chunk vectors by cosine similarity. It's excellent at semantic matches — "car" retrieves passages about "automobile" — but can blur precise terms, since an embedding averages meaning across the whole span and exact codes, IDs, or names can get lost in that average.</p>
      <p><strong>Sparse retrieval</strong> (BM25, descended from TF-IDF) scores exact term overlap, weighted by how rare each term is across the corpus. It's excellent at exact matches — product codes, names, acronyms — but blind to synonyms and paraphrase, since it only sees literal tokens.</p>
      <p><strong>Hybrid search</strong> runs both and fuses the two ranked lists — commonly via <strong>Reciprocal Rank Fusion (RRF)</strong>, which combines rankings without needing their raw scores to be on comparable scales. This captures both semantic and exact-match strength at once, and is one of the single highest-leverage upgrades from naive (dense-only) RAG.</p>
      <p>All of this happens <em>after</em> the query itself may need fixing. <strong>Query transformation</strong>, a pre-retrieval step, exists because raw user questions are often poor search queries — ambiguous, underspecified, or phrased nothing like how the answer is actually written. <strong>Query rewriting/expansion</strong> clarifies or adds synonyms (often via an LLM call). <strong>HyDE</strong> (Hypothetical Document Embeddings) asks an LLM to write a hypothetical answer to the question, then embeds and searches with <em>that</em> — since an answer's phrasing tends to be closer to real answer passages than the terse question is. <strong>Multi-query</strong> generates several reworded versions of the question, retrieves for each, and merges the results. All three boost recall, and all three are frequently skipped entirely in naive implementations.</p>`,
      analogy:
        "<p>Dense retrieval is a librarian who understands what you mean. Sparse retrieval is a librarian who's memorized the exact catalog codes. Hybrid search is asking both and combining their answers instead of trusting just one.</p>",
      example:
        "<p>Asked to troubleshoot \"error code E-4021,\" dense-only retrieval can rank a semantically similar but wrong article — \"E-4029: connection timeout\" — above the correct one, since both are about errors and troubleshooting. BM25's exact match on \"E-4021\" would rank the correct article first on its own. Hybrid fusion combines both signals, so the exact code reinforces the semantic relevance instead of being diluted by it.</p>",
      math: [
        {
          expr: "BM25(D,Q) = Σ<sub>i</sub> IDF(q<sub>i</sub>) · <span>f(q<sub>i</sub>,D)·(k<sub>1</sub>+1)</span> ⁄ <span>f(q<sub>i</sub>,D) + k<sub>1</sub>·(1−b+b·|D|/avgdl)</span>",
          note: "The classic sparse-retrieval scoring function. <code>f(qᵢ,D)</code> is how often query term <code>qᵢ</code> appears in document D, weighted by its inverse document frequency (rarer terms count more) and normalized for document length; <code>k₁</code> and <code>b</code> are tuning constants controlling term-frequency saturation and length normalization.",
        },
        {
          expr: "RRFscore(d) = Σ<sub>r ∈ rankings</sub> <span>1</span> ⁄ <span>k + rank<sub>r</sub>(d)</span>",
          note: "<strong>Reciprocal Rank Fusion</strong>: for each ranked list (dense, sparse, ...), add 1/(k + its rank in that list) for document d, then sum across lists. Because it only uses rank position, not raw scores, it fuses lists whose scores aren't on comparable scales — exactly the dense-vs-BM25 situation.",
        },
      ],
      takeaways: [
        "Dense retrieval finds semantic/conceptual matches but can blur exact terms, codes, and names.",
        "Sparse retrieval (BM25) nails exact keyword matches but misses paraphrase and synonyms.",
        "Hybrid search (dense + sparse, fused via something like Reciprocal Rank Fusion) captures both — one of the highest-leverage upgrades from naive RAG.",
        "Query transformation (rewriting, HyDE, multi-query) happens before retrieval and fixes the fact that raw user questions are often bad search queries — a step naive RAG skips entirely.",
        "HyDE's trick: embed a hypothetical LLM-written answer instead of the bare question, since answers phrase things more like other answers do.",
      ],
      quiz: [
        {
          q: "What is dense retrieval's main weakness?",
          options: [
            "It can't run on GPUs",
            "It can blur exact terms, codes, or names because embeddings average meaning across the whole span",
            "It only works on short queries",
            "It requires no embedding model",
          ],
          answer: 1,
          explain: "Semantic averaging is exactly what makes dense retrieval good at synonyms and bad at exact-match precision.",
        },
        {
          q: "Why does hybrid search typically outperform either dense-only or sparse-only retrieval?",
          options: [
            "It's always the fastest option",
            "It combines semantic matching (dense) with exact-term matching (sparse), covering each one's blind spot",
            "It removes the need for a vector database",
            "It only uses BM25 internally",
          ],
          answer: 1,
          explain: "Fusing both ranked lists captures conceptual relevance and precise terminology at once, rather than picking one at the expense of the other.",
        },
        {
          q: "What problem does HyDE (Hypothetical Document Embeddings) solve?",
          options: [
            "It speeds up chunking",
            "Raw questions are phrased differently from answers, so it embeds an LLM-written hypothetical answer instead of the bare question",
            "It removes the need for reranking",
            "It replaces BM25 entirely",
          ],
          answer: 1,
          explain: "A hypothetical answer's phrasing tends to be much closer to real answer passages than a terse question is, improving retrieval.",
        },
        {
          q: "Why is Reciprocal Rank Fusion useful for combining dense and sparse result lists specifically?",
          options: [
            "It requires the two lists to use identical scoring scales",
            "It only uses each document's rank position in each list, so it works even when raw scores aren't comparable",
            "It only works with a single ranked list",
            "It discards the sparse results entirely",
          ],
          answer: 1,
          explain: "RRF sidesteps the score-scale mismatch between dense cosine similarity and BM25 scores by fusing on rank position alone.",
        },
        {
          q: "In BM25(D,Q), what does the IDF(qᵢ) term reward?",
          options: [
            "Longer documents",
            "Query terms that are rare across the corpus, since rare terms are more informative than common ones",
            "The total number of chunks",
            "The embedding model's dimensionality",
          ],
          answer: 1,
          explain: "Inverse document frequency down-weights common words and up-weights rare, distinctive ones — the core intuition behind sparse retrieval.",
        },
      ],
    },
    {
      id: "p3-c6",
      n: 6,
      title: "Reranking & Context Construction",
      short: "The expensive, precise second pass most demos skip",
      requires: ["p3-c5"],
      xp: 110,
      node: { x: 700, y: 1140 },
      diagram: {
        type: "bars",
        label: "Candidate chunk relevance, before → after reranking",
        bars: [
          { label: "chunk #7", value: 91 },
          { label: "chunk #1", value: 58 },
          { label: "chunk #12", value: 44 },
          { label: "chunk #3", value: 33 },
          { label: "chunk #29", value: 21 },
          { label: "…", value: 14 },
        ],
      },
      hook: "<p>Retrieval gets you a rough shortlist fast. Reranking is the expensive-but-precise second pass that decides what the model actually sees — and it's the step most beginner RAG systems skip entirely.</p>",
      explain: `<p>The bi-encoders used for initial retrieval embed the query and each chunk <em>separately</em> and compare the resulting vectors — fast and scalable to millions of chunks, but less precise, because the query and chunk text never actually interact during scoring. <strong>Cross-encoders</strong>, used for reranking, instead feed the query and one candidate chunk <em>together</em> into a single model that scores their joint relevance directly. This is far more accurate, because the model can attend across both texts at once — but it's too slow to run over an entire corpus, so it's only practical on a small shortlist, typically reranking the top 30–50 candidates down to the best 3–5.</p>
      <p>This two-stage <strong>retrieve-then-rerank</strong> pattern — fast and approximate first, slow and precise second — is standard production practice, and skipping it is the single most common gap in naive RAG demos. Without it, a genuinely relevant chunk that happened to rank #7 or #12 by rough embedding similarity can simply never make it into a top-3 context window, and the system silently fails on a question it actually had the answer for.</p>
      <p>Reranking also has to contend with the <strong>"lost in the middle"</strong> problem: LLMs empirically attend more reliably to information at the very start or end of a long context than to content buried in the middle. So after reranking narrows down the best chunks, their <em>order</em> in the final prompt matters — the most relevant chunks belong near the beginning and/or end, not scattered arbitrarily.</p>
      <p>Context construction rounds out the stage: <strong>deduplication</strong> (multiple retrieved chunks sometimes restate the same fact, wasting tokens and potentially confusing the model), optional <strong>compression</strong> (extracting just the relevant sentences from a long chunk before insertion), and <strong>citation tagging</strong> (marking each chunk with a source reference like [1] so the final answer can point back to exactly where a claim came from, enabling verification).</p>`,
      analogy:
        "<p>Retrieval is a metal detector sweeping a beach, flagging fifty spots that might have something. Reranking is digging carefully at just those fifty spots to find the actual coins and rank them by value — you wouldn't dig the whole beach, but you also wouldn't trust the detector's rough beep alone.</p>",
      example:
        "<p>A user asks a legal-docs RAG system about a specific liability clause. Initial dense retrieval returns the correct clause at rank #7 out of 50 candidates, buried below more generic contract boilerplate that happened to score deceptively high on embedding similarity. A cross-encoder reranker reads each candidate jointly with the query and correctly promotes the real clause to rank #1. Without reranking, if only the unranked top-3 had been kept, the actual answer would have been silently dropped before generation ever saw it.</p>",
      takeaways: [
        "Bi-encoders (fast, separate embeddings) retrieve a shortlist; cross-encoders (slow, joint scoring) rerank it for precision — a two-stage pattern beginners frequently skip.",
        "Skipping reranking risks silently dropping the correct chunk if it wasn't in the top few by rough similarity alone.",
        "\"Lost in the middle\": LLMs read the start and end of a context more reliably than the middle, so chunk order after reranking matters.",
        "Context construction includes deduplication, optional compression, and citation tagging — not just concatenating retrieved text.",
        "This is the difference between \"found the right document\" and \"the model actually used it correctly.\"",
      ],
      quiz: [
        {
          q: "Why are cross-encoders more accurate than bi-encoders but unusable over an entire corpus?",
          options: [
            "Cross-encoders don't use neural networks",
            "They score the query and chunk jointly (more accurate) but must run once per candidate, so they only scale to a small shortlist",
            "Cross-encoders only work on short documents",
            "Bi-encoders are always more accurate",
          ],
          answer: 1,
          explain: "Joint scoring lets the model attend across both texts, but that per-pair cost is only affordable on a narrowed-down shortlist.",
        },
        {
          q: "What's the risk of skipping reranking entirely?",
          options: [
            "Retrieval becomes faster",
            "A genuinely relevant chunk ranked outside the top few by rough similarity can be silently dropped before generation",
            "The vector database stops working",
            "Chunking quality decreases",
          ],
          answer: 1,
          explain: "Without a precise second pass, only whatever the fast first-pass approximation ranked highly ever reaches the model.",
        },
        {
          q: "What does the \"lost in the middle\" finding imply for context construction?",
          options: [
            "Chunk order doesn't matter once reranking is done",
            "The most relevant chunks should be placed near the start and/or end of the assembled context, not buried in the middle",
            "Only one chunk should ever be included",
            "Reranking should be skipped",
          ],
          answer: 1,
          explain: "LLMs attend less reliably to mid-context content, so where a reranked chunk is placed in the final prompt still matters.",
        },
        {
          q: "Why is deduplication part of context construction?",
          options: [
            "It's purely cosmetic",
            "Multiple retrieved chunks can restate the same fact, wasting tokens and potentially confusing the model",
            "It replaces the need for chunking",
            "It only matters for sparse retrieval",
          ],
          answer: 1,
          explain: "Redundant chunks eat into the context budget without adding information, and can even skew the model toward over-weighting a repeated claim.",
        },
        {
          q: "What is the retrieve-then-rerank pattern?",
          options: [
            "Running reranking before any retrieval happens",
            "A fast, approximate retrieval pass to get a shortlist, followed by a slower, precise rerank of just that shortlist",
            "Retrieving twice with the same method",
            "Skipping retrieval and reranking directly",
          ],
          answer: 1,
          explain: "This two-stage design balances scalability (fast first pass) with precision (slow second pass on a narrowed set).",
        },
      ],
    },
    {
      id: "p3-c7",
      n: 7,
      title: "Advanced & Agentic RAG",
      short: "When retrieval checks its own work and retrieves again",
      requires: ["p3-c6"],
      xp: 120,
      node: { x: 500, y: 1350 },
      diagram: {
        type: "reward",
        prompt: "Where did Acme Corp move its HQ in 2023, and what's that city's population?",
        a: { text: "Single-shot retrieval: embed the whole question at once and retrieve.", score: 24 },
        b: { text: "Multi-hop agentic retrieval: retrieve the HQ move, extract the city, then retrieve its population.", score: 90 },
        steps: [18, 35, 52, 71, 86, 94],
      },
      hook: "<p>Everything so far is \"retrieve once, generate once.\" Real systems increasingly retrieve, check their own work, and retrieve again — RAG folded into an agent loop.</p>",
      explain: `<p><strong>Naive RAG</strong> — one retrieval pass, straight into generation, no self-checking — works for simple factual queries and breaks down on complex, ambiguous, or multi-part ones. Several strategies fix this.</p>
      <p><strong>Self-RAG</strong> trains or prompts the model to make explicit decisions during the process: does this query even need retrieval, is this retrieved passage actually relevant, is my draft answer actually supported by it — making retrieval conditional and self-critiqued instead of automatic and blind. <strong>Corrective RAG (CRAG)</strong> adds a lightweight evaluator after retrieval that grades chunks as correct, ambiguous, or incorrect; on low confidence, it falls back to a broader search — such as live web search — instead of feeding weak context to the generator. <strong>Adaptive RAG</strong> routes each query dynamically: a simple factual question might skip retrieval entirely and answer from parametric memory (cheaper, faster), while a complex one triggers multi-step retrieval, based on a learned or prompted complexity classifier.</p>
      <p><strong>Multi-hop / iterative retrieval</strong> handles questions requiring chained reasoning — "what's the population of the city Company X moved its headquarters to in 2023?" A single retrieval pass can't answer this, because the query for the second fact doesn't exist until the first fact is resolved: retrieve the HQ move, extract the new city, then retrieve that city's population.</p>
      <p><strong>GraphRAG</strong> builds a knowledge graph of entities and relationships extracted from the corpus, rather than relying only on flat chunk vectors — enabling retrieval that follows explicit relationships ("who reports to whom," "which contracts reference which clause") that pure similarity search handles poorly, and enabling higher-level summarization by traversing graph communities.</p>
      <p>Finally, <strong>agentic RAG</strong> exposes retrieval to an LLM agent as a callable tool — this is the direct bridge to Part IV of this book — rather than a fixed pipeline stage. The agent decides <em>when</em> to retrieve, reformulates its <em>own</em> queries, chains multiple retrieval calls, and combines retrieval with other tools as part of a broader reasoning loop.</p>`,
      analogy:
        "<p>Naive RAG is asking a librarian a question and taking whatever they hand you the first time. Agentic and corrective RAG is a librarian who checks whether what they found actually answers your question — and if not, goes back and searches again, possibly down a completely different aisle.</p>",
      example:
        "<p>Asked for the population of the city Acme Corp moved its headquarters to in 2023, a single-pass system embeds the whole question at once — likely retrieving nothing useful, since no single passage contains both \"Acme's HQ move\" and \"that city's population.\" A multi-hop agentic system first retrieves the HQ-move announcement, extracts the new city's name, then issues a second retrieval for that city's population, and composes the final answer from both hops.</p>",
      takeaways: [
        "Naive RAG (one retrieval, no self-check) breaks down on complex, ambiguous, or multi-hop questions.",
        "Self-RAG and Corrective RAG add self-critique: deciding whether to retrieve, whether retrieved context is actually relevant, and falling back when it isn't.",
        "Adaptive RAG routes simple vs. complex queries differently instead of always retrieving the same way.",
        "Multi-hop retrieval chains multiple retrieval steps for questions where the second query doesn't exist until the first is answered.",
        "GraphRAG retrieves over explicit entity relationships, not just flat vector similarity.",
        "Agentic RAG treats retrieval as a tool an LLM agent calls on its own judgment — the direct bridge into agentic AI systems.",
      ],
      quiz: [
        {
          q: "Why does naive (single-pass) RAG struggle with multi-hop questions?",
          options: [
            "Multi-hop questions are always too short",
            "The query needed for the second fact doesn't exist until the first fact has been retrieved and resolved",
            "Naive RAG can't use embeddings",
            "Multi-hop questions never appear in real use",
          ],
          answer: 1,
          explain: "A single embed-and-retrieve pass can't chain reasoning — it has no way to formulate a query for a fact it hasn't found yet.",
        },
        {
          q: "What does Corrective RAG (CRAG) add on top of standard retrieval?",
          options: [
            "A bigger vector index",
            "A post-retrieval evaluator that grades chunk relevance and falls back to broader search on low confidence",
            "A requirement to always use BM25",
            "Removal of the reranking stage",
          ],
          answer: 1,
          explain: "CRAG's evaluator acts as a safety net, catching cases where naive retrieval would have fed weak context straight to the generator.",
        },
        {
          q: "What decision does Adaptive RAG make that naive RAG doesn't?",
          options: [
            "Whether to use a vector database at all",
            "Whether a given query needs retrieval at all, or can be answered cheaply from parametric memory",
            "Whether to chunk documents by paragraph or sentence",
            "Whether to use HTTPS for the API",
          ],
          answer: 1,
          explain: "Adaptive RAG routes based on query complexity, skipping unnecessary retrieval for simple questions and escalating for complex ones.",
        },
        {
          q: "How does GraphRAG differ from standard vector-based retrieval?",
          options: [
            "It doesn't use an LLM for generation",
            "It retrieves over an explicit knowledge graph of entities and relationships, not just flat chunk similarity",
            "It only works on numeric data",
            "It removes the need for chunking entirely",
          ],
          answer: 1,
          explain: "GraphRAG can follow explicit relationships between entities that pure embedding similarity struggles to represent.",
        },
        {
          q: "What makes RAG \"agentic\" specifically?",
          options: [
            "Using a larger embedding model",
            "Retrieval is exposed as a tool an LLM agent calls on its own judgment, deciding when and how to retrieve as part of a reasoning loop",
            "Running retrieval on a schedule",
            "Removing the generation step entirely",
          ],
          answer: 1,
          explain: "Agentic RAG hands control of retrieval timing and query formulation to the agent itself, rather than fixing it into one pipeline stage.",
        },
      ],
    },
    {
      id: "p3-c8",
      n: 8,
      title: "Evaluating & Productionizing RAG",
      short: "Looks great in the demo, fails silently in production — unless you measure both halves",
      requires: ["p3-c7"],
      xp: 130,
      node: { x: 300, y: 1560 },
      diagram: {
        type: "radar",
        label: "A RAG system, five different lenses",
        axes: [
          { label: "Ctx. precision", value: 78 },
          { label: "Ctx. recall", value: 64 },
          { label: "Faithfulness", value: 88 },
          { label: "Answer rel.", value: 82 },
          { label: "Latency", value: 55 },
        ],
      },
      hook: "<p>A RAG system can look great in a demo and fail silently in production — because retrieval quality and generation quality need to be measured separately, and almost nobody does both.</p>",
      explain: `<p>RAG evaluation has to separate two distinct failure surfaces: did the system <strong>retrieve</strong> the right information, and did the model <strong>use</strong> it correctly? A system can fail at either independently — perfect retrieval paired with a model that ignores the context, or terrible retrieval paired with a model that hallucinates confidently regardless of what it was given.</p>
      <p><strong>Retrieval metrics:</strong> <strong>Context Precision</strong> measures, of the chunks actually retrieved, what fraction are genuinely relevant — high noise, low precision. <strong>Context Recall</strong> measures, of the relevant chunks that exist anywhere in the corpus, what fraction were actually retrieved — missed information, low recall. <strong>Generation metrics:</strong> <strong>Faithfulness</strong> (or groundedness) checks whether the generated answer's claims actually follow from the retrieved context, or whether the model added unsupported claims on top of it — still hallucinating, just with evidence sitting right there unused. <strong>Answer Relevancy</strong> checks whether the answer actually addresses the question asked, as opposed to being accurate but off-topic.</p>
      <p>These four metrics — often computed via an LLM-as-judge, following the same pattern as Part I, Chapter 8 — form the backbone of evaluation frameworks like RAGAS. All four need to be tracked, not just "does the final answer look right," because a single overall judgment can't tell you <em>which stage</em> to fix.</p>
      <p>Specific failure modes worth explicitly testing for: retrieval surfacing <strong>outdated or superseded documents</strong> (a freshness bug), the model <strong>citing a source that doesn't actually support the claim</strong> (a citation mismatch), <strong>context window overflow</strong> silently truncating retrieved chunks, and — most commonly skipped of all — <strong>"no answer exists in the corpus"</strong> cases, where the correct behavior is admitting it doesn't know rather than falling back to parametric hallucination. Many teams never test this last case at all.</p>
      <p>Production monitoring means continuously logging retrieved chunks and generated answers, sampling for human or LLM-judge review, and tracking these metrics over time as the corpus and the distribution of incoming queries drift. RAG evaluation isn't a one-time pre-launch checklist — like index freshness in Chapter 4, it's an ongoing pipeline.</p>`,
      analogy:
        "<p>Judging a RAG system only by \"does the final answer sound right\" is like judging a research paper only by whether the abstract reads well — you'd never notice whether the citations actually support the claims, or whether the literature review missed half the relevant prior work.</p>",
      example:
        "<p>A RAG support bot answers fluently and confidently, citing a source. Evaluation reveals the cited chunk doesn't actually contain that claim — a faithfulness failure — and separately, the genuinely relevant chunk existed in the corpus but was never retrieved at all — a context recall failure. Two distinct bugs, at two different pipeline stages, that \"the answer sounded good\" would have completely hidden.</p>",
      math: [
        {
          expr: "Context Precision = <span>relevant chunks retrieved</span> ⁄ <span>total chunks retrieved</span>",
          note: "How much of what you handed the model was actually useful — low precision means the context is diluted with noise.",
        },
        {
          expr: "Context Recall = <span>relevant chunks retrieved</span> ⁄ <span>total relevant chunks in corpus</span>",
          note: "How much of the useful information that exists was actually found — low recall means the answer is missing evidence that was there to find.",
        },
        {
          expr: "Faithfulness = <span>claims supported by context</span> ⁄ <span>total claims in the answer</span>",
          note: "How much of the generated answer is actually grounded in what was retrieved, versus invented on top of it — the direct measure of whether RAG is still hallucinating despite having evidence in hand.",
        },
      ],
      takeaways: [
        "RAG evaluation must separate retrieval quality from generation quality — they fail independently and need different fixes.",
        "Context Precision (retrieved chunks that are relevant) and Context Recall (relevant chunks that were retrieved) are the core retrieval metrics.",
        "Faithfulness (grounded in context) and Answer Relevancy (addresses the question) are the core generation metrics.",
        "Explicitly test edge cases: outdated documents, citation mismatches, context overflow, and \"no answer exists — say so\" cases.",
        "RAG evaluation is ongoing production monitoring, not a one-time pre-launch check — corpora and queries drift over time.",
      ],
      quiz: [
        {
          q: "Why must RAG evaluation separate retrieval quality from generation quality?",
          options: [
            "They always fail together, so it doesn't matter",
            "A system can fail at either independently, and a single \"does the answer look right\" judgment can't reveal which stage to fix",
            "Retrieval quality can't be measured",
            "Generation quality is the only thing that matters",
          ],
          answer: 1,
          explain: "Perfect retrieval with a model that ignores context, or bad retrieval with a confidently hallucinating model, are different bugs needing different fixes.",
        },
        {
          q: "What does low Context Recall indicate?",
          options: [
            "The retrieved chunks are full of irrelevant noise",
            "Relevant information that exists in the corpus was not actually retrieved",
            "The model is hallucinating",
            "The embedding model is too large",
          ],
          answer: 1,
          explain: "Context Recall measures how much of the relevant material in the corpus made it into the retrieved set — low recall means information was missed.",
        },
        {
          q: "What does the Faithfulness metric specifically catch?",
          options: [
            "Slow retrieval latency",
            "The model adding claims to its answer that aren't actually supported by the retrieved context",
            "Chunks that are too large",
            "A missing vector database index",
          ],
          answer: 1,
          explain: "Faithfulness checks groundedness — whether the answer's claims genuinely follow from the evidence handed to the model, or were invented anyway.",
        },
        {
          q: "Why is testing \"no answer exists in the corpus\" cases important, and why is it commonly skipped?",
          options: [
            "It's not important, RAG systems should always produce an answer",
            "The correct behavior is admitting uncertainty rather than falling back to hallucination, but many teams never explicitly test for this case",
            "It only applies to sparse retrieval",
            "It tests embedding model speed",
          ],
          answer: 1,
          explain: "Without this test, a system that should say \"I don't know\" may instead quietly fall back to confident parametric hallucination.",
        },
        {
          q: "Why is RAG evaluation described as \"ongoing production monitoring\" rather than a one-time check?",
          options: [
            "Because evaluation frameworks like RAGAS only run once",
            "Because the corpus and the distribution of incoming queries drift over time, the same way index freshness is an ongoing concern",
            "Because retrieval metrics never change",
            "Because generation metrics are static once measured",
          ],
          answer: 1,
          explain: "A RAG system that scored well at launch can degrade silently as documents age and user queries shift, so monitoring has to be continuous.",
        },
      ],
    },
  ],
};

window.PARTS = window.PARTS || {};
window.PARTS[window.PART_DATA.id] = window.PART_DATA;
