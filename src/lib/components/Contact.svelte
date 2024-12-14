<script>
	import { onMount } from 'svelte';

	let name = '';
	let email = '';
	let message = '';
	let responseMessage = '';
	let isSubmitting = false;

	onMount(() => {
		// Check if the Turnstile script is already loaded
		if (!document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
			const script = document.createElement('script');
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		}

		// Ensure Turnstile widget is rendered only once
		const existingWidget = document.querySelector('.cf-turnstile');
		if (existingWidget && !existingWidget.getAttribute('data-rendered')) {
			window.turnstile.render('.cf-turnstile', {
				sitekey: '0x4AAAAAAA2KSyZlk7120yhk',
			});
			existingWidget.setAttribute('data-rendered', 'true');
		}
	});

	async function submitForm() {
		isSubmitting = true;
		try {
			// Get the Turnstile token
			const turnstileElement = document.querySelector('.cf-turnstile');
			if (!turnstileElement) {
				throw new Error('Turnstile widget not found');
			}

			const turnstileToken = turnstileElement.getAttribute('data-response');
			if (!turnstileToken || turnstileToken === '') {
				throw new Error('Turnstile token is empty or not set');
			}

			// Submit form data
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

<section id="contact" class="py-16 px-6 text-center bg-gray-100">
	<h2 class="text-2xl font-bold mb-4">Get in Touch</h2>
	<p class="text-gray-700 max-w-xl mx-auto mb-10">
		Ready to harness the power of AI and ML? Let’s discuss your vision
		and how AS DATABLE LTD can help make it a reality.
	</p>
	<form on:submit|preventDefault={submitForm} class="max-w-md mx-auto flex flex-col space-y-4">
		<input
			class="border border-gray-300 p-3 rounded"
			type="text"
			placeholder="Name"
			bind:value={name}
			required
		/>
		<input
			class="border border-gray-300 p-3 rounded"
			type="email"
			placeholder="Email"
			bind:value={email}
			required
		/>
		<textarea
			class="border border-gray-300 p-3 rounded"
			placeholder="Message"
			bind:value={message}
			rows="5"
			required>
        </textarea>

		<!-- Turnstile Widget -->
		<div class="cf-turnstile" data-sitekey="0x4AAAAAAA2KSyZlk7120yhk"></div>

		<button
			type="submit"
			class="bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
			disabled={isSubmitting}>
			{isSubmitting ? 'Sending...' : 'Submit'}
		</button>
		{#if responseMessage}
			<p class="text-center text-sm text-gray-600 mt-4">{responseMessage}</p>
		{/if}
	</form>
</section>
