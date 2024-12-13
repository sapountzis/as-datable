<script>
	let name = '';
	let email = '';
	let message = '';
	let responseMessage = '';
	let isSubmitting = false;

	async function submitForm() {
		isSubmitting = true;
		try {
			const response = await fetch('https://email-worker.datable-as.workers.dev/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message }),
			});

			const data = await response.json();
			if (response.ok) {
				responseMessage = 'Your message has been sent successfully!';
			} else {
				responseMessage = `Error: ${data.error}`;
			}
		} catch (error) {
			responseMessage = 'An error occurred. Please try again later.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

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
