<script lang="ts">
	const props = $props<{
		svg: string;
		title: string;
		content: string;
		subtitle?: string;
		animationDelay?: string;
		visible?: boolean;
	}>();

	let subtitle = props.subtitle ?? '';
	let animationDelay = props.animationDelay ?? '0ms';
	let visible = props.visible ?? false;
</script>

<div class="card group relative border border-gray-200 dark:border-gray-700" class:animate-scale-in={visible} style="animation-delay: {animationDelay}">
	<div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
	<div class="relative h-full p-6">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4 text-primary-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			{@html props.svg}
		</svg>
		<h3 class="font-semibold text-xl mb-3 heading">{props.title}</h3>
		{#if subtitle}
			<p class="text-lg text-body mb-3">{subtitle}</p>
		{/if}
		<p class="text-body">
			{props.content}
		</p>
	</div>
</div>
