import fixtures from "@/data/explainer-fixtures.json";

export type EvidenceId = "M1" | "R1" | "P1";
export type WorkerKind = "data" | "metric" | "matched";
export const agentTiming = {
  delegate: 0.1,
  data: {
    start: 0.15,
    open: 0.2,
    call: 0.21,
    observed: 0.25,
    returnStart: 0.29,
    returned: 0.32,
    close: 0.34,
  },
  metric: {
    start: 0.35,
    open: 0.39,
    call: 0.4,
    observed: 0.43,
    returnStart: 0.46,
    returned: 0.49,
    close: 0.51,
  },
  matched: {
    start: 0.52,
    open: 0.56,
    call: 0.57,
    observed: 0.6,
    secondCall: 0.63,
    secondObserved: 0.68,
    returnStart: 0.72,
    returned: 0.76,
    close: 0.79,
  },
  verify: 0.81,
  checks: [0.84, 0.88, 0.92],
  complete: 0.96,
} as const;
export function workerTiming(kind: WorkerKind, changed: boolean) {
  if (kind === "metric" && !changed)
    return {
      ...agentTiming.metric,
      returnStart: 0.72,
      returned: 0.76,
      close: 0.79,
    };
  return agentTiming[kind];
}
export type InvestigationStep = {
  at: number;
  label: string;
  description: string;
  operation?: string;
  observation?: string;
};
export function investigation(changed: boolean) {
  const data = fixtures.agents[changed ? 1 : 0],
    matched = data.matched;
  const pp = (v: number) => `${(100 * v).toFixed(1)} pp`;
  const interval = `${pp(matched.interval[0])} to ${pp(matched.interval[1])}`;
  const conclusion = changed
    ? `On matched examples the gain is ${pp(matched.gain)}; the interval includes zero. A reliable improvement is not established.`
    : `On the shared test population the gain is ${pp(matched.gain)}, with a positive interval. This supports an improvement on these examples.`;
  const evidence: Record<
    EvidenceId,
    { title: string; source: string; result: string }
  > = {
    M1: {
      title: "Population metadata",
      source: "experiment-metadata.json",
      result: `Baseline: ${data.metadata.baselinePopulation}. Candidate: ${data.metadata.candidatePopulation}. ${changed ? "The reported scores use different populations." : "Both reported scores use the same population."}`,
    },
    R1: {
      title: "Reported accuracy counts",
      source: "evaluation-counts.json",
      result: `Baseline: 800 / 1,000 correct (80%). Candidate: 900 / 1,000 correct (90%). Raw difference: 10 percentage points. ${changed ? "This comparison mixes test populations." : "Both scores refer to eval-v1."}`,
    },
    P1: {
      title: "Paired comparison",
      source: "paired-correctness.csv · eval-v1",
      result: `Same 1,000 example IDs. Baseline ${matched.baselineCorrect} correct; candidate ${matched.candidateCorrect} correct. ${matched.discordant} disagreements. Gain ${pp(matched.gain)}; illustrative 95% normal interval ${interval}.`,
    },
  };
  const t = agentTiming;
  const steps: InvestigationStep[] = [
    {
      at: 0,
      label: "A claim to check",
      description:
        "A reported change from 80% to 90% accuracy needs comparable evidence. The coordinator starts with the claim and the available artifacts.",
    },
    {
      at: t.delegate,
      label: "Delegate bounded checks",
      description:
        "The coordinator assigns population and accuracy checks to two workers. Each worker has its own action/tool/observation loop and must return a source-linked finding.",
      operation: 'delegate({tasks: ["check_population", "check_accuracy"]})',
    },
    {
      at: t.data.call,
      label: "Data worker requests metadata",
      description:
        "The active worker selects a tool operation. The request crosses the agent/tool boundary; a result returns to the worker’s context.",
      operation: 'read_metadata({artifact: "experiment-metadata.json"})',
    },
    {
      at: t.data.observed,
      label: "Observe population identities",
      description: changed
        ? "The observation identifies eval-v1 and eval-v2. Different test populations can change accuracy independently of the model."
        : "The observation confirms eval-v1 for both models. A direct paired comparison is appropriate.",
      observation: evidence.M1.result,
    },
    {
      at: t.data.returnStart,
      label: "Return the data finding",
      description:
        "The worker sends finding M1 to the coordinator. Its retained result remains inspectable when the next worker takes focus.",
      observation: evidence.M1.result,
    },
    {
      at: t.metric.call,
      label: "Metric worker requests counts",
      description:
        "The second worker selects a tool, receives the counts, and updates its own context before returning a finding.",
      operation: 'read_counts({artifact: "evaluation-counts.json"})',
    },
    {
      at: t.metric.observed,
      label: "Reproduce the reported scores",
      description:
        "The counts reproduce the percentages. Their provenance determines whether the 10-point difference is a comparable result.",
      observation: evidence.R1.result,
    },
    {
      at: agentTiming.metric.returnStart,
      label: "Return the reported comparison",
      description:
        "Finding R1 returns to the coordinator. Together with M1, it determines the next task.",
      observation: evidence.R1.result,
    },
    {
      at: t.matched.start,
      label: changed
        ? "Create a task from the mismatch"
        : "Continue in the existing worker",
      description: changed
        ? "The coordinator creates a matched-comparison worker only after receiving the conflicting population evidence."
        : "No population-repair worker is needed. The existing metric worker continues with the shared examples.",
      operation: changed
        ? 'delegate({task: "matched_comparison", population: "eval-v1"})'
        : 'continue({worker: "metric", task: "paired_comparison"})',
    },
    {
      at: t.matched.call,
      label: changed
        ? "Load paired correctness records"
        : "Request the paired comparison",
      description: changed
        ? "The new worker first loads correctness for both models on the same example IDs. It needs that observation before it can select its next calculation."
        : "The metric worker already has comparable sample identities and can request the paired calculation directly.",
      operation: changed
        ? 'load_pairs({population: "eval-v1"})'
        : 'compare_paired({population: "eval-v1"})',
    },
    {
      at: t.matched.observed,
      label: changed
        ? "Observe shared IDs, then act again"
        : "Await the paired calculation",
      description: changed
        ? "The tool returns 1,000 shared IDs and paired correctness. The worker updates its context and selects a calculation tool as the next action."
        : "The tool is calculating gain and uncertainty from the shared per-example predictions.",
      observation: changed
        ? "1,000 shared IDs loaded; paired correctness available."
        : undefined,
    },
    ...(changed
      ? [
          {
            at: t.matched.secondCall,
            label: "Calculate gain and uncertainty",
            description:
              "A second tool operation turns paired correctness into an accuracy difference and an uncertainty interval.",
            operation: 'compare_paired({population: "eval-v1"})',
          },
        ]
      : []),
    {
      at: t.matched.secondObserved,
      label: "Observe the matched result",
      description: changed
        ? "The apparent 10-point gain shrinks to 1 point. The interval includes zero; the matched evidence does not establish an improvement."
        : "The matched gain is 10 points and the interval remains positive. The evidence supports this evaluated population.",
      observation: evidence.P1.result,
    },
    {
      at: t.matched.returnStart,
      label: "Return a source-linked finding",
      description:
        "The worker returns P1: its matched result, uncertainty and source. The coordinator receives the result of a completed investigation, rather than assuming a tool call is an answer.",
      observation: evidence.P1.result,
    },
    {
      at: t.verify,
      label: "Verify and revise",
      description: changed
        ? "Verification rejects the original 10-point claim because it conflicts with the matched result and omits uncertainty."
        : "Verification rejects a claim of universal superiority. The evidence supports the evaluated population, not all future uses.",
      operation:
        'verify({checks: ["same_examples", "gain", "uncertainty", "scope"]})',
      observation: changed
        ? "Draft: “The model improves accuracy by 10 points.” → revise."
        : "Draft: “The candidate is universally better.” → revise.",
    },
    {
      at: t.complete,
      label: "Stop with a supported conclusion",
      description:
        "The revised conclusion agrees with the matched records and uncertainty. Sources remain inspectable; future populations remain outside the result.",
      observation: `Matched accuracy: 80% → ${(100 * matched.candidateCorrect) / matched.count}% · n = ${matched.count} · 95% interval ${interval}.`,
    },
  ];
  return { data, steps, evidence, conclusion, interval };
}
