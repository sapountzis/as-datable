"use client";
import StableSlot from "./StableSlot";
import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "motion/react";
import fixtures from "@/data/explainer-fixtures.json";
import { percent, rankCandidates } from "@/lib/explainers";
import Explainer, { type Scene } from "./Explainer";
import { interpolate, MotionGroup } from "./ScenePrimitives";
const model = fixtures.ranking;
export default function RankingFigure() {
  const [combined, setCombined] = useState(true);
  const [selected, setSelected] = useState("A");
  const ranked = rankCandidates("A", model.candidates[0].features[0], combined);
  const candidate = ranked.find((item) => item.id === selected)!;
  const z =
    model.intercept +
    candidate.features.reduce(
      (sum, f, i) => sum + f * model.coefficients[i],
      0,
    );
  return (
    <Explainer
      variant="ranking"
      title="Recommendation systems & probabilistic modeling"
      chapters={[
        {
          at: 0,
          label: "Different quantities, different roles",
          description:
            "Relevance describes topic compatibility. Standardized responsiveness and activity provide inputs to a separate response model.",
        },
        {
          at: 0.16,
          label: "Form the logistic score",
          description:
            "Multiply each behavioral input by its learned weight, then add the intercept. Negative inputs contribute below the model’s baseline.",
        },
        {
          at: 0.4,
          label: "Map the score to a probability",
          description:
            "The sigmoid maps the logistic score to a value between zero and one. The full calculation remains attached to the selected person.",
        },
        {
          at: 0.65,
          label: "Apply a ranking objective",
          description:
            "Relevance alone and relevance × response probability assign different scores to the same people. Watch those people move into score order.",
        },
        {
          at: 0.9,
          label: "Interpret the returned order",
          description:
            "Switch objectives or inspect another person. A ranking score expresses a choice about what matters; it is not a promise about an outcome.",
        },
      ]}
      caption="Synthetic people and observations; logistic regression fitted offline. Relevance and its product with response are illustrative ranking objectives."
      inspect={
        <>
          <div className="formula">
            z = {model.intercept.toFixed(3)} +{" "}
            {model.coefficients[0].toFixed(3)} × responsiveness +{" "}
            {model.coefficients[1].toFixed(3)} × activity
            <br />
            p(response) = 1 / (1 + exp(−z))
          </div>
          <p>
            Inputs are expressed in training-standard-deviation units. Zero is
            the training mean; a value of −1 is one standard deviation below it.
            Relevance is an authored compatibility score, not a calibrated
            probability. Calibration and ranking quality require separate
            evaluation.
          </p>
        </>
      }
    >
      {(scene) => (
        <>
          <div className="ranking-layout">
            <div
              className="model-calculation"
              aria-label={`Response calculation for person ${selected}`}
            >
              <label className="inline-select">
                Inspect person{" "}
                <select
                  aria-label="Inspect a person"
                  value={selected}
                  onChange={(event) => {
                    scene.pause();
                    setSelected(event.target.value);
                  }}
                >
                  {model.candidates.map((c) => (
                    <option key={c.id}>{c.id}</option>
                  ))}
                </select>
              </label>
              <dl className="contributions">
                {candidate.features.map((feature, i) => (
                  <div key={i}>
                    <dt>{i ? "Activity" : "Responsiveness"}</dt>
                    <dd>
                      {feature.toFixed(1)}
                      {
                        <span
                          style={{
                            visibility:
                              scene.position >= 0.16 ? "visible" : "hidden",
                          }}
                        >
                          {" "}
                          × {model.coefficients[i].toFixed(2)} ={" "}
                          <strong>
                            {(feature * model.coefficients[i]).toFixed(2)}
                          </strong>
                        </span>
                      }
                    </dd>
                  </div>
                ))}
              </dl>
              <StableSlot
                className="model-equation"
                active={scene.position >= 0.4 ? 1 : 0}
                items={[
                  "Fixed weights learned from synthetic observations",
                  <>
                    z = {model.intercept.toFixed(2)} + weighted inputs ={" "}
                    <strong>{z.toFixed(2)}</strong>
                  </>,
                  ...model.candidates.map((c) => (
                    <>
                      z = {model.intercept.toFixed(2)} + weighted inputs ={" "}
                      <strong>
                        {(
                          model.intercept +
                          c.features.reduce(
                            (sum, f, i) => sum + f * model.coefficients[i],
                            0,
                          )
                        ).toFixed(2)}
                      </strong>
                    </>
                  )),
                ]}
              />
              <StableSlot
                className="probability-readout"
                active={scene.position >= 0.4 ? 1 : 0}
                items={[
                  "Probability follows the weighted calculation",
                  <>
                    1 / (1 + exp(−z)) ={" "}
                    <strong>{percent(candidate.probability)}</strong>
                  </>,
                ]}
              />
              <SigmoidScene {...scene} z={z} />
            </div>
            <RankingScene
              {...scene}
              ranked={ranked}
              selected={selected}
              combined={combined}
            />
          </div>
          <div className="scene-interactions">
            <fieldset>
              <legend>Ranking objective</legend>
              {[false, true].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  aria-pressed={combined === value}
                  onClick={() => {
                    scene.pause();
                    setCombined(value);
                  }}
                >
                  {value ? "Relevance × response" : "Relevance"}
                </button>
              ))}
            </fieldset>
          </div>
          <StableSlot
            className="scene-result"
            active={
              scene.position < 0.4
                ? 0
                : scene.position < 0.65
                  ? 1
                  : scene.position < 0.9
                    ? 2
                    : combined
                      ? 3
                      : 4
            }
            items={[
              <>
                <strong>Inspect the inputs before the prediction</strong>
                <span>Relevance is not a response probability.</span>
              </>,
              <>
                <strong>
                  Person {selected}: {percent(candidate.probability)} predicted
                  response
                </strong>
                <span>Relevance is not a response probability.</span>
              </>,
              <>
                <strong>The same people move into score order</strong>
                <span>Relevance is not a response probability.</span>
              </>,
              <>
                <strong>
                  Person B leads · score{" "}
                  {rankCandidates(
                    "A",
                    model.candidates[0].features[0],
                    true,
                  )[0].score.toFixed(3)}
                </strong>
                <span>
                  B balances a strong topic match with a higher predicted
                  response.
                </span>
              </>,
              <>
                <strong>
                  Person A leads · score{" "}
                  {model.candidates[0].relevance.toFixed(3)}
                </strong>
                <span>
                  A has the highest topic compatibility; response does not
                  affect this order.
                </span>
              </>,
            ]}
          />
        </>
      )}
    </Explainer>
  );
}
function RankingScene(
  scene: Scene & {
    ranked: ReturnType<typeof rankCandidates>;
    selected: string;
    combined: boolean;
  },
) {
  const { width: w, position, ranked, selected, combined, compact } = scene;
  return (
    <svg
      className="scene-canvas ranking-canvas"
      style={{ height: compact ? 220 : 238 }}
      viewBox={`0 0 ${w} ${compact ? 220 : 238}`}
      role="img"
      aria-label="People A to F reorder according to the selected objective"
    >
      <text x={12} y={18} className="scene-small">
        Person
      </text>
      <text x={w * 0.45} y={18} textAnchor="middle" className="scene-small">
        Relevance
      </text>
      <text x={w * 0.7} y={18} textAnchor="middle" className="scene-small">
        Response
      </text>
      <text x={w - 12} y={18} textAnchor="end" className="scene-small">
        Score
      </text>
      {model.candidates.map((c, index) => (
        <Candidate
          key={c.id}
          {...scene}
          candidate={ranked.find((item) => item.id === c.id)!}
          index={index}
          rank={ranked.findIndex((item) => item.id === c.id)}
          selected={selected === c.id}
          showProbability={position >= 0.45}
          showScore={position >= 0.65}
          combined={combined}
        />
      ))}
    </svg>
  );
}
function Candidate({
  progress,
  width: w,
  reduced,
  compact,
  candidate,
  index,
  rank,
  selected,
  showProbability,
  showScore,
  combined,
}: Scene & {
  candidate: ReturnType<typeof rankCandidates>[number];
  index: number;
  rank: number;
  selected: boolean;
  showProbability: boolean;
  showScore: boolean;
  combined: boolean;
}) {
  const order = useMotionValue(rank);
  useEffect(() => {
    const controls = animate(order, rank, {
      duration: reduced ? 0 : 0.45,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [order, rank, reduced]);
  const transform = useTransform(
    () =>
      `translate(0px, ${interpolate(progress.get(), [0.65, 0.9], [34 + index * (compact ? 30 : 33), 34 + order.get() * (compact ? 30 : 33)])}px)`,
  );
  return (
    <MotionGroup transform={transform} data-candidate={candidate.id}>
      <rect
        x={1}
        y={-3}
        width={w - 2}
        height={30}
        rx={4}
        fill={selected ? "var(--figure)" : "var(--surface)"}
        stroke={selected ? "var(--blue)" : "var(--subtle)"}
      />
      <text x={16} y={19} className="scene-label-text">
        {candidate.id}
      </text>
      <text x={w * 0.45} y={19} textAnchor="middle">
        {candidate.relevance.toFixed(2)}
      </text>
      <text x={w * 0.7} y={19} textAnchor="middle">
        {showProbability ? percent(candidate.probability, 0) : "—"}
      </text>
      <text x={w - 12} y={19} textAnchor="end" className="scene-label-text">
        {showScore
          ? (combined ? candidate.score : candidate.relevance).toFixed(3)
          : "—"}
      </text>
    </MotionGroup>
  );
}

function SigmoidScene({ progress, width, z }: Scene & { z: number }) {
  const w = width >= 650 ? width * 0.4 : width;
  const plotWidth = w - 60;
  const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));
  const path = Array.from({ length: 65 }, (_, i) => {
    const value = -4 + i / 8;
    return `${i ? "L" : "M"}${(20 + ((value + 4) / 8) * plotWidth).toFixed(3)} ${(58 - sigmoid(value) * 48).toFixed(3)}`;
  }).join(" ");
  const transform = useTransform(progress, (p) => {
    const value = interpolate(p, [0.16, 0.4], [model.intercept, z]);
    return `translate(${20 + ((value + 4) / 8) * plotWidth}px, ${58 - sigmoid(value) * 48}px)`;
  });
  const opacity = useTransform(progress, [0.16, 0.2], [0, 1]);
  return (
    <div className="sigmoid-panel">
      <span>Sigmoid: score z → response probability</span>
      <svg
        className="scene-canvas"
        style={{ height: 84 }}
        viewBox={`0 0 ${w} 84`}
        role="img"
        aria-label="A point moves along the sigmoid as the weighted inputs form the logistic score"
      >
        <line x1={20} y1={58} x2={w - 40} y2={58} stroke="var(--subtle)" />
        <path d={path} fill="none" stroke="var(--blue)" strokeWidth={1.5} />
        <text x={20} y={79} className="scene-small">
          −4
        </text>
        <text
          x={20 + plotWidth / 2}
          y={79}
          textAnchor="middle"
          className="scene-small"
        >
          0
        </text>
        <text x={w - 40} y={79} textAnchor="end" className="scene-small">
          z = 4
        </text>
        <text x={w - 25} y={17} className="scene-small">
          1
        </text>
        <text x={w - 25} y={61} className="scene-small">
          0
        </text>
        <MotionGroup transform={transform} opacity={opacity}>
          <line x1={0} x2={0} y1={-6} y2={6} stroke="var(--teal)" />
          <circle r={4} fill="var(--teal)" />
        </MotionGroup>
      </svg>
    </div>
  );
}
