import { PlaybackProvider } from "@/components/figures/Explainer";
import Header from "./Header";
import Footer from "./Footer";
import { CookieProvider } from "@/components/providers/CookieProvider";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CookieProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <PlaybackProvider>
        <main id="main">{children}</main>
      </PlaybackProvider>
      <Footer />
    </CookieProvider>
  );
}
