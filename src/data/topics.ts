export const categories = [
  "All",
  "Machine learning & statistics",
  "Language models & NLP",
  "Scientific data analysis",
  "Software engineering",
] as const;
export type Category = (typeof categories)[number];
export type FigureKind =
  | "cohorts"
  | "ranking"
  | "agents"
  | "evaluation"
  | "graph"
  | "reinforcement"
  | "text-tasks"
  | "retrieval"
  | "temporal"
  | "conversation"
  | "software";
export type Topic = {
  slug: string;
  title: string;
  summary: string;
  categories: Category[];
  methods: string[];
  example?: string;
  figure?: FigureKind;
  sections: { title: string; paragraphs: string[] }[];
  related: string[];
};
export const topics: Topic[] = [
  {
    slug: "statistical-pattern-discovery",
    title: "Supervised rule discovery",
    summary:
      "Supervised rule discovery turns a labeled dataset into readable conditions associated with an outcome. Decision paths expose which attributes define a population; coverage, outcome rate and lift show how much of the behavior a rule describes.",
    categories: ["Machine learning & statistics"],
    methods: ["Decision trees", "Gini impurity", "Coverage & lift"],
    example:
      "Synthetic credit decisions: 1,000 applications; 64 declined. Inputs describe credit history, debt burden, income stability, loan size, employment tenure and savings. Short history is under two years; high debt means repayments ≥40% of income. The recorded decision is the target. Teal dots are declines; blue are approvals.",
    figure: "cohorts",
    sections: [
      {
        title: "Partition a labeled population",
        paragraphs: [
          "A decision tree partitions observations using their attributes and a known target. For a binary outcome with proportion p, Gini impurity is 2p(1 − p). A candidate split is scored by the population-weighted impurity of its children; lower values indicate purer outcomes.",
          "My work includes supervised pattern discovery, decision-tree rule extraction and categorical population analysis. The illustration uses a fitted depth-two tree to explain the partitioning idea: compare six possible first splits, then refine the selected partition. The same observations remain visible throughout. Related work also uses boosted decision models and statistical postprocessing; this small tree isolates the interpretable rule mechanism.",
        ],
      },
      {
        title: "Interpret a rule",
        paragraphs: [
          "A path through the tree is a conjunction of conditions. Here, short credit history AND high debt burden selects 120 applications, of which 42 were declined. Its rate is 35%, against 6.4% overall. Coverage is 120 / 1,000 = 12%; lift is 35 / 6.4 = 5.47. These quantities answer different questions: how much of the population is selected, and how concentrated is the target outcome?",
          "A rule can make a concentration of declines inspectable: here 12% of applications contain 66% of all declines. That is a useful starting point for a decision audit, not a complete explanation of any individual decision or evidence that the policy is fair. A broad rule may capture more cases with less concentration. Neither lift nor impurity is a significance test. A selected association does not establish why an outcome occurred, and discovery on the same data can overstate its reliability.",
        ],
      },
      {
        title: "Keep the unit of observation consistent",
        paragraphs: [
          "When one underlying observation appears in several intermediate rows, raw row counts change the effective training distribution. Inverse-frequency weights can give each observation a consistent total weight. The weighting must carry through to quantiles, fitted partitions and reported population rates.",
          "Related work includes categorical aggregation, statistical screens and rule simplification. Simplifying conditions is useful only when the selected population and its reported quantities retain their meaning.",
        ],
      },
    ],
    related: [
      "statistical-signatures-and-graphs",
      "time-series-and-distribution-shifts",
    ],
  },
  {
    slug: "recommendation-and-probability",
    title: "Recommendation systems & probabilistic modeling",
    summary:
      "Relevance describes a match; response probability predicts a behavior. Keeping them separate makes the ranking objective explicit and shows why different objectives produce different recommendations.",
    categories: ["Machine learning & statistics"],
    methods: ["Embeddings", "Logistic regression", "Ranking evaluation"],
    example:
      "Synthetic example: six hypothetical people, A–F, considered for a topic-specific invitation. Relevance is an illustrative compatibility score from 0 to 1. Responsiveness and activity are standardized behavioral inputs: zero denotes the training mean, and negative values are below it.",
    figure: "ranking",
    sections: [
      {
        title: "Separate relevance from predicted behavior",
        paragraphs: [
          "Recommendation combines candidate retrieval with a decision about ordering. Semantic representations can estimate relevance to a query. A behavioral model can estimate the probability of a response. A relevance score is not automatically a probability, and a high response probability does not make a candidate relevant.",
          "My work spans embedding-based relevance, probabilistic response and count models, cold-start handling and ranking evaluation. This illustration isolates one relationship: a fitted logistic model predicts response, then an explicitly chosen objective uses that prediction.",
        ],
      },
      {
        title: "Inspect the probability model",
        paragraphs: [
          "Logistic regression adds weighted inputs to an intercept: z = b + Σwᵢxᵢ. The sigmoid p = 1 / (1 + exp(−z)) maps that score to (0, 1). The weights shown here were fitted to synthetic observations; selecting a person exposes every contribution to their prediction.",
          "Multiplying relevance by response probability is one possible ranking objective. It rewards compatibility and predicted response together, but the product is a ranking score rather than a new calibrated probability. It is an illustrative choice, not a claim about a deployed formula.",
        ],
      },
      {
        title: "Evaluate models and the returned order",
        paragraphs: [
          "Held-out entities test generalization beyond profiles seen during fitting. Calibration examines whether predicted probabilities correspond to observed frequencies. Limited history calls for an explicit prior or fallback. Observed responses also reflect who was previously selected: training only on exposed candidates can reinforce the existing selection policy. Precision at k and NDCG at k assess different properties of the returned order; candidate-pool coverage limits what any ranker can retrieve.",
          "Related work includes comparisons with simpler and tree-based baselines, finite-difference numerical checks, prediction parity after serialization, human-annotated relevance and agreement analysis. Paired bootstrap comparisons and offline replay support comparisons between alternatives; effects in use require their own evidence.",
        ],
      },
    ],
    related: ["text-classification-and-retrieval", "language-model-evaluation"],
  },
  {
    slug: "tool-using-agents",
    title: "Language-model agents & tool use",
    summary:
      "Agents investigate questions whose next steps depend on what they discover. Tools provide observations, delegated tasks isolate parts of an investigation, and verification checks whether a conclusion follows from the evidence.",
    categories: ["Language models & NLP"],
    methods: ["Typed tools", "Retrieval", "Execution tracing"],
    example:
      "Synthetic investigation: a candidate model reports 90% accuracy against a baseline’s 80%, each on 1,000 labeled examples. Accuracy means correct predictions divided by evaluated predictions. Metadata identifies the test population; per-example correctness records permit a paired comparison. Tool results are calculated from those records; agent decisions are authored, with no live model running.",
    figure: "agents",
    sections: [
      {
        title: "Act on observations",
        paragraphs: [
          "An agent alternates bounded actions with observations from tools. In the ReAct pattern, each observation can alter the next action. The illustration exposes decisions, typed operations and evidence dependencies; it does not depict private reasoning.",
          "My work includes tool-using investigative systems, analytical retrieval, evidence gathering and bounded delegation. Here a coordinator delegates data and metric checks. A population mismatch creates a new task: compare both models on the same examples. With comparable evaluations, that task is unnecessary.",
        ],
      },
      {
        title: "Delegate with a contract",
        paragraphs: [
          "A worker receives a bounded question, relevant context, permitted tools and an expected result. Its findings return with source identities. Orchestrator–worker coordination is adaptive when newly discovered evidence changes the task graph; a fixed set of parallel calls alone does not demonstrate that behavior.",
          "The data worker inspects population metadata. The evaluation worker reads accuracy counts. When populations differ, the coordinator requests paired correctness records on eval-v1. The matched comparison changes the apparent gain from 10 percentage points to 1. The illustrative 95% normal interval includes zero, so the evidence does not establish a reliable improvement.",
        ],
      },
      {
        title: "Verify claims against calculated evidence",
        paragraphs: [
          "For paired binary correctness, let dᵢ be candidate correctness minus baseline correctness. The gain is mean(d); its illustrative standard error is √((mean(d²) − mean(d)²) / n). This accounts for paired disagreements rather than treating the two accuracy estimates as independent. The normal interval assumes independent evaluation examples and is not a complete assessment of model quality.",
          "Verification checks sample comparability and whether the conclusion agrees with the matched result and its uncertainty. Comparable samples in this example support a positive gain; changed samples require a qualified conclusion. Neither result establishes performance on a future population. Citations expose the exact metadata, counts or paired comparison supporting each statement.",
        ],
      },
      {
        title: "Bound context, memory and execution",
        paragraphs: [
          "Working context holds current evidence; retrieval selects external material; longer-term memory retains information across tasks. Passing a bounded evidence summary to a worker differs from copying an entire conversation. Sources and freshness remain part of the contract.",
          "Stopping conditions can require completed evidence dependencies, an explicit unresolved requirement or an execution budget. The illustrated trace stops after verification and one revision. Useful evaluation checks the final answer, unnecessary tool use, failed operations and whether the same task behaves consistently across repeated runs.",
        ],
      },
    ],
    related: ["language-model-evaluation", "conversational-systems"],
  },
  {
    slug: "statistical-signatures-and-graphs",
    title: "Statistical signatures & community detection",
    summary:
      "Statistical signatures represent what distinguishes a population from a reference. Comparing those representations reveals shared structure. For social-media accounts, distinctive topic mixtures can expose interest communities without using follow relationships.",
    categories: ["Machine learning & statistics"],
    methods: ["Enrichment screening", "Cosine similarity", "Leiden CPM"],
    example:
      "Synthetic social-media example: accounts A–G each have 1,000 posts, compared with a reference of 10,000 posts. Each post can carry several of six topic tags: AI, programming, design, photography, gaming and cooking. We compare each account’s topic proportions with the reference; graph edges mean similarity of distinctive interests, not follows or friendships.",
    figure: "graph",
    sections: [
      {
        title: "Construct a statistical representation",
        paragraphs: [
          "An attribute occurring frequently in a set is informative only relative to a reference. Comparing observed and reference proportions identifies enrichment. In this example, Laplace-smoothed Z scores screen positive enrichments using a threshold corrected for six comparisons.",
          "My work uses categorical distribution comparisons, information contribution and rarity weighting to construct statistical signatures. Here, retained attributes account for at least 90% of positive information contribution among the screened candidates. Each retained coordinate receives the reference-surprisal weight −log₂(p_reference).",
        ],
      },
      {
        title: "Build the similarity graph",
        paragraphs: [
          "Cosine similarity measures alignment between weighted signatures: a·b / (‖a‖‖b‖). The fixed edge cutoff of 0.05 determines which similarities enter this graph. Stronger edges express more aligned distinguishing attributes; node names and drawing positions have no role in the calculation.",
          "Leiden community detection with the constant Potts model balances within-community connection weight against a resolution parameter γ. Changing γ from 0.1 to 0.5 changes the partition without changing the edges. At higher resolution C forms a singleton community but retains three similarity edges. G has no edges at either resolution. A singleton community and an isolated node are different properties; community boundaries do not delete similarities.",
        ],
      },
      {
        title: "Interpret shared structure",
        paragraphs: [
          "The output organizes accounts with related topic profiles while retaining each account’s evidence. It can support interest-based discovery or candidate retrieval. Similarity of published topics does not imply friendship, endorsement or the quality of a recommendation. A community is not proof of a common cause, and the result depends on the reference population, screening choices, representation and resolution.",
          "Related work includes constrained synthesis that preserves every original finding exactly once, and recurrence scoring against null distributions with correlated attributes. Recognition of a recurring pattern and discovery of a graph community are distinct problems, even when they share a representation.",
        ],
      },
    ],
    related: [
      "statistical-pattern-discovery",
      "text-normalization-and-pattern-matching",
    ],
  },
  {
    slug: "language-model-evaluation",
    title: "Language-model evaluation",
    summary:
      "Output format, evidential support and usefulness are separate properties. Evaluation makes those distinctions observable so a change to a model, prompt or retrieval pipeline can be compared on stable examples.",
    categories: ["Language models & NLP"],
    methods: ["Evaluation datasets", "Human feedback", "Structured outputs"],
    figure: "evaluation",
    sections: [
      {
        title: "Define what a check measures",
        paragraphs: [
          "A valid JSON response can contain a false claim. A correct statement can fail the application's expected schema or fail to answer the question. Combining these failures into a single pass rate conceals what needs to change.",
          "My work includes curated evaluation datasets, structured-output constraints, human feedback and retrieval evaluation. The illustration separates an executable schema check from authored evidence annotations and usefulness judgments.",
        ],
      },
      {
        title: "Validate the measurement",
        paragraphs: [
          "A model used as a judge introduces another source of error. Agreement with annotated examples, class-level precision and recall, and inspection of disagreements help establish what that judge measures reliably. Human agreement also matters: an ambiguous task can make the reference labels unstable.",
          "Dataset construction starts with representative tasks and explicit annotation criteria. Reviewer disagreements can reveal ambiguous requirements or a weak reference label. Representative failures belong in regression datasets. A prompt or retrieval change can improve one family of examples while degrading another. Inspecting results by task and failure type makes the comparison more informative than an aggregate alone.",
        ],
      },
      {
        title: "Evaluate the execution as well as the answer",
        paragraphs: [
          "For tool-using systems, the final output and the execution trace support different checks. A correct answer can follow an unnecessary or unreliable tool sequence; a well-formed sequence can still return insufficient evidence. Repeated runs help expose that variability.",
        ],
      },
    ],
    related: ["tool-using-agents", "text-classification-and-retrieval"],
  },
  {
    slug: "text-normalization-and-pattern-matching",
    title: "Text normalization & lexical matching",
    summary:
      "Canonical forms remove incidental variation from recurring messages. A retrieval cascade can reuse a known pattern while reserving separate identities for messages that fail its matching criteria.",
    categories: ["Language models & NLP"],
    methods: ["Canonicalization", "Character TF-IDF", "Fuzzy verification"],
    example:
      "Synthetic file-operation messages. P1 is the stored pattern for a document-open failure; P2 and P3 identify other stored messages. P4 is a new identity assigned when no candidate passes. A filename may vary without changing the failure, while a successful operation should remain separate.",
    figure: "retrieval",
    sections: [
      {
        title: "Resolve the cheapest reliable match first",
        paragraphs: [
          "A configured identifier maps directly to a known pattern. Otherwise normalization produces a canonical form for exact comparison. Only messages without either route require approximate retrieval. The ordering matters: exact recognition should not depend on a fuzzy threshold.",
          "My work includes normalized message indexes, character n-gram TF-IDF retrieval and independent fuzzy-string verification. The example preserves that lexical cascade, using explicitly illustrative messages and the actual normalization and scoring calculations.",
        ],
      },
      {
        title: "Retrieve a candidate, then verify it",
        paragraphs: [
          "Character 3–7-gram TF-IDF represents overlapping fragments; cosine similarity retrieves a candidate. A separate partial-ratio string score provides another acceptance condition. The illustrated gate accepts cosine ≥ 0.82 with fuzzy ≥ 90, or cosine ≥ 0.92 with fuzzy ≥ 85. These thresholds define this fixture, not universal matching quality.",
          "Normalization removes paths and selected identifiers, transliterates text, retains the first integer and limits the signature to ten words. Every discarded detail can remove a meaningful distinction. Rejected examples and human review help reveal false merges; a near match is not automatically the same event.",
        ],
      },
      {
        title: "Keep recognition separate from explanation",
        paragraphs: [
          "Unmatched messages can extend the index under a new identity. Structured language-model enrichment can subsequently add explanatory context without deciding lexical membership. Stable identity, matching evidence and generated explanation serve different roles.",
        ],
      },
    ],
    related: [
      "text-classification-and-retrieval",
      "statistical-signatures-and-graphs",
    ],
  },
  {
    slug: "time-series-and-distribution-shifts",
    title: "Time-series analysis & distribution shifts",
    summary:
      "Recurring variation and a sustained level change can overlap in the same signal. Seasonal adjustment and penalized segmentation separate these structures so a boundary has a defined statistical meaning.",
    categories: ["Machine learning & statistics"],
    methods: ["Robust STL", "PELT", "Distribution drift"],
    example:
      "Synthetic series: 120 ordered samples with dimensionless values, a repeating period of 12 and two imposed level changes. The plot follows the same measurements through seasonal adjustment and piecewise-constant fitting; it is not a result from a professional project.",
    figure: "temporal",
    sections: [
      {
        title: "Separate seasonality from level",
        paragraphs: [
          "Robust STL decomposes an observed series into trend, seasonal and residual components. Subtracting the seasonal component retains sustained changes in level. Segmenting the residual instead would ask a different question because the estimated trend has also been removed.",
          "My work includes robust seasonal decomposition, PELT segmentation, drift detection and historical reference distributions. The figure preserves the observed curve for comparison while its adjusted counterpart develops.",
        ],
      },
      {
        title: "Balance fit against complexity",
        paragraphs: [
          "PELT minimizes segment squared error plus a penalty for extra change points. In this fixture, penalty 8 retains boundaries before samples 41 and 83; penalty 100 retains one constant segment. A boundary marks a change in the fitted level of the adjusted series, not a cause or necessarily a practically important event.",
          "The minimum segment length is eight. Penalty, cost function and preprocessing jointly define what can be detected. A larger penalty suppresses additional boundaries even when they improve fit; selecting it requires assumptions about the changes and error costs that matter.",
        ],
      },
      {
        title: "Interpret change against its history",
        paragraphs: [
          "A drift score compares current and reference distributions. A historical distribution of those scores supplies a second reference: how much variation is typical for this data? Sparse histories call for care with quantile estimates and shrinkage.",
          "Historical replay, explicit labels and baseline comparisons help evaluate false positives and missed changes. A detector's output becomes interpretable when the observation window, comparison population and cost of an error are explicit.",
        ],
      },
    ],
    related: ["statistical-pattern-discovery", "scientific-data-analysis"],
  },
  {
    slug: "text-classification-and-retrieval",
    title: "Text classification & information retrieval",
    summary:
      "A label, a relevant passage and a synthesized answer are different outputs. Defining the task determines the representation, training data and evaluation needed to make text useful to another system.",
    categories: ["Language models & NLP"],
    methods: ["BERT", "Document processing", "Retrieval"],
    figure: "text-tasks",
    sections: [
      {
        title: "Choose the output before the model",
        paragraphs: [
          "Classification maps an input to a defined label space. Retrieval returns relevant material from a corpus. Document synthesis combines information into an answer while retaining its supporting sources. A pipeline can contain all three, but each stage has a separate contract.",
          "My work includes training and deploying BERT text classifiers, retrieval pipelines and language-model analysis of long documents. The diagram separates an annotated-corpus training and inference flow from a long-document analysis flow; these are method compositions, without an invented application scenario.",
        ],
      },
      {
        title: "Process information beyond a single context",
        paragraphs: [
          "Map-and-reduce-style document processing separates local analysis from document-level synthesis. Local outputs need an explicit representation so the final stage can combine evidence, preserve references and recognize contradictions or missing information.",
          "Evaluation should expose omitted evidence and incorrectly combined findings. Retrieval coverage limits synthesis: a generator cannot reliably cite a passage it never received. Recognizing variants of a recurring message uses a different lexical cascade, described on its own topic page.",
        ],
      },
    ],
    related: [
      "text-normalization-and-pattern-matching",
      "language-model-evaluation",
    ],
  },
  {
    slug: "conversational-systems",
    title: "Conversational AI",
    summary:
      "Conversational AI combines speech, language models and context across an ongoing exchange. Character information, dialogue history and retrieved memory support continuity; speech synthesis and emotion classification connect language to an interactive character.",
    categories: ["Language models & NLP"],
    methods: [
      "Speech recognition & synthesis",
      "Context & vector memory",
      "Emotion classification",
    ],
    figure: "conversation",
    sections: [
      {
        title: "Connect speech, dialogue and character context",
        paragraphs: [
          "My work has included a conversational character engine integrating language-model inference, speech recognition, speech synthesis, emotion classification and vector-backed memory. The technical problem crosses representations: audio becomes text, relevant context enters the model request, and generated responses return through speech and character-facing signals.",
          "Speech recognition estimates what was said. The language model generates a response using the transcript and its available context. Speech synthesis renders the response as audio. Emotion classification is a separate prediction task; it can supply a character-response signal without being the same operation as generating wording.",
        ],
      },
      {
        title: "Separate character knowledge, dialogue and memory",
        paragraphs: [
          "Stable character information, recent dialogue and retrieved memory serve different purposes. Character information constrains identity and knowledge. Recent turns establish the immediate exchange. A vector-backed memory layer can retrieve relevant earlier context without inserting every stored interaction into each request.",
          "Retrieval selects what the model sees; it does not guarantee a consistent response. Irrelevant, stale or contradictory memories can affect the answer. Context selection and dialogue evaluation therefore belong alongside the model interface.",
        ],
      },
      {
        title: "Coordinate streaming components",
        paragraphs: [
          "A speech system has several boundaries: partial transcripts become completed turns, generated text becomes speech input, and responses remain associated with the correct interaction. Coordinating those representations is a software and modeling concern, rather than a single prompt.",
          "Transcript accuracy, contextual consistency, emotion labels and speech output can be inspected separately. A plausible response can still contradict character context, while a correct response can be rendered poorly by speech synthesis. Separate checks make those failures distinguishable.",
        ],
      },
    ],
    related: ["tool-using-agents", "language-model-evaluation"],
  },
  {
    slug: "reinforcement-learning",
    title: "Reinforcement learning",
    summary:
      "Sequential decisions connect an observation and carried state to an action whose consequences arrive later. Recurrence supplies history; a policy-learning objective determines how collected experience changes future decisions.",
    categories: ["Machine learning & statistics"],
    methods: ["Recurrent PPO", "Policy learning", "Temporal evaluation"],
    figure: "reinforcement",
    sections: [
      {
        title: "Carry history into a decision",
        paragraphs: [
          "A recurrent policy receives the current observation and a hidden state carried from the previous step. It emits an action and an updated state. This allows the action to depend on summarized history when the current observation alone is insufficient.",
          "My master's thesis studied recurrent PPO for multi-asset portfolio optimization. A policy chooses allocations using current observations and carried state; subsequent portfolio behavior supplies feedback. The diagram explains the computational relationships without inventing a trained-policy trace.",
        ],
      },
      {
        title: "Distinguish recurrence from the update objective",
        paragraphs: [
          "Recurrence describes how a policy carries information between steps. PPO describes how collected trajectories update the policy, using a clipped objective to limit changes relative to the previous policy. These are separate design choices: a recurrent architecture does not itself specify a learning objective.",
          "Evaluation must respect time. Future observations must not enter the current decision, and performance on familiar sequences does not establish generalization to a changed regime. Reward design, state representation and the evaluation environment jointly determine what can be learned and measured.",
        ],
      },
    ],
    related: ["scientific-data-analysis", "recommendation-and-probability"],
  },
  {
    slug: "scientific-data-analysis",
    title: "Scientific data analysis",
    summary:
      "Measurements, preprocessing and statistical representation determine what an analysis can say. Interpreting high-dimensional temporal data requires keeping a numerical pattern connected to the observations that produced it.",
    categories: ["Scientific data analysis"],
    methods: [
      "Multivariate statistics",
      "Neural networks",
      "Scientific visualization",
    ],
    sections: [
      {
        title: "Respect the measurement process",
        paragraphs: [
          "My neuroscience work involved calcium-imaging recordings of large neural populations, multivariate statistical analysis, neural networks and visualization. The analysis sought patterns in neuronal activity while keeping derived representations connected to the underlying measurements. I also led a data science team and developed analysis software for researchers.",
          "Calcium-imaging recordings represent neuronal activity through measured fluorescence over time. Population-level analysis brings many neuronal traces together, so the relationship between a measurement, a temporal pattern and a learned representation matters. Preprocessing determines which variation survives into a model: normalization changes relative scale, aggregation changes the unit of observation, and temporal representation changes which dependencies are available. Interpretation has to account for those choices.",
        ],
      },
      {
        title: "Connect representations to observations",
        paragraphs: [
          "A compact representation can expose structure while concealing distinctions in the original data. Inspecting transformed and original measurements together helps determine what a pattern actually represents. Numerical summaries and visualization answer complementary questions.",
          "Other analytical work has included environmental-impact estimation and dashboards for inspecting its outputs. Across these areas, the technical work spans data preparation, exploratory analysis, multivariate methods and model-based pattern detection. A scientific interpretation requires more than a clear plot: the measurement assumptions, transformation and comparison population must remain explicit.",
        ],
      },
    ],
    related: ["time-series-and-distribution-shifts", "reinforcement-learning"],
  },
  {
    slug: "data-intensive-software",
    title: "ML software & data pipelines",
    summary:
      "A model interface is also a mathematical contract. Saved transformations, feature meanings and prediction behavior must agree between training, evaluation and the software that consumes the model.",
    categories: ["Software engineering"],
    methods: ["Prediction contracts", "Data pipelines", "Model integration"],
    figure: "software",
    sections: [
      {
        title: "Preserve the meaning of an input",
        paragraphs: [
          "A fitted model expects the feature representation used during training. Recomputing a normalization transform on an inference batch changes that representation even when the raw observation stays the same. Serialization must preserve the transformation as well as the fitted coefficients.",
          "My work spans analytical pipelines, model integration, structured data and services exposing predictions to other software, including BERT training, inference and the data-management interfaces around them. Prediction parity, reference implementations and repeatable transformations make the boundary between numerical methods and applications testable.",
        ],
      },
      {
        title: "Make the interface inspectable",
        paragraphs: [
          "An input contract specifies feature names, types, units, missing-value handling and transformation order. An output contract specifies the quantity returned: a probability, ranking score, label or estimate. Keeping these distinctions explicit prevents a correctly executed model from answering the wrong question.",
          "Supporting work includes lazy analytical queries, selective loading, orchestration of long-running tasks and analytical interfaces. These choices support the modeling workflow; they do not replace evaluation of the numerical result.",
        ],
      },
    ],
    related: [
      "recommendation-and-probability",
      "text-classification-and-retrieval",
    ],
  },
];
export const featuredTopics = [
  "statistical-pattern-discovery",
  "recommendation-and-probability",
  "tool-using-agents",
  "statistical-signatures-and-graphs",
].map((slug) => topics.find((topic) => topic.slug === slug)!);
export const topicAreas = categories
  .filter((category) => category !== "All")
  .map((title) => ({
    title,
    slugs: topics
      .filter((topic) => topic.categories[0] === title)
      .map((topic) => topic.slug),
  }));
export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}
