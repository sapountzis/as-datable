"use client";
import StableSlot from "./StableSlot";
import { useState } from "react";
import { evaluationExamples, structurePasses } from "@/lib/explainers";
export default function EvaluationFigure() {
  const [selected, setSelected] = useState(0);
  const example = evaluationExamples[selected];
  return (
    <figure
      className="explainer"
      aria-label="Separate structure, support and usefulness checks"
    >
      <p className="static-intro">
        Authored evaluation task: assess the candidate’s improvement. S1 reports
        800 / 1,000 correct baseline predictions. S2 reports 810 / 1,000 correct
        candidate predictions on the same examples: a 1-point gain, with a 95%
        interval from −0.9 to 2.9 percentage points. The output contract
        requires a JSON object with an answer string and a sources array.
      </p>
      <div
        className="scene-interactions"
        role="group"
        aria-label="Evaluation examples"
      >
        {evaluationExamples.map((item, i) => (
          <button
            type="button"
            key={item.name}
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <StableSlot
        className="evaluation-answer"
        active={selected}
        items={evaluationExamples.map((e) => (
          <pre key={e.name}>{e.output}</pre>
        ))}
      />
      <div className="evaluation-checks">
        <div>
          <span>Executable schema check</span>
          <strong>{structurePasses(example.output) ? "Pass" : "Fail"}</strong>
          <span>JSON with answer and sources</span>
        </div>
        <div>
          <span>Authored evidence annotation</span>
          <strong>{example.evidence ? "Supported" : "Contradicted"}</strong>
          <span>Agreement with S1 and S2</span>
        </div>
        <div>
          <span>Authored usefulness judgment</span>
          <strong>
            {example.useful ? "Answers the task" : "Does not answer"}
          </strong>
          <span>Resolves the stated requirement</span>
        </div>
      </div>
      <div aria-live="polite">
        <StableSlot
          className="static-intro"
          active={selected}
          items={evaluationExamples.map((e) => (
            <p key={e.name}>{e.note}</p>
          ))}
        />
      </div>
      <figcaption>
        Four authored outputs. The schema check executes on the actual output;
        evidence and usefulness are explicit annotations, not automated
        factuality judgments.
      </figcaption>
      <noscript>
        <ol className="static-explanation">
          {evaluationExamples.map((item) => (
            <li key={item.name}>
              <strong>{item.name}:</strong> {item.note}
            </li>
          ))}
        </ol>
      </noscript>
    </figure>
  );
}
