<script module>
	import { parse as parseYaml } from 'yaml';
	import {
		extractDescription,
		extractToc,
		parseFrontmatter,
		readingTime,
		stripInlineMarkdown,
		toSentenceCase
	} from './markdown.svelte';

	const rawPosts = import.meta.glob('/src/content/blog/**/*.{md,mdx}', {
		eager: true,
		query: '?raw',
		import: 'default'
	});

	const rawMetadata = import.meta.glob('/src/content/blog/{authors,tags}.{yml,yaml}', {
		eager: true,
		query: '?raw',
		import: 'default'
	});

	const blogModules = import.meta.glob('/src/content/blog/**/*.{md,mdx}', {
		eager: true
	});

	const BLOG_PREFIX = '/src/content/blog/';
	const EDIT_BASE = 'https://github.com/Froststrap/docs/tree/main/src/content/blog/';

	function readYaml(path) {
		const raw = rawMetadata[path];

		if (!raw) {
			return {};
		}

		try {
			const parsed = parseYaml(raw);

			return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
		} catch {
			return {};
		}
	}

	function asRecord(value) {
		return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
	}

	function stringValue(value) {
		return typeof value === 'string' && value.trim() ? value.trim() : undefined;
	}

	const authorsConfig = readYaml(`${BLOG_PREFIX}authors.yml`);
	const tagsConfig = readYaml(`${BLOG_PREFIX}tags.yml`);

	function resolveAuthor(value) {
		if (typeof value === 'string') {
			const config = asRecord(authorsConfig[value]);
			const name = stringValue(config?.name) ?? toSentenceCase(value);

			return {
				id: value,
				name,
				title: stringValue(config?.title),
				url: stringValue(config?.url),
				imageUrl: stringValue(config?.image_url)
			};
		}

		const record = asRecord(value);

		if (!record) {
			return null;
		}

		const id = stringValue(record.id) ?? stringValue(record.name) ?? 'author';
		const name = stringValue(record.name) ?? toSentenceCase(id);

		return {
			id,
			name,
			title: stringValue(record.title),
			url: stringValue(record.url),
			imageUrl: stringValue(record.image_url)
		};
	}

	function resolveTag(value) {
		if (typeof value === 'string') {
			const config = asRecord(tagsConfig[value]);

			return {
				id: value,
				label: stringValue(config?.label) ?? toSentenceCase(value),
				description: stringValue(config?.description)
			};
		}

		const record = asRecord(value);

		if (!record) {
			return null;
		}

		const label = stringValue(record.label) ?? stringValue(record.id);

		if (!label) {
			return null;
		}

		const id = stringValue(record.id) ?? label.toLowerCase().replace(/\s+/g, '-');

		return {
			id,
			label,
			description: stringValue(record.description)
		};
	}

	function toStringArray(value) {
		if (Array.isArray(value)) {
			return value;
		}

		if (value === undefined || value === null || value === '') {
			return [];
		}

		return [value];
	}

	function toDate(value, file) {
		if (value instanceof Date && !Number.isNaN(value.getTime())) {
			return value;
		}

		const raw = stringValue(value) ?? /^(\d{4}-\d{2}-\d{2})/.exec(file)?.[1];

		if (!raw) {
			return new Date(0);
		}

		const parsed = new Date(`${raw.slice(0, 10)}T00:00:00Z`);

		return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
	}

	function toSlug(file, frontmatterSlug) {
		const configured = stringValue(frontmatterSlug);

		if (configured) {
			return configured.replace(/^\/+|\/+$/g, '');
		}

		const withoutExtension = file.replace(/\.(md|mdx)$/i, '');
		const segments = withoutExtension.split('/');
		const basename = segments.pop() ?? withoutExtension;
		const cleaned = basename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
		const name = cleaned === 'index' ? (segments.at(-1) ?? cleaned) : cleaned;

		if (cleaned === 'index') {
			segments.pop();
		}

		return [...segments, name].filter(Boolean).join('/');
	}

	function excerpt(body) {
		const marker = /(?:{\/\*\s*truncate\s*\*\/}|<!--\s*truncate\s*-->)/.exec(body);
		const before = marker ? body.slice(0, marker.index) : body;
		const text = stripInlineMarkdown(before);

		return text || extractDescription(body);
	}

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});

	const posts = [];

	for (const [path, raw] of Object.entries(rawPosts)) {
		const file = path.slice(BLOG_PREFIX.length);
		const { data, body } = parseFrontmatter(raw);
		const date = toDate(data.date, file);
		const authors = toStringArray(data.authors)
			.map(resolveAuthor)
			.filter((author) => author !== null);
		const tags = toStringArray(data.tags)
			.map(resolveTag)
			.filter((tag) => tag !== null);
		const slug = toSlug(file, data.slug);
		const title = stringValue(data.title) ?? toSentenceCase(slug.split('/').pop() ?? slug);
		const description = stringValue(data.description) ?? excerpt(body) ?? extractDescription(body);

		posts.push({
			slug,
			href: `/blog/${slug}`,
			file,
			title,
			date: date.toISOString(),
			dateLabel: dateFormatter.format(date),
			description,
			authors,
			tags,
			readingTime: readingTime(body)
		});
	}

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

	function pageLink(post) {
		return { title: post.title, href: post.href };
	}

	export function getBlogComponent(file) {
		const module = blogModules[`${BLOG_PREFIX}${file}`];

		return module?.default ?? null;
	}

	export function getBlogPosts() {
		return posts;
	}

	export function getBlogPost(slug) {
		const post = postsBySlug.get(slug);

		if (!post) {
			return null;
		}

		const raw = rawPosts[`${BLOG_PREFIX}${post.file}`] ?? '';
		const { body } = parseFrontmatter(raw);
		const index = posts.findIndex((entry) => entry.slug === slug);
		const newer = index > 0 ? posts[index - 1] : null;
		const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;

		return {
			...post,
			toc: extractToc(body),
			editUrl: `${EDIT_BASE}${post.file}`,
			prev: older ? pageLink(older) : null,
			next: newer ? pageLink(newer) : null
		};
	}

	export function getBlogTags() {
		const map = new Map();

		for (const post of posts) {
			for (const tag of post.tags) {
				const existing = map.get(tag.id);

				if (existing) {
					existing.count += 1;
				} else {
					map.set(tag.id, { ...tag, count: 1 });
				}
			}
		}

		return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
	}

	export function getPostsByTag(tagId) {
		return posts.filter((post) => post.tags.some((tag) => tag.id === tagId));
	}

	export function getTag(tagId) {
		for (const post of posts) {
			const tag = post.tags.find((entry) => entry.id === tagId);

			if (tag) {
				return tag;
			}
		}

		return null;
	}
</script>
