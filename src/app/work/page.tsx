import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, topics } from "@/data/topics";
export const metadata: Metadata = {
  title: "Technical topics",
  description:
    "Work and interests across statistical learning, language-model systems, scientific analysis, and software.",
  alternates: { canonical: "/work" },
};
export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const active = categories.find((category) => category === topic) ?? "All";
  const visible = topics.filter(
    (entry) => active === "All" || entry.categories.includes(active),
  );
  return (
    <div className="container index-page">
      <header className="page-intro">
        <Link href="/" className="back-link">
          Home
        </Link>
        <h1>Technical topics</h1>
        <p>
          Methods and fields from my work, with explanations of their inputs,
          mathematical ideas and interpretation.
        </p>
      </header>
      <nav className="topic-filters" aria-label="Filter by topic">
        {categories.map((category) => (
          <Link
            key={category}
            href={
              category === "All"
                ? "/work"
                : `/work?topic=${encodeURIComponent(category)}`
            }
            aria-current={category === active ? "page" : undefined}
          >
            {category}
          </Link>
        ))}
      </nav>
      <div className="topic-index">
        {visible.map((entry) => (
          <Link
            className="index-entry"
            key={entry.slug}
            href={`/work/${entry.slug}`}
          >
            <div>
              <h2>
                {entry.title}
                <ArrowUpRight size={24} />
              </h2>
              <p>{entry.summary}</p>
            </div>
            <span>{entry.methods.join(" · ")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
