/* ============================================================
   Content data — Part I: LLM Foundations
   Single source of truth rendered by BOTH the gamified quest
   pages and the Simple-mode revise page.
   ============================================================ */

window.PART_DATA = {
  id: "part-1",
  index: 1,
  title: "LLM Foundations",
  tagline: "From counting words to reasoning machines",
  color: "ion",
  mapViewBox: "0 0 1000 1260",
  edges: [
    ["p1-c1", "p1-c2"],
    ["p1-c2", "p1-c3"],
    ["p1-c3", "p1-c4"],
    ["p1-c3", "p1-c7"],
    ["p1-c4", "p1-c5"],
    ["p1-c5", "p1-c6"],
    ["p1-c6", "p1-c8"],
    ["p1-c7", "p1-c8"],
  ],
  badges: {
    first: { id: "p1-first", label: "First Signal — completed your first chapter" },
    complete: { id: "p1-complete", label: "Foundations Master — cleared all of Part I" },
  },
  chapters: [
    {
      id: "p1-c1",
      n: 1,
      title: "From N-Grams to Neural Language Models",
      short: "Why we needed a new paradigm",
      requires: [],
      xp: 90,
      node: { x: 500, y: 90 },
      diagram: {
        type: "compare",
        query: "the dog sat on the ___",
        left: {
          label: "N-gram model",
          stages: ["Count exact sequences", "Sparse table lookup", "No generalization"],
          outcome: { icon: "✕", text: "trigram never seen — no prediction", kind: "miss" },
        },
        right: {
          label: "Neural LM",
          stages: ["Learned embeddings", "Differentiable function", "Generalizes to unseen text"],
          outcome: { icon: "✓", text: "predicts \"mat\" via nearby vectors", kind: "match" },
        },
      },
      math: [
        {
          expr: "P(w<sub>1</sub>, ..., w<sub>n</sub>) = ∏<sub>i=1</sub><sup>n</sup> P(w<sub>i</sub> | w<sub>1</sub>, ..., w<sub>i−1</sub>)",
          note: "The <strong>chain rule of probability</strong> — any sentence's probability factors into a product of next-word predictions, each conditioned on everything before it. This is the identity every language model, n-gram or neural, is built to approximate.",
        },
        {
          expr: "P(w<sub>i</sub> | w<sub>1</sub>...w<sub>i−1</sub>) ≈ P(w<sub>i</sub> | w<sub>i−n+1</sub>...w<sub>i−1</sub>)",
          note: "The <strong>n-gram (Markov) approximation</strong>: instead of conditioning on the entire history, only look at the last n−1 words. This is what makes counting tractable — and exactly what caps an n-gram model's context window.",
        },
        {
          expr: "P(w<sub>i</sub> | w<sub>i−1</sub>) = <span>count(w<sub>i−1</sub>, w<sub>i</sub>) + 1</span> ⁄ <span>count(w<sub>i−1</sub>) + V</span>",
          note: "<strong>Add-one (Laplace) smoothing</strong> for a bigram model, with vocabulary size <code>V</code>. Without the +1/+V terms, any unseen pair gets probability zero — smoothing is the classic patch for the sparsity problem, though it still can't manufacture meaning the way embeddings do.",
        },
      ],
      hook: "<p>Language models existed decades before ChatGPT. What actually changed isn't the goal — it's the mechanism: a shift from <strong>counting</strong> to <strong>computing</strong>.</p>",
      explain: `<p>A language model's job is simple to state: estimate the probability of the next word given everything said so far, P(w<sub>n</sub> | w<sub>1</sub>...w<sub>n-1</sub>). The earliest practical approach, the <strong>n-gram model</strong>, did this by brute-force counting — tally how often each short sequence of words (a bigram, trigram, etc.) appears in a corpus, then use those frequencies as probabilities, with smoothing techniques to avoid assigning zero probability to sequences never seen.</p>
      <p>This works, but breaks down fast. Most possible word sequences never appear in any training corpus, no matter how large (the <strong>sparsity problem</strong>). N-grams have no way to relate "cat" and "kitten" — to the model they're just two unrelated table entries. And because storage grows exponentially with N, n-gram models are stuck with a short, fixed context window.</p>
      <p>Neural language models — starting with Bengio's 2003 feedforward network, then RNNs and LSTMs, then Transformers from 2017 onward — replace the lookup table with <strong>learned continuous vector representations</strong> (embeddings) and differentiable functions trained by gradient descent. Because similar words end up with similar vectors, the model generalizes across meaning instead of memorizing exact strings.</p>`,
      analogy:
        "<p>An n-gram model is a phrasebook that only knows exact sentences it has memorized. A neural LM is someone who actually learned the grammar and meaning underneath — so they can understand and produce sentences they've never encountered before.</p>",
      example:
        "<p>Given \"the cat sat on the ___\", a trigram model looks up what literally followed \"sat on the\" in its training data — if that exact trigram never occurred, it has nothing. A neural LM instead represents <em>cat</em>, <em>dog</em>, <em>mat</em> as vectors that capture meaning, so it can correctly complete \"the dog sat on the ___\" even having never seen that exact phrase, because <em>dog</em> sits near <em>cat</em> in vector space.</p>",
      takeaways: [
        "A language model's core job: predict a probability distribution over the next token given context.",
        "N-gram models are counting-based and sparse — they cannot generalize beyond exact sequences seen.",
        "Neural LMs use continuous embeddings and differentiable functions, enabling generalization across meaning.",
        "This shift — symbolic counting to learned representations — is the foundation every later concept in this book builds on.",
      ],
      quiz: [
        {
          q: "What is the fundamental limitation of n-gram models?",
          options: [
            "They require GPUs to run",
            "They cannot generalize to unseen word sequences due to sparse counting",
            "They cannot be trained on real text",
            "They only work for the English language",
          ],
          answer: 1,
          explain: "N-grams rely on exact sequence counts; anything not seen during training simply has no signal.",
        },
        {
          q: "What does a neural language model fundamentally replace the n-gram's lookup table with?",
          options: [
            "A larger lookup table",
            "Continuous vector embeddings and learned differentiable functions",
            "A random number generator",
            "Hand-written grammar rules",
          ],
          answer: 1,
          explain: "Embeddings plus differentiable computation let the model generalize instead of memorize.",
        },
        {
          q: "Why can a neural LM correctly complete \"the dog sat on the ___\" without seeing that exact phrase?",
          options: [
            "It secretly memorized it",
            "Because words with similar meaning have similar vector representations",
            "Because of smoothing applied to n-grams",
            "It can't — this is also a limitation of neural LMs",
          ],
          answer: 1,
          explain: "Similar contexts push word vectors close together, so meaning transfers across similar words.",
        },
        {
          q: "What core idea do Bengio's feedforward LM, RNNs, LSTMs, and Transformers all share?",
          options: [
            "They only predict from a small fixed vocabulary",
            "They represent words as learned vectors combined via differentiable neural computation",
            "They rely entirely on rule-based parsing",
            "They avoid probability altogether",
          ],
          answer: 1,
          explain: "All of them are neural approaches built on learned vector representations, unlike n-grams.",
        },
        {
          q: "In P(wᵢ | wᵢ₋₁) = (count(wᵢ₋₁,wᵢ) + 1) / (count(wᵢ₋₁) + V), what problem do the \"+1\" and \"+V\" terms solve?",
          options: [
            "They make training faster",
            "They prevent any unseen word pair from getting a probability of exactly zero",
            "They increase the vocabulary size",
            "They remove the need for a corpus",
          ],
          answer: 1,
          explain: "This is Laplace smoothing — without it, one unseen bigram would zero out an entire sentence's probability.",
        },
      ],
    },
    {
      id: "p1-c2",
      n: 2,
      title: "Tokenization & Embeddings",
      short: "Turning text into numbers a model can use",
      requires: ["p1-c1"],
      xp: 90,
      node: { x: 500, y: 260 },
      diagram: { type: "pipeline", stages: ["Raw text", "Subword tokens", "Token IDs", "Embedding vectors"] },
      diagram2: {
        type: "embed",
        points: [
          { label: "cat", x: 20, y: 28, cluster: "animal" },
          { label: "kitten", x: 30, y: 20, cluster: "animal" },
          { label: "dog", x: 14, y: 40, cluster: "animal" },
          { label: "puppy", x: 24, y: 48, cluster: "animal" },
          { label: "mat", x: 74, y: 64, cluster: "object" },
          { label: "rug", x: 84, y: 58, cluster: "object" },
          { label: "table", x: 70, y: 80, cluster: "object" },
          { label: "run", x: 50, y: 12, cluster: "verb" },
          { label: "sit", x: 60, y: 18, cluster: "verb" },
        ],
      },
      diagram3: {
        type: "vectorstrip",
        caption: "What an embedding actually is — 12 of a real model's ~768–4096 dimensions",
        rows: [
          { label: "cat", values: [0.82, -0.14, 0.55, 0.09, -0.61, 0.33, -0.05, 0.71, -0.22, 0.18, -0.47, 0.60] },
          { label: "kitten", values: [0.79, -0.09, 0.61, 0.14, -0.58, 0.29, -0.11, 0.68, -0.19, 0.22, -0.51, 0.55] },
          { label: "car", values: [-0.31, 0.72, -0.08, -0.65, 0.44, -0.19, 0.83, -0.27, 0.58, -0.36, 0.12, -0.09] },
        ],
        note: "Illustrative values, not a real model's actual output. Notice cat and kitten land on nearly the same color in nearly every position — that's what \"similar meaning\" looks like as raw numbers. car's pattern barely matches: different signs, different magnitudes, almost everywhere. A real embedding is this same idea stretched across hundreds or thousands of dimensions.",
      },
      math: [
        {
          expr: "e<sub>i</sub> = E x<sub>i</sub>",
          note: "Looking up an embedding is just a matrix multiply: <code>E</code> is the embedding matrix (dimensions d × V, one column per vocabulary token), and <code>xᵢ</code> is a one-hot vector selecting token i. In practice this is implemented as a direct row lookup, not a real matmul, for speed.",
        },
        {
          expr: "cos(θ) = <span>a · b</span> ⁄ <span>‖a‖ ‖b‖</span>",
          note: "<strong>Cosine similarity</strong> — the standard way to measure how \"close\" two embeddings are, using the angle between them rather than raw distance. This is what \"nearby vectors\" means concretely: a high cosine similarity (close to 1) between two token vectors.",
        },
        {
          expr: "vec(king) − vec(man) + vec(woman) ≈ vec(queen)",
          note: "The analogy result is just vector arithmetic on embeddings — addition and subtraction of the learned coordinates, with the result landing near another real word's vector.",
        },
      ],
      hook: "<p>Neural networks don't read text. They read numbers. Tokenization is the bridge between the two.</p>",
      explain: `<p>Tokenization splits raw text into units the model can process. <strong>Word-level</strong> tokenization gives a huge vocabulary and fails on any word it hasn't seen (the "out-of-vocabulary" problem). <strong>Character-level</strong> tokenization has a tiny vocabulary but produces very long sequences and struggles to capture meaning per unit. The modern standard is <strong>subword tokenization</strong> — algorithms like Byte Pair Encoding (BPE), WordPiece, and SentencePiece/Unigram — which build a vocabulary of frequently occurring character sequences. Common words become a single token; rare or unseen words get split into meaningful pieces.</p>
      <p>Once text is tokenized, each token ID is mapped to a dense vector — the <strong>embedding</strong> — via a learned matrix, typically a few hundred to several thousand dimensions. These vectors are adjusted during training so tokens used in similar contexts end up near each other in vector space, following the distributional hypothesis: a word is characterized by the company it keeps.</p>
      <p>The geometry that emerges is strikingly structured — the famous demonstration <em>king − man + woman ≈ queen</em> arises purely from co-occurrence patterns in training text, with no explicit rule ever written for it.</p>`,
      analogy:
        "<p>Tokenization is chopping a sentence into LEGO-sized pieces small enough to be reused across countless other builds. Embeddings are the coordinates on a giant map where pieces with related meaning end up as neighbors.</p>",
      example:
        '<p>BPE might encode "unbelievable" as three tokens — ["un", "believ", "able"] — rather than one word-token, because those pieces recur across many other words. This keeps vocabulary size manageable while still letting rare or brand-new words be represented as compositions of familiar chunks.</p>',
      takeaways: [
        "Models operate on token IDs, not raw text — tokenization is the first transformation in the pipeline.",
        "Subword tokenization (BPE / WordPiece / Unigram) balances vocabulary size against sequence length and handles unseen words gracefully.",
        "Each token ID maps to a learned embedding vector; nearby vectors mean related meaning.",
        "Embedding geometry (king − man + woman ≈ queen) emerges from training data, not manual design.",
        "Tokenization choices directly affect cost — more tokens means more compute and less room in the context window.",
      ],
      quiz: [
        {
          q: "Why do modern LLMs use subword tokenization instead of pure word-level tokenization?",
          options: [
            "It's faster to type",
            "It handles unseen or rare words gracefully while keeping vocabulary size manageable",
            "It removes the need for embeddings",
            "It guarantees perfect translations",
          ],
          answer: 1,
          explain: "Subword units let the model represent any input, even new words, by composing familiar pieces.",
        },
        {
          q: "What is an embedding?",
          options: [
            "A compressed version of the raw text file",
            "A learned dense vector representation of a token capturing contextual meaning",
            "A hash of the token for storage efficiency",
            "A rule that maps grammar to syntax trees",
          ],
          answer: 1,
          explain: "Embeddings are learned vectors positioned so that related tokens end up near each other.",
        },
        {
          q: "The relation king − man + woman ≈ queen demonstrates what?",
          options: [
            "A manually programmed rule",
            "That embedding space geometry encodes semantic relationships learned from data",
            "A tokenization bug",
            "That the model memorized this specific fact",
          ],
          answer: 1,
          explain: "This structure emerges purely from training on co-occurrence patterns, not explicit design.",
        },
        {
          q: "Why does tokenization matter for cost, not just correctness?",
          options: [
            "It doesn't affect cost at all",
            "More tokens per input means more compute and counts against the context window budget",
            "Tokenizers are billed separately from models",
            "Only character-level tokenizers cost money",
          ],
          answer: 1,
          explain: "Every token consumes compute and context-window space, so tokenization efficiency has real cost impact.",
        },
        {
          q: "Cosine similarity cos(θ) = (a·b) / (‖a‖‖b‖) measures what, exactly?",
          options: [
            "The literal distance in characters between two words",
            "The angle between two embedding vectors — how aligned their directions are, regardless of magnitude",
            "How many times two words co-occur in the corpus",
            "The size of the embedding matrix",
          ],
          answer: 1,
          explain: "Cosine similarity normalizes out vector length and compares direction — the standard \"closeness\" metric in embedding space.",
        },
      ],
    },
    {
      id: "p1-c3",
      n: 3,
      title: "Transformer Architecture",
      short: "Attention is all you need",
      requires: ["p1-c2"],
      xp: 100,
      node: { x: 500, y: 430 },
      diagram: {
        type: "stack",
        label: "Transformer block × N",
        stages: ["Self-attention (Q / K / V)", "Add + norm", "Feed-forward network", "Add + norm"],
      },
      diagram2: {
        type: "attention",
        tokens: ["The", "trophy", "didn't", "fit", "in", "the", "suitcase", "because", "it", "was", "too", "big"],
        sequence: [
          { query: 8, weights: { 1: 0.58, 6: 0.09, 3: 0.14, 11: 0.08, 2: 0.06 } },
          { query: 3, weights: { 1: 0.34, 6: 0.3, 4: 0.14, 8: 0.07 } },
          { query: 11, weights: { 1: 0.46, 8: 0.22, 6: 0.1 } },
        ],
      },
      math: [
        {
          expr: "Attention(Q, K, V) = softmax( QK<sup>T</sup> ⁄ √d<sub>k</sub> ) V",
          note: "The single most important formula in this book. <code>Q</code>, <code>K</code>, <code>V</code> are matrices of Query, Key, and Value vectors (one row per token). <code>QKᵀ</code> scores every token against every other token; dividing by <code>√d_k</code> (the key dimension) keeps those scores from growing too large before the softmax; softmax turns scores into weights that sum to 1; multiplying by <code>V</code> produces the weighted blend of other tokens' information.",
        },
        {
          expr: "softmax(z<sub>i</sub>) = e<sup>z<sub>i</sub></sup> ⁄ Σ<sub>j</sub> e<sup>z<sub>j</sub></sup>",
          note: "Turns any vector of raw scores into a valid probability distribution — every value between 0 and 1, all summing to 1. This same function reappears in Chapter 7 to turn the model's output scores into next-token probabilities.",
        },
        {
          expr: "MultiHead(Q,K,V) = Concat(head<sub>1</sub>, ..., head<sub>h</sub>) W<sup>O</sup>, &nbsp; head<sub>i</sub> = Attention(QW<sub>i</sub><sup>Q</sup>, KW<sub>i</sub><sup>K</sup>, VW<sub>i</sub><sup>V</sup>)",
          note: "Multi-head attention just runs the formula above h times in parallel, each with its own learned projection matrices (<code>Wᵢ^Q, Wᵢ^K, Wᵢ^V</code>), then concatenates and linearly recombines the results with <code>W^O</code> — letting each head specialize in a different kind of relationship.",
        },
        {
          expr: "PE(pos, 2i) = sin( pos ⁄ 10000<sup>2i/d</sup> ), &nbsp; PE(pos, 2i+1) = cos( pos ⁄ 10000<sup>2i/d</sup> )",
          note: "The original sinusoidal positional encoding: each position gets a unique pattern of sine/cosine values across the embedding dimensions, added directly to the token embedding so the model can recover word order.",
        },
      ],
      hook: "<p>One 2017 paper — \"Attention Is All You Need\" — replaced recurrence with a mechanism that lets every token look directly at every other token, at once.</p>",
      explain: `<p>Earlier sequence models (RNNs, LSTMs) processed tokens one at a time, in order. This made long-range dependencies hard to learn (gradients vanish over many steps) and blocked parallel training — each step depends on the last.</p>
      <p><strong>Self-attention</strong> lets every token compute a weighted combination of all other tokens' representations, where the weights reflect learned relevance. Each token projects itself into a Query, Key, and Value. A token's Query is compared against every other token's Key (scaled dot product) to produce attention scores, turned into weights via softmax, and used to combine Values. <strong>Multi-head attention</strong> runs several of these in parallel with different learned projections, so the model can track several kinds of relationships at once — one head might track syntax, another coreference.</p>
      <p>Because attention has no built-in sense of order — it treats tokens as a set — <strong>positional encoding</strong> is added to the embeddings so the model knows sequence order (the original paper used fixed sinusoidal patterns; modern models often use rotary embeddings, RoPE).</p>
      <p>A Transformer block combines self-attention with a position-wise feed-forward network, each wrapped in residual connections and layer normalization for stable training at depth. Stacking dozens to over a hundred of these blocks builds increasingly abstract representations. Decoder-only architectures (the GPT-style backbone behind most modern LLMs) add <strong>causal masking</strong>, so a token can only attend to previous tokens — this is what makes left-to-right, token-by-token generation coherent.</p>
      <p>Because attention across all token pairs can be computed simultaneously rather than sequentially, Transformers train dramatically faster on parallel hardware — a major reason they scaled where RNNs hit a wall.</p>`,
      analogy:
        "<p>In a group discussion, an RNN is like passing a note person-to-person around a circle — detail degrades by the time it reaches the last person. Self-attention is like everyone in the room being able to directly question anyone else at once, weighing each answer by relevance.</p>",
      example:
        '<p>In "The trophy didn\'t fit in the suitcase because it was too big," resolving what "it" refers to (the trophy) requires connecting a pronoun to a noun several words earlier — exactly the long-range dependency self-attention resolves directly, where an RNN would have to carry that link through every step in between.</p>',
      takeaways: [
        "Self-attention lets every token directly weigh every other token's relevance, avoiding an RNN's sequential bottleneck.",
        "Query / Key / Value projections plus scaled dot-product and softmax form the core attention computation.",
        "Multi-head attention captures multiple relationship types in parallel.",
        "Positional encoding restores order information that attention doesn't have natively.",
        "Decoder-only Transformers use causal masking so generation depends only on past tokens.",
        "Parallelizable training on GPUs is a major reason Transformers scaled past RNNs.",
      ],
      quiz: [
        {
          q: "What core limitation of RNNs does self-attention solve?",
          options: [
            "It removes the need for a loss function",
            "It lets tokens relate directly to distant tokens without passing information step-by-step, and trains in parallel",
            "It eliminates the need for embeddings",
            "It removes the need for positional information entirely",
          ],
          answer: 1,
          explain: "Direct token-to-token connections plus parallel computation are attention's two big wins over recurrence.",
        },
        {
          q: "What are Query, Key, and Value in self-attention?",
          options: [
            "Three separate neural networks trained independently",
            "Learned projections of token representations used to compute relevance-weighted combinations of other tokens",
            "Hyperparameters set before training",
            "Types of positional encoding",
          ],
          answer: 1,
          explain: "Q/K/V projections are how each token asks, is asked, and answers relevance questions of other tokens.",
        },
        {
          q: "Why is positional encoding necessary in a Transformer?",
          options: [
            "It speeds up matrix multiplication",
            "Self-attention has no inherent sense of token order, so position must be added explicitly",
            "It replaces the need for attention",
            "It is only needed for very short sequences",
          ],
          answer: 1,
          explain: "Attention treats input as a set of tokens; order has to be injected separately.",
        },
        {
          q: "What does causal masking do in a decoder-only Transformer?",
          options: [
            "Hides the input prompt from the model",
            "Prevents a token from attending to future tokens, enabling coherent left-to-right generation",
            "Removes the feed-forward layer",
            "Masks out rare tokens from the vocabulary",
          ],
          answer: 1,
          explain: "Causal masking enforces that generation at each step only depends on what came before it.",
        },
        {
          q: "In Attention(Q,K,V) = softmax(QKᵀ/√d_k)V, what is the role of dividing by √d_k?",
          options: [
            "It selects which tokens are masked",
            "It keeps the dot-product scores from growing too large before the softmax, stabilizing training",
            "It converts the Keys into Values",
            "It adds positional information",
          ],
          answer: 1,
          explain: "Without this scaling factor, large dot products push softmax into regions with vanishing gradients.",
        },
      ],
    },
    {
      id: "p1-c4",
      n: 4,
      title: "Pretraining",
      short: "Learning language at internet scale",
      requires: ["p1-c3"],
      xp: 110,
      node: { x: 300, y: 630 },
      diagram: {
        type: "pipeline",
        stages: ["Web-scale text", "Filter + dedupe", "Tokenize", "Predict next token", "Update weights"],
        loop: true,
      },
      diagram2: {
        type: "trainloop",
        context: ["The", "cat", "sat", "on", "the"],
        target: "mat",
        steps: [
          { guess: "the", conf: 19, loss: 4.2 },
          { guess: "floor", conf: 33, loss: 2.9 },
          { guess: "rug", conf: 47, loss: 1.8 },
          { guess: "mat", conf: 74, loss: 0.5 },
        ],
      },
      math: [
        {
          expr: "L(θ) = − <span>1⁄N</span> Σ<sub>t=1</sub><sup>N</sup> log P<sub>θ</sub>(w<sub>t</sub> | w<sub>&lt;t</sub>)",
          note: "The <strong>cross-entropy loss</strong> pretraining minimizes: for every position t, penalize the model by the negative log-probability it assigned to the actual next token. Lower loss means the model consistently assigns higher probability to what really came next.",
        },
        {
          expr: "PPL = e<sup>L</sup>",
          note: "<strong>Perplexity</strong>, the loss exponentiated — interpretable as \"the model was, on average, as confused as if choosing uniformly among this many tokens.\" A perplexity of 20 is meaningfully better than 80; it's the most common single number reported for a base model's raw language-modeling quality.",
        },
        {
          expr: "C ≈ 6 · N · D",
          note: "The standard training-compute estimate in FLOPs, where <code>N</code> is parameter count and <code>D</code> is tokens processed. This is the relationship Chinchilla scaling laws are built on: for a fixed compute budget <code>C</code>, there's an optimal split between growing <code>N</code> and growing <code>D</code>.",
        },
      ],
      hook: "<p>Before a model can follow instructions or chat helpfully, it spends the overwhelming majority of its \"education\" doing one repetitive task, over and over, across a huge slice of the internet: predicting the next token.</p>",
      explain: `<p>The pretraining objective is <strong>self-supervised next-token prediction</strong> (causal language modeling): given a sequence, predict each next token, compute cross-entropy loss against the actual next token, and backpropagate to update every weight in the model. It's self-supervised because the labels come free from the raw text itself — no manual annotation required — which is exactly what allows training at massive scale.</p>
      <p>Data quality and mixture matter enormously: web crawls, books, code, papers, and dialogue are filtered, deduplicated, and checked for quality, toxicity, PII, and — critically — decontaminated against evaluation benchmarks so the model isn't accidentally tested on data it memorized.</p>
      <p><strong>Scaling laws</strong> (Kaplan et al. 2020; Chinchilla / Hoffmann et al. 2022) show model performance improves predictably as a power law with more parameters, data, and compute — but there's an optimal ratio between model size and data size for a given compute budget. Chinchilla's key finding: many earlier large models were <em>undertrained</em> relative to their size — data should scale roughly in proportion to parameters, not just model size alone.</p>
      <p>Training cost roughly follows FLOPs ≈ 6 × N<sub>params</sub> × N<sub>tokens</sub> — thousands of GPUs or TPUs running for weeks to months. What pretraining actually produces is a <strong>base model</strong>: broad world knowledge and strong linguistic competence, good at plausibly continuing text — but not yet tuned to follow instructions politely, stay on task, or refuse harmful requests. That's the job of the next two chapters.</p>`,
      analogy:
        "<p>Pretraining is like an aspiring writer reading a huge fraction of the world's books, articles, and conversations — absorbing patterns of language, facts, and reasoning — without yet being told how to behave as a helpful assistant in a live conversation.</p>",
      example:
        '<p>A raw base model given "How do I bake bread?" might continue it as if it were the start of a forum post — "...I\'ve tried gluten-free but it never rises..." — rather than actually answering, because it learned to continue plausible text, not to act as an assistant. Closing that gap is exactly what fine-tuning does.</p>',
      takeaways: [
        "Pretraining is self-supervised next-token prediction over massive text corpora — no manual labels required.",
        "Data quality, mixture, and deduplication matter as much as raw data quantity.",
        "Scaling laws show predictable gains from more parameters/data/compute, with an optimal balance (Chinchilla).",
        "Training cost roughly scales with parameters × tokens processed.",
        "The result is a base model — broadly capable but not yet instruction-following or aligned.",
      ],
      quiz: [
        {
          q: "Why is pretraining called \"self-supervised\"?",
          options: [
            "Because it requires no data at all",
            "Because next-token prediction labels come directly from the raw text itself, not manual annotation",
            "Because the model supervises its own hardware allocation",
            "Because it only works with labeled datasets",
          ],
          answer: 1,
          explain: "The text itself supplies the \"correct answer\" for next-token prediction, at massive scale, for free.",
        },
        {
          q: "What did Chinchilla scaling laws reveal about earlier large models?",
          options: [
            "They were too small to be useful",
            "Many were undertrained relative to their parameter count and needed more training data",
            "They used too much training data relative to size",
            "Model size doesn't matter at all",
          ],
          answer: 1,
          explain: "Chinchilla showed data scale should track parameter scale, correcting a common earlier imbalance.",
        },
        {
          q: "What does a raw base model typically lack right after pretraining?",
          options: [
            "Any knowledge of grammar",
            "Reliable instruction-following behavior and alignment to be a helpful, safe assistant",
            "The ability to predict the next token",
            "Any usable vocabulary",
          ],
          answer: 1,
          explain: "Base models are broadly knowledgeable but not yet shaped into a well-behaved assistant.",
        },
        {
          q: "What's the rough relationship between compute cost and pretraining scale?",
          options: [
            "Cost is fixed regardless of model size",
            "Cost scales with the product of parameter count and number of tokens processed",
            "Cost depends only on the number of GPUs, not data",
            "Cost decreases as models get larger",
          ],
          answer: 1,
          explain: "FLOPs ≈ 6 × params × tokens is the standard rule-of-thumb relationship.",
        },
        {
          q: "Perplexity is defined as PPL = e^L, where L is the cross-entropy loss. What does a lower perplexity mean?",
          options: [
            "The model is larger",
            "The model assigns higher probability, on average, to the actual next tokens — less \"confused\"",
            "The model was trained for less time",
            "The vocabulary is smaller",
          ],
          answer: 1,
          explain: "Perplexity is loss re-expressed on an interpretable scale — lower always means better next-token predictions on average.",
        },
      ],
    },
    {
      id: "p1-c7",
      n: 7,
      title: "Inference & Decoding",
      short: "Choosing what to actually say",
      requires: ["p1-c3"],
      xp: 100,
      node: { x: 700, y: 630 },
      diagram: {
        type: "bars",
        label: "Next-token probability distribution",
        bars: [
          { label: "mat", value: 42 },
          { label: "rug", value: 18 },
          { label: "floor", value: 14 },
          { label: "couch", value: 9 },
          { label: "table", value: 6 },
          { label: "…", value: 11 },
        ],
      },
      math: [
        {
          expr: "P(w<sub>i</sub>) = e<sup>z<sub>i</sub>/T</sup> ⁄ Σ<sub>j</sub> e<sup>z<sub>j</sub>/T</sup>",
          note: "<strong>Temperature-scaled softmax.</strong> As <code>T → 0</code>, the distribution sharpens toward a single top token (approaching greedy decoding); as <code>T</code> increases past 1, it flattens toward uniform randomness. Temperature is applied to the raw scores <em>before</em> the softmax in Chapter 3's formula.",
        },
        {
          expr: "V<sup>(p)</sup> = smallest set such that &nbsp; Σ<sub>w ∈ V<sup>(p)</sup></sub> P(w) ≥ p",
          note: "The formal definition of <strong>top-p (nucleus) sampling</strong>: keep adding tokens in order of probability until their cumulative mass reaches <code>p</code>, then sample only from that set. When the model is confident, this set is small; when it's uncertain, the set grows automatically.",
        },
      ],
      hook: "<p>Training decides what the model knows. Decoding decides, one token at a time, what it actually says.</p>",
      explain: `<p>At every generation step the model outputs a probability distribution over the entire vocabulary for the next token. A <strong>decoding strategy</strong> is the rule for picking which token to actually emit.</p>
      <p><strong>Greedy decoding</strong> always picks the single highest-probability token — deterministic, but often repetitive and short-sighted, since it can miss better whole-sequence completions. <strong>Beam search</strong> tracks several candidate sequences in parallel, common in translation, but expensive and prone to generic output for open-ended chat.</p>
      <p>Sampling methods add controlled randomness for more natural text. <strong>Temperature</strong> scales the distribution before sampling — low temperature sharpens it toward top choices, high temperature flattens it toward more randomness. <strong>Top-k</strong> restricts sampling to the k most probable tokens. <strong>Top-p (nucleus)</strong> sampling instead keeps the smallest set of tokens whose cumulative probability exceeds p — adapting pool size to how confident the distribution actually is at each step, which handles varying distribution shapes better than a fixed top-k.</p>
      <p>Two systems details make this practical at scale. <strong>KV caching</strong>: since each new token's attention depends on all previous tokens, models cache previously computed Key/Value projections so each step only computes attention for the new token against cached history, instead of recomputing the whole sequence every time. <strong>Quantization</strong>: reducing weight precision (e.g. 16-bit to 8-bit or 4-bit) shrinks memory footprint and speeds inference, trading a small amount of accuracy for large efficiency gains — often essential for running large models on limited hardware. In production serving, batching multiple users' requests improves GPU throughput but can raise per-user latency, while streaming tokens back as they're generated improves perceived responsiveness.</p>`,
      analogy:
        "<p>The probability distribution at each step is like a weather forecast — \"70% sun, 20% clouds, 10% rain.\" Greedy decoding always \"predicts\" the top outcome, every time, producing a flat, monotone forecast. Sampling with temperature and top-p instead rolls realistic weather matching the true spread of possibilities.</p>",
      example:
        '<p>Asked to write a short poem, greedy decoding can get stuck in repetitive phrasing — the highest-probability next token is often a repeat of context. Top-p sampling with moderate temperature produces varied, natural-sounding lines, because it samples proportionally from a reasonably-sized set of plausible next words instead of always taking the single top pick.</p>',
      takeaways: [
        "Decoding strategy determines how a token is selected from the model's predicted distribution — a separate lever from training.",
        "Greedy and beam search are deterministic and can be repetitive or generic; sampling introduces controlled randomness for natural output.",
        "Top-p (nucleus) sampling adapts its candidate pool to the distribution's actual confidence at each step.",
        "KV caching avoids recomputing attention over the whole sequence at every step — critical for inference speed.",
        "Quantization trades numerical precision for memory and speed efficiency in serving.",
      ],
      quiz: [
        {
          q: "What is the main downside of pure greedy decoding?",
          options: [
            "It's too slow to run in production",
            "It tends to produce repetitive, bland text and can miss better overall sequences",
            "It cannot be used with Transformers",
            "It requires a reward model",
          ],
          answer: 1,
          explain: "Always taking the top token locally often leads to repetitive, short-sighted output globally.",
        },
        {
          q: "How does top-p (nucleus) sampling differ from top-k sampling?",
          options: [
            "Top-p is just a renamed version of top-k",
            "Top-p adapts the candidate token pool size based on cumulative probability, rather than a fixed count",
            "Top-p never allows randomness",
            "Top-p only works for code generation",
          ],
          answer: 1,
          explain: "Top-p's pool size shrinks or grows with how confident the distribution is, unlike a fixed top-k cutoff.",
        },
        {
          q: "What problem does KV caching solve during autoregressive generation?",
          options: [
            "It reduces the model's vocabulary size",
            "It avoids recomputing attention over the entire sequence history at every new token",
            "It removes the need for positional encoding",
            "It prevents the model from repeating itself",
          ],
          answer: 1,
          explain: "Caching past Key/Value projections avoids redundant, expensive recomputation at every generation step.",
        },
        {
          q: "What does quantization trade off in model serving?",
          options: [
            "Training data quality for model size",
            "Reduces numerical precision of weights to save memory/speed at a small cost to accuracy",
            "Vocabulary size for context length",
            "Safety for helpfulness",
          ],
          answer: 1,
          explain: "Lower-precision weights use less memory and compute, at a small, often acceptable, accuracy cost.",
        },
        {
          q: "In P(wᵢ) = e^(zᵢ/T) / Σⱼ e^(zⱼ/T), what happens as temperature T approaches 0?",
          options: [
            "The distribution becomes uniform — every token equally likely",
            "The distribution sharpens toward the single highest-scoring token, approaching greedy decoding",
            "The model stops generating text",
            "T has no effect on the distribution",
          ],
          answer: 1,
          explain: "Dividing by a very small T massively exaggerates score differences, collapsing the distribution onto the top token.",
        },
      ],
    },
    {
      id: "p1-c5",
      n: 5,
      title: "Fine-Tuning",
      short: "Teaching a base model its role",
      requires: ["p1-c4"],
      xp: 100,
      node: { x: 300, y: 810 },
      diagram: {
        type: "pipeline",
        stages: ["Base model", "Curated (prompt, response) pairs", "Supervised fine-tuning", "Instruction-following model"],
      },
      diagram2: {
        type: "persona",
        prompt: "Explain what an API is.",
        personas: [
          {
            label: "SFT on terse API docs",
            text: "API: a defined interface for programmatic access. Endpoints accept requests and return structured JSON responses.",
          },
          {
            label: "SFT on friendly tutoring",
            text: "Think of an API like a restaurant menu — you ask the kitchen (the server) for something specific, and it brings back exactly that, prepared for you!",
          },
        ],
      },
      math: [
        {
          expr: "L<sub>SFT</sub> = − Σ<sub>t ∈ completion</sub> log P<sub>θ</sub>(w<sub>t</sub> | w<sub>&lt;t</sub>)",
          note: "SFT uses the exact same cross-entropy loss as pretraining (Chapter 4) — the only change is which tokens count. The loss is masked to the <em>response</em> tokens only, so the model isn't penalized for how the fixed prompt was written, just for how well it continues it.",
        },
        {
          expr: "W′ = W<sub>0</sub> + ΔW = W<sub>0</sub> + BA, &nbsp; B ∈ ℝ<sup>d×r</sup>, A ∈ ℝ<sup>r×k</sup>, r ≪ min(d, k)",
          note: "<strong>LoRA's core trick.</strong> Instead of updating the full weight matrix <code>W₀</code>, freeze it and learn a low-rank update <code>BA</code> — two small matrices whose product approximates the needed change. With rank <code>r</code> in the single digits or tens, this can cut trainable parameters by 99%+ while leaving the frozen base weights untouched. At inference, <code>BA</code> can be merged straight into <code>W₀</code> — zero added latency.",
        },
        {
          expr: "M<sub>inference</sub> ≈ 1.2 × P × b<sub>bytes</sub>",
          note: "<strong>Memory to run a model.</strong> <code>P</code> = parameter count, <code>b<sub>bytes</sub></code> = bytes per parameter at the precision you load it in (FP32 = 4, FP16/BF16 = 2, INT8 = 1, INT4 = 0.5). The ×1.2 is a rule-of-thumb overhead for activations, the KV cache, and framework bookkeeping at moderate context length — long contexts push this higher, since the KV cache itself scales with sequence length × batch size.",
        },
        {
          expr: "M<sub>full-FT</sub> ≈ P × (2 + 2 + 8 + 4) = 16P bytes",
          note: "<strong>Memory to fully fine-tune, per parameter, with Adam in mixed precision.</strong> 2 bytes for FP16 weights + 2 bytes for FP16 gradients + 8 bytes for Adam's optimizer state (fp32 first + second moment) + 4 bytes for an fp32 master weight copy = 16 bytes/parameter — the standard rule of thumb, before adding activation memory (which scales separately with batch size × sequence length).",
        },
        {
          expr: "M<sub>LoRA</sub> ≈ P × 2 &nbsp;+&nbsp; P<sub>LoRA</sub> × 12, &nbsp; P<sub>LoRA</sub> ≪ P",
          note: "<strong>LoRA fine-tuning memory.</strong> The frozen base stays at 2 bytes/parameter (FP16) with no optimizer state needed — it never updates. Only the tiny adapter parameters <code>P<sub>LoRA</sub></code> (often under 1% of <code>P</code>) need gradients + Adam state (≈12 bytes each). Since <code>P<sub>LoRA</sub></code> is so small, this is dominated by the same term as plain inference — LoRA fine-tuning costs roughly what just running the model costs.",
        },
        {
          expr: "M<sub>QLoRA</sub> ≈ P × 0.5 &nbsp;+&nbsp; P<sub>LoRA</sub> × 12",
          note: "<strong>QLoRA fine-tuning memory.</strong> Identical to LoRA, except the frozen base is stored 4-bit (NF4, ≈0.5 bytes/parameter) instead of FP16 — quartering the dominant term. This is the formula behind QLoRA fine-tuning a 65B model on one 48GB GPU (Dettmers et al., 2023), a size class that previously needed multiple 80GB GPUs.",
        },
      ],
      hook: "<p>A base model knows a lot but doesn't know how to be an assistant. Fine-tuning teaches it a role.</p>",
      explain: `<p><strong>Supervised Fine-Tuning (SFT)</strong> continues training the pretrained base model on a smaller, curated dataset of high-quality (prompt, ideal response) pairs — typically written or reviewed by humans, or generated and filtered — demonstrating the desired behavior: following instructions, formatting answers helpfully, adopting an assistant persona, refusing inappropriate requests appropriately.</p>
      <p>Because the base model already carries broad linguistic and world knowledge from pretraining, SFT needs orders of magnitude less data — thousands to low millions of examples, versus trillions of pretraining tokens. That efficiency is the power of transfer learning.</p>
      <p><strong>Instruction tuning</strong> specifically means SFT across many different task types phrased as instructions — "summarize this," "translate this," "write code for X" — which generalizes to following instructions on tasks never explicitly seen during training. This is a major reason instruction-tuned models feel broadly capable across so many use cases.</p>
      <p><strong>Parameter-efficient fine-tuning (PEFT)</strong> methods like LoRA (Low-Rank Adaptation) fine-tune by training small added weight matrices rather than updating all original parameters, drastically cutting compute and memory cost — important for teams that can't afford full fine-tuning runs. Done carelessly, fine-tuning can overfit or cause <strong>catastrophic forgetting</strong> — degrading capabilities the base model already had — so data quality, diversity, and training hyperparameters matter a great deal.</p>
      <p><strong>QLoRA</strong> (Dettmers et al., 2023) pushes this further: it quantizes the frozen base model down to 4-bit precision using <strong>NF4</strong> (NormalFloat4 — a data type tuned to how neural network weights are actually distributed), while the small LoRA adapters are still trained in 16-bit for numerical stability. Two extra tricks make this work well in practice: <strong>double quantization</strong> (quantizing the quantization constants themselves, saving a little more memory) and <strong>paged optimizers</strong> (spilling optimizer state to CPU memory during rare gradient spikes instead of crashing with an out-of-memory error). The practical difference from plain LoRA is simple: <strong>LoRA keeps the frozen base in 16-bit; QLoRA keeps it in 4-bit.</strong> Same trainable adapters, same merge-back trick at inference — QLoRA just shrinks the one thing that actually dominates memory use: holding the frozen weights.</p>
      <p>How much memory each approach needs comes down to how many bytes are held per parameter, and how many of a model's parameters actually need gradients and optimizer state versus just storage. The formulas below make that concrete.</p>`,
      diagram3: {
        type: "bars",
        label: "Approx. memory to work with a 7B-parameter model (illustrative, FP16/BF16 baseline)",
        unit: " GB",
        noSample: true,
        bars: [
          { label: "Inference", value: 17 },
          { label: "Full fine-tune", value: 112 },
          { label: "LoRA", value: 15 },
          { label: "QLoRA", value: 6 },
        ],
      },
      analogy:
        "<p>If pretraining is a broad liberal-arts education, SFT is a focused apprenticeship — a mentor shows worked examples of exactly how to respond in a specific role. The underlying knowledge is already there; this stage teaches format and demeanor.</p><p>Full fine-tuning is repainting an entire mural. LoRA is sticking a few translucent overlays on top of it — cheap to make, easy to swap, peelable back to the original underneath. QLoRA does that same overlay trick on a compressed photograph of the mural instead of the full-size original — you can still paint on it precisely, you just needed far less shelf space to store what you're painting on.</p>",
      example:
        "<p>Starting from the same base model, one SFT dataset teaches it to answer like a terse technical API; another teaches it to answer like a friendly tutor. Same underlying knowledge, very different behavior after fine-tuning — purely from what example responses it was shown.</p><p>A team wants to fine-tune a 70B model on a single 80GB GPU. Full fine-tuning needs roughly 70B × 16 bytes ≈ 1.1 TB — completely out of reach. Plain LoRA gets the frozen weights down to about 140GB — better, but still too big for one card. QLoRA quantizes that frozen base to 4-bit — about 35GB — leaving enough headroom on the same single 80GB GPU to train adapters comfortably. That's the exact memory math that made fine-tuning frontier-scale open models accessible to teams without a GPU cluster.</p>",
      takeaways: [
        "SFT continues training the pretrained model on curated (prompt, response) pairs to teach behavior, not new knowledge.",
        "Instruction tuning across many task types is why models generalize to unseen instructions.",
        "SFT needs far less data than pretraining because it builds on transfer learning from the base model.",
        "PEFT methods (e.g. LoRA) fine-tune efficiently by training small added parameters instead of the whole model.",
        "QLoRA quantizes the frozen base to 4-bit (NF4) while training adapters in 16-bit — cutting memory further with minimal quality loss.",
        "Rule of thumb: inference ≈ 1.2×P×bytes/param; full fine-tuning ≈ 16×P bytes; LoRA ≈ 2×P bytes; QLoRA ≈ 0.5×P bytes — QLoRA's edge comes entirely from shrinking the frozen base.",
        "Poor fine-tuning data or hyperparameters risk catastrophic forgetting of base capabilities.",
      ],
      quiz: [
        {
          q: "What is the main purpose of SFT?",
          options: [
            "To teach the model entirely new world knowledge",
            "To teach the pretrained model desired behavior and format via curated example responses",
            "To increase the model's vocabulary size",
            "To replace the need for tokenization",
          ],
          answer: 1,
          explain: "SFT shapes behavior and format on top of knowledge the base model already has.",
        },
        {
          q: "Why does SFT typically need far less data than pretraining?",
          options: [
            "Because SFT data is lower quality",
            "It builds on transfer learning from a model that already has broad knowledge from pretraining",
            "Because SFT doesn't use gradient descent",
            "Because SFT only updates the embedding layer",
          ],
          answer: 1,
          explain: "The base model's existing competence means SFT only needs to demonstrate behavior, not teach from scratch.",
        },
        {
          q: "What does LoRA (a PEFT method) do differently from full fine-tuning?",
          options: [
            "It retrains the entire model from random weights",
            "It trains small added low-rank weight matrices instead of updating all original model parameters",
            "It removes the attention mechanism",
            "It only works on tokenization",
          ],
          answer: 1,
          explain: "LoRA adds small trainable matrices, leaving the original weights frozen — far cheaper than full fine-tuning.",
        },
        {
          q: "What risk does careless fine-tuning introduce?",
          options: [
            "Catastrophic forgetting — degrading capabilities the base model already had",
            "Slower tokenization",
            "Loss of the ability to run on GPUs",
            "Increased context window size",
          ],
          answer: 0,
          explain: "Poorly curated fine-tuning data or aggressive hyperparameters can erode prior capabilities.",
        },
        {
          q: "In LoRA's W′ = W₀ + BA, why does making B and A low-rank (small r) matter?",
          options: [
            "It makes the model's vocabulary smaller",
            "It means far fewer trainable parameters than updating the full W₀, while W₀ itself stays frozen",
            "It removes the need for a loss function",
            "It increases the model's context window",
          ],
          answer: 1,
          explain: "A low rank r means B and A together have vastly fewer entries than the full matrix W₀, which is exactly why LoRA is so much cheaper than full fine-tuning.",
        },
        {
          q: "What does QLoRA change relative to standard LoRA?",
          options: [
            "It removes the need for a base model entirely",
            "It quantizes the frozen base model to 4-bit (NF4) while still training the LoRA adapters in 16-bit",
            "It trains the entire model in 4-bit, including the adapters",
            "It disables the low-rank decomposition and updates all weights",
          ],
          answer: 1,
          explain: "QLoRA's memory savings come specifically from quantizing the large frozen base to 4-bit; the small trainable adapters stay in higher precision for stable training.",
        },
        {
          q: "Roughly how much memory does full fine-tuning need per parameter with Adam in mixed precision, and why is that so much more than LoRA?",
          options: [
            "2 bytes — the same as LoRA, since both compute gradients",
            "~16 bytes — FP16 weights + FP16 gradients + FP32 Adam state + an FP32 master copy must be stored for every parameter, while LoRA only pays that cost for a tiny adapter",
            "0.5 bytes — full fine-tuning is actually more memory-efficient than LoRA",
            "Full fine-tuning needs no memory beyond what inference already uses",
          ],
          answer: 1,
          explain: "Full fine-tuning stores weights, gradients, and optimizer state for every parameter (~16 bytes total); LoRA only pays that cost for its small adapter matrices, leaving the frozen base at just 2 bytes/parameter.",
        },
      ],
    },
    {
      id: "p1-c6",
      n: 6,
      title: "Alignment — RLHF, DPO & Constitutional AI",
      short: "Teaching preference, not just imitation",
      requires: ["p1-c5"],
      xp: 120,
      node: { x: 300, y: 990 },
      diagram: {
        type: "pipeline",
        stages: ["SFT model", "Generate + rank responses", "Reward model / AI critique", "Preference optimization", "Aligned model"],
      },
      diagram2: {
        type: "reward",
        prompt: "How do I get my neighbor's wifi password?",
        a: { text: "Try common default router passwords like \"admin123\" or the router's factory reset code.", score: 18 },
        b: { text: "That's not something I can help with — the simplest fix is just to ask your neighbor directly.", score: 92 },
        steps: [12, 29, 47, 68, 84, 93],
      },
      math: [
        {
          expr: "P(y<sub>w</sub> ≻ y<sub>l</sub>) = σ( r(x, y<sub>w</sub>) − r(x, y<sub>l</sub>) )",
          note: "The <strong>Bradley-Terry preference model</strong> the reward model is trained against: given a \"winning\" response y_w and \"losing\" response y_l, the probability the reward function <code>r</code> should assign to preferring the winner is a sigmoid (<code>σ</code>) of the score gap. Training the reward model means fitting <code>r</code> so this matches real human choices.",
        },
        {
          expr: "max<sub>π</sub> &nbsp; E<sub>y∼π</sub>[ r(x, y) ] &nbsp; − &nbsp; β · D<sub>KL</sub>( π(y|x) ‖ π<sub>ref</sub>(y|x) )",
          note: "The <strong>RLHF objective</strong>: maximize expected reward from the policy π, minus a KL-divergence penalty (weighted by β) that keeps π from straying too far from the original SFT model π_ref. This penalty is what stops the model from \"reward hacking\" its way into degenerate, high-scoring gibberish.",
        },
        {
          expr: "L<sub>DPO</sub> = − log σ( β log <span>π<sub>θ</sub>(y<sub>w</sub>|x)⁄π<sub>ref</sub>(y<sub>w</sub>|x)</span> − β log <span>π<sub>θ</sub>(y<sub>l</sub>|x)⁄π<sub>ref</sub>(y<sub>l</sub>|x)</span> )",
          note: "<strong>DPO's loss</strong> — the algebraic result of substituting the optimal RLHF solution directly into the Bradley-Terry preference loss above, eliminating the need to ever train a separate reward model or run RL. It's optimized with ordinary gradient descent, directly on (prompt, preferred, rejected) triples.",
        },
      ],
      hook: "<p>SFT teaches a model to imitate good examples. Alignment teaches it to prefer good outputs over bad ones — including ones it invents itself.</p>",
      explain: `<p>Imitation learning alone has a gap: it only shows positive examples, so it doesn't teach the model to distinguish subtly better from subtly worse responses, or to avoid patterns it was never directly shown as bad.</p>
      <p><strong>RLHF</strong> (Reinforcement Learning from Human Feedback) closes this gap in three stages: (1) collect human preference data by showing labelers multiple model responses to the same prompt and having them rank or choose the better one; (2) train a separate <strong>reward model</strong> to predict human preference scores from these rankings; (3) fine-tune the language model with reinforcement learning — commonly PPO (Proximal Policy Optimization) — to maximize the reward model's score, while a KL-divergence penalty keeps it from drifting too far from the original SFT model, avoiding degenerate reward-hacking behavior.</p>
      <p><strong>RLAIF / Constitutional AI</strong> (Anthropic) uses another AI model, guided by a written set of principles (a "constitution"), to generate critiques and preference judgments instead of relying solely on costly human labels — scaling feedback collection while encoding explicit written principles rather than only implicit labeler intuition.</p>
      <p><strong>DPO</strong> (Direct Preference Optimization) is a newer, simpler alternative that skips the separate reward model and the RL loop entirely, reformulating preference data into a direct loss function optimizable with standard supervised training — achieving similar alignment effects with less infrastructure and instability than PPO-based RLHF.</p>
      <p>In practice, alignment tunes for helpfulness, harmlessness, and honesty (calibrated confidence, avoiding fabrication), and it is inherently a balancing act: too much safety tuning makes a model evasive and unhelpful ("over-refusal"); too little risks harmful or untrustworthy output. This stage is iterative and closely evaluated.</p>`,
      analogy:
        "<p>If SFT is showing a student worked example answers, alignment is grading many attempted answers — some good, some subtly worse — so the student learns to independently judge quality, not just copy a template.</p>",
      example:
        '<p>Given two candidate responses to "how do I get my neighbor\'s wifi password?" — one implies unauthorized access, the other declines and suggests just asking the neighbor — RLHF training pushes the model toward the second pattern by rewarding it more in the preference signal, without anyone writing an explicit rule for that exact question.</p>',
      takeaways: [
        "Alignment (RLHF / DPO / Constitutional AI) teaches a model to prefer better outputs, going beyond imitating fixed examples.",
        "Classic RLHF: human preference data → reward model → PPO optimization with a KL penalty against drifting too far.",
        "Constitutional AI / RLAIF uses AI-generated critiques guided by written principles to scale feedback beyond human labeling.",
        "DPO optimizes preferences directly with a supervised-style loss, skipping the separate reward model and RL loop.",
        "Alignment balances helpfulness against harmlessness and honesty — over-tuning either way creates real problems.",
      ],
      quiz: [
        {
          q: "In classic RLHF, what is the reward model trained to do?",
          options: [
            "Generate the final responses directly",
            "Predict a score matching human preference rankings, used as the RL training signal",
            "Replace the tokenizer",
            "Filter pretraining data",
          ],
          answer: 1,
          explain: "The reward model turns human preference judgments into a signal the policy model can be optimized against.",
        },
        {
          q: "What is the key practical difference between DPO and PPO-based RLHF?",
          options: [
            "DPO doesn't use any preference data",
            "DPO optimizes preference data directly with a supervised-style loss, without a separate reward model or RL loop",
            "DPO requires more infrastructure than PPO",
            "DPO can only be used for code models",
          ],
          answer: 1,
          explain: "DPO reformulates the same preference signal into a loss trainable with standard supervised methods.",
        },
        {
          q: "What does the KL-divergence penalty do during RLHF optimization?",
          options: [
            "Increases the model's vocabulary",
            "Keeps the fine-tuned model from drifting too far from the SFT model, preventing reward-hacking degeneracy",
            "Speeds up reward model training",
            "Removes the need for human labelers",
          ],
          answer: 1,
          explain: "Without this constraint, the policy could over-optimize the reward model in unintended, degenerate ways.",
        },
        {
          q: "What risk does over-aggressive safety alignment create?",
          options: [
            "The model becomes too fast",
            "Over-refusal — the model becomes evasive and unhelpful even on benign requests",
            "The model loses its tokenizer",
            "Training cost drops to zero",
          ],
          answer: 1,
          explain: "Alignment is a balance — pushing too hard toward caution degrades helpfulness on ordinary requests.",
        },
        {
          q: "DPO's loss compares log[π_θ(y|x)/π_ref(y|x)] for the winning and losing response. What does this ratio measure?",
          options: [
            "How long each response is",
            "How much more (or less) likely the current policy makes a response, relative to the original SFT model",
            "The reward model's raw score",
            "The number of training steps completed",
          ],
          answer: 1,
          explain: "This ratio is the policy shifting probability mass toward preferred responses relative to its SFT starting point — the whole training signal DPO optimizes.",
        },
      ],
    },
    {
      id: "p1-c8",
      n: 8,
      title: "Evaluation & Benchmarks",
      short: "How do you know if a model is actually good?",
      requires: ["p1-c6", "p1-c7"],
      xp: 130,
      node: { x: 500, y: 1170 },
      diagram: {
        type: "pipeline",
        stages: ["Automatic benchmarks", "Human evaluation", "LLM-as-judge", "Red-teaming", "Task / production evals"],
      },
      diagram2: {
        type: "radar",
        label: "Same model, five different lenses",
        axes: [
          { label: "MMLU", value: 82 },
          { label: "HumanEval", value: 64 },
          { label: "Human pref.", value: 76 },
          { label: "Safety", value: 91 },
          { label: "Cost eff.", value: 52 },
        ],
      },
      math: [
        {
          expr: "Acc = <span>#correct</span> ⁄ <span>#total</span>",
          note: "The bulk of automatic benchmarks (MMLU, HellaSwag, GSM8K) reduce to this simple ratio — which is exactly why a single accuracy number can hide so much: it treats a near-miss and a wildly wrong answer identically.",
        },
        {
          expr: "E<sub>A</sub> = <span>1</span> ⁄ <span>1 + 10<sup>(R<sub>B</sub> − R<sub>A</sub>)/400</sup></span>, &nbsp; R′<sub>A</sub> = R<sub>A</sub> + K(S<sub>A</sub> − E<sub>A</sub>)",
          note: "The <strong>Elo rating update</strong> behind LMSYS Chatbot Arena's human-preference leaderboard — the same system chess ratings use. <code>E_A</code> is model A's expected win probability against B given their current ratings; after each head-to-head vote (<code>S_A</code> = 1 for a win, 0 for a loss), the rating shifts by how much the actual outcome surprised the prediction.",
        },
      ],
      hook: "<p>How do you know if a model is actually good? It's a surprisingly unsolved question — and it's where everything from the last seven chapters converges.</p>",
      explain: `<p><strong>Automatic benchmarks</strong> are standardized test sets measuring specific capabilities: MMLU (broad academic knowledge), HumanEval / MBPP (code correctness), GSM8K / MATH (mathematical reasoning), HellaSwag (commonsense inference), TruthfulQA (resistance to plausible falsehoods). They're useful for tracking progress and comparison, but each measures only a narrow slice of "intelligence," and models can be inadvertently — or deliberately — overfit if benchmark data leaks into training ("contamination").</p>
      <p><strong>Human evaluation</strong> — humans directly comparing or rating outputs, e.g. pairwise preference judgments like LMSYS Chatbot Arena's Elo-style rankings — captures subjective qualities benchmarks miss: helpfulness, tone, following nuanced instructions. It's expensive, slower, and can suffer from inconsistent or biased raters.</p>
      <p><strong>LLM-as-judge</strong> uses a strong LLM to grade or compare other models' responses against a rubric — cheap and fast to scale versus human review, increasingly common in both research and production monitoring. But it introduces its own biases (judge models can favor longer or more confidently-worded answers regardless of actual correctness), so it needs calibration against human judgments.</p>
      <p><strong>Red-teaming</strong> is adversarial testing specifically probing for harmful, biased, or unsafe outputs and jailbreak susceptibility — a different axis from capability, essential before deployment. And once a model is wrapped in an agentic system (the subject of the rest of this book), evaluation expands again: success rate on completing multi-step real tasks, tool-call correctness, groundedness against retrieved evidence, latency and cost per task.</p>
      <p>The core tension: no single number captures "how good" a model is. Real evaluation practice uses a portfolio — benchmarks, human eval, LLM-judge, red-teaming, and task-specific evals — chosen based on what the model will actually be used for.</p>`,
      analogy:
        "<p>Judging a model purely by one benchmark score is like judging a chef purely by how well they chop an onion — a real, measurable, useful skill, but nowhere close to the full picture of whether the food is good.</p>",
      example:
        "<p>A model can score extremely well on MMLU (multiple-choice academic knowledge) while still producing unhelpful, verbose, or subtly wrong answers in real open-ended conversation — exactly why production teams pair capability benchmarks with human or LLM-judge preference evaluation before shipping a model update.</p>",
      takeaways: [
        "Automatic benchmarks (MMLU, HumanEval, GSM8K, TruthfulQA...) measure narrow, well-defined capabilities and are vulnerable to data contamination.",
        "Human evaluation captures subjective quality benchmarks miss, at higher cost.",
        "LLM-as-judge scales evaluation cheaply but has its own biases and needs calibration against human judgment.",
        "Red-teaming evaluates safety and robustness — a distinct axis from raw capability.",
        "Real-world evaluation uses a portfolio approach — this becomes even more true once models are wrapped in agentic systems.",
      ],
      quiz: [
        {
          q: "Why can strong benchmark scores be misleading on their own?",
          options: [
            "Benchmarks are always wrong",
            "Benchmarks measure narrow, well-defined skills and can be affected by data contamination",
            "Benchmarks only test tokenization",
            "Benchmarks are randomly generated",
          ],
          answer: 1,
          explain: "A benchmark score reflects performance on one narrow slice of capability, not overall quality.",
        },
        {
          q: "What is \"LLM-as-judge\" evaluation?",
          options: [
            "A human panel reviewing model legal compliance",
            "Using a strong LLM to grade or compare other models' outputs against a rubric",
            "A benchmark measuring latency only",
            "A method for tokenizing evaluation data",
          ],
          answer: 1,
          explain: "It scales evaluation faster and cheaper than pure human review, with its own biases to watch for.",
        },
        {
          q: "What does red-teaming specifically evaluate?",
          options: [
            "Model training speed",
            "Adversarial robustness and safety — susceptibility to harmful outputs, bias, or jailbreaks",
            "Tokenizer vocabulary size",
            "GPU memory usage",
          ],
          answer: 1,
          explain: "Red-teaming is a safety/robustness axis, distinct from capability benchmarks.",
        },
        {
          q: "Why does this chapter argue for a \"portfolio\" evaluation approach?",
          options: [
            "Because benchmarks are being deprecated",
            "Because no single benchmark or method captures overall model quality — different methods reveal different weaknesses",
            "Because human evaluation is always sufficient alone",
            "Because red-teaming replaces the need for benchmarks",
          ],
          answer: 1,
          explain: "Combining methods covers blind spots any single evaluation approach would miss on its own.",
        },
        {
          q: "In the Elo update R′_A = R_A + K(S_A − E_A) used by Chatbot Arena, what does the term (S_A − E_A) represent?",
          options: [
            "The total number of votes cast",
            "How much the actual outcome (win or loss) surprised the rating-based prediction",
            "The model's benchmark accuracy",
            "The number of parameters in the model",
          ],
          answer: 1,
          explain: "A result that matches the prediction (E_A) barely moves the rating; a surprising upset moves it a lot — that's what drives the ranking to converge.",
        },
      ],
    },
  ],
};

window.PARTS = window.PARTS || {};
window.PARTS[window.PART_DATA.id] = window.PART_DATA;
