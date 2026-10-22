import GithubSlugger from 'github-slugger';
import { parse as parseYaml } from 'yaml';
import type { TocItem } from './types';

export function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);

	if (!match) {
		return { data: {}, body: raw };
	}

	let data: Record<string, unknown> = {};

	try {
		const parsed = parseYaml(match[1]);

		if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
			data = parsed as Record<string, unknown>;
		}
	} catch {
		data = {};
	}

	return { data, body: raw.slice(match[0].length) };
}

export function stripInlineMarkdown(value: string): string {
	return value
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/[*_~]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function walkLines(body: string, callback: (line: string, inFence: boolean) => boolean | void) {
	let inFence = false;
	let fenceMarker = '';

	for (const line of body.split('\n')) {
		const fence = /^\s*(```+|~~~+)/.exec(line);

		if (fence) {
			if (!inFence) {
				inFence = true;
				fenceMarker = fence[1][0];
			} else if (fence[1][0] === fenceMarker) {
				inFence = false;
			}

			if (callback(line, true) === false) {
				return;
			}

			continue;
		}

		if (callback(line, inFence) === false) {
			return;
		}
	}
}

export function extractTitle(body: string): string | null {
	let title: string | null = null;

	walkLines(body, (line, inFence) => {
		if (inFence || title) {
			return;
		}

		const match = /^#\s+(.+?)\s*#*\s*$/.exec(line);

		if (match) {
			title = stripInlineMarkdown(match[1]);
			return false;
		}
	});

	return title;
}

export function extractDescription(body: string): string {
	const lines: string[] = [];

	walkLines(body, (line, inFence) => {
		const trimmed = line.trim();

		if (inFence) {
			return lines.length > 0 ? false : undefined;
		}

		if (!trimmed) {
			return lines.length > 0 ? false : undefined;
		}

		if (/^#{1,6}\s/.test(trimmed) || /^[-*_]{3,}$/.test(trimmed)) {
			return lines.length > 0 ? false : undefined;
		}

		if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
			return;
		}

		lines.push(trimmed);
	});

	return stripInlineMarkdown(lines.join(' ')).slice(0, 200);
}

export function extractToc(body: string): TocItem[] {
	const slugger = new GithubSlugger();
	const items: TocItem[] = [];

	walkLines(body, (line, inFence) => {
		if (inFence) {
			return;
		}

		const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);

		if (!match) {
			return;
		}

		const text = stripInlineMarkdown(match[2]);
		const id = slugger.slug(text);
		const depth = match[1].length;

		if (depth === 2 || depth === 3) {
			items.push({ id, text, depth });
		}
	});

	return items;
}

export function readingTime(body: string): number {
	const words = stripInlineMarkdown(body)
		.split(/\s+/)
		.filter((word) => /[a-zA-Z0-9]/.test(word)).length;

	return Math.max(1, Math.round(words / 200));
}

export function toSentenceCase(value: string): string {
	return value
		.split(/[-_]/g)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}
