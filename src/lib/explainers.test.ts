import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fixtures from "@/data/explainer-fixtures.json";
import {
  cosine,
  evaluationExamples,
  structurePasses,
  eligibleRules,
  predictResponse,
  rankCandidates,
} from "./explainers";
import { investigation, agentTiming } from "./agent-investigation";
import { featuredTopics, topicAreas, topics } from "@/data/topics";

const near = (a: number, b: number, tolerance = 1e-7) =>
  assert.ok(Math.abs(a - b) < tolerance, `${a} differs from ${b}`);
describe("rule screening", () => {
  it("preserves counts and selects the fitted high-lift leaf", () => {
    const groups = fixtures.rules.groups;
    assert.equal(
      groups.reduce((sum, g) => sum + g.count, 0),
      1000,
    );
    assert.equal(
      groups.reduce((sum, g) => sum + g.affected, 0),
      64,
    );
    const [rule] = eligibleRules(10);
    assert.equal(rule.history, "Short");
    assert.equal(rule.debt, "High");
    assert.equal(rule.coverage, 12);
    near(rule.lift, 5.46875);
    assert.equal(eligibleRules(13).length, 0);
    assert.equal(fixtures.rules.nodes[0].feature, 0);
    assert.equal(fixtures.rules.nodes[fixtures.rules.nodes[0].left].feature, 1);
    assert.equal(
      fixtures.rules.nodes[fixtures.rules.nodes[0].right].feature,
      1,
    );
    for (const g of groups) {
      const records = fixtures.rules.records.filter(
        (r) => r.group === groups.indexOf(g),
      );
      assert.equal(records.length, g.count);
      assert.equal(
        records.filter((r) => r.decision === "Declined").length,
        g.affected,
      );
    }
  });
});
describe("model and representation parity", () => {
  it("matches scikit-learn probabilities after serialization", () => {
    for (const candidate of fixtures.ranking.candidates)
      near(predictResponse(candidate.features), candidate.probability);
    const low = rankCandidates("A", -2, true),
      high = rankCandidates("A", 2, true);
    assert.ok(
      high.findIndex((c) => c.id === "A") < low.findIndex((c) => c.id === "A"),
    );
    assert.equal(rankCandidates("A", -2, false)[0].id, "A");
  });
});
describe("graph and temporal fixtures", () => {
  it("uses weighted signature geometry, fixed edges and real CPM partitions", () => {
    const {
      vectors,
      similarity,
      presets,
      edges,
      reference,
      evidence,
      zThreshold,
    } = fixtures.graph;
    for (let a = 0; a < vectors.length; a++) {
      for (const item of evidence[a]) {
        assert.ok(item.z >= zThreshold && item.kl > 0);
        near(item.weight, -Math.log2(reference[item.index]));
        near(vectors[a][item.index], item.weight);
      }
      for (let b = a + 1; b < vectors.length; b++) {
        near(cosine(vectors[a], vectors[b]), similarity[a][b]);
        assert.equal(
          edges.some(([i, j]) => i === a && j === b),
          similarity[a][b] >= 0.05,
        );
      }
    }
    assert.equal(presets[0].gamma, 0.1);
    assert.deepEqual(presets[0].groups, [
      [0, 1, 2],
      [3, 4, 5],
    ]);
    assert.deepEqual(presets[0].singletons, [6]);
    assert.notDeepEqual(presets[0].membership, presets[1].membership);
    for (const preset of presets) {
      const members = [...preset.groups.flat(), ...preset.singletons].sort();
      assert.deepEqual(members, [0, 1, 2, 3, 4, 5, 6]);
      assert.ok(preset.groups.every((group) => group.length >= 2));
    }
    const split = fixtures.graph.authoredSplit;
    assert.deepEqual(
      [...split.groups.flat(), ...split.singletons].sort(),
      [0, 1, 2, 3, 4, 5, 6],
    );
  });
  it("segments the deseasonalized observations with valid boundaries", () => {
    const { observed, seasonal, deseasoned, segments } = fixtures.temporal;
    observed.forEach((v, i) => near(v - seasonal[i], deseasoned[i]));
    assert.notDeepEqual(segments[0].ends, segments.at(-1)!.ends);
    for (const segmentation of segments) {
      assert.equal(segmentation.ends.at(-1), observed.length);
      let start = 0;
      segmentation.ends.forEach((end, i) => {
        assert.ok(end - start >= 8);
        near(
          deseasoned.slice(start, end).reduce((a, b) => a + b, 0) /
            (end - start),
          segmentation.means[i],
        );
        start = end;
      });
    }
  });
  it("recognizes identifiers, exact signatures and verified candidates without forcing a match", () => {
    assert.deepEqual(
      fixtures.retrieval.map((e) => e.route),
      ["identifier", "exact", "verified", "new"],
    );
    for (const e of fixtures.retrieval) {
      const gates =
        (e.similarity >= 0.82 && e.fuzzy >= 90) ||
        (e.similarity >= 0.92 && e.fuzzy >= 85);
      assert.equal(e.accepted, e.known || e.exact || gates);
    }
    assert.equal(fixtures.retrieval[1].canonical, "could not open document at");
    assert.equal(fixtures.retrieval[3].accepted, false);
  });
});
describe("homepage coverage", () => {
  it("features four distinct areas and accounts for every topic once in the overview", () => {
    assert.equal(featuredTopics.length, 4);
    assert.deepEqual(
      featuredTopics.map((t) => t.slug),
      [
        "statistical-pattern-discovery",
        "recommendation-and-probability",
        "tool-using-agents",
        "statistical-signatures-and-graphs",
      ],
    );
    assert.equal(topics.length, 12);
    assert.equal(
      topics.find((t) => t.slug === "scientific-data-analysis")?.figure,
      undefined,
    );
    for (const topic of topics)
      for (const related of topic.related)
        assert.ok(topics.some((t) => t.slug === related));
    const slugs = topicAreas.flatMap((area) => area.slugs);
    assert.equal(new Set(slugs).size, topics.length);
    assert.equal(slugs.length, topics.length);
    assert.ok(topics.every((topic) => slugs.includes(topic.slug)));
  });
});

