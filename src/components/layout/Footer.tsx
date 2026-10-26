import Link from "next/link";
import CookiePreferencesButton from "./CookiePreferencesButton";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link href="/" className="footer-name">
          Andreas Sapountzis
        </Link>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <CookiePreferencesButton />
        </div>
      </div>
    </footer>
  );
}
