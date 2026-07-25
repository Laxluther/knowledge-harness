/* ============================================================
   Content data — Part IV: Tool Use & Single Agents
   Single source of truth rendered by BOTH the gamified quest
   pages and the Simple-mode revise page.
   ============================================================ */

window.PART_DATA = {
  id: "part-4",
  index: 4,
  title: "Tool Use & Single Agents",
  tagline: "From answering once to looping until the task is actually done",
  color: "ion",
  mapViewBox: "0 0 1000 1200",
  edges: [
    ["p4-c1", "p4-c2"],
    ["p4-c2", "p4-c3"],
    ["p4-c2", "p4-c4"],
    ["p4-c3", "p4-c5"],
    ["p4-c4", "p4-c5"],
  ],
  badges: {
    first: { id: "p4-first", label: "First Action — completed your first agent chapter" },
    complete: { id: "p4-complete", label: "Autonomous — cleared all of Part IV" },
  },
  chapters: [
    {
      id: "p4-c1",
      n: 1,
      title: "What Makes Something an \"Agent\"",
      short: "A loop, not a single hop",
      requires: [],
      xp: 90,
      node: { x: 500, y: 90 },
      diagram: {
        type: "compare",
        query: "Find the cheapest flight to Tokyo next month and email me the confirmation",
        left: {
          label: "Single LLM call",
          stages: ["One prompt, one response", "No way to check real prices", "No way to actually send email"],
          outcome: { icon: "✕", text: "produces a plausible-sounding answer but takes no real action", kind: "miss" },
        },
        right: {
          label: "Agent loop",
          stages: ["Searches flights (tool call)", "Compares results, picks cheapest", "Sends confirmation (tool call)"],
          outcome: { icon: "✓", text: "actually completes the multi-step task", kind: "match" },
        },
      },
      diagram2: {
        type: "scene",
        question: "Find the cheapest flight to Tokyo next month and email me the confirmation",
        stations: [
          { id: "agent", label: "Agent", glyph: "🤖", x: 14 },
          { id: "flights", label: "search_flights()", glyph: "✈", x: 52, kind: "kb", holdsFile: true },
          { id: "email", label: "send_email()", glyph: "✉", x: 88, kind: "kb" },
        ],
        start: "agent",
        answer: "✓ Cheapest flight found and confirmation emailed — a task completed, not just described.",
        steps: [
          { to: "agent", think: true, say: "A single answer can't book anything. An agent runs a loop of real actions." },
          { to: "flights", say: "First it calls search_flights() — real prices, not a guess." },
          { to: "flights", pickup: true, say: "Gets back live results and picks the cheapest." },
          { to: "email", say: "Carries that result straight into the next action." },
          { to: "email", deliver: true, say: "Calls send_email() with the confirmation — the multi-step task is actually done." },
        ],
      },
      hook: "<p>Calling a single API to a language model is not an agent — even if the response is clever. An agent is a loop, not a single hop.</p>",
      explain: `<p>An LLM <strong>agent</strong> is a system where a language model doesn't just answer once, but runs in a loop: perceive the current state (a task, an observation, a tool result), reason about what to do next, take an action — often calling a tool (Part II, Chapter 5) — observe the result, and repeat until the task is done or a stopping condition is reached. The defining property is that the number and nature of steps aren't fixed in advance: the model itself decides, at each iteration, what happens next, based on what it's learned so far in the loop.</p>
      <p>Contrast this with what <em>isn't</em> an agent. A single prompt-response call, however sophisticated the prompt, is not an agent — there's no loop, no ability to observe an outcome and adjust. A fixed pipeline, like naive RAG's retrieve-then-generate sequence (Part III, Chapter 2), isn't an agent either, even with multiple steps, because the sequence is hardcoded by the developer, not decided by the model at runtime. The defining line: does the model exercise judgment about what to do next, based on the outcome of what it just did?</p>
      <p>Autonomy is a spectrum, not a binary. A chatbot that can call one tool and stop is a very simple agent; a system that chains a dozen tool calls, replans on failure, and runs for many minutes is a highly autonomous one. How many decisions are delegated to the model versus fixed by the developer is a deliberate design choice with real tradeoffs — more autonomy means more capability, but less predictability and harder-to-bound cost and risk.</p>
      <p>This also separates <strong>agents</strong> from <strong>workflows</strong>. A workflow defines control flow explicitly — step A always leads to step B — using the LLM only inside individual steps. An agent puts the LLM in charge of the control flow itself. Many production systems are actually hybrids: a deterministic workflow skeleton with agentic sub-loops for specific hard-to-predict subtasks — "fully autonomous agent" is one end of a spectrum, not the only valid design.</p>`,
      analogy:
        "<p>A single LLM call is answering a trivia question. A fixed pipeline is a factory assembly line — the same sequence every time. An agent is a chef improvising a dish: tasting as they go, adjusting based on what they just tasted, deciding whether the next move is \"add salt\" or \"it's done\" — the decisions themselves emerge from observing the outcome of previous ones.</p>",
      example:
        "<p>Asked to find the cheapest flight to Tokyo next month and email a confirmation, a single LLM call can only produce a plausible-sounding but fabricated answer — it has no way to check real prices or send an email. An agent instead calls a flight-search tool, reasons over the real results to pick the cheapest, calls an email tool with the confirmation, and only then reports back — genuinely completing the task instead of describing what completing it might look like.</p>",
      takeaways: [
        "An agent is defined by a loop — perceive, reason, act, observe, repeat — where the model itself decides what happens next at each step.",
        "A single LLM call or a fixed pipeline with hardcoded step sequencing is not an agent, even with multiple steps or sophisticated prompting.",
        "Autonomy is a spectrum: how many decisions are delegated to the model vs. fixed by the developer is a deliberate, consequential design choice.",
        "Many real systems are hybrids — a deterministic workflow skeleton with agentic sub-loops for specific subtasks, not one extreme or the other.",
      ],
      quiz: [
        {
          q: "What is the defining property of an agent, as this chapter uses the term?",
          options: [
            "It always uses more than one tool",
            "The model itself decides what happens next at each step, based on the outcome of the previous step, in a repeating loop",
            "It always runs for a fixed number of steps",
            "It never makes mistakes",
          ],
          answer: 1,
          explain: "The loop plus model-driven decision-making at each iteration is what distinguishes an agent from a single call or a fixed pipeline.",
        },
        {
          q: "Why isn't naive RAG's retrieve-then-generate sequence considered an agent?",
          options: [
            "Because it doesn't use an LLM at all",
            "Because the sequence of steps is hardcoded by the developer, not decided by the model at runtime",
            "Because it only has one step",
            "Because it never retrieves real data",
          ],
          answer: 1,
          explain: "Having multiple steps isn't enough — an agent requires the model to decide the control flow, not just execute a fixed sequence.",
        },
        {
          q: "What does it mean that \"autonomy is a spectrum\"?",
          options: [
            "All agents have identical autonomy",
            "How many decisions are delegated to the model vs. fixed by the developer is a deliberate design choice with real tradeoffs",
            "Autonomy only applies to multi-agent systems",
            "More autonomy always means better results",
          ],
          answer: 1,
          explain: "More delegated autonomy increases capability but reduces predictability and makes cost/risk harder to bound — a real tradeoff, not a free upgrade.",
        },
        {
          q: "How does a \"workflow\" differ from an \"agent\" as defined in this chapter?",
          options: [
            "A workflow never uses an LLM",
            "A workflow's control flow is explicitly defined by the developer; an agent's control flow is decided by the model itself",
            "There is no meaningful difference",
            "A workflow always runs slower than an agent",
          ],
          answer: 1,
          explain: "The key distinction is who decides what happens next — fixed developer logic (workflow) versus the model's own judgment (agent).",
        },
        {
          q: "Why are many production systems described as \"hybrids\"?",
          options: [
            "Because pure agents are illegal to deploy",
            "Because they combine a deterministic workflow skeleton with agentic sub-loops for specific hard-to-predict subtasks",
            "Because hybrids never use tools",
            "Because hybrids don't require any LLM",
          ],
          answer: 1,
          explain: "Combining predictable workflow structure with agentic flexibility where it's actually needed is a common, pragmatic middle ground.",
        },
      ],
    },
    {
      id: "p4-c2",
      n: 2,
      title: "ReAct — Interleaving Reasoning and Action",
      short: "Think, act, observe, think again",
      requires: ["p4-c1"],
      xp: 100,
      node: { x: 500, y: 280 },
      diagram: {
        type: "pipeline",
        stages: ["Thought: reason about the situation", "Action: call a tool", "Observation: read the real result"],
        loop: true,
      },
      hook: "<p>Chain-of-thought taught a model to think before answering. ReAct teaches it to think, act, look at what actually happened, and think again — reasoning and acting interleaved in the same loop.</p>",
      explain: `<p><strong>ReAct</strong> (Reason + Act, Yao et al. 2022) directly combines two ideas already covered: chain-of-thought reasoning (Part II, Chapter 3) and tool/function calling (Part II, Chapter 5). Instead of reasoning all the way to a final answer in one pass, or acting without any stated reasoning, ReAct interleaves them explicitly: <strong>Thought</strong> (reason about the situation and decide what to do), <strong>Action</strong> (call a tool), <strong>Observation</strong> (read the real result) — then back to Thought, repeating until the task resolves.</p>
      <p>Why interleaving specifically helps: pure reasoning-only (CoT alone) can't incorporate new information from the outside world mid-way — it reasons entirely from what's already in context. Pure acting-only, calling tools with no stated reasoning, makes the model's decisions opaque and hard to correct when they go wrong. Interleaving lets each action be informed by explicit reasoning about the latest observation, closing the loop between "what I think is true" and "what's actually true right now."</p>
      <p>The explicit Thought step also serves as a debugging and steering surface: because the model states its reasoning before acting, a developer — or the agent itself, in Reflexion, next chapter — can inspect <em>why</em> a particular action was taken, not just what the action was. A typical trace reads naturally: "Thought: I need to find X. Action: search(X). Observation: [result]. Thought: that didn't have what I needed, let me refine the search. Action: search(X, refined). Observation: [better result]. Thought: I now have enough to answer."</p>
      <p>One limitation worth naming: each Thought/Action/Observation cycle costs tokens and latency, echoing Part II Chapter 3's point that CoT isn't free — and a poorly-grounded Thought step can still send the loop down an unproductive path. ReAct makes reasoning visible and revisable, but it doesn't guarantee that reasoning is correct.</p>`,
      analogy:
        "<p>Debugging a program by reading the print statements the programmer left in, versus a black box that only shows the final output. ReAct's explicit Thought steps are those print statements, showing not just what the agent did but why, at each step of a live process.</p>",
      example:
        "<p>Asked to find a restaurant's current hours, a ReAct agent reasons (\"I should search for this\"), acts (calls a search tool), observes real search results, reasons again (\"this result looks like an old cached page, I should check the restaurant's own site instead\"), acts with a refined query, and only then answers — each decision genuinely shaped by what the previous action actually returned, not planned blindly in advance.</p>",
      takeaways: [
        "ReAct interleaves explicit reasoning (Thought) with tool calls (Action) and their real results (Observation) in a repeating cycle.",
        "This directly combines chain-of-thought (Part II, Ch.3) with tool calling (Part II, Ch.5) rather than using either alone.",
        "Interleaving lets reasoning be grounded in fresh, real information instead of only the model's initial assumptions.",
        "The explicit Thought step makes an agent's decisions inspectable and correctable, not just its final output.",
        "Each cycle costs tokens and latency, and a poorly-grounded Thought can still misdirect the loop — visibility isn't the same as correctness.",
      ],
      quiz: [
        {
          q: "What three steps does the ReAct loop interleave?",
          options: [
            "Retrieve, Rank, Generate",
            "Thought (reason), Action (call a tool), Observation (read the real result)",
            "Plan, Execute, Replan",
            "Chunk, Embed, Index",
          ],
          answer: 1,
          explain: "ReAct's name comes from interleaving Reasoning and Acting, made concrete as the Thought / Action / Observation cycle.",
        },
        {
          q: "Why can't pure chain-of-thought (without acting) incorporate new outside information mid-task?",
          options: [
            "CoT is too slow",
            "It reasons entirely from what's already in context, with no mechanism to fetch new information partway through",
            "CoT cannot be used with tool calling ever",
            "CoT only works on math problems",
          ],
          answer: 1,
          explain: "Without an action/observation step, there's no way for new real-world information to enter the reasoning process mid-stream.",
        },
        {
          q: "What benefit does the explicit \"Thought\" step provide beyond the action itself?",
          options: [
            "It makes the agent run faster",
            "It makes the agent's decisions inspectable — showing why an action was taken, not just what the action was",
            "It removes the need for tool calling",
            "It guarantees the reasoning is correct",
          ],
          answer: 1,
          explain: "Stated reasoning is a debugging and steering surface, even though it doesn't guarantee the reasoning itself is correct.",
        },
        {
          q: "What real cost does each Thought/Action/Observation cycle carry?",
          options: [
            "None — ReAct is free to run indefinitely",
            "Tokens and latency, the same way chain-of-thought reasoning isn't free (Part II, Ch.3)",
            "Only monetary cost, never latency",
            "It costs GPU memory but no tokens",
          ],
          answer: 1,
          explain: "Every additional reasoning-action cycle adds real token and time cost, which matters for longer-running agent tasks.",
        },
        {
          q: "Does making reasoning visible (via the Thought step) guarantee that reasoning is correct?",
          options: [
            "Yes, visible reasoning is always correct reasoning",
            "No — a poorly-grounded Thought can still misdirect the loop even though it's visible and inspectable",
            "Yes, because Thoughts are always double-checked automatically",
            "The question doesn't apply to ReAct",
          ],
          answer: 1,
          explain: "Visibility helps with debugging and correction, but it's a separate property from actually being correct.",
        },
      ],
    },
    {
      id: "p4-c3",
      n: 3,
      title: "Reflexion & Self-Correction",
      short: "Learning from a mistake without touching a single weight",
      requires: ["p4-c2"],
      xp: 100,
      node: { x: 320, y: 480 },
      diagram: {
        type: "reward",
        prompt: "Write a function that correctly handles every list-length edge case",
        a: { text: "Attempt 1 — no reflection. Fails on the empty-list case, unnoticed.", score: 30 },
        b: { text: "Attempt 4 — after reflecting on the specific failing edge case each time.", score: 88 },
        steps: [30, 45, 62, 74, 88],
      },
      diagram2: {
        type: "crew",
        task: "Write a function that correctly handles every list-length edge case",
        nodes: [
          { id: "llm", label: "Agent", role: "captain", tier: 0 },
          { id: "tester", label: "test_suite()", role: "board", tier: 1 },
        ],
        flow: [
          { from: "llm", to: "tester" },
          { from: "tester", to: "llm" },
        ],
        statusSteps: [
          "Submits an attempt — fails the empty-list edge case",
          "Reads the failure, writes itself a reflection note",
          "Retries with that reflection in context",
          "Passes — no weights updated, just a smarter next try",
        ],
      },
      hook: "<p>What if an agent could look at its own failed attempt, write itself a note about what went wrong, and actually do better on the next try — all without anyone updating a single weight?</p>",
      explain: `<p><strong>Reflexion</strong> (Shinn et al., 2023) adds a self-critique step on top of the ReAct loop: after an attempt — a failed action, or a full episode — the agent generates a verbal reflection, a natural-language critique of what went wrong and what to try differently, and that reflection is stored and included as context on the <em>next</em> attempt, steering future behavior.</p>
      <p>This is sometimes called <strong>"verbal reinforcement learning."</strong> Instead of a numeric reward signal updating model weights, as in RLHF (Part I, Chapter 6), the learning signal here is a piece of text the model itself writes, and the "update" is simply that text being added to context for the next try. Behavior demonstrably improves across attempts, with no gradient step at all.</p>
      <p>This contrasts directly with Part I's alignment chapter: RLHF changes weights permanently, based on human or AI preference signals, applied once during training. Reflexion changes behavior temporarily and cheaply, based on the agent's own self-assessment, applied fresh within a single task episode — closer to a person jotting a note to themselves after a mistake than to years of practice reshaping instinct.</p>
      <p>This helps most on tasks with a clear, checkable success or failure signal — does the code pass the tests, did the tool call return an error, does the final answer satisfy the stated constraints. A critique grounded in a concrete, verifiable outcome is far more useful than the model's own unchecked opinion of its performance, which can be just as unreliable as any other self-assessment.</p>
      <p>Practical limits worth naming: reflection adds cost and latency per retry, reflections accumulate and eventually need pruning or summarizing — echoing Part II, Chapter 4's context management — and reflecting fluently on a wrong turn doesn't guarantee the agent actually has the information it needs to fix it. An agent can produce an articulate, plausible-sounding critique while still not knowing the right answer, if the necessary information was never available to it in the first place.</p>`,
      analogy:
        "<p>RLHF is years of coaching reshaping an athlete's permanent instincts. Reflexion is that same athlete, mid-tournament, jotting \"I keep swinging too early — wait a beat longer\" in a notebook they reread before their next attempt — real improvement, but temporary, fast, and entirely self-directed.</p>",
      example:
        "<p>An agent asked to write code that passes a set of unit tests submits a first attempt that fails two of them. Instead of retrying blindly, it reads the actual test failure output, writes a reflection — \"I mishandled the empty-list edge case\" — and its next attempt, with that reflection included in context, specifically addresses that edge case and passes.</p>",
      takeaways: [
        "Reflexion adds a self-critique step to the agent loop: after an attempt, the agent writes a verbal reflection on what went wrong, stored as context for the next try.",
        "This is sometimes called \"verbal reinforcement learning\" — behavior improves across attempts without any weight updates, unlike RLHF (Part I, Ch.6).",
        "Reflection is most useful when grounded in a concrete, checkable outcome — failing tests, tool errors — rather than the model's own unverified self-assessment.",
        "Reflections cost tokens/latency and accumulate over time, needing the same pruning/summarization discipline as any other context (Part II, Ch.4).",
        "Reflecting fluently on a mistake doesn't guarantee the agent actually has the information needed to fix it.",
      ],
      quiz: [
        {
          q: "What does Reflexion add on top of the basic ReAct loop?",
          options: [
            "A second, larger language model",
            "A verbal self-critique step after an attempt, stored as context to steer the next try",
            "A requirement to always call at least two tools",
            "A numeric reward model updating the weights",
          ],
          answer: 1,
          explain: "Reflexion's core mechanism is a written, natural-language critique fed back into context — not a weight update.",
        },
        {
          q: "Why is Reflexion sometimes called \"verbal reinforcement learning\"?",
          options: [
            "Because it requires spoken audio input",
            "Because the learning signal is text the model writes itself, and the \"update\" is adding that text to context, with no gradient step",
            "Because it replaces RLHF entirely in all systems",
            "Because it only works on verbal reasoning tasks",
          ],
          answer: 1,
          explain: "Behavior improves across attempts purely from text-based self-critique in context, unlike RLHF's weight-based learning.",
        },
        {
          q: "When is a Reflexion-style critique most useful?",
          options: [
            "When it's based purely on the model's own unverified opinion of its performance",
            "When it's grounded in a concrete, checkable outcome like failing tests or a tool error",
            "Reflexion critiques are equally useful regardless of grounding",
            "Only when no tools are involved",
          ],
          answer: 1,
          explain: "A checkable signal (test failures, errors) makes the critique meaningfully accurate rather than just plausible-sounding.",
        },
        {
          q: "How does Reflexion differ from RLHF (Part I, Ch.6) in terms of what changes?",
          options: [
            "They are the same mechanism",
            "RLHF permanently updates model weights during training; Reflexion changes behavior temporarily via context, within a single task episode",
            "Reflexion updates weights faster than RLHF",
            "RLHF only works on agents, Reflexion only works on chatbots",
          ],
          answer: 1,
          explain: "RLHF is a training-time, permanent weight change; Reflexion is an inference-time, temporary context change.",
        },
        {
          q: "Why doesn't a fluent, articulate reflection guarantee the agent will actually succeed next time?",
          options: [
            "Because reflections are always factually wrong",
            "Because the agent may still lack the actual information needed to fix the problem, even if its critique sounds correct",
            "Because reflections disable tool calling",
            "Because reflections are never stored in context",
          ],
          answer: 1,
          explain: "A plausible-sounding critique isn't the same as having the missing information required to actually solve the problem.",
        },
      ],
    },
    {
      id: "p4-c4",
      n: 4,
      title: "Planning — Decomposition, Plan-and-Execute & Replanning",
      short: "When deciding one step at a time isn't enough",
      requires: ["p4-c2"],
      xp: 110,
      node: { x: 680, y: 480 },
      diagram: {
        type: "compare",
        query: "Plan and book a 3-city trip within a $2,000 total budget",
        left: {
          label: "Purely reactive (ReAct)",
          stages: ["Book city A flight", "Book city B flight", "Discover city C pushes over budget"],
          outcome: { icon: "✕", text: "over budget — already-booked flights can't be undone", kind: "miss" },
        },
        right: {
          label: "Plan-and-execute",
          stages: ["Draft the full 3-city itinerary", "Check total cost against budget", "Only book once the plan fits"],
          outcome: { icon: "✓", text: "catches the budget problem before committing any money", kind: "match" },
        },
      },
      hook: "<p>ReAct decides one step at a time. Some tasks punish that — by the time you notice a problem, you've already spent the budget you needed to avoid it.</p>",
      explain: `<p>Purely reactive loops, like plain ReAct, decide the next action based only on the current state, one step at a time, with no explicit model of the whole task ahead. This works well when a step's outcome doesn't foreclose future options. It works poorly for tasks with irreversible actions or global constraints — a fixed budget across several purchases, say — where a locally-reasonable step can create a problem that's only discovered too late to undo.</p>
      <p><strong>Plan-and-execute</strong> architectures separate planning from execution: first, generate an explicit multi-step plan for the entire task upfront — a sequence or graph of intended sub-goals; then execute it step by step, often re-checking the plan is still valid as new information arrives; and <strong>replan</strong> — regenerate part or all of the plan — if execution reveals the original won't work, because a tool failed, an assumption turned out false, or new constraints emerged.</p>
      <p><strong>Task decomposition</strong> — breaking one large, ambiguous goal into a sequence of smaller, well-defined sub-goals — is what makes a plan actionable in the first place. Each sub-goal typically becomes something closer to a single ReAct-style loop, which the agent can execute more reliably than trying to reason about the whole task at once.</p>
      <p>The core tradeoff: reactive loops are cheaper and simpler for short, low-stakes, easily-recoverable tasks; plan-and-execute is more robust for long-horizon or high-stakes tasks with irreversible actions or global constraints, at the cost of more upfront reasoning and the added complexity of detecting when a plan needs revision. Many production agent systems combine both — a coarse upfront plan sets sub-goals, and each sub-goal is executed with a tighter, reactive loop underneath it.</p>
      <p>Replanning specifically requires the agent to notice its current plan is no longer viable — which depends on the same kind of self-checking introduced in Reflexion, the previous chapter — and to update the plan without discarding whatever progress is still valid, rather than restarting the whole task from scratch every time something changes.</p>`,
      analogy:
        "<p>Pure ReAct is driving using only what's visible through the windshield, deciding each turn as it comes. Plan-and-execute is checking the full map and committing to a route before setting off — still watching the road and rerouting around an unexpected closure, but never starting a long trip with zero sense of the destination.</p>",
      example:
        "<p>Asked to plan and book a 3-city trip within a $2,000 total budget, a purely reactive agent might book the first city's flight, then the second's, only discovering after both bookings that the third city's flight pushes the total over budget — with no way to undo what's already paid for. A plan-and-execute agent instead drafts the full itinerary and checks the total against the budget before booking anything, catching the problem while it's still just a plan, and revising it before committing any real money.</p>",
      takeaways: [
        "Purely reactive (ReAct-style) loops decide one step at a time with no explicit model of the whole task — fine for short, recoverable tasks, risky for tasks with irreversible actions or global constraints.",
        "Plan-and-execute separates planning (an explicit upfront multi-step plan) from execution, checking and replanning as new information arrives.",
        "Task decomposition turns one large ambiguous goal into smaller, well-defined sub-goals that are each easier to execute reliably.",
        "The tradeoff is upfront reasoning cost and complexity versus robustness on long-horizon or high-stakes tasks — many real systems combine a coarse plan with reactive execution underneath each sub-goal.",
        "Replanning requires noticing a plan is no longer viable and updating it without discarding still-valid progress, rather than restarting from scratch.",
      ],
      quiz: [
        {
          q: "When does a purely reactive (ReAct-style) loop tend to fail?",
          options: [
            "On every task, regardless of type",
            "On tasks with irreversible actions or global constraints, where a locally-reasonable step can create a problem discovered too late",
            "Only on tasks that don't use tools",
            "It never fails, it's always the best choice",
          ],
          answer: 1,
          explain: "Without an explicit model of the whole task, a reactive agent can commit to an early step that turns out to violate a global constraint.",
        },
        {
          q: "What does plan-and-execute do differently from pure ReAct?",
          options: [
            "It never uses tools",
            "It generates an explicit multi-step plan upfront before executing, and can replan if execution reveals the plan won't work",
            "It skips reasoning entirely",
            "It requires no memory at all",
          ],
          answer: 1,
          explain: "The defining feature is separating an upfront plan from execution, with the option to revise the plan based on what execution reveals.",
        },
        {
          q: "What is task decomposition, and why does it matter?",
          options: [
            "Deleting tasks that are too hard",
            "Breaking one large, ambiguous goal into smaller, well-defined sub-goals, each easier to execute reliably as its own loop",
            "Running the same task multiple times in parallel",
            "A synonym for replanning",
          ],
          answer: 1,
          explain: "Decomposition is what turns a vague overall goal into concrete, actionable sub-goals a ReAct-style loop can handle.",
        },
        {
          q: "What is the core tradeoff between reactive loops and plan-and-execute?",
          options: [
            "There is no real tradeoff, plan-and-execute is strictly better in every case",
            "Reactive loops are cheaper/simpler for low-stakes recoverable tasks; plan-and-execute is more robust for long-horizon or high-stakes tasks, at the cost of more upfront reasoning",
            "Plan-and-execute never uses reasoning",
            "Reactive loops require more memory than plan-and-execute",
          ],
          answer: 1,
          explain: "The choice depends on task stakes and reversibility — neither approach is universally better.",
        },
        {
          q: "What does replanning require the agent to do?",
          options: [
            "Always restart the entire task from scratch",
            "Notice the current plan is no longer viable and update it while preserving whatever progress is still valid",
            "Ignore any new information that arrives during execution",
            "Switch to a completely different tool set",
          ],
          answer: 1,
          explain: "Effective replanning updates only what's necessary, rather than discarding valid progress and starting over unnecessarily.",
        },
      ],
    },
    {
      id: "p4-c5",
      n: 5,
      title: "Agent Memory & Single-Agent Architecture in Practice",
      short: "The unglamorous plumbing that separates a demo from a real system",
      requires: ["p4-c3", "p4-c4"],
      xp: 120,
      node: { x: 500, y: 680 },
      diagram: {
        type: "pipeline",
        stages: ["Perceive task / observation", "Retrieve relevant memory", "Reason + decide next action", "Act", "Update memory"],
        loop: true,
      },
      diagram2: {
        type: "embed",
        points: [
          { label: "import bug fix", x: 20, y: 26, cluster: "animal" },
          { label: "module order", x: 28, y: 18, cluster: "animal" },
          { label: "edge case fix", x: 16, y: 38, cluster: "animal" },
          { label: "api timeout", x: 74, y: 62, cluster: "object" },
          { label: "rate limit hit", x: 84, y: 56, cluster: "object" },
          { label: "auth failure", x: 70, y: 78, cluster: "object" },
          { label: "prefers dark mode", x: 50, y: 12, cluster: "verb" },
          { label: "wants concise replies", x: 60, y: 18, cluster: "verb" },
        ],
      },
      hook: "<p>Everything in this Part so far happens within one episode. Real agents also need to remember things across episodes — and the difference between a toy demo and a production agent is usually in exactly this kind of unglamorous plumbing.</p>",
      explain: `<p><strong>Short-term / working memory</strong> is just the current context window (Part II, Chapter 4) — it vanishes when the session ends. <strong>Long-term memory</strong> persists across sessions, stored externally, often in the same kind of vector store covered in Part III, and retrieved back into context only when relevant, rather than kept live at all times.</p>
      <p>Within long-term memory, a distinction borrowed directly from cognitive science is useful: <strong>episodic memory</strong> records specific past events — "on this task, this tool call failed because X" — while <strong>semantic memory</strong> holds generalized facts distilled from many episodes — "this tool tends to fail on inputs longer than N characters." Reflexion's reflections (previous chapter) are a form of episodic memory; consolidating many of them into a general rule is a step toward semantic memory.</p>
      <p>Memory retrieval reuses everything from Part III directly: relevant past memories are embedded and retrieved much like document chunks, often scored not just by similarity but by a weighted combination of factors — a formulation from the "Generative Agents" line of research scores each candidate by recency, relevance to the current situation, and importance, so a highly important but older memory can still outrank a merely-relevant recent one.</p>
      <p>Memory <strong>writing and pruning</strong> matter just as much as retrieval. Not everything an agent experiences is worth persisting — most raw observations are noise — so agents typically write selectively (notable events, explicit reflections, task outcomes) and periodically consolidate or forget old, low-value memories. Left unmaintained, a memory store grows unbounded and retrieval quality degrades exactly the way a stale RAG index does (Part III, Chapter 4's freshness point, now applied to an agent's own experience instead of external documents).</p>
      <p>Putting a full single-agent architecture together in practice means handling the parts that don't show up in a demo: explicit <strong>termination conditions</strong> — a maximum step count or a clear "done" signal, so the loop can't run forever on a task it can't solve, an easy and costly bug to miss; <strong>error handling</strong> for tool failures and malformed model outputs, since an agent that crashes on the first flaky tool call isn't production-ready; and guarding against <strong>context bloat</strong> as the running history of Thoughts, Actions, and Observations grows across many steps — the same summarization/pruning discipline from Part II, Chapter 4, now applied to the agent's own growing transcript.</p>`,
      analogy:
        "<p>Short-term memory is what's on your desk right now. Long-term memory is the filing cabinet down the hall — nothing on the desk survives when you leave for the day unless you deliberately file it away first, and a filing cabinet nobody ever cleans out eventually makes it harder, not easier, to find anything.</p>",
      example:
        "<p>A coding agent that fixed a tricky bug in a previous session writes that fix as an episodic memory — \"import order matters in this specific module.\" Weeks later, on an unrelated task in the same codebase, that memory is retrieved, scored high on relevance and importance despite its age, and the agent avoids repeating the same mistake, without anyone having to manually re-teach it or fine-tune anything.</p>",
      math: [
        {
          expr: "score(m) = α·recency(m) + β·relevance(m) + γ·importance(m)",
          note: "From the \"Generative Agents\" line of research — each candidate memory <code>m</code> is scored by a weighted blend of how recent it is, how relevant it is to the current situation (typically embedding similarity, Part III), and how important it was judged when written. A highly important older memory can still surface ahead of a merely-relevant recent one.",
        },
      ],
      takeaways: [
        "Short-term memory is the live context window and vanishes with the session; long-term memory persists externally and is retrieved back in when relevant.",
        "Episodic memory (specific past events) and semantic memory (generalized distilled facts) are a useful distinction borrowed from cognitive science.",
        "Memory retrieval commonly scores candidates by a combination of recency, relevance, and importance — not similarity alone.",
        "Selective writing and periodic pruning of memory matter as much as retrieval — an unmaintained memory store degrades the same way a stale RAG index does.",
        "A production-ready single-agent architecture needs explicit termination conditions, tool-failure error handling, and context-bloat management for its own growing transcript.",
      ],
      quiz: [
        {
          q: "What's the difference between short-term and long-term agent memory?",
          options: [
            "There is no difference, they're the same thing",
            "Short-term memory is the live context window and vanishes with the session; long-term memory persists externally and is retrieved when relevant",
            "Short-term memory is stored in a vector database",
            "Long-term memory only exists for multi-agent systems",
          ],
          answer: 1,
          explain: "Short-term memory is ephemeral context; long-term memory is durable, external storage retrieved back in as needed.",
        },
        {
          q: "What distinguishes episodic memory from semantic memory?",
          options: [
            "They are identical concepts",
            "Episodic memory records specific past events; semantic memory holds generalized facts distilled from many episodes",
            "Episodic memory is always more accurate",
            "Semantic memory only stores numbers",
          ],
          answer: 1,
          explain: "A single failed tool call is episodic; a general rule inferred from many such failures is semantic.",
        },
        {
          q: "In score(m) = α·recency(m) + β·relevance(m) + γ·importance(m), why include importance alongside recency and relevance?",
          options: [
            "Importance is not actually used in practice",
            "So a highly important but older memory can still outrank a merely-relevant recent one, rather than always favoring newer memories",
            "Importance replaces the need for relevance entirely",
            "It only affects how memories are deleted, not retrieved",
          ],
          answer: 1,
          explain: "Without an importance term, valuable older memories would be systematically outranked by recent but less significant ones.",
        },
        {
          q: "Why does an agent's memory store need pruning, not just writing?",
          options: [
            "Pruning is optional and has no real effect",
            "An unmaintained memory store grows unbounded and retrieval quality degrades, the same way a stale RAG index does",
            "Pruning is only needed for short-term memory",
            "Because vector databases cannot store more than 100 entries",
          ],
          answer: 1,
          explain: "Just like a RAG index needs freshness maintenance (Part III, Ch.4), an agent's memory needs selective writing and periodic cleanup.",
        },
        {
          q: "Why does a production agent need an explicit termination condition?",
          options: [
            "It doesn't — agents should run until the developer manually stops them",
            "Without one, the agent loop can run forever on a task it can't solve — an easy and costly bug to miss",
            "Termination conditions are only relevant for multi-agent systems",
            "It replaces the need for error handling",
          ],
          answer: 1,
          explain: "A maximum step count or clear \"done\" signal prevents runaway cost and infinite loops on unsolvable tasks.",
        },
      ],
    },
  ],
};

window.PARTS = window.PARTS || {};
window.PARTS[window.PART_DATA.id] = window.PART_DATA;
