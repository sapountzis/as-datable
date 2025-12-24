import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms — Andreas Sapountzis</title>
      </Helmet>

      <Layout>
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-2xl mx-auto">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                Terms
              </h1>
              
              <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
                <p>
                  All content is provided as-is.
                </p>
                <p>
                  Consulting engagements are governed by a separate written agreement.
                </p>
                <p>
                  For questions, email{" "}
                  <a
                    href="mailto:sapountzis.andreas@gmail.com"
                    className="text-primary hover:underline"
                  >
                    sapountzis.andreas@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Terms;
