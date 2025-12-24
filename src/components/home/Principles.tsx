import { Cpu, Target, Layers, BarChart3 } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const principles = [
  {
    icon: Cpu,
    title: "Production over prototypes",
    description: "I build systems that scale. Everything I ship is instrumented, observable, and designed for real-world constraints. Latency budgets, cost limits, privacy requirements. If it can't run in production reliably, it's not done.",
  },
  {
    icon: Target,
    title: "Results, not hype",
    description: "I optimize for measurable outcomes. Faster pipelines, lower costs, higher acceptance rates. The tech stack matters less than whether users' lives get better and businesses hit their goals.",
  },
  {
    icon: Layers,
    title: "Deep technical ownership",
    description: "From model fine-tuning to database schemas to infrastructure autoscaling. I handle the full stack. I don't just integrate APIs; I architect systems that solve the hard problems beneath the surface.",
  },
  {
    icon: BarChart3,
    title: "Iterate with evidence",
    description: "I ship fast, measure rigorously, and iterate based on data. Evaluation harnesses, feedback loops, A/B tests, monitoring dashboards. Every decision is grounded in what actually works, not what sounds clever.",
  },
];

const Principles = () => {
  return (
    <section id="principles" className="py-20 lg:py-28">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            How I work
          </h2>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {principles.map((principle, index) => (
            <AnimateIn key={principle.title} delay={index * 100}>
              <div className="glass-card p-6 lg:p-8 card-hover h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <principle.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Principles;