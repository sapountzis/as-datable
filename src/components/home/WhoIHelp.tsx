import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimateIn } from "@/components/ui/AnimateIn";

const goodFit = [
  "You have a hard problem that's blocking progress (architecture, data, reliability, scale, cost).",
  "You need 0→1 building, not incremental feature churn.",
  "You value elegant, robust solutions and want the \"why\" documented.",
  "You want systems that are observable: metrics, dashboards, evals, alerts.",
  "You want someone who can lead technically and mentor as needed.",
];

const notFit = [
  "You only need minor UI tweaks or repetitive backlog execution.",
  "You want research experiments without a production path.",
  "You don't care about reliability, costs, or operating the system long-term.",
  "You want to hire a team of juniors and \"figure it out later\".",
];

const WhoIHelp = () => {
  return (
    <section id="who-i-help" className="py-20 lg:py-28">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Who I help
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            You need a Tier-1 engineer who can own an ambiguous problem end-to-end — architecture, data, production, and execution — minimal hand-holding.
          </p>
          <p className="text-lg text-foreground font-medium">
            For founders/CTOs who need one senior engineer to own architecture + data + production delivery.
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Good fit */}
          <AnimateIn delay={100}>
            <div className="glass-card p-6 lg:p-8 h-full">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check size={18} className="text-primary" />
                </span>
                This is a fit if…
              </h3>
              <ul className="space-y-4">
                {goodFit.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <Check size={18} className="text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>

          {/* Not fit */}
          <AnimateIn delay={200}>
            <div className="glass-card p-6 lg:p-8 h-full">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <X size={18} className="text-destructive" />
                </span>
                Not a fit if…
              </h3>
              <ul className="space-y-4">
                {notFit.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <X size={18} className="text-destructive shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>
        </div>

        {/* CTAs */}
        <AnimateIn delay={300} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
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

export default WhoIHelp;