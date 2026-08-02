import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Tech-Lead bérlés', href: getPermalink('/tech-lead-berles') },
    { text: 'Platform-építés', href: getPermalink('/platform-epites') },
    { text: 'AI hibrid megoldások', href: getPermalink('/ai-hibrid-megoldasok') },
    { text: 'AI kerekasztal', href: getPermalink('/ai-kerekasztal') },
    { text: 'Rólam', href: getPermalink('/rolam') },
    { text: 'Blog', href: getBlogPermalink() },
  ],
  actions: [{ text: 'Kapcsolat', href: getPermalink('/kapcsolat'), variant: 'primary' as const }],
};

export const footerData = {
  tagline:
    'Tech-Lead bérlés, platform-építés és egyedi, saját tulajdonú AI megoldások — Balázs Csaba szabadúszó termékfejlesztő oldala.',
  pageLinks: headerData.links,
  secondaryLinks: [
    { text: 'ÁSZF', href: getPermalink('/aszf') },
    { text: 'Adatvédelem', href: getPermalink('/adatvedelem') },
  ],
};
