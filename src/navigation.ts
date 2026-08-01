import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

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
  links: [],
  secondaryLinks: [
    { text: 'ÁSZF', href: getPermalink('/aszf') },
    { text: 'Adatvédelem', href: getPermalink('/adatvedelem') },
  ],
  socialLinks: [{ ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') }],
  footNote: `© ${new Date().getFullYear()} deployment.hu · Balázs Csaba e.v. · hello@deployment.hu`,
};
