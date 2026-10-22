import { error } from '@sveltejs/kit';
import { resolveDocsRoute } from '../../../lib/content/docs';

export function load({ params }: { params: { slug: string } }) {
	const page = resolveDocsRoute(params.slug);

	if (!page) {
		error(404, 'Page not found');
	}

	return page;
}
