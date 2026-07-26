/* ============================================================
   Content data - Part III: Retrieval-Augmented Generation
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
    first: { id: "p3-first", label: "First Retrieval - completed your first RAG chapter" },
    complete: { id: "p3-complete", label: "Retrieval Architect - cleared all of Part III" },
  },
  chapters: [
    {
      id: "p3-c1",
      plain: "<p>A model only knows what it saw in training and can't look anything up, so it confidently makes things up about anything new or private. RAG fixes this by letting it fetch the real document first and answer from that - the difference between a closed-book and an open-book exam.</p>",
      n: 1,
      title: "Why Retrieval - The Case for RAG",
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
        type: "pixscene",
        question: "What was Acme Corp's exact Q3 2025 revenue?",
        answer: "✓ \"Acme's Q3 2025 revenue was $4.2M\" - quoted from the filing, with a citation.",
        props: [{ id: "archive", kind: "shelf", x: 84, label: "Company Filings" }],
        actors: [
          { id: "model", kind: "wizard", x: 16, label: "model" },
          { id: "drone", kind: "red", x: 30, label: "retriever" },
        ],
        steps: [
          { actor: "model", think: true, say: "The model doesn't actually know this - it wasn't in its training data." },
          { actor: "drone", to: 80, say: "So it sends a retriever out to the real company filings." },
          { actor: "drone", pickup: true, say: "The retriever finds the actual filing and grabs the figure." },
          { actor: "drone", to: 30, say: "It carries that real evidence back to the model." },
          { actor: "drone", handoff: "model", say: "…and hands the document over." },
          { actor: "model", deliver: true, say: "Now the model answers - grounded in the real document, not a guess." },
        ],
      },
      hook: "<p>LLMs are frozen the moment training ends, and they'll answer confidently whether or not they actually know. RAG is the fix that lets a model look something up instead of guessing.</p>",
      explain: `<p>A model's <strong>parametric knowledge</strong> - everything baked into its weights during pretraining - has two hard limits. It has a <strong>knowledge cutoff</strong>: anything that happened after training data was collected is simply invisible to it. And it has <strong>imperfect recall</strong>: facts are compressed lossily across billions of parameters, so obscure or long-tail information is often reconstructed wrong with full confidence - this is a major source of <strong>hallucination</strong>.</p>
      <p><strong>Retrieval-Augmented Generation</strong> (Lewis et al., 2020) addresses this by giving the model access to an external, updatable knowledge source at the moment of answering: retrieve the passages relevant to a query, then feed them into the model's context alongside the question, so generation is grounded in retrieved evidence rather than memory alone. This turns <strong>closed-book</strong> generation (answer from memory) into <strong>open-book</strong> generation (answer with the reference material in front of you).</p>
      <p>RAG specifically targets three failure modes: a <strong>knowledge cutoff</strong> (events after training), <strong>long-tail facts</strong> (rare information poorly memorized), and <strong>private or proprietary data</strong> (a company's internal docs were never in the training set, and for cost and confidentiality reasons, often shouldn't be). Compare this to fine-tuning (Part I, Chapter 5): fine-tuning bakes new behavior into the weights - expensive, static once trained, and unable to cite its sources. RAG keeps knowledge external and swappable - updating the index is cheap, and every answer can point back to exactly which passage it came from. The two are complementary: fine-tuning shapes <em>how</em> a model behaves, RAG supplies <em>what</em> it currently knows.</p>`,
      analogy:
        "<p>Fine-tuning is sending someone through years of schooling until facts become part of who they are. RAG is handing them a reference book to consult at the exact moment they need it - updatable overnight, and open to inspection afterward.</p>",
      example:
        "<p>Asked for Acme Corp's exact Q3 2025 revenue, a base LLM has nothing to draw on but statistical plausibility - it will produce a confident-sounding number that is simply invented. A RAG system instead retrieves the actual filing text and inserts it as context, so the model quotes the real figure instead of fabricating one - and can point to the source paragraph it came from.</p>",
      takeaways: [
        "Parametric knowledge has a hard cutoff and imperfect recall, which is a major source of hallucination on unseen or under-represented facts.",
        "RAG grounds generation in retrieved, external, updatable evidence instead of relying purely on memorized weights.",
        "RAG is the right tool for knowledge-cutoff, long-tail, and private/proprietary data; fine-tuning is the right tool for teaching behavior and format.",
        "RAG and fine-tuning are complementary - most serious production systems eventually use both.",
      ],
      quiz: [
        {
          q: "What causes an LLM to hallucinate a confident but wrong answer about a fact it was never trained on well?",
          options: [
            "The model refuses to answer",
            "A bug in the tokenizer",
            "Parametric knowledge has a training cutoff and imperfect, lossy recall of long-tail facts",
            "RAG was not disabled",
          ],
          answer: 2,
          explain: "Weights compress the training corpus lossily; obscure facts are reconstructed with false confidence rather than flagged as unknown.",
        },
        {
          q: "What does RAG fundamentally add to generation?",
          options: [
            "A larger vocabulary",
            "A faster tokenizer",
            "A second language model for translation",
            "Retrieved, external, updatable evidence inserted into the context at answer time",
          ],
          answer: 3,
          explain: "RAG turns closed-book generation (memory only) into open-book generation (memory plus retrieved reference material).",
        },
        {
          q: "Which scenario is RAG specifically well-suited for, versus fine-tuning?",
          options: [
            "Making the model faster at inference",
            "Answering questions about a company's private internal documents that change weekly",
            "Making the model refuse harmful requests",
            "Teaching the model a new response tone",
          ],
          answer: 1,
          explain: "Private, frequently-changing data is exactly the case where an updatable external index beats baking facts into frozen weights.",
        },
        {
          q: "Why are RAG and fine-tuning described as complementary rather than competing?",
          options: [
            "Fine-tuning shapes behavior/format while RAG supplies current, external factual grounding",
            "Fine-tuning is always strictly better",
            "RAG replaces the need for a language model entirely",
            "They can't be used in the same system",
          ],
          answer: 0,
          explain: "Production systems commonly fine-tune for role/behavior and use RAG for up-to-date or private factual content.",
        },
        {
          q: "What is the key difference between \"closed-book\" and \"open-book\" generation?",
          options: [
            "Open-book generation retrieves and inserts reference material before answering; closed-book relies on memory alone",
            "Closed-book is faster because it always skips retrieval",
            "There is no real difference",
            "Open-book generation never uses an LLM",
          ],
          answer: 0,
          explain: "This is the exam analogy made literal - RAG hands the model the reference material at question time instead of testing pure recall.",
        },
      ],
    },
    {
      id: "p3-c2",
      plain: "<p>Making retrieval work is an assembly line: collect documents, cut them up, index them, search, then answer. Botch or skip one step and the final answer suffers - even with a brilliant model at the end. This chapter walks the whole line.</p>",
      n: 2,
      title: "The RAG Pipeline End-to-End",
      short: "The full assembly line - and where naive RAG cuts corners",
      requires: ["p3-c1"],
      xp: 90,
      node: { x: 300, y: 300 },
      diagram: {
        type: "snake",
        task: "What was Acme Corp's exact Q3 2025 revenue?",
        answer: "$4.7B - from the Q3 10-Q filing, with the source cited.",
        steps: [
          { label: "Ingest", glyph: "▤", say: "Raw docs and PDFs come in." },
          { label: "Chunk", glyph: "▥", say: "Split into retrievable chunks." },
          { label: "Embed", glyph: "◆", say: "Each chunk becomes a vector." },
          { label: "Index", glyph: "▦", say: "Vectors stored for fast search." },
          { label: "Rewrite", glyph: "✎", say: "Question sharpened into a query." },
          { label: "Retrieve", glyph: "⌕", say: "Top matching chunks pulled." },
          { label: "Rerank", glyph: "≣", say: "Reordered by true relevance." },
          { label: "Generate", glyph: "★", say: "Answer written, with a citation." },
        ],
      },
      hook: "<p>Before going deep on any single stage, see the whole assembly line - because the steps people skip when first prototyping are exactly the ones that quietly cap retrieval quality.</p>",
      explain: `<p>A real RAG system has roughly ten distinct stages: <strong>ingestion</strong> (collect raw source documents), <strong>parsing/cleaning</strong> (extract clean text and structure from PDFs, HTML, tables), <strong>chunking</strong> (split into retrievable units - Chapter 3), <strong>embedding</strong> (turn each chunk into a vector - Chapter 4), <strong>indexing</strong> (store vectors with metadata for fast search - Chapter 4), <strong>query processing</strong> (transform the user's raw question into a better search query - Chapter 5, and the first commonly-skipped step), <strong>retrieval</strong> (fetch candidate chunks - Chapter 5), <strong>reranking</strong> (reorder by finer-grained relevance - Chapter 6, the second commonly-skipped step), <strong>context construction</strong> (dedupe, order, and cite the assembled evidence - Chapter 6), and finally <strong>generation</strong> (the LLM answers, conditioned on that context), followed by ongoing <strong>evaluation and monitoring</strong> (Chapter 8).</p>
      <p>The critical insight this chapter exists to make explicit: a RAG system's answer quality is bounded by its <em>worst</em> stage, not its best. A frontier LLM fed badly-chunked, unranked, unfiltered context will still produce weak or hallucinated answers - the model can only work with what it's handed.</p>
      <p>This gives us useful vocabulary for the rest of the book. <strong>Naive RAG</strong> is the bare minimum - chunk, embed, index, retrieve top-k, generate - with no query transformation and no reranking. It's what most tutorials show, and it's fragile on anything but simple, well-phrased factual questions. <strong>Advanced RAG</strong> adds the pre-retrieval optimizations (query transformation) and post-retrieval optimizations (reranking, compression) that naive RAG skips. <strong>Modular RAG</strong> goes further, building the pipeline from swappable, independently upgradable components with routing logic between them, rather than one fixed chain.</p>`,
      analogy:
        "<p>RAG is a factory assembly line for answers. Skip the quality-inspection station (reranking) or the order-taking station (query transformation), and the defect still shows up in the final product - even if the very last machine on the line is state-of-the-art.</p>",
      example:
        "<p>A team ships \"naive RAG\": chunk, embed, retrieve the top 3, stuff them into the prompt, generate. It performs well in the demo on simple factual questions, then quietly fails on ambiguous or multi-part ones - because there's no query rewriting to disambiguate the question and no reranking to filter out near-miss chunks. Nothing crashes; the answers just get subtly worse, which is the most common way real RAG systems fail.</p>",
      takeaways: [
        "RAG is a pipeline of roughly ten distinct stages, not just \"embed and retrieve.\"",
        "Answer quality is bounded by the weakest stage in the chain, not by how good the LLM itself is.",
        "\"Naive RAG\" skips query transformation and reranking - the two most commonly missed upgrades.",
        "\"Advanced RAG\" adds pre-retrieval and post-retrieval optimization; \"Modular RAG\" makes the whole pipeline swappable and routable.",
      ],
      quiz: [
        {
          q: "Why can a state-of-the-art LLM still produce a weak RAG answer?",
          options: [
            "Answer quality is bounded by the weakest pipeline stage - bad chunking or retrieval limits what the model can work with",
            "The LLM always ignores retrieved context",
            "The LLM is too large",
            "RAG doesn't work with large models",
          ],
          answer: 0,
          explain: "The generator can only reason over what it's handed; every upstream stage caps the ceiling on the final answer.",
        },
        {
          q: "What defines \"naive RAG\" as this chapter uses the term?",
          options: [
            "A RAG system that only works on short documents",
            "A RAG system with no vector database",
            "Chunk, embed, index, retrieve top-k, generate - with no query transformation and no reranking",
            "A RAG system that uses no embeddings at all",
          ],
          answer: 2,
          explain: "Naive RAG is the bare-minimum pipeline most tutorials demonstrate, missing both commonly-skipped optimization stages.",
        },
        {
          q: "Where does query processing/transformation happen in the pipeline, and why does its position matter?",
          options: [
            "Before retrieval - it improves the search query itself, so skipping it means retrieval starts from a worse query",
            "It replaces chunking entirely",
            "It only matters for sparse retrieval",
            "After generation, to fix the final answer",
          ],
          answer: 0,
          explain: "Query transformation is a pre-retrieval stage; if skipped, every later stage inherits a suboptimal search query.",
        },
        {
          q: "What distinguishes \"Advanced RAG\" from \"naive RAG\"?",
          options: [
            "Advanced RAG skips chunking",
            "Advanced RAG adds pre-retrieval (query transformation) and post-retrieval (reranking, compression) optimization stages",
            "Advanced RAG uses a bigger LLM",
            "Advanced RAG never uses a vector database",
          ],
          answer: 1,
          explain: "The extra stages naive RAG omits are precisely what \"advanced\" adds back in.",
        },
        {
          q: "What does \"Modular RAG\" add on top of Advanced RAG?",
          options: [
            "Nothing - they are the same thing",
            "Swappable, independently upgradable components with routing logic between them, instead of one fixed chain",
            "Removal of the generation stage",
            "A requirement to use exactly one embedding model forever",
          ],
          answer: 1,
          explain: "Modular RAG treats each stage as a replaceable component with routing decisions, rather than a rigid linear pipeline.",
        },
      ],
    },
    {
      id: "p3-c3",
      plain: "<p>Before documents can be searched, they're cut into bite-size pieces. Cut them badly - mid-sentence, or too big - and search quality drops no matter what else you do. It's like indexing a book: sensible sections are findable; random splits aren't.</p>",
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
      diagram2: {
        type: "figure",
        title: "Chunk size, overlap, and the precision/context tradeoff",
        svg: `<svg viewBox="0 0 360 236" role="img" aria-label="Small, large and overlapping chunking compared over the same document">
          <text x="8" y="12" font-size="9" fill="var(--text-faint)">SMALL CHUNKS - precise match, missing context</text>
          <rect x="8" y="18" width="64" height="20" rx="4" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <rect x="76" y="18" width="64" height="20" rx="4" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <rect x="144" y="18" width="64" height="20" rx="4" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.8"/>
          <rect x="212" y="18" width="64" height="20" rx="4" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <rect x="280" y="18" width="64" height="20" rx="4" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <text x="176" y="52" text-anchor="middle" font-size="8" fill="var(--ion)">the hit is exact - but "it" refers to something in the chunk before</text>
          <text x="8" y="78" font-size="9" fill="var(--text-faint)">LARGE CHUNKS - full context, diluted signal</text>
          <rect x="8" y="84" width="166" height="20" rx="4" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.8"/>
          <rect x="178" y="84" width="166" height="20" rx="4" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <text x="176" y="118" text-anchor="middle" font-size="8" fill="var(--ion)">one relevant line averaged in with 400 irrelevant words</text>
          <text x="8" y="144" font-size="9" fill="var(--text-faint)">OVERLAPPING - each chunk carries its neighbour's edge</text>
          <rect x="8" y="150" width="110" height="18" rx="4" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <rect x="96" y="172" width="110" height="18" rx="4" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <rect x="184" y="150" width="110" height="18" rx="4" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <rect x="96" y="172" width="22" height="18" rx="4" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.6"/>
          <rect x="184" y="172" width="22" height="18" rx="4" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.6"/>
          <text x="176" y="208" text-anchor="middle" font-size="8" fill="var(--ion)">shaded = repeated text, so a sentence cut in half still survives somewhere</text>
          <text x="176" y="228" text-anchor="middle" font-size="8" fill="var(--text-faint)">typical starting point: 200-800 tokens, 10-20% overlap - then tune on your own corpus</text>
        </svg>`,
        caption: "There's no universally correct chunk size: smaller means a sharper relevance signal but more lost context, larger means the opposite. Overlap buys back some of the context lost at the cut points, at the cost of storing the same text more than once.",
      },
      hook: "<p>How you cut the text before anything else happens quietly determines the ceiling on your entire system's retrieval quality.</p>",
      explain: `<p>Documents are chunked because they're too long to embed as a single vector (one vector can't represent fifty pages without losing all granularity) and too long to stuff into every prompt wholesale. Chunking creates the addressable, retrievable units everything else operates on.</p>
      <p><strong>Fixed-size chunking</strong> splits every N tokens or characters - simple and fast, but structurally blind: it can slice a sentence, a table row, or a code block right down the middle, destroying the meaning that was supposed to be retrieved. <strong>Recursive / structure-aware chunking</strong> splits along natural boundaries first - paragraphs, sections, markdown headers - falling back to a fixed-size cut only when a block is too large on its own, preserving far more semantic integrity. <strong>Semantic chunking</strong> goes further, using embedding similarity between adjacent sentences to detect topic shifts and cutting exactly there, so each chunk stays topically coherent rather than arbitrarily sized.</p>
      <p><strong>Overlap</strong> - letting adjacent chunks share a small window of tokens, typically 10–20% - is a commonly-missed detail: without it, a fact that straddles a chunk boundary can become effectively unretrievable no matter how the query is phrased, because neither chunk alone contains the complete idea.</p>
      <p>Chunk size is a genuine tradeoff. Smaller chunks give more precise retrieval (less irrelevant text diluting each chunk's embedding) but lose surrounding context and multiply the number of vectors to search. Larger chunks preserve more context but dilute the embedding's relevance signal and cost more tokens once retrieved. Most production systems land somewhere in the 200–500 token range, tuned empirically per corpus.</p>
      <p>Finally, every chunk should carry <strong>metadata</strong> - source document, section title, page number, date - not just for citation, but to enable <strong>metadata filtering</strong> at retrieval time (e.g. "only search documents from 2024 onward"). This is another detail beginners often skip, treating the vector index as the only source of truth.</p>`,
      analogy:
        "<p>Fixed-size chunking is tearing a book into pages by ruler-measured thickness, sometimes slicing straight through a sentence. Structure-aware chunking is tearing along the chapter breaks that were already there.</p>",
      example:
        "<p>A 500-character fixed chunk boundary lands mid-row inside a pricing table, separating \"Enterprise plan\" from \"$40,000/year\" into two different chunks. A user asking \"how much does the Enterprise plan cost\" retrieves the chunk with the label but not the number - and the model either admits it doesn't know, or worse, hallucinates a plausible price to fill the gap.</p>",
      takeaways: [
        "Chunking is a make-or-break step - every downstream stage retrieves and reasons over these chunks, never the original document.",
        "Fixed-size chunking is simple but structurally blind; structure-aware and semantic chunking preserve meaning at some extra complexity.",
        "Overlap between adjacent chunks prevents facts straddling a boundary from becoming unretrievable - a commonly-skipped detail.",
        "Chunk size is a precision/context tradeoff, typically tuned in the 200–500 token range.",
        "Attaching metadata to every chunk enables filtering and citation - core functionality, not optional polish.",
      ],
      quiz: [
        {
          q: "Why is fixed-size chunking risky despite being the simplest approach?",
          options: [
            "It requires a GPU to run",
            "It's structurally blind and can split a sentence, table row, or fact right down the middle",
            "It's too slow to compute",
            "It only works on very short documents",
          ],
          answer: 1,
          explain: "Cutting purely by character/token count ignores document structure entirely, which can destroy meaning at the cut point.",
        },
        {
          q: "What problem does overlap between adjacent chunks solve?",
          options: [
            "It makes embedding faster",
            "It removes the need for metadata",
            "It prevents a fact that straddles a chunk boundary from becoming unretrievable by either chunk alone",
            "It reduces the total number of chunks",
          ],
          answer: 2,
          explain: "Without overlap, information split across a hard boundary can end up incomplete in both neighboring chunks.",
        },
        {
          q: "What is the core tradeoff in choosing chunk size?",
          options: [
            "Chunk size has no effect on retrieval quality",
            "Larger chunks are always cheaper to retrieve",
            "Smaller chunks are always strictly better",
            "Smaller chunks give more precise retrieval but lose context; larger chunks keep context but dilute relevance signal and cost more tokens",
          ],
          answer: 3,
          explain: "This precision-vs-context tradeoff is why chunk size is tuned empirically per corpus rather than fixed universally.",
        },
        {
          q: "What does semantic chunking use to decide where to cut?",
          options: [
            "Random cut points",
            "Embedding similarity between adjacent sentences, cutting where topics shift",
            "A fixed character count only",
            "The file size of the document",
          ],
          answer: 1,
          explain: "Semantic chunking detects topic boundaries via similarity drops between neighboring sentences, rather than an arbitrary length.",
        },
        {
          q: "Why does attaching metadata (date, source, section) to each chunk matter beyond citation?",
          options: [
            "It doesn't matter, metadata is just for display",
            "It replaces the need for chunking",
            "It makes chunks embed faster",
            "It enables metadata filtering at retrieval time, like restricting search to recent or authorized documents",
          ],
          answer: 3,
          explain: "Metadata filtering combines with vector similarity to enforce recency, permissions, and document type - pure similarity can't do this alone.",
        },
      ],
    },
    {
      id: "p3-c4",
      plain: "<p>To search by meaning instead of exact words, each chunk becomes a list of numbers, and similar meanings get similar numbers. A special index then finds the closest matches among millions in milliseconds - like a librarian who instantly points to the right shelf.</p>",
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
      hook: "<p>Part I, Chapter 2 embedded tokens. RAG needs the same idea applied to whole chunks - and then a way to search millions of them in milliseconds.</p>",
      explain: `<p>A <strong>chunk embedding</strong> is produced by an embedding model - often a dedicated one, separate from the generation LLM, such as OpenAI's text-embedding-3 or open models like BGE or E5 - that maps an entire chunk's text to one dense vector capturing its meaning. It's the same distributional principle from Part I, applied at passage granularity instead of token granularity.</p>
      <p>Comparing a query vector against millions of chunk vectors by brute force doesn't scale. This is where <strong>Approximate Nearest Neighbor (ANN)</strong> search comes in: algorithms like <strong>HNSW</strong> (Hierarchical Navigable Small World graphs) or <strong>IVF</strong> (Inverted File Index) trade a small amount of recall accuracy for enormous speed, making millisecond search over millions or billions of vectors practical without ever comparing against most of them.</p>
      <p>A <strong>vector database</strong> - Pinecone, Weaviate, Qdrant, Milvus, or pgvector as a Postgres extension - packages ANN indexing together with metadata storage, filtering, and update operations for production use. Combining vector similarity with structured <strong>metadata filtering</strong> (date range, document type, access permissions) is essential, not optional: a user should only retrieve documents they're authorized to see, and a query about current policy shouldn't surface a superseded 2019 version just because it's semantically similar. This is a commonly-missed capability when teams treat the vector index as the only source of truth.</p>
      <p>Unlike a model's frozen weights, a vector index can be updated <strong>incrementally</strong> as new documents arrive - but this needs an ingestion pipeline that re-chunks and re-embeds only what changed, upserts it, and deprecates stale entries, rather than rebuilding the entire index from scratch. Index freshness is a production concern that prototype-stage RAG systems frequently skip entirely, having only ever built the index once.</p>`,
      analogy:
        "<p>Brute-force nearest-neighbor search is checking every book in a library one at a time. An ANN index like HNSW is the library's floor-by-floor, shelf-by-shelf organization that lets you walk almost straight to the right shelf without checking the others.</p>",
      example:
        "<p>A support-docs RAG system embeds 200,000 help-article chunks. A user asks about resetting two-factor authentication - HNSW search returns the nearest ~50 candidates in a few milliseconds without ever comparing against most of the 200,000 vectors, and metadata filtering ensures only chunks from the current product version are even considered.</p>",
      math: [
        {
          expr: "cos(θ) = <span>q · c</span> ⁄ <span>‖q‖ ‖c‖</span>",
          note: "The same cosine similarity from Part I, Chapter 2 - now comparing a query vector <code>q</code> against a chunk vector <code>c</code> instead of two token vectors. It's the scoring function underneath dense retrieval in the next chapter.",
        },
      ],
      takeaways: [
        "Chunk embeddings apply the same distributional principle as token embeddings, at passage granularity, usually via a dedicated embedding model.",
        "ANN algorithms (HNSW, IVF) make millisecond search over millions of vectors possible by trading a little recall for a lot of speed.",
        "Vector databases combine ANN indexing with metadata storage and filtering for production use.",
        "Metadata filtering (permissions, dates, document type) is essential - pure vector similarity can't enforce access control or recency alone.",
        "A production index needs an incremental update strategy, not a one-time build - freshness is an ongoing pipeline concern.",
      ],
      quiz: [
        {
          q: "Why doesn't brute-force nearest-neighbor search scale to millions of chunk vectors?",
          options: [
            "Embeddings only work for small corpora",
            "Vector databases don't support brute force",
            "Vectors can't be compared mathematically",
            "Comparing a query against every single vector directly becomes too slow at that scale",
          ],
          answer: 3,
          explain: "Exhaustive comparison scales linearly with corpus size, which becomes impractical for millisecond search at millions/billions of vectors.",
        },
        {
          q: "What do ANN algorithms like HNSW trade off to achieve millisecond search?",
          options: [
            "They trade a small amount of recall accuracy for a large speed gain",
            "They trade chunk size for vocabulary size",
            "They trade embedding quality for storage space",
            "They eliminate the need for embeddings",
          ],
          answer: 0,
          explain: "ANN search finds approximately-nearest neighbors, not guaranteed-exact ones, in exchange for being dramatically faster.",
        },
        {
          q: "Why is metadata filtering essential alongside vector similarity search?",
          options: [
            "It makes embeddings smaller",
            "It replaces the need for an embedding model",
            "It's only useful for debugging",
            "Pure similarity can't enforce access permissions, recency, or document type on its own",
          ],
          answer: 3,
          explain: "A semantically similar but outdated or unauthorized document can rank highly on similarity alone - metadata filters are what exclude it.",
        },
        {
          q: "What does \"index freshness\" require that a one-time index build doesn't provide?",
          options: [
            "Switching to sparse retrieval",
            "An incremental pipeline that re-chunks and re-embeds only changed documents and upserts/deprecates entries",
            "Removing all metadata",
            "A bigger embedding model",
          ],
          answer: 1,
          explain: "Production corpora change continuously; the index needs an ongoing update strategy, not a single initial build.",
        },
        {
          q: "cos(θ) = (q·c)/(‖q‖‖c‖) is used to compare what, in this chapter's context?",
          options: [
            "Two different LLMs",
            "A query vector against a chunk vector, to score semantic relevance",
            "The number of tokens in two documents",
            "Two chunk sizes",
          ],
          answer: 1,
          explain: "Cosine similarity between the query embedding and each chunk embedding is the core scoring function for dense retrieval.",
        },
      ],
    },
    {
      id: "p3-c5",
      plain: "<p>There's more than one way to find relevant text: match exact words, match meaning, or blend both - and often the smartest move is to rewrite the user's messy question into a better search first. Small choices here change a lot about what comes back.</p>",
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
          outcome: { icon: "✕", text: "retrieves the E-4029 article instead - close, but wrong", kind: "miss" },
        },
        right: {
          label: "Hybrid (dense + BM25, RRF)",
          stages: ["Dense catches the semantic intent", "BM25 catches the exact \"E-4021\" match", "Reciprocal Rank Fusion merges both"],
          outcome: { icon: "✓", text: "correctly retrieves the E-4021 article", kind: "match" },
        },
      },
      diagram2: {
        type: "compare",
        query: "How do I rotate my API keys?",
        left: {
          label: "Embed the question directly",
          stages: ["A short, terse question", "Sits in \"question space\"", "Real docs are phrased as answers, not questions"],
          outcome: { icon: "✕", text: "the true guide ranks below looser matches", kind: "miss" },
        },
        right: {
          label: "HyDE: embed a hypothetical answer",
          stages: ["LLM drafts a plausible answer first", "That draft reads like real documentation", "Its vector lands near the true passages"],
          outcome: { icon: "✓", text: "the real key-rotation guide ranks first", kind: "match" },
        },
      },
      diagram3: {
        type: "figure",
        title: "Multi-query / RAG-Fusion",
        svg: `<svg viewBox="0 0 360 210" role="img" aria-label="One query fans into several, results are fused">
          <defs>
            <marker id="mq-a" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--amber)"/></marker>
            <marker id="mq-i" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--ion)"/></marker>
          </defs>
          <rect x="6" y="86" width="80" height="40" rx="7" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="2"/>
          <text x="46" y="103" text-anchor="middle" font-size="11">User</text>
          <text x="46" y="117" text-anchor="middle" font-size="11">query</text>
          <line x1="86" y1="106" x2="126" y2="40" class="fig-flow" stroke="var(--amber)" stroke-width="2" marker-end="url(#mq-a)"/>
          <line x1="86" y1="106" x2="126" y2="106" class="fig-flow" stroke="var(--amber)" stroke-width="2" marker-end="url(#mq-a)"/>
          <line x1="86" y1="106" x2="126" y2="172" class="fig-flow" stroke="var(--amber)" stroke-width="2" marker-end="url(#mq-a)"/>
          <rect x="130" y="22" width="106" height="36" rx="6" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <text x="183" y="37" text-anchor="middle" font-size="10">reworded query 1</text>
          <text x="183" y="50" text-anchor="middle" font-size="9" fill="var(--text-faint)">+ its own hits</text>
          <rect x="130" y="88" width="106" height="36" rx="6" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <text x="183" y="103" text-anchor="middle" font-size="10">reworded query 2</text>
          <text x="183" y="116" text-anchor="middle" font-size="9" fill="var(--text-faint)">+ its own hits</text>
          <rect x="130" y="154" width="106" height="36" rx="6" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="1.6"/>
          <text x="183" y="169" text-anchor="middle" font-size="10">reworded query 3</text>
          <text x="183" y="182" text-anchor="middle" font-size="9" fill="var(--text-faint)">+ its own hits</text>
          <line x1="236" y1="40" x2="278" y2="100" class="fig-flow" stroke="var(--ion)" stroke-width="2" marker-end="url(#mq-i)"/>
          <line x1="236" y1="106" x2="278" y2="106" class="fig-flow" stroke="var(--ion)" stroke-width="2" marker-end="url(#mq-i)"/>
          <line x1="236" y1="172" x2="278" y2="112" class="fig-flow" stroke="var(--ion)" stroke-width="2" marker-end="url(#mq-i)"/>
          <rect x="282" y="82" width="74" height="48" rx="7" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="2"/>
          <text x="319" y="101" text-anchor="middle" font-size="10">Fused list</text>
          <text x="319" y="116" text-anchor="middle" font-size="10">(RRF)</text>
        </svg>`,
        caption: "One question becomes several; each retrieves its own hits, and Reciprocal Rank Fusion merges them into a single ranked list - so a chunk found by any phrasing still surfaces.",
      },
      diagram4: {
        type: "figure",
        title: "Step-back prompting",
        svg: `<svg viewBox="0 0 360 216" role="img" aria-label="A narrow question steps back to a broader one, retrieves the principle, then answers">
          <defs>
            <marker id="sb-a" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--amber)"/></marker>
            <marker id="sb-i" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--ion)"/></marker>
          </defs>
          <rect x="12" y="12" width="336" height="40" rx="7" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="2"/>
          <text x="180" y="29" text-anchor="middle" font-size="10" fill="var(--text-faint)">narrow question</text>
          <text x="180" y="44" text-anchor="middle" font-size="10">"Can I expense a $600 client dinner in Q3?"</text>
          <line x1="180" y1="52" x2="180" y2="76" class="fig-flow" stroke="var(--amber)" stroke-width="2" marker-end="url(#sb-a)"/>
          <text x="190" y="70" font-size="9" fill="var(--text-faint)">step back</text>
          <rect x="12" y="80" width="336" height="40" rx="7" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="2"/>
          <text x="180" y="97" text-anchor="middle" font-size="10" fill="var(--text-faint)">broader question</text>
          <text x="180" y="112" text-anchor="middle" font-size="10">"What is the client-entertainment policy?"</text>
          <line x1="180" y1="120" x2="180" y2="144" class="fig-flow" stroke="var(--amber)" stroke-width="2" marker-end="url(#sb-a)"/>
          <rect x="12" y="148" width="336" height="30" rx="7" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="2"/>
          <text x="180" y="167" text-anchor="middle" font-size="10">retrieves the whole policy section, not one stray line</text>
          <line x1="180" y1="178" x2="180" y2="192" class="fig-flow" stroke="var(--ion)" stroke-width="2" marker-end="url(#sb-i)"/>
          <rect x="12" y="196" width="336" height="18" rx="6" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.8"/>
          <text x="180" y="209" text-anchor="middle" font-size="10">answer the original question from that principle</text>
        </svg>`,
        caption: "Instead of searching the narrow question as asked, first ask the more general question behind it, retrieve the governing principle, then reason back down to the specific case - the retrieval equivalent of looking up the rule before judging the example.",
      },
      hook: "<p>\"Retrieval\" isn't one algorithm - it's a decision between several, and the single most commonly-skipped upgrade is combining more than one.</p>",
      explain: `<p><strong>Dense retrieval</strong> embeds the query with the same embedding model used for chunks, then finds the nearest chunk vectors by cosine similarity. It's excellent at semantic matches - "car" retrieves passages about "automobile" - but can blur precise terms, since an embedding averages meaning across the whole span and exact codes, IDs, or names can get lost in that average.</p>
      <p><strong>Sparse retrieval</strong> (BM25, descended from TF-IDF) scores exact term overlap, weighted by how rare each term is across the corpus. It's excellent at exact matches - product codes, names, acronyms - but blind to synonyms and paraphrase, since it only sees literal tokens.</p>
      <p><strong>Hybrid search</strong> runs both and fuses the two ranked lists - commonly via <strong>Reciprocal Rank Fusion (RRF)</strong>, which combines rankings without needing their raw scores to be on comparable scales. This captures both semantic and exact-match strength at once, and is one of the single highest-leverage upgrades from naive (dense-only) RAG.</p>
      <p>All of this happens <em>after</em> the query itself may need fixing. <strong>Query transformation</strong>, a pre-retrieval step, exists because raw user questions are often poor search queries - ambiguous, underspecified, or phrased nothing like how the answer is actually written. <strong>Query rewriting/expansion</strong> clarifies or adds synonyms (often via an LLM call). <strong>HyDE</strong> (Hypothetical Document Embeddings) asks an LLM to write a hypothetical answer to the question, then embeds and searches with <em>that</em> - since an answer's phrasing tends to be closer to real answer passages than the terse question is. <strong>Multi-query</strong> generates several reworded versions of the question, retrieves for each, and merges the results - and when that merge is done with Reciprocal Rank Fusion, it's commonly called <strong>RAG-Fusion</strong>. The insight is that any single phrasing is a gamble on how the answer happens to be worded; firing several phrasings and fusing the results means a chunk found by <em>any</em> of them still surfaces.</p>
      <p><strong>Step-back prompting</strong> attacks a different failure. Some questions are too specific to retrieve well - "can I expense a $600 client dinner in Q3?" matches no passage, because policy documents are written as general rules, not as answers to individual cases. Step-back first asks the more general question sitting behind the specific one ("what is the client-entertainment expense policy?"), retrieves the governing principle, and only then reasons back down to the original case. It's the retrieval equivalent of looking up the rule before judging the example, and it helps most on questions involving specific dates, amounts, names, or edge cases that no document addresses verbatim.</p>
      <p>These techniques stack rather than compete: a production pipeline might step back to broaden an over-specific question, expand that into multiple phrasings, run each through hybrid dense+sparse retrieval, and fuse everything with RRF. All of them boost recall, and all of them are frequently skipped entirely in naive implementations - which is precisely why "we just embed the user's question and search" is the most common ceiling on RAG quality.</p>`,
      analogy:
        "<p>Dense retrieval is a librarian who understands what you mean. Sparse retrieval is a librarian who's memorized the exact catalog codes. Hybrid search is asking both and combining their answers instead of trusting just one.</p>",
      example:
        "<p>Asked to troubleshoot \"error code E-4021,\" dense-only retrieval can rank a semantically similar but wrong article - \"E-4029: connection timeout\" - above the correct one, since both are about errors and troubleshooting. BM25's exact match on \"E-4021\" would rank the correct article first on its own. Hybrid fusion combines both signals, so the exact code reinforces the semantic relevance instead of being diluted by it.</p>",
      math: [
        {
          expr: "BM25(D,Q) = Σ<sub>i</sub> IDF(q<sub>i</sub>) · <span>f(q<sub>i</sub>,D)·(k<sub>1</sub>+1)</span> ⁄ <span>f(q<sub>i</sub>,D) + k<sub>1</sub>·(1−b+b·|D|/avgdl)</span>",
          note: "The classic sparse-retrieval scoring function. <code>f(qᵢ,D)</code> is how often query term <code>qᵢ</code> appears in document D, weighted by its inverse document frequency (rarer terms count more) and normalized for document length; <code>k₁</code> and <code>b</code> are tuning constants controlling term-frequency saturation and length normalization.",
        },
        {
          expr: "RRFscore(d) = Σ<sub>r ∈ rankings</sub> <span>1</span> ⁄ <span>k + rank<sub>r</sub>(d)</span>",
          note: "<strong>Reciprocal Rank Fusion</strong>: for each ranked list (dense, sparse, ...), add 1/(k + its rank in that list) for document d, then sum across lists. Because it only uses rank position, not raw scores, it fuses lists whose scores aren't on comparable scales - exactly the dense-vs-BM25 situation.",
        },
      ],
      takeaways: [
        "Dense retrieval finds semantic/conceptual matches but can blur exact terms, codes, and names.",
        "Sparse retrieval (BM25) nails exact keyword matches but misses paraphrase and synonyms.",
        "Hybrid search (dense + sparse, fused via something like Reciprocal Rank Fusion) captures both - one of the highest-leverage upgrades from naive RAG.",
        "Query transformation (rewriting, HyDE, multi-query) happens before retrieval and fixes the fact that raw user questions are often bad search queries - a step naive RAG skips entirely.",
        "HyDE's trick: embed a hypothetical LLM-written answer instead of the bare question, since answers phrase things more like other answers do.",
      ],
      quiz: [
        {
          q: "What is dense retrieval's main weakness?",
          options: [
            "It requires no embedding model",
            "It only works on short queries",
            "It can blur exact terms, codes, or names because embeddings average meaning across the whole span",
            "It can't run on GPUs",
          ],
          answer: 2,
          explain: "Semantic averaging is exactly what makes dense retrieval good at synonyms and bad at exact-match precision.",
        },
        {
          q: "Why does hybrid search typically outperform either dense-only or sparse-only retrieval?",
          options: [
            "It combines semantic matching (dense) with exact-term matching (sparse), covering each one's blind spot",
            "It only uses BM25 internally",
            "It removes the need for a vector database",
            "It's always the fastest option",
          ],
          answer: 0,
          explain: "Fusing both ranked lists captures conceptual relevance and precise terminology at once, rather than picking one at the expense of the other.",
        },
        {
          q: "What problem does HyDE (Hypothetical Document Embeddings) solve?",
          options: [
            "It replaces BM25 entirely",
            "Raw questions are phrased differently from answers, so it embeds an LLM-written hypothetical answer instead of the bare question",
            "It speeds up chunking",
            "It removes the need for reranking",
          ],
          answer: 1,
          explain: "A hypothetical answer's phrasing tends to be much closer to real answer passages than a terse question is, improving retrieval.",
        },
        {
          q: "Why is Reciprocal Rank Fusion useful for combining dense and sparse result lists specifically?",
          options: [
            "It requires the two lists to use identical scoring scales",
            "It only works with a single ranked list",
            "It discards the sparse results entirely",
            "It only uses each document's rank position in each list, so it works even when raw scores aren't comparable",
          ],
          answer: 3,
          explain: "RRF sidesteps the score-scale mismatch between dense cosine similarity and BM25 scores by fusing on rank position alone.",
        },
        {
          q: "In BM25(D,Q), what does the IDF(qᵢ) term reward?",
          options: [
            "The total number of chunks",
            "Query terms that are rare across the corpus, since rare terms are more informative than common ones",
            "The embedding model's dimensionality",
            "Longer documents",
          ],
          answer: 1,
          explain: "Inverse document frequency down-weights common words and up-weights rare, distinctive ones - the core intuition behind sparse retrieval.",
        },
      ],
    },
    {
      id: "p3-c6",
      plain: "<p>First-pass search is fast but rough, so a second, pickier pass re-sorts the top hits to put the truly relevant ones first - then we assemble just those into the model's context. Quick demos skip this; real systems depend on it.</p>",
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
      diagram2: {
        type: "figure",
        title: "\"Lost in the middle\" - where you place a chunk matters",
        svg: `<svg viewBox="0 0 360 210" role="img" aria-label="Model recall is high at the start and end of context and drops in the middle">
          <text x="8" y="14" font-size="9" fill="var(--text-faint)">how reliably the model uses a fact, by its position in context</text>
          <path d="M 30 42 L 78 52 L 126 78 L 174 92 L 222 84 L 270 58 L 318 44" fill="none" stroke="var(--ion)" stroke-width="2.4"/>
          <circle cx="30" cy="42" r="4" fill="var(--ion)"/>
          <circle cx="174" cy="92" r="4" fill="var(--amber)"/>
          <circle cx="318" cy="44" r="4" fill="var(--ion)"/>
          <line x1="24" y1="112" x2="330" y2="112" stroke="var(--line-bright)" stroke-width="1.4"/>
          <text x="30" y="126" text-anchor="middle" font-size="8" fill="var(--text-faint)">start</text>
          <text x="174" y="126" text-anchor="middle" font-size="8" fill="var(--amber)">middle</text>
          <text x="318" y="126" text-anchor="middle" font-size="8" fill="var(--text-faint)">end</text>
          <text x="12" y="46" font-size="8" fill="var(--text-faint)">high</text>
          <text x="12" y="96" font-size="8" fill="var(--text-faint)">low</text>
          <text x="174" y="150" text-anchor="middle" font-size="9" fill="var(--ion)">so: put the best-reranked chunks first and last</text>
          <rect x="46" y="162" width="52" height="22" rx="4" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.8"/>
          <text x="72" y="177" text-anchor="middle" font-size="8">rank 1</text>
          <rect x="102" y="162" width="52" height="22" rx="4" fill="var(--panel-raised)" stroke="var(--line)" stroke-width="1.4"/>
          <text x="128" y="177" text-anchor="middle" font-size="8" fill="var(--text-faint)">rank 4</text>
          <rect x="158" y="162" width="52" height="22" rx="4" fill="var(--panel-raised)" stroke="var(--line)" stroke-width="1.4"/>
          <text x="184" y="177" text-anchor="middle" font-size="8" fill="var(--text-faint)">rank 5</text>
          <rect x="214" y="162" width="52" height="22" rx="4" fill="var(--panel-raised)" stroke="var(--line)" stroke-width="1.4"/>
          <text x="240" y="177" text-anchor="middle" font-size="8" fill="var(--text-faint)">rank 3</text>
          <rect x="270" y="162" width="52" height="22" rx="4" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.8"/>
          <text x="296" y="177" text-anchor="middle" font-size="8">rank 2</text>
          <text x="174" y="202" text-anchor="middle" font-size="8" fill="var(--text-faint)">reranking decides what gets in - ordering decides whether it gets used</text>
        </svg>`,
        caption: "Models attend most reliably to the beginning and end of their context and least reliably to the middle. That makes context construction a real step: after reranking picks the best chunks, where you place them changes whether the model actually uses them.",
      },
      hook: "<p>Retrieval gets you a rough shortlist fast. Reranking is the expensive-but-precise second pass that decides what the model actually sees - and it's the step most beginner RAG systems skip entirely.</p>",
      explain: `<p>The bi-encoders used for initial retrieval embed the query and each chunk <em>separately</em> and compare the resulting vectors - fast and scalable to millions of chunks, but less precise, because the query and chunk text never actually interact during scoring. <strong>Cross-encoders</strong>, used for reranking, instead feed the query and one candidate chunk <em>together</em> into a single model that scores their joint relevance directly. This is far more accurate, because the model can attend across both texts at once - but it's too slow to run over an entire corpus, so it's only practical on a small shortlist, typically reranking the top 30–50 candidates down to the best 3–5.</p>
      <p>This two-stage <strong>retrieve-then-rerank</strong> pattern - fast and approximate first, slow and precise second - is standard production practice, and skipping it is the single most common gap in naive RAG demos. Without it, a genuinely relevant chunk that happened to rank #7 or #12 by rough embedding similarity can simply never make it into a top-3 context window, and the system silently fails on a question it actually had the answer for.</p>
      <p>Reranking also has to contend with the <strong>"lost in the middle"</strong> problem: LLMs empirically attend more reliably to information at the very start or end of a long context than to content buried in the middle. So after reranking narrows down the best chunks, their <em>order</em> in the final prompt matters - the most relevant chunks belong near the beginning and/or end, not scattered arbitrarily.</p>
      <p>Context construction rounds out the stage: <strong>deduplication</strong> (multiple retrieved chunks sometimes restate the same fact, wasting tokens and potentially confusing the model), optional <strong>compression</strong> (extracting just the relevant sentences from a long chunk before insertion), and <strong>citation tagging</strong> (marking each chunk with a source reference like [1] so the final answer can point back to exactly where a claim came from, enabling verification).</p>`,
      analogy:
        "<p>Retrieval is a metal detector sweeping a beach, flagging fifty spots that might have something. Reranking is digging carefully at just those fifty spots to find the actual coins and rank them by value - you wouldn't dig the whole beach, but you also wouldn't trust the detector's rough beep alone.</p>",
      example:
        "<p>A user asks a legal-docs RAG system about a specific liability clause. Initial dense retrieval returns the correct clause at rank #7 out of 50 candidates, buried below more generic contract boilerplate that happened to score deceptively high on embedding similarity. A cross-encoder reranker reads each candidate jointly with the query and correctly promotes the real clause to rank #1. Without reranking, if only the unranked top-3 had been kept, the actual answer would have been silently dropped before generation ever saw it.</p>",
      takeaways: [
        "Bi-encoders (fast, separate embeddings) retrieve a shortlist; cross-encoders (slow, joint scoring) rerank it for precision - a two-stage pattern beginners frequently skip.",
        "Skipping reranking risks silently dropping the correct chunk if it wasn't in the top few by rough similarity alone.",
        "\"Lost in the middle\": LLMs read the start and end of a context more reliably than the middle, so chunk order after reranking matters.",
        "Context construction includes deduplication, optional compression, and citation tagging - not just concatenating retrieved text.",
        "This is the difference between \"found the right document\" and \"the model actually used it correctly.\"",
      ],
      quiz: [
        {
          q: "Why are cross-encoders more accurate than bi-encoders but unusable over an entire corpus?",
          options: [
            "Cross-encoders don't use neural networks",
            "Bi-encoders are always more accurate",
            "Cross-encoders only work on short documents",
            "They score the query and chunk jointly (more accurate) but must run once per candidate, so they only scale to a small shortlist",
          ],
          answer: 3,
          explain: "Joint scoring lets the model attend across both texts, but that per-pair cost is only affordable on a narrowed-down shortlist.",
        },
        {
          q: "What's the risk of skipping reranking entirely?",
          options: [
            "Retrieval becomes faster",
            "The vector database stops working",
            "A genuinely relevant chunk ranked outside the top few by rough similarity can be silently dropped before generation",
            "Chunking quality decreases",
          ],
          answer: 2,
          explain: "Without a precise second pass, only whatever the fast first-pass approximation ranked highly ever reaches the model.",
        },
        {
          q: "What does the \"lost in the middle\" finding imply for context construction?",
          options: [
            "Chunk order doesn't matter once reranking is done",
            "Only one chunk should ever be included",
            "Reranking should be skipped",
            "The most relevant chunks should be placed near the start and/or end of the assembled context, not buried in the middle",
          ],
          answer: 3,
          explain: "LLMs attend less reliably to mid-context content, so where a reranked chunk is placed in the final prompt still matters.",
        },
        {
          q: "Why is deduplication part of context construction?",
          options: [
            "It replaces the need for chunking",
            "It only matters for sparse retrieval",
            "It's purely cosmetic",
            "Multiple retrieved chunks can restate the same fact, wasting tokens and potentially confusing the model",
          ],
          answer: 3,
          explain: "Redundant chunks eat into the context budget without adding information, and can even skew the model toward over-weighting a repeated claim.",
        },
        {
          q: "What is the retrieve-then-rerank pattern?",
          options: [
            "Skipping retrieval and reranking directly",
            "A fast, approximate retrieval pass to get a shortlist, followed by a slower, precise rerank of just that shortlist",
            "Running reranking before any retrieval happens",
            "Retrieving twice with the same method",
          ],
          answer: 1,
          explain: "This two-stage design balances scalability (fast first pass) with precision (slow second pass on a narrowed set).",
        },
      ],
    },
    {
      id: "p3-c7",
      plain: "<p>Smarter setups let the model check its own retrieved evidence and search again if it isn't good enough, instead of blindly answering from one lookup. It's the difference between grabbing the first book you see and verifying you found the right one.</p>",
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
      diagram2: {
        type: "compare",
        query: "What's our refund policy for enterprise contracts?",
        left: {
          label: "Naive RAG",
          stages: ["Retrieve the top-k chunks", "Feed them straight to the model", "No check on whether they fit"],
          outcome: { icon: "✕", text: "answers from a weak, off-topic chunk", kind: "miss" },
        },
        right: {
          label: "Corrective RAG (CRAG)",
          stages: ["Retrieve, then grade each chunk", "Good / ambiguous / incorrect", "On low confidence, fall back to a web search"],
          outcome: { icon: "✓", text: "answers only from verified, on-topic evidence", kind: "match" },
        },
      },
      diagram3: {
        type: "figure",
        title: "Flat chunks vs a knowledge graph",
        svg: `<svg viewBox="0 0 360 200" role="img" aria-label="Flat disconnected chunks versus a linked entity graph">
          <text x="80" y="16" text-anchor="middle" font-size="10" fill="var(--text-muted)">Flat chunks</text>
          <rect x="22" y="34" width="116" height="30" rx="5" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="1.6"/>
          <rect x="22" y="80" width="116" height="30" rx="5" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="1.6"/>
          <rect x="22" y="126" width="116" height="30" rx="5" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="1.6"/>
          <text x="80" y="53" text-anchor="middle" font-size="9" fill="var(--text-faint)">passage · no links</text>
          <text x="80" y="99" text-anchor="middle" font-size="9" fill="var(--text-faint)">passage · no links</text>
          <text x="80" y="145" text-anchor="middle" font-size="9" fill="var(--text-faint)">passage · no links</text>
          <line x1="178" y1="18" x2="178" y2="182" stroke="var(--line)" stroke-width="1.4" stroke-dasharray="3 4"/>
          <text x="288" y="16" text-anchor="middle" font-size="10" fill="var(--text-muted)">Entity graph</text>
          <line x1="288" y1="58" x2="330" y2="120" stroke="var(--amber)" stroke-width="1.6"/>
          <line x1="288" y1="58" x2="240" y2="120" stroke="var(--amber)" stroke-width="1.6"/>
          <text x="322" y="92" font-size="8" fill="var(--text-faint)">HQ 2023</text>
          <text x="252" y="92" text-anchor="end" font-size="8" fill="var(--text-faint)">CEO</text>
          <rect x="252" y="34" width="72" height="24" rx="12" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.6"/>
          <text x="288" y="50" text-anchor="middle" font-size="9">Acme Corp</text>
          <rect x="208" y="120" width="64" height="22" rx="11" fill="var(--panel-raised)" stroke="var(--amber)" stroke-width="1.6"/>
          <text x="240" y="135" text-anchor="middle" font-size="9">R. Rao</text>
          <rect x="300" y="120" width="56" height="22" rx="11" fill="var(--panel-raised)" stroke="var(--amber)" stroke-width="1.6"/>
          <text x="328" y="135" text-anchor="middle" font-size="9">Denver</text>
        </svg>`,
        caption: "Flat retrieval sees disconnected passages; GraphRAG links entities so it can follow relationships - who leads what, what moved where - that pure similarity handles poorly.",
      },
      hook: "<p>Everything so far is \"retrieve once, generate once.\" Real systems increasingly retrieve, check their own work, and retrieve again - RAG folded into an agent loop.</p>",
      explain: `<p><strong>Naive RAG</strong> - one retrieval pass, straight into generation, no self-checking - works for simple factual queries and breaks down on complex, ambiguous, or multi-part ones. Several strategies fix this.</p>
      <p><strong>Self-RAG</strong> trains or prompts the model to make explicit decisions during the process: does this query even need retrieval, is this retrieved passage actually relevant, is my draft answer actually supported by it - making retrieval conditional and self-critiqued instead of automatic and blind. <strong>Corrective RAG (CRAG)</strong> adds a lightweight evaluator after retrieval that grades chunks as correct, ambiguous, or incorrect; on low confidence, it falls back to a broader search - such as live web search - instead of feeding weak context to the generator. <strong>Adaptive RAG</strong> routes each query dynamically: a simple factual question might skip retrieval entirely and answer from parametric memory (cheaper, faster), while a complex one triggers multi-step retrieval, based on a learned or prompted complexity classifier.</p>
      <p><strong>Multi-hop / iterative retrieval</strong> handles questions requiring chained reasoning - "what's the population of the city Company X moved its headquarters to in 2023?" A single retrieval pass can't answer this, because the query for the second fact doesn't exist until the first fact is resolved: retrieve the HQ move, extract the new city, then retrieve that city's population.</p>
      <p><strong>GraphRAG</strong> builds a knowledge graph of entities and relationships extracted from the corpus, rather than relying only on flat chunk vectors - enabling retrieval that follows explicit relationships ("who reports to whom," "which contracts reference which clause") that pure similarity search handles poorly, and enabling higher-level summarization by traversing graph communities.</p>
      <p>Finally, <strong>agentic RAG</strong> exposes retrieval to an LLM agent as a callable tool - this is the direct bridge to Part IV of this book - rather than a fixed pipeline stage. The agent decides <em>when</em> to retrieve, reformulates its <em>own</em> queries, chains multiple retrieval calls, and combines retrieval with other tools as part of a broader reasoning loop.</p>`,
      analogy:
        "<p>Naive RAG is asking a librarian a question and taking whatever they hand you the first time. Agentic and corrective RAG is a librarian who checks whether what they found actually answers your question - and if not, goes back and searches again, possibly down a completely different aisle.</p>",
      example:
        "<p>Asked for the population of the city Acme Corp moved its headquarters to in 2023, a single-pass system embeds the whole question at once - likely retrieving nothing useful, since no single passage contains both \"Acme's HQ move\" and \"that city's population.\" A multi-hop agentic system first retrieves the HQ-move announcement, extracts the new city's name, then issues a second retrieval for that city's population, and composes the final answer from both hops.</p>",
      takeaways: [
        "Naive RAG (one retrieval, no self-check) breaks down on complex, ambiguous, or multi-hop questions.",
        "Self-RAG and Corrective RAG add self-critique: deciding whether to retrieve, whether retrieved context is actually relevant, and falling back when it isn't.",
        "Adaptive RAG routes simple vs. complex queries differently instead of always retrieving the same way.",
        "Multi-hop retrieval chains multiple retrieval steps for questions where the second query doesn't exist until the first is answered.",
        "GraphRAG retrieves over explicit entity relationships, not just flat vector similarity.",
        "Agentic RAG treats retrieval as a tool an LLM agent calls on its own judgment - the direct bridge into agentic AI systems.",
      ],
      quiz: [
        {
          q: "Why does naive (single-pass) RAG struggle with multi-hop questions?",
          options: [
            "The query needed for the second fact doesn't exist until the first fact has been retrieved and resolved",
            "Multi-hop questions are always too short",
            "Naive RAG can't use embeddings",
            "Multi-hop questions never appear in real use",
          ],
          answer: 0,
          explain: "A single embed-and-retrieve pass can't chain reasoning - it has no way to formulate a query for a fact it hasn't found yet.",
        },
        {
          q: "What does Corrective RAG (CRAG) add on top of standard retrieval?",
          options: [
            "A requirement to always use BM25",
            "Removal of the reranking stage",
            "A post-retrieval evaluator that grades chunk relevance and falls back to broader search on low confidence",
            "A bigger vector index",
          ],
          answer: 2,
          explain: "CRAG's evaluator acts as a safety net, catching cases where naive retrieval would have fed weak context straight to the generator.",
        },
        {
          q: "What decision does Adaptive RAG make that naive RAG doesn't?",
          options: [
            "Whether to use a vector database at all",
            "Whether to chunk documents by paragraph or sentence",
            "Whether a given query needs retrieval at all, or can be answered cheaply from parametric memory",
            "Whether to use HTTPS for the API",
          ],
          answer: 2,
          explain: "Adaptive RAG routes based on query complexity, skipping unnecessary retrieval for simple questions and escalating for complex ones.",
        },
        {
          q: "How does GraphRAG differ from standard vector-based retrieval?",
          options: [
            "It retrieves over an explicit knowledge graph of entities and relationships, not just flat chunk similarity",
            "It doesn't use an LLM for generation",
            "It only works on numeric data",
            "It removes the need for chunking entirely",
          ],
          answer: 0,
          explain: "GraphRAG can follow explicit relationships between entities that pure embedding similarity struggles to represent.",
        },
        {
          q: "What makes RAG \"agentic\" specifically?",
          options: [
            "Retrieval is exposed as a tool an LLM agent calls on its own judgment, deciding when and how to retrieve as part of a reasoning loop",
            "Removing the generation step entirely",
            "Using a larger embedding model",
            "Running retrieval on a schedule",
          ],
          answer: 0,
          explain: "Agentic RAG hands control of retrieval timing and query formulation to the agent itself, rather than fixing it into one pipeline stage.",
        },
      ],
    },
    {
      id: "p3-c8",
      plain: "<p>A RAG system can look perfect in a demo and fail quietly in production. To trust it you must measure both halves separately: did it retrieve the right material, and did it answer faithfully from that material? This chapter is how.</p>",
      n: 8,
      title: "Evaluating & Productionizing RAG",
      short: "Looks great in the demo, fails silently in production - unless you measure both halves",
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
      diagram2: {
        type: "figure",
        title: "Diagnosing which half broke",
        svg: `<svg viewBox="0 0 360 216" role="img" aria-label="A two-by-two of retrieval quality against generation faithfulness">
          <text x="180" y="12" text-anchor="middle" font-size="8" fill="var(--text-faint)">did generation stay faithful to the context?</text>
          <text x="105" y="26" text-anchor="middle" font-size="8" fill="var(--text-faint)">no</text>
          <text x="265" y="26" text-anchor="middle" font-size="8" fill="var(--text-faint)">yes</text>
          <text x="14" y="76" font-size="8" fill="var(--text-faint)" transform="rotate(-90 14 76)">retrieval found it?</text>
          <text x="30" y="60" text-anchor="middle" font-size="8" fill="var(--text-faint)">yes</text>
          <text x="30" y="150" text-anchor="middle" font-size="8" fill="var(--text-faint)">no</text>
          <rect x="44" y="32" width="146" height="62" rx="7" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="2"/>
          <text x="117" y="54" text-anchor="middle" font-size="9" fill="var(--ion)">GENERATION BUG</text>
          <text x="117" y="70" text-anchor="middle" font-size="8" fill="var(--text-faint)">right evidence retrieved,</text>
          <text x="117" y="82" text-anchor="middle" font-size="8" fill="var(--text-faint)">model ignored or twisted it</text>
          <rect x="196" y="32" width="146" height="62" rx="7" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="2"/>
          <text x="269" y="54" text-anchor="middle" font-size="9" fill="var(--amber)">WORKING</text>
          <text x="269" y="70" text-anchor="middle" font-size="8" fill="var(--text-faint)">good context in,</text>
          <text x="269" y="82" text-anchor="middle" font-size="8" fill="var(--text-faint)">grounded answer out</text>
          <rect x="44" y="102" width="146" height="62" rx="7" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="1.8"/>
          <text x="117" y="124" text-anchor="middle" font-size="9">BOTH BROKEN</text>
          <text x="117" y="140" text-anchor="middle" font-size="8" fill="var(--text-faint)">fix retrieval first -</text>
          <text x="117" y="152" text-anchor="middle" font-size="8" fill="var(--text-faint)">generation can't beat it</text>
          <rect x="196" y="102" width="146" height="62" rx="7" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="2"/>
          <text x="269" y="124" text-anchor="middle" font-size="9" fill="var(--ion)">RETRIEVAL BUG</text>
          <text x="269" y="140" text-anchor="middle" font-size="8" fill="var(--text-faint)">faithful to the context -</text>
          <text x="269" y="152" text-anchor="middle" font-size="8" fill="var(--text-faint)">but the context was wrong</text>
          <text x="180" y="186" text-anchor="middle" font-size="8" fill="var(--text-faint)">a single end-to-end "is the answer good?" score collapses all four</text>
          <text x="180" y="202" text-anchor="middle" font-size="8" fill="var(--text-faint)">boxes into one number - and tells you nothing about what to fix</text>
        </svg>`,
        caption: "Notice the bottom-right box: an answer can be perfectly faithful to its retrieved context and still be wrong, because the context itself was wrong. That's exactly the failure a single end-to-end score hides, and why the two halves are measured separately.",
      },
      hook: "<p>A RAG system can look great in a demo and fail silently in production - because retrieval quality and generation quality need to be measured separately, and almost nobody does both.</p>",
      explain: `<p>RAG evaluation has to separate two distinct failure surfaces: did the system <strong>retrieve</strong> the right information, and did the model <strong>use</strong> it correctly? A system can fail at either independently - perfect retrieval paired with a model that ignores the context, or terrible retrieval paired with a model that hallucinates confidently regardless of what it was given.</p>
      <p><strong>Retrieval metrics:</strong> <strong>Context Precision</strong> measures, of the chunks actually retrieved, what fraction are genuinely relevant - high noise, low precision. <strong>Context Recall</strong> measures, of the relevant chunks that exist anywhere in the corpus, what fraction were actually retrieved - missed information, low recall. <strong>Generation metrics:</strong> <strong>Faithfulness</strong> (or groundedness) checks whether the generated answer's claims actually follow from the retrieved context, or whether the model added unsupported claims on top of it - still hallucinating, just with evidence sitting right there unused. <strong>Answer Relevancy</strong> checks whether the answer actually addresses the question asked, as opposed to being accurate but off-topic.</p>
      <p>These four metrics - often computed via an LLM-as-judge, following the same pattern as Part I, Chapter 8 - form the backbone of evaluation frameworks like RAGAS. All four need to be tracked, not just "does the final answer look right," because a single overall judgment can't tell you <em>which stage</em> to fix.</p>
      <p>Specific failure modes worth explicitly testing for: retrieval surfacing <strong>outdated or superseded documents</strong> (a freshness bug), the model <strong>citing a source that doesn't actually support the claim</strong> (a citation mismatch), <strong>context window overflow</strong> silently truncating retrieved chunks, and - most commonly skipped of all - <strong>"no answer exists in the corpus"</strong> cases, where the correct behavior is admitting it doesn't know rather than falling back to parametric hallucination. Many teams never test this last case at all.</p>
      <p>Production monitoring means continuously logging retrieved chunks and generated answers, sampling for human or LLM-judge review, and tracking these metrics over time as the corpus and the distribution of incoming queries drift. RAG evaluation isn't a one-time pre-launch checklist - like index freshness in Chapter 4, it's an ongoing pipeline.</p>`,
      analogy:
        "<p>Judging a RAG system only by \"does the final answer sound right\" is like judging a research paper only by whether the abstract reads well - you'd never notice whether the citations actually support the claims, or whether the literature review missed half the relevant prior work.</p>",
      example:
        "<p>A RAG support bot answers fluently and confidently, citing a source. Evaluation reveals the cited chunk doesn't actually contain that claim - a faithfulness failure - and separately, the genuinely relevant chunk existed in the corpus but was never retrieved at all - a context recall failure. Two distinct bugs, at two different pipeline stages, that \"the answer sounded good\" would have completely hidden.</p>",
      math: [
        {
          expr: "Context Precision = <span>relevant chunks retrieved</span> ⁄ <span>total chunks retrieved</span>",
          note: "How much of what you handed the model was actually useful - low precision means the context is diluted with noise.",
        },
        {
          expr: "Context Recall = <span>relevant chunks retrieved</span> ⁄ <span>total relevant chunks in corpus</span>",
          note: "How much of the useful information that exists was actually found - low recall means the answer is missing evidence that was there to find.",
        },
        {
          expr: "Faithfulness = <span>claims supported by context</span> ⁄ <span>total claims in the answer</span>",
          note: "How much of the generated answer is actually grounded in what was retrieved, versus invented on top of it - the direct measure of whether RAG is still hallucinating despite having evidence in hand.",
        },
      ],
      takeaways: [
        "RAG evaluation must separate retrieval quality from generation quality - they fail independently and need different fixes.",
        "Context Precision (retrieved chunks that are relevant) and Context Recall (relevant chunks that were retrieved) are the core retrieval metrics.",
        "Faithfulness (grounded in context) and Answer Relevancy (addresses the question) are the core generation metrics.",
        "Explicitly test edge cases: outdated documents, citation mismatches, context overflow, and \"no answer exists - say so\" cases.",
        "RAG evaluation is ongoing production monitoring, not a one-time pre-launch check - corpora and queries drift over time.",
      ],
      quiz: [
        {
          q: "Why must RAG evaluation separate retrieval quality from generation quality?",
          options: [
            "Retrieval quality can't be measured",
            "They always fail together, so it doesn't matter",
            "Generation quality is the only thing that matters",
            "A system can fail at either independently, and a single \"does the answer look right\" judgment can't reveal which stage to fix",
          ],
          answer: 3,
          explain: "Perfect retrieval with a model that ignores context, or bad retrieval with a confidently hallucinating model, are different bugs needing different fixes.",
        },
        {
          q: "What does low Context Recall indicate?",
          options: [
            "The retrieved chunks are full of irrelevant noise",
            "The model is hallucinating",
            "The embedding model is too large",
            "Relevant information that exists in the corpus was not actually retrieved",
          ],
          answer: 3,
          explain: "Context Recall measures how much of the relevant material in the corpus made it into the retrieved set - low recall means information was missed.",
        },
        {
          q: "What does the Faithfulness metric specifically catch?",
          options: [
            "Chunks that are too large",
            "The model adding claims to its answer that aren't actually supported by the retrieved context",
            "Slow retrieval latency",
            "A missing vector database index",
          ],
          answer: 1,
          explain: "Faithfulness checks groundedness - whether the answer's claims genuinely follow from the evidence handed to the model, or were invented anyway.",
        },
        {
          q: "Why is testing \"no answer exists in the corpus\" cases important, and why is it commonly skipped?",
          options: [
            "It only applies to sparse retrieval",
            "It's not important, RAG systems should always produce an answer",
            "The correct behavior is admitting uncertainty rather than falling back to hallucination, but many teams never explicitly test for this case",
            "It tests embedding model speed",
          ],
          answer: 2,
          explain: "Without this test, a system that should say \"I don't know\" may instead quietly fall back to confident parametric hallucination.",
        },
        {
          q: "Why is RAG evaluation described as \"ongoing production monitoring\" rather than a one-time check?",
          options: [
            "Because the corpus and the distribution of incoming queries drift over time, the same way index freshness is an ongoing concern",
            "Because evaluation frameworks like RAGAS only run once",
            "Because generation metrics are static once measured",
            "Because retrieval metrics never change",
          ],
          answer: 0,
          explain: "A RAG system that scored well at launch can degrade silently as documents age and user queries shift, so monitoring has to be continuous.",
        },
      ],
    },
  ],
};

window.PARTS = window.PARTS || {};
window.PARTS[window.PART_DATA.id] = window.PART_DATA;
