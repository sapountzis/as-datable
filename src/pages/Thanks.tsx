import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";

const Thanks = () => {
  return (
    <>
      <Helmet>
        <title>Message Received — Andreas Sapountzis</title>
      </Helmet>

      <Layout>
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-primary" />
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Message received
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Thanks — I'll reply by email. If it's urgent, book 15 minutes here:
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
                <Link to="/" className="btn-secondary">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Thanks;
