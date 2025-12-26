import { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "../CookieConsent";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent !== null) {
      setHasConsent(consent === "true");
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setHasConsent(true);
    // Initialize GA4 here
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "false");
    setHasConsent(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background layer */}
      <div className="fixed inset-0 bg-background" style={{ zIndex: -2 }} />
      <Header />
      <main className="flex-1 pt-16 lg:pt-20 relative z-10">{children}</main>
      <Footer onOpenCookieSettings={() => setShowCookieSettings(true)} />
      
      {hasConsent === null && (
        <CookieConsent
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
      
      {showCookieSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="glass-card p-6 max-w-md mx-4">
            <h3 className="font-display text-xl font-semibold mb-4">Cookie Preferences</h3>
            <p className="text-muted-foreground mb-6">
              We use analytics cookies to understand how you use our website. You can change your preferences at any time.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleDecline();
                  setShowCookieSettings(false);
                }}
                className="btn-secondary flex-1"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  handleAccept();
                  setShowCookieSettings(false);
                }}
                className="btn-primary flex-1"
              >
                Accept
              </button>
            </div>
            <button
              onClick={() => setShowCookieSettings(false)}
              className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
