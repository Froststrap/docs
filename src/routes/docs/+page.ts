import { error, redirect } from '@sveltejs/kit';
import { getFirstDocHref } from '../../lib/content/docs.svelte';

export function load() {
	const href = getFirstDocHref();

	if (!href) {
		error(404, 'No documentation found');
	}

	redirect(307, href);
}
