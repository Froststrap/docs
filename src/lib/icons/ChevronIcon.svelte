<script lang="ts">
	let {
		class: className = 'size-4',
		direction = 'down'
	}: { class?: string; direction?: 'down' | 'right' } = $props();
</script>

<svg
	class={className}
	class:rotate-0={direction === 'down'}
	class:-rotate-90={direction === 'right'}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d="m6 9 6 6 6-6" />
</svg>
