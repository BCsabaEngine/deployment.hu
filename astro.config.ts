import fs from 'node:fs';
import os from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroConfig, AstroIntegration } from 'astro';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';
import { SITE } from './src/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

// Appends/updates the `Sitemap:` line in the built robots.txt once @astrojs/sitemap
// has written sitemap-index.xml — Astro itself doesn't wire the two together.
const appendSitemapToRobotsTxt = (): AstroIntegration => {
  let cfg: AstroConfig;
  return {
    name: 'append-sitemap-to-robots-txt',
    hooks: {
      'astro:config:done': ({ config }) => {
        cfg = config;
      },
      'astro:build:done': () => {
        try {
          const sitemapName = 'sitemap-index.xml';
          const sitemapFile = new URL(sitemapName, cfg.outDir);
          if (!fs.existsSync(sitemapFile)) return;

          const robotsTxtFile = new URL('robots.txt', cfg.publicDir);
          const robotsTxtFileInOut = new URL('robots.txt', cfg.outDir);
          const robotsTxt = fs.readFileSync(robotsTxtFile, { encoding: 'utf8', flag: 'a+' });
          const sitemapUrl = new URL(sitemapName, String(new URL(cfg.base, cfg.site)));
          const pattern = /^Sitemap:(.*)$/m;

          fs.writeFileSync(
            robotsTxtFileInOut,
            pattern.test(robotsTxt)
              ? robotsTxt.replace(pattern, `Sitemap: ${sitemapUrl}`)
              : `${robotsTxt}${os.EOL}${os.EOL}Sitemap: ${sitemapUrl}`,
            { encoding: 'utf8', flag: 'w' }
          );
        } catch {
          /* robots.txt is optional */
        }
      },
    },
  };
};

export default defineConfig({
  output: 'static',

  site: SITE.site,
  base: SITE.base,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  integrations: [
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    appendSitemapToRobotsTxt(),
  ],

  image: {
    // Astro's default Sharp service handles local images.
    //
    // Most remote CDN images (Unsplash, Cloudinary, Imgix…) are routed by
    // src/components/common/Image.astro through `unpic`, which rewrites the
    // URL with CDN-side query parameters and serves it straight from the
    // provider — Astro never downloads it, so they don't need to be listed.
    //
    // `domains` only matters for remote URLs that fall through to Astro's
    // native <Image /> (i.e. providers Unpic can't detect). None are in use
    // currently — add a hostname here if such a provider gets used.
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
