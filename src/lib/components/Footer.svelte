<script lang="ts">
	import { DISCORD_URL, GITHUB_ORG_URL, GITHUB_URL, LICENSE_URL } from '../site';

	const year = new Date().getFullYear();
</script>

<footer class="mt-auto border-t border-border/50 bg-background">
	<div
		class="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-4 px-8 pt-6 pb-10 text-small text-muted-foreground transition-colors sm:px-12 lg:flex-row lg:items-center"
	>
		<p class="m-0">
			Froststrap is a fork of Fishstrap, licensed under
			<a
				class="text-accent underline-offset-2 transition-colors hover:underline"
				href={LICENSE_URL}
				target="_blank"
				rel="noopener noreferrer">MPL-2.0</a
			>.
			<span class="hidden sm:inline">© {year} Froststrap contributors.</span>
		</p>
		<div class="flex flex-wrap gap-5">
			<a class="transition-colors hover:text-foreground" href="/docs/welcome">Docs</a>
			<a class="transition-colors hover:text-foreground" href="/blog">Blog</a>
			<a
				class="transition-colors hover:text-foreground"
				href={DISCORD_URL}
				target="_blank"
				rel="noopener noreferrer">Discord</a
			>
			<a
				class="transition-colors hover:text-foreground"
				href={GITHUB_URL}
				target="_blank"
				rel="noopener noreferrer">GitHub</a
			>
			<a
				class="transition-colors hover:text-foreground"
				href={GITHUB_ORG_URL}
				target="_blank"
				rel="noopener noreferrer">GitHub Org</a
			>
		</div>
	</div>
</footer>
