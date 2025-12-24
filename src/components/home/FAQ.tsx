import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const faqs = [
  {
    question: "What kinds of projects do you take?",
    answer: "Production AI systems, data platforms, and hard engineering problems where architecture, reliability, and constraints matter. I'm strongest on 0→1 builds and \"rescue missions\" where the system is slow, expensive, or unreliable.",
  },
  {
    question: "Do you do fine-tuning or research?",
    answer: "Sometimes, but that's not the core offer. The core offer is building systems that ship and operate: architecture, data, pipelines, tooling, monitoring, evaluation, and integration.",
  },
  {
    question: "How do we start?",
    answer: "Either book a 15-minute call, or send a 2-minute brief. If you're not ready yet, grab the free checklist and I'll send you the file instantly.",
  },
  {
    question: "Will you work with our team?",
    answer: "Yes. I can operate as a high-ownership individual contributor, technical lead, or mentor depending on the situation.",
  },
  {
    question: "How many clients do you take at once?",
    answer: "At most 1–2 at a time. I prioritize depth, speed, and quality over spreading thin.",
  },
  {
    question: "What do you need from us to succeed?",
    answer: "Clear access to relevant data/systems, a decision-maker for trade-offs, and agreement on constraints (latency, cost, privacy).",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            FAQ
          </h2>
        </AnimateIn>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <AnimateIn key={index} delay={index * 75}>
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-display text-lg font-medium text-foreground pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;