describe("explanation calculations", () => {
  it("compares first splits against the observed target distribution", () => {
    const records = fixtures.rules.records;
    for (const [feature, split] of fixtures.rules.splitComparisons.entries()) {
      let weighted = 0;
      for (const value of [0, 1]) {
        const rows = records.filter((r) => r.features[feature] === value);
        const rate =
          rows.filter((r) => r.decision === "Declined").length / rows.length;
        weighted += (rows.length / records.length) * 2 * rate * (1 - rate);
      }
      near(weighted, split.weightedGini);
    }
    assert.ok(
      fixtures.rules.splitComparisons[0].weightedGini <
        fixtures.rules.splitComparisons[1].weightedGini,
    );
  });
  it("uses genuinely different controls and keeps ranking scores explicit", () => {
    assert.deepEqual(
      fixtures.graph.presets.map((p) => p.gamma),
      [0.1, 0.5],
    );
    assert.notDeepEqual(
      fixtures.graph.presets[0].membership,
      fixtures.graph.presets[1].membership,
    );
    assert.deepEqual(
      fixtures.temporal.segments.map((p) => p.penalty),
      [8, 100],
    );
    assert.notDeepEqual(
      fixtures.temporal.segments[0].ends,
      fixtures.temporal.segments[1].ends,
    );
    const relevant = rankCandidates("A", -1.2, false),
      combined = rankCandidates("A", -1.2, true);
    assert.equal(relevant[0].id, "A");
    assert.equal(combined[0].id, "B");
    for (const c of combined) near(c.score, c.relevance * c.probability);
    for (const row of fixtures.graph.screening) assert.equal(row.length, 6);
  });
  it("distinguishes structure, evidence and usefulness rather than an aggregate rate", () => {
    assert.deepEqual(
      evaluationExamples.map((e) => [
        structurePasses(e.output),
        e.evidence,
        e.useful,
      ]),
      [
        [true, true, true],
        [true, false, false],
        [false, true, true],
        [true, true, false],
      ],
    );
    for (const invalid of [
      "null",
      "{}",
      '{"answer":2,"sources":[]}',
      '{"answer":"x","sources":[1]}',
    ])
      assert.equal(structurePasses(invalid), false);
  });
});

