export interface CaseStudyData {
  slug: string;
  title: string;
  summary: string;
  problem: string[];
  whatIBuilt: string[];
  result: string;
  tags: string[];
}

export const caseStudies: CaseStudyData[] = [
  {
    slug: "building-npcs-that-feel-alive",
    title: "Building NPCs That Feel Alive",
    summary: "A multimodal NPC engine with real-time voice, emotion, memory, and sub-second latency at scale.",
    problem: [
      "Yumio needed game characters that could hold natural conversations with voice input, emotional responses, character-specific knowledge, and synchronized animations.",
      "The hard part wasn't a demo — it was building an end-to-end system that could serve thousands of concurrent players with production-grade latency and stability.",
    ],
    whatIBuilt: [
      "Integrated speech-to-text and text-to-speech for real-time voice conversations.",
      "Added emotion classification to drive character reactions and pacing.",
      "Built tool-calling agent workflows for controllable behavior.",
      "Implemented a vector database memory layer for character context and recall.",
      "Designed safety layers for user inputs and outputs.",
      "Optimized RPC and WebSocket architecture to maintain sub-1-second p95 latency at scale.",
    ],
    result: "Production-ready NPC system handling thousands of simultaneous conversations with sub-1-second p95 latency.",
    tags: ["LLM agents", "STT/TTS", "Vector DB", "WebSockets"],
  },
  {
    slug: "outperforming-standard-observability",
    title: "Outperforming Standard Observability",
    summary: "A root-cause engine that finds multi-variable failure paths that standard analytics platforms miss.",
    problem: [
      "Standard streaming analytics platforms (like Conviva or Bitmovin) show that a metric dropped — but they fail to explain why.",
      "When the issue is multi-variable (device × ISP × media × region × player), thresholds and dashboards don't isolate the true driver.",
    ],
    whatIBuilt: [
      "Built a bespoke detection engine that treats root cause analysis as a supervised clustering problem.",
      "Fit decision models to traffic data to identify \"filtering paths\" that deviate statistically from baseline.",
      "Generated actionable slices like \"a specific Media ID failing only on a specific User Agent\".",
    ],
    result: "Autonomous isolation of complex, multi-variable issues that major industry tools miss entirely.",
    tags: ["Supervised Clustering", "Pattern Mining", "Anomaly Detection"],
  },
  {
    slug: "autonomous-tier-3-support-agents",
    title: "Autonomous Tier-3 Support Agents",
    summary: "An agentic system that validates incidents automatically and escalates only when the data is irrefutable.",
    problem: [
      "In high-volume data pipelines, false positives are the enemy of speed.",
      "Ops teams drown in alerts, and the real cost is human attention.",
    ],
    whatIBuilt: [
      "Engineered a deep agentic architecture that functions as an autonomous reliability engineer.",
      "Deployed a \"Master Agent\" that spawns specialized sub-agents with investigative tools.",
      "Enabled sub-agents to access raw session logs, execute active ping tests, and query cluster statistics.",
      "Cross-referenced signals to validate incidents and escalated only when confirmed.",
    ],
    result: "A drastic reduction in alert noise, allowing engineers to focus solely on confirmed, high-impact incidents.",
    tags: ["Multi-Agent Systems", "Tool Use", "Automated Triage"],
  },
  {
    slug: "super-alerts-with-graph-theory",
    title: "Synthesizing \"Super Alerts\" with Graph Theory",
    summary: "Signal compression for alert floods: statistical fingerprints + community detection + a single narrative.",
    problem: [
      "Continuous, real-time monitoring floods operations teams with hundreds of overlapping alerts for a single underlying issue.",
      "Even strong teams lose time correlating, deduplicating, and translating fragments into a real incident story.",
    ],
    whatIBuilt: [
      "Developed a \"signal compression\" engine for alert fatigue reduction.",
      "Generated a statistical fingerprint for every incoming alert using information entropy.",
      "Used graph community detection to cluster alerts sharing the same underlying signature.",
      "Used an LLM to synthesize each cluster into a single incident narrative.",
    ],
    result: "Instead of receiving 50 fragmented notifications, the team gets one \"Super Alert\" that explains the root cause.",
    tags: ["Graph Theory", "Information Theory", "LLM Synthesis"],
  },
  {
    slug: "outsmarting-microsofts-500-tax",
    title: "Outsmarting Microsoft's $500/Month Tax",
    summary: "A pragmatic workaround that prevented autoscaling from killing long-running Durable Functions — without paying the \"official\" add-on.",
    problem: [
      "Einbliq's data pipeline uses Azure Durable Functions — long-running tasks that can take 30+ minutes.",
      "KEDA autoscaling only sees the entry point, not the actual work happening inside. It thinks nothing is running and kills the pipeline mid-execution.",
      "The official recommended solution was a $500/month integration — for a pipeline that costs about $10/month to run.",
    ],
    whatIBuilt: [
      "Built a workaround: a \"Keep Alive\" endpoint pinged by each task via HTTP every few minutes.",
      "Ensured KEDA saw constant traffic and recognized ongoing work.",
      "Stabilized execution without added platform cost.",
    ],
    result: "Same result, zero extra platform cost: long-running tasks no longer get killed mid-execution.",
    tags: ["Azure Durable Functions", "KEDA", "Cost optimization"],
  },
  {
    slug: "making-everything-fast-and-cheap",
    title: "Making Everything Fast and Cheap",
    summary: "A pipeline redesign that delivered major cost and latency wins by fixing architecture, scaling, and query strategy.",
    problem: [
      "The pipeline was slow, expensive, and operationally awkward. The underlying issue was architecture: always-on compute, inefficient loading, and unnecessary work.",
      "The goal was not micro-optimizations — it was structural improvement.",
    ],
    whatIBuilt: [
      "Redesigned the pipeline stack end-to-end.",
      "Parallelized data loaders.",
      "Moved from App Service Plans (always-on, expensive) to Container Apps (scales to zero, pay only when running).",
      "Optimized queries with lazy evaluation to fetch less data.",
      "Tuned memory allocation settings.",
      "Upgraded from a resource-constrained B3 dev plan to appropriate specs.",
    ],
    result: "86% cost reduction and 88% latency improvement.",
    tags: ["Polars", "Container Apps", "Lazy evaluation", "Infrastructure"],
  },
  {
    slug: "validating-patterns-at-scale-with-ai",
    title: "Validating Patterns at Scale with AI",
    summary: "An LLM gatekeeper that automatically validates discovered patterns and escalates only the ones that matter.",
    problem: [
      "The detection system discovered many streaming patterns — but the patterns kept multiplying.",
      "Engineers couldn't manually validate everything without drowning in noise.",
    ],
    whatIBuilt: [
      "Built an LLM agent that acts as a gatekeeper.",
      "Gave the agent access to raw session data and summary statistics.",
      "Evaluated each detected pattern for significance and practical impact.",
      "Escalated only patterns worth investigation.",
    ],
    result: "90% reduction in triage effort.",
    tags: ["LLM agents", "RAG", "Pattern validation"],
  },
  {
    slug: "measuring-environmental-impact-of-streaming",
    title: "Measuring Environmental Impact of Streaming",
    summary: "Device-level environmental analytics for streaming at massive scale, with dashboards for operational decision-making.",
    problem: [
      "No one was tracking the carbon footprint of digital streaming at device-level granularity.",
      "The challenge was building a credible model and pipeline across a distribution network of 1M+ user devices.",
    ],
    whatIBuilt: [
      "Pioneered a model to measure environmental impact across a streaming distribution network.",
      "Built the end-to-end analytics pipeline.",
      "Created Grafana dashboards for real-time visualization.",
      "Enabled content providers to make data-driven sustainability decisions.",
    ],
    result: "Industry-first environmental analytics with unprecedented detail.",
    tags: ["Big Data", "Grafana", "Analytics"],
  },
  {
    slug: "fixing-therapist-note-generation",
    title: "Fixing Therapist Note Generation",
    summary: "A production LLM ops rebuild that improved quality, reduced rejection, and delivered direct revenue impact.",
    problem: [
      "Mentalyc's AI-generated therapy notes were inconsistent and therapists were rejecting outputs.",
      "The system needed quality, reliability, and cost control — not just better prompts.",
    ],
    whatIBuilt: [
      "Tightened prompts and improved retrieval pipelines.",
      "Added guardrails and structured output constraints.",
      "Created an evaluation harness with real therapist feedback loops.",
      "Built curated datasets for regression testing.",
      "Implemented cost controls via intelligent model routing and token-aware truncation.",
    ],
    result: "30% revenue impact through higher note acceptance rates.",
    tags: ["LLM ops", "Prompt engineering", "Eval harnesses", "Cost optimization"],
  },
  {
    slug: "scaling-presales-research-with-ai",
    title: "Scaling Presales Research with AI",
    summary: "An end-to-end text classification and research pipeline that improved lead conversion and close rates.",
    problem: [
      "AIREV needed to automate lead scoring and report generation at scale.",
      "The challenge was processing long documents reliably and producing structured outputs teams could act on.",
    ],
    whatIBuilt: [
      "Built Revolution Engine: an end-to-end text classification service for training and deploying BERT models.",
      "Built PresalesAI: a GPT-4 powered research tool for structured analysis.",
      "Designed MapReduce-style LLM pipelines for long documents.",
      "Designed structured PostgreSQL schemas for data management.",
    ],
    result: "20% faster lead conversion and 35% higher sales close rates.",
    tags: ["BERT", "GPT-4", "LangChain", "MapReduce"],
  },
  {
    slug: "decoding-brain-activity-at-scale",
    title: "Decoding Brain Activity at Scale",
    summary: "Team-led neuroscience pipelines and algorithms for massive calcium imaging datasets.",
    problem: [
      "Harvard Medical School and FORTH needed to analyze communication patterns in neuronal activity.",
      "The dataset scale was extreme: 10,000+ neurons generating 80GB+ of calcium imaging data.",
    ],
    whatIBuilt: [
      "Led an 8-person data science team.",
      "Built preprocessing pipelines and analysis tooling.",
      "Developed ML algorithms for pattern detection.",
      "Built visualization tools for researchers.",
      "Applied statistical multivariate analysis and neural networks to extract insights.",
    ],
    result: "Published research on spontaneous brain activity patterns.",
    tags: ["Big Data", "ML", "Neural networks", "Research"],
  },
  {
    slug: "trading-crypto-with-reinforcement-learning",
    title: "Trading Crypto with Reinforcement Learning",
    summary: "A reinforcement learning system for portfolio optimization across multiple crypto assets, robust across market regimes.",
    problem: [
      "For my master's thesis, I built an AI that learned to trade cryptocurrencies and optimize portfolios across multiple assets.",
      "The challenge was handling volatility, temporal dependencies, and risk in both bull and bear markets.",
    ],
    whatIBuilt: [
      "Combined Recurrent PPO with financial market domain knowledge.",
      "Implemented dynamic asset allocation and risk management.",
      "Handled temporal dependencies in volatile time series.",
    ],
    result: "Profitable strategy across market uptrends and downtrends.",
    tags: ["Reinforcement Learning", "PyTorch", "Time series"],
  },
];

export const getCaseStudyBySlug = (slug: string): CaseStudyData | undefined => {
  return caseStudies.find((cs) => cs.slug === slug);
};
