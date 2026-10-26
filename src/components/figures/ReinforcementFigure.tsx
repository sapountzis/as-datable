import { ArrowRight, ArrowDown, CornerUpLeft } from "lucide-react";
export default function ReinforcementFigure() {
  return (
    <figure
      className="explainer static-system"
      aria-label="Recurrent policy with observation, state, action, reward and a next-step feedback path"
    >
      <p className="static-intro">
        Conceptual recurrent computation. At step t, the policy can access
        observation xₜ and previous hidden state hₜ₋₁. The next observation is
        only available after the action.
      </p>
      <div className="policy-diagram">
        <div className="policy-memory">
          <CornerUpLeft size={18} />
          <span>Carried state: hₜ₋₁ → hₜ → next step</span>
        </div>
        <div className="policy-computation">
          <div className="policy-node">
            <span>Inputs</span>
            <strong>xₜ, hₜ₋₁</strong>
          </div>
          <ArrowRight className="policy-arrow" size={22} />
          <div className="policy-node">
            <span>Recurrent policy</span>
            <strong>π(aₜ | xₜ, hₜ₋₁)</strong>
          </div>
          <ArrowRight className="policy-arrow" size={22} />
          <div className="policy-node">
            <span>Outputs</span>
            <strong>aₜ, hₜ</strong>
          </div>
        </div>
        <div className="policy-environment">
          <ArrowDown size={22} />
          <span>Action aₜ enters the environment</span>
          <strong>Reward rₜ and next observation xₜ₊₁</strong>
        </div>
        <div className="policy-feedback">
          <CornerUpLeft size={18} />
          <span>xₜ₊₁ and hₜ become inputs to the next decision</span>
        </div>
      </div>
      <p className="static-intro">
        <strong>Learning is a separate operation.</strong> Recorded
        trajectories, including rewards, feed PPO’s clipped update objective.
        The updated parameters affect subsequent decisions; the reward is not an
        input from the future to the current action.
      </p>
      <figcaption>
        Computational relationships from the documented recurrent-PPO research
        scope. No trained-policy behavior or performance is implied.
      </figcaption>
    </figure>
  );
}
