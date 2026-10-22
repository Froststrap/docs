import { error } from '@sveltejs/kit';
import { getPostsByTag, getTag } from '../../../../lib/content/blog.svelte';

export const prerender = false;

export function load({ params }) {
	const tag = getTag(params.tag);
	const posts = getPostsByTag(params.tag);

	if (!tag) {
		error(404, 'Tag not found');
	}

	return { tag, posts };
}
