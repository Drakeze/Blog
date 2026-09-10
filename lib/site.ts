/** Static site config for "Thinking Out Loud" — chrome, nav, external links. */

export const site = {
  name: 'Thinking Out Loud',
  tagline: 'Software, systems, and the craft of building things — mostly in public.',
  author: 'Anthony Shead',
  portfolioUrl: 'https://drakeze.com',
  patreonUrl: 'https://www.patreon.com/cw/Drakeze',
} as const;

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
] as const;

/** Footer socials. `reddit` intentionally omitted until Anthony provides the URL. */
export const socialLinks = [
  { label: 'X', href: 'https://x.com/SorenIdeas' },
  { label: 'GitHub', href: 'https://github.com/Drakeze' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anthonyshead/' },
] as const;
