/* ============================================================
   Content data — Part V: Multi-Agent & Orchestration
   Single source of truth rendered by BOTH the gamified quest
   pages and the Simple-mode revise page.
   ============================================================ */

window.PART_DATA = {
  id: "part-5",
  index: 5,
  title: "Multi-Agent & Orchestration",
  tagline: "When one agent isn't enough, and how the team actually coordinates",
  color: "ion",
  mapViewBox: "0 0 1000 900",
  edges: [
    ["p5-c1", "p5-c2"],
    ["p5-c2", "p5-c3"],
    ["p5-c2", "p5-c4"],
    ["p5-c3", "p5-c5"],
    ["p5-c4", "p5-c5"],
  ],
  badges: {
    first: { id: "p5-first", label: "First Handoff — completed your first Part V chapter" },
    complete: { id: "p5-complete", label: "Orchestrator — cleared all of Part V" },
  },
  chapters: [
    {
      id: "p5-c1",
      n: 1,
      title: "Orchestration Patterns I — Sequential, Supervisor & Hierarchical",
      short: "The manager, the assembly line, and the org chart",
      requires: [],
      xp: 100,
      node: { x: 500, y: 90 },
      diagram: {
        type: "crew",
        task: "Draft, edit, then publish a blog post",
        nodes: [
          { id: "a", label: "Drafting Agent", tier: 0 },
          { id: "b", label: "Editing Agent", tier: 1 },
          { id: "c", label: "Publishing Agent", tier: 2 },
        ],
        flow: [
          { from: "a", to: "b" },
          { from: "b", to: "c" },
        ],
        roundTrip: false,
        statusSteps: ["Drafting agent hands off to the editor", "Editor hands off to the publisher", "Post published"],
      },
      diagram2: {
        type: "crew",
        task: "Write a market analysis report",
        nodes: [
          { id: "mgr", label: "Manager", role: "captain", tier: 0 },
          { id: "w1", label: "Research Agent", tier: 1 },
          { id: "w2", label: "Writer Agent", tier: 1 },
          { id: "w3", label: "Reviewer Agent", tier: 1 },
        ],
        flow: [
          { from: "mgr", to: "w1" },
          { from: "mgr", to: "w2" },
          { from: "mgr", to: "w3" },
        ],
        roundTrip: true,
        statusSteps: [
          "Manager delegates the research sub-task",
          "Manager delegates the writing sub-task",
          "Manager delegates the review sub-task",
          "Workers report their results back",
          "Manager combines the final report",
        ],
      },
      hook: "<p>One agent, looping, got you far in Part IV. Some tasks are too big, too varied, or too specialized for one agent to handle alone — which is exactly when you start needing more than one, and a real decision about how they coordinate.</p>",
      explain: `<p>Multi-agent systems exist because a single agent juggling everything — research, writing, coding, review — tends to do all of it a little worse than several agents, each specialized and prompted for one job, the same reason human organizations divide labor rather than having one generalist do everything. But adding agents adds coordination overhead and cost, so which orchestration pattern you choose is a real design decision, not a default.</p>
      <p><strong>Sequential (pipeline) orchestration</strong> runs agents in a fixed chain, where each agent's output becomes the next agent's input — agent A drafts, agent B edits, agent C publishes. Simple, predictable, and easy to debug, since failures are localized to one stage — but rigid: there's no way to route around a stage or handle a task that doesn't fit the fixed sequence.</p>
      <p><strong>Supervisor (orchestrator-worker) orchestration</strong> has a manager agent receive the overall task, decide how to break it into sub-tasks, and delegate each one to a specialized worker agent — then collect and combine the results. This is the classic "manager handing tasks to employees" pattern: the manager doesn't do the specialized work itself, it decides who does what and synthesizes the outcome. It's more flexible than sequential — the manager can decide, at runtime, which workers are needed and in what combination — at the cost of needing a manager capable of good task decomposition (Part IV, Chapter 4) and result synthesis.</p>
      <p><strong>Hierarchical orchestration</strong> extends the supervisor pattern to multiple levels — a top-level manager delegates to mid-level supervisors, each of whom manages their own team of workers, mirroring a real organizational chart. This scales supervisor orchestration to much larger agent teams without any single manager needing to track every worker directly — each supervisor only coordinates its own sub-team, applying the same divide-and-conquer reasoning that motivated multi-agent systems in the first place, now applied recursively to the coordination layer itself.</p>
      <p>The shared thread across all three: information flows through explicit, structured handoffs — a clear boundary of what one agent passes to the next — which is what makes debugging tractable. You can always point to which specific handoff produced a bad result, unlike a single sprawling agent transcript.</p>`,
      analogy:
        "<p>Sequential is an assembly line — parts move down the line, each station does one job, in order. Supervisor is a manager assigning tasks to a team of specialists and compiling their work into one final report. Hierarchical is a manager of managers — a VP who doesn't talk to individual engineers directly, only to team leads, who each talk to their own engineers.</p>",
      example:
        "<p>A \"market analysis report\" task given to a supervisor-style system: the manager agent decomposes it into \"research current market data,\" \"write the report draft,\" and \"review for accuracy,\" delegates each to a specialized agent, and once all three report back, combines their outputs into a final polished document — never doing the research or writing itself, only deciding who does what and stitching the results together.</p>",
      takeaways: [
        "Multi-agent systems trade added coordination overhead for specialization — worth it when a task genuinely benefits from divided, focused expertise, not by default.",
        "Sequential orchestration is a fixed chain of handoffs — simple and predictable, but rigid.",
        "Supervisor orchestration has a manager agent decompose a task, delegate to specialized workers, and synthesize their results — the classic manager-and-employees pattern.",
        "Hierarchical orchestration nests supervisor patterns across multiple levels, scaling coordination to much larger agent teams without any single manager tracking every worker directly.",
        "All three rely on explicit, structured handoffs between agents, which is what keeps a multi-agent system debuggable.",
      ],
      quiz: [
        {
          q: "Why do multi-agent systems exist instead of just using one larger agent?",
          options: [
            "Because single agents cannot call tools",
            "Several specialized agents, each focused on one job, tend to outperform one generalist agent juggling everything — the same reasoning behind human division of labor",
            "Because multi-agent systems are always cheaper",
            "Because a single agent cannot use memory",
          ],
          answer: 1,
          explain: "Specialization is the core motivation, but it comes with real added coordination cost — not a free upgrade.",
        },
        {
          q: "What is the defining feature of sequential (pipeline) orchestration?",
          options: [
            "Agents vote on the final answer",
            "Agents run in a fixed chain, where each agent's output becomes the next agent's input",
            "Agents communicate through a shared blackboard",
            "There is no defined order between agents",
          ],
          answer: 1,
          explain: "Sequential orchestration is a fixed handoff chain — simple and predictable, but rigid to tasks that don't fit that exact order.",
        },
        {
          q: "In supervisor orchestration, what role does the manager agent actually play?",
          options: [
            "It performs all the specialized work itself",
            "It decomposes the task, delegates sub-tasks to specialized workers, and synthesizes their results — without doing the specialized work itself",
            "It only monitors, with no ability to assign tasks",
            "It replaces the need for worker agents entirely",
          ],
          answer: 1,
          explain: "The manager's job is decomposition, delegation, and synthesis — the actual specialized work happens in the worker agents.",
        },
        {
          q: "How does hierarchical orchestration scale beyond plain supervisor orchestration?",
          options: [
            "It removes the need for a manager entirely",
            "It nests supervisor patterns across multiple levels, so no single manager needs to track every worker directly",
            "It only works with exactly two agents",
            "It replaces delegation with a shared blackboard",
          ],
          answer: 1,
          explain: "Adding intermediate supervisors lets coordination scale to much larger teams without overloading one top-level manager.",
        },
        {
          q: "What do sequential, supervisor, and hierarchical orchestration all share, and why does it matter?",
          options: [
            "They all avoid tool calling",
            "They all rely on explicit, structured handoffs between agents, which is what keeps a multi-agent system debuggable",
            "They all require exactly three agents",
            "They all skip task decomposition",
          ],
          answer: 1,
          explain: "Clear handoff boundaries let you localize which specific step produced a bad result, unlike one sprawling agent transcript.",
        },
      ],
    },
    {
      id: "p5-c2",
      n: 2,
      title: "Orchestration Patterns II — Parallel, Debate & Blackboard",
      short: "When agents work at once, argue, or just leave notes",
      requires: ["p5-c1"],
      xp: 110,
      node: { x: 500, y: 280 },
      diagram: {
        type: "crew",
        task: "Get three independent takes on a proposed pricing change",
        nodes: [
          { id: "mgr", label: "Coordinator", role: "captain", tier: 0 },
          { id: "w1", label: "Agent A", tier: 1 },
          { id: "w2", label: "Agent B", tier: 1 },
          { id: "w3", label: "Agent C", tier: 1 },
        ],
        flow: [
          { from: "mgr", to: "w1" },
          { from: "mgr", to: "w2" },
          { from: "mgr", to: "w3" },
        ],
        roundTrip: true,
        parallel: true,
        statusSteps: [
          "Coordinator dispatches to all three agents at once",
          "All three work concurrently",
          "All three report back at once",
          "Coordinator merges / votes on the results",
        ],
      },
      diagram2: {
        type: "crew",
        task: "Diagnose a production incident",
        nodes: [
          { id: "b1", label: "Logs Agent", tier: 0 },
          { id: "b2", label: "Metrics Agent", tier: 0 },
          { id: "b3", label: "Shared Board", role: "board", tier: 1 },
        ],
        flow: [
          { from: "b1", to: "b3" },
          { from: "b2", to: "b3" },
        ],
        roundTrip: false,
        statusSteps: [
          "Logs agent posts a finding whenever it's ready",
          "Metrics agent posts a finding independently",
          "Full incident picture emerges from the board",
        ],
      },
      hook: "<p>Not every multi-agent task is a chain of command. Sometimes agents work at the same time, argue with each other, or just leave notes on a shared board for whoever needs them.</p>",
      explain: `<p><strong>Parallel orchestration (fan-out / fan-in)</strong> dispatches a task — the same task, or independent sub-tasks — to multiple agents simultaneously, then waits for all of them and merges the results. It's used for speed (independent work happens concurrently instead of one at a time) or for redundancy: multiple agents attempt the same task independently, and their answers are combined or voted on, similar in spirit to Part II's self-consistency, but across separate agents instead of separate sampled reasoning paths from one model. The cost is real — running N agents in parallel multiplies token and compute cost roughly by N — so this pattern earns its keep when speed or the reliability gain from redundancy justifies that multiplier.</p>
      <p><strong>Debate (adversarial) orchestration</strong> gives two or more agents deliberately different perspectives, or instructs them to critique each other's answer, going back and forth for a few rounds before a final answer is settled — either by a judge agent, or by the agents converging on agreement. This surfaces flaws a single agent's self-review might miss, since a dedicated critic, unburdened by having generated the original answer, isn't anchored to defending it. It's a multi-agent analog to Part IV's Reflexion — but the critique now comes from a genuinely different agent's perspective, not the same agent second-guessing itself.</p>
      <p><strong>Blackboard orchestration</strong> has agents read from and write to one shared workspace rather than messaging each other directly. Each agent monitors the board and contributes when it has something relevant to add, with no fixed order or central coordinator deciding who goes when. This suits problems where the right sequence of contributions isn't known in advance — a diagnostic task where a logs agent, a metrics agent, and a config agent each contribute findings opportunistically as they become available, and the full picture only emerges once enough pieces accumulate.</p>
      <p>Briefly, at the far end of the spectrum: <strong>decentralized / market-based orchestration</strong>, where agents bid for or negotiate over tasks among themselves with no central coordinator at all — powerful for very large, open-ended agent populations, but harder to predict and debug, and less common in production systems today than the more structured patterns above.</p>
      <p>Choosing between all five patterns from this Part comes down to the actual shape of the task: a fixed sequence wants sequential; independent specialties want supervisor; independent attempts merged for speed or confidence want parallel; a decision benefiting from adversarial scrutiny wants debate; and unpredictable contributions want blackboard.</p>`,
      analogy:
        "<p>Parallel is assigning the same question to three employees independently and comparing their answers before picking the best one. Debate is two lawyers arguing opposite sides in front of a judge. Blackboard is a shared whiteboard in an incident-response war room — nobody's in charge of ordering who writes on it, people just add what they know as they figure it out, and the picture builds from everyone's contributions.</p>",
      example:
        "<p>Diagnosing a production outage with a blackboard pattern: a logs-analysis agent posts \"error spike started at 14:02\" as soon as it finds it, a metrics agent independently posts \"CPU normal, network latency spiked at 14:01\" a moment later, and a config-history agent posts \"a deployment went out at 14:00\" — no agent waited for permission or a turn, but once enough findings accumulate, the full incident timeline is reconstructable from pieces contributed in whatever order they were discovered.</p>",
      takeaways: [
        "Parallel orchestration dispatches work to multiple agents simultaneously for speed or redundancy, at a real cost multiplier roughly proportional to the number of agents used.",
        "Debate orchestration has agents critique or argue against each other's answers, surfacing flaws a single agent's self-review tends to miss — a multi-agent analog to Reflexion (Part IV).",
        "Blackboard orchestration lets agents contribute to a shared workspace opportunistically, with no fixed order or central coordinator, suited to tasks whose right sequence of contributions isn't known in advance.",
        "Decentralized/market-based coordination exists at the far end of the spectrum but is less common in production today, given its unpredictability.",
        "The right pattern follows the actual shape of the task — a fixed sequence, independent specialties, redundant attempts, adversarial scrutiny, or unpredictable contributions each point to a different pattern.",
      ],
      quiz: [
        {
          q: "What does parallel (fan-out/fan-in) orchestration trade off for speed or redundancy?",
          options: [
            "Nothing, it's strictly free",
            "Token and compute cost roughly multiplied by the number of agents dispatched",
            "The ability to use tools",
            "The need for a coordinator"
          ],
          answer: 1,
          explain: "Running N agents concurrently multiplies real resource cost by roughly N, which needs to be justified by the speed or reliability gained.",
        },
        {
          q: "Why can debate orchestration surface flaws a single agent's self-review misses?",
          options: [
            "Because debate always produces a longer answer",
            "A dedicated critic agent isn't anchored to defending an answer it didn't generate itself, unlike the original agent reviewing its own work",
            "Because debate removes the need for any final answer",
            "Because debate uses more tools"
          ],
          answer: 1,
          explain: "An agent reviewing its own output can be biased toward defending it; a separate critic has no such attachment.",
        },
        {
          q: "What makes blackboard orchestration different from supervisor orchestration?",
          options: [
            "Blackboard has no shared workspace at all",
            "Agents contribute to a shared workspace opportunistically with no fixed order or central coordinator, rather than being explicitly delegated tasks",
            "Blackboard requires exactly two agents",
            "Blackboard is identical to sequential orchestration"
          ],
          answer: 1,
          explain: "Blackboard suits tasks where the right order of contributions isn't known upfront, unlike supervisor's explicit delegation.",
        },
        {
          q: "Why is decentralized/market-based orchestration described as less common in production today?",
          options: [
            "Because it never works",
            "Because it's harder to predict and debug than more structured patterns, despite being powerful for large open-ended agent populations",
            "Because it requires only one agent",
            "Because it cannot use tools"
          ],
          answer: 1,
          explain: "The lack of central coordination that makes it powerful at scale also makes its behavior harder to predict and debug.",
        },
        {
          q: "How should the choice between all five orchestration patterns (across both chapters) generally be made?",
          options: [
            "Always default to the most complex pattern available",
            "Based on the actual shape of the task — a fixed sequence, independent specialties, redundant attempts, adversarial scrutiny, or unpredictable contributions each favor a different pattern",
            "Randomly, since all patterns perform identically",
            "Based only on which framework is most popular"
          ],
          answer: 1,
          explain: "Each pattern fits a different task shape — the decision should follow the nature of the problem, not a default preference.",
        },
      ],
    },
    {
      id: "p5-c3",
      n: 3,
      title: "Agent Communication Protocols",
      short: "Making sure agents can actually understand each other",
      requires: ["p5-c2"],
      xp: 100,
      node: { x: 320, y: 480 },
      diagram: {
        type: "crew",
        task: "Hand off research findings to a writing agent",
        nodes: [
          { id: "a", label: "Research Agent", tier: 0 },
          { id: "b", label: "Writing Agent", tier: 1 },
        ],
        flow: [{ from: "a", to: "b" }],
        roundTrip: false,
        statusSteps: [
          "Research agent sends structured findings",
          "Writing agent parses the payload",
          "Writing agent begins drafting from it",
        ],
      },
      diagram2: {
        type: "compare",
        query: "Connect a research agent (Team A) to a writing agent (Team B)",
        left: {
          label: "No shared protocol",
          stages: ["Custom output parser for Team A's format", "Custom translator to Team B's expected input", "One-off integration code per pair"],
          outcome: { icon: "✕", text: "an N² pile of custom translators as more agent types are added", kind: "miss" },
        },
        right: {
          label: "Standardized protocol",
          stages: ["Both agents speak the same message format", "No translation layer needed", "New agents plug in directly"],
          outcome: { icon: "✓", text: "any conforming agent connects to any other, with zero custom glue code", kind: "match" },
        },
      },
      hook: "<p>Every orchestration pattern in the last two chapters assumed agents could actually pass information to each other cleanly. That's not automatic — it's a design problem of its own.</p>",
      explain: `<p>There are two broad approaches to how agents actually share information. <strong>Shared state / shared context</strong> has agents read and write to a common data structure — the blackboard pattern is an extreme version of this. <strong>Direct message passing</strong> has agents send explicit messages to specific other agents, with a defined sender, recipient, and content — closer to how the supervisor and sequential patterns actually move information.</p>
      <p>A useful message between agents typically carries more than raw text: the actual content or payload, metadata about who sent it and in what role, and often structured fields — echoing Part II Chapter 5's structured-output ideas — so the receiving agent can parse and act on it reliably rather than re-interpreting free text.</p>
      <p>This raises a practical problem directly: without any shared standard, every pair of agent types needs its own bespoke message format, and connecting agent A to agent B — built by different teams, using different frameworks — means writing custom translation code for every new pairing. As the number of distinct agent types grows, that becomes an N² integration problem.</p>
      <p>This motivates <strong>standardized agent communication protocols</strong> — agreed-upon message formats and interaction rules so any conforming agent can talk to any other conforming agent without custom glue code, the same motivation that led to standardized network protocols like HTTP, or standardized tool-calling formats (Part II, Chapter 5), rather than every application inventing its own. Emerging efforts in this space, broadly referred to as agent-to-agent (A2A-style) protocols, aim to standardize how independent agents discover each other's capabilities, exchange tasks, and report results — conceptually the same tool-calling idea from Part II, but between peer agents rather than between one agent and a fixed set of tools.</p>
      <p>Two practical realities are worth naming. Communication is not free — every message is real tokens moving through real context windows, so a chatty multi-agent system can burn through budget on coordination overhead alone, independent of the actual task work. And communication failures are a real failure mode of their own: an agent misinterpreting another agent's message, or a message being dropped or malformed, can silently corrupt a multi-agent system's output in ways that are harder to trace than a single agent's error, precisely because the fault could be in either agent or in the handoff between them.</p>`,
      analogy:
        "<p>Two people who've worked together for years communicate in shorthand and rarely misunderstand each other. Two strangers speaking different native languages need either a shared common language or a translator for every exchange — standardized agent communication protocols are the shared language that lets independently-built agents work together without a bespoke translator for every new pairing.</p>",
      example:
        "<p>A research agent built by one team needs to hand results to a report-writing agent built by a different team, using a different framework. Without a shared protocol, connecting them means writing custom code to convert one agent's output format into what the other expects — for every new pair introduced, another custom translator. A standardized protocol means both agents already speak the same format, and no bespoke integration code is needed at all.</p>",
      takeaways: [
        "Agents share information either through shared state (like the blackboard pattern) or direct message passing (closer to supervisor/sequential patterns) — different tradeoffs for different orchestration shapes.",
        "A useful agent message carries not just content, but metadata about sender/role and structured fields the receiver can parse reliably.",
        "Without a shared standard, connecting many distinct agent types becomes an N² integration problem of bespoke translators.",
        "Standardized communication protocols let independently-built agents interoperate without custom glue code — the same motivation behind standardized tool-calling formats (Part II).",
        "Communication has a real token cost, and communication failures — misinterpretation, dropped or malformed messages — are a distinct failure mode, often harder to trace than a single agent's own error.",
      ],
      quiz: [
        {
          q: "What is the difference between shared-state and direct message-passing communication?",
          options: [
            "They are the same mechanism with different names",
            "Shared state has agents read/write a common data structure (like blackboard); direct message passing sends explicit messages between specific agents",
            "Direct message passing never carries any metadata",
            "Shared state only works with exactly one agent",
          ],
          answer: 1,
          explain: "These are the two broad mechanisms underlying the orchestration patterns from the previous two chapters.",
        },
        {
          q: "Why does a well-designed agent message need more than just raw text content?",
          options: [
            "It doesn't — raw text is always sufficient",
            "Metadata (sender, role) and structured fields let the receiving agent parse and act on the message reliably, rather than re-interpreting free text",
            "Extra fields are purely decorative",
            "Metadata replaces the need for content entirely",
          ],
          answer: 1,
          explain: "Structured fields make messages reliably parseable, echoing Part II's structured-output motivation applied to agent-to-agent communication.",
        },
        {
          q: "What problem emerges without a shared communication standard as more distinct agent types are introduced?",
          options: [
            "No problem — agents always understand each other automatically",
            "An N² integration problem — every new pair of agent types needs its own bespoke translator",
            "Agents become faster",
            "Token costs disappear",
          ],
          answer: 1,
          explain: "Each new agent type potentially needs custom translation code for every existing type it must talk to, scaling poorly.",
        },
        {
          q: "What is the core motivation behind standardized agent-to-agent protocols?",
          options: [
            "To make every agent identical",
            "To let any conforming agent talk to any other conforming agent without custom glue code, the same motivation behind standards like HTTP or Part II's tool-calling formats",
            "To remove the need for agents to communicate at all",
            "To increase token costs intentionally",
          ],
          answer: 1,
          explain: "Standardization trades one-off custom integration work for a shared format any compliant agent can use.",
        },
        {
          q: "Why are communication failures described as a distinct, often harder-to-trace failure mode?",
          options: [
            "They never actually occur in practice",
            "The fault could be in either agent or in the handoff itself, unlike a single agent's own, more directly attributable error",
            "They only affect single-agent systems",
            "They are always caused by the LLM provider",
          ],
          answer: 1,
          explain: "A misinterpreted or corrupted message could originate from the sender, the receiver, or the transmission itself, complicating debugging.",
        },
      ],
    },
    {
      id: "p5-c4",
      n: 4,
      title: "Model Context Protocol (MCP) Deep Dive",
      short: "Build the integration once, use it from anywhere",
      requires: ["p5-c2"],
      xp: 110,
      node: { x: 680, y: 480 },
      diagram: {
        type: "pipeline",
        stages: ["Application needs a tool or data source", "MCP client connects", "MCP server exposes Tools / Resources / Prompts", "Standardized response back to the client"],
      },
      diagram2: {
        type: "compare",
        query: "Connect a coding assistant to 3 internal data sources",
        left: {
          label: "Without MCP",
          stages: ["Custom ticketing-system integration", "Custom repo integration", "Custom wiki integration"],
          outcome: { icon: "✕", text: "3 bespoke integrations to build and maintain", kind: "miss" },
        },
        right: {
          label: "With MCP",
          stages: ["Connect to an existing ticketing MCP server", "Connect to an existing repo MCP server", "Connect to an existing wiki MCP server"],
          outcome: { icon: "✓", text: "zero custom integration code, servers reusable by other apps too", kind: "match" },
        },
      },
      hook: "<p>Part II showed how one model calls one tool. MCP asks a bigger question: what if every model could talk to every tool, and every tool only had to be built once?</p>",
      explain: `<p>Before MCP, connecting an LLM application to N different tools or data sources typically meant writing N different custom integrations — and if M different LLM applications each wanted to use those same N tools, that's up to M×N bespoke connections. It's the same N² integration problem from the previous chapter, now between applications and tools/data sources rather than between agents.</p>
      <p><strong>Model Context Protocol (MCP)</strong>, introduced by Anthropic, standardizes this directly: it defines a common client-server protocol so any MCP-compatible application — the "client," which could be an LLM app, an IDE, or an agent — can connect to any MCP-compatible "server," which exposes tools, data, or capabilities, without custom integration code for each pairing. Build an MCP server once for a data source or tool, and every MCP-compatible client can use it immediately.</p>
      <p>An MCP server can expose three core primitives. <strong>Tools</strong> are callable functions the model can invoke — a direct extension of Part II, Chapter 5's function calling, now standardized so any client can discover and call them uniformly. <strong>Resources</strong> are read-only data the client can fetch and include as context — a file, a database record, a document — without needing a full "tool call" round-trip. <strong>Prompts</strong> are reusable, parameterized prompt templates the server can offer, so common interaction patterns don't need to be reinvented by every client.</p>
      <p>The client-server split matters specifically because it decouples who builds an integration from who uses it: a tool or data provider builds one MCP server, and any application that speaks MCP — regardless of which LLM, framework, or team built it — can connect to that server immediately. This is exactly the standardization motivation from the previous chapter, now concretely specified as an actual protocol rather than just a general goal.</p>
      <p>Practically, this changes how a team thinks about tool integration: instead of asking "how do we wire this data source into our specific agent," the question becomes "does an MCP server already exist for this" — turning what used to be bespoke integration work into a discovery-and-connect problem, closer to installing a library than writing one from scratch.</p>`,
      analogy:
        "<p>Before MCP, connecting agents to tools was like every appliance needing its own uniquely-shaped wall socket — you'd rewire your house for every new appliance. MCP is a standard electrical outlet: build a compliant plug once, and it works in any compliant socket, built by anyone, anywhere.</p>",
      example:
        "<p>A team building a coding assistant wants it to read from their internal ticketing system, their code repository, and their documentation wiki. Without MCP, that's three custom integrations to build and maintain. With MCP, if standardized servers already exist for a ticketing system, a code host, and a wiki platform, the coding assistant simply connects to all three as an MCP client — no bespoke integration code for any of them, and the same three servers could be reused by a completely different application on the team without modification.</p>",
      takeaways: [
        "Before standardization, connecting M applications to N tools/data sources scales toward M×N bespoke integrations — the same N² problem from agent-to-agent communication, applied to applications and tools.",
        "MCP defines a common client-server protocol so any MCP-compatible client can connect to any MCP-compatible server without custom integration code.",
        "MCP servers expose three core primitives: Tools (callable functions, extending Part II's function calling), Resources (read-only contextual data), and Prompts (reusable templates).",
        "The client-server split decouples who builds an integration from who uses it — build a server once, any compliant client can use it.",
        "MCP turns tool integration from bespoke engineering work into a discovery-and-connect problem, much like using a library instead of writing one from scratch.",
      ],
      quiz: [
        {
          q: "What integration problem does MCP directly address?",
          options: [
            "The need for larger context windows",
            "Connecting M applications to N tools/data sources without M×N bespoke custom integrations",
            "The cost of pretraining a model",
            "The need for chunking documents",
          ],
          answer: 1,
          explain: "MCP standardizes the client-server connection so integrations don't need to be rebuilt for every application/tool pairing.",
        },
        {
          q: "What are the three core primitives an MCP server can expose?",
          options: [
            "Chunks, Embeddings, and Indexes",
            "Tools, Resources, and Prompts",
            "Agents, Workers, and Supervisors",
            "Threads, Queues, and Sockets",
          ],
          answer: 1,
          explain: "Tools extend function calling, Resources provide read-only context data, and Prompts offer reusable templates.",
        },
        {
          q: "Why does the client-server architecture matter specifically?",
          options: [
            "It has no real practical effect",
            "It decouples who builds an integration from who uses it — a server built once can be used by any compliant client",
            "It requires every client to be built by the same team as the server",
            "It removes the need for tools entirely",
          ],
          answer: 1,
          explain: "One MCP server, built once, becomes immediately usable by any MCP-compatible client, regardless of who built either side.",
        },
        {
          q: "How does an MCP \"Resource\" differ from an MCP \"Tool\"?",
          options: [
            "They are identical concepts",
            "A Resource is read-only data fetched as context, without a full tool-call round-trip; a Tool is a callable function the model invokes",
            "A Resource can only be used once",
            "A Tool cannot be discovered by a client",
          ],
          answer: 1,
          explain: "Resources are simpler context-fetching primitives, while Tools represent actions the model can actively invoke.",
        },
        {
          q: "How does MCP change the practical question a development team asks when integrating a new data source?",
          options: [
            "It doesn't change anything about integration work",
            "From \"how do we build this integration\" to \"does an MCP server already exist for this\" — closer to using a library than writing one",
            "It requires teams to always build integrations from scratch",
            "It eliminates the need for any data sources",
          ],
          answer: 1,
          explain: "Standardization shifts the work from bespoke engineering to discovery-and-connect, when a compliant server already exists.",
        },
      ],
    },
    {
      id: "p5-c5",
      n: 5,
      title: "Frameworks & Choosing an Architecture",
      short: "The biggest mistake isn't picking the wrong framework",
      requires: ["p5-c3", "p5-c4"],
      xp: 120,
      node: { x: 500, y: 680 },
      diagram: {
        type: "compare",
        query: "Summarize one uploaded document",
        left: {
          label: "Multi-agent pipeline",
          stages: ["Research agent", "Summarizer agent", "Formatter agent"],
          outcome: { icon: "✕", text: "roughly 3x the tokens and latency for the same result", kind: "miss" },
        },
        right: {
          label: "Single agent",
          stages: ["One focused agent", "Summarization prompt, no extra tools needed", "Direct output"],
          outcome: { icon: "✓", text: "same quality, a fraction of the cost and complexity", kind: "match" },
        },
      },
      diagram2: {
        type: "radar",
        label: "Signals that multi-agent orchestration is actually worth it",
        axes: [
          { label: "Distinct expertise", value: 82 },
          { label: "Parallelizable work", value: 68 },
          { label: "Exceeds one context", value: 58 },
          { label: "Needs adversarial check", value: 54 },
          { label: "Coordination budget OK", value: 62 },
        ],
      },
      hook: "<p>This Part covered the patterns. In practice, you rarely build the coordination machinery from scratch — and the biggest mistake isn't picking the wrong framework, it's reaching for multi-agent when a single agent would have done the job better.</p>",
      explain: `<p>A brief landscape of common orchestration frameworks, not as endorsements but as a sense of what each is generally known for: <strong>LangGraph</strong> models agent workflows as an explicit graph of nodes and edges, giving fine-grained control over state and control flow — closer to the "workflow with agentic sub-loops" hybrid from Part IV, Chapter 1. <strong>AutoGen</strong> (Microsoft) focuses on conversational multi-agent patterns, where agents interact via message-passing in a chat-like structure, a natural fit for debate and supervisor patterns. <strong>CrewAI</strong> provides higher-level abstractions specifically for the "team of specialized agents with defined roles" pattern, aiming to make supervisor and hierarchical orchestration quick to set up. Provider-native options — the OpenAI Agents SDK, the Claude Agent SDK — offer tighter integration with a specific provider's tool-calling and agent-loop primitives, trading some framework-agnosticism for a more streamlined, officially-supported path.</p>
      <p>None of these frameworks changes the fundamentals covered in this Part — they're implementations of the same patterns (sequential, supervisor, hierarchical, parallel, debate, blackboard) with different amounts of structure, abstraction, and opinionation. Choosing between them is closer to choosing a web framework than choosing an algorithm: it affects developer experience, debugging tools, and how much boilerplate you write, not which orchestration patterns are possible.</p>
      <p>The more consequential decision comes before any framework choice: does this task actually need multiple agents at all? Multi-agent systems add real cost — more tokens (each agent's own context, plus communication overhead from Chapter 3), more latency (coordination round-trips), more failure surface (communication failures on top of each agent's own error rate), and more complexity to debug, since a bug could be in any agent or in a handoff between two. A single well-designed agent (Part IV) with good tools and a clear loop often outperforms an over-engineered multi-agent system on tasks that don't actually decompose into genuinely independent specialties.</p>
      <p>A practical rule of thumb: reach for multi-agent orchestration when a task genuinely separates into distinct expertise areas that benefit from different prompting, tooling, or context; when independent parallel attempts materially improve speed or reliability; or when the task is large enough that a single agent's context window and focus become the bottleneck. Reach for a single agent when the task is well-scoped enough that one focused loop, possibly with several tools, can just do it — which, in practice, describes a substantial fraction of the real tasks people reach for multi-agent systems to solve anyway.</p>`,
      analogy:
        "<p>Choosing an orchestration framework is choosing which project-management software your team uses. Choosing whether to use a team at all is deciding whether the job actually needs more than one person — hiring a five-person team for a task one competent person could finish alone doesn't make it faster, it mostly adds meetings.</p>",
      example:
        "<p>A team building a system to \"summarize one uploaded document\" reaches for a multi-agent pipeline — a research agent, a summarizer agent, and a formatter agent — coordinated through a framework, when a single agent with a summarization prompt and no additional tools would have produced the same quality result in a fraction of the time and cost. The multi-agent version isn't wrong, exactly, but it's solving a problem the task didn't actually have.</p>",
      takeaways: [
        "LangGraph, AutoGen, CrewAI, and provider-native SDKs implement the same orchestration patterns from this Part with different levels of structure and abstraction — the choice affects developer experience, not which patterns are possible.",
        "Framework choice is a secondary decision; the primary one is whether a task needs multiple agents at all.",
        "Multi-agent systems add real cost: more tokens, more latency from coordination, and more failure surface, including communication failures that are their own distinct problem (Chapter 3).",
        "Multi-agent orchestration earns its cost when a task genuinely separates into distinct expertise areas, benefits from independent parallel attempts, or exceeds what a single agent's context and focus can handle.",
        "A substantial fraction of tasks people reach for multi-agent systems to solve would be handled just as well, and more cheaply, by a single well-designed agent from Part IV.",
      ],
      quiz: [
        {
          q: "What do frameworks like LangGraph, AutoGen, and CrewAI fundamentally provide?",
          options: [
            "Entirely new orchestration patterns not covered in this Part",
            "Different levels of structure and abstraction over the same underlying patterns — sequential, supervisor, hierarchical, parallel, debate, blackboard",
            "A way to avoid using LLMs entirely",
            "A single universally correct orchestration pattern",
          ],
          answer: 1,
          explain: "These frameworks implement the same fundamental patterns with different developer experience and abstraction levels, not new algorithms.",
        },
        {
          q: "What is described as the more consequential decision than which framework to use?",
          options: [
            "Which programming language to write the agents in",
            "Whether the task actually needs multiple agents at all",
            "How many GPUs to provision",
            "Which embedding model to use",
          ],
          answer: 1,
          explain: "Framework choice is secondary — the primary decision is whether multi-agent coordination is even warranted for the task.",
        },
        {
          q: "What real costs do multi-agent systems add compared to a single well-designed agent?",
          options: [
            "None — multi-agent systems are always strictly better",
            "More tokens, more latency from coordination, and more failure surface, including communication failures",
            "Only latency, with no effect on cost or reliability",
            "Multi-agent systems remove the need for tools",
          ],
          answer: 1,
          explain: "Every added agent and handoff introduces real token cost, coordination latency, and additional places for something to go wrong.",
        },
        {
          q: "According to the practical rule of thumb in this chapter, when does multi-agent orchestration earn its cost?",
          options: [
            "Always, regardless of task",
            "When a task genuinely separates into distinct expertise areas, benefits from parallel attempts, or exceeds a single agent's context/focus",
            "Only when the task is very simple",
            "Only when no tools are available",
          ],
          answer: 1,
          explain: "These are the conditions under which the added coordination cost is actually justified by real benefit.",
        },
        {
          q: "What mistake does the \"summarize one document\" example illustrate?",
          options: [
            "Using too few agents for a genuinely complex task",
            "Reaching for a multi-agent pipeline on a task simple enough for one focused agent to handle just as well, at a fraction of the cost",
            "Failing to use any orchestration framework",
            "Using MCP unnecessarily",
          ],
          answer: 1,
          explain: "The multi-agent version wasn't wrong, exactly — it just solved a coordination problem the task never actually had.",
        },
      ],
    },
  ],
};

window.PARTS = window.PARTS || {};
window.PARTS[window.PART_DATA.id] = window.PART_DATA;
