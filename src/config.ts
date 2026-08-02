import type { MetaData } from '~/types';

export interface SiteConfig {
  name: string;
  site?: string;
  base?: string;
  trailingSlash?: boolean;
  googleSiteVerificationId?: string;
}

export interface MetaDataConfig extends Omit<MetaData, 'title'> {
  title?: {
    default: string;
    template: string;
  };
}

export interface I18NConfig {
  language: string;
  textDirection: string;
}

export interface AppBlogConfig {
  isEnabled: boolean;
  postsPerPage: number;
  isRelatedPostsEnabled: boolean;
  relatedPostsCount: number;
  post: {
    isEnabled: boolean;
    permalink: string;
    robots: { index: boolean; follow: boolean };
  };
  list: {
    isEnabled: boolean;
    pathname: string;
    robots: { index: boolean; follow: boolean };
  };
  category: {
    isEnabled: boolean;
    pathname: string;
    robots: { index: boolean; follow: boolean };
  };
  tag: {
    isEnabled: boolean;
    pathname: string;
    robots: { index: boolean; follow: boolean };
  };
}

export interface UIConfig {
  theme: string;
}

export interface AnalyticsConfig {
  vendors: {
    googleAnalytics: {
      id?: string;
      partytown?: boolean;
    };
  };
}

export const SITE: SiteConfig = {
  name: 'deployment.hu',
  site: 'https://deployment.hu',
  base: '/',
  trailingSlash: false,
  googleSiteVerificationId: '',
};

export const I18N: I18NConfig = {
  language: 'hu',
  textDirection: 'ltr',
};

export const METADATA: MetaDataConfig = {
  title: {
    default: 'deployment.hu — Tech-Lead bérlés, Platform-építés, AI megoldások',
    template: '%s — deployment.hu',
  },
  description:
    'Tech-Lead bérlés, platform-építés és egyedi AI megoldások — Balázs Csaba szabadúszó termékfejlesztő oldala.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: 'deployment.hu',
    images: [{ url: '~/assets/images/default.png', width: 1200, height: 628 }],
  },
};

export const APP_BLOG: AppBlogConfig = {
  isEnabled: true,
  postsPerPage: 6,
  isRelatedPostsEnabled: true,
  relatedPostsCount: 4,
  post: {
    isEnabled: true,
    // Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
    permalink: '/blog/%slug%',
    robots: { index: true, follow: true },
  },
  list: {
    isEnabled: true,
    pathname: 'blog',
    robots: { index: true, follow: true },
  },
  category: {
    isEnabled: true,
    pathname: 'kategoria',
    robots: { index: true, follow: true },
  },
  tag: {
    isEnabled: true,
    pathname: 'cimke',
    robots: { index: false, follow: true },
  },
};

export const UI: UIConfig = {
  // Values: 'system' | 'light' | 'dark' | 'light:only' | 'dark:only'
  theme: 'system',
};

export const ANALYTICS: AnalyticsConfig = {
  vendors: {
    googleAnalytics: {
      id: undefined, // or 'G-XXXXXXXXXX'
      partytown: true,
    },
  },
};
