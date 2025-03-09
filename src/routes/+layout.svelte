<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
    import CookieConsent from '$lib/components/CookieConsent.svelte';
	let { children } = $props();
	
	let darkMode = $state(false);
	
	// Initialize dark mode from system preference or localStorage
	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			darkMode = savedTheme === 'dark';
		} else {
			darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		updateTheme();
	});
	
	// Toggle dark mode
	function toggleDarkMode() {
		darkMode = !darkMode;
		updateTheme();
		localStorage.setItem('theme', darkMode ? 'dark' : 'light');
	}
	
	// Update theme class on html element
	function updateTheme() {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<CookieConsent />

<!-- Dark Mode Toggle Button -->
<button
	class="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
	onclick={toggleDarkMode}
	aria-label="Toggle dark mode">
	{#if darkMode}
		<!-- Sun icon -->
		<svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
		</svg>
	{:else}
		<!-- Moon icon -->
		<svg class="w-6 h-6 text-gray-900 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
		</svg>
	{/if}
</button>

<!-- Back to Top Button -->
<button
	class="fixed bottom-20 right-4 z-50 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
	onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
	aria-label="Back to top">
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
	</svg>
</button>

<!-- Main Content -->
<div class="min-h-screen section">
	{@render children()}
</div>
