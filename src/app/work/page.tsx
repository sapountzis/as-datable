"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

export default function WorkPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredStudies = activeFilter === "All"
        ? caseStudies
        : caseStudies.filter((study) =>
            study.tags.some((tag) => filterMapping[activeFilter]?.includes(tag))
        );

    return (
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
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeFilter === filter
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
                            href={`/work/${study.slug}`}
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

                {/* Contact */}
                <div className="flex flex-col items-center justify-center gap-4 mt-16">
                    <a
                        href="mailto:sapountzis.andreas@gmail.com"
                        className="btn-secondary inline-flex items-center gap-2"
                    >
                        Get in touch
                        <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
}
