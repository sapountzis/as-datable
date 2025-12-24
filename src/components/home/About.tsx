import { AnimateIn } from "@/components/ui/AnimateIn";

const skills = [
  "LLM systems",
  "Agents & RAG",
  "ML pipelines",
  "Data engineering",
  "Cloud infrastructure",
];

const whatDrivesMe = [
  "Reliability over novelty — Production systems that just work.",
  "Make it observable — If you can't measure it, you can't improve it.",
  "Respect constraints — Budget, latency, privacy matter.",
];

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-secondary/30">
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
                <img
                  src="/profile.webp"
                  alt="Andreas Sapountzis"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Andreas Sapountzis
                  </h3>
                  <p className="text-muted-foreground">AI & ML Engineer</p>
                </div>
              </div>
              
              <div className="space-y-4 text-muted-foreground mb-6">
                <p>
                  I'm an AI & Machine Learning Engineer with 5+ years building production systems. Started in neuroscience research analyzing brain activity patterns, then moved into streaming analytics at scale, and now focus on LLM operations and agentic systems. I've worked across healthcare, gaming, enterprise tools, and scientific research, wherever there's hard technical problems worth solving.
                </p>
                <p>
                  M.Eng. in Electrical and Computer Engineering from Aristotle University of Thessaloniki. Based remotely, working with teams worldwide.
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

          {/* What drives me */}
          <AnimateIn delay={200}>
            <div className="glass-card p-6 lg:p-8 h-full">
              <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                What drives me
              </h4>
              <ul className="space-y-4">
                {whatDrivesMe.map((item) => (
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