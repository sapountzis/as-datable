import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Square } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

const checklistSections = [
  {
    title: "Define the real system",
    items: [
      "What problem are we solving, and who owns the outcome?",
      "What is the \"success\" metric in production (not in a demo)?",
      "What constraints are real: cost, latency, privacy, reliability, scale?",
      "What decisions must be made early to avoid rewrites?",
    ],
  },
  {
    title: "Architecture boundaries",
    items: [
      "List the components and responsibilities (clear ownership).",
      "Define interfaces between components (inputs/outputs/contracts).",
      "Decide where state lives (and why).",
      "Design for failure: timeouts, retries, idempotency.",
      "Plan for rollout: staging, gradual deployment, rollback.",
    ],
  },
  {
    title: "Data reality",
    items: [
      "Define the sources of truth and what is derived.",
      "Ingestion plan: batching vs streaming, formats, and validation.",
      "Storage plan: what lives where, retention, and costs.",
      "Serving plan: query patterns and performance constraints.",
      "Data quality checks: missing fields, schema drift, bad events.",
      "Lineage: can we explain how outputs were produced?",
    ],
  },
  {
    title: "Observability and debugging",
    items: [
      "What metrics indicate health (SLOs), not vanity?",
      "What logs and traces are required to debug real incidents?",
      "Dashboards: what do on-call engineers need at 2am?",
      "Alerts: what should page a human vs stay silent?",
      "Runbooks: what is the first action for each failure mode?",
    ],
  },
  {
    title: "Evaluation and quality",
    items: [
      "How do we measure quality on real data, continuously?",
      "What are the known failure cases and how are they tested?",
      "How do we prevent silent regression after changes?",
      "What feedback loop exists from users/operators to improve?",
    ],
  },
  {
    title: "Cost control",
    items: [
      "Where does money go (compute, storage, external APIs)?",
      "Define budgets and guardrails (per day / per tenant / per request).",
      "Add cost visibility early (not after the bill).",
      "Make expensive paths explicit and intentional.",
    ],
  },
  {
    title: "Security and privacy",
    items: [
      "PII/PHI: what do we store, what do we avoid, what do we redact?",
      "Access controls: least privilege, auditability.",
      "Secrets management and environment separation.",
    ],
  },
  {
    title: "Operational readiness",
    items: [
      "Who owns the system after launch?",
      "Incident process: detection → triage → mitigation → postmortem.",
      "Handover: docs, diagrams, and \"how to run it\".",
    ],
  },
];

// Check synchronously to avoid flash/redirect on initial render
const getInitialUnlocked = () => {
  try {
    return sessionStorage.getItem("checklist_unlocked") === "true";
  } catch {
    return false;
  }
};

const ThanksChecklist = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Check on every render (not in useEffect) to handle the redirect properly
  const isUnlocked = getInitialUnlocked();

  if (!isUnlocked) {
    return <Navigate to="/resources/ai-systems-launch-checklist" replace />;
  }

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const totalItems = checklistSections.reduce((acc, s) => acc + s.items.length, 0);
  const completedItems = checkedItems.size;

  return (
    <>
      <Helmet>
        <title>AI Systems Launch Checklist — Andreas Sapountzis</title>
      </Helmet>

      <Layout>
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-primary" />
                </div>
                
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  AI Systems Launch Checklist
                </h1>
                
                <p className="text-muted-foreground mb-4">
                  Production-ready architecture + data + operations
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                  <CheckCircle size={16} />
                  {completedItems} / {totalItems} completed
                </div>
              </div>

              <div className="space-y-8">
                {checklistSections.map((section, sectionIndex) => (
                  <div key={section.title} className="glass-card p-6">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-mono">
                        {sectionIndex + 1}
                      </span>
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => {
                        const itemKey = `${sectionIndex}-${itemIndex}`;
                        const isChecked = checkedItems.has(itemKey);
                        return (
                          <li
                            key={itemIndex}
                            onClick={() => toggleItem(itemKey)}
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-primary/10 text-foreground"
                                : "hover:bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            {isChecked ? (
                              <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                            ) : (
                              <Square size={20} className="shrink-0 mt-0.5 opacity-50" />
                            )}
                            <span className={isChecked ? "line-through opacity-70" : ""}>
                              {item}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 glass-card text-center">
                <p className="text-muted-foreground mb-6">
                  If you want help designing or building this end-to-end:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="https://calendly.com/datable-as/llm-stack-sprint-intro-call"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary group"
                  >
                    Book 15-min Call
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <Link to="/brief" className="btn-secondary">
                    Send a 2-minute Brief
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ThanksChecklist;
