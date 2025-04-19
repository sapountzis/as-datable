<script>
	import { onMount } from 'svelte';

	let scrollProgress = 0;
	let headerVisible = true;
	let lastScrollY = 0;
	let isMobileMenuOpen = false;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
		document.body.style.overflow = '';
	}

	onMount(() => {
		const updateScroll = () => {
			const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
			const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			scrollProgress = (winScroll / height) * 100;

			// Hide header on scroll down, show on scroll up
			const currentScrollY = window.scrollY;
			headerVisible = currentScrollY <= lastScrollY || currentScrollY < 100;
			lastScrollY = currentScrollY;
		};

		window.addEventListener('scroll', updateScroll);
		return () => window.removeEventListener('scroll', updateScroll);
	});
</script>

<header
	class="fixed w-full top-0 z-50 transition-transform duration-300"
	style="transform: translateY({headerVisible ? '0' : '-100%'})"
>
	<div class="glass dark:glass-dark backdrop-blur-md shadow-lg relative">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-4">
				<div class="text-2xl font-bold heading">
					<a href="/"><span class="text-gradient">AS DATABLE</span></a>
				</div>
				
				<nav class="hidden sm:flex items-center space-x-8">
					<a 
						class="text-body hover:text-primary-500 dark:hover:text-primary-400 
							   transition-colors duration-300 font-medium" 
						href="#services"
					>
						Services
					</a>
					<a
						class="text-body hover:text-primary-500 dark:hover:text-primary-400
				 transition-colors duration-300 font-medium"
						href="https://www.notion.so/LLM-Stack-Diagnostic-Sprint-1be4e72a76e7808ca8ced73e87c0b211"
						target="_blank" rel="noopener noreferrer"
					>
						Sprint&nbsp;Details
					</a>
					<a 
						class="text-body hover:text-primary-500 dark:hover:text-primary-400 
							   transition-colors duration-300 font-medium" 
						href="#approach"
					>
						Approach
					</a>
					<a 
						class="text-body hover:text-primary-500 dark:hover:text-primary-400 
							   transition-colors duration-300 font-medium" 
						href="#solutions"
					>
						Solutions
					</a>
					<a 
						class="btn-primary py-2" 
						href="#contact"
					>
						Contact Us
					</a>
				</nav>

				<!-- Mobile menu button -->
				<button 
					class="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					on:click={toggleMobileMenu}
					aria-label="Toggle mobile menu"
				>
					{#if isMobileMenuOpen}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if isMobileMenuOpen}
		<div class="absolute inset-x-0 top-full z-40 transform transition-transform duration-300">
			<div class="glass dark:glass-dark backdrop-blur-md shadow-lg">
				<nav class="flex flex-col items-center justify-center py-8 space-y-8 text-lg">
				<a 
					class="text-body hover:text-primary-500 dark:hover:text-primary-400 
						   transition-colors duration-300 font-medium" 
					href="#services"
					on:click={closeMobileMenu}
				>
					Services
				</a>
				<a
						class="text-body hover:text-primary-500 dark:hover:text-primary-400
				 transition-colors duration-300 font-medium"
						href="https://www.notion.so/LLM-Stack-Diagnostic-Sprint-1be4e72a76e7808ca8ced73e87c0b211"
						target="_blank" rel="noopener noreferrer"
						on:click={closeMobileMenu}
				>
						Sprint Details
				</a>
				<a 
					class="text-body hover:text-primary-500 dark:hover:text-primary-400 
						   transition-colors duration-300 font-medium" 
					href="#approach"
					on:click={closeMobileMenu}
				>
					Approach
				</a>
				<a 
					class="text-body hover:text-primary-500 dark:hover:text-primary-400 
						   transition-colors duration-300 font-medium" 
					href="#solutions"
					on:click={closeMobileMenu}
				>
					Solutions
				</a>
				<a 
					class="btn-primary" 
					href="#contact"
					on:click={closeMobileMenu}
				>
					Contact Us
				</a>
				</nav>
			</div>
		</div>
	{/if}

	<!-- Scroll Progress Indicator -->
	<div 
		class="scroll-indicator"
		style="width: {scrollProgress}%"
	></div>
</header>

<!-- Add spacing to prevent content from hiding under fixed header -->
<div class="h-20"></div>
