<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Tags | Froststrap Blog</title>
	<meta name="description" content="Browse posts by tag on the Froststrap blog." />
</svelte:head>

<main class="mx-auto w-full max-w-[1440px] flex-1 px-8 pt-10 pb-16 sm:px-12">
	<div class="max-w-[52rem]">
		<nav aria-label="Breadcrumb" class="text-small">
			<ol class="m-0 flex list-none items-center gap-2 p-0 text-muted-foreground">
				<li><a class="transition-colors hover:text-foreground" href="/blog">Blog</a></li>
				<li aria-hidden="true" class="text-border">/</li>
				<li class="text-foreground">Tags</li>
			</ol>
		</nav>

		<h1 class="mt-6 text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.04em] text-foreground">
			Tags
		</h1>

		{#if data.tags.length === 0}
			<p class="mt-4 text-body text-muted-foreground">No tags yet.</p>
		{:else}
			<div class="mt-8 flex flex-wrap gap-2">
				{#each data.tags as tag (tag.id)}
					<a
						class="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-small font-medium text-foreground transition-colors hover:border-accent/60 hover:text-accent"
						href="/blog/tags/{tag.id}"
					>
						{tag.label}
						<span class="text-muted-foreground">{tag.count}</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</main>
