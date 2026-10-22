<script>
	let { class: className = '', width = 144, height = 144 } = $props();
</script>

<img
	class="block select-none {className}"
	src="/favicon.ico"
	alt=""
	{width}
	{height}
	draggable="false"
/>
