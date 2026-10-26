import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTopic, topics } from "@/data/topics";
import TechnicalFigure from "@/components/figures/TechnicalFigure";
export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic not found" };
  return {
    title: topic.title,
    description: topic.summary,
    alternates: { canonical: `/work/${topic.slug}` },
    openGraph: {
      title: topic.title,
      description: topic.summary,
      url: `/work/${topic.slug}`,
      images: ["/og.png"],
    },
  };
}
export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();
  return (
    <article className="container article-page">
      <header className="article-header">
        <Link href="/work" className="back-link">
          <ArrowLeft size={16} /> All topics
        </Link>
        <h1>{topic.title}</h1>
        <p className="article-summary">{topic.summary}</p>
      </header>
      <div className="article-body">
        {topic.sections.map((section, index) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {index === 0 && topic.figure && (
              <div className="article-figure">
                {topic.example && (
                  <p className="example-intro">{topic.example}</p>
                )}
                <TechnicalFigure kind={topic.figure} />
              </div>
            )}
          </section>
        ))}
      </div>
      <aside className="article-related">
        <h2>Connected topics</h2>
        {topic.related.map((slug) => {
          const related = getTopic(slug);
          return related ? (
            <Link key={slug} href={`/work/${slug}`}>
              {related.title}
              <ArrowUpRight size={19} />
            </Link>
          ) : null;
        })}
      </aside>
    </article>
  );
}
