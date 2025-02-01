<script>
	import { onMount } from 'svelte';

	let name = '';
	let email = '';
	let message = '';
	let responseMessage = '';
	let turnstileToken = '';
	let isSubmitting = false;

	let widgetId = null;

	// Explicitly render the Turnstile widget
	onMount(() => {
		const container = document.getElementById('turnstile-widget');
		if (container) {
			widgetId = window.turnstile.render(container, {
				sitekey: '0x4AAAAAAA2KSyZlk7120yhk', // Replace with your actual sitekey
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
			});
		}
	});

	async function submitForm() {
		isSubmitting = true;
		try {
			if (!turnstileToken) {
				throw new Error(
					'Turnstile token is empty or not set. Ensure you have interacted with the widget.'
				);
			}

			// Submit form data along with the Turnstile token
			const response = await fetch('https://email-worker.datable-as.workers.dev/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message, turnstileToken }),
			});

			const data = await response.json();
			if (response.ok) {
				responseMessage = 'Your message has been sent successfully!';
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

<section id="contact" class="py-16 px-6 text-center section-alt">
	<h2 class="text-2xl font-bold mb-4 heading">Get in Touch</h2>
	<p class="text-body max-w-xl mx-auto mb-10">
		Ready to harness the power of AI and ML? Let's discuss your vision
		and how AS DATABLE LTD can help make it a reality.
	</p>
	<form on:submit|preventDefault={submitForm} class="max-w-md mx-auto flex flex-col space-y-4">
		<input
			class="border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-700 
			       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
			type="text"
			placeholder="Name"
			bind:value={name}
			required
		/>
		<input
			class="border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-700 
			       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
			type="email"
			placeholder="Email"
			bind:value={email}
			required
		/>
		<textarea
			class="border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-700 
			       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
			placeholder="Message"
			bind:value={message}
			rows="5"
			required>
		</textarea>

		<!-- Explicit Turnstile Widget -->
		<div id="turnstile-widget" class="mx-auto"></div>

		<button
			type="submit"
			class="btn-primary"
			disabled={isSubmitting}>
			{isSubmitting ? 'Sending...' : 'Submit'}
		</button>
		{#if responseMessage}
			<p class="text-center text-sm subheading mt-4">{responseMessage}</p>
		{/if}
	</form>
</section>
