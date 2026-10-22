<script lang="ts">
	import './layout.css';
	import type { LayoutProps } from './$types';
	import Footer from '../lib/components/Footer.svelte';
	import Header from '../lib/components/Header.svelte';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="any" />
</svelte:head>

<Header />

{@render children()}

<Footer />
