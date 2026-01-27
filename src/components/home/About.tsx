import { AnimateIn } from "@/components/ui/AnimateIn";
import Image from "next/image";

const skills = [
  "LLM systems",
  "Agents & RAG",
  "ML pipelines",
  "Data engineering",
  "Cloud infrastructure",
];

const philosophy = [
  "Build for production when reliability matters",
  "Explore novel solutions for unsolved problems",
  "Context awareness - applying the right approach",
  "Cross-system thinking - every decision impacts the broader architecture",
  "Observability - measuring what matters",
];

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="section-container">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            About
          </h2>
        </AnimateIn>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Main content */}
          <AnimateIn delay={100} className="lg:col-span-2">
            <div className="glass-card p-6 lg:p-8 h-full">
              <div className="flex items-start gap-4 mb-6">
                <Image
                  src="/profile.webp"
                  alt="Andreas Sapountzis"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Andreas Sapountzis
                  </h3>
                  <p className="text-muted-foreground">Staff-level Data & AI Systems Engineer</p>
                </div>
              </div>

              <div className="space-y-4 text-muted-foreground mb-6">
                <p>
                  My journey started in neuroscience research, analyzing complex brain activity patterns and dynamic systems. I then moved into streaming analytics at scale, where I learned to handle real-time constraints and massive throughput. Now I focus on LLM operations and agentic systems, solving novel AI problems in production environments.
                </p>
                <p>
                  I have worked across healthcare, gaming, enterprise tools, and scientific research wherever there are hard technical problems worth solving. M.Eng. in Electrical and Computer Engineering from Aristotle University of Thessaloniki. Based remotely, working with teams worldwide.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AnimateIn>

          {/* Engineering philosophy */}
          <AnimateIn delay={200}>
            <div className="glass-card p-6 lg:p-8 h-full">
              <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                Engineering philosophy
              </h4>
              <ul className="space-y-4">
                {philosophy.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};

export default About;