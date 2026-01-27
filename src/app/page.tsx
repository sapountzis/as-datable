"use client";

import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import ProblemSpaces from "@/components/home/ProblemSpaces";
import WorkPreview from "@/components/home/WorkPreview";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";

export default function Home() {
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
		<Layout>
			<Hero />
			<ProblemSpaces />
			<WorkPreview />
			<About />
			<Contact />
		</Layout>
	);
}
