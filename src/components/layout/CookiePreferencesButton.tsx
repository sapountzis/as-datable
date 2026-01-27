"use client";

import { useCookieSettings } from "@/components/providers/CookieProvider";

const CookiePreferencesButton = () => {
    const { openSettings } = useCookieSettings();

    return (
        <button
            onClick={openSettings}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            Cookie preferences
        </button>
    );
};

export default CookiePreferencesButton;
