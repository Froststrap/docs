import { getSidebarTree } from '../../lib/content/docs';

export function load() {
	return { tree: getSidebarTree() };
}
