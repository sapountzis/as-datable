"use client";
import { useCookieSettings } from "@/components/providers/CookieProvider";
export default function CookiePreferencesButton() {
  const { openSettings } = useCookieSettings();
  return (
    <button className="text-button" type="button" onClick={openSettings}>
      Cookie preferences
    </button>
  );
}
