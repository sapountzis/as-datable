<script>
	import { onMount } from 'svelte';
	import Card from './Card.svelte';

	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<section id="projects" class="py-24 px-6 text-center section relative">
	<div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-20"></div>
	
	<div class="relative">
		<div class="max-w-2xl mx-auto mb-16" class:animate-slide-up={visible}>
			<h2 class="text-4xl font-bold mb-4 heading">Real-World Impact</h2>
			<p class="text-xl subheading">Driving Innovation Across Industries</p>
		</div>

		<div class="max-w-6xl mx-auto grid gap-8 md:grid-cols-1 lg:grid-cols-3">
			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>"
				title="Environmental Impact Modeling"
				subtitle="Streaming Platform"
				content="Developed ML models to assess environmental impact at scale, providing critical insights for global streaming infrastructure efficiency."
				animationDelay="100ms"
				{visible}
			/>

			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>"
				title="Intelligent NPC Integration"
				subtitle="Gaming Industry"
				content="Implemented LLM-based NPCs delivering natural, emotionally rich player interactions, enhancing user engagement."
				animationDelay="200ms"
				{visible}
			/>

			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'></path>"
				title="Enterprise Lead Scoring"
				subtitle="SaaS Sector"
				content="Created advanced NLP-powered lead scoring solutions that boosted sales team efficiency and improved conversion rates."
				animationDelay="300ms"
				{visible}
			/>
		</div>
	</div>
</section>
