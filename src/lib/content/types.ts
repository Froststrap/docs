export interface TocItem {
	id: string;
	text: string;
	depth: 2 | 3;
}

export interface DocMeta {
	type: 'doc';
	id: string;
	href: string;
	file: string;
	dir: string;
	title: string;
	sidebarLabel: string;
	description: string;
	position: number;
	toc: TocItem[];
}

export interface CategoryMeta {
	type: 'category';
	id: string;
	href: string | null;
	dir: string;
	label: string;
	description: string;
	position: number;
	children: SidebarNode[];
}

export type SidebarNode = DocMeta | CategoryMeta;

export interface Breadcrumb {
	label: string;
	href?: string;
}

export interface PageLink {
	title: string;
	href: string;
}

export interface DocPageData {
	kind: 'doc';
	id: string;
	file: string;
	title: string;
	description: string;
	toc: TocItem[];
	breadcrumbs: Breadcrumb[];
	editUrl: string;
	prev: PageLink | null;
	next: PageLink | null;
}

export interface CategoryItem {
	kind: 'doc' | 'category';
	title: string;
	description: string;
	href: string;
}

export interface CategoryPageData {
	kind: 'category';
	title: string;
	description: string;
	breadcrumbs: Breadcrumb[];
	items: CategoryItem[];
}

export type DocsPageData = DocPageData | CategoryPageData;

export interface BlogAuthor {
	id: string;
	name: string;
	title?: string;
	url?: string;
	imageUrl?: string;
}

export interface BlogTag {
	id: string;
	label: string;
	description?: string;
}

export interface BlogPostMeta {
	slug: string;
	href: string;
	file: string;
	title: string;
	date: string;
	dateLabel: string;
	description: string;
	authors: BlogAuthor[];
	tags: BlogTag[];
	readingTime: number;
}

export interface BlogPostPageData extends BlogPostMeta {
	toc: TocItem[];
	editUrl: string;
	prev: PageLink | null;
	next: PageLink | null;
}
