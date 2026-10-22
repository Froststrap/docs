import { error } from '@sveltejs/kit';
import { getBlogTags, getPostsByTag, getTag } from '../../../../lib/content/blog';

export const prerender = false;

export const entries = () => getBlogTags().map((tag) => ({ tag: tag.id }));

export function load({ params }: { params: { tag: string } }) {
	const tag = getTag(params.tag);
	const posts = getPostsByTag(params.tag);

	if (!tag) {
		error(404, 'Tag not found');
	}

	return { tag, posts };
}
