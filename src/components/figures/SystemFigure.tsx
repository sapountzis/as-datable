import { ArrowRight, ArrowDown } from "lucide-react";
export default function SystemFigure({
  kind,
}: {
  kind: "conversation" | "software";
}) {
  return (
    <figure
      className="explainer static-system"
      aria-label={
        kind === "conversation"
          ? "Speech, character context, memory and emotion in conversational AI"
          : "The same raw input under saved and recomputed transforms"
      }
    >
      {kind === "conversation" ? (
        <>
          <p className="static-intro">
            Conceptual composition of the components used in my
            character-dialogue work. The model request combines a transcript
            with selected context; speech and emotion prediction serve distinct
            roles.
          </p>
          <div className="dialogue-context">
            <div>
              <strong>Character information & recent dialogue</strong>
              <span>Identity, knowledge and the current exchange</span>
            </div>
            <div>
              <strong>Vector-backed memory</strong>
              <span>Relevant retained context</span>
            </div>
          </div>
          <div className="context-connector">
            <ArrowDown size={20} />
            <span>Context enters the model request</span>
          </div>
          <div className="speech-flow">
            <div>
              <strong>Speech recognition</strong>
              <span>Audio input → transcript</span>
            </div>
            <ArrowRight className="flow-arrow" size={20} />
            <div>
              <strong>Language model</strong>
              <span>Transcript + context → response text</span>
            </div>
            <ArrowRight className="flow-arrow" size={20} />
            <div>
              <strong>Speech synthesis</strong>
              <span>Response text → audio response</span>
            </div>
          </div>
          <div className="dialogue-emotion">
            <strong>Emotion classification</strong>
            <span>
              A separate predicted label can inform a character-response signal.
              It is distinct from wording and voice generation.
            </span>
          </div>
          <figcaption>
            Conceptual architecture, with no live conversation or performance
            claim. Recent dialogue, stable character information and retrieved
            memory have different roles.
          </figcaption>
        </>
      ) : (
        <>
          <p className="static-intro">
            Illustrative prediction contract: raw input x = 14, saved training
            mean μ = 10 and scale σ = 2. The model uses z = −1 + 0.5 × ((x − μ)
            / σ), then sigmoid(z). Its coefficients are illustrative.
          </p>
          <table className="contract-table">
            <caption>Same observation, different transformation</caption>
            <thead>
              <tr>
                <th scope="col">Quantity</th>
                <th scope="col">Saved transform</th>
                <th scope="col">Recomputed mean</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Raw input</th>
                <td>14</td>
                <td>14</td>
              </tr>
              <tr>
                <th scope="row">Mean / scale</th>
                <td>10 / 2</td>
                <td>14 / 2</td>
              </tr>
              <tr>
                <th scope="row">Feature</th>
                <td>(14 − 10) / 2 = 2</td>
                <td>(14 − 14) / 2 = 0</td>
              </tr>
              <tr>
                <th scope="row">Logistic score</th>
                <td>−1 + 0.5 × 2 = 0</td>
                <td>−1 + 0.5 × 0 = −1</td>
              </tr>
              <tr>
                <th scope="row">Prediction</th>
                <td>
                  <strong>0.500</strong>
                </td>
                <td>
                  <strong>0.269</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <figcaption>
            Recomputing the mean from an inference batch changes the input
            meaning. Store the fitted transform with the model to preserve the
            prediction contract.
          </figcaption>
        </>
      )}
    </figure>
  );
}
