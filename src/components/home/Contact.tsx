import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Loader2 } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("access_key", "1ccc1049-c3bd-41a3-93f4-2ddc9e9f8ddc");
    form.append("subject", "New Message — asdatable.com");
    form.append("from_name", "asdatable.com");
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("message", formData.message);
    form.append("botcheck", "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        window.location.href = "/thanks";
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-secondary/30">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Get in touch
          </h2>
          <p className="text-lg text-muted-foreground">
            Working on something interesting? Drop me a line. If you prefer structure, send the 2-minute brief.
          </p>
        </AnimateIn>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Quick actions */}
          <AnimateIn delay={100} className="space-y-4">
            <a
              href="https://calendly.com/datable-as/llm-stack-sprint-intro-call"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 flex items-center justify-between group card-hover block"
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  Book 15-min Call
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quick intro to discuss your project
                </p>
              </div>
              <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              to="/brief"
              className="glass-card p-6 flex items-center justify-between group card-hover block"
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  Send a 2-minute Brief
                </h3>
                <p className="text-sm text-muted-foreground">
                  Structured form for project details
                </p>
              </div>
              <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="mailto:sapountzis.andreas@gmail.com"
              className="glass-card p-6 flex items-center justify-between group card-hover block"
            >
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-primary" />
                <span className="text-muted-foreground">sapountzis.andreas@gmail.com</span>
              </div>
              <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
            </a>
          </AnimateIn>

          {/* Contact form */}
          <AnimateIn delay={200}>
            <form onSubmit={handleSubmit} className="glass-card p-6 lg:p-8 h-full">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                {/* Honeypot */}
                <input type="checkbox" name="botcheck" className="hidden" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </form>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};

export default Contact;