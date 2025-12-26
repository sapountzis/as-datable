import { Link } from "react-router-dom";
import { Zap, Wrench, Rocket } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const offers = [
  {
    icon: Zap,
    title: "AI Systems Architecture Sprint",
    bestFor: "You need a clear, production-ready plan before writing months of code.",
    timeline: "1–2 weeks",
    deliverables: [
      "System architecture: components, responsibilities, interfaces.",
      "Data model and pipeline plan (ingestion → storage → serving).",
      "Reliability plan: observability, failure modes, runbooks.",
      "Cost plan: where money goes, how to control it.",
      "Delivery plan: milestones and execution sequence.",
      "A concise architecture document you can hand to engineers.",
    ],
    cta: { label: "Start with a brief", href: "/brief" },
  },
  {
    icon: Wrench,
    title: "Data + Platform Rescue Mission",
    bestFor: "Your pipeline is slow, expensive, flaky, or operationally painful.",
    timeline: "2–4 weeks",
    deliverables: [
      "Bottleneck diagnosis (compute, storage, orchestration, queries).",
      "Fixes that hold in production (not \"it worked on my laptop\").",
      "Latency and cost wins tied to measurable outcomes.",
      "Better operational ergonomics (dashboards, alerts, debuggability).",
      "Documentation so your team can operate it confidently.",
    ],
    cta: { label: "Book 15-min Call", href: "https://calendly.com/datable-as/llm-stack-sprint-intro-call", external: true },
  },
  {
    icon: Rocket,
    title: "Build the Production AI System (0→1)",
    bestFor: "You want a real system shipped: agents, workflows, data, and ops — end-to-end.",
    timeline: "3–8 weeks (depends on scope)",
    deliverables: [
      "Working production system with real constraints (cost, latency, privacy).",
      "Data pipelines and storage designed for scale.",
      "Agentic workflows and automation where they make sense.",
      "Evaluation and monitoring so quality doesn't silently degrade.",
      "Handover, docs, and operational playbook.",
    ],
    cta: { label: "Send a 2-minute Brief", href: "/brief" },
  },
];

const Offers = () => {
  return (
    <section id="offers" className="py-20 lg:py-28">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ways to work together
          </h2>
          <p className="text-lg text-muted-foreground mb-3">
            Pick the path that matches your urgency. All options are designed around shipping production systems — not prototypes.
          </p>
          <p className="text-sm font-medium text-foreground">
            Minimum engagement: 1–2 weeks.
          </p>
        </AnimateIn>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {offers.map((offer, index) => (
            <AnimateIn key={offer.title} delay={index * 100}>
              <div className="glass-card p-6 lg:p-8 flex flex-col card-hover h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <offer.icon size={24} className="text-primary" />
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {offer.title}
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-primary mb-1">Best for:</p>
                  <p className="text-sm text-muted-foreground">{offer.bestFor}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-primary mb-1">Typical timeline:</p>
                  <p className="text-sm text-muted-foreground">{offer.timeline}</p>
                </div>
                
                <div className="mb-6 flex-1">
                  <p className="text-sm font-medium text-primary mb-2">What you get:</p>
                  <ul className="space-y-2">
                    {offer.deliverables.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {offer.cta.external ? (
                  <a
                    href={offer.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-center"
                  >
                    {offer.cta.label}
                  </a>
                ) : (
                  <Link to={offer.cta.href} className="btn-secondary text-center">
                    {offer.cta.label}
                  </Link>
                )}
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={350}>
          <p className="text-sm text-muted-foreground text-center mt-8">
            <strong>Capacity note:</strong> Andreas takes on a maximum of 1–2 clients at a time. If you're on a deadline, use the brief so you can be prioritized correctly.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
};

export default Offers;