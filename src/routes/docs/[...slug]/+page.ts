import { error } from '@sveltejs/kit';
import { resolveDocsRoute } from '../../../lib/content/docs.svelte';

export function load({ params }) {
	const page = resolveDocsRoute(params.slug);

	if (!page) {
		error(404, 'Page not found');
	}

	return page;
}
