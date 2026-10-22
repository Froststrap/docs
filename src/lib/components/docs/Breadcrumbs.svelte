<script>
	let { items } = $props();
</script>

<nav aria-label="Breadcrumb" class="text-small">
	<ol class="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-muted-foreground">
		{#each items as item, index (item.label)}
			{#if index > 0}
				<li aria-hidden="true" class="text-border">/</li>
			{/if}
			<li>
				{#if item.href && index < items.length - 1}
					<a class="transition-colors hover:text-foreground" href={item.href}>{item.label}</a>
				{:else}
					<span class={index === items.length - 1 ? 'text-foreground' : ''}>{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
