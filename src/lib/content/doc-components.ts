import type { Component } from 'svelte';

interface MdxModule {
	default: Component;
	metadata?: Record<string, unknown>;
}

const docModules = import.meta.glob<MdxModule>('/src/content/docs/**/*.{md,mdx}', {
	eager: true
});

const DOCS_PREFIX = '/src/content/docs/';

export function getDocComponent(file: string): Component | null {
	const module = docModules[`${DOCS_PREFIX}${file}`];

	return module?.default ?? null;
}
