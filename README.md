# blazejkustra.com

Personal site of Błażej Kustra — Senior React Native Developer at Software Mansion.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Blog posts as markdown files in `content/posts/` (gray-matter + react-markdown)
- Fully static — no backend needed

## Development

```bash
npm install
npm run dev
```

## Content

- **Projects** — edit `lib/projects.ts`; graphics live in `public/projects/` (1200×600, 2:1)
- **Blog** — add a `.md` file to `content/posts/` with `title`, `date`, `description` (and optional `canonical`) frontmatter

## Deploy

Push to a Git repo and import into [Vercel](https://vercel.com) — zero config. Point the `blazejkustra.com` domain at the Vercel project.
