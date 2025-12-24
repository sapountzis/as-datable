import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import Layout from "@/components/layout/Layout";

const Resources = () => {
  return (
    <>
      <Helmet>
        <title>Resources — Andreas Sapountzis</title>
        <meta
          name="description"
          content="Free resources on production AI systems, data platforms, reliability, and cost control."
        />
      </Helmet>

      <Layout>
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Resources
              </h1>
              <p className="text-lg text-muted-foreground">
                If you're not ready to book a call, start here. These resources are designed to be practical: constraints, architecture, and operational reality.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Link
                to="/resources/ai-systems-launch-checklist"
                className="glass-card p-6 lg:p-8 flex items-start gap-6 card-hover group block"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText size={28} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    AI Systems Launch Checklist (PDF)
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    A practical checklist for building production AI systems: architecture, data, observability, evaluation, and cost control.
                  </p>
                  <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Get the PDF
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
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
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Resources;
