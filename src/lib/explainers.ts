import fixtures from "@/data/explainer-fixtures.json";

export const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
export function predictResponse(features: number[]) {
  return sigmoid(
    fixtures.ranking.intercept +
      features.reduce(
        (sum, value, index) =>
          sum + value * fixtures.ranking.coefficients[index],
        0,
      ),
  );
}
export function rankCandidates(
  selected: string,
  feature: number,
  combined: boolean,
) {
  return fixtures.ranking.candidates
    .map((candidate) => {
      const features =
        candidate.id === selected
          ? [feature, candidate.features[1]]
          : candidate.features;
      const probability = predictResponse(features);
      return {
        ...candidate,
        features,
        probability,
        score: combined
          ? candidate.relevance * probability
          : candidate.relevance,
      };
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
export function eligibleRules(minimumCoverage: number) {
  const all = fixtures.rules.groups;
  const total = all.reduce((sum, g) => sum + g.count, 0);
  const affected = all.reduce((sum, g) => sum + g.affected, 0);
  return all
    .map((g) => ({
      ...g,
      coverage: (100 * g.count) / total,
      rate: g.affected / g.count,
      lift: g.affected / g.count / (affected / total),
    }))
    .filter((g) => g.coverage >= minimumCoverage && g.lift >= 2);
}
export function cosine(a: number[], b: number[]) {
  const norm = (values: number[]) => Math.hypot(...values);
  return a.reduce((sum, v, i) => sum + v * b[i], 0) / (norm(a) * norm(b));
}
export function linePath(
  values: number[],
  width: number,
  height: number,
  min = Math.min(...values),
  max = Math.max(...values),
) {
  return values
    .map(
      (v, i) =>
        `${i ? "L" : "M"}${((i * width) / (values.length - 1)).toFixed(2)},${(height - ((v - min) / (max - min || 1)) * height).toFixed(2)}`,
    )
    .join(" ");
}
export const percent = (value: number, digits = 1) =>
  `${(value * 100).toFixed(digits)}%`;

export const evaluationExamples = [
  {
    name: "Supported",
    output: '{"answer":"The observed gain is 1 percentage point; the interval includes zero.","sources":["S1","S2"]}',
    evidence: true,
    useful: true,
    note: "The answer answers the comparison, matches the source facts and satisfies the JSON contract.",
  },
  {
    name: "Unsupported",
    output:
      '{"answer":"The candidate improves accuracy by 10 points with certainty.","sources":["S2"]}',
    evidence: false,
    useful: false,
    note: "The JSON contract passes, but both the gain and certainty contradict S2. A readable output can still be factually wrong.",
  },
  {
    name: "Broken format",
    output: "The observed gain is 1 percentage point; the interval includes zero. [S1, S2]",
    evidence: true,
    useful: true,
    note: "The claim is supported and answers the question, but the application cannot parse the required JSON object.",
  },
  {
    name: "Unhelpful",
    output: '{"answer":"The baseline accuracy is 80%.","sources":["S1"]}',
    evidence: true,
    useful: false,
    note: "The statement is supported and well-formed, but does not answer whether the candidate improves on the baseline.",
  },
];
export function structurePasses(output: string) {
  try {
    const value = JSON.parse(output);
    return (
      value !== null &&
      typeof value === "object" &&
      typeof value.answer === "string" &&
      Array.isArray(value.sources) &&
      value.sources.every((source: unknown) => typeof source === "string")
    );
  } catch {
    return false;
  }
}
