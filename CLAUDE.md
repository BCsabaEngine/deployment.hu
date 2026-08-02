# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`deployment.hu` is the Hungarian-language marketing/personal site for Balázs Csaba, a freelance product developer (tech-lead rental, platform building, custom AI solutions). It's built on the **AstroWind** template (Astro + Tailwind), statically generated (`output: 'static'`), Node.js ≥ 22.12.

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

There is no test suite (`check` is the closest to CI validation). There's no single-file/single-test runner to worry about.

## Architecture

### Config-driven site (astrowind integration)

`src/config.yaml` is the source of truth for site-wide settings (site URL, i18n, SEO metadata defaults, blog behavior/paths, theme). It's loaded by the custom Astro integration in `vendor/integration/` (see `vendor/README.md` — this is pre-release scaffolding for a future "AstroWind v2" that will support updating template instances), which exposes it at build time as the virtual module `astrowind:config` (`SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`). Don't hardcode values from `config.yaml` elsewhere — import them from `astrowind:config` instead (see `src/utils/permalinks.ts` for the pattern).

### Permalinks

All internal links must go through `src/utils/permalinks.ts` (`getPermalink`, `getBlogPermalink`, `getAsset`), which respects `SITE.base`, `SITE.trailingSlash`, and the blog path config (`BLOG_BASE`/`CATEGORY_BASE`/`TAG_BASE`, all slugified with `limax`). Never build hrefs as literal strings.

### Navigation

`src/navigation.ts` defines `headerData` and `footerData`, consumed by `PageLayout.astro`. This is the single place to add/remove/reorder nav links and footer links.

### Page composition: widgets

Pages (`src/pages/*.astro`) are built by composing components from `src/components/widgets/` (Hero, Features, Content, Pricing, Testimonials, FAQs, CallToAction, BlogLatestPosts, etc.) inside `PageLayout.astro`. Widgets take structured props (e.g. `items`, `actions`, `image`) rather than being hand-written markup per page — when adding a new page, prefer assembling existing widgets over writing new bespoke markup. `src/components/ui/` holds lower-level building blocks (Button, Headline, WidgetWrapper, Timeline) that widgets are built from.

### Layouts

- `Layout.astro` — root HTML shell (head, meta, analytics, theme).
- `PageLayout.astro` — wraps `Layout` with `Header`/`Footer`, and injects the latest blog posts into the footer links.
- `LandingLayout.astro` / `MarkdownLayout.astro` — used for landing-style pages and Markdown/MDX content pages (e.g. `aszf.md`, `adatvedelem.md`) respectively.

### Blog (Astro Content Collections)

Blog posts live in `src/data/post/` (`.md`/`.mdx`), defined by the `post` collection in `src/content.config.ts` (via `glob` loader). Routing for the blog index, pagination, categories, and tags is handled by the dynamic routes under `src/pages/[...blog]/`. Blog-related helpers (fetching, filtering, sorting, related posts) live in `src/utils/blog.ts`. Blog path segments (list/category/tag) and permalink pattern are configured under `apps.blog` in `config.yaml`, not hardcoded in the route files.

### Images

`src/components/common/Image.astro` routes most remote CDN images (Unsplash, Cloudinary, Imgix, etc.) through `unpic`, which rewrites URLs for CDN-side resizing without Astro downloading them. Astro's native image processing (Sharp) is only needed for local images and remote providers `unpic` can't detect — such domains must be added to `image.domains` in `astro.config.ts` (currently just `cdn.pixabay.com`).

### Path alias

`~/*` maps to `src/*` (configured in both `tsconfig.json` and the Vite alias in `astro.config.ts`). Use it instead of relative `../../` imports.

## Language

All user-facing copy is Hungarian (`i18n.language: hu` in `config.yaml`). Match existing tone/phrasing from `IDEA.md` when writing new copy.
