"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    "ga-disable-G-0G1JNTY6WR"?: boolean;
  }
}
const CookieContext = createContext<{ openSettings: () => void } | undefined>(
  undefined,
);
export function useCookieSettings() {
  const context = useContext(CookieContext);
  if (!context) throw new Error("Cookie settings require CookieProvider");
  return context;
}
function subscribeConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
function readConsent(): boolean | null {
  try {
    const stored = localStorage.getItem("cookie-consent");
    return stored === "true" ? true : stored === "false" ? false : null;
  } catch {
    return null;
  }
}
const serverConsent = () => undefined;

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const storedConsent = useSyncExternalStore<boolean | null | undefined>(
    subscribeConsent,
    readConsent,
    serverConsent,
  );
  const [selectedConsent, setConsent] = useState<boolean | null>(null);
  const consent = selectedConsent ?? storedConsent;
  const ready = storedConsent !== undefined;
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    window["ga-disable-G-0G1JNTY6WR"] = consent !== true;
    if (consent) {
      window.dataLayer = window.dataLayer || [];
      window.gtag =
        window.gtag ||
        function () {
          // eslint-disable-next-line prefer-rest-params -- gtag consumes the standard Arguments command shape.
          window.dataLayer?.push(arguments);
        };
      window.gtag("consent", "update", { analytics_storage: "granted" });
    } else {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
    }
  }, [consent]);
  function choose(accepted: boolean) {
    try {
      localStorage.setItem("cookie-consent", String(accepted));
    } catch {
      /* Apply the choice even when storage is disabled. */
    }
    setConsent(accepted);
    dialog.current?.close();
  }
  return (
    <CookieContext.Provider
      value={{ openSettings: () => dialog.current?.showModal() }}
    >
      {children}
      {ready && consent === null && (
        <CookieConsent
          onAccept={() => choose(true)}
          onDecline={() => choose(false)}
        />
      )}
      <dialog
        ref={dialog}
        className="cookie-dialog"
        aria-labelledby="cookie-title"
      >
        <h2 id="cookie-title">Cookie preferences</h2>
        <p>
          Optional analytics help measure visits to this site. You can use every
          page with analytics declined.
        </p>
        <div className="cookie-actions">
          <button type="button" onClick={() => choose(false)}>
            Decline analytics
          </button>
          <button type="button" onClick={() => choose(true)}>
            Accept analytics
          </button>
        </div>
        <button
          type="button"
          className="text-button dialog-close"
          onClick={() => dialog.current?.close()}
        >
          Close preferences
        </button>
      </dialog>
      {ready && consent === true && (
        <Script
          id="analytics"
          src="https://www.googletagmanager.com/gtag/js?id=G-0G1JNTY6WR"
          strategy="afterInteractive"
          onReady={() => {
            window.gtag?.("js", new Date());
            window.gtag?.("config", "G-0G1JNTY6WR");
          }}
        />
      )}
    </CookieContext.Provider>
  );
}
