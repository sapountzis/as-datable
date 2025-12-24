import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const featuredWork = [
  {
    title: "Making Everything Fast and Cheap",
    slug: "making-everything-fast-and-cheap",
    teaser: "The pipeline was slow, expensive, and operationally awkward.",
    tags: ["Polars", "Container Apps", "Infrastructure"],
  },
  {
    title: "Fixing Therapist Note Generation",
    slug: "fixing-therapist-note-generation",
    teaser: "Mentalyc's AI-generated therapy notes were inconsistent and therapists were rejecting outputs.",
    tags: ["LLM ops", "Prompt engineering", "Eval harnesses"],
  },
  {
    title: "Validating Patterns at Scale with AI",
    slug: "validating-patterns-at-scale-with-ai",
    teaser: "The detection system discovered many streaming patterns — but the patterns kept multiplying.",
    tags: ["LLM agents", "RAG", "Pattern validation"],
  },
  {
    title: "Building NPCs That Feel Alive",
    slug: "building-npcs-that-feel-alive",
    teaser: "Yumio needed game characters that could hold natural conversations with voice input, emotional responses, character-specific knowledge, and synchronized animations.",
    tags: ["LLM agents", "STT/TTS", "Vector DB"],
  },
  {
    title: "Outsmarting Microsoft's $500/Month Tax",
    slug: "outsmarting-microsofts-500-tax",
    teaser: "Einbliq's data pipeline uses Azure Durable Functions — long-running tasks that can take 30+ minutes.",
    tags: ["Azure", "KEDA", "Cost optimization"],
  },
  {
    title: "Synthesizing \"Super Alerts\" with Graph Theory",
    slug: "super-alerts-with-graph-theory",
    teaser: "Continuous, real-time monitoring floods operations teams with hundreds of overlapping alerts for a single underlying issue.",
    tags: ["Graph Theory", "Information Theory", "LLM"],
  },
];

const WorkPreview = () => {
  return (
    <section id="work-preview" className="py-20 lg:py-28 bg-secondary/30">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Selected work
          </h2>
          <p className="text-lg text-muted-foreground">
            Deep dives into production systems. No prototypes — deployed engineering solving expensive problems.
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWork.map((work, index) => (
            <AnimateIn key={work.slug} delay={index * 75}>
              <Link
                to={`/work/${work.slug}`}
                className="glass-card p-6 flex flex-col card-hover group h-full"
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                  {work.teaser}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.tags.map((tag) => (
                    <span key={tag} className="chip text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read
                  <ArrowRight size={16} />
                </span>
              </Link>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={500} className="flex justify-center mt-12">
          <Link to="/work" className="btn-secondary group">
            View all work
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
};

export default WorkPreview;