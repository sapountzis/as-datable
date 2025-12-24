import { Github, Linkedin } from "lucide-react";

interface FooterProps {
  onOpenCookieSettings?: () => void;
}

const Footer = ({ onOpenCookieSettings }: FooterProps) => {
  return (
    <footer className="border-t border-border py-8">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Andreas Sapountzis
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/sapountzis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github size={18} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/sapountzisa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
            <button
              onClick={onOpenCookieSettings}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
