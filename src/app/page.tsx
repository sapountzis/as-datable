import dynamic from "next/dynamic";
import Layout from "@/components/layout/Layout";
import ProblemSpaces from "@/components/home/ProblemSpaces";
import WorkPreview from "@/components/home/WorkPreview";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import HomeEffects from "@/components/home/HomeEffects";

const Hero = dynamic(() => import("@/components/home/Hero"), {
	loading: () => <div className="min-h-screen bg-transparent" />,
});

export default function Home() {
	return (
		<Layout>
			<HomeEffects />
			<Hero />
			<ProblemSpaces />
			<WorkPreview />
			<About />
			<Contact />
		</Layout>
	);
}
