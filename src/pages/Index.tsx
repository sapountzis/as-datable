import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import WhoIHelp from "@/components/home/WhoIHelp";
import Offers from "@/components/home/Offers";
import HowItWorks from "@/components/home/HowItWorks";
import WorkPreview from "@/components/home/WorkPreview";
import Principles from "@/components/home/Principles";
import About from "@/components/home/About";
import FAQ from "@/components/home/FAQ";
import Contact from "@/components/home/Contact";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Andreas Sapountzis — Tier-1 AI Systems Engineer (Architecture + Data)</title>
        <meta
          name="description"
          content="I design and build production AI systems and data platforms that work. Architecture, pipelines, agentic workflows, observability, cost control. Best for hard 0→1 problems and rescue missions."
        />
        <link rel="canonical" href="https://asdatable.com/" />
        <meta property="og:title" content="Andreas Sapountzis — Tier-1 AI Systems Engineer (Architecture + Data)" />
        <meta property="og:description" content="I design and build production AI systems and data platforms that work. Architecture, pipelines, agentic workflows, observability, cost control. Best for hard 0→1 problems and rescue missions." />
        <meta property="og:image" content="/as-logo.webp" />
        <meta property="og:url" content="https://asdatable.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Layout>
        <Hero />
        <WhoIHelp />
        <Offers />
        <HowItWorks />
        <WorkPreview />
        <Principles />
        <About />
        <FAQ />
        <Contact />
      </Layout>
    </>
  );
};

export default Index;
