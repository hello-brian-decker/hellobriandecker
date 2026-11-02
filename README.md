# hellobriandecker

Personal site: portfolio, live products, and writing. Built with [Astro](https://astro.build) and output as plain static files.

```bash
npm install
npm run dev       # http://localhost:4321 (drafts visible)
npm run build     # -> dist/ (drafts excluded)
npm run preview   # serve dist/ locally
```

## Operations

Runs on the CustomAppLab fleet ops standard: `.cicd/ops.sh <env> <verb>`.

```bash
.cicd/ops.sh dev up             # astro dev on :4321
.cicd/ops.sh staging up         # build, then astro preview on :8093 (re-run to publish changes)
.cicd/ops.sh staging health     # exit 0 healthy, 5 not
.cicd/ops.sh staging doctor     # preflight: tools, ports, dirs
```

`ops.sh` and `manifest.py` are fleet code — never edit them here. Facts go in `.cicd/project.yml`, project logic in `.cicd/bindings.sh`. Verbs that don't apply to a static site (`backup-db`, `wipe`, …) exit 3 with a reason; `prod` verbs exit 3 because prod is deployed by GitHub Actions, not `ops.sh`.

## Deploying (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes on every push to `main` and on demand.

One-time setup, once this directory is its own GitHub repo:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Custom domain:** enter `hellobriandecker.com` in Settings → Pages, and point DNS at GitHub Pages
   (apex `A` records to GitHub's Pages IPs, `www` `CNAME` to `<user>.github.io`). Then tick **Enforce HTTPS**.
   With a custom Actions workflow no `CNAME` file is needed; the setting is the source of truth.
3. Push to `main`.

No custom domain? It still works at `https://<user>.github.io/<repo>/`: the workflow passes the base path to
Astro, and every internal link goes through `href()` in `src/lib/url.ts`. **Never hardcode a root-relative link** (`href="/..."`); it breaks under a project path.

`public/.nojekyll` is insurance in case you ever switch to branch-based publishing (Jekyll would hide `_astro/`).

## Screenshots

Put one image per product at `src/assets/projects/<slug>.{png,jpg,jpeg,webp,avif}`; `slug` is set in `projects.ts`.
The card picks it up automatically, and a project without an image just renders without one.
Astro converts them to responsive WebP at build, so drop in full-size originals.
Best source size: **1280×800 (16:10)**, top of the page, with no cookie banners or popups.

## Where things live

| To change…                        | Edit                                   |
|-----------------------------------|----------------------------------------|
| Name, headline, links             | `src/data/site.ts`                     |
| Project cards (order = priority)  | `src/data/projects.ts`                 |
| Posts                             | `src/content/writing/*.md`             |
| Screenshots                       | `src/assets/projects/<slug>.png`       |
| Colors, fonts, spacing            | `src/styles/global.css` (tokens at top)|

A post is a Markdown file with `title`, `summary`, `date`, and `draft`. `draft: true` shows in dev only.
Any link in `site.ts` left as `null` is simply not rendered, so the live site never has dead links.

## Rules for content

- **Only list products that load today.** A dead link costs more than a missing project.
- **Every number must be checkable.** See below.
- **Public writing is not internal notes.** No hostnames, IPs, job names, or descriptions of what's currently broken.

## Numbers

| Claim | Check |
|-------|-------|
| 24 projects on one ops script (the code block under "Under the hood") | `md5 -q /opt/apps/*/.cicd/ops.sh \| sort \| uniq -c` |
