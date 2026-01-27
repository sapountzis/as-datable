"use client";

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="glass-card p-4">
        <p className="text-sm text-muted-foreground mb-4">
          We use cookies to analyze site usage. Your choice will be remembered.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onDecline}
            className="btn-secondary text-sm px-4 py-2 flex-1"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="btn-primary text-sm px-4 py-2 flex-1"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
