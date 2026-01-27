"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import CookieConsent from "@/components/CookieConsent";

interface CookieContextType {
    openSettings: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function useCookieSettings() {
    const context = useContext(CookieContext);
    if (!context) {
        throw new Error("useCookieSettings must be used within a CookieProvider");
    }
    return context;
}

export function CookieProvider({ children }: { children: React.ReactNode }) {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (consent === null) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "true");
        setShowBanner(false);
        setShowSettings(false);
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("consent", "update", { analytics_storage: "granted" });
        }
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "false");
        setShowBanner(false);
        setShowSettings(false);
    };

    return (
        <CookieContext.Provider value={{ openSettings: () => setShowSettings(true) }}>
            {children}

            {showBanner && (
                <CookieConsent onAccept={handleAccept} onDecline={handleDecline} />
            )}

            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="glass-card p-6 w-full max-w-md zoom-in-95 duration-200">
                        <h3 className="font-display text-xl font-semibold mb-4 text-foreground">Cookie Preferences</h3>
                        <p className="text-muted-foreground mb-6 text-sm">
                            We use analytics cookies to understand how you use our website. You can change your preferences at any time.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={handleDecline} className="btn-secondary flex-1">
                                Decline
                            </button>
                            <button onClick={handleAccept} className="btn-primary flex-1">
                                Accept
                            </button>
                        </div>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </CookieContext.Provider>
    );
}
