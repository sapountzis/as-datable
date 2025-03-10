<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
  
    const companies = [
      { name: 'Einbliq.io', logo: '/logos/einbliq.webp', logoDark: '/logos/einbliq-dark.webp', url: 'https://einbliq.io' },
      { name: 'Yumio', logo: '/logos/yumio.webp', logoDark: '/logos/yumio.webp', url: 'https://youmio.ai' },
      { name: 'AIREV', logo: '/logos/airev.webp', logoDark: '/logos/airev.webp', url: 'https://airev.us' },
      { name: 'Mentalyc', logo: '/logos/mentalyc.webp', logoDark: '/logos/mentalyc.webp', url: 'https://mentalyc.com' },
      { name: 'European Commission', logo: '/logos/ec.webp', logoDark: '/logos/ec.webp', url: 'https://commission.europa.eu' }
    ];
    
    let visible = false;
    onMount(() => {
        visible = true;
    });
  </script>
  
<section class="py-24 px-6 section-alt relative">
    <!-- Background grid, optional -->
    <div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-20"></div>
  
    <div class="relative">
      {#if visible}
        <!-- Heading -->
        <div class="max-w-2xl mx-auto mb-16 text-center"
             in:fly={{ y: 20, duration: 500, delay: 0 }}>
          <h2 class="text-4xl font-bold mb-4 heading">Trusted By</h2>
          <p class="text-xl subheading">Delivering AI Excellence Across Industries</p>
        </div>
  
        <div 
          class="flex flex-wrap gap-12 justify-center mx-auto max-w-[1600px]" 
          in:fly={{ y: 20, duration: 500, delay: 100 }}
        >
          {#each companies as { name, logo, logoDark, url }}
            <div 
              class="card group relative 
                     flex-none               /* prevents shrinking/growing */
                     w-64 h-32              /* fixed width & height */
                     border border-gray-200 dark:border-gray-700 
                     py-4 px-4 
                     flex items-center justify-center"
            >
              <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur 
                          opacity-20 group-hover:opacity-40 transition duration-1000">
              </div>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="relative h-full w-full flex items-center justify-center"
              >
                <img
                  src={logo} 
                  alt={`${name} logo`}
                  loading="lazy"
                  class="max-h-full w-auto object-contain block dark:hidden"
                />
                <img
                  src={logoDark} 
                  alt={`${name} logo`}
                  loading="lazy"
                  class="max-h-full w-auto object-contain hidden dark:block"
                />
              </a>
            </div>
          {/each}
        </div>
      {/if}
    </div>
</section>
  