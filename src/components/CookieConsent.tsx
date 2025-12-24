interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="section-container">
        <div className="glass-card p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            We use analytics cookies to understand how you use our website. Analytics are disabled by default.
          </p>
          <div className="flex gap-3 shrink-0">
            <button onClick={onDecline} className="btn-secondary text-sm">
              Decline
            </button>
            <button onClick={onAccept} className="btn-primary text-sm">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
