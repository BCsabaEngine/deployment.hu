# deployment.hu

Astro + Tailwind marketing site for [deployment.hu](https://deployment.hu) — the Hungarian-language site for Balázs Csaba, a freelance product developer offering tech-lead rental, platform building, and custom AI solutions.

## About

deployment.hu presents services, background, and a blog for prospective clients looking for hands-on technical leadership, product/platform development, or AI-driven solutions. The site is statically generated and built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Development

Requires Node.js ≥ 24.

```bash
npm install
npm run dev        # start local dev server (http://localhost:4321)
npm run build       # build for production (static output in dist/)
npm run preview     # preview the production build
npm run check       # astro check + eslint + prettier --check (also run by CI on pull requests)
npm run fix         # eslint --fix + prettier --write
```

## Structure

- `src/pages/` — pages (`.astro`, plus Markdown for the legal pages `aszf.md` and `adatvedelem.md`)
- `src/components/widgets/` and `src/components/ui/` — page building blocks
- `src/config.ts` — site-wide settings; `src/navigation.ts` — header/footer links
- `src/data/post/` — blog posts (Astro Content Collections)
- `public/` — `robots.txt`, `_headers`, `llms.txt`

All user-facing copy is Hungarian.

## License

Private, all rights reserved.
