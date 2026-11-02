// Everything personal lives here so the pages never hardcode it.
// A link set to null is not rendered — no dead links on the live site.

export const site = {
  name: 'Brian Decker',
  role: 'DevOps Engineer',
  location: 'Pacific Northwest',
  headline: 'I build, ship, and run software end to end.',
  intro: 'DevOps engineer by day. On my own time, I build products and the platform that runs them.',
  description:
    'Brian Decker: DevOps engineer who builds, ships, and operates products end to end.',

  links: {
    // Brian chose the Gmail directly (2026-11-02). A Cloudflare-routed hello@hellobriandecker.com is the optional upgrade (TODO.md).
    email: 'hellobriandecker@gmail.com' as string | null,
    github: null as string | null, // TODO(Brian): https://github.com/<you>
    linkedin: 'https://www.linkedin.com/in/hello-brian-decker/' as string | null,
    resume: null as string | null, // TODO(Brian): drop resume.pdf in public/ and set '/resume.pdf'
  },
};

export interface ContactLink {
  label: string;
  href: string;
  external: boolean;
}

// Order is priority: the first link becomes the primary button in the hero.
export function contactLinks(resolve: (path: string) => string): ContactLink[] {
  const { links } = site;
  const all = [
    { label: 'Resume', href: links.resume && resolve(links.resume), external: false },
    { label: 'GitHub', href: links.github, external: true },
    { label: 'LinkedIn', href: links.linkedin, external: true },
    { label: 'Email', href: links.email && `mailto:${links.email}`, external: false },
  ];
  return all.filter((l): l is ContactLink => Boolean(l.href));
}
