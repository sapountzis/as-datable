import { Link } from "react-router-dom";
import { ArrowRight, Phone, FileText, Hammer } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const steps = [
  {
    icon: Phone,
    number: "1",
    title: "Align (15 minutes)",
    description: [
      "You share the problem, constraints, and urgency.",
      "We confirm whether it's a fit and pick the engagement shape.",
    ],
  },
  {
    icon: FileText,
    number: "2",
    title: "Design + Plan",
    description: [
      "I map the system, data, and operational realities.",
      "You get clear milestones, risks, and trade-offs.",
    ],
  },
  {
    icon: Hammer,
    number: "3",
    title: "Build + Ship",
    description: [
      "I implement and integrate end-to-end.",
      "Everything is observable and documented.",
      "You get a handover your team can actually use.",
    ],
  },
];

const timeline = [
  { label: "Day 1", detail: "call" },
  { label: "Days 2–3", detail: "brief + plan" },
  { label: "Week 1+", detail: "build + ship" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            Fast start, low ceremony, high ownership. The goal is to ship something you can operate.
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => (
            <AnimateIn key={step.title} delay={index * 100}>
              <div className="relative h-full">
                <div className="glass-card p-6 lg:p-8 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
                      {step.number}
                    </div>
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <ul className="space-y-2">
                    {step.description.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {step.number !== "3" && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Timeline */}
        <AnimateIn delay={350} className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
          {timeline.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{item.label}:</span>
              <span className="text-sm text-muted-foreground">{item.detail}</span>
              {index < timeline.length - 1 && (
                <span className="hidden md:block text-muted-foreground ml-4">→</span>
              )}
            </div>
          ))}
        </AnimateIn>

        {/* CTAs */}
        <AnimateIn delay={400} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://calendly.com/datable-as/llm-stack-sprint-intro-call"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group"
          >
            Book 15-min Call
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link to="/brief" className="btn-secondary">
            Send a 2-minute Brief
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
};

export default HowItWorks;