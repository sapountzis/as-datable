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
	let container = null;


	$: if (container) loadTurnstile();

	function loadTurnstile() {
		if (!container || widgetId !== null) return; // Prevent multiple initializations

		if (!window.turnstile) {
			const script = document.createElement('script');
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
			script.async = true;
			script.defer = true;
			script.onload = initTurnstile;
			document.head.appendChild(script);
		} else {
			initTurnstile();
		}
	}

	function initTurnstile() {
		if (!container || widgetId !== null) return; // Ensure container is set and prevent double rendering

		widgetId = window.turnstile.render(container, {
			sitekey: '0x4AAAAAAA2KSyZlk7120yhk',
			callback: (token) => (turnstileToken = token),
			'error-callback': () => console.error('Turnstile error'),
			'expired-callback': () => {
				turnstileToken = '';
				window.turnstile?.reset(widgetId);
			},
			theme: 'light'
		});
	}

	async function submitForm() {
		if (!turnstileToken) return (responseMessage = 'Please complete Turnstile verification.');
		isSubmitting = true;
		try {
			const res = await fetch('https://email-worker.datable-as.workers.dev/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message, turnstileToken }),
			});

			const data = await res.json();
			if (res.ok) {
				responseMessage = res.ok ? 'Your message has been sent successfully!' : `Error: ${data.error}`;
				if (res.ok) {
					name = email = message = '';
					window.turnstile?.reset(widgetId);
				}
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
		<div class="max-w-xl mx-auto" class:animate-scale-in={visible}>
				<a
						href="https://calendly.com/datable-as/llm-stack-sprint-intro-call"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary w-full text-center justify-center"
				>
					Book a 15‑minute AI Stack diagnostic call
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2"
																			 viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd"
																								 d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
																								 clip-rule="evenodd" />
						</svg>
				</a>
		</div>
	</div>
</section>
