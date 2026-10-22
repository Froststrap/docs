# Froststrap Docs

Documentation site for [Froststrap](https://froststrap.xyz), built with SvelteKit and MDX (mdsvex).

## Development

```bash
pnpm install
pnpm dev
```

The site runs at `http://localhost:5173`.

## Content

- Docs live in `src/content/docs`.
- Blog posts live in `src/content/blog`.
- Doc pages are MDX files with optional frontmatter:

```mdx
---
sidebar_position: 1
---

# Page title

## Section

Section content.
```

The docs sidebar is generated automatically from the folder structure and `sidebar_position`
values. Folders can include a Docusaurus-style `_category_.json` file to control the section
label, position, description, and category index page.

Headings get stable IDs automatically, and each heading gets a `#` anchor link on hover.

## Build

```bash
pnpm run build
pnpm run preview
```

The production build uses the Cloudflare adapter and outputs to `.svelte-kit/cloudflare`.

## Checks

```bash
pnpm run check
pnpm run lint
```
