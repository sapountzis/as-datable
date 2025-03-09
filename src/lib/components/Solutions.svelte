<!-- src/lib/components/Projects.svelte -->
<script>
	import { onMount } from 'svelte';
	import Card from './Card.svelte';

	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<section id="solutions" class="py-24 px-6 text-center section relative">
	<div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-20"></div>
	
	<div class="relative">
		<div class="max-w-2xl mx-auto mb-16" class:animate-slide-up={visible}>
			<h2 class="text-4xl font-bold mb-4 heading">Solutions & Impact</h2>
			<p class="text-xl subheading">Transforming Businesses Through AI Innovation</p>
		</div>

		<div class="max-w-6xl mx-auto grid gap-8 md:grid-cols-1 lg:grid-cols-3">
			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M13 10V3L4 14h7v7l9-11h-7z'></path>"
				title="AI-Powered Business Automation"
				subtitle="Operational Excellence"
				content="Transform your operations with custom AI solutions that automate complex workflows, reduce costs, and increase efficiency. Achieve up to 70% reduction in manual processing time."
				animationDelay="100ms"
				{visible}
			/>

			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'></path>"
				title="Intelligent Customer Engagement"
				subtitle="Revenue Growth"
				content="Deploy smart AI systems that understand and respond to your customers, enhance satisfaction, and drive sales. Our solutions typically boost conversion rates by 35%."
				animationDelay="200ms"
				{visible}
			/>

			<Card
				svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>"
				title="Data-Driven Decision Making"
				subtitle="Strategic Insights"
				content="Harness the power of your data with custom analytics and ML models that provide actionable insights and predictive capabilities for informed decision-making."
				animationDelay="300ms"
				{visible}
			/>
		</div>
	</div>
</section>