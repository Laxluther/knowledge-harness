/* ============================================================
   Syllabus — the outline of everything worth knowing.

   Structure is Track → Module → Lesson. A lesson listed here is
   *planned*: the title stakes out the ground, the body has not
   been written yet. When a note gets written it moves out of here
   and into content/part-N.js with real prose, diagrams, and a
   quiz — library.js merges the two and marks each note written or
   planned so the difference is always visible on the page.

   The taxonomy for the AI Research, System Design, ML Mathematics,
   Inference Engineering and Notation tracks follows the public
   curriculum published at fanout.sh (Suraj Gaud), captured
   2026-08-23. It is used here as a study outline; the lesson
   bodies on that site are paid content and none of it is
   reproduced. Anything written under these headings is our own.
   ============================================================ */

window.SYLLABUS = {
  tracks: [
    /* ========================================================
       AI RESEARCH — 12 modules
       ======================================================== */
    {
      id: "ai-research",
      title: "AI Research",
      tagline: "From derivatives to publishing a paper",
      hue: "ice",
      modules: [
        {
          id: "air-math",
          title: "Math Fundamentals",
          tagline: "The foundations you actually need — functions through SVD",
          lessons: [
            "Functions", "Derivatives", "Vectors", "Gradients", "Matrices",
            "Derivation Rules & Examples", "The Chain Rule", "Backprop in Python",
            "The Jacobian Matrix", "Hadamard Product (Element-wise Op)",
            "Entropy & Information Theory", "KL Divergence",
            "Singular Value Decomposition (SVD)", "Moving Averages (EMA)",
          ],
        },
        {
          id: "air-intuitions",
          title: "Core AI Intuitions",
          tagline: "The handful of operations everything else is built from",
          lessons: ["Similarity With Dot Product", "Softmax Probabilities", "Tensor Broadcasting", "L1 vs L2 Norms"],
        },
        {
          id: "air-pytorch",
          title: "PyTorch Fundamentals",
          tagline: "Tensor mechanics until they stop being mysterious",
          lessons: [
            "Creating Tensors", "Matrix Multiplication", "Transposing Tensors",
            "flatten, reshape, view, squeeze, unsqueeze", "Indexing and Slicing",
            "cat, stack", "Special Tensors (eye, rand, arange, linspace)",
            "7 PyTorch Tasks (Advanced)",
          ],
        },
        {
          id: "air-tensorflow",
          title: "TensorFlow Fundamentals",
          tagline: "Linear models through style transfer and machine translation",
          lessons: [
            "Simple Linear Model", "Convolutional Neural Network", "Pretty Tensor",
            "Layers API", "Keras API", "Save & Restore", "Ensemble Learning",
            "CIFAR-10", "Inception Model", "Transfer Learning", "Video Data",
            "Fine-Tuning", "Adversarial Examples", "Adversarial Noise for MNIST",
            "Visual Analysis", "Visual Analysis for MNIST", "Deep Dream",
            "Style Transfer", "TensorFlow GPU vs CPU", "Reinforcement Learning",
            "Estimator API", "TFRecords & Dataset API", "Hyper-Parameter Optimization",
            "Natural Language Processing", "Machine Translation", "Image Captioning",
            "Time-Series Prediction",
          ],
        },
        {
          id: "air-nn-scratch",
          title: "Neural Network from Scratch",
          tagline: "One neuron, then a layer, then a training loop",
          lessons: [
            "Single Neuron From Scratch", "Building a Layer", "Implementing a Network",
            "RMSNorm", "Learning Rate, Decay", "Adam Optimizer", "Neural Network From Scratch",
          ],
        },
        {
          id: "air-transformers",
          title: "Transformers",
          tagline: "Attention, then build GPT from nothing",
          lessons: ["Attention Mechanism Explained", "Self Attention from Scratch", "GPT From Scratch"],
        },
        {
          id: "air-rl",
          title: "Reinforcement Learning",
          tagline: "Learning from interaction, up to modern LLM reasoning",
          lessons: [
            "Agents & Environments", "Policy Gradients (REINFORCE)", "Deep Q-Learning (DQN)",
            "PPO, LLM Reasoning, Importance Ratio, Advantage",
            "Qwen 3 GSPO & DeepSeek GRPO — LLM Reasoning",
          ],
        },
        {
          id: "air-llm-scratch",
          title: "LLM From Scratch",
          tagline: "Rebuild the frontier architectures yourself",
          lessons: ["Llama 4 From Scratch", "DeepSeek V3 From Scratch", "Qwen 3 From Scratch", "Self-Study LLM"],
        },
        {
          id: "air-paper",
          title: "Write a Research Paper",
          tagline: "Experiment, write, publish",
          lessons: ["Code, Write & Publish an AI Research Paper"],
        },
        {
          id: "air-finetune",
          title: "How to Fine-Tune Models",
          tagline: "LoRA through full fine-tuning, and when each is right",
          lessons: ["Why Fine-Tune?", "LoRA & QLoRA", "Data Preparation", "Training & Hyperparameters", "Evaluation & Deployment"],
        },
        {
          id: "air-mlops",
          title: "Machine Learning Operations",
          tagline: "Git to Kubernetes to Prometheus — the part that keeps models alive",
          lessons: [
            "Introduction to MLOps", "Git & GitHub", "Python OOP for MLOps",
            "Data Versioning with DVC", "ML Pipeline with DVC & AWS S3",
            "MLflow — Experiment Tracking", "Continuous Integration", "Docker",
            "Project: Vehicle Insurance Domain", "MongoDB Setup & Notebook Experiment",
            "Data Ingestion Component", "Data Validation & Transformation",
            "Model Evaluation & AWS S3", "Building an ML App with FastAPI",
            "Complete CI/CD on AWS", "Kubernetes Part 1",
            "Project: First Kubernetes Deployment", "Prometheus & Grafana",
            "Project: Prometheus-Grafana on Kubernetes", "Capstone: End-to-End MLOps",
            "Experiment Tracking with MLflow & DagsHub", "App Building & Automation with DVC",
            "CI/CD Implementation (Capstone)", "EKS Cluster Deployment", "Prometheus-Grafana on EKS",
          ],
        },
        {
          id: "air-bonus",
          title: "Bonus",
          tagline: "Training dynamics and recent reasoning architectures",
          lessons: [
            "Train LLM — Sequence Length vs Batch Size",
            "SwiGLU — Better Neural Networks",
            "100x AI Reasoning — Tiny Recursive Model",
          ],
        },
      ],
    },

    /* ========================================================
       SYSTEM DESIGN — 14 modules
       ======================================================== */
    {
      id: "system-design",
      title: "System Design",
      tagline: "Requirements through the things that page you at 3am",
      hue: "verdant",
      modules: [
        {
          id: "sd-foundations",
          title: "Foundations",
          tagline: "Scalability, tradeoffs, and capacity planning",
          lessons: [
            "System Design Interview: A Step-By-Step Guide",
            "Horizontal vs Vertical Scaling",
            "Back-of-the-Envelope Estimation / Capacity Planning",
            "Monolithic vs Microservice Architecture",
            "System Design Primer: Distributed Systems",
            "Scalability — Harvard CS75",
          ],
        },
        {
          id: "sd-apis",
          title: "APIs, Services & Protocols",
          tagline: "Design, routing, retries, and backpressure",
          lessons: [
            "API Architectural Styles: REST, SOAP, gRPC, GraphQL",
            "Reverse Proxy vs API Gateway vs Load Balancer",
            "What Is RPC? gRPC Introduction",
            "Proxy vs Reverse Proxy",
            "What Is an API Gateway?",
            "Idempotency in APIs",
          ],
        },
        {
          id: "sd-sql",
          title: "Data Modeling & SQL",
          tagline: "Relational design, indexing, ACID, WAL",
          lessons: [
            "7 Database Paradigms",
            "SQL Execution Order & Query Optimization",
            "Database Indexing Explained (PostgreSQL)",
            "ACID Properties With Examples",
            "How Database Sharding Works",
            "Tree Indexes: B+Trees",
          ],
        },
        {
          id: "sd-nosql",
          title: "NoSQL, Partitioning & IDs",
          tagline: "Sharding, consistent hashing, Bloom filters, ID generation",
          lessons: [
            "How to Choose the Right Database",
            "Consistent Hashing",
            "Bloom Filters",
            "Distributed ID Generation — Twitter Snowflake",
            "What Is Database Sharding?",
          ],
        },
        {
          id: "sd-cache",
          title: "Caching & Fast Reads",
          tagline: "Strategies, eviction, Redis, CDN, invalidation",
          lessons: [
            "Caching Strategies: Write-Through, Write-Back, Cache-Aside",
            "Why Is Single-Threaded Redis So Fast?",
            "Cache Systems Every Developer Should Know",
            "What Is a CDN and How Does It Work?",
            "Cache Invalidation Strategies",
          ],
        },
        {
          id: "sd-coordination",
          title: "Distributed Coordination",
          tagline: "Consensus, leader election, gossip",
          lessons: [
            "The Raft Consensus Algorithm",
            "CAP Theorem",
            "Distributed Systems: Consensus (Kleppmann)",
            "Gossip Protocol",
            "Leader Election",
            "Distributed Locks",
          ],
        },
        {
          id: "sd-storage",
          title: "Storage Engines",
          tagline: "LSM trees, B-trees, SSTables, compaction, WAL",
          lessons: [
            "How Databases Store Data on Disk (B-Trees vs LSM Trees)",
            "Architecting Amazon S3: Scalable Object Storage",
            "Database Storage Models & Data Layout",
            "Event Sourcing and Stream Processing",
            "Write-Ahead Logging: Crash Recovery & Durability",
          ],
        },
        {
          id: "sd-async",
          title: "Async Work & Streams",
          tagline: "Queues, Kafka, event-driven design, scheduling",
          lessons: [
            "Apache Kafka in 3 Minutes",
            "Distributed Message Queue",
            "Event-Driven Architecture",
            "Kafka vs RabbitMQ",
            "Distributed Task Scheduler",
          ],
        },
        {
          id: "sd-search",
          title: "Search & Retrieval",
          tagline: "Inverted indexes, ranking, autocomplete, crawling",
          lessons: [
            "What Elasticsearch Is Used For — Search Indexes",
            "Design a Basic Search Engine",
            "Elasticsearch from the Bottom Up",
            "Design Autocomplete / Typeahead",
            "Design a Web Crawler",
          ],
        },
        {
          id: "sd-analytics",
          title: "Analytics & Sketches",
          tagline: "Counting at scale with probabilistic structures",
          lessons: [
            "HyperLogLog — Counting Distinct Values at Scale",
            "Top-K / Heavy Hitters",
            "How YouTube Counts Views — Lambda Architecture",
            "Count-Min Sketch",
            "Reservoir Sampling & Streaming Algorithms",
          ],
        },
        {
          id: "sd-realtime",
          title: "Realtime, Social & Feeds",
          tagline: "WebSockets, feeds, social graphs, fanout",
          lessons: [
            "Short Polling vs Long Polling vs WebSockets",
            "Designing a News Feed System",
            "WhatsApp System Design: Chat Messaging",
            "HTTP Long-Polling vs WebSockets vs SSE",
            "Facebook / Instagram System Design",
          ],
        },
        {
          id: "sd-geo",
          title: "Geo, Matching & Recs",
          tagline: "Geospatial indexing and proximity search",
          lessons: [
            "Design a Location-Based Service (Yelp, Google Places)",
            "Geohash: Deep Intuitive Understanding",
            "Uber / Lyft Ride Sharing",
            "Design Tinder",
            "Design Google Maps",
          ],
        },
        {
          id: "sd-media",
          title: "Media, Files & CDN",
          tagline: "Transcoding, uploads, signed URLs, live streaming",
          lessons: [
            "Design YouTube",
            "How a CDN Works",
            "Design Google Drive / Dropbox",
            "Amazon S3: Presigned URLs & Multipart Upload",
            "Live Streaming Architecture",
          ],
        },
        {
          id: "sd-reliability",
          title: "Reliability & Operations",
          tagline: "Observability, SLOs, deploys, rate limiting",
          lessons: [
            "Design a Rate Limiter",
            "How Service Observability Works",
            "SLAs, SLOs and SLIs",
            "Deployment Strategies: Blue-Green, Canary, Rolling",
            "Circuit Breaker Pattern",
          ],
        },
      ],
    },

    /* ========================================================
       ML MATHEMATICS — 12 modules
       ======================================================== */
    {
      id: "ml-math",
      title: "ML Mathematics",
      tagline: "Why models learn, not just that they do",
      hue: "violet",
      modules: [
        {
          id: "mm-math",
          title: "Mathematics for Models",
          tagline: "The algebra, calculus and optimization underneath",
          lessons: ["Linear algebra", "Multivariable calculus", "Probability & statistics", "Convex optimization"],
        },
        {
          id: "mm-data",
          title: "Data, Features & Preprocessing",
          tagline: "Understand the data-generating process first",
          lessons: ["Sampling & data generation", "EDA and missingness", "Scaling & encoding", "Feature engineering", "Data leakage"],
        },
        {
          id: "mm-theory",
          title: "Learning Theory & Generalization",
          tagline: "What can be learned, and why models overfit",
          lessons: ["Empirical risk", "Bias–variance", "Regularization", "PAC intuition", "Distribution shift"],
        },
        {
          id: "mm-linear",
          title: "Linear & Generalized Linear Models",
          tagline: "The most interpretable family, end to end",
          lessons: ["Linear regression", "Logistic regression", "GLMs", "Regularized regression", "Calibration"],
        },
        {
          id: "mm-trees",
          title: "Trees & Ensemble Methods",
          tagline: "Recursive partitions through boosting",
          lessons: ["Decision trees", "Random forests", "Gradient boosting", "XGBoost & LightGBM", "Feature importance"],
        },
        {
          id: "mm-kernels",
          title: "Geometry, Margins & Kernel Methods",
          tagline: "Maximum margins and nonlinear boundaries",
          lessons: ["Geometric classifiers", "Support vector machines", "The kernel trick", "Kernel selection", "Large-margin loss"],
        },
        {
          id: "mm-probabilistic",
          title: "Probabilistic Models",
          tagline: "Uncertainty modelled explicitly",
          lessons: ["MLE & MAP", "Bayesian inference", "Naive Bayes", "Gaussian mixtures", "Graphical models"],
        },
        {
          id: "mm-unsupervised",
          title: "Unsupervised Learning",
          tagline: "Structure without labels",
          lessons: ["K-means & clustering", "PCA & factorization", "Manifold learning", "Density estimation", "Anomaly detection"],
        },
        {
          id: "mm-evaluation",
          title: "Evaluation, Selection & Error Analysis",
          tagline: "Estimates you can trust, failures you can use",
          lessons: ["Train/validation/test", "Cross-validation", "Metrics & thresholds", "Hyperparameter search", "Error analysis"],
        },
        {
          id: "mm-deep",
          title: "Neural Networks & Deep Learning",
          tagline: "Backprop, optimization dynamics, representation",
          lessons: ["Backpropagation", "Initialization & normalization", "Optimizers", "CNNs & sequence models", "Attention"],
        },
        {
          id: "mm-generative",
          title: "Representation & Generative Models",
          tagline: "Latents, and the families that generate",
          lessons: ["Embeddings", "Autoencoders", "GANs", "Diffusion models", "Self-supervised learning"],
        },
        {
          id: "mm-production",
          title: "Production ML & Research Practice",
          tagline: "From a reproducible experiment to a monitored system",
          lessons: ["Reproducible experiments", "Experiment tracking", "Serving & monitoring", "Drift & retraining", "Ablations & reporting"],
        },
      ],
    },

    /* ========================================================
       INFERENCE ENGINEERING
       ======================================================== */
    {
      id: "inference-eng",
      title: "Inference Engineering",
      tagline: "Token generation to capacity planning under real traffic",
      hue: "ember",
      modules: [
        {
          id: "ie-basics",
          title: "Generation & Workload",
          tagline: "What a request actually costs",
          lessons: ["How token generation works", "Defining the workload", "Prefill vs decode", "Latency targets that mean something"],
        },
        {
          id: "ie-memory",
          title: "Weights & KV-Cache Math",
          tagline: "Where the memory goes",
          lessons: ["Weight memory", "KV-cache memory formula", "Grouped-query and multi-head attention", "Context length vs batch size"],
        },
        {
          id: "ie-batching",
          title: "Batching & Attention Kernels",
          tagline: "Getting throughput without wrecking latency",
          lessons: ["Continuous batching", "PagedAttention", "Chunked prefill", "FlashAttention", "Speculative decoding"],
        },
        {
          id: "ie-quant",
          title: "Quantization",
          tagline: "Trading precision for room",
          lessons: ["FP8 vs INT8", "AWQ and GPTQ", "W8A8 vs W4A16", "KV-cache quantization", "When quantization slows you down"],
        },
        {
          id: "ie-serving",
          title: "Serving Runtimes & Distribution",
          tagline: "Running it on more than one card",
          lessons: ["Serving runtimes compared", "Tensor parallelism", "Pipeline parallelism", "Expert parallelism", "Disaggregated prefill and decode"],
        },
        {
          id: "ie-bench",
          title: "Benchmarking & Observability",
          tagline: "Numbers you can defend",
          lessons: ["The roofline model", "Benchmark methodology", "Capacity planning", "Inference observability"],
        },
      ],
    },

    /* ========================================================
       NOTATION — reading equations
       ======================================================== */
    {
      id: "notation",
      title: "Notation",
      tagline: "Reading an unfamiliar equation without stalling",
      hue: "terra",
      modules: [
        {
          id: "nt-decoder",
          title: "Math Decoder",
          tagline: "Nine passes over the grammar of research notation",
          lessons: [
            "Equations are typed sentences",
            "How to read mathematical notation aloud",
            "Sets, membership and logic",
            "Scalars, vectors, matrices and tensors",
            "Functions, mappings and bound variables",
            "Subscripts, superscripts and decorations",
            "Brackets, scope and operator precedence",
            "Definitions, objectives and updates",
            "Ambiguous glyphs and the notation ledger",
          ],
        },
      ],
    },
  ],
};
