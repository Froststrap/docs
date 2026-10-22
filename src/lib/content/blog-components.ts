import type { Component } from 'svelte';

interface MdxModule {
	default: Component;
	metadata?: Record<string, unknown>;
}

const blogModules = import.meta.glob<MdxModule>('/src/content/blog/**/*.{md,mdx}', {
	eager: true
});

const BLOG_PREFIX = '/src/content/blog/';

export function getBlogComponent(file: string): Component | null {
	const module = blogModules[`${BLOG_PREFIX}${file}`];

	return module?.default ?? null;
}
