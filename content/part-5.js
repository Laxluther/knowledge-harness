/* ============================================================
   Content data - Part V: Multi-Agent & Orchestration
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
    first: { id: "p5-first", label: "First Handoff - completed your first Part V chapter" },
    complete: { id: "p5-complete", label: "Orchestrator - cleared all of Part V" },
  },
  chapters: [
    {
      id: "p5-c1",
      plain: "<p>When one agent isn't enough, you use several - and how you arrange them matters. An assembly line passing work along, a manager handing out tasks, an org chart of sub-teams, and a receptionist sending you to the right desk are four common shapes, each suited to different jobs.</p>",
      n: 1,
      title: "Orchestration Patterns I - Sequential, Supervisor, Hierarchical & Router",
      short: "The assembly line, the manager, the org chart, and the receptionist",
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
        statusSteps: ["Drafter hands off to editor", "Editor hands to publisher", "Post published"],
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
          "Delegates the research task",
          "Delegates the writing task",
          "Delegates the review task",
          "Workers report back",
          "Manager combines results",
        ],
      },
      diagram3: {
        type: "crew",
        task: "Ship a feature: research, build, and document it",
        nodes: [
          { id: "vp", label: "Director", role: "captain", tier: 0 },
          { id: "s1", label: "Eng Lead", tier: 1 },
          { id: "s2", label: "Docs Lead", tier: 1 },
          { id: "w1", label: "Backend", tier: 2 },
          { id: "w2", label: "Frontend", tier: 2 },
          { id: "w3", label: "Writer", tier: 2 },
        ],
        flow: [
          { from: "vp", to: "s1" },
          { from: "s1", to: "w1" },
          { from: "s1", to: "w2" },
          { from: "vp", to: "s2" },
          { from: "s2", to: "w3" },
        ],
        roundTrip: true,
        statusSteps: [
          "Delegates build to Eng Lead",
          "Eng Lead: backend work",
          "Eng Lead: frontend work",
          "Delegates the docs track",
          "Docs Lead assigns writer",
          "Leads report up, not across",
          "Director assembles result",
        ],
      },
      diagram4: {
        type: "figure",
        title: "Router (handoff) orchestration",
        svg: `<svg viewBox="0 0 360 200" role="img" aria-label="A router agent classifies a request and hands it to exactly one specialist">
          <defs>
            <marker id="rt-a" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--line-bright)"/></marker>
            <marker id="rt-i" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--ion)"/></marker>
          </defs>
          <rect x="6" y="82" width="74" height="36" rx="7" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="2"/>
          <text x="43" y="97" text-anchor="middle" font-size="9">"My card was</text>
          <text x="43" y="110" text-anchor="middle" font-size="9">charged twice"</text>
          <line x1="80" y1="100" x2="112" y2="100" stroke="var(--line-bright)" stroke-width="2" marker-end="url(#rt-a)"/>
          <rect x="116" y="78" width="72" height="44" rx="8" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="2"/>
          <text x="152" y="96" text-anchor="middle" font-size="10">Router</text>
          <text x="152" y="110" text-anchor="middle" font-size="8" fill="var(--text-faint)">classify intent</text>
          <line x1="188" y1="90" x2="248" y2="34" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="4 4" marker-end="url(#rt-a)"/>
          <line x1="188" y1="100" x2="248" y2="100" class="fig-flow" stroke="var(--ion)" stroke-width="2.4" marker-end="url(#rt-i)"/>
          <line x1="188" y1="110" x2="248" y2="166" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="4 4" marker-end="url(#rt-a)"/>
          <rect x="252" y="18" width="102" height="32" rx="6" fill="var(--panel-raised)" stroke="var(--line)" stroke-width="1.6"/>
          <text x="303" y="38" text-anchor="middle" font-size="9" fill="var(--text-faint)">Tech Support Agent</text>
          <rect x="252" y="84" width="102" height="32" rx="6" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="2.2"/>
          <text x="303" y="104" text-anchor="middle" font-size="9">Billing Agent</text>
          <rect x="252" y="150" width="102" height="32" rx="6" fill="var(--panel-raised)" stroke="var(--line)" stroke-width="1.6"/>
          <text x="303" y="170" text-anchor="middle" font-size="9" fill="var(--text-faint)">Sales Agent</text>
        </svg>`,
        caption: "The router reads the request, decides which single specialist owns it, and hands the whole conversation over. Unlike a supervisor, it doesn't split work or recombine results - it picks one owner and steps out of the way.",
      },
      hook: "<p>One agent, looping, got you far in Part IV. Some tasks are too big, too varied, or too specialized for one agent to handle alone - which is exactly when you start needing more than one, and a real decision about how they coordinate.</p>",
      explain: `<p>Multi-agent systems exist because a single agent juggling everything - research, writing, coding, review - tends to do all of it a little worse than several agents, each specialized and prompted for one job, the same reason human organizations divide labor rather than having one generalist do everything. But adding agents adds coordination overhead and cost, so which orchestration pattern you choose is a real design decision, not a default.</p>
      <p><strong>Sequential (pipeline) orchestration</strong> runs agents in a fixed chain, where each agent's output becomes the next agent's input - agent A drafts, agent B edits, agent C publishes. Simple, predictable, and easy to debug, since failures are localized to one stage - but rigid: there's no way to route around a stage or handle a task that doesn't fit the fixed sequence.</p>
      <p><strong>Supervisor (orchestrator-worker) orchestration</strong> has a manager agent receive the overall task, decide how to break it into sub-tasks, and delegate each one to a specialized worker agent - then collect and combine the results. This is the classic "manager handing tasks to employees" pattern: the manager doesn't do the specialized work itself, it decides who does what and synthesizes the outcome. It's more flexible than sequential - the manager can decide, at runtime, which workers are needed and in what combination - at the cost of needing a manager capable of good task decomposition (Part IV, Chapter 4) and result synthesis.</p>
      <p><strong>Hierarchical orchestration</strong> extends the supervisor pattern to multiple levels - a top-level manager delegates to mid-level supervisors, each of whom manages their own team of workers, mirroring a real organizational chart. This scales supervisor orchestration to much larger agent teams without any single manager needing to track every worker directly - each supervisor only coordinates its own sub-team, applying the same divide-and-conquer reasoning that motivated multi-agent systems in the first place, now applied recursively to the coordination layer itself.</p>
      <p><strong>Router (handoff) orchestration</strong> is the one people most often confuse with the supervisor pattern, and the difference matters. A router agent's only job is <em>classification</em>: read the incoming request, decide which single specialist agent owns it, and hand the whole conversation over - then get out of the way. It doesn't decompose the task, doesn't delegate several pieces, and doesn't recombine results, which is exactly what a supervisor does. Routing is cheap (one small classification call), keeps each specialist's prompt narrow and focused, and fails in an obvious way when it fails: a misrouted request lands with the wrong specialist, which is far easier to spot and fix than a supervisor that silently decomposed a task badly. Many production "multi-agent" systems are really just a router in front of three or four well-written single agents - and that's frequently the right amount of machinery.</p>
      <p>Routing also composes with everything above. A router can hand off to a <em>pipeline</em> rather than a single agent, or to a supervisor that then delegates further; and some frameworks let the receiving specialist hand back to the router when it decides the request isn't actually its problem, which turns a one-shot dispatch into a small dynamic network. The practical rule: use a router when requests fall into distinct categories that need different expertise, and a supervisor when a single request needs several kinds of work combined.</p>
      <p>The shared thread across all four: information flows through explicit, structured handoffs - a clear boundary of what one agent passes to the next - which is what makes debugging tractable. You can always point to which specific handoff produced a bad result, unlike a single sprawling agent transcript.</p>`,
      analogy:
        "<p>Sequential is an assembly line - parts move down the line, each station does one job, in order. Supervisor is a manager assigning tasks to a team of specialists and compiling their work into one final report. Hierarchical is a manager of managers - a VP who doesn't talk to individual engineers directly, only to team leads, who each talk to their own engineers. Router is the receptionist at the front desk: they don't solve your problem or split it up, they just work out which department you need and send you there.</p>",
      example:
        "<p>A \"market analysis report\" task given to a supervisor-style system: the manager agent decomposes it into \"research current market data,\" \"write the report draft,\" and \"review for accuracy,\" delegates each to a specialized agent, and once all three report back, combines their outputs into a final polished document - never doing the research or writing itself, only deciding who does what and stitching the results together.</p>",
      takeaways: [
        "Multi-agent systems trade added coordination overhead for specialization - worth it when a task genuinely benefits from divided, focused expertise, not by default.",
        "Sequential orchestration is a fixed chain of handoffs - simple and predictable, but rigid.",
        "Supervisor orchestration has a manager agent decompose a task, delegate to specialized workers, and synthesize their results - the classic manager-and-employees pattern.",
        "Hierarchical orchestration nests supervisor patterns across multiple levels, scaling coordination to much larger agent teams without any single manager tracking every worker directly.",
        "Router (handoff) orchestration classifies a request and hands it to exactly one specialist - it does not decompose or recombine work, which is precisely what separates it from a supervisor.",
        "Use a router when requests fall into distinct categories needing different expertise; use a supervisor when one request needs several kinds of work combined.",
        "All four rely on explicit, structured handoffs between agents, which is what keeps a multi-agent system debuggable.",
      ],
      quiz: [
        {
          q: "Why do multi-agent systems exist instead of just using one larger agent?",
          options: [
            "Because multi-agent systems are always cheaper",
            "Because a single agent cannot use memory",
            "Several specialized agents, each focused on one job, tend to outperform one generalist agent juggling everything - the same reasoning behind human division of labor",
            "Because single agents cannot call tools",
          ],
          answer: 2,
          explain: "Specialization is the core motivation, but it comes with real added coordination cost - not a free upgrade.",
        },
        {
          q: "What is the defining feature of sequential (pipeline) orchestration?",
          options: [
            "Agents communicate through a shared blackboard",
            "There is no defined order between agents",
            "Agents vote on the final answer",
            "Agents run in a fixed chain, where each agent's output becomes the next agent's input",
          ],
          answer: 3,
          explain: "Sequential orchestration is a fixed handoff chain - simple and predictable, but rigid to tasks that don't fit that exact order.",
        },
        {
          q: "In supervisor orchestration, what role does the manager agent actually play?",
          options: [
            "It replaces the need for worker agents entirely",
            "It performs all the specialized work itself",
            "It decomposes the task, delegates sub-tasks to specialized workers, and synthesizes their results - without doing the specialized work itself",
            "It only monitors, with no ability to assign tasks",
          ],
          answer: 2,
          explain: "The manager's job is decomposition, delegation, and synthesis - the actual specialized work happens in the worker agents.",
        },
        {
          q: "How does hierarchical orchestration scale beyond plain supervisor orchestration?",
          options: [
            "It only works with exactly two agents",
            "It nests supervisor patterns across multiple levels, so no single manager needs to track every worker directly",
            "It replaces delegation with a shared blackboard",
            "It removes the need for a manager entirely",
          ],
          answer: 1,
          explain: "Adding intermediate supervisors lets coordination scale to much larger teams without overloading one top-level manager.",
        },
        {
          q: "What separates a router (handoff) from a supervisor?",
          options: [
            "A router is simply a supervisor with more workers",
            "A router classifies the request and hands it to exactly one specialist, without decomposing the task or recombining results",
            "A router performs all the specialized work itself",
            "A router can only be used with a single specialist agent",
          ],
          answer: 1,
          explain: "Routing is pure classification and dispatch - decomposition and synthesis are what make a supervisor a supervisor.",
        },
        {
          q: "You're building support automation where requests are clearly either billing, technical, or sales questions. Which pattern fits best?",
          options: [
            "A hierarchy with several levels of managers",
            "A supervisor, so it can decompose every request into sub-tasks",
            "A sequential pipeline through all three specialists in order",
            "A router, since requests fall into distinct categories each needing different expertise",
          ],
          answer: 3,
          explain: "Distinct categories needing different expertise is exactly the router's case; a supervisor earns its cost when one request needs several kinds of work combined.",
        },
        {
          q: "What do sequential, supervisor, hierarchical, and router orchestration all share, and why does it matter?",
          options: [
            "They all require exactly three agents",
            "They all skip task decomposition",
            "They all rely on explicit, structured handoffs between agents, which is what keeps a multi-agent system debuggable",
            "They all avoid tool calling",
          ],
          answer: 2,
          explain: "Clear handoff boundaries let you localize which specific step produced a bad result, unlike one sprawling agent transcript.",
        },
      ],
    },
    {
      id: "p5-c2",
      plain: "<p>Sometimes agents work best all at once (in parallel), by debating to catch each other's mistakes, by one drafting while another critiques, by planning first and then executing, or by leaving notes on a shared board for others to pick up. Different collaboration styles for different problems - much like human teams.</p>",
      n: 2,
      title: "Orchestration Patterns II - Parallel, Debate, Critic, Plan-Execute & Blackboard",
      short: "When agents work at once, argue, critique, plan, or leave notes",
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
          "Dispatches to all three at once",
          "All three work concurrently",
          "All report back at once",
          "Coordinator merges the results",
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
          "Logs agent posts a finding",
          "Metrics agent posts too",
          "Full picture emerges",
        ],
      },
      diagram3: {
        type: "figure",
        title: "Debate (adversarial) orchestration",
        svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Two agents argue opposing sides over several rounds, then a judge decides">
          <defs>
            <marker id="db-a" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--amber)"/></marker>
            <marker id="db-i" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--ion)"/></marker>
          </defs>
          <rect x="10" y="26" width="104" height="40" rx="7" fill="var(--panel-raised)" stroke="var(--ion)" stroke-width="2"/>
          <text x="62" y="43" text-anchor="middle" font-size="10">Agent FOR</text>
          <text x="62" y="57" text-anchor="middle" font-size="8" fill="var(--text-faint)">argues to adopt</text>
          <rect x="246" y="26" width="104" height="40" rx="7" fill="var(--panel-raised)" stroke="var(--amber)" stroke-width="2"/>
          <text x="298" y="43" text-anchor="middle" font-size="10">Agent AGAINST</text>
          <text x="298" y="57" text-anchor="middle" font-size="8" fill="var(--text-faint)">argues to reject</text>
          <path d="M 118 38 L 242 38" class="fig-flow" stroke="var(--ion)" stroke-width="2" fill="none" marker-end="url(#db-i)"/>
          <path d="M 242 56 L 118 56" class="fig-flow" stroke="var(--amber)" stroke-width="2" fill="none" marker-end="url(#db-a)"/>
          <text x="180" y="34" text-anchor="middle" font-size="8" fill="var(--text-faint)">claim</text>
          <text x="180" y="70" text-anchor="middle" font-size="8" fill="var(--text-faint)">rebuttal</text>
          <text x="180" y="88" text-anchor="middle" font-size="8" fill="var(--text-faint)">- repeat for 2-3 rounds -</text>
          <line x1="62" y1="66" x2="160" y2="126" stroke="var(--line-bright)" stroke-width="1.6" stroke-dasharray="4 4"/>
          <line x1="298" y1="66" x2="200" y2="126" stroke="var(--line-bright)" stroke-width="1.6" stroke-dasharray="4 4"/>
          <rect x="118" y="130" width="124" height="34" rx="7" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="2"/>
          <text x="180" y="151" text-anchor="middle" font-size="10">Judge agent</text>
          <line x1="180" y1="164" x2="180" y2="176" stroke="var(--ion)" stroke-width="2" marker-end="url(#db-i)"/>
          <text x="180" y="192" text-anchor="middle" font-size="9">verdict, with the strongest reasoning surfaced</text>
        </svg>`,
        caption: "Two agents are deliberately assigned opposing positions and exchange claims and rebuttals for a few rounds. A separate judge agent - which never generated either argument, so isn't anchored to defending one - reads the exchange and decides.",
      },
      diagram4: {
        type: "crew",
        task: "Write marketing copy that survives review",
        nodes: [
          { id: "gen", label: "Generator", tier: 0 },
          { id: "crit", label: "Critic", role: "captain", tier: 1 },
        ],
        flow: [{ from: "gen", to: "crit" }],
        roundTrip: true,
        statusSteps: [
          "Generator drafts a version",
          "Critic scores it, lists flaws",
          "Feedback goes back to draft",
          "Generator revises on it",
          "Loop until the critic passes",
        ],
      },
      diagram5: {
        type: "figure",
        title: "Plan-and-execute orchestration",
        svg: `<svg viewBox="0 0 360 200" role="img" aria-label="A planner writes a full plan, an executor runs each step, and replans when a step fails">
          <defs>
            <marker id="pe-a" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--amber)"/></marker>
            <marker id="pe-i" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--ion)"/></marker>
          </defs>
          <rect x="10" y="12" width="94" height="40" rx="7" fill="var(--amber-dim)" stroke="var(--amber)" stroke-width="2"/>
          <text x="57" y="30" text-anchor="middle" font-size="10">Planner</text>
          <text x="57" y="44" text-anchor="middle" font-size="8" fill="var(--text-faint)">writes all steps</text>
          <line x1="104" y1="32" x2="136" y2="32" stroke="var(--amber)" stroke-width="2" marker-end="url(#pe-a)"/>
          <rect x="140" y="8" width="210" height="48" rx="7" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="1.8"/>
          <text x="150" y="26" font-size="9" fill="var(--text-faint)">1. pull Q3 numbers</text>
          <text x="150" y="39" font-size="9" fill="var(--text-faint)">2. build the chart</text>
          <text x="150" y="52" font-size="9" fill="var(--text-faint)">3. write the summary</text>
          <line x1="245" y1="56" x2="245" y2="84" class="fig-flow" stroke="var(--amber)" stroke-width="2" marker-end="url(#pe-a)"/>
          <rect x="140" y="88" width="210" height="40" rx="7" fill="var(--panel-raised)" stroke="var(--ion)" stroke-width="2"/>
          <text x="245" y="105" text-anchor="middle" font-size="10">Executor</text>
          <text x="245" y="119" text-anchor="middle" font-size="8" fill="var(--text-faint)">runs one step at a time</text>
          <path d="M 140 108 L 57 108 L 57 60" class="fig-flow" stroke="var(--ion)" stroke-width="2" fill="none" marker-end="url(#pe-i)"/>
          <text x="66" y="86" font-size="8" fill="var(--ion)">step failed →</text>
          <text x="66" y="98" font-size="8" fill="var(--ion)">re-plan</text>
          <line x1="245" y1="128" x2="245" y2="152" stroke="var(--amber)" stroke-width="2" marker-end="url(#pe-a)"/>
          <rect x="150" y="156" width="190" height="30" rx="7" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="1.8"/>
          <text x="245" y="175" text-anchor="middle" font-size="9">finished report</text>
        </svg>`,
        caption: "The planner commits the whole sequence up front, so the expensive reasoning happens once instead of at every step. The executor just runs steps - and only when one fails does control go back for a re-plan.",
      },
      diagram6: {
        type: "figure",
        title: "Decentralized / market-based coordination",
        svg: `<svg viewBox="0 0 360 190" role="img" aria-label="Agents bid on an announced task with no central coordinator">
          <defs>
            <marker id="mk-i" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="var(--ion)"/></marker>
          </defs>
          <rect x="108" y="8" width="144" height="30" rx="7" fill="var(--panel-raised)" stroke="var(--line-bright)" stroke-width="2"/>
          <text x="180" y="27" text-anchor="middle" font-size="9">task announced to all</text>
          <line x1="140" y1="38" x2="66" y2="76" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3 3"/>
          <line x1="180" y1="38" x2="180" y2="76" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3 3"/>
          <line x1="220" y1="38" x2="294" y2="76" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3 3"/>
          <rect x="20" y="80" width="92" height="38" rx="7" fill="var(--ion-dim)" stroke="var(--ion)" stroke-width="2.2"/>
          <text x="66" y="96" text-anchor="middle" font-size="9">Agent A</text>
          <text x="66" y="110" text-anchor="middle" font-size="9" fill="var(--ion)">bid: 0.9 conf</text>
          <rect x="134" y="80" width="92" height="38" rx="7" fill="var(--panel-raised)" stroke="var(--line)" stroke-width="1.6"/>
          <text x="180" y="96" text-anchor="middle" font-size="9" fill="var(--text-faint)">Agent B</text>
          <text x="180" y="110" text-anchor="middle" font-size="9" fill="var(--text-faint)">bid: 0.4 conf</text>
          <rect x="248" y="80" width="92" height="38" rx="7" fill="var(--panel-raised)" stroke="var(--line)" stroke-width="1.6"/>
          <text x="294" y="96" text-anchor="middle" font-size="9" fill="var(--text-faint)">Agent C</text>
          <text x="294" y="110" text-anchor="middle" font-size="9" fill="var(--text-faint)">no bid</text>
          <line x1="66" y1="118" x2="66" y2="146" class="fig-flow" stroke="var(--ion)" stroke-width="2" marker-end="url(#mk-i)"/>
          <rect x="16" y="150" width="328" height="30" rx="7" fill="var(--panel-raised)" stroke="var(--ion)" stroke-width="1.8"/>
          <text x="180" y="169" text-anchor="middle" font-size="9">highest bidder self-assigns - nobody handed it out</text>
        </svg>`,
        caption: "No coordinator exists. A task is announced, agents that judge themselves capable bid, and the winner takes it. Powerful for large open-ended agent populations - and correspondingly hard to predict and debug.",
      },
      hook: "<p>Not every multi-agent task is a chain of command. Sometimes agents work at the same time, argue with each other, or just leave notes on a shared board for whoever needs them.</p>",
      explain: `<p><strong>Parallel orchestration (fan-out / fan-in)</strong> dispatches a task - the same task, or independent sub-tasks - to multiple agents simultaneously, then waits for all of them and merges the results. It's used for speed (independent work happens concurrently instead of one at a time) or for redundancy: multiple agents attempt the same task independently, and their answers are combined or voted on, similar in spirit to Part II's self-consistency, but across separate agents instead of separate sampled reasoning paths from one model. The cost is real - running N agents in parallel multiplies token and compute cost roughly by N - so this pattern earns its keep when speed or the reliability gain from redundancy justifies that multiplier.</p>
      <p><strong>Debate (adversarial) orchestration</strong> gives two or more agents deliberately different perspectives, or instructs them to critique each other's answer, going back and forth for a few rounds before a final answer is settled - either by a judge agent, or by the agents converging on agreement. This surfaces flaws a single agent's self-review might miss, since a dedicated critic, unburdened by having generated the original answer, isn't anchored to defending it. It's a multi-agent analog to Part IV's Reflexion - but the critique now comes from a genuinely different agent's perspective, not the same agent second-guessing itself.</p>
      <p><strong>Blackboard orchestration</strong> has agents read from and write to one shared workspace rather than messaging each other directly. Each agent monitors the board and contributes when it has something relevant to add, with no fixed order or central coordinator deciding who goes when. This suits problems where the right sequence of contributions isn't known in advance - a diagnostic task where a logs agent, a metrics agent, and a config agent each contribute findings opportunistically as they become available, and the full picture only emerges once enough pieces accumulate.</p>
      <p><strong>Evaluator-optimizer (generator-critic) orchestration</strong> pairs exactly two agents in a tight loop: one generates a candidate, the other evaluates it against explicit criteria and returns concrete, actionable feedback, and the generator revises. The loop repeats until the critic passes the work or a round limit is hit. It looks similar to debate, but the relationship is different in a way that matters: debate is symmetric - two peers arguing opposing positions for a judge - whereas generator-critic is asymmetric and hierarchical, with one agent owning production and the other owning quality, and no third party needed. Its power comes from the same asymmetry that makes human editing work: judging whether a draft meets a standard is a genuinely easier task than producing the draft, so a critic can reliably catch problems its generator couldn't avoid. It shines wherever quality criteria can be stated clearly - code that must compile and pass tests, copy that must hit a tone and length, a translation that must preserve meaning. Two cautions: always cap the iterations, because a critic can always find something else to nitpick and the loop will happily run forever; and keep the criteria explicit, since a vague critic produces vague feedback that makes each revision worse rather than better.</p>
      <p><strong>Plan-and-execute orchestration</strong> splits the roles by <em>time</em> rather than by specialty. A planner agent reads the goal once and commits a complete, ordered plan up front; an executor agent then works through those steps mechanically, one at a time, without re-deliberating the whole task at each move. This is the multi-agent form of the planning idea from Part IV, Chapter 4, and its main benefit is economic: the expensive, high-capability reasoning happens once, in the planner, while each step can run on a cheaper, faster model. It also makes the agent's intent inspectable before any action is taken - you can read the plan, and even require human approval of it (Part VI, Chapter 4), which you can't do with an agent that decides its next move only after each observation. The tradeoff is rigidity: a plan written before any step has run is a set of assumptions about a world the agent hasn't observed yet. Real implementations therefore keep a re-planning path - when a step fails or returns something the plan didn't anticipate, control returns to the planner to revise the remaining steps rather than blindly continuing down a plan that reality has already invalidated.</p>
      <p>At the far end of the spectrum sits <strong>decentralized / market-based orchestration</strong>, where there is no coordinator at all. A task is announced to the whole population, agents that judge themselves capable submit a bid - a confidence score, a cost estimate, or a claim of relevant capability - and the winning bidder self-assigns the work. This is the classic contract-net protocol reborn for LLM agents. It's genuinely powerful when the agent population is large, open-ended, or changing at runtime, because no central component needs to maintain a registry of who can do what. It's also the hardest pattern to predict, debug, and cost-control, since behavior emerges from local decisions rather than an explicit plan - which is why it remains rare in production compared with the more structured patterns above.</p>
      <p>Choosing between all the patterns in this Part comes down to the actual shape of the task: a fixed sequence wants sequential; distinct request categories want a router; independent specialties combined into one result want supervisor; very large teams want hierarchical; independent attempts merged for speed or confidence want parallel; a decision benefiting from adversarial scrutiny wants debate; work with clear quality criteria wants generator-critic; long multi-step jobs where reasoning is expensive want plan-and-execute; unpredictable contributions want blackboard; and a large, open-ended agent population wants market-based bidding. The most common mistake is not picking the wrong one from this list - it's reaching for any of them when a single well-prompted agent would have done the job.</p>`,
      analogy:
        "<p>Parallel is assigning the same question to three employees independently and comparing their answers before picking the best one. Debate is two lawyers arguing opposite sides in front of a judge. Generator-critic is a writer and their editor - the editor never writes the piece, they just keep sending it back with notes until it's good enough. Plan-and-execute is a project manager who writes the whole build schedule on Monday morning, then a crew that works the schedule all week and only calls the manager back when something on site doesn't match the plan. Blackboard is a shared whiteboard in an incident-response war room - nobody's in charge of ordering who writes on it, people just add what they know as they figure it out. Market-based is a job board: the work gets posted, whoever thinks they can do it puts their hand up, and nobody assigned it to them.</p>",
      example:
        "<p>Diagnosing a production outage with a blackboard pattern: a logs-analysis agent posts \"error spike started at 14:02\" as soon as it finds it, a metrics agent independently posts \"CPU normal, network latency spiked at 14:01\" a moment later, and a config-history agent posts \"a deployment went out at 14:00\" - no agent waited for permission or a turn, but once enough findings accumulate, the full incident timeline is reconstructable from pieces contributed in whatever order they were discovered.</p>",
      takeaways: [
        "Parallel orchestration dispatches work to multiple agents simultaneously for speed or redundancy, at a real cost multiplier roughly proportional to the number of agents used.",
        "Debate orchestration has agents critique or argue against each other's answers, surfacing flaws a single agent's self-review tends to miss - a multi-agent analog to Reflexion (Part IV).",
        "Blackboard orchestration lets agents contribute to a shared workspace opportunistically, with no fixed order or central coordinator, suited to tasks whose right sequence of contributions isn't known in advance.",
        "Evaluator-optimizer (generator-critic) pairs a producer with a quality-owner in a revision loop - asymmetric, unlike debate's two peers - and works because judging a draft is easier than writing one. Always cap the iterations and state the criteria explicitly.",
        "Plan-and-execute splits roles by time: a planner commits the full sequence up front so expensive reasoning happens once, and a cheaper executor runs the steps - with a re-planning path for when reality contradicts the plan.",
        "Plan-and-execute also makes intent inspectable before any action runs, which is what allows human approval of the plan itself.",
        "Decentralized/market-based coordination has no coordinator at all - tasks are announced, agents bid, the winner self-assigns. Powerful for large open-ended populations, but the hardest to predict, debug, and cost-control.",
        "The right pattern follows the actual shape of the task - and the most common mistake is reaching for any multi-agent pattern when one well-prompted agent would have done the job.",
      ],
      quiz: [
        {
          q: "What does parallel (fan-out/fan-in) orchestration trade off for speed or redundancy?",
          options: [
            "Token and compute cost roughly multiplied by the number of agents dispatched",
            "The need for a coordinator",
            "Nothing, it's strictly free",
            "The ability to use tools"
          ],
          answer: 0,
          explain: "Running N agents concurrently multiplies real resource cost by roughly N, which needs to be justified by the speed or reliability gained.",
        },
        {
          q: "Why can debate orchestration surface flaws a single agent's self-review misses?",
          options: [
            "Because debate uses more tools",
            "Because debate removes the need for any final answer",
            "A dedicated critic agent isn't anchored to defending an answer it didn't generate itself, unlike the original agent reviewing its own work",
            "Because debate always produces a longer answer"
          ],
          answer: 2,
          explain: "An agent reviewing its own output can be biased toward defending it; a separate critic has no such attachment.",
        },
        {
          q: "What makes blackboard orchestration different from supervisor orchestration?",
          options: [
            "Blackboard has no shared workspace at all",
            "Blackboard is identical to sequential orchestration",
            "Agents contribute to a shared workspace opportunistically with no fixed order or central coordinator, rather than being explicitly delegated tasks",
            "Blackboard requires exactly two agents"
          ],
          answer: 2,
          explain: "Blackboard suits tasks where the right order of contributions isn't known upfront, unlike supervisor's explicit delegation.",
        },
        {
          q: "Why is decentralized/market-based orchestration described as less common in production today?",
          options: [
            "Because it cannot use tools",
            "Because it's harder to predict and debug than more structured patterns, despite being powerful for large open-ended agent populations",
            "Because it never works",
            "Because it requires only one agent"
          ],
          answer: 1,
          explain: "The lack of central coordination that makes it powerful at scale also makes its behavior harder to predict and debug.",
        },
        {
          q: "How does evaluator-optimizer (generator-critic) differ structurally from debate?",
          options: [
            "They are two names for the same pattern",
            "Debate is symmetric - two peers arguing for a judge - while generator-critic is asymmetric, with one agent owning production and the other owning quality, needing no third party",
            "Debate never involves more than one agent",
            "Generator-critic requires at least four agents"
          ],
          answer: 1,
          explain: "The asymmetry is the point: judging whether a draft meets a standard is an easier task than producing the draft, which is why a critic reliably catches what its generator missed.",
        },
        {
          q: "What is the most important safeguard when running a generator-critic loop?",
          options: [
            "Capping the iterations and stating the quality criteria explicitly, since a critic can always find another nitpick and vague feedback degrades revisions",
            "Using the same agent for both roles",
            "Running exactly one revision and stopping",
            "Never letting the critic see the criteria"
          ],
          answer: 0,
          explain: "Uncapped loops run forever on diminishing nitpicks, and vague criteria produce vague feedback that makes each revision worse rather than better.",
        },
        {
          q: "What is the main economic benefit of plan-and-execute orchestration?",
          options: [
            "It eliminates the need for tools",
            "It guarantees the plan is always correct",
            "It removes the need for any planning",
            "The expensive high-capability reasoning happens once in the planner, so each step can run on a cheaper, faster model"
          ],
          answer: 3,
          explain: "Splitting roles by time concentrates the costly deliberation in a single up-front planning call instead of repeating it at every step.",
        },
        {
          q: "Why do real plan-and-execute systems keep a re-planning path?",
          options: [
            "Because planners cannot write more than one step",
            "To make the system slower on purpose",
            "Because a plan written before any step has run encodes assumptions about an unobserved world, so a failed or surprising step needs the remaining plan revised rather than blindly continued",
            "Because executors are unable to run tools"
          ],
          answer: 2,
          explain: "Rigidity is the pattern's core tradeoff; the re-planning path is what keeps it from marching down a plan reality has already invalidated.",
        },
        {
          q: "How should the choice between all five orchestration patterns (across both chapters) generally be made?",
          options: [
            "Based on the actual shape of the task - a fixed sequence, independent specialties, redundant attempts, adversarial scrutiny, or unpredictable contributions each favor a different pattern",
            "Based only on which framework is most popular",
            "Always default to the most complex pattern available",
            "Randomly, since all patterns perform identically"
          ],
          answer: 0,
          explain: "Each pattern fits a different task shape - the decision should follow the nature of the problem, not a default preference.",
        },
      ],
    },
    {
      id: "p5-c3",
      plain: "<p>If agents are going to work together, they need a shared way to talk - agreed formats and rules - or messages get garbled. Same reason people on a project need a common language and clean hand-offs.</p>",
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
      hook: "<p>Every orchestration pattern in the last two chapters assumed agents could actually pass information to each other cleanly. That's not automatic - it's a design problem of its own.</p>",
      explain: `<p>There are two broad approaches to how agents actually share information. <strong>Shared state / shared context</strong> has agents read and write to a common data structure - the blackboard pattern is an extreme version of this. <strong>Direct message passing</strong> has agents send explicit messages to specific other agents, with a defined sender, recipient, and content - closer to how the supervisor and sequential patterns actually move information.</p>
      <p>A useful message between agents typically carries more than raw text: the actual content or payload, metadata about who sent it and in what role, and often structured fields - echoing Part II Chapter 5's structured-output ideas - so the receiving agent can parse and act on it reliably rather than re-interpreting free text.</p>
      <p>This raises a practical problem directly: without any shared standard, every pair of agent types needs its own bespoke message format, and connecting agent A to agent B - built by different teams, using different frameworks - means writing custom translation code for every new pairing. As the number of distinct agent types grows, that becomes an N² integration problem.</p>
      <p>This motivates <strong>standardized agent communication protocols</strong> - agreed-upon message formats and interaction rules so any conforming agent can talk to any other conforming agent without custom glue code, the same motivation that led to standardized network protocols like HTTP, or standardized tool-calling formats (Part II, Chapter 5), rather than every application inventing its own. Emerging efforts in this space, broadly referred to as agent-to-agent (A2A-style) protocols, aim to standardize how independent agents discover each other's capabilities, exchange tasks, and report results - conceptually the same tool-calling idea from Part II, but between peer agents rather than between one agent and a fixed set of tools.</p>
      <p>Two practical realities are worth naming. Communication is not free - every message is real tokens moving through real context windows, so a chatty multi-agent system can burn through budget on coordination overhead alone, independent of the actual task work. And communication failures are a real failure mode of their own: an agent misinterpreting another agent's message, or a message being dropped or malformed, can silently corrupt a multi-agent system's output in ways that are harder to trace than a single agent's error, precisely because the fault could be in either agent or in the handoff between them.</p>`,
      analogy:
        "<p>Two people who've worked together for years communicate in shorthand and rarely misunderstand each other. Two strangers speaking different native languages need either a shared common language or a translator for every exchange - standardized agent communication protocols are the shared language that lets independently-built agents work together without a bespoke translator for every new pairing.</p>",
      example:
        "<p>A research agent built by one team needs to hand results to a report-writing agent built by a different team, using a different framework. Without a shared protocol, connecting them means writing custom code to convert one agent's output format into what the other expects - for every new pair introduced, another custom translator. A standardized protocol means both agents already speak the same format, and no bespoke integration code is needed at all.</p>",
      takeaways: [
        "Agents share information either through shared state (like the blackboard pattern) or direct message passing (closer to supervisor/sequential patterns) - different tradeoffs for different orchestration shapes.",
        "A useful agent message carries not just content, but metadata about sender/role and structured fields the receiver can parse reliably.",
        "Without a shared standard, connecting many distinct agent types becomes an N² integration problem of bespoke translators.",
        "Standardized communication protocols let independently-built agents interoperate without custom glue code - the same motivation behind standardized tool-calling formats (Part II).",
        "Communication has a real token cost, and communication failures - misinterpretation, dropped or malformed messages - are a distinct failure mode, often harder to trace than a single agent's own error.",
      ],
      quiz: [
        {
          q: "What is the difference between shared-state and direct message-passing communication?",
          options: [
            "Shared state has agents read/write a common data structure (like blackboard); direct message passing sends explicit messages between specific agents",
            "Shared state only works with exactly one agent",
            "Direct message passing never carries any metadata",
            "They are the same mechanism with different names",
          ],
          answer: 0,
          explain: "These are the two broad mechanisms underlying the orchestration patterns from the previous two chapters.",
        },
        {
          q: "Why does a well-designed agent message need more than just raw text content?",
          options: [
            "Extra fields are purely decorative",
            "Metadata (sender, role) and structured fields let the receiving agent parse and act on the message reliably, rather than re-interpreting free text",
            "It doesn't - raw text is always sufficient",
            "Metadata replaces the need for content entirely",
          ],
          answer: 1,
          explain: "Structured fields make messages reliably parseable, echoing Part II's structured-output motivation applied to agent-to-agent communication.",
        },
        {
          q: "What problem emerges without a shared communication standard as more distinct agent types are introduced?",
          options: [
            "Agents become faster",
            "No problem - agents always understand each other automatically",
            "An N² integration problem - every new pair of agent types needs its own bespoke translator",
            "Token costs disappear",
          ],
          answer: 2,
          explain: "Each new agent type potentially needs custom translation code for every existing type it must talk to, scaling poorly.",
        },
        {
          q: "What is the core motivation behind standardized agent-to-agent protocols?",
          options: [
            "To remove the need for agents to communicate at all",
            "To increase token costs intentionally",
            "To make every agent identical",
            "To let any conforming agent talk to any other conforming agent without custom glue code, the same motivation behind standards like HTTP or Part II's tool-calling formats",
          ],
          answer: 3,
          explain: "Standardization trades one-off custom integration work for a shared format any compliant agent can use.",
        },
        {
          q: "Why are communication failures described as a distinct, often harder-to-trace failure mode?",
          options: [
            "They are always caused by the LLM provider",
            "The fault could be in either agent or in the handoff itself, unlike a single agent's own, more directly attributable error",
            "They only affect single-agent systems",
            "They never actually occur in practice",
          ],
          answer: 1,
          explain: "A misinterpreted or corrupted message could originate from the sender, the receiver, or the transmission itself, complicating debugging.",
        },
      ],
    },
    {
      id: "p5-c4",
      plain: "<p>The Model Context Protocol is a standard 'plug' for connecting AI to tools and data: build the connector once, and any compatible AI can use it - instead of rebuilding a custom integration for every app. Think USB, but for AI tools.</p>",
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
      explain: `<p>Before MCP, connecting an LLM application to N different tools or data sources typically meant writing N different custom integrations - and if M different LLM applications each wanted to use those same N tools, that's up to M×N bespoke connections. It's the same N² integration problem from the previous chapter, now between applications and tools/data sources rather than between agents.</p>
      <p><strong>Model Context Protocol (MCP)</strong>, introduced by Anthropic, standardizes this directly: it defines a common client-server protocol so any MCP-compatible application - the "client," which could be an LLM app, an IDE, or an agent - can connect to any MCP-compatible "server," which exposes tools, data, or capabilities, without custom integration code for each pairing. Build an MCP server once for a data source or tool, and every MCP-compatible client can use it immediately.</p>
      <p>An MCP server can expose three core primitives. <strong>Tools</strong> are callable functions the model can invoke - a direct extension of Part II, Chapter 5's function calling, now standardized so any client can discover and call them uniformly. <strong>Resources</strong> are read-only data the client can fetch and include as context - a file, a database record, a document - without needing a full "tool call" round-trip. <strong>Prompts</strong> are reusable, parameterized prompt templates the server can offer, so common interaction patterns don't need to be reinvented by every client.</p>
      <p>The client-server split matters specifically because it decouples who builds an integration from who uses it: a tool or data provider builds one MCP server, and any application that speaks MCP - regardless of which LLM, framework, or team built it - can connect to that server immediately. This is exactly the standardization motivation from the previous chapter, now concretely specified as an actual protocol rather than just a general goal.</p>
      <p>Practically, this changes how a team thinks about tool integration: instead of asking "how do we wire this data source into our specific agent," the question becomes "does an MCP server already exist for this" - turning what used to be bespoke integration work into a discovery-and-connect problem, closer to installing a library than writing one from scratch.</p>`,
      analogy:
        "<p>Before MCP, connecting agents to tools was like every appliance needing its own uniquely-shaped wall socket - you'd rewire your house for every new appliance. MCP is a standard electrical outlet: build a compliant plug once, and it works in any compliant socket, built by anyone, anywhere.</p>",
      example:
        "<p>A team building a coding assistant wants it to read from their internal ticketing system, their code repository, and their documentation wiki. Without MCP, that's three custom integrations to build and maintain. With MCP, if standardized servers already exist for a ticketing system, a code host, and a wiki platform, the coding assistant simply connects to all three as an MCP client - no bespoke integration code for any of them, and the same three servers could be reused by a completely different application on the team without modification.</p>",
      takeaways: [
        "Before standardization, connecting M applications to N tools/data sources scales toward M×N bespoke integrations - the same N² problem from agent-to-agent communication, applied to applications and tools.",
        "MCP defines a common client-server protocol so any MCP-compatible client can connect to any MCP-compatible server without custom integration code.",
        "MCP servers expose three core primitives: Tools (callable functions, extending Part II's function calling), Resources (read-only contextual data), and Prompts (reusable templates).",
        "The client-server split decouples who builds an integration from who uses it - build a server once, any compliant client can use it.",
        "MCP turns tool integration from bespoke engineering work into a discovery-and-connect problem, much like using a library instead of writing one from scratch.",
      ],
      quiz: [
        {
          q: "What integration problem does MCP directly address?",
          options: [
            "The cost of pretraining a model",
            "The need for chunking documents",
            "The need for larger context windows",
            "Connecting M applications to N tools/data sources without M×N bespoke custom integrations",
          ],
          answer: 3,
          explain: "MCP standardizes the client-server connection so integrations don't need to be rebuilt for every application/tool pairing.",
        },
        {
          q: "What are the three core primitives an MCP server can expose?",
          options: [
            "Threads, Queues, and Sockets",
            "Tools, Resources, and Prompts",
            "Chunks, Embeddings, and Indexes",
            "Agents, Workers, and Supervisors",
          ],
          answer: 1,
          explain: "Tools extend function calling, Resources provide read-only context data, and Prompts offer reusable templates.",
        },
        {
          q: "Why does the client-server architecture matter specifically?",
          options: [
            "It has no real practical effect",
            "It removes the need for tools entirely",
            "It requires every client to be built by the same team as the server",
            "It decouples who builds an integration from who uses it - a server built once can be used by any compliant client",
          ],
          answer: 3,
          explain: "One MCP server, built once, becomes immediately usable by any MCP-compatible client, regardless of who built either side.",
        },
        {
          q: "How does an MCP \"Resource\" differ from an MCP \"Tool\"?",
          options: [
            "A Resource can only be used once",
            "A Tool cannot be discovered by a client",
            "A Resource is read-only data fetched as context, without a full tool-call round-trip; a Tool is a callable function the model invokes",
            "They are identical concepts",
          ],
          answer: 2,
          explain: "Resources are simpler context-fetching primitives, while Tools represent actions the model can actively invoke.",
        },
        {
          q: "How does MCP change the practical question a development team asks when integrating a new data source?",
          options: [
            "From \"how do we build this integration\" to \"does an MCP server already exist for this\" - closer to using a library than writing one",
            "It doesn't change anything about integration work",
            "It requires teams to always build integrations from scratch",
            "It eliminates the need for any data sources",
          ],
          answer: 0,
          explain: "Standardization shifts the work from bespoke engineering to discovery-and-connect, when a compliant server already exists.",
        },
      ],
    },
    {
      id: "p5-c5",
      plain: "<p>Many libraries promise to help you build agents, but the biggest mistake isn't picking the 'wrong' one - it's reaching for a complex multi-agent setup when something simple would do. This chapter is about choosing sensibly.</p>",
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
      hook: "<p>This Part covered the patterns. In practice, you rarely build the coordination machinery from scratch - and the biggest mistake isn't picking the wrong framework, it's reaching for multi-agent when a single agent would have done the job better.</p>",
      explain: `<p>A brief landscape of common orchestration frameworks, not as endorsements but as a sense of what each is generally known for: <strong>LangGraph</strong> models agent workflows as an explicit graph of nodes and edges, giving fine-grained control over state and control flow - closer to the "workflow with agentic sub-loops" hybrid from Part IV, Chapter 1. <strong>AutoGen</strong> (Microsoft) focuses on conversational multi-agent patterns, where agents interact via message-passing in a chat-like structure, a natural fit for debate and supervisor patterns. <strong>CrewAI</strong> provides higher-level abstractions specifically for the "team of specialized agents with defined roles" pattern, aiming to make supervisor and hierarchical orchestration quick to set up. Provider-native options - the OpenAI Agents SDK, the Claude Agent SDK - offer tighter integration with a specific provider's tool-calling and agent-loop primitives, trading some framework-agnosticism for a more streamlined, officially-supported path.</p>
      <p>None of these frameworks changes the fundamentals covered in this Part - they're implementations of the same patterns (sequential, supervisor, hierarchical, parallel, debate, blackboard) with different amounts of structure, abstraction, and opinionation. Choosing between them is closer to choosing a web framework than choosing an algorithm: it affects developer experience, debugging tools, and how much boilerplate you write, not which orchestration patterns are possible.</p>
      <p>The more consequential decision comes before any framework choice: does this task actually need multiple agents at all? Multi-agent systems add real cost - more tokens (each agent's own context, plus communication overhead from Chapter 3), more latency (coordination round-trips), more failure surface (communication failures on top of each agent's own error rate), and more complexity to debug, since a bug could be in any agent or in a handoff between two. A single well-designed agent (Part IV) with good tools and a clear loop often outperforms an over-engineered multi-agent system on tasks that don't actually decompose into genuinely independent specialties.</p>
      <p>A practical rule of thumb: reach for multi-agent orchestration when a task genuinely separates into distinct expertise areas that benefit from different prompting, tooling, or context; when independent parallel attempts materially improve speed or reliability; or when the task is large enough that a single agent's context window and focus become the bottleneck. Reach for a single agent when the task is well-scoped enough that one focused loop, possibly with several tools, can just do it - which, in practice, describes a substantial fraction of the real tasks people reach for multi-agent systems to solve anyway.</p>`,
      analogy:
        "<p>Choosing an orchestration framework is choosing which project-management software your team uses. Choosing whether to use a team at all is deciding whether the job actually needs more than one person - hiring a five-person team for a task one competent person could finish alone doesn't make it faster, it mostly adds meetings.</p>",
      example:
        "<p>A team building a system to \"summarize one uploaded document\" reaches for a multi-agent pipeline - a research agent, a summarizer agent, and a formatter agent - coordinated through a framework, when a single agent with a summarization prompt and no additional tools would have produced the same quality result in a fraction of the time and cost. The multi-agent version isn't wrong, exactly, but it's solving a problem the task didn't actually have.</p>",
      takeaways: [
        "LangGraph, AutoGen, CrewAI, and provider-native SDKs implement the same orchestration patterns from this Part with different levels of structure and abstraction - the choice affects developer experience, not which patterns are possible.",
        "Framework choice is a secondary decision; the primary one is whether a task needs multiple agents at all.",
        "Multi-agent systems add real cost: more tokens, more latency from coordination, and more failure surface, including communication failures that are their own distinct problem (Chapter 3).",
        "Multi-agent orchestration earns its cost when a task genuinely separates into distinct expertise areas, benefits from independent parallel attempts, or exceeds what a single agent's context and focus can handle.",
        "A substantial fraction of tasks people reach for multi-agent systems to solve would be handled just as well, and more cheaply, by a single well-designed agent from Part IV.",
      ],
      quiz: [
        {
          q: "What do frameworks like LangGraph, AutoGen, and CrewAI fundamentally provide?",
          options: [
            "A way to avoid using LLMs entirely",
            "Entirely new orchestration patterns not covered in this Part",
            "Different levels of structure and abstraction over the same underlying patterns - sequential, supervisor, hierarchical, parallel, debate, blackboard",
            "A single universally correct orchestration pattern",
          ],
          answer: 2,
          explain: "These frameworks implement the same fundamental patterns with different developer experience and abstraction levels, not new algorithms.",
        },
        {
          q: "What is described as the more consequential decision than which framework to use?",
          options: [
            "Which embedding model to use",
            "Whether the task actually needs multiple agents at all",
            "How many GPUs to provision",
            "Which programming language to write the agents in",
          ],
          answer: 1,
          explain: "Framework choice is secondary - the primary decision is whether multi-agent coordination is even warranted for the task.",
        },
        {
          q: "What real costs do multi-agent systems add compared to a single well-designed agent?",
          options: [
            "Multi-agent systems remove the need for tools",
            "More tokens, more latency from coordination, and more failure surface, including communication failures",
            "Only latency, with no effect on cost or reliability",
            "None - multi-agent systems are always strictly better",
          ],
          answer: 1,
          explain: "Every added agent and handoff introduces real token cost, coordination latency, and additional places for something to go wrong.",
        },
        {
          q: "According to the practical rule of thumb in this chapter, when does multi-agent orchestration earn its cost?",
          options: [
            "When a task genuinely separates into distinct expertise areas, benefits from parallel attempts, or exceeds a single agent's context/focus",
            "Only when no tools are available",
            "Only when the task is very simple",
            "Always, regardless of task",
          ],
          answer: 0,
          explain: "These are the conditions under which the added coordination cost is actually justified by real benefit.",
        },
        {
          q: "What mistake does the \"summarize one document\" example illustrate?",
          options: [
            "Failing to use any orchestration framework",
            "Using MCP unnecessarily",
            "Using too few agents for a genuinely complex task",
            "Reaching for a multi-agent pipeline on a task simple enough for one focused agent to handle just as well, at a fraction of the cost",
          ],
          answer: 3,
          explain: "The multi-agent version wasn't wrong, exactly - it just solved a coordination problem the task never actually had.",
        },
      ],
    },
  ],
};

window.PARTS = window.PARTS || {};
window.PARTS[window.PART_DATA.id] = window.PART_DATA;
