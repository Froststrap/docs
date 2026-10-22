<script>
	import { getBlogPosts, getBlogTags } from '../../lib/content/blog.svelte';

	const posts = getBlogPosts();
	const tags = getBlogTags();
</script>

<svelte:head>
	<title>Blog | Froststrap Docs</title>
	<meta name="description" content="News and updates from the Froststrap project." />
	<meta property="og:title" content="Blog | Froststrap Docs" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/social-card.png" />
</svelte:head>

<main class="mx-auto w-full max-w-[1440px] flex-1 px-8 pt-10 pb-16 sm:px-12">
	<div class="max-w-[52rem]">
		<header>
			<p class="m-0 text-small font-semibold tracking-[0.08em] text-accent uppercase">Blog</p>
			<h1
				class="mt-2 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.045em] text-foreground"
			>
				News and updates
			</h1>
			<p class="mt-3 text-body text-muted-foreground">
				Release notes, development updates, and announcements from Froststrap.
			</p>
		</header>

		{#if posts.length === 0}
			<p class="mt-10 text-body text-muted-foreground">No posts yet. Check back soon.</p>
		{:else}
			<div class="mt-10 flex flex-col gap-4">
				{#each posts as post (post.slug)}
					<article
						class="rounded-lg border border-border bg-surface px-5 py-5 transition-colors hover:border-accent/50 sm:px-6 sm:py-6"
					>
						<div
							class="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted-foreground"
						>
							<time datetime={post.date}>{post.dateLabel}</time>
							<span aria-hidden="true">·</span>
							<span>{post.readingTime} min read</span>
						</div>

						<h2 class="mt-2 text-[1.5rem] leading-tight font-semibold tracking-[-0.025em]">
							<a class="text-foreground transition-colors hover:text-accent" href={post.href}>
								{post.title}
							</a>
						</h2>

						{#if post.description}
							<p class="mt-2 text-body text-muted-foreground">{post.description}</p>
						{/if}

						{#if post.authors.length > 0 || post.tags.length > 0}
							<div class="mt-4 flex flex-wrap items-center gap-3">
								{#each post.authors as author (author.id)}
									<span class="text-small text-muted-foreground">{author.name}</span>
								{/each}
								{#each post.tags as tag (tag.id)}
									<a
										class="rounded-full border border-border px-2.5 py-0.5 text-[0.75rem] font-medium text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
										href="/blog/tags/{tag.id}"
									>
										{tag.label}
									</a>
								{/each}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{/if}

		{#if tags.length > 0}
			<div class="mt-10 border-t border-border pt-6">
				<a
					class="text-small font-medium text-muted-foreground transition-colors hover:text-accent"
					href="/blog/tags"
				>
					Browse all tags →
				</a>
			</div>
		{/if}
	</div>
</main>
