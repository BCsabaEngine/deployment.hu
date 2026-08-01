import { getHomePermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Főoldal',
      href: getHomePermalink(),
    },
  ],
  actions: [],
};

export const footerData = {
  links: [],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `© ${new Date().getFullYear()} deployment.hu · Balázs Csaba`,
};
