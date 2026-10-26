"use client";
import StableSlot from "./StableSlot";
import { useState } from "react";
import fixtures from "@/data/explainer-fixtures.json";
import Explainer, { type Scene } from "./Explainer";
import { Move } from "./ScenePrimitives";
const names = ["Identifier", "Exact", "Approximate", "Rejected"];
export default function RetrievalFigure() {
  const [selected, setSelected] = useState(1);
  const example = fixtures.retrieval[selected];
  return (
    <Explainer
      variant="retrieval"
      title="Text normalization & lexical matching"
      duration={19}
      chapters={matchingChapters(example)}
      reserveChapters={fixtures.retrieval.flatMap(matchingChapters)}
      caption="Synthetic messages; real normalization, TF-IDF and fuzzy calculations. P1–P3 are stored pattern identities; P4 is newly assigned on rejection."
      inspect={
        <>
          <div className="formula">
            Accept approximate candidate if:
            <br />
            (cosine ≥ 0.82 AND fuzzy ≥ 90)
            <br />
            OR (cosine ≥ 0.92 AND fuzzy ≥ 85)
          </div>
          <p>
            Configured identifiers take precedence, then exact canonical
            matches. Only unresolved inputs enter character 3–7-gram retrieval
            and independent partial-ratio verification. These are lexical
            comparisons; no language model determines membership.
          </p>
        </>
      }
    >
      {(scene) => (
        <>
          <div className="lexical-pair">
            <div>
              <span>Incoming message</span>
              <StableSlot
                active={selected}
                items={fixtures.retrieval.map((e) => (
                  <code key={e.query}>{e.query}</code>
                ))}
              />
            </div>
            <div>
              <span>Stored pattern P1</span>
              <code>{fixtures.retrieval[1].template}</code>
            </div>
          </div>
          <MatchingScene {...scene} example={example} />
          <div className="route-stages" aria-label="Matching route">
            {["Identifier", "Normalize", "Exact", "Retrieve", "Verify"].map(
              (stage, i) => {
                const bypassed = example.known
                  ? i > 0
                  : example.exact
                    ? i >= 3
                    : false;
                const passed = scene.position >= [0.15, 0.2, 0.43, 0.5, 0.7][i];
                return (
                  <span
                    key={stage}
                    data-state={
                      bypassed && scene.position >= 0.43
                        ? "bypassed"
                        : passed
                          ? "visited"
                          : "pending"
                    }
                  >
                    {stage}
                    <span
                      style={{
                        visibility:
                          bypassed && scene.position >= 0.43
                            ? "visible"
                            : "hidden",
                      }}
                    >
                      {" "}
                      · skipped
                    </span>
                  </span>
                );
              },
            )}
          </div>
          <StableSlot
            className="scene-result"
            active={0}
            items={[
              <MatchingReadout
                key="current"
                example={example}
                position={scene.position}
              />,
              ...fixtures.retrieval.flatMap((e) =>
                [0, 0.2, 0.5, 0.7, 1].map((at) => (
                  <MatchingReadout
                    key={`${e.route}-${at}`}
                    example={e}
                    position={at}
                  />
                )),
              ),
            ]}
          />
          <div className="scene-interactions">
            <fieldset>
              <legend>Input route</legend>
              {names.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={selected === i}
                  onClick={() => {
                    scene.pause();
                    setSelected(i);
                  }}
                >
                  {label}
                </button>
              ))}
            </fieldset>
          </div>
        </>
      )}
    </Explainer>
  );
}
function positions(words: string[], width: number, y: number) {
  let x = 0;
  return words.map((word) => {
    const length = word.length * 7.8 + 12;
    if (x + length > width && x > 0) {
      x = 0;
      y += 24;
    }
    const point = [x, y];
    x += length;
    return point;
  });
}
function MatchingScene({
  progress,
  width: w,
  example,
}: Scene & { example: (typeof fixtures.retrieval)[number] }) {
  const raw = example.query
    .toLowerCase()
    .split(" ")
    .map((word) => (word.startsWith("/") ? "[file path]" : word));
  const canonical = example.canonical.split(" ");
  const start = positions(raw, w - 24, 30),
    end = positions(canonical, w - 24, 76);
  return (
    <svg
      className="scene-canvas"
      style={{ height: 120 }}
      viewBox={`0 0 ${w} 120`}
      role="img"
      aria-label={
        example.known
          ? "Configured identifier bypasses normalization"
          : "Variable text fades while canonical words retain their identities"
      }
    >
      {raw.map((word, i) => {
        const target = canonical.indexOf(word),
          kept = target >= 0;
        const destination = kept ? end[target] : [start[i][0], 80];
        return (
          <Move
            key={`${i}-${word}`}
            progress={progress}
            at={[0, 0.15, 0.38, 1]}
            x={[
              12 + start[i][0],
              12 + start[i][0],
              example.known ? 12 + start[i][0] : 12 + destination[0],
              example.known ? 12 + start[i][0] : 12 + destination[0],
            ]}
            y={[
              start[i][1],
              start[i][1],
              example.known ? start[i][1] : destination[1],
              example.known ? start[i][1] : destination[1],
            ]}
            opacity={kept || example.known ? [1, 1, 1, 1] : [1, 1, 0, 0]}
          >
            <text className="scene-small">{word}</text>
          </Move>
        );
      })}
    </svg>
  );
}

