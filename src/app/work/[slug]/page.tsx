import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return caseStudies.map((study) => ({
        slug: study.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const study = getCaseStudyBySlug(slug);

    if (!study) {
        return {
            title: "Case Study Not Found — Andreas Sapountzis",
        };
    }

    return {
        title: `${study.title} — Andreas Sapountzis`,
        description: study.summary,
    };
}

export default async function CaseStudyPage({ params }: PageProps) {
    const { slug } = await params;
    const study = getCaseStudyBySlug(slug);

    if (!study) {
        notFound();
    }

    return (
        <article className="py-20 lg:py-28">
            <div className="section-container">
                <div className="max-w-3xl mx-auto">
                    {/* Back link */}
                    <Link
                        href="/work"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Work
                    </Link>

                    {/* Title */}
                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                        {study.title}
                    </h1>

                    {/* Summary */}
                    <p className="text-xl text-muted-foreground mb-12">
                        {study.summary}
                    </p>

                    {/* The problem */}
                    <section className="mb-12">
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                            The problem
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
                            {study.problem.map((para, index) => (
                                <p key={index}>{para}</p>
                            ))}
                        </div>
                    </section>

                    {/* What I built */}
                    <section className="mb-12">
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                            What I built / changed
                        </h2>
                        <ul className="space-y-3">
                            {study.whatIBuilt.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Result */}
                    <section className="mb-12">
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                            Result
                        </h2>
                        <p className="text-lg font-medium text-primary">
                            {study.result}
                        </p>
                    </section>

                    {/* Tags */}
                    <section className="mb-12">
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                            Stack / concepts
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {study.tags.map((tag) => (
                                <span key={tag} className="chip">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Contact */}
                    <div className="glass-card p-6 lg:p-8">
                        <p className="text-muted-foreground mb-6">
                            Interested in discussing engineering challenges?
                        </p>
                        <a
                            href="mailto:sapountzis.andreas@gmail.com"
                            className="btn-secondary inline-block"
                        >
                            Get in touch
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
