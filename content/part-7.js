/* ============================================================
   Content data - Part VII: Current Frontier
   Single source of truth rendered by BOTH the gamified quest
   pages and the Simple-mode revise page.
   ============================================================ */

window.PART_DATA = {
  id: "part-7",
  index: 7,
  title: "Current Frontier",
  tagline: "Computer use, coding agents, the loop, and where this is all heading",
  color: "ion",
  mapViewBox: "0 0 1000 1200",
  edges: [
    ["p7-c1", "p7-c2"],
    ["p7-c2", "p7-c3"],
    ["p7-c2", "p7-c4"],
    ["p7-c3", "p7-c5"],
    ["p7-c4", "p7-c5"],
  ],
  badges: {
    first: { id: "p7-first", label: "First Signal from the Edge - completed your first Part VII chapter" },
    complete: { id: "p7-complete", label: "Frontier - cleared all of Part VII, and the whole map" },
  },
  chapters: [
    {
      id: "p7-c1",
      plain: "<p>Some tasks have no tidy API - the only way in is the same screen and buttons a human uses. These agents literally look at the screen and click, letting AI operate software that was never built for it.</p>",
      n: 1,
      title: "Computer-Use & Browser Agents",
      short: "When the only interface is the screen a human would use",
      requires: [],
      xp: 110,
      node: { x: 500, y: 90 },
      diagram: {
        type: "pipeline",
        stages: ["Screenshot captured", "Model identifies the target element", "Coordinate action emitted - click / type", "Screenshot re-captured to confirm"],
        loop: true,
      },
      diagram2: {
        type: "compare",
        query: "Book a flight on an airline site with no public API",
        left: {
          label: "Function calling only",
          stages: ["Look for a matching tool", "No API exists for this site", "Nothing to call"],
          outcome: { icon: "✕", text: "the task simply can't be done this way", kind: "miss" },
        },
        right: {
          label: "Computer-use agent",
          stages: ["Screenshot the page", "Click the departure field, type the city", "Click search, then click book"],
          outcome: { icon: "✓", text: "completes the booking the way a human would, no API needed", kind: "match" },
        },
      },
      hook: "<p>Part II's function calling assumes a tool exists to call. Some of the most useful software in the world has no API at all - only a screen a human is expected to look at and click through.</p>",
      explain: `<p><strong>Computer-use agents</strong> extend the tool-calling paradigm (Part II, Chapter 5) to the screen itself as the universal interface. Instead of calling a structured function, the agent perceives a screenshot and acts through the same low-level inputs a human would use: <code>click(x, y)</code>, <code>type(text)</code>, <code>scroll(direction)</code>. This matters for legacy systems, internal tools nobody built an API for, and the general case of "operate a computer the way a person would" - none of which function calling alone can reach.</p>
      <p>Perception happens one of two ways. <strong>Raw screenshot understanding</strong> has the model directly interpret a screen image, visually identifying where buttons and fields are - flexible, works on almost anything, but imprecise, since it's reading pixels the way a person glances at a page. <strong>Accessibility-tree-based</strong> perception instead reads the structured representation the operating system or browser already maintains for screen readers - far more precise about exactly what's clickable and where, but not always available or complete, especially on poorly-built interfaces.</p>
      <p>The action space is fundamentally lower-level than a typical tool call. Where <code>search(query)</code> is one logical action, achieving the same outcome through a screen might take five or six raw clicks and keystrokes - and any unexpected UI change along the way, a popup, a layout shift, a slow-loading element, can break the loop mid-sequence in a way a stable API response never would.</p>
      <p>This comes at real cost. Screenshots are large, so each step carries more tokens and latency than a typical tool call. The loop is fragile to interface changes in a way structured APIs aren't. And errors carry higher stakes than they might first appear - clicking the wrong button on a real interface has real consequences, the same concern Part VI's guardrails chapter raises for any agent action, now applied to a much less predictable action space.</p>`,
      analogy:
        "<p>Function calling is handing someone a labeled remote control with a button for every action. Computer use is handing them the actual TV and remote a stranger left behind, with no labels - they have to look at the screen, figure out what's clickable, and press the right spot, the same way any first-time user would.</p>",
      example:
        "<p>Booking a flight on an airline's website with no public API: a computer-use agent takes a screenshot, identifies the departure-city field visually or via the accessibility tree, clicks it, types the city, clicks the search button, reviews the results screen, and clicks to book - a sequence of low-level actions accomplishing what a single <code>search_flights()</code> tool call would have done instantly, if only that tool existed.</p>",
      takeaways: [
        "Computer-use agents perceive a screenshot and act through low-level inputs - click, type, scroll - extending tool use to interfaces with no API at all.",
        "Perception is either raw screenshot understanding (flexible, imprecise) or accessibility-tree-based (precise, not always available).",
        "One logical action can require several low-level steps, and any UI change mid-sequence can break the loop in a way a stable API response wouldn't.",
        "This comes at real cost: higher latency and token cost per action, fragility to interface changes, and higher-stakes errors on an unpredictable action space.",
      ],
      quiz: [
        {
          q: "Why do computer-use agents exist when function calling already covers tool use?",
          options: [
            "They don't add anything function calling can't already do",
            "They replace the need for any model reasoning",
            "Many useful systems (legacy software, internal tools, sites with no API) can only be operated through their screen, the way a human would use them",
            "Computer-use agents are strictly for entertainment purposes",
          ],
          answer: 2,
          explain: "Function calling requires an existing tool/API; computer use extends action to any interface with a screen, API or not.",
        },
        {
          q: "What is the tradeoff between raw screenshot understanding and accessibility-tree-based perception?",
          options: [
            "They are identical in every way",
            "Screenshot understanding is flexible but imprecise; accessibility-tree perception is precise but not always available or complete",
            "Accessibility trees are always faster to process",
            "Screenshots cannot be used by models at all",
          ],
          answer: 1,
          explain: "Each approach trades flexibility for precision differently, and neither works universally across every interface.",
        },
        {
          q: "Why can a single logical goal require many more steps for a computer-use agent than a function-calling agent?",
          options: [
            "Screenshots eliminate the need for any steps",
            "Computer-use agents are simply less capable",
            "Function calling always requires more steps",
            "A logical action like searching often requires several low-level clicks and keystrokes, rather than one structured tool call",
          ],
          answer: 3,
          explain: "Low-level actions (click, type, scroll) decompose what would be one API call into a multi-step sequence.",
        },
        {
          q: "Why are computer-use agents described as fragile to UI changes?",
          options: [
            "Fragility only affects accessibility-tree perception",
            "UI changes always improve computer-use reliability",
            "An unexpected popup, layout shift, or slow-loading element mid-sequence can break the loop, unlike a stable structured API response",
            "They are not actually fragile to this",
          ],
          answer: 2,
          explain: "Screens change in ways APIs don't - a computer-use loop has to contend with visual/structural drift that a stable API contract avoids.",
        },
        {
          q: "Why does this chapter connect computer-use errors to Part VI's guardrails discussion?",
          options: [
            "Real actions on a real interface (like clicking the wrong button) have real consequences, the same concern guardrails address for any agent action",
            "It doesn't - they're unrelated topics",
            "Guardrails only apply to function-calling agents",
            "Computer-use agents cannot make mistakes",
          ],
          answer: 0,
          explain: "The stakes-of-real-actions concern from Part VI applies directly here, on an even less predictable action space than typical tool calls.",
        },
      ],
    },
    {
      id: "p7-c2",
      plain: "<p>The model is the engine, but around it sits a 'harness' - the code that feeds it files, runs its commands, and loops it - and that scaffolding is what actually makes a coding agent work. A great engine still needs a car built around it.</p>",
      n: 2,
      title: "Coding Agent Architecture & The Harness",
      short: "The model is the engine. The harness is everything that makes it drive.",
      requires: ["p7-c1"],
      xp: 110,
      node: { x: 500, y: 280 },
      diagram: {
        type: "pipeline",
        stages: ["Model - the engine", "Harness: tool execution", "Harness: context assembly", "Harness: permission checks", "Loop continues or completes"],
      },
      diagram2: {
        type: "compare",
        query: "The same underlying model, wrapped in two different coding agents",
        left: {
          label: "Weak harness",
          stages: ["Poor context selection", "No permission checks", "No error recovery"],
          outcome: { icon: "✕", text: "gets stuck or makes unsafe changes despite a capable model", kind: "miss" },
        },
        right: {
          label: "Strong harness",
          stages: ["Precise context assembly", "Guardrails on risky actions", "Graceful retry on tool errors"],
          outcome: { icon: "✓", text: "reliably completes complex tasks - the harness made the difference", kind: "match" },
        },
      },
      hook: "<p>Two coding agents can use the exact same underlying model and produce wildly different results. The difference lives in a layer that rarely gets a name: the harness.</p>",
      explain: `<p>A <strong>harness</strong> is the surrounding application that runs an agent's loop around a model - it manages context assembly, executes tool calls, checks permissions, handles errors, and drives the loop's control flow itself. If the model is the engine, the harness is everything else that makes it actually drive: the transmission, the steering, the dashboard. Tools like Claude Code, Cursor, and similar coding assistants are, underneath, harnesses wrapped around a capable model plus a specific tool set - file read/write/edit, shell execution, code search, test running, often git operations - plus a carefully designed loop tying it together.</p>
      <p><strong>Harness engineering</strong> has emerged as its own discipline, distinct from training the underlying model. It's the work of deciding which tools to expose and how to describe them (Part II, Chapter 5), how to assemble context efficiently as a task grows (Part II, Chapter 4), how to recover from tool errors instead of derailing the loop, and when to pause for a permission check (Part VI, Chapter 4's human-in-the-loop patterns, applied here to code changes and shell commands). A well-built harness can make a mid-tier model outperform a frontier model wrapped in a weak one, because so much of real-world task success comes from this surrounding scaffolding, not the raw model call in isolation.</p>
      <p>For coding specifically, each exposed tool carries its own stakes and its own guardrails (Part VI, Chapter 1) - shell execution is a genuinely high-risk action, which is exactly why sandboxing (Part VI, Chapter 5) matters so much for this category of harness in particular. The harness is also where a form of retrieval happens that isn't quite RAG (Part III) and isn't quite memory (Part IV, Chapter 5): deciding which files, out of an entire codebase, are actually relevant to load into context for the current task, and compressing or dropping the rest as the task and conversation grow.</p>
      <p>This is worth naming explicitly because, as underlying models converge in raw capability, the differentiator between competing coding-agent products increasingly comes down to harness quality - tool design, context strategy, permission model - rather than which specific model sits underneath.</p>`,
      analogy:
        "<p>Two race teams can buy the identical engine from the same supplier. One builds a car around it with a tuned transmission, responsive steering, and a dashboard the driver can actually read at speed; the other bolts the same engine into a chassis with none of that. Same engine, very different lap times - the harness is the difference.</p>",
      example:
        "<p>Given the exact same underlying model, one coding agent's harness loads the three files actually relevant to a bug fix, checks the proposed change against the test suite, and asks for confirmation before running a destructive shell command. Another harness, wrapped around that identical model, dumps the entire repository into context, runs any shell command the model suggests without review, and gives up silently the first time a tool call errors. The model never changed - only the scaffolding around it did, and that's what determined whether the task actually got done safely.</p>",
      takeaways: [
        "A harness is the surrounding application that runs an agent's loop - context assembly, tool execution, permission checks, error handling - around a model.",
        "Coding agents like Claude Code and similar tools are, at their core, a capable model plus a specific tool set plus a well-designed harness.",
        "Harness engineering - tool design, context strategy, error recovery, permission checkpoints - is a distinct discipline from training the underlying model.",
        "A strong harness can make a mid-tier model outperform a frontier model wrapped in a weak one.",
        "As models converge in raw capability, harness quality increasingly becomes the actual differentiator between competing products.",
      ],
      quiz: [
        {
          q: "What is a \"harness\" in the context of an agent system?",
          options: [
            "Another name for the language model itself",
            "A type of guardrail specific to input filtering",
            "A synonym for a vector database",
            "The surrounding application that manages context assembly, tool execution, permission checks, and the loop's control flow around a model",
          ],
          answer: 3,
          explain: "The harness is everything around the model call - the scaffolding that turns raw model capability into a working system.",
        },
        {
          q: "Why can a strong harness make a mid-tier model outperform a frontier model in a weak harness?",
          options: [
            "Real-world task success depends heavily on context assembly, tool design, and error handling - all harness responsibilities, not the model call alone",
            "It can't - the model always determines the outcome regardless of harness quality",
            "Weak harnesses always use larger models to compensate",
            "Harnesses secretly retrain the model",
          ],
          answer: 0,
          explain: "So much of practical reliability comes from the surrounding scaffolding that harness quality can outweigh raw model capability.",
        },
        {
          q: "Why is shell execution specifically called out as a high-stakes tool in a coding harness?",
          options: [
            "Shell commands can have broad, potentially destructive effects on a real system, which is exactly why sandboxing and guardrails matter so much here",
            "Shell execution is never exposed to coding agents",
            "It isn't - shell commands are always safe",
            "It's no different in risk from a read-only file search",
          ],
          answer: 0,
          explain: "This connects directly to Part VI's guardrails and sandboxing chapters - shell access is one of the riskiest tools a harness can expose.",
        },
        {
          q: "What kind of decision does a coding harness make that isn't quite RAG and isn't quite long-term memory?",
          options: [
            "Choosing which embedding model to fine-tune",
            "Selecting the model's temperature setting",
            "Deciding which programming language to use",
            "Deciding which files in a codebase are relevant to load into context for the current task",
          ],
          answer: 3,
          explain: "This code-context-selection problem resembles retrieval and memory but is its own harness-specific concern over a live codebase.",
        },
        {
          q: "According to this chapter, what increasingly differentiates competing coding-agent products as models converge in capability?",
          options: [
            "The number of parameters in the model",
            "Harness quality - tool design, context strategy, and permission model - rather than the model itself",
            "The color scheme of the product's interface",
            "Which company trained the underlying model",
          ],
          answer: 1,
          explain: "As raw model capability becomes less of a differentiator, the surrounding harness engineering becomes the more consequential factor.",
        },
      ],
    },
    {
      id: "p7-c3",
      plain: "<p>As tasks get long, the hard part shifts from wording one prompt to managing what goes in the model's limited memory at each step - what to keep, summarize, or drop. Prompt engineering was writing a sentence; this is running a budget.</p>",
      n: 3,
      title: "Context Engineering",
      short: "Prompt engineering was writing a sentence. This is running a budget.",
      requires: ["p7-c2"],
      xp: 110,
      node: { x: 320, y: 480 },
      diagram: {
        type: "compare",
        query: "Agent is 40 steps into a long task and needs to decide its next action",
        left: {
          label: "Static, everything-upfront context",
          stages: ["All history kept verbatim", "All available docs pre-loaded", "No pruning as the task grows"],
          outcome: { icon: "✕", text: "context overflows, key info gets lost in the middle, cost balloons", kind: "miss" },
        },
        right: {
          label: "Engineered, per-step context",
          stages: ["Only relevant memory retrieved", "Older history compacted", "Tool defs limited to what's needed now"],
          outcome: { icon: "✓", text: "stays within budget, keeps the relevant info prominent, far fewer tokens", kind: "match" },
        },
      },
      diagram2: {
        type: "pipeline",
        stages: ["Current task state", "Retrieve relevant memory (Part IV)", "Retrieve relevant documents (Part III)", "Compact older history (Part II)", "Assemble this step's context"],
      },
      hook: "<p>A prompt is text you write once. Context, in a running agent, is rebuilt fresh at every single step - and deciding what belongs in it, out of everything that could, is genuinely an engineering problem, not a writing one.</p>",
      explain: `<p><strong>Context engineering</strong> is the practice of deliberately constructing everything that goes into a model's context window at a given step - not just instructions (prompt engineering, Part II, Chapter 1), but the dynamic combination of system instructions, relevant memory (Part IV, Chapter 5), retrieved documents (Part III), tool definitions (Part II, Chapter 5), and compressed conversation history (Part II, Chapter 4), assembled fresh, often differently, every single time the loop calls the model.</p>
      <p>"Prompt engineering" undersells what this actually is. A prompt is static text authored once. Context engineering is a per-step, programmatic decision: given a limited token budget (Part II, Chapter 4's shared budget constraint), what does the model actually need <em>right now</em> to make a good decision, out of everything that could theoretically be included?</p>
      <p>Four techniques carry most of the weight. <strong>Relevance filtering</strong> includes only memory or retrieved content actually pertinent to the current step - the entire point of retrieval (Part III), now applied at the granularity of a single step rather than once per task. <strong>Just-in-time retrieval</strong> fetches information exactly when it's needed, rather than front-loading everything at the start of a long task. <strong>Progressive disclosure</strong> starts with minimal context and lets the agent request more detail only if it turns out to be needed, rather than dumping everything upfront on the chance it might matter. And <strong>context compaction</strong> - summarizing or pruning older parts of a long-running loop's history - is what keeps a task from exceeding budget or burying critical information in the middle (Part II, Chapter 4's lost-in-the-middle problem, now a recurring operational concern rather than a one-time prompt-design choice).</p>
      <p>This has become its own named discipline because, as agents run longer (Part IV) and pull from more sources (tools, memory, retrieval, other agents in Part V), what to put in context at each step becomes as consequential a design decision as which model to use or which tools to expose. It is genuinely the practical, applied synthesis of Part II's context management, Part III's retrieval, and Part IV's memory - the discipline of deciding, at each step of a real running system, exactly what goes in the box.</p>`,
      analogy:
        "<p>Prompt engineering is packing a suitcase once, before a single trip. Context engineering is running airport logistics - deciding, continuously and for every flight, exactly what goes on which plane, what gets left in storage, and what gets picked up just before it's needed, because nothing has room to carry everything all the time.</p>",
      example:
        "<p>Forty steps into a long research task, an agent doesn't need the full text of every document it's touched so far - most of that would just crowd out what actually matters right now. An engineered context instead keeps a compact summary of earlier steps, retrieves only the specific passages relevant to the current sub-question, and leaves out tool definitions for capabilities that aren't relevant at this stage - the same task, running on a fraction of the tokens a naive \"keep everything\" approach would have needed by this point.</p>",
      takeaways: [
        "Context engineering is the per-step, programmatic construction of everything in a model's context - instructions, memory, retrieved documents, tool definitions, and compressed history - not a one-time prompt.",
        "Relevance filtering, just-in-time retrieval, progressive disclosure, and context compaction are the core techniques.",
        "This is the applied synthesis of Part II's context management, Part III's retrieval, and Part IV's memory, working together at every single step of a running system.",
        "As agents run longer and pull from more sources, what goes into context at each step becomes as consequential a decision as model or tool choice.",
      ],
      quiz: [
        {
          q: "How does context engineering differ from prompt engineering, as this chapter defines it?",
          options: [
            "Prompt engineering is a subset of model training",
            "Prompt engineering is static text written once; context engineering is a dynamic, per-step decision about what belongs in a limited context budget",
            "Context engineering only applies to RAG systems",
            "They are exactly the same thing with different names",
          ],
          answer: 1,
          explain: "The key distinction is static-and-authored versus dynamic-and-programmatic, rebuilt at every step of a running agent.",
        },
        {
          q: "What does \"just-in-time retrieval\" mean in context engineering?",
          options: [
            "Retrieving everything at the very start of a task, all at once",
            "Retrieval that only happens after the task is complete",
            "Fetching information exactly when it's needed during a task, rather than front-loading everything upfront",
            "A synonym for context compaction",
          ],
          answer: 2,
          explain: "Just-in-time retrieval avoids wasting budget on information that may never actually be needed for the task at hand.",
        },
        {
          q: "Why is context compaction described as a recurring operational concern rather than a one-time design choice?",
          options: [
            "Because compaction only applies to retrieved documents, never conversation history",
            "Because it only needs to happen once at the very end of a task",
            "Because compaction is unrelated to the lost-in-the-middle problem",
            "Because a long-running loop's history keeps growing at every step, so pruning/summarizing has to happen continuously to avoid exceeding budget or burying key info",
          ],
          answer: 3,
          explain: "Unlike a single upfront prompt, an agent's context keeps accumulating, so compaction has to be an ongoing operation, not a one-time step.",
        },
        {
          q: "Which three earlier parts of this book does context engineering synthesize in practice?",
          options: [
            "Part II's context management, Part III's retrieval, and Part IV's memory",
            "Part I's pretraining, Part V's orchestration, and Part VI's security",
            "Only Part II's prompting chapters",
            "Part VI's guardrails and Part VII's computer use",
          ],
          answer: 0,
          explain: "Context engineering is the applied, per-step combination of exactly these three prior disciplines, working together in a live system.",
        },
        {
          q: "Why has context engineering emerged as its own named discipline recently?",
          options: [
            "Because as agents run longer and pull from more sources, deciding what goes into context at each step became as consequential as model or tool choice",
            "Because it only matters for computer-use agents",
            "Because prompt engineering has been discontinued as a concept",
            "Because it requires no engineering effort at all",
          ],
          answer: 0,
          explain: "The complexity and stakes of this decision grew directly out of agents becoming longer-running and more multi-source, as covered across Parts III-V.",
        },
      ],
    },
    {
      id: "p7-c4",
      plain: "<p>Strip away the hype and a long-running agent is a simple loop: give the model tools, let it act, feed back the result, repeat - until the goal is met. The magic is less in any single step than in the loop holding together over many of them.</p>",
      n: 4,
      title: "Long-Horizon Autonomy & The Loop",
      short: "Strip away the mystique: it's a while loop with a model and some tools",
      requires: ["p7-c2"],
      xp: 120,
      node: { x: 680, y: 480 },
      diagram: {
        type: "pipeline",
        stages: ["Assemble context", "Call the model", "Execute the decision", "Observe the result", "Checkpoint state"],
        loop: true,
      },
      diagram2: {
        type: "bars",
        label: "Per-step reliability compounds over a long-running loop",
        noSample: true,
        bars: [
          { label: "10 steps @ 99%", value: 90 },
          { label: "50 steps @ 99%", value: 61 },
          { label: "200 steps @ 99%", value: 13 },
        ],
      },
      hook: "<p>Strip away every framework and every product name, and an agent is fundamentally this: assemble context, call the model, execute what it decides, feed the result back, repeat. Practitioners increasingly just call this \"the loop.\" Long-horizon autonomy is what happens when you let that loop run for hours instead of a few steps.</p>",
      explain: `<p><strong>The loop</strong> - Part IV, Chapter 1's perceive-reason-act-observe cycle, now the field's own shorthand for the atomic unit of agency - is genuinely all an agent is, mechanically: a while loop with a model and some tools. Everything else in this book is detail on top of that loop: which tools, what context, how much autonomy, how many agents. Long-horizon autonomy is simply what happens when that loop keeps running for a very long time - hours or days rather than a handful of steps.</p>
      <p>Three things change as loops get longer. <strong>Context budget</strong> (Part II, Chapter 4) stops being a background concern and becomes a hard constraint over hundreds of steps. <strong>Errors compound</strong>: a 99%-reliable-per-step agent doesn't stay 99% reliable over a long task - reliability multiplies across steps, so <code>R(n) = p^n</code> drops fast as n grows, which is exactly why long-horizon tasks need the self-correction (Reflexion, Part IV, Chapter 3) and guardrails (Part VI, Chapter 1) far more urgently than short ones do. And the <strong>goal itself can drift</strong> mid-task as circumstances change, which is exactly what the replanning discussed in Part IV, Chapter 4 exists to handle.</p>
      <p><strong>Checkpointing</strong> is what makes long-horizon loops survivable: periodically saving the loop's state - what's been done, what's left, key decisions made - so it can be paused, resumed, or recovered after a failure, instead of restarting a multi-hour task from scratch after one dropped connection. This barely matters for a five-step task and matters enormously for a five-hour one.</p>
      <p>Rather than one loop doing everything, a long-horizon agent often <strong>spawns sub-agent loops</strong> for well-defined chunks of the larger task - directly connecting to Part V's orchestration patterns. This keeps each individual loop's own context manageable even as the overall task's scope grows far beyond what any single context window could hold. Alongside this, <strong>compaction</strong> - periodically compressing accumulated history into a compact summary (Part II, Chapter 4) - moves from being an optional optimization to an essential operation: it's the difference between a loop that can run for days and one that grinds to a halt under the weight of its own accumulated context.</p>`,
      analogy:
        "<p>A short errand doesn't need a written plan, a check-in schedule, or a backup driver - you just go do it. A cross-country road trip absolutely needs checkpoints, a way to recover if a leg goes wrong, and probably more than one driver taking different stretches. Long-horizon autonomy is the same loop as a five-minute task, just run under conditions that make every one of these previously-optional concerns mandatory.</p>",
      example:
        "<p>A long-horizon coding agent working on a multi-day refactor checkpoints its progress after each completed module, so a dropped connection overnight costs minutes of recovery instead of days of lost work. It spawns a focused sub-agent loop to handle each independent module rather than holding the entire codebase's context in one continuously-growing loop, and periodically compacts its own history of completed steps into a short running summary - without which, by day three, its context would be more historical transcript than usable working memory.</p>",
      math: [
        {
          expr: "R(n) = p<sup>n</sup>",
          note: "Per-step reliability <code>p</code> compounds multiplicatively across <code>n</code> sequential steps. Even at a 99% per-step success rate, reliability over 200 uninterrupted steps drops to roughly 13% (0.99²⁰⁰ ≈ 0.134) - the mathematical reason long-horizon loops need far more aggressive self-correction and checkpointing than short ones.",
        },
      ],
      takeaways: [
        "\"The loop\" - assemble context, call the model, act, observe, repeat - is the field's own shorthand for the atomic unit of agency; everything else is detail built on top of it.",
        "Long-horizon autonomy is that same loop run for hours or days, which turns context budget, compounding errors, and goal drift from background concerns into hard constraints.",
        "R(n) = pⁿ: per-step reliability compounds multiplicatively, so even a 99%-reliable step drops to roughly 13% success over 200 steps without correction.",
        "Checkpointing lets a long-running loop pause, resume, or recover instead of restarting a multi-hour task from scratch after one failure.",
        "Sub-agent spawning (Part V) and context compaction (Part II) turn from optional optimizations into essential operations at long horizons.",
      ],
      quiz: [
        {
          q: "What does it mean when practitioners refer to an agent as simply \"the loop\"?",
          options: [
            "It's a dismissive term meaning agents don't really work",
            "It's a specific product name",
            "It's shorthand for the fundamental mechanism - assemble context, call the model, act, observe, repeat - that everything else in agent design builds on top of",
            "It refers only to multi-agent orchestration",
          ],
          answer: 2,
          explain: "Stripping away frameworks and products, this cycle is what an agent mechanically is - the field's shorthand reflects that simplicity.",
        },
        {
          q: "In R(n) = pⁿ, what does this formula explain about long-horizon agents?",
          options: [
            "That n represents the number of tools available",
            "That per-step reliability compounds multiplicatively, so even a highly reliable single step leads to much lower overall success over many sequential steps",
            "That reliability increases the longer a loop runs",
            "That p is fixed and cannot be improved",
          ],
          answer: 1,
          explain: "This is why long-horizon tasks need self-correction and checkpointing far more urgently than short tasks - the compounding math is unforgiving.",
        },
        {
          q: "Why does checkpointing matter far more for a five-hour task than a five-step one?",
          options: [
            "Checkpointing replaces the need for context engineering",
            "Checkpointing only applies to multi-agent systems",
            "It doesn't actually matter more for longer tasks",
            "Without it, a failure partway through a long task means restarting from scratch, which costs far more than for a short task"
          ],
          answer: 3,
          explain: "The cost of restarting from zero scales with how much work would be lost - trivial for a short task, severe for a long one.",
        },
        {
          q: "Why might a long-horizon agent spawn sub-agent loops rather than handling everything in one continuous loop?",
          options: [
            "It has no relationship to context management",
            "To make the system slower on purpose",
            "Sub-agents are required by law for long tasks",
            "To keep each individual loop's context manageable, since a single loop's context can't hold an entire large task's full scope indefinitely",
          ],
          answer: 3,
          explain: "This directly connects to Part V's orchestration patterns - splitting a large task across loops keeps each one's context within budget.",
        },
        {
          q: "Why does context compaction shift from optional to essential at long horizons?",
          options: [
            "Accumulated history in a long-running loop will eventually exceed budget or bury critical information unless it's periodically compressed",
            "Compaction replaces the need for checkpointing entirely",
            "It doesn't change in importance regardless of loop length",
            "Compaction is only relevant for computer-use agents"
          ],
          answer: 0,
          explain: "A short task's history never grows large enough to matter; a long-running loop's does, making compaction load-bearing rather than a nice-to-have.",
        },
      ],
    },
    {
      id: "p7-c5",
      plain: "<p>The basics are settled; the open questions - staying reliable over long tasks, better memory, real trust - are where the field is actively pushing. This chapter maps what's solid, what's shaky, and where the interesting work is now.</p>",
      n: 5,
      title: "Where the Field Is Heading",
      short: "The fundamentals are settled. The frontier isn't - that's where the work is.",
      requires: ["p7-c3", "p7-c4"],
      xp: 130,
      node: { x: 500, y: 680 },
      diagram: {
        type: "pipeline",
        stages: ["Part I: predict the next token", "Parts II–III: reason with context & retrieval", "Parts IV–V: act, loop, and coordinate", "Parts VI–VII: survive contact with reality"],
      },
      diagram2: {
        type: "radar",
        label: "How settled is each open problem, today (higher = more solved)",
        axes: [
          { label: "Long-horizon reliability", value: 45 },
          { label: "Agent evaluation", value: 50 },
          { label: "Cost at scale", value: 58 },
          { label: "Autonomy / safety balance", value: 48 },
          { label: "Standardized tooling", value: 62 },
        ],
      },
      hook: "<p>This book's arc runs from predicting the next token to systems that read, retrieve, reason, act, coordinate, and now run for hours largely unsupervised. Every layer on that path is a genuine engineering discipline built on the one below it - not magic stacked on magic. This closing chapter is honest about which parts of that stack are settled, and which are still actively being figured out.</p>",
      explain: `<p>Several problems remain genuinely open, not solved, as of today. <strong>Reliability at long horizons</strong> - Chapter 4's compounding-error problem - is still an active research area; checkpointing and self-correction help, but they manage the problem rather than eliminate it. <strong>Evaluating open-ended agentic tasks</strong> is still unresolved in the way Part I, Chapter 8 and Part VI, Chapter 1 both flagged: no single number captures agent quality, and building evaluation that actually predicts real-world reliability remains hard. <strong>Cost at scale</strong> keeps every optimization from Part VI, Chapter 3 necessary rather than optional - this genuinely remains expensive, and that constraint shapes what's practical to build today. And the <strong>autonomy/safety tension</strong> from Part VI, Chapters 4 and 5 keeps moving rather than settling: more autonomy is more useful and more risky at the same time, and exactly where to draw that line shifts as capability improves.</p>
      <p>The vocabulary itself is still settling, which is a signal worth noticing on its own. Terms like <strong>context engineering</strong>, <strong>harness</strong>, and <strong>the loop</strong> - this Part's own Chapters 2 through 4 - are relatively recent additions to how practitioners describe this work, evidence that the practice is still being actively named and formalized rather than sitting in a mature, settled discipline with fixed terminology. The specific words matter less than what they're pointing at: the underlying concepts are genuinely load-bearing, and likely to persist even as the exact terms used to describe them keep shifting.</p>
      <p>What tends to hold up regardless of which specific tools or frameworks eventually win out: the fundamentals from Part I don't change underneath any of this. Good context engineering matters no matter which framework happens to assemble it. Guardrails and human oversight (Part VI) remain necessary as capability increases, not less necessary. And the core loop - perceive, reason, act, observe - is likely to remain the atomic unit of "agent," even as everything built around it keeps changing shape.</p>
      <p>This is also a fair description of where this book itself sits: the fundamentals in Parts I through III are considerably more settled than the frontier covered in this Part, and that gap between settled and unsettled is exactly where the most active work in the field is happening right now.</p>`,
      analogy:
        "<p>Early aviation had settled physics (Part I's equivalent: lift, thrust, drag were understood) long before it had settled practice (Part VII's equivalent: cockpit layout, air traffic control, safety procedure were all still being figured out through real, sometimes costly trial and error). Knowing the physics didn't make the practice obvious - and knowing the fundamentals of language models doesn't make agentic system design obvious either. Both had to be built, deliberately, on top of settled ground.</p>",
      example:
        "<p>A team shipping a long-horizon coding agent today combines settled fundamentals (transformers, Part I; retrieval, Part III) with genuinely unsettled frontier practice (how much autonomy to grant, how to checkpoint a multi-hour task, what \"harness\" architecture to use) - and next year, some of what counts as best practice in this Part will likely have shifted, even while the fundamentals from the book's first three Parts remain exactly as true as they are today.</p>",
      takeaways: [
        "Long-horizon reliability, agent evaluation, cost at scale, and the autonomy/safety balance are genuinely open problems today, not solved ones.",
        "The vocabulary - context engineering, harness, the loop - is still actively settling, a sign the practice itself is still being formalized.",
        "What holds up regardless of which tools win out: Part I's fundamentals, the necessity of good context engineering, ongoing guardrails and human oversight, and the loop itself as agency's atomic unit.",
        "This book's own structure mirrors the field: Parts I–III are considerably more settled than Part VII's frontier - and that gap is where the active work is.",
      ],
      quiz: [
        {
          q: "Which of these does this chapter describe as a genuinely open problem today, not a solved one?",
          options: [
            "Tokenization",
            "Long-horizon reliability, agent evaluation, cost at scale, and the autonomy/safety balance",
            "The chain rule of probability",
            "The transformer's attention formula",
          ],
          answer: 1,
          explain: "These four are explicitly named as unresolved frontiers, in contrast to the settled fundamentals from earlier Parts.",
        },
        {
          q: "Why does the chapter treat the unsettled vocabulary (context engineering, harness, the loop) as meaningful, not just a naming detail?",
          options: [
            "Because actively-settling terminology is a signal that the underlying practice itself is still being formalized, not a mature discipline yet",
            "Because these terms are expected to be abandoned entirely soon",
            "Because the exact words will definitely become permanent and official",
            "Because vocabulary has no relationship to how settled a field is",
          ],
          answer: 0,
          explain: "The chapter's point is about what the shifting vocabulary reveals about the field's maturity, not about the permanence of specific words.",
        },
        {
          q: "According to this chapter, what is likely to persist even as specific tools and frameworks change?",
          options: [
            "Nothing - everything in this book is expected to become obsolete",
            "Only the vocabulary terms introduced in this Part",
            "Only the specific frameworks named in Part V",
            "Part I's fundamentals, the need for good context engineering, ongoing guardrails/human oversight, and the loop as the atomic unit of agency",
          ],
          answer: 3,
          explain: "These are framed as the load-bearing concepts likely to outlast whichever specific products or terms are popular at any given moment.",
        },
        {
          q: "How does this chapter describe the relationship between this book's Parts I–III and Part VII?",
          options: [
            "Parts I–III are considerably more settled than Part VII's frontier, and that gap is where the most active work in the field is happening",
            "They are equally settled and equally certain",
            "There is no meaningful difference in how settled each Part is",
            "Part VII is more settled than Parts I–III",
          ],
          answer: 0,
          explain: "The book's own structure is used as an honest mirror of the field's actual state - foundations solid, frontier still being worked out.",
        },
        {
          q: "What is the chapter's core argument about why the autonomy/safety tension (Part VI) 'keeps moving' rather than settling?",
          options: [
            "Because safety concerns are overblown and will be dismissed",
            "Because autonomy and safety are unrelated concerns",
            "Because this tension was fully resolved in Part VI",
            "Because more autonomy is simultaneously more useful and more risky, and where to draw that line shifts as capability improves",
          ],
          answer: 3,
          explain: "As capability increases, the calculus behind how much autonomy is appropriate keeps shifting rather than arriving at a fixed, final answer.",
        },
      ],
    },
  ],
};

window.PARTS = window.PARTS || {};
window.PARTS[window.PART_DATA.id] = window.PART_DATA;
