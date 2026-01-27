import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import ProblemSpaces from "@/components/home/ProblemSpaces";
import WorkPreview from "@/components/home/WorkPreview";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import HomeEffects from "@/components/home/HomeEffects";

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