function MatchingReadout({
  example,
  position,
}: {
  example: (typeof fixtures.retrieval)[number];
  position: number;
}) {
  const approximate = !example.known && !example.exact;
  return (
    <>
      {position >= 0.86 ? (
        <>
          <strong>
            {example.accepted
              ? "Existing identity P1 · open failure"
              : "New identity P4 · successful operation"}
          </strong>
          <span>
            {example.known
              ? "Configured identifier matched; all later stages bypassed."
              : example.exact
                ? "Canonical forms are equal; retrieval and verification bypassed."
                : `Cosine ${example.similarity.toFixed(3)} · fuzzy ${example.fuzzy.toFixed(1)} / 100 · gate ${example.accepted ? "passed" : "failed"}`}
          </span>
        </>
      ) : (
        <>
          <strong>
            {position < 0.15
              ? "Start with the message and the stored wording"
              : example.known
                ? "Identifier → P1"
                : position < 0.43
                  ? "Canonical form under construction"
                  : example.exact
                    ? "Exact canonical match → P1"
                    : `Candidate P1 · cosine ${example.similarity.toFixed(3)}`}
          </strong>
          <span>
            {approximate && position >= 0.65
              ? `Independent fuzzy score: ${example.fuzzy.toFixed(1)} / 100`
              : "An early match avoids unnecessary approximate stages."}
          </span>
        </>
      )}
    </>
  );
}

function matchingChapters(example: (typeof fixtures.retrieval)[number]) {
  const approximate = !example.known && !example.exact;
  return [
    {
      at: 0,
      label: "Compare an input with a stored pattern",
      description:
        "P1 identifies a document-open failure. The incoming text may differ in its filename, wording or outcome.",
    },
    {
      at: 0.15,
      label: example.known
        ? "Use the configured identifier"
        : "Construct the canonical form",
      description: example.known
        ? "FILE_OPEN_ERROR maps directly to P1. Normalization, retrieval and fuzzy verification are bypassed."
        : "Remove the variable path and normalize the remaining wording. Canonical forms allow exact recognition.",
    },
    {
      at: 0.43,
      label: example.known
        ? "Direct recognition"
        : example.exact
          ? "An exact match is sufficient"
          : "Retrieve a lexical candidate",
      description:
        example.known || example.exact
          ? "An accepted early route bypasses approximate retrieval and its thresholds."
          : "Character 3–7-gram TF-IDF retrieves P1 as the closest candidate. Retrieval alone does not assign membership.",
    },
    {
      at: 0.65,
      label: approximate
        ? "Apply the independent verification gate"
        : "Keep the bypassed stages explicit",
      description: approximate
        ? "The candidate must pass the combined cosine and fuzzy-score gate. Similar words can still describe a different outcome."
        : "No approximate calculation is needed for this route. Its result follows the identifier or exact match.",
    },
    {
      at: 0.86,
      label: example.accepted
        ? "Reuse the stored identity"
        : "Preserve a new identity",
      description: example.accepted
        ? "This message resolves to existing pattern P1. Variable instances can share an explanation."
        : "The candidate fails the gate. Assign P4 instead of merging a successful operation with a failure.",
    },
  ];
}
