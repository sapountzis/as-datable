"use client";
import StableSlot from "./StableSlot";
import { useState } from "react";
import { useTransform } from "motion/react";
import fixtures from "@/data/explainer-fixtures.json";
import { percent } from "@/lib/explainers";
import Explainer, { type Scene } from "./Explainer";
import { DrawLine, interpolate, MotionPath, Reveal } from "./ScenePrimitives";

const data = fixtures.rules;
const groups = data.groups;
export default function RuleFigure() {
  const [selected, setSelected] = useState(0);
  return (
    <Explainer
      variant="rules"
      title="Supervised rule discovery"
      chapters={[
        {
          at: 0,
          label: "Decisions before explanations",
          description:
            "The mixed population contains 936 approvals and 64 declines. Six inspected attributes are possible predictors; the recorded decision is the separate target.",
        },
        {
          at: 0.12,
          label: "Search competing explanations",
          description:
            "Compare all six candidate first splits. Weighted Gini measures how mixed approval and decline outcomes remain after a split. Lower is purer; no input directly gives the decision.",
        },
        {
          at: 0.3,
          label: "Choose credit history",
          description:
            "Credit history gives the lowest first-split impurity. The same applications move into short and established histories; both populations still contain approvals and declines.",
        },
        {
          at: 0.52,
          label: "Discover an interaction",
          description:
            "Within each history branch, debt burden provides the next split. The combination exposes a concentration that neither attribute alone describes as precisely.",
        },
        {
          at: 0.8,
          label: "Read the rule and its limits",
          description:
            "The selected path is an interpretable conjunction. Compare its share of applications, its decline rate and the declines it captures. It describes recorded behavior, not causality or individual creditworthiness.",
        },
      ]}
      caption="Synthetic records; fitted depth-two decision tree over six inspected attributes. One dot per application. This is an illustration of decision auditing, not a lending model."
      inspect={
        <>
          <div className="formula">
            Gini(p) = 2p(1 − p)
            <br />
            Split score = Σ(child count / parent count) × Gini(child)
            <br />
            Coverage = leaf count / 1,000
            <br />
            Lift = leaf decline rate / 0.064
          </div>
          <p>
            Coverage and lift measure different properties. Short history with
            high debt contains 42 of 64 declines in 120 of 1,000 applications. A
            held-out dataset is needed to assess whether a discovered rule
            generalizes. A shallow tree approximates population structure; it
            does not fully explain each recorded decision.
          </p>
        </>
      }
    >
      {(scene) => (
        <>
          <div className="split-comparison" aria-label="Candidate first splits">
            {data.splitComparisons.map((split, i) => (
              <div
                key={split.feature}
                data-selected={scene.position >= 0.3 && i === 0}
              >
                <span>{split.feature}</span>
                <strong>
                  {scene.position >= 0.12 ? split.weightedGini.toFixed(4) : "—"}
                </strong>
              </div>
            ))}
            <span>First-split weighted Gini · lower is purer</span>
          </div>
          <RuleScene {...scene} selected={selected} />
          <div className="scene-interactions">
            <label className="inline-select">
              Inspect a leaf
              <select
                aria-label="Inspect a rule leaf"
                disabled={scene.position < 0.7}
                value={selected}
                onChange={(e) => {
                  scene.pause();
                  setSelected(Number(e.target.value));
                }}
              >
                {groups.map((g, i) => (
                  <option key={i} value={i}>
                    {g.history} history · {g.debt.toLowerCase()} debt
                  </option>
                ))}
              </select>
            </label>
          </div>
          <StableSlot
            className="scene-result"
            active={
              scene.position < 0.3
                ? 0
                : scene.position < 0.52
                  ? 1
                  : scene.position < 0.8
                    ? 2
                    : 3 + selected
            }
            items={[
              <>
                <strong>1,000 applications · 64 declines</strong>
                <span>
                  Decision labels color the dots; the search uses separate input
                  attributes.
                </span>
              </>,
              <>
                <strong>
                  Short history: 52 / 400 · Established: 12 / 600 declined
                </strong>
                <span>
                  The same applications remain visible through the search.
                </span>
              </>,
              <>
                <strong>Two conditions expose a concentrated population</strong>
                <span>
                  The same applications remain visible through the search.
                </span>
              </>,
              ...groups.map((g) => (
                <>
                  <strong>
                    {g.history} history AND {g.debt.toLowerCase()} debt
                  </strong>
                  <span>
                    {g.affected} / {g.count} declined ·{" "}
                    {percent(g.affected / g.count)} vs 6.4% overall
                  </span>
                  <span>
                    {percent(g.count / 1000, 0)} coverage ·{" "}
                    {(g.affected / g.count / 0.064).toFixed(2)}× lift ·{" "}
                    {percent(g.affected / 64, 0)} of all declines
                  </span>
                </>
              )),
            ]}
          />
        </>
      )}
    </Explainer>
  );
}
function RuleScene(scene: Scene & { selected: number }) {
  const { progress, width: w, compact, selected } = scene;
  const h = 300,
    xs = groups.map((_, i) => (w * (i + 0.5)) / 4),
    branches = [w / 4, w * 0.75];
  return (
    <svg
      className="scene-canvas"
      style={{ height: h }}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="A mixed population of recorded decisions partitions by credit history, then debt burden"
    >
      <text x={w / 2} y={22} textAnchor="middle" className="scene-label-text">
        1,000 applications
      </text>
      {[0, 1].map((branch) => (
        <g key={branch}>
          <DrawLine
            progress={progress}
            from={0.27}
            to={0.4}
            x1={w / 2}
            y1={32}
            x2={branches[branch]}
            y2={79}
          />
          <Reveal progress={progress} from={0.34} to={0.42}>
            <text
              x={branches[branch]}
              y={99}
              textAnchor="middle"
              className="scene-label-text"
            >
              {branch === 0 ? "<2 yr · 400" : "2+ yr · 600"}
            </text>
          </Reveal>
        </g>
      ))}
      {groups.map((g, i) => (
        <g key={i}>
          <DrawLine
            progress={progress}
            from={0.5}
            to={0.63}
            x1={branches[i < 2 ? 0 : 1]}
            y1={108}
            x2={xs[i]}
            y2={151}
            className={
              selected === i ? "scene-link selected-link" : "scene-link"
            }
          />
          <RulePoints {...scene} groupIndex={i} declined={false} />
          <RulePoints {...scene} groupIndex={i} declined />
          <Reveal progress={progress} from={0.64} to={0.73}>
            <rect
              x={xs[i] - Math.min(48, w / 8 - 3)}
              y={157}
              width={Math.min(96, w / 4 - 6)}
              height={116}
              rx={5}
              fill="none"
              stroke={selected === i ? "var(--teal)" : "transparent"}
            />
            <text x={xs[i]} y={176} textAnchor="middle" className="scene-small">
              {g.debt}
            </text>
            <text
              x={xs[i]}
              y={compact ? 260 : 269}
              textAnchor="middle"
              className="scene-small"
            >
              {g.count}
            </text>
          </Reveal>
        </g>
      ))}
      <Reveal progress={progress} from={0.7} to={0.77}>
        <text x={w / 2} y={h - 3} textAnchor="middle" className="scene-small">
          Leaf counts · all applications retained
        </text>
      </Reveal>
    </svg>
  );
}
function RulePoints({
  progress,
  width: w,
  compact,
  selected,
  position,
  groupIndex,
  declined,
}: Scene & { selected: number; groupIndex: number; declined: boolean }) {
  const records = data.records.filter(
    (r) => r.group === groupIndex && (r.decision === "Declined") === declined,
  );
  const d = useTransform(() => {
    const p = progress.get(),
      initialCols = compact ? 32 : 50,
      initialSpace = Math.min(5, (w - 20) / initialCols),
      leafSpace = Math.min(4.2, (w / 4 - 12) / 20),
      branchSpace = Math.min(4, (w / 2 - 15) / 25);
    const offset = groups
      .slice(0, groupIndex)
      .reduce((sum, g) => sum + g.count, 0);
    const branchOffset = groupIndex % 2 ? groups[groupIndex - 1].count : 0;
    return records
      .map((r) => {
        const mixed = (r.id * 37) % 1000,
          local = r.id - offset,
          middle = local + branchOffset;
        const x0 =
            (w - initialCols * initialSpace) / 2 +
            (mixed % initialCols) * initialSpace,
          y0 = 42 + Math.floor(mixed / initialCols) * initialSpace;
        const x1 =
            w * (groupIndex < 2 ? 0.25 : 0.75) -
            12 * branchSpace +
            (middle % 25) * branchSpace,
          y1 = 116 + Math.floor(middle / 25) * branchSpace;
        const x2 =
            (w * (groupIndex + 0.5)) / 4 -
            10 * leafSpace +
            (local % 20) * leafSpace,
          y2 = 185 + Math.floor(local / 20) * leafSpace;
        const x = interpolate(
            p,
            [0, 0.25, 0.43, 0.5, 0.68, 1],
            [x0, x0, x1, x1, x2, x2],
          ),
          y = interpolate(
            p,
            [0, 0.25, 0.43, 0.5, 0.68, 1],
            [y0, y0, y1, y1, y2, y2],
          );
        return `M${x.toFixed(2)} ${y.toFixed(2)}a.7 .7 0 1 0 .01 0`;
      })
      .join(" ");
  });
  return (
    <MotionPath
      d={d}
      fill={declined ? "var(--teal)" : "var(--blue)"}
      className={
        position >= 0.7 && selected !== groupIndex
          ? "rule-dimmed"
          : "rule-points"
      }
    />
  );
}
