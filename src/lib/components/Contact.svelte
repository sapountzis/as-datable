<script>
	import { onMount } from 'svelte';

	let name = '';
	let email = '';
	let message = '';
	let responseMessage = '';
	let isSubmitting = false;

	onMount(() => {
		// Dynamically load Turnstile script
		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		script.async = true;
		script.defer = true;

		// Add event listener to check when Turnstile is loaded
		script.onload = () => {
			console.log('Turnstile script loaded');
		};

		document.head.appendChild(script);
	});

	async function submitForm() {
		isSubmitting = true;
		try {
			// Ensure the Turnstile widget exists
			const turnstileElement = document.querySelector('.cf-turnstile');
			if (!turnstileElement) {
				throw new Error('Turnstile widget not found');
			}

			// Retrieve the Turnstile token
			const turnstileToken = turnstileElement.getAttribute('data-response');
			if (!turnstileToken) {
				throw new Error('Failed to retrieve Turnstile token');
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
