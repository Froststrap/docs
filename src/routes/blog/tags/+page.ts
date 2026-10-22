import { getBlogTags } from '../../../lib/content/blog';

export function load() {
	return { tags: getBlogTags() };
}
