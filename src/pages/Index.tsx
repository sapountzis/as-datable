import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import ProblemSpaces from "@/components/home/ProblemSpaces";
import WorkPreview from "@/components/home/WorkPreview";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";

const Index = () => {
  // Mark that user has visited homepage (for skipping animations on return)
  useEffect(() => {
    sessionStorage.setItem("hasVisitedHome", "true");
  }, []);

  // Scroll to section if explicitly requested
  useEffect(() => {
    const scrollTarget = sessionStorage.getItem("scrollToSection");
    if (scrollTarget) {
      sessionStorage.removeItem("scrollToSection");
      setTimeout(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "instant" });
        }
      }, 50);
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>Andreas Sapountzis — Senior Data & AI Systems Engineer</title>
        <meta
          name="description"
          content="I design and build production AI systems and data platforms that work. Architecture, pipelines, agentic workflows, observability, cost control."
        />
        <link rel="canonical" href="https://asdatable.com/" />
        <meta property="og:title" content="Andreas Sapountzis — Senior Data & AI Systems Engineer" />
        <meta property="og:description" content="I design and build production AI systems and data platforms that work. Architecture, pipelines, agentic workflows, observability, cost control." />
        <meta property="og:image" content="/as-logo.webp" />
        <meta property="og:url" content="https://asdatable.com/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Layout>
        <Hero />
        <ProblemSpaces />
        <WorkPreview />
        <About />
        <Contact />
      </Layout>
    </>
  );
};

export default Index;
