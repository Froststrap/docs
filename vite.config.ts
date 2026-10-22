import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { escapeSvelte, mdsvex } from 'mdsvex';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-nix';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-yaml';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

const mdxComments = {
	name: 'froststrap:mdx-comments',
	markup({ content, filename }: { content: string; filename?: string }) {
		if (!filename || !/\.(md|mdx)$/i.test(filename)) {
			return;
		}

		return {
			code: content.replace(/\{\/\*([\s\S]*?)\*\/\}/g, '<!--$1-->')
		};
	}
};

const mdxModuleScript = {
	name: 'froststrap:mdx-module-script',
	markup({ content, filename }: { content: string; filename?: string }) {
		if (!filename || !/\.(md|mdx)$/i.test(filename)) {
			return;
		}

		return {
			code: content.replace(/<script context="module">/g, '<script module>')
		};
	}
};

const highlight = (code: string, lang?: string) => {
	const language = lang?.toLowerCase() ?? '';
	const grammar = language ? Prism.languages[language] : undefined;
	const label = language || 'text';
	const highlighted = grammar ? Prism.highlight(code, grammar, language) : code;

	return `<pre class="language-${label}"><code class="language-${label}">${escapeSvelte(highlighted)}</code></pre>`;
};

const mdsvexOptions = {
	extensions: ['.mdx', '.md'],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'append',
				properties: {
					className: ['heading-anchor'],
					ariaLabel: 'Link to this section'
				},
				content: {
					type: 'element',
					tagName: 'span',
					properties: { className: ['heading-anchor-icon'], ariaHidden: 'true' },
					children: [{ type: 'text', value: '#' }]
				}
			}
		]
	],
	highlight: { highlighter: highlight }
} as unknown as Parameters<typeof mdsvex>[0];

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter(),
			extensions: ['.svelte', '.mdx', '.md'],
			preprocess: [mdxComments, mdsvex(mdsvexOptions), mdxModuleScript],
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			}
		})
	]
});
