import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const NeuralFabric = lazy(() => import("../NeuralFabric"));

const proofMetrics = [
  "86% cost reduction",
  "88% latency improvement",
  "90% less alert triage",
  "30% revenue impact",
  "1M+ devices modeled",
  "p95 < 1s at scale",
];

const clientLogos = [
  { src: "/logos/airev-sm.webp", alt: "AIREV" },
  { src: "/logos/mentalyc-sm.webp", alt: "Mentalyc" },
  { src: "/logos/einbliq-dark-sm.webp", alt: "Einbliq" },
  { src: "/logos/yumio-sm.webp", alt: "Yumio" },
  { src: "/logos/ec-sm.webp", alt: "European Commission" },
];

const Hero = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Suspense fallback={null}>
          <NeuralFabric />
        </Suspense>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            Production AI & Data Systems Architect
          </span>

          {/* Name */}
          <p className="text-lg text-muted-foreground mb-4">
            Andreas Sapountzis
          </p>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            End-to-end AI systems engineering — built for production.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto text-balance">
            I design and ship AI systems under real constraints: cost, latency, privacy, and reliability. Best for 0→1 delivery and high-stakes rescues.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
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
          </div>

          {/* Tertiary CTA */}
          <Link
            to="/resources/ai-systems-launch-checklist"
            className="inline-block text-sm text-foreground hover:text-primary transition-colors mb-4"
            style={{ 
              animationDelay: "0.5s",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.8)"
            }}
          >
            Get the AI Systems Launch Checklist (free PDF) →
          </Link>

          {/* Email chip */}
          <a
            href="mailto:sapountzis.andreas@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary bg-secondary rounded-full border border-border hover:border-primary/30 transition-all"
            style={{ animationDelay: "0.6s" }}
          >
            <Mail size={16} />
            sapountzis.andreas@gmail.com
          </a>
        </div>

        {/* Proof bar */}
        <div className="mt-16">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {proofMetrics.map((metric) => (
              <div
                key={metric}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg border border-border"
              >
                {metric}
              </div>
            ))}
          </div>
        </div>

        {/* Client logos */}
        <div className="mt-16">
          <p 
            className="text-sm text-muted-foreground text-center mb-6"
            style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)" }}
          >
            Worked with
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 p-6 rounded-2xl bg-background/30 backdrop-blur-sm border border-border/30">
            {clientLogos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                className="h-8 md:h-10 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
