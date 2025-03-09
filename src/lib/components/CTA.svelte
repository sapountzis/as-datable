<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    
    let visible = false;
    onMount(() => {
        visible = true;
    });
</script>

<section class="py-24 px-6 section relative">
    <div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-20"></div>
    
    {#if visible}
        <div class="relative max-w-3xl mx-auto" in:fly={{ y: 20, duration: 500, delay: 0 }}>
            <div class="card group relative border border-gray-200 dark:border-gray-700">
                <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div class="relative p-8 text-center">
                    <h3 class="text-3xl font-bold mb-4 heading">Ready to Transform Your Business?</h3>
                    <p class="text-body mb-8 text-lg">
                        Get a free consultation and discover how AI can drive growth for your company.
                        We'll analyze your needs and propose a tailored solution.
                    </p>
                    <a href="#contact" class="btn-primary">
                        Schedule Consultation
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    {/if}
</section>