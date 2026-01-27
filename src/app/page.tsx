import ProblemSpaces from "@/components/home/ProblemSpaces";
import WorkPreview from "@/components/home/WorkPreview";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import HomeEffects from "@/components/home/HomeEffects";
import Hero from "@/components/home/Hero";

export default function Home() {
	return (
		<>
			<HomeEffects />
			<Hero />
			<ProblemSpaces />
			<WorkPreview />
			<About />
			<Contact />
		</>
	);
}
