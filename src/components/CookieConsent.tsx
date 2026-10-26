"use client";
export default function CookieConsent({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <aside className="cookie-banner" aria-label="Analytics preference">
      <p>Allow optional analytics? Your preference will be remembered.</p>
      <div className="cookie-actions">
        <button type="button" onClick={onDecline}>
          Decline
        </button>
        <button type="button" onClick={onAccept}>
          Accept
        </button>
      </div>
    </aside>
  );
}
