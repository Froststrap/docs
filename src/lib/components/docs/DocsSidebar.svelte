<script lang="ts">
	import { page } from '$app/state';
	import type { SidebarNode } from '../../content/types';
	import ChevronIcon from '../../icons/ChevronIcon.svelte';

	interface Props {
		tree: SidebarNode[];
		onNavigate?: () => void;
	}

	let { tree, onNavigate }: Props = $props();
	let collapsed = $state<Record<string, boolean>>({});

	interface Row {
		node: SidebarNode;
		depth: number;
		visible: boolean;
	}

	const rows = $derived.by(() => {
		const output: Row[] = [];

		const walk = (nodes: SidebarNode[], depth: number, parentVisible: boolean) => {
			for (const node of nodes) {
				output.push({ node, depth, visible: parentVisible });

				if (node.type === 'category' && !collapsed[node.id]) {
					walk(node.children, depth + 1, parentVisible);
				}
			}
		};

		walk(tree, 0, true);

		return output;
	});

	function isActive(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}

	function isCurrent(href: string) {
		return page.url.pathname === href;
	}

	function toggle(id: string) {
		collapsed = { ...collapsed, [id]: !collapsed[id] };
	}
</script>

<nav aria-label="Documentation" class="text-small select-none">
	<ul class="m-0 flex list-none flex-col gap-0.5 p-0">
		{#each rows as row (row.node.id)}
			{#if row.visible}
				<li>
					{#if row.node.type === 'doc'}
						<a
							href={row.node.href}
							class="flex rounded-md py-1.5 pr-2 transition-colors {isActive(row.node.href)
								? 'bg-surface-muted font-semibold text-accent'
								: 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'}"
							style:padding-left={`${0.75 + row.depth * 0.85}rem`}
							aria-current={isActive(row.node.href) ? 'page' : undefined}
							onclick={onNavigate}
						>
							{row.node.sidebarLabel}
						</a>
					{:else}
						<div
							class="flex items-center gap-1 rounded-md pr-1 transition-colors hover:bg-surface-muted"
							style:padding-left={`${0.5 + row.depth * 0.85}rem`}
						>
							<button
								type="button"
								class="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
								aria-label={collapsed[row.node.id]
									? `Expand ${row.node.label}`
									: `Collapse ${row.node.label}`}
								aria-expanded={!collapsed[row.node.id]}
								onclick={() => toggle(row.node.id)}
							>
								<ChevronIcon direction={collapsed[row.node.id] ? 'right' : 'down'} />
							</button>

							{#if row.node.href}
								<a
									href={row.node.href}
									class="flex-1 py-1.5 text-small font-semibold transition-colors {isCurrent(
										row.node.href
									)
										? 'text-accent'
										: 'text-foreground'}"
									aria-current={isCurrent(row.node.href) ? 'page' : undefined}
									onclick={onNavigate}
								>
									{row.node.label}
								</a>
							{:else}
								<button
									type="button"
									class="flex-1 py-1.5 text-left text-small font-semibold text-foreground"
									onclick={() => toggle(row.node.id)}
								>
									{row.node.label}
								</button>
							{/if}
						</div>
					{/if}
				</li>
			{/if}
		{/each}
	</ul>
</nav>
