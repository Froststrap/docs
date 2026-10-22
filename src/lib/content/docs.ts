import { parse as parseYaml } from 'yaml';
import {
	extractDescription,
	extractTitle,
	extractToc,
	parseFrontmatter,
	toSentenceCase
} from './markdown';
import type {
	Breadcrumb,
	CategoryItem,
	CategoryMeta,
	DocsPageData,
	DocMeta,
	SidebarNode
} from './types';

const rawDocs = import.meta.glob<string>('/src/content/docs/**/*.{md,mdx}', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const rawCategories = import.meta.glob<string>('/src/content/docs/**/_category_.{json,yml,yaml}', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const DOCS_PREFIX = '/src/content/docs/';
const EDIT_BASE = 'https://github.com/Froststrap/docs/tree/main/src/content/docs/';
const DEFAULT_POSITION = 1000;

function fileFromPath(path: string): string {
	return path.slice(DOCS_PREFIX.length);
}

function toDocId(file: string): string {
	const id = file.replace(/\.(md|mdx)$/i, '');

	return id.endsWith('/index') ? id.slice(0, -'/index'.length) : id;
}

function categoryDirFromPath(path: string): string {
	return fileFromPath(path)
		.replace(/\/_category_\.(json|yml|yaml)$/i, '')
		.replace(/_category_\.(json|yml|yaml)$/i, '');
}

function readCategoryConfig(path: string, raw: string): Record<string, unknown> {
	if (/\.json$/i.test(path)) {
		try {
			const parsed = JSON.parse(raw);

			return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: {};
		} catch {
			return {};
		}
	}

	try {
		const parsed = parseYaml(raw);

		return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
			? (parsed as Record<string, unknown>)
			: {};
	} catch {
		return {};
	}
}

function numberValue(value: unknown, fallback = DEFAULT_POSITION): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);

		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return fallback;
}

const docsByFile = new Map<string, DocMeta>();

for (const [path, raw] of Object.entries(rawDocs)) {
	const file = fileFromPath(path);
	const { data, body } = parseFrontmatter(raw);
	const id = toDocId(file);
	const fallbackTitle = toSentenceCase((file.split('/').pop() ?? file).replace(/\.(md|mdx)$/i, ''));
	const title =
		typeof data.title === 'string' && data.title.trim()
			? data.title.trim()
			: (extractTitle(body) ?? fallbackTitle);
	const description =
		typeof data.description === 'string' && data.description.trim()
			? data.description.trim()
			: extractDescription(body);

	docsByFile.set(file, {
		type: 'doc',
		id,
		href: `/docs/${id}`,
		file,
		dir: file.includes('/') ? file.slice(0, file.lastIndexOf('/')) : '',
		title,
		sidebarLabel:
			typeof data.sidebar_label === 'string' && data.sidebar_label.trim()
				? data.sidebar_label.trim()
				: title,
		description,
		position: numberValue(data.sidebar_position),
		toc: extractToc(body)
	});
}

const categories = new Map<string, CategoryMeta>();
const rootChildren: SidebarNode[] = [];

function ensureCategory(dir: string): CategoryMeta {
	const existing = categories.get(dir);

	if (existing) {
		return existing;
	}

	const category: CategoryMeta = {
		type: 'category',
		id: dir,
		href: null,
		dir,
		label: toSentenceCase(dir.split('/').pop() ?? dir),
		description: '',
		position: DEFAULT_POSITION,
		children: []
	};

	categories.set(dir, category);

	const parentDir = dir.includes('/') ? dir.slice(0, dir.lastIndexOf('/')) : '';

	if (parentDir) {
		ensureCategory(parentDir).children.push(category);
	} else {
		rootChildren.push(category);
	}

	return category;
}

for (const doc of docsByFile.values()) {
	if (doc.dir) {
		ensureCategory(doc.dir).children.push(doc);
	} else {
		rootChildren.push(doc);
	}
}

