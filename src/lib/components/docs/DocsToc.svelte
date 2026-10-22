<script>
	let { items } = $props();
	let activeId = $state('');

	$effect(() => {
		const headings = items;

		if (headings.length === 0) {
			activeId = '';
			return;
		}

		activeId = headings[0].id;

		let frame = 0;

		const update = () => {
			frame = 0;

			if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
				activeId = headings[headings.length - 1].id;
				return;
			}

			const offset = 112;
			let current = headings[0].id;

			for (const heading of headings) {
				const element = document.getElementById(heading.id);

				if (!element) {
					continue;
				}

				if (element.getBoundingClientRect().top <= offset) {
					current = heading.id;
				} else {
					break;
				}
			}

			activeId = current;
		};

		const onScroll = () => {
			if (frame === 0) {
				frame = requestAnimationFrame(update);
			}
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});
</script>

{#if items.length > 0}
	<nav aria-label="On this page" class="text-small select-none">
		<p
			class="m-0 mb-3 text-[0.75rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase"
		>
			On this page
		</p>

		<ul class="m-0 flex list-none flex-col gap-0.5 border-l border-border p-0">
			{#each items as item (item.id)}
				<li>
					<a
						href="#{item.id}"
						class="-ml-px flex border-l py-1 transition-colors {activeId === item.id
							? 'border-accent font-medium text-accent'
							: 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'}"
						style:padding-left={`${item.depth === 3 ? 1.65 : 1}rem`}
						aria-current={activeId === item.id ? 'location' : undefined}
					>
						{item.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
