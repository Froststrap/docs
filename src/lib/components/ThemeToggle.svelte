<script lang="ts">
	import { onMount } from 'svelte';
	import MoonIcon from '../icons/MoonIcon.svelte';
	import SunIcon from '../icons/SunIcon.svelte';

	type Theme = 'light' | 'dark';

	let theme = $state<Theme>('light');
	let colorSchemeTimer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

		return () => clearTimeout(colorSchemeTimer);
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';

		document.documentElement.dataset.theme = theme;
		clearTimeout(colorSchemeTimer);
		colorSchemeTimer = setTimeout(() => {
			document.documentElement.style.colorScheme = theme;
		}, 250);

		try {
			localStorage.setItem('froststrap-theme', theme);
		} catch {
			return;
		}
	}

	const label = $derived(theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
</script>

<span class="inline-flex text-muted-foreground transition-colors hover:text-foreground">
	<button
		type="button"
		class="inline-flex size-10 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
		aria-label={label}
		title={label}
		onclick={toggleTheme}
	>
		{#if theme === 'dark'}
			<SunIcon />
		{:else}
			<MoonIcon />
		{/if}
	</button>
</span>
