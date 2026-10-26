"use client";
import StableSlot from "./StableSlot";
import { useState } from "react";
import { useTransform } from "motion/react";
import * as m from "motion/react-m";
import fixtures from "@/data/explainer-fixtures.json";
import { linePath } from "@/lib/explainers";
import Explainer, { type Scene } from "./Explainer";
import { interpolate, MotionPath, Reveal } from "./ScenePrimitives";
const data = fixtures.temporal;
const min = Math.floor(Math.min(...data.observed, ...data.deseasoned));
const max = Math.ceil(Math.max(...data.observed, ...data.deseasoned));
export default function TemporalFigure() {
  const [preset, setPreset] = useState(0);
  const segment = data.segments[preset];
  return (
    <Explainer
      variant="temporal"
      title="Separating recurring variation from sustained change"
      duration={20}
      chapters={[
        {
          at: 0,
          label: "Observe both kinds of movement",
          description:
            "Repeating peaks and shifts in level occupy the same measurement. A raw threshold can confuse the two.",
        },
        {
          at: 0.17,
          label: "Estimate what repeats",
          description:
            "Robust STL estimates the seasonal component. The repeating contribution separates from the observed curve.",
        },
        {
          at: 0.38,
          label: "Subtract the recurring component",
          description:
            "The same measurement curve transforms into a seasonally adjusted one. Sustained changes remain visible.",
        },
        {
          at: 0.66,
          label: "Locate changes in the remaining level",
          description:
            "PELT fits segments to the adjusted series. Boundaries mark where the fitted level changes.",
        },
        {
          at: 0.88,
          label: "Balance fit and complexity",
          description:
            "The penalty balances extra boundaries against fit. Recurring peaks no longer dominate the investigation.",
        },
      ]}
      caption="Dimensionless illustrative measurements; actual robust STL decomposition and PELT segmentation. Detected boundaries do not establish causes."
      inspect={
        <>
          <div className="formula">
            observed = trend + seasonal + residual
            <br />
            adjusted = observed − seasonal
            <br />
            PELT objective = segment squared error + penalty × change count
          </div>
          <p>
            Seasonal period 12; L2 cost with minimum segment length eight.
            Segmentation is applied to the adjusted measurements, not the
            residual, so sustained level changes remain. The dashed curve
            preserves the original measurement for comparison.
          </p>
        </>
      }
    >
      {(scene) => (
        <>
          <StableSlot
            className="chart-legend"
            active={scene.position < 0.6 ? 0 : 1}
            items={[
              "Dashed: observed · blue: observed → adjusted · teal: fitted level",
              "Dashed: observed · blue: adjusted · teal: fitted level",
            ]}
          />
          <TemporalScene {...scene} preset={preset} />
          <StableSlot
            className="scene-result"
            active={0}
            items={[
              <TemporalReadout
                key="current"
                position={scene.position}
                segment={segment}
              />,
              ...data.segments.flatMap((seg) =>
                [0, 0.4, 0.7, 1].map((at) => (
                  <TemporalReadout
                    key={`${seg.penalty}-${at}`}
                    position={at}
                    segment={seg}
                  />
                )),
              ),
            ]}
          />
          <div className="scene-interactions">
            <fieldset>
              <legend>Penalty</legend>
              {["8 · more segments", "100 · fewer segments"].map((name, i) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={preset === i}
                  onClick={() => {
                    scene.pause();
                    setPreset(i);
                  }}
                >
                  {name}
                </button>
              ))}
            </fieldset>
          </div>
        </>
      )}
    </Explainer>
  );
}
function TemporalScene({
  progress,
  width: w,
  preset,
}: Scene & { preset: number }) {
  const chartWidth = w - 50;
  const path = useTransform(progress, (value) => {
    const amount = interpolate(value, [0.29, 0.6], [0, 1]);
    return linePath(
      data.observed.map((v, i) => v - data.seasonal[i] * amount),
      chartWidth,
      180,
      min,
      max,
    );
  });
  const seasonalY = useTransform(progress, [0.17, 0.4], [70, 270]);
  const seasonalOpacity = useTransform(progress, [0.16, 0.25], [0, 1]);
  const segmentation = data.segments[preset];
  return (
    <svg
      className="scene-canvas"
      style={{ height: 355 }}
      viewBox={`0 0 ${w} 355`}
      role="img"
      aria-label={`Observed measurements transform into adjusted measurements with ${segmentation.ends.length - 1} change points`}
    >
      <text x={35} y={24} className="scene-small">
        Dimensionless value
      </text>
      <g transform="translate(35 49)">
        {[0, 90, 180].map((y, i) => (
          <g key={y}>
            <line x1={0} x2={chartWidth} y1={y} y2={y} stroke="var(--subtle)" />
            <text x={-13} y={y + 5} textAnchor="end" className="scene-small">
              {Math.round(max - (i * (max - min)) / 2)}
            </text>
          </g>
        ))}
        <path
          d={linePath(data.observed, chartWidth, 180, min, max)}
          stroke="var(--figure-line)"
          strokeWidth={1.5}
          strokeDasharray="3 4"
          fill="none"
        />
        <MotionPath
          d={path}
          stroke="var(--blue)"
          strokeWidth={2.5}
          fill="none"
        />
        <Reveal progress={progress} from={0.64} to={0.8}>
          {segmentation.ends.map((end, i) => {
            const start = i ? segmentation.ends[i - 1] : 0,
              y = 180 - ((segmentation.means[i] - min) / (max - min)) * 180;
            return (
              <g key={end}>
                <line
                  x1={(start / 119) * chartWidth}
                  x2={((end - 1) / 119) * chartWidth}
                  y1={y}
                  y2={y}
                  stroke="var(--teal)"
                  strokeWidth={3}
                />
                {end < 120 && (
                  <line
                    x1={(end / 119) * chartWidth}
                    x2={(end / 119) * chartWidth}
                    y1={0}
                    y2={180}
                    stroke="var(--ink)"
                    strokeDasharray="4 4"
                  />
                )}
              </g>
            );
          })}
        </Reveal>
      </g>
      <text x={35} y={252} className="scene-small">
        1
      </text>
      <text
        x={35 + chartWidth / 2}
        y={252}
        textAnchor="middle"
        className="scene-small"
      >
        Ordered sample
      </text>
      <text
        x={35 + chartWidth}
        y={252}
        textAnchor="end"
        className="scene-small"
      >
        120
      </text>
      <m.g style={{ y: seasonalY, opacity: seasonalOpacity }}>
        <path
          d={linePath(data.seasonal, chartWidth, 55, -2, 2)}
          transform="translate(35 0)"
          stroke="var(--teal)"
          strokeWidth={1.5}
          fill="none"
        />
        <text x={35} y={78} className="scene-small">
          Seasonal component · −2 to +2
        </text>
      </m.g>
    </svg>
  );
}

function TemporalReadout({
  position,
  segment,
}: {
  position: number;
  segment: (typeof data.segments)[number];
}) {
  return (
    <>
      <strong>
        {position >= 0.88
          ? `${segment.ends.length - 1} change points · penalty ${segment.penalty}`
          : position < 0.38
            ? "120 ordered samples · recurring period 12"
            : position < 0.66
              ? "Adjusted = observed − seasonal"
              : "Fit piecewise-constant levels"}
      </strong>
      <span>
        {position >= 0.88
          ? segment.ends.length > 1
            ? "Boundaries before samples 41 and 83 mark changes in fitted level."
            : "The larger penalty suppresses additional boundaries despite their better fit."
          : "The same observations retain their sample order throughout."}
      </span>
    </>
  );
}
