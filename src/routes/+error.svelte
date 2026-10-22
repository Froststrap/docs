<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} | Froststrap Docs</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto flex w-full max-w-[1440px] flex-1 items-center px-8 py-20 sm:px-12">
	<div class="max-w-[36rem]">
		<p class="m-0 text-small font-semibold tracking-[0.08em] text-accent uppercase">
			Error {page.status}
		</p>
		<h1 class="mt-3 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.045em] text-foreground">
			{page.status === 404 ? 'Page not found' : 'Something went wrong'}
		</h1>
		<p class="mt-4 text-body text-muted-foreground">
			{page.error?.message ?? 'The page you were looking for is not here.'}
		</p>
		<a
			class="mt-8 inline-flex min-h-12 items-center justify-center rounded-md border border-primary bg-primary px-6 py-3 text-small font-semibold text-primary-foreground transition-colors hover:border-primary-hover hover:bg-primary-hover"
			href="/docs/welcome"
		>
			Back to the docs
		</a>
	</div>
</main>
