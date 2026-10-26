import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Contact information and analytics preferences for this website.",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  return (
    <article className="container simple-page">
      <h1>Privacy</h1>
      <div className="legal-copy">
        <p>
          Contact links on this website open your email application. The website
          does not have a contact form.
        </p>
        <p>
          Optional usage analytics are loaded only when you accept analytics
          cookies. You can decline them, or change your choice using Cookie
          preferences in the footer. Your choice and theme preference are stored
          in your browser.
        </p>
        <p>
          To ask about information shared by email or to request its removal,
          contact{" "}
          <a href="mailto:sapountzis.andreas@gmail.com">
            sapountzis.andreas@gmail.com
          </a>
          .
        </p>
      </div>
    </article>
  );
}
