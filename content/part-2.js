/* ============================================================
   Content data — Part II: Prompting & Context Engineering
   Single source of truth rendered by BOTH the gamified quest
   pages and the Simple-mode revise page.
   ============================================================ */

window.PART_DATA = {
  id: "part-2",
  index: 2,
  title: "Prompting & Context Engineering",
  tagline: "Shaping behavior without touching a single weight",
  color: "ion",
  mapViewBox: "0 0 1000 900",
  edges: [
    ["p2-c1", "p2-c2"],
    ["p2-c2", "p2-c3"],
    ["p2-c3", "p2-c4"],
    ["p2-c1", "p2-c5"],
  ],
  badges: {
    first: { id: "p2-first", label: "First Word — completed your first Part II chapter" },
    complete: { id: "p2-complete", label: "Prompt Architect — cleared all of Part II" },
  },
  chapters: [
    {
      id: "p2-c1",
      n: 1,
      title: "Prompt Engineering Fundamentals",
      short: "A prompt is the model's entire context, not just the question",
      requires: [],
      xp: 90,
      node: { x: 500, y: 90 },
      diagram: {
        type: "compare",
        query: "Summarize this article",
        left: {
          label: "Vague prompt",
          stages: ["No format specified", "No length or focus given", "Model guesses structure"],
          outcome: { icon: "✕", text: "different structure every time — hard to parse", kind: "miss" },
        },
        right: {
          label: "Structured prompt",
          stages: ["Exact format: 3 bullets", "Length + focus constraints", "Content clearly delimited"],
          outcome: { icon: "✓", text: "consistent, parseable output every run", kind: "match" },
        },
      },
      hook: "<p>A prompt is not \"the question.\" It's the entire context you hand the model — and treating it that way is where most prompting mistakes start.</p>",
      explain: `<p>A prompt is everything in the context that isn't the model's own output: system instructions, task description, examples, retrieved content, conversation history, and the actual request. Part I established that this context is exactly what self-attention computes over — so what goes into it and how it's arranged genuinely shapes the computation, not just "sets the mood."</p>
      <p>A few techniques carry most of the weight. <strong>Role/system prompting</strong> establishes persona and constraints upfront, where they're read most reliably. <strong>Explicit task decomposition</strong> breaks a complex ask into ordered sub-steps instead of one dense paragraph. <strong>Specifying the output format</strong> directly — a schema, a template, an example of the exact shape wanted — beats assuming the model will infer it. And <strong>delimiters</strong> (XML-style tags, triple-quotes, markdown headers) unambiguously separate instructions from the data being processed.</p>
      <p>Models are also surprisingly sensitive to superficial changes — phrasing, whitespace, example ordering, even capitalization — shifting output quality measurably. Treat prompts as something to test and iterate on empirically, not write once and trust. And prefer <strong>positive framing</strong> over negative constraints: "respond in plain prose" is more reliable than "don't use bullet points," because it gives the model something concrete to target instead of an implicit gap to work out.</p>
      <p>Delimiters aren't just organizational — they're a security boundary. Mixing untrusted external content (a retrieved document, user-pasted text) directly into instructions without clear separation is exactly how <strong>prompt injection</strong> attacks work: content that looks like an instruction can hijack behavior if the model can't tell "this is data" from "this is a command." Wrapping untrusted content in explicit delimiters and instructing the model to treat everything inside as data-only is a first line of defense — not foolproof, but essential.</p>`,
      analogy:
        "<p>A prompt is a work order handed to a contractor. Vague verbal wishes get inconsistent results; a written spec with materials, dimensions, and an example photo gets a repeatable one.</p>",
      example:
        '<p>"Summarize this" versus "Summarize the following article in exactly 3 bullet points, each under 20 words, focusing only on financial figures — do not include quotes. &lt;article&gt;...&lt;/article&gt;" The second version specifies format, length, and focus, and clearly delimits the content from the instruction — producing consistent, parseable output every time instead of a coin flip on structure.</p>',
      takeaways: [
        "A prompt is the model's entire context, not just the literal question — everything included shapes the computation.",
        "Explicit output format, task decomposition, and positive framing all measurably improve reliability over vague asks.",
        "Models are sensitive to superficial prompt changes — treat prompting as an empirical, testable process.",
        "Delimiters that separate instructions from data are both a clarity tool and a first line of defense against prompt injection.",
      ],
      quiz: [
        {
          q: "What does \"a prompt\" actually consist of?",
          options: [
            "Only the literal question the user typed",
            "The model's entire context — system instructions, examples, history, retrieved content, and the request together",
            "Only the system message",
            "Only the most recent conversation turn",
          ],
          answer: 1,
          explain: "Everything present in the context window shapes what the model attends to and produces, not just the final question.",
        },
        {
          q: "Why is positive framing (\"respond in plain prose\") generally more reliable than negative framing (\"don't use bullet points\")?",
          options: [
            "Negative framing is always ignored by models",
            "Positive framing gives the model a concrete target instead of leaving it to infer what not doing something implies",
            "Positive framing uses fewer tokens",
            "There's no real difference",
          ],
          answer: 1,
          explain: "A concrete positive instruction is easier for the model to satisfy directly than an open-ended negative constraint.",
        },
        {
          q: "Why do delimiters between instructions and untrusted content matter for security?",
          options: [
            "They make the prompt shorter",
            "They help prevent injected content from being mistaken for an actual instruction",
            "They are only a stylistic preference",
            "They replace the need for a system prompt",
          ],
          answer: 1,
          explain: "Prompt injection relies on the model failing to distinguish data from commands — clear delimiters are a first line of defense.",
        },
        {
          q: "Why should prompts be treated as something to test empirically rather than write once?",
          options: [
            "Because models change their weights during a conversation",
            "Because models are sensitive to superficial phrasing and formatting changes that measurably affect output quality",
            "Because prompts expire after one use",
            "Because system prompts are ignored by default",
          ],
          answer: 1,
          explain: "Small wording or formatting changes can shift output quality in ways that are hard to predict without testing.",
        },
        {
          q: "What's the main benefit of specifying the exact output format upfront?",
          options: [
            "It makes the model faster",
            "It makes output reliably consistent and parseable instead of an unpredictable structure each time",
            "It removes the need for examples",
            "It prevents the model from using tools",
          ],
          answer: 1,
          explain: "Format specification is what makes model output usable by downstream code without fragile ad-hoc parsing.",
        },
      ],
    },
    {
      id: "p2-c2",
      n: 2,
      title: "In-Context Learning & Few-Shot Prompting",
      short: "Steering behavior with examples, not gradient updates",
      requires: ["p2-c1"],
      xp: 100,
      node: { x: 320, y: 300 },
      diagram: {
        type: "pipeline",
        stages: ["Zero-shot: instruction only", "One-shot: + 1 example", "Few-shot: + several examples", "Pattern established in-context"],
      },
      diagram2: {
        type: "persona",
        prompt: "Classify: \"the service was okay I guess\"",
        personas: [
          { label: "Few-shot: mostly positive examples", text: "Predicted: Positive — skewed by the label imbalance in the shots, not the actual input." },
          { label: "Few-shot: balanced examples", text: "Predicted: Neutral — accurately reflects the genuinely ambiguous input." },
        ],
      },
      hook: "<p>Show a model a few examples in the prompt, and it adapts its behavior instantly — no training, no gradient updates, just conditioning on what's in the context window right now.</p>",
      explain: `<p><strong>Zero-shot</strong> means no examples, just an instruction. <strong>One-shot</strong> adds a single example. <strong>Few-shot</strong> includes several (input, desired output) pairs directly in the prompt before the real query. This works via <strong>in-context learning (ICL)</strong> — an emergent capability of large pretrained models where predictions condition on patterns present in the current context, with no weight updates at all.</p>
      <p>This is fundamentally different from fine-tuning (Part I, Chapter 5): ICL happens fresh every request and vanishes the moment the context is cleared, while fine-tuning permanently bakes behavior into the weights. Few-shot prompting is the cheap, instant, reversible version of behavior-shaping; fine-tuning is the expensive, durable version.</p>
      <p>Three details determine whether few-shot examples actually help. <strong>Format consistency</strong> between the examples and the real query matters most — the examples establish a pattern, and any mismatch in phrasing style or delimiter confuses which pattern to follow. <strong>Example order</strong> matters because models show a measurable recency bias, weighting examples nearer the end of the prompt more heavily — accidentally ending on an atypical example can skew everything that follows. <strong>Label balance</strong> matters just as much: if four of five examples show one category and only one shows another, the model leans toward the majority pattern regardless of what the actual query says, an easy trap when examples are pulled unevenly from a dataset.</p>
      <p>More examples isn't automatically better. Each one costs context budget, and beyond a modest number, additional examples show diminishing returns or can even distract from the instruction itself — representative diversity usually beats sheer quantity.</p>`,
      analogy:
        "<p>Fine-tuning is teaching someone a skill over months until it's second nature. Few-shot prompting is showing them three quick worked examples right before they start the task — it works, but only for as long as those examples stay in view.</p>",
      example:
        "<p>A sentiment-classifier prompt with 5 examples, 4 labeled \"positive\" and only 1 \"negative,\" will drift toward predicting positive more often than it should on a genuinely ambiguous new input — purely from the skewed label distribution in the shots, not the content of the actual query.</p>",
      takeaways: [
        "Few-shot prompting conditions model behavior via in-context learning, without any weight updates — unlike fine-tuning, it resets the moment the context is cleared.",
        "Format consistency between example shots and the real query is critical — mismatches confuse which pattern to follow.",
        "Example order matters due to recency bias, and label/category balance across examples matters to avoid skewing output.",
        "More examples isn't automatically better — quality and diversity usually beat raw quantity once past a handful.",
      ],
      quiz: [
        {
          q: "What makes in-context learning fundamentally different from fine-tuning?",
          options: [
            "ICL is slower to set up",
            "ICL conditions behavior via the current prompt with no weight updates, and resets the moment context is cleared; fine-tuning permanently changes the weights",
            "ICL only works on small models",
            "There is no real difference",
          ],
          answer: 1,
          explain: "Few-shot examples shape output only for the current context window; fine-tuning bakes the change into the model permanently.",
        },
        {
          q: "Why does label balance across few-shot examples matter?",
          options: [
            "It doesn't affect output at all",
            "An uneven label distribution in the examples can skew predictions toward the majority pattern, regardless of the actual query",
            "It only matters for zero-shot prompts",
            "It changes the model's context window size",
          ],
          answer: 1,
          explain: "The model conditions on the pattern in the shots — an imbalanced pattern biases output even when the real input doesn't match that bias.",
        },
        {
          q: "Why does example order affect few-shot prompting outcomes?",
          options: [
            "Order never matters",
            "Models show recency bias, weighting examples nearer the end of the prompt more heavily",
            "Only the first example is ever read",
            "Order only matters for zero-shot prompts",
          ],
          answer: 1,
          explain: "An atypical example placed last can disproportionately influence the output due to this recency effect.",
        },
        {
          q: "Why is format consistency between examples and the real query important?",
          options: [
            "It reduces token cost",
            "Mismatched phrasing or delimiters between examples and the query confuses which pattern the model should follow",
            "It's only a stylistic preference with no functional effect",
            "It prevents hallucination entirely",
          ],
          answer: 1,
          explain: "The examples establish a pattern; the model needs the real query to look like it belongs to that same pattern.",
        },
        {
          q: "Is adding more few-shot examples always better?",
          options: [
            "Yes, always — more examples strictly improve accuracy",
            "No — each example costs context budget, and beyond a point returns diminish or examples can distract from the instruction",
            "No — few-shot prompting never helps at all",
            "Yes, but only for zero-shot prompts",
          ],
          answer: 1,
          explain: "Representative diversity and quality of examples matters more than raw quantity once past a modest number.",
        },
      ],
    },
    {
      id: "p2-c3",
      n: 3,
      title: "Chain-of-Thought & Reasoning Techniques",
      short: "Making the model think out loud before answering",
      requires: ["p2-c2"],
      xp: 110,
      node: { x: 320, y: 480 },
      diagram: {
        type: "compare",
        query: "A store had 23 apples, sold 8, then received 15 more. Total?",
        left: {
          label: "Direct answer",
          stages: ["Pattern-matches similar problems", "No intermediate steps", "Single guess"],
          outcome: { icon: "✕", text: "confidently states the wrong total", kind: "miss" },
        },
        right: {
          label: "Chain-of-thought",
          stages: ["23 − 8 = 15", "15 + 15 = 30", "States the computed total"],
          outcome: { icon: "✓", text: "arrives at the correct total by computing it", kind: "match" },
        },
      },
      diagram2: {
        type: "bars",
        label: "5 sampled reasoning paths — final answers (self-consistency)",
        bars: [
          { label: "30 (correct)", value: 60 },
          { label: "29", value: 22 },
          { label: "31", value: 18 },
        ],
      },
      hook: "<p>Ask a model to \"show its work,\" and multi-step reasoning accuracy jumps — chain-of-thought prompting is asking the model to think out loud before answering.</p>",
      explain: `<p><strong>Chain-of-thought (CoT)</strong> prompting instructs the model to produce intermediate reasoning steps before its final answer, rather than jumping straight to a conclusion. On multi-step arithmetic, logic, and planning tasks, this measurably improves accuracy — the model effectively spends more computation per answer, working through the problem incrementally instead of pattern-matching the final answer in one shot.</p>
      <p><strong>Zero-shot CoT</strong> is as simple as appending "let's think step by step" to a prompt with no worked examples — often enough on its own to trigger reasoning behavior. <strong>Few-shot CoT</strong> instead provides worked examples that include the reasoning chain itself, not just the final answer, teaching the model the style of reasoning to imitate.</p>
      <p><strong>Self-consistency</strong> goes a step further: instead of trusting one greedy reasoning trace, sample several independent CoT completions (using the temperature sampling from Part I, Chapter 7) and take a majority vote over their final answers. Wrong reasoning paths tend to diverge from each other in inconsistent ways, while correct reasoning tends to converge on the same answer — which is exactly why majority voting measurably outperforms trusting any single trace. <strong>Tree-of-thought</strong> and deliberate search go further still, exploring multiple branching reasoning paths, evaluating intermediate states, and backtracking from dead ends — suited to harder planning problems where one linear pass easily gets stuck.</p>
      <p>Modern <strong>reasoning models</strong> (o1-style, extended/deep-thinking modes) differ from prompted CoT in an important way: instead of being prompted to show reasoning, they're trained via reinforcement learning specifically to generate long internal reasoning traces before answering — reasoning baked into training, not elicited by a prompt.</p>
      <p>Two limitations are easy to miss. CoT isn't free — more output tokens mean more latency and cost, so forcing it onto trivial tasks that don't need multi-step reasoning is often pure waste. And stated reasoning can be <strong>unfaithful</strong>: the text a model produces as "its reasoning" doesn't always reflect the actual computation that determined the final answer, so CoT output shouldn't be blindly trusted as a fully transparent window into the model's true process.</p>`,
      analogy:
        "<p>A model without CoT is a student blurting out an answer during a test. A model with CoT is the same student required to show their work — not only does the grader trust it more, the act of writing it out often catches errors the student would otherwise have made.</p>",
      example:
        "<p>Asked \"a store had 23 apples, sold 8, then received a shipment of 15 more — how many now?\", a direct-answer prompt sometimes produces a wrong number from pattern-matching similar-looking problems. A CoT prompt instead walks through 23 − 8 = 15, then 15 + 15 = 30, landing on the correct total by actually performing the arithmetic in sequence rather than guessing the shape of the answer.</p>",
      math: [
        {
          expr: "â = argmax<sub>a</sub> Σ<sub>i=1</sub><sup>k</sup> 𝟙[ answer(path<sub>i</sub>) = a ]",
          note: "<strong>Self-consistency's majority vote.</strong> Sample k independent reasoning paths, extract each one's final answer, and pick whichever answer appears most often. Because wrong reasoning chains tend to disagree with each other while correct ones converge, this simple vote reliably beats trusting any single sampled path.",
        },
      ],
      takeaways: [
        "Chain-of-thought prompting elicits intermediate reasoning steps, measurably improving accuracy on multi-step tasks.",
        "Zero-shot CoT (\"let's think step by step\") and few-shot CoT (worked reasoning examples) are two ways to trigger it.",
        "Self-consistency samples multiple reasoning paths and takes a majority vote, which is more reliable than trusting a single trace.",
        "Reasoning models (o1-style) bake extended reasoning into training via RL, rather than eliciting it purely through prompting.",
        "CoT costs real tokens and latency, and its stated reasoning can be unfaithful to the model's actual internal process.",
      ],
      quiz: [
        {
          q: "What does chain-of-thought prompting ask the model to do?",
          options: [
            "Answer as fast as possible with no explanation",
            "Produce intermediate reasoning steps before stating a final answer",
            "Always use bullet-point formatting",
            "Skip retrieval entirely",
          ],
          answer: 1,
          explain: "CoT elicits step-by-step reasoning, which measurably improves accuracy on multi-step tasks compared to jumping straight to an answer.",
        },
        {
          q: "What is the core idea behind self-consistency?",
          options: [
            "Always trust the first reasoning path generated",
            "Sample multiple independent reasoning paths and take a majority vote over their final answers",
            "Never sample more than once",
            "Only use zero-shot prompts",
          ],
          answer: 1,
          explain: "Correct reasoning chains tend to converge on the same answer, while wrong ones diverge inconsistently, making majority vote more reliable.",
        },
        {
          q: "How do modern \"reasoning models\" (o1-style) differ from prompted chain-of-thought?",
          options: [
            "They are identical techniques",
            "They're trained via reinforcement learning to generate long internal reasoning traces, rather than eliciting reasoning purely through a prompt",
            "They never produce any reasoning at all",
            "They only work with few-shot examples",
          ],
          answer: 1,
          explain: "Reasoning models bake extended reasoning behavior into training itself, rather than relying on a prompt to elicit it.",
        },
        {
          q: "What does it mean for CoT reasoning to be \"unfaithful\"?",
          options: [
            "The reasoning text is always factually wrong",
            "The stated reasoning doesn't always reflect the actual computation that determined the final answer",
            "The model refuses to produce reasoning",
            "It means CoT never improves accuracy",
          ],
          answer: 1,
          explain: "A model's explanation can look plausible without being a true account of what actually drove its answer — a real limitation to keep in mind.",
        },
        {
          q: "Why isn't chain-of-thought \"free\" to use everywhere?",
          options: [
            "It requires a different model architecture",
            "It produces more output tokens, adding real latency and cost, which is wasted on trivial tasks that don't need multi-step reasoning",
            "It cannot be combined with few-shot prompting",
            "It disables tool calling",
          ],
          answer: 1,
          explain: "Longer reasoning traces cost real tokens and time — worthwhile for hard multi-step problems, often wasteful for simple ones.",
        },
      ],
    },
    {
      id: "p2-c4",
      n: 4,
      title: "Context Window Management",
      short: "One shared budget for instructions, history, and the answer itself",
      requires: ["p2-c3"],
      xp: 100,
      node: { x: 320, y: 660 },
      diagram: {
        type: "compare",
        query: "Same 2,000-token system prompt, sent on every request",
        left: {
          label: "No caching",
          stages: ["Reprocess system prompt", "Reprocess history", "Full cost every request"],
          outcome: { icon: "✕", text: "pays full compute cost on every single call", kind: "miss" },
        },
        right: {
          label: "Prompt / context caching",
          stages: ["Cached prefix reused", "Only new tokens processed", "Fraction of the cost"],
          outcome: { icon: "✓", text: "same answer, a fraction of the latency and cost", kind: "match" },
        },
      },
      diagram2: {
        type: "pipeline",
        stages: ["Growing conversation", "Sliding window / summarize older turns", "Recent turns kept verbatim", "Fits the shared token budget"],
      },
      hook: "<p>The context window is one shared budget — every system prompt token, every retrieved document, every turn of history spends from the same pool the model's answer has to fit inside too.</p>",
      explain: `<p>The context window is the total number of tokens a model can process in a single request, and it's <strong>shared</strong>: system instructions, conversation history, retrieved documents (Part III), few-shot examples, and the model's own output all draw from the same fixed budget. A commonly missed detail — filling the input close to the limit leaves little or no room for the output, silently truncating a response that needed more space to finish.</p>
      <p>Cost and latency both scale with context length (Part I, Chapter 7's KV-cache discussion) — longer contexts aren't just a quality risk, they're a real efficiency cost every single request pays. The <strong>"lost in the middle"</strong> effect, introduced in Part III, Chapter 6 for retrieved chunks, applies generally: information buried in the middle of any long context is used less reliably than information near the start or end, so structuring a long prompt with critical instructions first or last matters even outside RAG.</p>
      <p>Managing long, growing conversations has a few standard strategies. A <strong>sliding window</strong> simply drops the oldest turns once a limit is hit — simple, but permanently loses old information. Periodic <strong>summarization/compression</strong> condenses older turns into a shorter running summary, preserving the gist at a fraction of the token cost. <strong>Retrieval-augmented memory</strong> stores the full history externally, as in Part III, and retrieves only the turns relevant to the current query instead of keeping everything live. <strong>Hierarchical summaries</strong> combine these — recent turns kept verbatim, older turns summarized, very old turns summarized-of-summaries.</p>
      <p><strong>Prompt/context caching</strong> is a significant, frequently-missed optimization: many providers let you cache the computation for a repeated prefix — a long, unchanging system prompt or document — across multiple requests, so subsequent calls only pay the compute cost for the genuinely new part of the input.</p>`,
      analogy:
        "<p>The context window is a moving truck with a fixed volume. Every box loaded — history, documents, examples — is space that can't be used for the delivery itself. Pack thoughtlessly, and there's no room left for what actually needs to arrive.</p>",
      example:
        "<p>A customer support chatbot with a long, static system prompt (company policies, tone guidelines) resent on every single message wastes compute reprocessing that same prefix each time. Enabling prompt caching for that unchanging prefix cuts cost and latency substantially, since only the new user message needs fresh processing.</p>",
      math: [
        {
          expr: "N<sub>system</sub> + N<sub>history</sub> + N<sub>context</sub> + N<sub>output</sub> ≤ N<sub>max</sub>",
          note: "The shared token-budget constraint. Every category draws from the same fixed pool — a longer system prompt or more retrieved context directly shrinks how much room is left for <code>N_output</code>, the model's own response.",
        },
      ],
      takeaways: [
        "The context window is one shared budget across system prompt, history, retrieved content, and the model's own output — filling the input leaves less room for the response.",
        "Longer contexts cost more compute and latency on every single request, not just at some quality risk.",
        "\"Lost in the middle\" applies to any long context, not just RAG — place critical instructions near the start or end.",
        "Sliding windows, summarization/compression, and retrieval-augmented memory are the standard strategies for managing growing conversations.",
        "Prompt/context caching reuses computation for a repeated prefix across requests — a commonly missed but significant cost optimization.",
      ],
      quiz: [
        {
          q: "Why does filling the input close to the context limit risk truncating the response?",
          options: [
            "It doesn't — input and output have separate budgets",
            "The context window is a shared budget across input and output, so a large input leaves little room left for the response",
            "Output tokens are always unlimited",
            "It only affects retrieval, not generation",
          ],
          answer: 1,
          explain: "Input and output draw from the same fixed token budget — a commonly missed detail that causes silently cut-off responses.",
        },
        {
          q: "Does \"lost in the middle\" only apply to RAG-retrieved chunks?",
          options: [
            "Yes, it's exclusive to retrieved documents",
            "No — it applies to any long context, so critical instructions anywhere in a long prompt are best placed near the start or end",
            "No, it only applies to few-shot examples",
            "It only applies to system prompts",
          ],
          answer: 1,
          explain: "The effect is a general property of how LLMs attend across long contexts, not something specific to retrieval.",
        },
        {
          q: "What's the tradeoff of a simple sliding-window strategy for long conversations?",
          options: [
            "It has no downsides",
            "It's simple, but permanently loses information from turns that get dropped",
            "It increases the context window size",
            "It only works with structured output",
          ],
          answer: 1,
          explain: "Dropping the oldest turns is cheap and simple, but that history is genuinely gone rather than compressed and retained.",
        },
        {
          q: "What does prompt/context caching optimize?",
          options: [
            "It makes the model's weights permanently update",
            "It reuses the computation for a repeated, unchanging prefix across requests, so only new tokens need fresh processing",
            "It increases the maximum context window size",
            "It replaces the need for chunking",
          ],
          answer: 1,
          explain: "Caching avoids reprocessing an unchanging prefix (like a long system prompt) on every single request, cutting cost and latency.",
        },
        {
          q: "In N_system + N_history + N_context + N_output ≤ N_max, what happens if N_context (retrieved docs) grows large?",
          options: [
            "Nothing — N_max grows automatically",
            "It leaves less room for N_output within the same fixed budget",
            "It has no relationship to the other terms",
            "It only affects retrieval speed, not the budget",
          ],
          answer: 1,
          explain: "All four terms share one fixed ceiling — growing any one of them directly constrains what's left for the others.",
        },
      ],
    },
    {
      id: "p2-c5",
      n: 5,
      title: "Structured Output & Function/Tool Calling",
      short: "The mechanism that lets a model drive real code, not just prose",
      requires: ["p2-c1"],
      xp: 110,
      node: { x: 700, y: 300 },
      diagram: {
        type: "pipeline",
        stages: ["User request", "Model decides: call a tool?", "Structured call emitted", "App executes the function", "Result returned to model", "Model continues"],
      },
      diagram2: {
        type: "scene",
        question: "What's the weather in Tokyo right now?",
        stations: [
          { id: "llm", label: "LLM", glyph: "🧠", x: 20 },
          { id: "tool", label: "get_weather()", glyph: "🛠", x: 82, kind: "kb", holdsFile: true },
        ],
        start: "llm",
        answer: "✓ \"It's 18°C with light rain in Tokyo right now.\"",
        steps: [
          { to: "llm", think: true, say: "The model can't know live weather — its training data is frozen." },
          { to: "tool", say: "So it emits a structured call: get_weather(city=\"Tokyo\")." },
          { to: "tool", pickup: true, say: "The app runs the real function against a live weather API." },
          { to: "llm", say: "The result — 18°C, light rain — is carried back to the model." },
          { to: "llm", deliver: true, say: "Now it answers using real, current data instead of guessing." },
        ],
      },
      hook: "<p>An LLM that can only reply in free-form prose is hard to wire into real software. Structured output and tool calling are what let a model reliably drive code, instead of just producing text a human reads.</p>",
      explain: `<p>Free-form text output is fragile to parse programmatically — a downstream system expecting a number or a specific field can break on any unexpected phrasing. Structured output approaches fix this with increasing levels of guarantee. <strong>Prompted JSON</strong> (asking for JSON matching a described schema) is cheap but weak — the model can still deviate with extra commentary or a malformed field. <strong>Provider-level JSON mode</strong> guarantees syntactically valid JSON, but not necessarily that it matches your exact schema. <strong>Constrained / grammar-based decoding</strong> gives the strongest guarantee: the token-sampling step itself is restricted so only tokens consistent with a formal grammar or schema can ever be chosen, making invalid output structurally impossible rather than merely unlikely.</p>
      <p><strong>Function/tool calling</strong> extends structured output into action. The calling application provides the model with tool definitions — each a name, a natural-language description, and a parameter schema. Given a request, the model decides whether a tool is needed and, if so, emits a structured call (tool name plus arguments) instead of a plain-text answer. The application executes that function outside the model, and returns the result as a new turn, which the model reads and continues from — possibly calling another tool, or now answering using the real result.</p>
      <p>This loop is the direct mechanical bridge into agents (Part IV): an "agent," at its core, is exactly this loop run repeatedly — perceive, decide whether and which tool to call, act, observe the result, repeat.</p>
      <p>A few practices are easy to skip and costly to skip. Never blindly trust and execute a model's tool-call arguments without validation — a hallucinated or malformed argument (a wrong file path, an out-of-range parameter) executed directly against a real system is a reliability and security risk, not just a bug. Handle malformed or hallucinated tool calls gracefully rather than crashing. Keep tool descriptions specific and unambiguous, since vague descriptions cause the model to pick the wrong tool, or the right tool with wrong arguments. And be mindful of how many tools are exposed at once — giving a model dozens of similar tools measurably hurts its selection accuracy, which is why tool sets are often curated or dynamically filtered per request rather than dumped in wholesale.</p>`,
      analogy:
        "<p>Free-form output is a person mumbling an answer someone else has to transcribe by ear. Structured output is that same person filling out a form with clearly labeled fields — and tool calling hands them a labeled button for every action they're allowed to take, instead of hoping they describe the action correctly in words.</p>",
      example:
        '<p>Asked "what\'s the weather in Tokyo and should I bring an umbrella," a model with a <code>get_weather(city)</code> tool doesn\'t guess the forecast from training data — it emits a structured call <code>get_weather("Tokyo")</code>, the application executes the real API call, and the model\'s final answer is grounded in that real, current result instead of a plausible-sounding guess.</p>',
      math: [
        {
          expr: "P′(w) = P(w) ⁄ Σ<sub>v ∈ V<sub>valid</sub></sub> P(v) &nbsp; if w ∈ V<sub>valid</sub>, else 0",
          note: "Constrained decoding as a masked, renormalized version of the softmax from Part I. Any token that would violate the required grammar or schema at that position is zeroed out before sampling, then the remaining probabilities are renormalized — so an invalid token can never be produced in the first place, not just discouraged.",
        },
      ],
      takeaways: [
        "Free-form text output is fragile to parse; structured output approaches range from prompted JSON (weak guarantee) to constrained/grammar-based decoding (strongest guarantee).",
        "Function/tool calling lets a model emit a structured call that the application executes, feeding the real result back for the model to continue from.",
        "This perceive → decide → act → observe loop is the direct mechanical foundation of agents, covered next in Part IV.",
        "Never execute a model's tool-call arguments without validation — malformed or hallucinated arguments are a real reliability and security risk.",
        "Tool descriptions need to be specific, and exposing too many similar tools at once measurably hurts selection accuracy.",
      ],
      quiz: [
        {
          q: "Why is constrained/grammar-based decoding a stronger guarantee than prompting for JSON?",
          options: [
            "It's not stronger, just more expensive",
            "It restricts the token-sampling step itself, so an invalid token can never be produced, rather than just being discouraged",
            "It removes the need for a schema entirely",
            "It only works for numeric output",
          ],
          answer: 1,
          explain: "Prompted JSON can still be violated by the model; constrained decoding makes violation structurally impossible at the sampling level.",
        },
        {
          q: "What happens after a model emits a structured tool call?",
          options: [
            "The model executes the function itself internally",
            "The calling application executes the function outside the model and returns the result as a new turn for the model to continue from",
            "The conversation ends immediately",
            "The tool call is discarded",
          ],
          answer: 1,
          explain: "The model only decides what to call and with what arguments — actual execution happens in the surrounding application, not inside the model.",
        },
        {
          q: "Why is validating tool-call arguments before execution important?",
          options: [
            "It's not important if the model is large enough",
            "A hallucinated or malformed argument executed directly against a real system is a reliability and security risk",
            "Validation slows down every request unnecessarily",
            "Arguments are always guaranteed correct by JSON mode",
          ],
          answer: 1,
          explain: "Blindly trusting model-generated arguments against real systems (file paths, API parameters) can cause real damage if the model errs.",
        },
        {
          q: "What effect does exposing too many similar tools at once have on a model?",
          options: [
                "No effect — models handle unlimited tools equally well",
            "It measurably hurts tool-selection accuracy, which is why tool sets are often curated or filtered per request",
            "It always improves accuracy",
            "It disables structured output",
          ],
          answer: 1,
          explain: "More overlapping tool choices make correct selection harder, motivating curated or dynamically filtered tool sets in practice.",
        },
        {
          q: "How does tool calling relate to what Part IV covers next?",
          options: [
            "It's unrelated to agents",
            "The perceive → decide → act → observe loop behind tool calling is the direct mechanical foundation an agent repeats",
            "Tool calling replaces the need for agents entirely",
            "Agents never use tool calling",
          ],
          answer: 1,
          explain: "An agent is essentially this same loop — decide whether/which tool to call, act, observe the result — repeated over multiple steps.",
        },
      ],
    },
  ],
};

window.PARTS = window.PARTS || {};
window.PARTS[window.PART_DATA.id] = window.PART_DATA;