for (const [path, raw] of Object.entries(rawCategories)) {
	const dir = categoryDirFromPath(path);

	if (!dir) {
		continue;
	}

	const category = ensureCategory(dir);
	const config = readCategoryConfig(path, raw);
	const link =
		config.link && typeof config.link === 'object' && !Array.isArray(config.link)
			? (config.link as Record<string, unknown>)
			: null;

	if (typeof config.label === 'string' && config.label.trim()) {
		category.label = config.label.trim();
	}

	category.position = numberValue(config.position, category.position);

	if (typeof config.description === 'string' && config.description.trim()) {
		category.description = config.description.trim();
	} else if (link && typeof link.description === 'string' && link.description.trim()) {
		category.description = link.description.trim();
	}

	if (link?.type === 'generated-index') {
		const slug = typeof link.slug === 'string' && link.slug.trim() ? link.slug.trim() : dir;
		category.href = `/docs/${slug}`;
	}
}

function sortNodes(nodes: SidebarNode[]) {
	nodes.sort((a, b) => {
		if (a.position !== b.position) {
			return a.position - b.position;
		}

		const aLabel = a.type === 'doc' ? a.sidebarLabel : a.label;
		const bLabel = b.type === 'doc' ? b.sidebarLabel : b.label;

		return aLabel.localeCompare(bLabel);
	});

	for (const node of nodes) {
		if (node.type === 'category') {
			sortNodes(node.children);
		}
	}
}

sortNodes(rootChildren);

const docsByPath = new Map<string, DocMeta>();
const categoriesByPath = new Map<string, CategoryMeta>();
const flatDocs: DocMeta[] = [];

function indexNodes(nodes: SidebarNode[]) {
	for (const node of nodes) {
		if (node.type === 'doc') {
			docsByPath.set(node.id, node);
			flatDocs.push(node);
		} else {
			categoriesByPath.set(node.id, node);
			indexNodes(node.children);
		}
	}
}

indexNodes(rootChildren);

const previousByDoc = new Map<string, DocMeta>();
const nextByDoc = new Map<string, DocMeta>();

for (let index = 0; index < flatDocs.length; index += 1) {
	if (index > 0) {
		previousByDoc.set(flatDocs[index].id, flatDocs[index - 1]);
	}

	if (index < flatDocs.length - 1) {
		nextByDoc.set(flatDocs[index].id, flatDocs[index + 1]);
	}
}

function breadcrumbsForDir(dir: string): Breadcrumb[] {
	const breadcrumbs: Breadcrumb[] = [{ label: 'Docs', href: '/docs/welcome' }];

	if (!dir) {
		return breadcrumbs;
	}

	const segments = dir.split('/');

	for (let index = 0; index < segments.length; index += 1) {
		const id = segments.slice(0, index + 1).join('/');
		const category = categoriesByPath.get(id);

		if (category) {
			breadcrumbs.push({
				label: category.label,
				href: category.href ?? undefined
			});
		}
	}

	return breadcrumbs;
}

function categoryItems(category: CategoryMeta): CategoryItem[] {
	const items: CategoryItem[] = [];

	for (const child of category.children) {
		if (child.type === 'doc') {
			items.push({
				kind: 'doc',
				title: child.title,
				description: child.description,
				href: child.href
			});
		} else if (child.href) {
			items.push({
				kind: 'category',
				title: child.label,
				description: child.description,
				href: child.href
			});
		}
	}

	return items;
}

export function getSidebarTree(): SidebarNode[] {
	return rootChildren;
}

export function getFirstDocHref(): string | null {
	return flatDocs[0]?.href ?? null;
}

export function resolveDocsRoute(slug: string): DocsPageData | null {
	const id = slug.replace(/^\/+|\/+$/g, '');
	const doc = docsByPath.get(id);

	if (doc) {
		const previous = previousByDoc.get(doc.id);
		const next = nextByDoc.get(doc.id);

		return {
			kind: 'doc',
			id: doc.id,
			file: doc.file,
			title: doc.title,
			description: doc.description,
			toc: doc.toc,
			breadcrumbs: [...breadcrumbsForDir(doc.dir), { label: doc.title }],
			editUrl: `${EDIT_BASE}${doc.file}`,
			prev: previous ? { title: previous.title, href: previous.href } : null,
			next: next ? { title: next.title, href: next.href } : null
		};
	}

	const category = categoriesByPath.get(id);

	if (category?.href) {
		return {
			kind: 'category',
			title: category.label,
			description: category.description,
			breadcrumbs: [
				...breadcrumbsForDir(
					category.dir.includes('/') ? category.dir.slice(0, category.dir.lastIndexOf('/')) : ''
				),
				{ label: category.label }
			],
			items: categoryItems(category)
		};
	}

	return null;
}
