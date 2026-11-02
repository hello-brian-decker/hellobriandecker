// Every internal link goes through here, so the site works both at a domain root
// (hellobriandecker.com/) and under a GitHub Pages project path (<user>.github.io/<repo>/).
export function href(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
