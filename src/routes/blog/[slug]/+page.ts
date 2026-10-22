import { error } from '@sveltejs/kit';
import { getBlogPost } from '../../../lib/content/blog';

export function load({ params }: { params: { slug: string } }) {
	const post = getBlogPost(params.slug);

	if (!post) {
		error(404, 'Post not found');
	}

	return post;
}
