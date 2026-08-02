# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`deployment.hu` is the Hungarian-language marketing/personal site for Balázs Csaba, a freelance product developer (tech-lead rental, platform building, custom AI solutions). It's an Astro + Tailwind site, statically generated (`output: 'static'`, no adapter), Node.js ≥ 24 (per `package.json` `engines` and the CI workflow — `IDEA.md` still says ≥22.12, treat that as stale planning-doc info).

`IDEA.md` and `RAW.md` are the content source of truth (marketing copy, sitemap, tone/style notes for each page) — treat them as authoritative when writing or editing page copy, not the rendered `.astro` files. If copy changes, both files are meant to stay in sync with each other.

## Commands

```bash
npm run dev            # astro dev server (port 4321, see .claude/launch.json)
npm run build           # astro build (static output to dist/)
npm run preview         # preview the built site

npm run check           # astro check + eslint + prettier --check (run before considering work done)
npm run check:astro
npm run check:eslint
npm run check:prettier

npm run fix             # eslint --fix + prettier -w
npm run all             # fix, then build
```

There is no test suite (`check` is the closest to CI validation, and is exactly what `.github/workflows/pr.yaml` runs on Node 24, followed by `npm run build`). There's no single-file/single-test runner to worry about.

## Architecture

### Astro integrations

`astro.config.ts` wires: `sitemap()`, `mdx()`, `icon()` (Tabler icons plus a curated `flat-color-icons` subset), and `compress()` (CSS/HTML/JS only — image/SVG compression is off). Tailwind is applied via the `@tailwindcss/vite` Vite plugin, not an Astro integration. A local `appendSitemapToRobotsTxt()` integration patches the built `robots.txt` to add a `Sitemap:` line after the sitemap integration runs, since Astro doesn't do this itself. The markdown processor also wires two custom plugins from `src/utils/frontmatter.ts`: a remark plugin for reading time and a rehype plugin for responsive tables.

`@astrojs/partytown` is a dependency and `ANALYTICS.vendors.googleAnalytics.partytown` is `true` in config, but Partytown itself is only included when a `hasExternalScripts` flag in `astro.config.ts` is `true` — it's currently hardcoded `false`, so Partytown is not actually active despite the config implying otherwise. Flip that flag (not the analytics config) if third-party scripts need to move off the main thread.

### Config-driven site

`src/config.ts` is the source of truth for site-wide settings (site URL, i18n, SEO metadata defaults, blog behavior/paths, theme), exporting typed constants `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`. `astro.config.ts` derives its own `site`/`base`/`trailingSlash` from `SITE`. Don't hardcode values elsewhere — import them from `~/config` instead (see `src/utils/permalinks.ts` for the pattern).

### Permalinks

All internal links must go through `src/utils/permalinks.ts` (`getPermalink`, `getBlogPermalink`, `getAsset`), which respects `SITE.base`, `SITE.trailingSlash`, and the blog path config (`BLOG_BASE`/`CATEGORY_BASE`/`TAG_BASE`, all slugified with `limax`). Never build hrefs as literal strings.

### Navigation

`src/navigation.ts` defines `headerData` and `footerData`, consumed by `PageLayout.astro`. This is the single place to add/remove/reorder nav links and footer links.

### Page composition: widgets

Pages (`src/pages/*.astro`) are built by composing components from `src/components/widgets/` (Hero, Features, Content, Pricing, Testimonials, FAQs, CallToAction, BlogLatestPosts, etc.) inside `PageLayout.astro`. Widgets take structured props (e.g. `items`, `actions`, `image`) rather than being hand-written markup per page — when adding a new page, prefer assembling existing widgets over writing new bespoke markup. `src/components/ui/` holds lower-level building blocks (Button, Headline, WidgetWrapper, Timeline) that widgets are built from.

### Layouts

- `Layout.astro` — root HTML shell (head, meta, analytics, theme).
- `PageLayout.astro` — wraps `Layout` with `Header`/`Footer`, and injects the latest blog posts into the footer links.
- `MarkdownLayout.astro` — used for Markdown/MDX content pages (e.g. `aszf.md`, `adatvedelem.md`).

### Blog (Astro Content Collections)

Blog posts live in `src/data/post/` (`.md`/`.mdx`), defined by the `post` collection in `src/content.config.ts` (via `glob` loader). Routing for the blog index, pagination, categories, and tags is handled by the dynamic routes under `src/pages/[...blog]/`. Blog-related helpers (fetching, filtering, sorting, related posts) live in `src/utils/blog.ts`. Blog path segments (list/category/tag) and permalink pattern are configured under `APP_BLOG` in `src/config.ts`, not hardcoded in the route files. There's also an `rss.xml.ts` endpoint that feeds off the same collection.

Note: `src/data/` doesn't exist yet — there are currently zero posts, so blog index/category/tag pages render empty until posts are added.

### Images

`src/components/common/Image.astro` routes most remote CDN images (Unsplash, Cloudinary, Imgix, etc.) through `unpic`, which rewrites URLs for CDN-side resizing without Astro downloading them. Astro's native image processing (Sharp) is only needed for local images and remote providers `unpic` can't detect — such domains must be added to `image.domains` in `astro.config.ts` (none configured currently).

### Path alias

`~/*` maps to `src/*` (configured in both `tsconfig.json` and the Vite alias in `astro.config.ts`). Use it instead of relative `../../` imports.

### Formatting conventions

Prettier is configured with `printWidth: 120`, single quotes, and `trailingComma: 'es5'` (`.prettierrc.mjs`) — match this rather than defaulting to 80/double-quote style. ESLint allows `_`-prefixed unused args/destructured vars.

## Language

All user-facing copy is Hungarian (`I18N.language: 'hu'` in `src/config.ts`). Match existing tone/phrasing from `IDEA.md` when writing new copy.
