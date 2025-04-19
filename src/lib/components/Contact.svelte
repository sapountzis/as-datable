<!-- src/lib/components/Contact.svelte -->
<script>
	let visible = true;
</script>

<section id="contact" class="py-28 px-6 section relative">
	<!-- subtle grid background -->
	<div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-20"></div>

	<div class="relative max-w-3xl mx-auto text-center"
			 class:animate-slide-up={visible}>
		<!-- Headline -->
		<h2 class="text-4xl sm:text-5xl font-bold heading mb-5">
			Ready to get your LLM stack production‑ready?
		</h2>

		<!-- Supporting copy -->
		<p class="text-lg sm:text-xl text-body mb-10">
			I’ll audit, stabilise and ship improvements to your LLM stack in just 10 days – 100% remote.
		</p>

		<!-- Calendly button -->
		<a  href="https://calendly.com/datable-as/llm-stack-sprint-intro-call"
				target="_blank" rel="noopener noreferrer"
				class="btn-primary inline-flex px-8 py-4 text-lg tracking-wide">
			Book a 15‑minute diagnostic call
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2"
					 fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M13 7l5 5m0 0l-5 5m5-5H6"/>
			</svg>
		</a>
	</div>
</section>
