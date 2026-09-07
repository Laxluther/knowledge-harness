# fanout.sh — UI/UX + content map

Reference for the Booklet revamp. Captured 2026-08-23 from the live site, its
`sitemap.xml` (600 URLs), `llms.txt`, `llms-full.txt`, and the per-page `.md`
representations the site publishes (every route has a `<route>.md` twin).

Owner: Suraj Gaud. Stack: React SPA, rolldown bundler, Phosphor icons, marked
"BETA". Ships `llms.txt` + `.md` mirrors + RSS as a first-class content API —
worth stealing on its own.

---

## 1. Information architecture

Top nav (single row, always visible):
`Home · Labs · Daily · Startups · Blog · Study · Roadmap · Topography · Tools · Pricing · Learning ⌄`
Right side: `🔔 Updates | Weekly` pill, `Sign in`. Above nav: a dismissible blue
announcement strip (`NEW COURSE — Inference Engineering is dropping this week →`).
Bottom-right: persistent `Feedback` button.

### Route tree

```
/                       home / product map
/roadmap                visual roadmap (3 tracks, node graph + index sidebar)
/knowledge-graph        "Knowledge Topography" — 256 nodes, 526 relations
/pricing  /companies  /ideas  /newsletter  /privacy /terms /refunds

COURSES
/ai                     AI Research — 12 modules · 108 lessons
  /ai/overview          full curriculum listing
  /ai/tracks  /ai/glossary  /ai/papers  /ai/resources
  /ai/lessons/<slug>    individual lessons (3 public)
  /ai/{deep-learning, machine-learning, reinforcement-learning, gpu, hardware,
       system-design, tools, guides, articles, blogs, newsletters, challenges,
       interviews, jobs, community, newbies, claude-code, misc}
/system                 System Design In Depth — 14 modules
  /system/overview  /system/resources  /system/implementations
  /system/archive       19 deep-dive case notes
/ml-math                ML Mathematics — 12 modules · 301 topic lessons
  /ml-math/overview  /ml-math/resources
  /ml-math/decoder     9 notation lessons
  /ml-math/lessons/<slug>-t-<id>
/inference-eng          LLM Inference roadmap (upcoming)
  /inference-eng/courses   disclosed competitor comparison
/open-robotics          upcoming

FREE / ONGOING
/labs                   15 interactive labs (13 on-device, 2 live-data)
/labs/math-decoder      358 symbols + 24 formulas
  /labs/math-decoder/symbol/<slug>   (~350 pages)
  /labs/math-decoder/formula/<slug>  (24 pages)
/daily                  dated paper calendar, 1/day, ~54 live
  /daily/YYYY-MM-DD-<slug>
/blog                   ~60 field-note posts
/tools                  curated external tool directory
/study-with-me          /study-with-me/sessions/<date>-<slug>
```

