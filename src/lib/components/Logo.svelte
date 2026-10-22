<script lang="ts">
	let {
		class: className = '',
		width = 144,
		height = 144
	}: { class?: string; width?: number; height?: number } = $props();
</script>

<img
	class="block select-none {className}"
	src="/favicon.ico"
	alt=""
	{width}
	{height}
	draggable="false"
/>
