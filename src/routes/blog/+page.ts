import { getBlogPosts, getBlogTags } from '../../lib/content/blog';

export function load() {
	return {
		posts: getBlogPosts(),
		tags: getBlogTags()
	};
}
