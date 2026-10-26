import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label="Andreas Sapountzis, home"
        >
          <span aria-hidden="true">AS</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/work">Topics</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
