export const site = {
  name: 'Elsewhere',
  tagline: 'A to Z, and everything between.',
  workshopSubtitle: 'Workshop · 66°N',
  description:
    'A personal site about a 2009 Mitsubishi Pajero, the trips it takes, and the workshop manuals that keep it running.',
  author: 'RD',
  baseUrl: '/elsewhere',
} as const;

export type Section = 'home' | 'journal' | 'build' | 'workshop' | 'bucketlist' | 'about';

export const nav: { label: string; href: string; section: Section }[] = [
  { label: 'Home', href: '/', section: 'home' },
  { label: 'Journal', href: '/journal', section: 'journal' },
  { label: 'Bucket List', href: '/bucketlist', section: 'bucketlist' },
  { label: 'The Build', href: '/build', section: 'build' },
  { label: 'Workshop', href: '/workshop', section: 'workshop' },
  { label: 'About', href: '/about', section: 'about' },
];

/** Prefix a path with the configured base. Pass paths starting with `/`. */
export const path = (p: string) => {
  const base = site.baseUrl.replace(/\/$/, '');
  return `${base}${p === '/' ? '' : p}` || '/';
};
