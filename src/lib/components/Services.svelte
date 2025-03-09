<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import Card from './Card.svelte';
    
    let visible = false;
    onMount(() => {
        visible = true;
    });
</script>

<section id="services" class="py-24 px-6 text-center section relative">
	<div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-20"></div>
	
	<div class="relative">
        {#if visible}
            <div class="max-w-2xl mx-auto mb-16" in:fly={{ y: 20, duration: 500, delay: 100 }}>
                <h2 class="text-4xl font-bold mb-4 heading">Our Expertise</h2>
                <p class="text-xl subheading">Tailored AI Solutions for Every Challenge</p>
            </div>
			<div class="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4" in:fly={{ y: 20, duration: 500, delay: 300 }}>
				<Card
					svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>"
					title="AI & NLP Integration"
					content="Build intelligent conversational interfaces, text classification engines, and language models tailored to your domain."
					animationDelay="100ms"
					{visible}
				/>

				<Card
					svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'></path>"
					title="Machine Learning & Analytics"
					content="Leverage advanced ML models to predict trends, detect anomalies, and optimize decision-making processes."
					animationDelay="200ms"
					{visible}
				/>

				<Card
					svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'></path>"
					title="Data Engineering & MLOps"
					content="Design robust data pipelines, vector databases, and scalable LLM inference systems, ensuring smooth production deployments."
					animationDelay="300ms"
					{visible}
				/>

				<Card
					svg="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'></path>"
					title="Custom LLM Solutions"
					content="Integrate and fine-tune leading LLMs (e.g., GPT-4, Llama-Index) for seamless user experiences and data-driven insights."
					animationDelay="400ms"
					{visible}
				/>
			</div>
		{/if}
	</div>
</section>
