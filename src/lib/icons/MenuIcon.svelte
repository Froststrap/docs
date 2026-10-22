<script lang="ts">
	let { open = false, class: className = 'size-5' }: { open?: boolean; class?: string } = $props();
</script>

<svg
	class={className}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if open}
		<path d="M6 6l12 12M18 6 6 18" />
	{:else}
		<path d="M4 6h16M4 12h16M4 18h16" />
	{/if}
</svg>
