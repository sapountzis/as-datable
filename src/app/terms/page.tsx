import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for this personal website.",
  alternates: { canonical: "/terms" },
};
export default function TermsPage() {
  return (
    <article className="container simple-page">
      <h1>Terms</h1>
      <div className="legal-copy">
        <p>
          Content on this personal website is provided as-is, for general
          information.
        </p>
        <p>
          Technical illustrations labeled as illustrative or synthetic explain a
          method. They are not measurements from a production system.
        </p>
        <p>
          A separate written agreement governs any professional engagement. For
          questions, contact{" "}
          <a href="mailto:sapountzis.andreas@gmail.com">
            sapountzis.andreas@gmail.com
          </a>
          .
        </p>
      </div>
    </article>
  );
}