**Scale ranking (what's actually big):** math-decoder symbols (~350) > daily
papers (~54, growing 1/day) > blog (~60) > system archive (19) > ml-math
decoder (9) + labs (15).

---

## 2. Visual language

| Token | Value |
|---|---|
| Sans | `Overused Grotesk` → system fallback |
| Mono | `IBM Plex Mono` (all eyebrows, meta, labels) |
| Display | `Departure Mono` (pixel/bitmap face — used for big page titles like "Info Roadmap") |
| Alt sans | `FK Grotesk` |
| Background | `#fafafa`-ish off-white; dark mode `--ga-bg: #111213` |
| Surface | white cards, hairline borders, near-zero shadow |
| Accents | purple / blue / green / orange category set (`--ga-cat-*`) |

**The consistent pattern on every page**: mono uppercase micro-eyebrow →
large tight-tracking sans headline → one-line grey subhead → content. Meta
strips at card bottoms are always mono uppercase, letter-spaced, with a small
coloured dot.

### Distinctive UI moves worth replicating

1. **Stacked-card course tiles** (home). Each course is a fanned stack of
   3–4 offset cards with `--card-tilt` / `--card-y` CSS vars per `nth-child`,
   flattening on hover. Reads like a deck of physical booklets.
2. **Numbered pastel bento grid** ("Everything else on fanout") — 8 tiles,
   big `01`–`08` numerals, one flat pastel per tile, arrow affordance.
3. **Command-palette course browser** (`/ai`) — a floating search modal over a
   blurred wall of resource thumbnails, with an icon row and a numbered
   `01…12` module grid inside it.
4. **Roadmap as a force graph** with distinct *geometric shape per module*
   (square / diamond / circle / pentagon / triangle / hexagon), solid vs dashed
   edges, lesson counts under each label, and a right-hand collapsible INDEX
   sidebar grouped `FOUNDATIONS / BUILD / FRONTIER`.
5. **Knowledge Topography** — full force-directed graph, colour by course,
   search + `All courses` / `All progress` filters, `Full` vs `Neighbors` mode,
   list/graph toggle, hint chip "DRAG A NODE — ITS NEIGHBORHOOD FOLLOWS".
6. **Lab cards** — coloured top rule, icon chip, `RUNS ON DEVICE` / `LIVE DATA`
   badge, mono eyebrow, title, description with *inline coloured keywords*, a
   bolded **question the lab answers**, `Open X →`, then a mono tag footer.
7. **Faceted symbol grid** (math decoder) — Symbols/Equations tabs, search, a
   long single-line filter chip row (Grammar, Sets and logic, Linear algebra,
   Probability, Calculus, Optimization, Information theory, Neural networks,
   Transformers, Generative models, RL, GPU and inference, Simple, Intermediate,
   Advanced), result count line, then glyph cards grouped by section.
8. **Corkboard illustration** with numbered sticky notes as an editorial break.
9. **Filter/count honesty** — everything states its numbers: `15 AVAILABLE NOW ·
   13 ON DEVICE · 2 LIVE-DATA TOOLS`, `358 results · basics first`,
   `256 NODES · 526 RELATIONS`, `12 modules · 108 lessons · updated weekly`.

---

## 3. Content taxonomy

### Track A — AI Research (12 modules, 108 lessons)
1. Math Fundamentals (15) — functions, derivatives, vectors, gradients,
   matrices, derivation rules, chain rule, backprop in Python, Jacobian,
   Hadamard product, entropy & information theory, KL divergence, SVD, EMA
2. Core AI Intuitions (4) — dot-product similarity, softmax, broadcasting, L1 vs L2
3. PyTorch Fundamentals (9) — tensor creation, matmul, transpose,
   flatten/reshape/view/squeeze/unsqueeze, indexing, cat/stack, special tensors
4. TensorFlow Fundamentals (27) — linear model → CNN → Keras → transfer learning
   → adversarial examples → deep dream → style transfer → RL → NLP → captioning
5. Neural Network from Scratch (7) — single neuron, layer, network, RMSNorm,
   LR/decay, Adam
6. Transformers (3) — attention explained, self-attention from scratch, GPT from scratch
7. Reinforcement Learning (5) — agents/envs, REINFORCE, DQN, PPO, GSPO/GRPO
8. LLM From Scratch — Llama 4, DeepSeek V3, Qwen 3, self-study
9. Write Research Paper — code, write & publish
10. How to Fine-Tune Models (5) — why, LoRA/QLoRA, data prep, training, eval/deploy
11. MLOps (25) — Git, Docker, DVC, MLflow, CI, FastAPI, Kubernetes, Prometheus/
    Grafana, EKS, capstone
12. Bonus — seq-len vs batch-size, SwiGLU, tiny recursive model

### Track B — System Design (14 modules)
Foundations · APIs/Services/Protocols · Data Modeling & SQL · NoSQL,
Partitioning & IDs · Caching & Fast Reads · Distributed Coordination · Storage
Engines · Async Work & Streams · Search & Retrieval · Analytics & Sketches ·
Realtime, Social & Feeds · Geo, Matching & Recs · Media, Files & CDN ·
Reliability & Operations. (5–6 lessons each; heavy on real case studies —
YouTube, WhatsApp, Uber, Tinder, Drive, Maps.)

### Track C — ML Mathematics / In-depth ML (12 modules, 301 topic lessons)
Mathematics for Models · Data, Features & Preprocessing · Learning Theory &
Generalization · Linear & GLMs · Trees & Ensembles · Geometry, Margins &
Kernels · Probabilistic Models · Unsupervised Learning · Evaluation, Selection
& Error Analysis · Neural Networks & Deep Learning · Representation &
Generative Models · Production ML & Research Practice.

Plus **Math Decoder** (9 lessons): equations are typed sentences · reading
notation aloud · sets, membership & logic · scalars/vectors/matrices/tensors ·
functions, mappings & bound variables · subscripts, superscripts & decorations ·
brackets, scope & operator precedence · definitions, objectives & updates ·
ambiguous glyphs & the notation ledger.

### Track D — Inference Engineering (roadmap only)
Token generation → workload definition → weights → KV-cache math → continuous
batching → PagedAttention → quantization → serving runtimes → distributed
execution → benchmarking → observability. Every stage ends in a calculation,
benchmark, or design artifact.

### Labs (15)
Math Decoder · Agent Control Room · Latency Numbers · Tokenizer and Context ·
RAG Chunking and Retrieval · Inference Memory and KV Cache · Fanout Scale
(back-of-envelope) · Eval Confidence · Gradient Descent · Sampling Playground ·
Timeout Architect · How AI Remembers · Daily Planner · Model Router & Pareto
Explorer · PDF-to-RAG Readiness Scan.

### Daily papers (~54 and counting)
Perceptron, Shannon, GFS, Bigtable, Dremel, Adam, seq2seq, word2vec, ResNet,
BatchNorm, BERT, LoRA, Raft, MapReduce, Dynamo, Chinchilla, Scaling Laws,
FlashAttention (+2), Attention Is All You Need, KV-cache survey, PagedAttention,
DPO, Dropout, VAE, DDPM, RAG, Speculative Decoding, Tail at Scale, Distillation,
Switch Transformers, InstructGPT, PPO, GRPO, GQA, Orca, ZeRO, RMSNorm, Mamba,
Ring Attention, ReAct, PageRank, TCP congestion, Bitcoin, AlphaGo, Tor, Bloom
filter, CoT, Shazam, Toolformer, end-to-end arguments, DNS, CLIP.

---

## 4. What maps onto Booklet

**Keep from Booklet:** the wizard mascot (`assets/sprites/wizard.png`), the
pixel-art idiom, the theatrical scene animations, `theme.js` dark mode, the
`content/part-N.js` single-source-of-truth model (one data file renders both
quest and revise views), the Playwright test suite, the dispatch agent.

**Removing:** the level/node gating system — `MapRenderer`, `map.html` per part,
locked/unlocked/completed states, XP, badges, `requires` edges. That is the
biggest structural change: chapters become directly-addressable notes in a
browsable library, not gated map nodes.

**Adopting from fanout:**
- flat browse surfaces (grid + facets + search) instead of a progression map
- mono-eyebrow / big-headline / grey-subhead page rhythm
- stacked-card and numbered-bento tiles for track and section entry points
- honest count lines everywhere
- `.md` twin per page + `llms.txt` (cheap here — content is already structured data)
- a knowledge-graph view as an *optional lens*, not the primary navigation

**Open question for the handwritten-notes pipeline:** fanout's unit is a
`lesson` inside a `module` inside a `track`. Booklet's is a `chapter` inside a
`part`. Converting scanned notes wants a flat `note` with tags that can be
projected into either. Worth settling before we build the shell.
