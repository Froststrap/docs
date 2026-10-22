import { error } from '@sveltejs/kit';
import { getBlogPost } from '../../../lib/content/blog.svelte';

export function load({ params }) {
	const post = getBlogPost(params.slug);

	if (!post) {
		error(404, 'Post not found');
	}

	return post;
}
