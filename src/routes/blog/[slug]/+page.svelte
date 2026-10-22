<script>
	import DocsPager from '../../../lib/components/docs/DocsPager.svelte';
	import DocsToc from '../../../lib/components/docs/DocsToc.svelte';
	import { getBlogComponent } from '../../../lib/content/blog.svelte';

	let { data } = $props();
	const Post = $derived(getBlogComponent(data.file));
</script>

<svelte:head>
	<title>{data.title} | Froststrap Blog</title>
	<meta name="description" content={data.description} />
	<meta property="og:title" content={`${data.title} | Froststrap Blog`} />
	<meta property="og:description" content={data.description} />
	<meta property="og:type" content="article" />
	<meta property="og:image" content="/social-card.png" />
</svelte:head>

<main class="mx-auto w-full max-w-[1440px] flex-1 px-8 pt-8 pb-16 sm:px-12 sm:pt-10">
	<div class="xl:grid xl:grid-cols-[minmax(0,1fr)_12rem] xl:items-start xl:gap-12">
		<div class="max-w-[52rem] min-w-0">
			<nav aria-label="Breadcrumb" class="text-small">
				<ol class="m-0 flex list-none items-center gap-2 p-0 text-muted-foreground">
					<li><a class="transition-colors hover:text-foreground" href="/blog">Blog</a></li>
					<li aria-hidden="true" class="text-border">/</li>
					<li class="text-foreground">{data.title}</li>
				</ol>
			</nav>

			<header class="mt-6 border-b border-border pb-8">
				<h1
					class="text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.04em] text-foreground sm:text-[2.75rem]"
				>
					{data.title}
				</h1>

				<div
					class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-muted-foreground"
				>
					<time datetime={data.date}>{data.dateLabel}</time>
					<span aria-hidden="true">·</span>
					<span>{data.readingTime} min read</span>
				</div>

				{#if data.authors.length > 0}
					<div class="mt-5 flex flex-wrap gap-4">
						{#each data.authors as author (author.id)}
							<div class="flex items-center gap-2.5">
								{#if author.imageUrl}
									<img
										class="size-8 rounded-full border border-border"
										src={author.imageUrl}
										alt=""
										width="32"
										height="32"
										loading="lazy"
									/>
								{/if}
								<div class="text-small">
									{#if author.url}
										<a
											class="font-medium text-foreground transition-colors hover:text-accent"
											href={author.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											{author.name}
										</a>
									{:else}
										<span class="font-medium text-foreground">{author.name}</span>
									{/if}
									{#if author.title}
										<span class="block text-muted-foreground">{author.title}</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</header>

			{#if data.toc.length > 0}
				<details class="mt-6 rounded-md border border-border bg-surface px-4 py-3 xl:hidden">
					<summary class="cursor-pointer text-small font-semibold text-foreground">
						On this page
					</summary>
					<div class="mt-3">
						<DocsToc items={data.toc} />
					</div>
				</details>
			{/if}

			<div class="docs-prose mt-8">
				{#if Post}
					<Post />
				{:else}
					<p>This post could not be loaded.</p>
				{/if}
			</div>

			{#if data.tags.length > 0}
				<div class="mt-8 flex flex-wrap items-center gap-2">
					<span class="text-small text-muted-foreground">Tags:</span>
					{#each data.tags as tag (tag.id)}
						<a
							class="rounded-full border border-border px-2.5 py-0.5 text-[0.75rem] font-medium text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
							href="/blog/tags/{tag.id}"
						>
							{tag.label}
						</a>
					{/each}
				</div>
			{/if}

			<a
				class="mt-10 inline-flex items-center gap-2 text-small font-medium text-muted-foreground transition-colors hover:text-accent"
				href={data.editUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				Edit this post on GitHub
				<span aria-hidden="true">↗</span>
			</a>

			<DocsPager prev={data.prev} next={data.next} />
		</div>

		<aside
			class="sticky top-[4.5625rem] hidden max-h-[calc(100dvh-4.5625rem)] overflow-y-auto py-6 xl:block"
		>
			<DocsToc items={data.toc} />
		</aside>
	</div>
</main>
