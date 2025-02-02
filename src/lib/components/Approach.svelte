<script>
	import { onMount } from 'svelte';
	import Card from './Card.svelte';

	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<section id="approach" class="py-24 px-6 text-center section-alt relative">
	<div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-20"></div>
	
	<div class="relative">
		<div class="max-w-3xl mx-auto mb-16" class:animate-slide-up={visible}>
			<h2 class="text-4xl font-bold mb-6 heading">Our Approach</h2>
			<p class="text-xl text-body">
				At AS DATABLE, we believe in a user-centric, results-driven methodology.
				We seamlessly integrate with your team, working closely to understand your
				objectives and deliver tangible, measurable outcomes.
			</p>
		</div>

		<div class="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'></path>"
				title="Strategic Consulting"
				content="We begin by analyzing your current landscape, identifying pain points, and defining clear success criteria."
				animationDelay="100ms"
				{visible}
			/>

			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'></path>"
				title="Data-First Design"
				content="Data drives our decisions. We architect scalable data solutions that capture meaningful insights."
				animationDelay="200ms"
				{visible}
			/>

			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'></path>"
				title="Iterative Development"
				content="We embrace agile methods, iterating rapidly to refine models, performance, and user experience."
				animationDelay="300ms"
				{visible}
			/>

			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'></path>"
				title="Transparent Delivery"
				content="Our explainable AI ensures you understand model behavior, fostering trust and long-term value."
				animationDelay="400ms"
				{visible}
			/>
		</div>
	</div>
</section>
