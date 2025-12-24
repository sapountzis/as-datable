import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy — Andreas Sapountzis</title>
      </Helmet>

      <Layout>
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-2xl mx-auto">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                Privacy
              </h1>
              
              <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
                <p>
                  This website collects messages you submit via forms (name, email, and message content) so Andreas can respond.
                </p>
                <p>
                  Analytics are disabled by default and only enabled if you consent via the cookie banner.
                </p>
                <p>
                  If you want your data removed, email{" "}
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

export default Privacy;
