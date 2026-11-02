import type { ImageMetadata } from 'astro';

export type Status = 'live' | 'beta';

export interface Project {
  /** Matches the screenshot file name: src/assets/projects/<slug>.{png,jpg,jpeg,webp,avif} */
  slug: string;
  name: string;
  url: string;
  status: Status;
  /** One project gets the wide card at the top of the section. */
  featured?: boolean;
  pitch: string;
  built: string[];
  stack: string[];
  /** One real, checkable number. Rendered only when set. */
  metric?: { value: string; label: string };
}

// Order matters: strongest story first. Only list sites that load today.
export const projects: Project[] = [
  {
    slug: 'custom-game-lab',
    name: 'Custom Game Lab',
    url: 'https://customgamelab.com',
    status: 'live',
    featured: true,
    // Matches the live homepage as of Sep 2026 (it moved from DIY trading cards to kids' games).
    pitch:
      'Turn a child and their favorite people into the heroes of a personalized fantasy game, made for ages 2–5.',
    built: [
      'Stripe checkout and order pipeline, taking real payments', // TODO(Brian): confirm this is the revenue product
      'Print-on-demand fulfillment through The Game Crafter API', // TODO(Brian): still true after the pivot?
      'AI image generation with assets stored in Azure Blob Storage',
    ],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Stripe', 'Azure'],
    // metric: { value: '…', label: 'games shipped' }, // TODO(Brian)
  },
  {
    slug: 'relief',
    name: 'Relief',
    url: 'https://www.bathroom-finder.com',
    status: 'live',
    pitch: 'Find and review public bathrooms nearby. Crowd-sourced, map-first, and moderated.',
    built: [
      'Map-first UI with client-side clustering (MapLibre + Supercluster)',
      'Community submissions with an admin moderation and reports queue',
      'OpenTelemetry tracing into Azure Monitor; Playwright and Vitest suites',
    ],
    stack: ['Next.js', 'Drizzle', 'PostgreSQL', 'MapLibre', 'Azure'],
  },
  {
    slug: 'the-puzzly',
    name: 'The Puzzly',
    url: 'https://www.thepuzzly.com',
    status: 'live',
    pitch: 'Five daily puzzles in one short session: Connections, Timeline, One Line, Who Said It, and Sudoku.',
    built: [
      'Daily reset with saved streaks', // TODO(Brian): verify wording
      'A single-container app on shared infrastructure: shared Postgres, registry, and Key Vault',
      'Scaffold extracted into a reusable template that seeds new projects',
    ],
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Azure Container Apps'],
  },
  {
    slug: 'storynapse',
    name: 'StoryNapse',
    url: 'https://www.storynapse.com',
    status: 'live',
    pitch: 'A writing workspace for fiction authors, API-first with sync across sessions.',
    built: [
      'Rich-text editor built on TipTap, with PostgreSQL as the single source of truth',
      'Turborepo monorepo with a one-command Dockerized dev environment',
    ],
    stack: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Turborepo'],
  },
];

// Screenshots are optional: drop a file named after the slug and the card picks it up.
const screenshots = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projects/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

export function screenshotFor(slug: string): ImageMetadata | undefined {
  const match = Object.entries(screenshots).find(([path]) =>
    path.replace(/^.*\//, '').replace(/\.[^.]+$/, '') === slug,
  );
  return match?.[1].default;
}

/** Display host for a product URL: 'https://www.example.com/' -> 'example.com'. */
export function hostOf(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}
