import dynamic from "next/dynamic";
import type { FigureKind } from "@/data/topics";
import SystemFigure from "./SystemFigure";
import TextTasksFigure from "./TextTasksFigure";

const RuleFigure = dynamic(() => import("./RuleFigure"));
const RankingFigure = dynamic(() => import("./RankingFigure"));
const EvidenceFigure = dynamic(() => import("./EvidenceFigure"));
const EvaluationFigure = dynamic(() => import("./EvaluationFigure"));
const GraphFigure = dynamic(() => import("./GraphFigure"));
const ReinforcementFigure = dynamic(() => import("./ReinforcementFigure"));
const RetrievalFigure = dynamic(() => import("./RetrievalFigure"));
const TemporalFigure = dynamic(() => import("./TemporalFigure"));

export default function TechnicalFigure({ kind }: { kind: FigureKind }) {
  switch (kind) {
    case "cohorts":
      return <RuleFigure />;
    case "ranking":
      return <RankingFigure />;
    case "agents":
      return <EvidenceFigure />;
    case "evaluation":
      return <EvaluationFigure />;
    case "graph":
      return <GraphFigure />;
    case "reinforcement":
      return <ReinforcementFigure />;
    case "text-tasks":
      return <TextTasksFigure />;
    case "retrieval":
      return <RetrievalFigure />;
    case "temporal":
      return <TemporalFigure />;
    case "conversation":
      return <SystemFigure kind="conversation" />;
    case "software":
      return <SystemFigure kind="software" />;
  }
}
