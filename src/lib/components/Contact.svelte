<script>
	import { onMount } from 'svelte';

	let name = '';
	let email = '';
	let message = '';
	let responseMessage = '';
	let turnstileToken = '';
	let isSubmitting = false;
	let visible = false;

	let widgetId = null;

	onMount(() => {
		visible = true;
		const container = document.getElementById('turnstile-widget');
		if (container) {
			widgetId = window.turnstile.render(container, {
				sitekey: '0x4AAAAAAA2KSyZlk7120yhk',
				callback: (token) => {
					turnstileToken = token;
					console.log('Turnstile token generated:', token);
				},
				'error-callback': () => {
					console.error('Turnstile failed to generate a token.');
				},
				'expired-callback': () => {
					console.warn('Turnstile token expired. Resetting widget.');
					turnstileToken = '';
					window.turnstile.reset(widgetId);
				},
				theme: 'light',
			});
		}
	});

	async function submitForm() {
		isSubmitting = true;
		try {
			if (!turnstileToken) {
				throw new Error(
					'Please complete the Turnstile verification before submitting.'
				);
			}

			const response = await fetch('https://email-worker.datable-as.workers.dev/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message, turnstileToken }),
			});

			const data = await response.json();
			if (response.ok) {
				responseMessage = 'Your message has been sent successfully!';
				name = '';
				email = '';
				message = '';
				window.turnstile.reset(widgetId);
			} else {
				responseMessage = `Error: ${data.error}`;
			}
		} catch (error) {
			responseMessage = `An error occurred: ${error.message}`;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class="py-24 px-6 section-alt relative">
	<div class="absolute inset-0 bg-grid dark:bg-grid-dark opacity-20"></div>
	
	<div class="relative max-w-6xl mx-auto">
		<div class="max-w-2xl mx-auto text-center mb-16" class:animate-slide-up={visible}>
			<h2 class="text-4xl font-bold mb-6 heading">Get in Touch</h2>
			<p class="text-xl text-body">
				Ready to harness the power of AI and ML? Let's discuss your vision
				and how AS DATABLE can help make it a reality.
			</p>
		</div>

		<div class="max-w-xl mx-auto">
			<div class="card backdrop-blur-sm" class:animate-scale-in={visible}>
				<form on:submit|preventDefault={submitForm} class="flex flex-col space-y-6">
					<div class="relative">
						<input
							type="text"
							placeholder="Name"
							bind:value={name}
							required
							class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 
								   border border-gray-200 dark:border-gray-700
								   focus:ring-2 focus:ring-primary-500 focus:border-transparent
								   placeholder-gray-500 dark:placeholder-gray-400
								   transition duration-200"
						/>
					</div>

					<div class="relative">
						<input
							type="email"
							placeholder="Email"
							bind:value={email}
							required
							class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 
								   border border-gray-200 dark:border-gray-700
								   focus:ring-2 focus:ring-primary-500 focus:border-transparent
								   placeholder-gray-500 dark:placeholder-gray-400
								   transition duration-200"
						/>
					</div>

					<div class="relative">
						<textarea
							placeholder="Message"
							bind:value={message}
							rows="5"
							required
							class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 
								   border border-gray-200 dark:border-gray-700
								   focus:ring-2 focus:ring-primary-500 focus:border-transparent
								   placeholder-gray-500 dark:placeholder-gray-400
								   transition duration-200 resize-none"
						></textarea>
					</div>

					<div id="turnstile-widget" class="mx-auto"></div>

					<button
						type="submit"
						class="btn-primary w-full group"
						disabled={isSubmitting}
					>
						<span class="relative">
							{#if isSubmitting}
								<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
							{:else}
								Send Message
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
								</svg>
							{/if}
						</span>
					</button>

					{#if responseMessage}
						<div class="text-center p-4 rounded-lg {responseMessage.includes('Error') ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'}">
							{responseMessage}
						</div>
					{/if}
				</form>
			</div>
		</div>
	</div>
</section>
