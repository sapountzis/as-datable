"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Bot, Wrench, FileText, Check, Circle, X } from "lucide-react";
import { useTransform } from "motion/react";
import {
  investigation,
  type EvidenceId,
  type WorkerKind,
  agentTiming,
  workerTiming,
} from "@/lib/agent-investigation";
import Explainer, { type Scene } from "./Explainer";
import StableSlot from "./StableSlot";
import { interpolate, MotionGroup, MotionPath } from "./ScenePrimitives";

export default function EvidenceFigure() {
  const [changed, setChanged] = useState(true);
  const [source, setSource] = useState<EvidenceId | null>(null);
  const trace = investigation(changed);
  return (
    <Explainer
      variant="agents"
      title="Language-model agents & tool use"
      duration={38}
      chapters={trace.steps}
      reserveChapters={[
        ...investigation(false).steps,
        ...investigation(true).steps,
      ]}
      caption="Authored agent traces with computed synthetic tool evidence. pp = percentage points. The interval assumes independent evaluation examples."
      inspect={
        <>
          <p>
            A worker receives a question, scoped context and a result contract.
            Observations determine whether the coordinator creates another task.
            Verification compares the conclusion with the collected evidence.
          </p>
          <div className="formula">
            dᵢ = candidate_correctᵢ − baseline_correctᵢ
            <br />
            gain = mean(d)
            <br />
            SE = √((mean(d²) − mean(d)²) / n)
            <br />
            Illustrative interval = gain ± 1.96 × SE
          </div>
          <ol>
            {trace.steps.map((s) => (
              <li key={s.at}>
                {s.label}
                {s.operation && <code> · {s.operation}</code>}
              </li>
            ))}
          </ol>
        </>
      }
    >
      {(scene) => {
        return (
          <>
            <div className="scene-interactions">
              <label className="inline-select">
                Evidence condition
                <select
                  aria-label="Evaluation population"
                  value={String(changed)}
                  onChange={(e) => {
                    scene.pause();
                    setChanged(e.target.value === "true");
                  }}
                >
                  <option value="false">Comparable evaluation</option>
                  <option value="true">Changed test population</option>
                </select>
              </label>
            </div>
            <div className="agent-task">
              <strong>Check a reported model improvement</strong>
              <span>Claim: accuracy rises from 80% to 90%.</span>
            </div>
            <AgentScene
              {...scene}
              changed={changed}
              source={source}
              onSource={(id) => {
                scene.pause();
                setSource(source === id ? null : id);
              }}
            />
          </>
        );
      }}
    </Explainer>
  );
}
const workers: WorkerKind[] = ["data", "metric", "matched"];
const names: Record<WorkerKind, string> = {
  data: "Population check",
  metric: "Accuracy check",
  matched: "Matched comparison",
};
const tasks: Record<WorkerKind, string> = {
  data: "Check which examples each score used.",
  metric: "Reproduce the reported accuracy counts.",
  matched: "Compare both models on the same examples.",
};
type Point = [number, number];
const route = (points: Point[]) =>
  points
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(3)} ${y.toFixed(3)}`)
    .join("");
function along(points: Point[], amount: number): Point {
  const lengths = points
    .slice(1)
    .map((point, i) =>
      Math.hypot(point[0] - points[i][0], point[1] - points[i][1]),
    );
  let remaining =
    Math.max(0, Math.min(1, amount)) * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const f = lengths[i] ? remaining / lengths[i] : 1;
      return [
        points[i][0] + f * (points[i + 1][0] - points[i][0]),
        points[i][1] + f * (points[i + 1][1] - points[i][1]),
      ];
    }
    remaining -= lengths[i];
  }
  return points.at(-1)!;
}
function activeWorker(p: number, changed: boolean): WorkerKind | null {
  return (
    workers.find(
      (kind) =>
        (changed || kind !== "matched") &&
        p >= workerTiming(kind, changed).start &&
        p < workerTiming(kind, changed).close,
    ) ?? null
  );
}
function currentLoop(kind: WorkerKind, p: number, changed: boolean) {
  const t = workerTiming(kind, changed);
  const second =
    (kind === "matched" && p >= agentTiming.matched.secondCall) ||
    (kind === "metric" && !changed && p >= agentTiming.matched.call);
  const call = second
    ? kind === "metric"
      ? agentTiming.matched.call
      : agentTiming.matched.secondCall
    : t.call;
  const observed = second ? agentTiming.matched.secondObserved : t.observed;
  const label = second
    ? "compare_paired()"
    : kind === "data"
      ? "read_metadata()"
      : kind === "metric"
        ? "read_counts()"
        : "load_pairs()";
  const ready = p >= observed + 0.02;
  const context = ready
    ? kind === "data"
      ? changed
        ? "Baseline: eval-v1. Candidate: eval-v2."
        : "Both scores use eval-v1."
      : kind === "metric" && !second
        ? "800 / 1,000 → 900 / 1,000 correct."
        : kind === "matched" && !second
          ? "1,000 shared IDs; paired correctness loaded."
          : changed
            ? "Gain 1 pp; 95% interval −0.9 to 2.9 pp."
            : "Gain 10 pp; 95% interval 7.8 to 12.2 pp."
    : second
      ? "Shared examples retained; awaiting calculation."
      : p >= call
        ? "Waiting for the tool’s observation."
        : tasks[kind];
  const decision =
    kind === "data"
      ? ready
        ? changed
          ? "Report the population mismatch."
          : "Confirm that a paired comparison is possible."
        : "Read the evaluation metadata."
      : kind === "metric" && !second
        ? ready
          ? changed
            ? "Return the counts; they do not resolve comparability."
            : "Use the shared examples to calculate uncertainty."
          : "Read the reported counts."
        : kind === "matched" && !second
          ? ready
            ? "Shared IDs are available. Calculate paired gain next."
            : "Load both predictions for shared examples."
          : ready
            ? "Return the gain, uncertainty and source."
            : "Calculate the gain on the shared examples.";
  return { call, observed, label, context, decision, ready };
}
const copyVariants = workers.flatMap((kind) =>
  [false, true].flatMap((changed) =>
    [0, 0.23, 0.27, 0.45, 0.6, 0.62, 0.65, 0.7, 1].map((p) =>
      currentLoop(kind, p, changed),
    ),
  ),
);
const contextCopy = [...new Set(copyVariants.map((v) => v.context))];
const decisionCopy = [
  ...new Set(copyVariants.map((v) => v.decision)),
  "P1 · matched gain and uncertainty",
];
function AgentScene(
  scene: Scene & {
    changed: boolean;
    source: EvidenceId | null;
    onSource: (id: EvidenceId) => void;
  },
) {
  const { changed, position: p, source, onSource } = scene;
  const header = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(180);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setHeaderHeight(entry.borderBoxSize[0].blockSize),
    );
    if (header.current) observer.observe(header.current);
    return () => observer.disconnect();
  }, []);
  const wide = scene.width >= 760,
    width = Math.min(scene.width, 940);
  const kinds = workers;
  const active = activeWorker(p, changed);
  const focus =
    active ??
    (p >= agentTiming.matched.start && changed
      ? "matched"
      : p >= agentTiming.metric.start
        ? "metric"
        : "data");
  const sources: EvidenceId[] =
    p >= agentTiming.matched.returned
      ? ["M1", "R1", "P1"]
      : p >= agentTiming.metric.returned
        ? ["M1", "R1"]
        : p >= agentTiming.data.returned
          ? ["M1"]
          : [];
  const summaries = [
    "Inspect the claim. Delegate checks, then synthesize the evidence.",
    "Check the populations and reproduce both accuracy scores.",
    "Populations differ. The accuracy check is still needed.",
    "Shared population confirmed. Check accuracy counts next.",
    "Population mismatch: request a matched comparison.",
    "Shared examples: continue with the accuracy worker.",
    "Findings received. Verify samples, gain, uncertainty and scope.",
    "Reject the 10-point claim; retain the matched uncertainty.",
    "Limit the conclusion to the evaluated population.",
    "Matched gain: 1 pp. The interval includes zero; improvement is uncertain.",
    "Matched gain: 10 pp; positive interval. Supported on this test.",
  ];
  const summaryIndex =
    p >= agentTiming.complete
      ? changed
        ? 9
        : 10
      : p >= agentTiming.verify
        ? changed
          ? 7
          : 8
        : p >= agentTiming.matched.returned
          ? 6
          : p >= agentTiming.matched.start
            ? changed
              ? 4
              : 5
            : p >= agentTiming.data.returned
              ? changed
                ? 2
                : 3
              : p >= agentTiming.delegate
                ? 1
                : 0;
  const columnWidth = wide ? (width - 48 * 2) / 3 : width;
  const evidence = investigation(changed).evidence;
  const marker = useId().replaceAll(":", "");
  return (
    <div
      className="agent-composition"
      data-wide={wide}
      data-active-worker={active ?? "none"}
      style={{ width, maxWidth: "100%" }}
    >
      <div
        ref={header}
        className="agent-coordinator"
        data-agent-node="Coordinator"
        onKeyDown={(e) => {
          if (e.key === "Escape" && source) onSource(source);
        }}
      >
        <div className="agent-coordinator-icon">
          <Bot size={20} />
        </div>
        <strong>Coordinator</strong>
        <div className="agent-evidence" aria-label="Returned evidence">
          {sources.length ? (
            sources.map((id) => (
              <button
                type="button"
                key={id}
                aria-pressed={source === id}
                onClick={() => onSource(id)}
              >
                <FileText size={14} />
                {id}
              </button>
            ))
          ) : (
            <span>No findings returned yet</span>
          )}
        </div>
        <StableSlot
          className="agent-summary"
          active={summaryIndex}
          items={summaries.map((text) => (
            <p key={text}>{text}</p>
          ))}
        />
        <div className="agent-verification" aria-label="Verification checks">
          {["Samples", "Gain", "Uncertainty", "Scope"].map((label, i) => (
            <span key={label} data-checked={p >= 0.81 + (i + 1) * 0.03}>
              {p >= 0.81 + (i + 1) * 0.03 ? (
                <Check size={14} />
              ) : (
                <Circle size={12} />
              )}
              {label}
            </span>
          ))}
        </div>
        {source && sources.includes(source) && (
          <div
            className="agent-source-popover"
            role="region"
            aria-label="Source evidence"
            onKeyDown={(e) => {
              if (e.key === "Escape") onSource(source);
            }}
          >
            <button
              type="button"
              aria-label="Close source evidence"
              onClick={() => onSource(source)}
            >
              <X size={16} />
            </button>
            <strong>{evidence[source].title}</strong>
            <code>{evidence[source].source}</code>
            <p>{evidence[source].result}</p>
          </div>
        )}
      </div>
      <svg
        className="agent-delegation"
        viewBox={`0 0 ${width} ${headerHeight + (wide ? 96 : 116)}`}
        style={{ height: headerHeight + (wide ? 96 : 116) }}
        aria-hidden="true"
      >
        <defs>
          <marker
            id={marker}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path
              d="M1 1L9 5L1 9"
              fill="none"
              stroke="context-stroke"
              strokeWidth="1.5"
            />
          </marker>
        </defs>
        <path
          d={
            route([
              [26, 50],
              [26, headerHeight + 20],
              [
                wide
                  ? (changed && p >= 0.52 ? 2 : 1) * (columnWidth + 48) + 26
                  : 26,
                headerHeight + 20,
              ],
            ]) +
            (wide ? kinds : [focus])
              .filter((kind) => kind !== "matched" || (changed && p >= 0.52))
              .map((kind) => {
                const x = wide
                  ? kinds.indexOf(kind) * (columnWidth + 48) + 26
                  : 26;
                return route([
                  [x, headerHeight + 20],
                  [x, headerHeight + (wide ? 78 : 98)],
                ]);
              })
              .join("")
          }
          fill="none"
          stroke="var(--figure-line)"
          strokeWidth={1}
          opacity={0.45}
        />
        {(wide ? kinds : [focus]).map((kind) => {
          const index = kinds.indexOf(kind),
            x = wide ? index * (columnWidth + 48) + 26 : 26;
          const points: Point[] = [
            [26, 50],
            [26, headerHeight + 20],
            [x, headerHeight + 20],
            [x, headerHeight + (wide ? 78 : 98)],
          ];
          return (
            <Delegation
              key={kind}
              kind={kind}
              points={points}
              marker={marker}
              scene={scene}
            />
          );
        })}
      </svg>
      <div className="agent-worker-region">
        {!wide && (
          <ol className="agent-worker-status" aria-label="Worker tasks">
            {kinds.map((kind) => (
              <li
                key={kind}
                aria-current={kind === focus ? "step" : undefined}
                data-created={
                  kind !== "matched" ||
                  (changed && p >= agentTiming.matched.start)
                }
              >
                {kind === "data"
                  ? "Population"
                  : kind === "metric"
                    ? "Accuracy"
                    : "Matched"}
              </li>
            ))}
          </ol>
        )}
        <div
          className="agent-workers"
          style={{
            gridTemplateColumns: wide ? `repeat(3, minmax(0, 1fr))` : "1fr",
          }}
        >
          {kinds.map((kind) => (
            <Worker
              key={kind}
              scene={scene}
              kind={kind}
              changed={changed}
              width={columnWidth}
              hidden={!wide && kind !== focus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
function Delegation({
  kind,
  points,
  marker,
  scene,
}: {
  kind: WorkerKind;
  points: Point[];
  marker: string;
  scene: Scene & { changed: boolean };
}) {
  if (kind === "matched" && !scene.changed) return null;
  const created =
    kind === "matched"
      ? agentTiming.matched.start
      : kind === "metric"
        ? 0.15
        : agentTiming.delegate;
  const returns: [number, number][] =
    kind === "data"
      ? [[agentTiming.data.returnStart, agentTiming.data.returned]]
      : kind === "matched"
        ? [[agentTiming.matched.returnStart, agentTiming.matched.returned]]
        : [
            [agentTiming.metric.returnStart, agentTiming.metric.returned],
            ...(!scene.changed
              ? [
                  [
                    agentTiming.matched.returnStart,
                    agentTiming.matched.returned,
                  ] as [number, number],
                ]
              : []),
          ];
  return (
    <g data-delegation={kind}>
      <Connection
        progress={scene.progress}
        position={scene.position}
        points={points}
        from={created}
        to={created + 0.03}
        color="var(--blue)"
        marker={marker}
      />
      <Packet
        progress={scene.progress}
        position={scene.position}
        points={points}
        from={created}
        to={created + 0.03}
      />
      {returns.map(([from, to]) => (
        <g key={from}>
          <Connection
            progress={scene.progress}
            position={scene.position}
            points={points.toReversed()}
            from={from}
            to={to}
            color="var(--teal)"
            marker={marker}
          />
          <Packet
            progress={scene.progress}
            position={scene.position}
            points={points.toReversed()}
            from={from}
            to={to}
            finding
          />
        </g>
      ))}
    </g>
  );
}
function Worker({
  scene,
  kind,
  changed,
  width: w,
  hidden,
}: {
  scene: Scene;
  kind: WorkerKind;
  changed: boolean;
  width: number;
  hidden: boolean;
}) {
  const p = scene.position,
    t = workerTiming(kind, changed),
    loop = currentLoop(kind, p, changed);
  const created =
    kind !== "matched"
      ? p >= agentTiming.delegate
      : changed && p >= agentTiming.matched.start;
  const started = p >= t.start,
    active = activeWorker(p, changed) === kind;
  const finished =
    p >= (kind === "metric" ? agentTiming.metric.returned : t.returned);
  const showCall = started && p >= loop.call,
    showObservation = started && p >= loop.observed;
  const tx = w - 30;
  const request: Point[] = [
    [44, 56],
    [tx, 56],
    [tx, 90],
  ];
  const observation: Point[] = [
    [tx, 142],
    [tx, 166],
    [26, 166],
    [26, 74],
  ];
  const marker = useId().replaceAll(":", "");
  return (
    <div
      className="agent-worker"
      hidden={hidden}
      data-worker={kind}
      data-active={active}
      data-created={created}
    >
      <svg
        className="scene-canvas"
        style={{ height: 198 }}
        viewBox={`0 0 ${w} 198`}
        role="img"
        aria-label={`${names[kind]}: a stationary worker calls tools, retains observations and returns a finding`}
      >
        <defs>
          <marker
            id={marker}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path
              d="M1 1L9 5L1 9"
              fill="none"
              stroke="context-stroke"
              strokeWidth="1.5"
            />
          </marker>
        </defs>
        <WorkerPresence
          scene={scene}
          kind={kind}
          enabled={kind !== "matched" || changed}
        >
          <g data-loop-routes={kind}>
            <path
              d={route(request)}
              fill="none"
              stroke={showCall && active ? "var(--blue)" : "var(--figure-line)"}
              opacity={showCall && active ? 1 : 0.45}
              strokeWidth={1.5}
              strokeLinejoin="round"
              markerEnd={showCall && active ? `url(#${marker})` : undefined}
            />
            <path
              d={route(observation)}
              fill="none"
              stroke={
                showObservation && active ? "var(--teal)" : "var(--figure-line)"
              }
              opacity={showObservation && active ? 1 : 0.45}
              strokeWidth={1.5}
              strokeLinejoin="round"
              markerEnd={
                showObservation && active ? `url(#${marker})` : undefined
              }
            />
          </g>
          <Packet
            key={`call-${loop.call}`}
            progress={scene.progress}
            position={p}
            points={request}
            from={loop.call}
            to={loop.call + 0.02}
          />
          <Packet
            key={`observation-${loop.observed}`}
            progress={scene.progress}
            position={p}
            points={observation}
            from={loop.observed}
            to={loop.observed + 0.02}
          />
          <g data-agent-node={`${kind} worker`}>
            <circle
              cx={26}
              cy={56}
              r={18}
              fill="var(--surface)"
              stroke={active ? "var(--blue)" : "var(--figure-muted)"}
              strokeWidth={active ? 2 : 1.3}
            />
            <Bot
              x={18}
              y={48}
              size={16}
              stroke={active ? "var(--blue)" : "var(--figure-muted)"}
            />
          </g>
          <g data-tool={kind}>
            <path
              d={`M${tx - 18} 92H${tx - 26}V140H${tx - 18}M${tx + 18} 92H${tx + 26}V140H${tx + 18}`}
              fill="none"
              stroke="var(--figure-muted)"
              strokeWidth={1.3}
            />
            <text x={tx} y={112} textAnchor="middle" className="scene-small">
              Tool
            </text>
            <Wrench x={tx - 8} y={120} size={16} stroke="var(--figure-muted)" />
          </g>
          <text
            x={(44 + tx) / 2}
            y={46}
            textAnchor="middle"
            className="scene-small agent-call-label"
          >
            {showCall ? loop.label : "Action"}
          </text>
          <text
            x={(26 + tx) / 2}
            y={188}
            textAnchor="middle"
            className="scene-small"
          >
            {showObservation ? "Observation → context" : "Tool observation"}
          </text>
        </WorkerPresence>
        <text x={56} y={18} className="scene-label-text">
          {!created && kind === "matched"
            ? "Conditional follow-up"
            : names[kind]}
        </text>
      </svg>
      {!created && kind === "matched" && (
        <p className="agent-pending">
          {changed
            ? "A new task is created when returned evidence leaves a requirement unresolved."
            : "The populations match. The accuracy worker can complete the paired comparison without another worker."}
        </p>
      )}
      <div
        className="agent-worker-notes"
        style={{
          visibility: kind !== "matched" || created ? undefined : "hidden",
        }}
      >
        <div className="agent-retained-context">
          <span>
            {!created
              ? "Task pending"
              : finished && !active
                ? "Retained finding"
                : "Worker context"}
          </span>
          <StableSlot
            active={0}
            items={[
              <p key="current">{loop.context}</p>,
              ...contextCopy.map((text) => <p key={text}>{text}</p>),
            ]}
          />
        </div>
        <div className="agent-next-action">
          <span>
            {finished && !active ? "Returned to coordinator" : "Next decision"}
          </span>
          <StableSlot
            active={0}
            items={[
              <p key="current">
                {finished && !active
                  ? kind === "data"
                    ? "M1 · population metadata"
                    : kind === "metric" && changed
                      ? "R1 · reported accuracy"
                      : "P1 · matched gain and uncertainty"
                  : loop.decision}
              </p>,
              ...decisionCopy.map((text) => <p key={text}>{text}</p>),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
function Packet({
  progress,
  position,
  points,
  from,
  to,
  finding = false,
}: {
  progress: Scene["progress"];
  position: number;
  points: Point[];
  from: number;
  to: number;
  finding?: boolean;
}) {
  const transform = useTransform(() => {
    const point = along(
      points,
      interpolate(progress.get(), [from, to], [0, 1]),
    );
    return `translate(${point[0].toFixed(3)}px,${point[1].toFixed(3)}px)`;
  });
  const alpha = useTransform(
    progress,
    [from, from + 0.002, to, to + 0.002],
    [0, 1, 1, 0],
  );
  return (
    <g
      data-packet
      style={{
        visibility:
          position >= from && position <= to + 0.002 ? "visible" : "hidden",
      }}
    >
      <MotionGroup transform={transform} opacity={alpha}>
        {finding ? (
          <FileText
            x={-6}
            y={-7}
            size={13}
            stroke="var(--teal)"
            fill="var(--surface)"
          />
        ) : (
          <circle r={3} fill="var(--blue)" />
        )}
      </MotionGroup>
    </g>
  );
}

function WorkerPresence({
  scene,
  kind,
  enabled,
  children,
}: {
  scene: Scene;
  kind: WorkerKind;
  enabled: boolean;
  children: React.ReactNode;
}) {
  const from = !enabled
    ? 2
    : kind === "matched"
      ? agentTiming.matched.start
      : kind === "metric"
        ? 0.15
        : agentTiming.delegate;
  const opacity = useTransform(
    scene.progress,
    [from, from + 0.04],
    [kind === "matched" ? 0 : 0.65, 1],
  );
  const transform = useTransform(() => "translate(0px,0px)");
  return (
    <MotionGroup transform={transform} opacity={opacity}>
      {children}
    </MotionGroup>
  );
}
function Connection({
  progress,
  position,
  points,
  from,
  to,
  color,
  marker,
}: {
  progress: Scene["progress"];
  position: number;
  points: Point[];
  from: number;
  to: number;
  color: string;
  marker: string;
}) {
  const d = useTransform(() => route(points));
  const alpha = useTransform(
    progress,
    [from, from + 0.008, to, to + 0.012],
    [0, 1, 1, 0],
  );
  return (
    <g
      data-active-signal
      style={{
        visibility:
          position >= from && position <= to + 0.012 ? "visible" : "hidden",
      }}
    >
      <MotionPath
        d={d}
        opacity={alpha}
        stroke={color}
        strokeWidth={1.5}
        markerEnd={`url(#${marker})`}
      />
    </g>
  );
}
