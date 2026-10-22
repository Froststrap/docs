<script lang="ts">
	import type { PageLink } from '../../content/types';

	interface Props {
		prev: PageLink | null;
		next: PageLink | null;
	}

	let { prev, next }: Props = $props();
</script>

{#if prev || next}
	<nav
		aria-label="Documentation pagination"
		class="mt-12 grid gap-3 pt-8 select-none sm:grid-cols-2"
	>
		{#if prev}
			<a
				class="group flex flex-col gap-1 rounded-md border border-border px-4 py-3 transition-colors hover:border-accent/60 hover:bg-surface-muted"
				href={prev.href}
			>
				<span
					class="text-[0.75rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase"
				>
					Previous
				</span>
				<span class="text-small font-semibold text-foreground group-hover:text-accent">
					{prev.title}
				</span>
			</a>
		{:else}
			<span></span>
		{/if}

		{#if next}
			<a
				class="group flex flex-col gap-1 rounded-md border border-border px-4 py-3 text-right transition-colors hover:border-accent/60 hover:bg-surface-muted sm:col-start-2"
				href={next.href}
			>
				<span
					class="text-[0.75rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase"
				>
					Next
				</span>
				<span class="text-small font-semibold text-foreground group-hover:text-accent">
					{next.title}
				</span>
			</a>
		{/if}
	</nav>
{/if}
