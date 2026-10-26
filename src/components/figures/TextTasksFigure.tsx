import { ArrowRight } from "lucide-react";
export default function TextTasksFigure() {
  return (
    <figure
      className="explainer static-system"
      aria-label="Text classification and long-document analysis pipelines"
    >
      <p className="static-intro">
        Technical composition of supervised text-classification and
        long-document analysis work. Classification returns a label or score;
        retrieval returns source material; synthesis combines findings.
      </p>
      <div className="text-method-flow">
        <h3>Supervised text classification</h3>
        <div className="method-pipeline">
          <div>
            <strong>Annotated corpus</strong>
            <span>Texts + defined labels</span>
          </div>
          <ArrowRight size={18} />
          <div>
            <strong>BERT training</strong>
            <span>Fit on training examples</span>
          </div>
          <ArrowRight size={18} />
          <div>
            <strong>Model inference</strong>
            <span>New text → label scores</span>
          </div>
        </div>
        <p>
          Dataset management, label definitions and the saved model connect
          training with inference. Held-out examples evaluate how the learned
          mapping generalizes.
        </p>
        <h3>Long-document analysis</h3>
        <div className="method-pipeline">
          <div>
            <strong>Document sections</strong>
            <span>Bounded model inputs</span>
          </div>
          <ArrowRight size={18} />
          <div>
            <strong>Local analysis</strong>
            <span>Findings with references</span>
          </div>
          <ArrowRight size={18} />
          <div>
            <strong>Synthesis</strong>
            <span>Combined structured output</span>
          </div>
        </div>
        <p>
          Map-and-reduce processing separates local extraction from
          document-level synthesis. The combined result must preserve evidence
          and avoid losing qualifications or contradictions between sections.
        </p>
        <div className="retrieval-distinction">
          <strong>Retrieval selects evidence</strong>
          <p>
            A query returns relevant passages from a corpus. Retrieval coverage
            determines which evidence is available to a later analysis; it is a
            different output from a classification label.
          </p>
        </div>
      </div>
      <figcaption>
        Method diagrams grounded in BERT training/inference services and
        long-document analysis. They show component relationships, not a live
        execution or fabricated result.
      </figcaption>
    </figure>
  );
}
