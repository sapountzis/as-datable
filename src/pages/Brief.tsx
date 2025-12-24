import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";

const roles = ["Founder", "CTO", "Engineering Lead", "Head of Data/ML", "Product", "Other"];
const constraints = ["Cost", "Latency", "Reliability", "Privacy / Compliance", "Scale", "Time-to-market"];
const urgencyOptions = ["This week", "This month", "Exploring"];

const Brief = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    building: "",
    broken: "",
    success: "",
    constraints: [] as string[],
    stack: "",
    links: "",
    urgency: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConstraintChange = (constraint: string) => {
    setFormData((prev) => ({
      ...prev,
      constraints: prev.constraints.includes(constraint)
        ? prev.constraints.filter((c) => c !== constraint)
        : [...prev.constraints, constraint],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("access_key", "1ccc1049-c3bd-41a3-93f4-2ddc9e9f8ddc");
    form.append("subject", "New Project Brief — asdatable.com");
    form.append("from_name", "asdatable.com");
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("company", formData.company);
    form.append("role", formData.role);
    form.append("building", formData.building);
    form.append("broken", formData.broken);
    form.append("success", formData.success);
    form.append("constraints", formData.constraints.join(", "));
    form.append("stack", formData.stack);
    form.append("links", formData.links);
    form.append("urgency", formData.urgency);
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
    <>
      <Helmet>
        <title>Project Brief — Andreas Sapountzis</title>
        <meta
          name="description"
          content="Send a 2-minute brief so Andreas can assess fit, urgency, and constraints."
        />
      </Helmet>

      <Layout>
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-2xl mx-auto">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                Send a 2-minute project brief
              </h1>
              <p className="text-lg text-muted-foreground text-center mb-12">
                If the problem is interesting and urgent, this is the fastest way to get prioritized. I'll reply by email.
              </p>

              <form onSubmit={handleSubmit} className="glass-card p-6 lg:p-8 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Work email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* What are you building */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What are you building? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                {/* What's broken */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What's broken / blocked right now? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.broken}
                    onChange={(e) => setFormData({ ...formData, broken: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                {/* Success */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What does "success" look like in 30–60 days? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.success}
                    onChange={(e) => setFormData({ ...formData, success: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                {/* Constraints */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Key constraints
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {constraints.map((constraint) => (
                      <button
                        key={constraint}
                        type="button"
                        onClick={() => handleConstraintChange(constraint)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                          formData.constraints.includes(constraint)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {constraint}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stack */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Stack / environment (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.stack}
                    onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Azure, Python, PostgreSQL..."
                  />
                </div>

                {/* Links */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Link(s) to docs / repo / dashboard (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.links}
                    onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Urgency *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {urgencyOptions.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value={option}
                          checked={formData.urgency === option}
                          onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                          className="w-4 h-4 text-primary"
                          required
                        />
                        <span className="text-sm text-muted-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
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
                    "Send brief"
                  )}
                </button>
              </form>

              <p className="text-sm text-muted-foreground text-center mt-6">
                Prefer a call?{" "}
                <a
                  href="https://calendly.com/datable-as/llm-stack-sprint-intro-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Book 15 minutes here
                </a>
              </p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Brief;
