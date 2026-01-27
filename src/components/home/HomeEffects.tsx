"use client";

import { useEffect } from "react";

export default function HomeEffects() {
    useEffect(() => {
        // Mark that user has visited homepage (for skipping animations on return)
        sessionStorage.setItem("hasVisitedHome", "true");

        // Scroll to section if explicitly requested
        const scrollTarget = sessionStorage.getItem("scrollToSection");
        if (scrollTarget) {
            sessionStorage.removeItem("scrollToSection");
            setTimeout(() => {
                const element = document.getElementById(scrollTarget);
                if (element) {
                    const top = element.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: "instant" });
                }
            }, 50);
        }
    }, []);

    return null;
}
