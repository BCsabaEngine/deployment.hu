# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`deployment.hu` is the Hungarian-language marketing/personal site for Balázs Csaba, a freelance product developer (tech-lead rental, platform building, custom AI solutions). It's an Astro + Tailwind site, statically generated (`output: 'static'`, no adapter), Node.js ≥ 24 (per `package.json` `engines` and the CI workflow).

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

`astro.config.ts` wires: `sitemap()`, `mdx()`, and `icon()` (Tabler icons plus a curated `flat-color-icons` subset). Tailwind is applied via the `@tailwindcss/vite` Vite plugin, not an Astro integration. A local `appendSitemapToRobotsTxt()` integration patches the built `robots.txt` to add a `Sitemap:` line after the sitemap integration runs, since Astro doesn't do this itself. The markdown processor also wires two custom plugins from `src/utils/frontmatter.ts`: a remark plugin for reading time and a rehype plugin for responsive tables.

### Config-driven site

`src/config.ts` is the source of truth for site-wide settings (site URL, i18n, SEO metadata defaults, blog behavior/paths, theme, company legal/contact details), exporting typed constants `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `COMPANY`, `ANALYTICS`. `astro.config.ts` derives its own `site`/`base`/`trailingSlash` from `SITE`. Don't hardcode values elsewhere — import them from `~/config` instead (see `src/utils/permalinks.ts` for the pattern).

### Permalinks

All internal links must go through `src/utils/permalinks.ts` (`getPermalink`, `getBlogPermalink`, `getAsset`), which respects `SITE.base`, `SITE.trailingSlash`, and the blog path config (`BLOG_BASE`/`CATEGORY_BASE`/`TAG_BASE`, all slugified with `limax`). Never build hrefs as literal strings.

### Navigation

`src/navigation.ts` defines `headerData` and `footerData`, consumed by `PageLayout.astro`. This is the single place to add/remove/reorder nav links and footer links.

### Page composition: widgets

Pages (`src/pages/*.astro`) are built by composing components from `src/components/widgets/` (Hero, Features, Content, Statement, MessageSection, Steps, Testimonials, Contact, CallToAction, BlogLatestPosts, etc.) inside `PageLayout.astro`. Widgets take structured props (e.g. `items`, `actions`, `image`) rather than being hand-written markup per page — when adding a new page, prefer assembling existing widgets over writing new bespoke markup. `src/components/ui/` holds lower-level building blocks (Button, Headline, WidgetWrapper, Timeline, ContentHeading, Notice, Form, PageGlow, SocialLinks) that widgets are built from.

Before writing markup inline in a page, check whether an existing widget/ui component already covers it. If a block is reused across pages (even a small one, like a subheading or a notice box) or is a self-contained visual unit, extract it into a new component under `src/components/widgets/` or `src/components/ui/` rather than leaving it inline.

### Layouts

- `Layout.astro` — root HTML shell (head, meta, analytics, theme).
- `PageLayout.astro` — wraps `Layout` with `Header`/`Footer`, and injects the latest blog posts into the footer links.
- `MarkdownLayout.astro` — used for Markdown/MDX content pages (e.g. `aszf.md`, `adatvedelem.md`).

### Blog (Astro Content Collections)

Blog posts live in `src/data/post/` (`.md`/`.mdx`), defined by the `post` collection in `src/content.config.ts` (via `glob` loader). Routing for the blog index, pagination, categories, and tags is handled by the dynamic routes under `src/pages/[...blog]/`. Blog-related helpers (fetching, filtering, sorting, related posts) live in `src/utils/blog.ts`. Blog path segments (list/category/tag) and permalink pattern are configured under `APP_BLOG` in `src/config.ts`, not hardcoded in the route files. There's also an `rss.xml.ts` endpoint that feeds off the same collection.

Note: `src/data/` doesn't exist yet — there are currently zero posts, so blog index/category/tag pages render empty until posts are added.

### Images

`src/components/common/Image.astro` wraps Astro's native `<Image />` (Sharp) for local images. Remote image hostnames, if ever used, must be added to `image.domains` in `astro.config.ts` (none configured currently). Keep source images in `src/assets/images/` at ≤ 2400 px on the long side (JPEG, ~q82): Astro resizes them per `widths`, so larger originals only bloat the repo and build time.

### Class conventions

- Colors: use the semantic tokens (`text-default`, `text-muted`, `text-heading`, `text-link`, `bg-surface`, `border-border`, `bg-placeholder`, `text-eyebrow`, `bg-page`) instead of raw `gray-*`/`slate-*` palette classes with manual `dark:` pairs. The values live in `CustomStyles.astro` (`--aw-color-*`, switched under `.dark`) and are mapped in `@theme` in `tailwind.css`.
- Repeated visual units are named `@utility` classes at the bottom of `src/assets/styles/tailwind.css` (`field`, `card`, `img-placeholder`, `eyebrow`, `card-title`, `card-link`, `media-frame`, `link-subtle`, `menu-bar`, `prose-site`, `btn*`). Add a new one there when a class string appears in a second place.
- Scroll-in animation classes are the exception: use `REVEAL` / `REVEAL_ONCE` / `REVEAL_NO_QUEUE` from `~/utils/classes`. They must stay literal class tokens because `BasicScripts.astro` finds elements by the `intersect:` class names.

### Fonts, scripts and styling

Manrope Variable is self-hosted via `@fontsource-variable/manrope` (`src/assets/styles/manrope-fonts.css`); `CustomStyles.astro` preloads the latin subset. There is no UI component library (Flowbite was removed) — interactivity is the inline scripts in `BasicScripts.astro` (menu, theme toggle, scroll-in animations) and `CookieConsent.astro`, written around Astro's `ClientRouter` view transitions (`astro:after-swap`). Analytics is a plain gtag snippet in `Analytics.astro`, active only when `ANALYTICS.vendors.googleAnalytics.id` is set.

### Static assets

`public/` holds `robots.txt` (the sitemap line is appended at build), `_headers` (immutable caching for `/_astro/*`), and `llms.txt`. `llms.txt` is hand-written Hungarian — update it whenever nav pages or blog posts are added, renamed or removed.

### Path alias

`~/*` maps to `src/*` (configured in both `tsconfig.json` and the Vite alias in `astro.config.ts`). Use it instead of relative `../../` imports.

### Formatting conventions

Prettier is configured with `printWidth: 120`, single quotes, and `trailingComma: 'es5'` (`.prettierrc.mjs`) — match this rather than defaulting to 80/double-quote style. ESLint allows `_`-prefixed unused args/destructured vars.

## Language

All user-facing copy is Hungarian (`I18N.language: 'hu'` in `src/config.ts`). Match the existing tone/phrasing of the current pages when writing new copy.
