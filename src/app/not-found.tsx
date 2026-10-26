import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container simple-page">
      <h1>Page not found</h1>
      <p>This address doesn’t lead to a page on the site.</p>
      <Link className="read-link" href="/work">
        Browse technical topics
      </Link>
    </section>
  );
}
