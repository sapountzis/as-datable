import { Mail } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const Contact = () => {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Get in touch
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Interested in discussing engineering challenges or just want to connect?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:sapountzis.andreas@gmail.com"
              className="inline-flex items-center gap-3 px-6 py-3 text-foreground hover:text-primary bg-secondary rounded-full border border-border hover:border-primary/30 transition-all"
            >
              <Mail size={20} />
              <span>sapountzis.andreas@gmail.com</span>
            </a>

            <a
              href="https://linkedin.com/in/andreassapountzis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
};

export default Contact;
