import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import { featuredTopics, getTopic, topicAreas } from "@/data/topics";
import TechnicalFigure from "@/components/figures/TechnicalFigure";

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Andreas Sapountzis",
  url: "https://asdatable.com",
  sameAs: [
    "https://github.com/sapountzis",
    "https://www.linkedin.com/in/sapountzisa",
  ],
};
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <section className="intro container" aria-labelledby="intro-title">
        <div className="intro-copy">
          <h1 id="intro-title">
            Andreas
            <br />
            Sapountzis
          </h1>
          <p className="intro-discipline">
            Machine learning, statistics & software
          </p>
          <p className="intro-description">
            Applied machine learning and AI, with a background in scientific
            data analysis. My work includes statistical pattern discovery,
            recommendation systems, language models and the software interfaces
            around them.
          </p>
          <div className="intro-links">
            <a href="https://github.com/sapountzis">
              GitHub <ArrowUpRight size={15} />
            </a>
            <a href="https://www.linkedin.com/in/sapountzisa">
              LinkedIn <ArrowUpRight size={15} />
            </a>
            <a href="mailto:sapountzis.andreas@gmail.com">
              Email <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="intro-aside">
          <Image
            src="/portrait-delivery.webp"
            alt="Andreas Sapountzis"
            width={800}
            height={800}
            priority
            sizes="(min-width: 768px) 260px, 112px"
            className="portrait"
          />
          <a className="intro-explore" href="#expertise">
            Areas of expertise <ArrowDown size={16} />
          </a>
        </div>
      </section>
      <section
        id="expertise"
        className="expertise-section container"
        aria-labelledby="expertise-title"
      >
        <div className="section-heading">
          <h2 id="expertise-title">Areas of expertise</h2>
          <Link className="read-link" href="/work">
            All topics <ArrowRight size={17} />
          </Link>
        </div>
        <div className="topic-areas">
          {topicAreas.map((area) => (
            <div className="topic-area" key={area.title}>
              <h3>{area.title}</h3>
              <ul>
                {area.slugs.map((slug) => {
                  const topic = getTopic(slug)!;
                  return (
                    <li key={slug}>
                      <Link href={`/work/${slug}`}>
                        <strong>{topic.title}</strong>
                        <ArrowUpRight size={16} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section
        id="technical-work"
        className="work-section container"
        aria-labelledby="work-title"
      >
        <div className="section-heading">
          <h2 id="work-title">Selected methods</h2>
        </div>
        <div className="featured-topics">
          {featuredTopics.map((topic) => (
            <article className="topic-feature" key={topic.slug}>
              <div className="topic-copy">
                <h3>
                  <Link href={`/work/${topic.slug}`}>{topic.title}</Link>
                </h3>
                <p>{topic.summary}</p>
              </div>
              {topic.example && (
                <p className="example-intro">{topic.example}</p>
              )}
              {topic.figure && <TechnicalFigure kind={topic.figure} />}
              <div className="topic-methods">
                <Link className="read-link" href={`/work/${topic.slug}`}>
                  Equations, assumptions & interpretation{" "}
                  <ArrowUpRight size={17} />
                </Link>
                {topic.slug === "tool-using-agents" && (
                  <Link
                    className="read-link"
                    href="/work/language-model-evaluation"
                  >
                    Evaluation methods <ArrowUpRight size={17} />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        id="about"
        className="about-section container"
        aria-labelledby="about-title"
      >
        <h2 id="about-title">Background</h2>
        <div className="about-copy">
          <p>
            My background is in electrical and computer engineering, with an
            M.Eng. from Aristotle University of Thessaloniki. Earlier work in
            neuroscience involved high-dimensional measurements, multivariate
            analysis, and neural networks.
          </p>
          <p>
            Subsequent work has applied statistical modeling, language models
            and software engineering in media streaming analytics, gaming,
            mental health and construction tech.
          </p>
        </div>
      </section>
      <section
        id="contact"
        className="contact-section container"
        aria-labelledby="contact-title"
      >
        <div>
          <h2 id="contact-title">Contact</h2>
        </div>
        <a className="contact-email" href="mailto:sapountzis.andreas@gmail.com">
          sapountzis.andreas@gmail.com <ArrowUpRight size={22} />
        </a>
      </section>
    </>
  );
}
