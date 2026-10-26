"use client";
import StableSlot from "./StableSlot";
import { useLayoutEffect, useRef, useState } from "react";
import { animate, useMotionValue, useTransform } from "motion/react";
import fixtures from "@/data/explainer-fixtures.json";
import Explainer, { type Scene } from "./Explainer";
import {
  interpolate,
  MotionGroup,
  MotionPath,
  Reveal,
} from "./ScenePrimitives";
const data = fixtures.graph;
const name = (i: number) => String.fromCharCode(65 + i);
function initial(i: number, w: number) {
  const angle = (i * Math.PI * 2) / 7 - Math.PI / 2;
  return [
    w / 2 + Math.sin(angle) * Math.min(w * 0.36, 280),
    148 + Math.cos(angle) * 100,
  ];
}
function final(i: number, preset: number, w: number) {
  const partition = data.presets[preset];
  const group = partition.groups.findIndex((members) => members.includes(i));
  if (group < 0)
    return [w * (0.28 + partition.singletons.indexOf(i) * 0.44), 254];
  const members = partition.groups[group],
    index = members.indexOf(i);
  const center = w * (group ? 0.73 : 0.27);
  return [
    center + (index - (members.length - 1) / 2) * Math.min(44, w * 0.11),
    100 + (index % 2) * 55,
  ];
}
function point(
  i: number,
  p: number,
  preset: number,
  w: number,
  selected: number,
) {
  const a = initial(i, w),
    b = final(i, preset, w);
  return [
    interpolate(
      p,
      [0, 0.1, 0.2, 0.48, 0.62, 0.78, 0.94, 1],
      [
        a[0],
        a[0],
        i === selected ? 25 : a[0],
        i === selected ? 25 : a[0],
        a[0],
        a[0],
        b[0],
        b[0],
      ],
    ),
    interpolate(
      p,
      [0, 0.1, 0.2, 0.48, 0.62, 0.78, 0.94, 1],
      [
        a[1],
        a[1],
        i === selected ? 25 : a[1],
        i === selected ? 25 : a[1],
        a[1],
        a[1],
        b[1],
        b[1],
      ],
    ),
  ];
}
export default function GraphFigure() {
  const [preset, setPreset] = useState(0);
  const [selected, setSelected] = useState(0);
  const partition = data.presets[preset];
  return (
    <Explainer
      variant="graph"
      title="Statistical signatures & community detection"
      duration={25}
      chapters={[
        {
          at: 0,
          label: "Compare posting interests",
          description:
            "A–G are accounts with 1,000 posts each. Compare their topic proportions with 10,000 reference posts. A post may have several tags.",
        },
        {
          at: 0.12,
          label: `Expand account ${name(selected)}`,
          description:
            "Compare the proportions with each binary attribute. Blue bars show the reference; teal bars show the selected account.",
        },
        {
          at: 0.3,
          label: "Screen positive enrichments",
          description: `Enrichments must pass corrected Z ≥ ${data.zThreshold.toFixed(2)}; attributes that resemble the reference fade.`,
        },
        {
          at: 0.4,
          label: "Retain informative attributes",
          description:
            "Keep coordinates accounting for at least 90% of screened positive information. A passing attribute can still contribute too little to be retained.",
        },
        {
          at: 0.48,
          label: "Weight the statistical signature",
          description:
            "Retained coordinates receive −log₂(reference frequency) weights. Rare reference attributes carry more weight than common ones.",
        },
        {
          at: 0.65,
          label: "Build a weighted similarity graph",
          description:
            "Cosine similarity compares signature directions. Draw an edge when it reaches the fixed 0.05 cutoff; line width encodes similarity.",
        },
        {
          at: 0.8,
          label: "Identify communities",
          description:
            "Leiden CPM reorganizes the same accounts by their connections. Resolution changes the partition, while the reference, signatures and edges stay fixed.",
        },
      ]}
      caption="Synthetic social-media accounts; offline enrichment, signature, cosine and Leiden CPM calculations. Edges describe shared interests, not follows or friendships."
      inspect={
        <>
          <div className="formula">
            Retained weight = −log₂(p_reference)
            <br />
            Cosine(a,b) = a·b / (‖a‖ ‖b‖)
            <br />
            Fixed edge cutoff = 0.05 · CPM resolution γ = {partition.gamma}
          </div>
          <p>
            Screening uses Laplace-smoothed proportions with a two-sided
            Bonferroni threshold for six tests, keeping positive enrichments.
            Positive information contribution is q log₂(q/p); retain coordinates
            accounting for at least 90% of that screened contribution. These
            choices define this representation.
          </p>
          <p>
            Communities preserve the original accounts. Account C connects
            through different attributes to A/B and D/E/F; changing resolution
            can assign it to a singleton community. These are content
            similarities, not observed follow relationships.
          </p>
        </>
      }
    >
      {(scene) => (
        <>
          <div className="scene-interactions graph-controls">
            <label className="inline-select">
              Inspect account{" "}
              <select
                aria-label="Inspect an account"
                value={selected}
                onChange={(event) => {
                  scene.pause();
                  setSelected(Number(event.target.value));
                }}
              >
                {data.vectors.map((_, i) => (
                  <option value={i} key={i}>
                    {name(i)}
                  </option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Resolution γ</legend>
              {data.presets.map((item, i) => (
                <button
                  key={item.gamma}
                  type="button"
                  aria-pressed={preset === i}
                  onClick={() => {
                    scene.pause();
                    setPreset(i);
                  }}
                >
                  {item.gamma}
                </button>
              ))}
            </fieldset>
          </div>
          <GraphScene {...scene} preset={preset} selected={selected} />
          <StableSlot
            className="graph-evidence"
            active={
              scene.position < 0.12
                ? 0
                : scene.position < 0.48
                  ? 1
                  : 2 + selected
            }
            items={[
              "AI · programming · design · photography · gaming · cooking",
              `Reference vs account ${name(selected)} · paired bars show proportions, not individual matches`,
              ...data.evidence.map((row) =>
                row
                  .map(
                    (item) =>
                      `${data.features[item.index]}: ${Math.round(item.reference * 100)}% → ${Math.round(item.observed * 100)}% · weight ${item.weight.toFixed(2)}`,
                  )
                  .join("; "),
              ),
            ]}
          />
          <StableSlot
            className="scene-result"
            active={
              scene.position < 0.3
                ? 0
                : scene.position < 0.65
                  ? 1
                  : scene.position < 0.94
                    ? 2
                    : 3 + preset * 7 + selected
            }
            items={[
              <>
                <strong>Seven accounts, one reference</strong>
                <span>Blue: reference posts · Teal: selected account.</span>
              </>,
              <>
                <strong>
                  Account {name(selected)}: {data.evidence[selected].length}{" "}
                  retained attributes
                </strong>
                <span>Blue: reference posts · Teal: selected account.</span>
              </>,
              <>
                <strong>
                  {data.edges.length} edges from weighted signatures
                </strong>
                <span>
                  Solid: within community · dashed: between communities.
                </span>
              </>,
              ...data.presets.flatMap((part, pi) =>
                data.vectors.map((_, index) => (
                  <>
                    <strong>
                      Communities{" "}
                      {part.groups
                        .map((members) => members.map(name).join("–"))
                        .join(" and ")}
                    </strong>
                    <span>
                      Singleton communities:{" "}
                      {part.singletons.map(name).join(", ")} · G has no
                      similarity edges.
                    </span>
                    <NodeEvidence selected={index} preset={pi} />
                  </>
                )),
              ),
            ]}
          />
        </>
      )}
    </Explainer>
  );
}
function GraphScene(scene: Scene & { preset: number; selected: number }) {
  const { width: w, preset, selected } = scene;
  const partition = data.presets[preset];
  return (
    <svg
      className="scene-canvas graph-canvas"
      style={{ height: 310 }}
      viewBox={`0 0 ${w} 310`}
      role="img"
      aria-label={`Account ${name(selected)} expands into proportions, screened attributes and a signature, then joins a similarity graph`}
    >
      {[...partition.groups, ...partition.singletons.map((i) => [i])].map(
        (members) => (
          <CommunityBoundary
            key={members.map(name).join("")}
            {...scene}
            members={members}
          />
        ),
      )}
      {data.edges.map(([a, b]) => (
        <Edge key={`${a}-${b}`} {...scene} a={a} b={b} />
      ))}
      {data.vectors.map((_, i) => (
        <GraphNode key={i} {...scene} index={i} />
      ))}
      {data.features.map((feature, index) => (
        <Attribute key={feature} {...scene} feature={feature} index={index} />
      ))}
    </svg>
  );
}
function usePosition(
  scene: Scene & { preset: number; selected: number },
  index: number,
) {
  const { progress, width, preset, selected, reduced } = scene;
  const [targetX, targetY] = final(index, preset, width);
  const endX = useMotionValue(targetX),
    endY = useMotionValue(targetY);
  const previousWidth = useRef(width);
  useLayoutEffect(() => {
    const resized = previousWidth.current !== width;
    previousWidth.current = width;
    if (resized || reduced) {
      endX.set(targetX);
      endY.set(targetY);
      return;
    }
    const x = animate(endX, targetX, { duration: 0.45 });
    const y = animate(endY, targetY, { duration: 0.45 });
    return () => {
      x.stop();
      y.stop();
    };
  }, [endX, endY, targetX, targetY, reduced, width]);
  const x = useTransform(() => {
    const p = progress.get();
    return p < 0.78
      ? point(index, p, preset, width, selected)[0]
      : interpolate(p, [0.78, 0.94], [initial(index, width)[0], endX.get()]);
  });
  const y = useTransform(() => {
    const p = progress.get();
    return p < 0.78
      ? point(index, p, preset, width, selected)[1]
      : interpolate(p, [0.78, 0.94], [initial(index, width)[1], endY.get()]);
  });
  return [x, y];
}
function CommunityBoundary(
  scene: Scene & { preset: number; selected: number; members: number[] },
) {
  const { members, progress } = scene;
  const [x1, y1] = usePosition(scene, members[0]);
  const [x2, y2] = usePosition(scene, members[1] ?? members[0]);
  const [x3, y3] = usePosition(scene, members[2] ?? members[0]);
  const path = useTransform(() => {
    const xs = [x1.get(), x2.get(), x3.get()],
      ys = [y1.get(), y2.get(), y3.get()];
    const l = Math.min(...xs) - 27,
      r = Math.max(...xs) + 27,
      t = Math.min(...ys) - 32,
      b = Math.max(...ys) + 32,
      c = 16;
    return `M${l + c} ${t}H${r - c}Q${r} ${t} ${r} ${t + c}V${b - c}Q${r} ${b} ${r - c} ${b}H${l + c}Q${l} ${b} ${l} ${b - c}V${t + c}Q${l} ${t} ${l + c} ${t}Z`;
  });
  const label = useTransform(
    () =>
      `translate(${(Math.min(x1.get(), x2.get(), x3.get()) + Math.max(x1.get(), x2.get(), x3.get())) / 2}px, ${Math.max(y1.get(), y2.get(), y3.get()) + (members.length === 1 ? 54 : 55)}px)`,
  );
  const opacity = useTransform(progress, [0.86, 0.96], [0, 1]);
  return (
    <g data-community={members.map(name).join("")}>
      <MotionPath
        d={path}
        opacity={opacity}
        fill="var(--figure)"
        stroke="var(--figure-line)"
        strokeDasharray="3 5"
      />
      <MotionGroup transform={label} opacity={opacity}>
        <text textAnchor="middle" className="scene-small">
          {members.length === 1
            ? members[0] === 6
              ? "Isolated"
              : "Singleton"
            : members.map(name).join(" + ")}
        </text>
      </MotionGroup>
    </g>
  );
}
function GraphNode(
  scene: Scene & { preset: number; selected: number; index: number },
) {
  const { progress, index, selected, position, preset } = scene;
  const [x, y] = usePosition(scene, index);
  const transform = useTransform(() => `translate(${x.get()}px, ${y.get()}px)`);
  const opacity = useTransform(progress, (p) =>
    index === selected
      ? 1
      : interpolate(p, [0.1, 0.2, 0.48, 0.62], [1, 0, 0, 1]),
  );
  const marks = useTransform(progress, [0.48, 0.62], [0, 1]);
  const partition = data.presets[preset];
  const accent = position >= 0.9 && !partition.singletons.includes(index);
  return (
    <MotionGroup
      transform={transform}
      opacity={opacity}
      data-node={name(index)}
      data-membership={partition.membership[index]}
    >
      <circle
        r={20}
        fill={
          accent
            ? partition.groups.findIndex((members) =>
                members.includes(index),
              ) === 1
              ? "var(--teal)"
              : "var(--blue)"
            : "var(--surface)"
        }
        stroke={index === selected ? "var(--ink)" : "var(--figure-line)"}
        strokeWidth={index === selected ? 2 : 1}
      />
      <text
        y={5}
        textAnchor="middle"
        className={accent ? "on-accent" : "scene-label-text"}
      >
        {name(index)}
      </text>
      <Reveal progress={progress} from={0.48} to={0.62}>
        <MotionGroup
          transform={useTransform(() => "translate(0px, 0px)")}
          opacity={marks}
        >
          {data.vectors[index].map((weight, f) => (
            <rect
              key={f}
              x={-22 + f * 8}
              y={25}
              width={5}
              height={Math.max(2, weight * 2.5)}
              fill={weight ? "var(--teal)" : "var(--subtle)"}
            />
          ))}
        </MotionGroup>
      </Reveal>
    </MotionGroup>
  );
}
function Edge(
  scene: Scene & { preset: number; selected: number; a: number; b: number },
) {
  const { progress, a, b, selected, preset, position } = scene;
  const cross =
    data.presets[preset].membership[a] !== data.presets[preset].membership[b];
  const [x1, y1] = usePosition(scene, a),
    [x2, y2] = usePosition(scene, b);
  const path = useTransform(() => {
    const amount = interpolate(progress.get(), [0.63, 0.77], [0, 1]);
    return `M${x1.get()} ${y1.get()}L${x1.get() + amount * (x2.get() - x1.get())} ${y1.get() + amount * (y2.get() - y1.get())}`;
  });
  const opacity = useTransform(progress, (p) =>
    interpolate(p, [0.63, 0.65, 0.8, 0.94], [0, 1, 1, cross ? 0.35 : 1]),
  );
  return (
    <g data-edge={`${name(a)}-${name(b)}`} data-cross-community={cross}>
      <MotionPath
        d={path}
        opacity={opacity}
        stroke={
          a === selected || b === selected
            ? "var(--blue)"
            : "var(--figure-line)"
        }
        strokeWidth={1 + data.similarity[a][b] * 3}
        strokeDasharray={position >= 0.9 && cross ? "4 5" : undefined}
      />
    </g>
  );
}
function Attribute(
  scene: Scene & {
    preset: number;
    selected: number;
    index: number;
    feature: string;
  },
) {
  const { progress, width: w, selected, index, feature, position } = scene;
  const kept = data.vectors[selected][index] > 0;
  const tested = data.screening[selected][index];
  const [nx, ny] = usePosition(scene, selected);
  const barWidth = Math.max(50, w - 200),
    x = 112,
    y = 55 + index * 37;
  const transform = useTransform(() => {
    const p = progress.get();
    return `translate(${interpolate(p, [0.1, 0.2, 0.46, 0.62], [nx.get() - 22 + index * 8, x, x, nx.get() - 22 + index * 8])}px, ${interpolate(p, [0.1, 0.2, 0.46, 0.62], [ny.get() + 25, y, y, ny.get() + 25])}px)`;
  });
  const opacity = useTransform(
    progress,
    [0.09, 0.18, 0.35, 0.43, 0.62],
    kept ? [0, 1, 1, 1, 0] : [0, 1, tested.passes ? 1 : 0.18, 0.18, 0],
  );
  const labels = useTransform(progress, [0.1, 0.2, 0.46, 0.55], [0, 1, 1, 0]);
  const scale = useTransform(
    progress,
    (p) =>
      `scale(${interpolate(p, [0.1, 0.2, 0.46, 0.62], [0.05, 1, 1, 0.05])}, 1)`,
  );
  return (
    <MotionGroup transform={transform} opacity={opacity}>
      <MotionGroup
        transform={useTransform(() => "translate(0px, 0px)")}
        opacity={labels}
      >
        <text x={-104} y={8} className="scene-small">
          {feature}
        </text>
        <text x={w - x - 3} y={8} textAnchor="end" className="scene-small">
          {position < 0.3
            ? `${Math.round(data.observed[selected][index] * 100)}%`
            : `z ${tested.z.toFixed(1)}`}
        </text>
      </MotionGroup>
      <MotionGroup transform={scale}>
        <rect
          width={barWidth * data.reference[index]}
          y={-5}
          height={4}
          fill="var(--blue)"
        />
        <rect
          width={barWidth * data.observed[selected][index]}
          y={3}
          height={7}
          fill="var(--teal)"
        />
      </MotionGroup>
    </MotionGroup>
  );
}

function NodeEvidence({
  selected,
  preset,
}: {
  selected: number;
  preset: number;
}) {
  const partition = data.presets[preset];
  const members = partition.membership
    .map((v, i) => (v === partition.membership[selected] ? name(i) : null))
    .filter(Boolean);
  const neighbors = data.edges
    .filter(([a, b]) => a === selected || b === selected)
    .map(([a, b]) => (a === selected ? b : a));
  return (
    <span className="node-evidence" aria-label="Selected account connections">
      {name(selected)} · community {members.join("–")} ·{" "}
      {neighbors.length
        ? `neighbors ${neighbors.map((i) => `${name(i)} (${data.similarity[selected][i].toFixed(3)})`).join(", ")}`
        : "no neighbors: isolated node"}
    </span>
  );
}