describe("investigation evidence and graph semantics", () => {
  it("derives reported and matched gains from correctness records and sample identities", () => {
    for (const data of fixtures.agents) {
      const n = data.records.length;
      const differences = data.records.map(
        (r) => Number(r.candidate) - Number(r.baseline),
      );
      const gain = differences.reduce((a, b) => a + b, 0) / n;
      const variance =
        differences.reduce((a, b) => a + b * b, 0) / n - gain * gain;
      const half = 1.96 * Math.sqrt(variance / n);
      near(gain, data.matched.gain);
      near(gain - half, data.matched.interval[0]);
      near(gain + half, data.matched.interval[1]);
      assert.equal(
        data.matched.baselineCorrect,
        data.records.filter((r) => r.baseline).length,
      );
      assert.equal(
        data.matched.candidateCorrect,
        data.records.filter((r) => r.candidate).length,
      );
      assert.equal(
        data.reported.candidateCorrect,
        data.reportedRecords.filter((r) => r.candidate).length,
      );
      assert.equal(
        data.matched.discordant,
        differences.filter((d) => d !== 0).length,
      );
      const sameIds = data.reportedRecords.every(
        (r, i) => r.id === data.records[i].id,
      );
      assert.equal(sameIds, !data.changed);
      assert.equal(
        data.metadata.baselinePopulation === data.metadata.candidatePopulation,
        !data.changed,
      );
      assert.equal(data.matched.interval[0] > 0, !data.changed);
    }
  });
  it("keeps the authored task flow conditional on observed evidence", () => {
    const same = investigation(false),
      changed = investigation(true);
    assert.ok(
      changed.steps
        .find((s) => s.at === agentTiming.matched.call)!
        .operation!.startsWith("load_pairs"),
    );
    assert.ok(
      same.steps
        .find((s) => s.at === agentTiming.matched.call)!
        .operation!.startsWith("compare_paired"),
    );
    assert.ok(
      changed.steps
        .find((s) => s.at === agentTiming.matched.secondCall)!
        .operation!.startsWith("compare_paired"),
    );
    assert.ok(changed.conclusion.includes("not established"));
    assert.ok(same.conclusion.includes("supports"));
  });
  it("separates C's singleton membership from G's lack of similarity edges", () => {
    const { edges, presets, similarity } = fixtures.graph;
    const neighbors = (node: number) =>
      edges
        .filter(([a, b]) => a === node || b === node)
        .map(([a, b]) => (a === node ? b : a))
        .sort();
    assert.deepEqual(neighbors(2), [0, 1, 5]);
    assert.deepEqual(neighbors(6), []);
    near(similarity[2][0], 0.46300668);
    near(similarity[2][5], 0.40660712);
    assert.equal(presets[0].membership[2], presets[0].membership[0]);
    assert.notEqual(presets[1].membership[2], presets[1].membership[0]);
    assert.ok(presets[1].singletons.includes(2));
    assert.ok(presets.every((p) => p.singletons.includes(6)));
  });
  it("checks each reported CPM partition against all partitions of this small graph", () => {
    const { edges, similarity, presets } = fixtures.graph;
    function score(labels: number[], gamma: number) {
      const observed = edges.reduce(
        (s, [a, b]) => s + (labels[a] === labels[b] ? similarity[a][b] : 0),
        0,
      );
      let pairs = 0;
      for (let a = 0; a < 7; a++)
        for (let b = a + 1; b < 7; b++) if (labels[a] === labels[b]) pairs++;
      return observed - gamma * pairs;
    }
    const partitions: number[][] = [];
    function extend(labels: number[]) {
      if (labels.length === 7) {
        partitions.push(labels);
        return;
      }
      for (let i = 0; i <= Math.max(...labels) + 1; i++) extend([...labels, i]);
    }
    extend([0]);
    for (const preset of presets) {
      const best = Math.max(...partitions.map((p) => score(p, preset.gamma)));
      near(score(preset.membership, preset.gamma), best);
    }
  });
});
