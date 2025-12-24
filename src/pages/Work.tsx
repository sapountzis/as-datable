import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { caseStudies } from "@/data/caseStudies";
import { useState } from "react";

const filters = [
  "All",
  "AI Systems",
  "Agents",
  "Data Platforms",
  "Reliability",
  "Cost & Latency",
  "Research",
];

const filterMapping: Record<string, string[]> = {
  "AI Systems": ["LLM agents", "LLM ops", "LLM Synthesis", "GPT-4", "BERT"],
  "Agents": ["LLM agents", "Multi-Agent Systems", "Tool Use"],
  "Data Platforms": ["Big Data", "Analytics", "MapReduce", "Polars"],
  "Reliability": ["Anomaly Detection", "Pattern Mining", "Automated Triage", "Eval harnesses"],
  "Cost & Latency": ["Cost optimization", "Lazy evaluation", "Infrastructure", "Container Apps"],
  "Research": ["Research", "Neural networks", "Reinforcement Learning", "Time series"],
};

const Work = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredStudies = activeFilter === "All" 
    ? caseStudies 
    : caseStudies.filter((study) => 
        study.tags.some((tag) => filterMapping[activeFilter]?.includes(tag))
      );

  return (
    <>
      <Helmet>
        <title>Work — Andreas Sapountzis</title>
        <meta
          name="description"
          content="Case studies in production AI systems, data platforms, reliability engineering, and cost/latency optimization."
        />
      </Helmet>

      <Layout>
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Work
              </h1>
              <p className="text-lg text-muted-foreground">
                Twelve projects across AI systems, data engineering, and production architecture. Each write-up focuses on the real constraint and the real result.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    activeFilter === filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Case studies grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudies.map((study) => (
                <Link
                  key={study.slug}
                  to={`/work/${study.slug}`}
                  className="glass-card p-6 flex flex-col card-hover group"
                >
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 flex-1">
                    {study.problem[0].slice(0, 120)}...
                  </p>
                  <p className="text-sm font-medium text-primary mb-4">
                    {study.result.slice(0, 60)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {study.tags.slice(0, 3).map((tag) => (
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
              ))}
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

export default Work;
