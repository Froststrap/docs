<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>#{data.tag.label} | Froststrap Blog</title>
	<meta
		name="description"
		content={data.tag.description ?? `Posts tagged with ${data.tag.label} on the Froststrap blog.`}
	/>
</svelte:head>

<main class="mx-auto w-full max-w-[1440px] flex-1 px-8 pt-10 pb-16 sm:px-12">
	<div class="max-w-[52rem]">
		<nav aria-label="Breadcrumb" class="text-small">
			<ol class="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-muted-foreground">
				<li><a class="transition-colors hover:text-foreground" href="/blog">Blog</a></li>
				<li aria-hidden="true" class="text-border">/</li>
				<li><a class="transition-colors hover:text-foreground" href="/blog/tags">Tags</a></li>
				<li aria-hidden="true" class="text-border">/</li>
				<li class="text-foreground">{data.tag.label}</li>
			</ol>
		</nav>

		<h1 class="mt-6 text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.04em] text-foreground">
			{data.tag.label}
		</h1>

		{#if data.tag.description}
			<p class="mt-3 text-body text-muted-foreground">{data.tag.description}</p>
		{/if}

		{#if data.posts.length === 0}
			<p class="mt-8 text-body text-muted-foreground">No posts with this tag.</p>
		{:else}
			<div class="mt-8 flex flex-col gap-3">
				{#each data.posts as post (post.slug)}
					<a
						class="rounded-md border border-border bg-surface px-5 py-4 transition-colors hover:border-accent/60 hover:bg-surface-muted"
						href={post.href}
					>
						<span
							class="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted-foreground"
						>
							<time datetime={post.date}>{post.dateLabel}</time>
							<span aria-hidden="true">·</span>
							<span>{post.readingTime} min read</span>
						</span>
						<span class="mt-1 block text-[1.25rem] font-semibold text-foreground">{post.title}</span
						>
						{#if post.description}
							<span class="mt-1 block text-small text-muted-foreground">{post.description}</span>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</main>
