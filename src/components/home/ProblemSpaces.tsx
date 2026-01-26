import { Cpu, Database, Shield, Network } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const problemSpaces = [
  {
    icon: Cpu,
    title: "AI Systems Architecture",
    description: "Designing end-to-end LLM systems with real constraints. Agentic workflows, evaluation frameworks, and quality monitoring for production AI.",
  },
  {
    icon: Database,
    title: "Data Platform Engineering",
    description: "Building pipelines at scale from ingestion to serving. Cost control, performance optimization, and operational excellence.",
  },
  {
    icon: Shield,
    title: "Production Reliability",
    description: "Rescuing slow, flaky, expensive systems. Bottleneck diagnosis, production-hardening, and operational ergonomics.",
  },
  {
    icon: Network,
    title: "Cross-System Thinking",
    description: "Architecture decisions that ripple through the ecosystem. Platform-level solutions and infrastructure design.",
  },
];

const ProblemSpaces = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Problem spaces I work in
          </h2>
          <p className="text-lg text-muted-foreground">
            Complex engineering challenges that require systems thinking and cross-cutting architectural decisions.
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemSpaces.map((space, index) => (
            <AnimateIn key={space.title} delay={index * 100}>
              <div className="glass-card p-6 flex flex-col h-full card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <space.icon size={24} className="text-primary" />
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {space.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {space.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSpaces;
