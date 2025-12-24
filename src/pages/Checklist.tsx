import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";

const checklistItems = [
  "Architecture: boundaries, ownership, and interfaces",
  "Data: ingestion, storage, serving, and lineage",
  "Observability: what to measure and how to debug",
  "Evaluation: how to stop quality regression",
  "Cost control: avoid accidental money fires",
  "Operational readiness: runbooks and failure modes",
];

const Checklist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("access_key", "1ccc1049-c3bd-41a3-93f4-2ddc9e9f8ddc");
    form.append("subject", "Checklist Request — asdatable.com");
    form.append("from_name", "asdatable.com");
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("botcheck", "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        sessionStorage.setItem("checklist_unlocked", "true");
        navigate("/thanks-checklist");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Systems Launch Checklist — Andreas Sapountzis</title>
        <meta
          name="description"
          content="Get a practical production checklist for AI systems: architecture, data pipelines, observability, evaluation, and cost control."
        />
      </Helmet>

      <Layout>
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-2xl mx-auto">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                AI Systems Launch Checklist
              </h1>
              <p className="text-lg text-muted-foreground text-center mb-12">
                This is the checklist I wish teams had before they ship "AI" and then spend months fighting reliability, costs, and silent quality decay.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* What's inside */}
                <div className="glass-card p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    What's inside
                  </h2>
                  <ul className="space-y-3">
                    {checklistItems.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-muted-foreground">
                        <Check size={18} className="text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
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
                        Unlocking...
                      </>
                    ) : (
                      "Unlock the Checklist"
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    No spam. Just unlocks the full interactive checklist.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Checklist;
