<script>
	import { onMount } from 'svelte';

	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<section class="min-h-[90vh] flex items-center justify-center section-alt relative overflow-hidden">
	<div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-30"></div>
	
	<div class="max-w-4xl px-6 py-20 text-center relative">
		<div class="space-y-6" class:animate-slide-up={visible}>
				<h1 class="text-5xl md:text-6xl font-bold heading leading-tight">
						<span class="text-gradient">Get your AI&nbsp;/ LLM stack<br />production‑ready in 10 days</span>
				</h1>

				<p class="text-xl subheading max-w-2xl mx-auto">
						I stabilise, scale and harden ML & LLM systems for teams like Mentalyc, Einbliq,
						AIREV and the EU Commission &mdash; fully remote.
				</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
				<a href="#contact" class="btn-primary group">
					Schedule a Consultation
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
					</svg>
				</a>
				<a href="#services" class="btn-primary bg-white/10 hover:bg-white/20 text-gray-800 dark:text-white">
					Explore Services
				</a>
			</div>
		</div>

		<!-- Decorative Elements -->
		<div class="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
		<div class="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"></div>
	</div>
</section>
