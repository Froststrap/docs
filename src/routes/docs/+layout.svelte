<script>
	import DocsSidebar from '../../lib/components/docs/DocsSidebar.svelte';
	import MenuIcon from '../../lib/icons/MenuIcon.svelte';
	import { getSidebarTree } from '../../lib/content/docs.svelte';

	let { children } = $props();
	let sidebarOpen = $state(false);
	const tree = getSidebarTree();
</script>

<main class="mx-auto w-full max-w-[1440px] px-8 pt-6 pb-16 sm:px-12 sm:pt-10">
	<div class="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
		<aside
			class="sticky top-[4.5625rem] hidden max-h-[calc(100dvh-4.5625rem)] overflow-y-auto py-6 select-none lg:block"
		>
			<DocsSidebar {tree} />
		</aside>

		<div class="min-w-0">
			<div class="mb-5 lg:hidden">
				<button
					type="button"
					class="inline-flex w-full items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3 text-left text-small font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
					aria-expanded={sidebarOpen}
					aria-controls="docs-mobile-nav"
					onclick={() => (sidebarOpen = !sidebarOpen)}
				>
					<span class="inline-flex items-center gap-2.5">
						<MenuIcon open={sidebarOpen} />
						Documentation menu
					</span>
					<span class="text-muted-foreground">{sidebarOpen ? 'Hide' : 'Show'}</span>
				</button>

				{#if sidebarOpen}
					<div
						id="docs-mobile-nav"
						class="mt-2 rounded-md border border-border bg-surface px-4 py-4"
					>
						<DocsSidebar {tree} onNavigate={() => (sidebarOpen = false)} />
					</div>
				{/if}
			</div>

			{@render children()}
		</div>
	</div>
</main>
