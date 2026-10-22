<script>
	import Breadcrumbs from '../../../lib/components/docs/Breadcrumbs.svelte';
	import DocsPager from '../../../lib/components/docs/DocsPager.svelte';
	import DocsToc from '../../../lib/components/docs/DocsToc.svelte';
	import { getDocComponent } from '../../../lib/content/docs.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} | Froststrap Docs</title>
	{#if data.description}
		<meta name="description" content={data.description} />
	{/if}
	<meta property="og:title" content={`${data.title} | Froststrap Docs`} />
	{#if data.description}
		<meta property="og:description" content={data.description} />
	{/if}
	<meta property="og:type" content="article" />
	<meta property="og:image" content="/social-card.png" />
</svelte:head>

{#if data.kind === 'doc'}
	{@const Doc = getDocComponent(data.file)}

	<div class="xl:grid xl:grid-cols-[minmax(0,1fr)_12rem] xl:items-start xl:gap-12">
		<article class="max-w-[52rem] min-w-0">
			<Breadcrumbs items={data.breadcrumbs} />

			{#if data.toc.length > 0}
				<details class="mt-5 rounded-md border border-border bg-surface px-4 py-3 xl:hidden">
					<summary class="cursor-pointer text-small font-semibold text-foreground">
						On this page
					</summary>
					<div class="mt-3">
						<DocsToc items={data.toc} />
					</div>
				</details>
			{/if}

			<div class="docs-prose mt-7">
				{#if Doc}
					<Doc />
				{:else}
					<p>This document could not be loaded.</p>
				{/if}
			</div>

			<a
				class="mt-10 inline-flex items-center gap-2 text-small font-medium text-muted-foreground transition-colors hover:text-accent"
				href={data.editUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				Edit this page on GitHub
				<span aria-hidden="true">↗</span>
			</a>

			<DocsPager prev={data.prev} next={data.next} />
		</article>

		<aside
			class="sticky top-[4.5625rem] hidden max-h-[calc(100dvh-4.5625rem)] overflow-y-auto py-6 select-none xl:block"
		>
			<DocsToc items={data.toc} />
		</aside>
	</div>
{:else}
	<div class="max-w-[52rem]">
		<Breadcrumbs items={data.breadcrumbs} />

		<h1 class="mt-6 text-[2.25rem] leading-[1.15] font-semibold tracking-[-0.04em] text-foreground">
			{data.title}
		</h1>

		{#if data.description}
			<p class="mt-3 text-body text-muted-foreground">{data.description}</p>
		{/if}

		<div class="mt-8 grid gap-3">
			{#each data.items as item (item.href)}
				<a
					class="group flex flex-col gap-1 rounded-md border border-border bg-surface px-5 py-4 transition-colors hover:border-accent/60 hover:bg-surface-muted"
					href={item.href}
				>
					<span
						class="flex items-center gap-2 text-small font-semibold text-foreground group-hover:text-accent"
					>
						{item.title}
						{#if item.kind === 'category'}
							<span
								class="rounded-sm bg-surface-muted px-1.5 py-0.5 text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase"
							>
								Section
							</span>
						{/if}
					</span>
					{#if item.description}
						<span class="text-small text-muted-foreground">{item.description}</span>
					{/if}
				</a>
			{/each}
		</div>
	</div>
{/if}
