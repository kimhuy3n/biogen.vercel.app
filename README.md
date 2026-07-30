# BioGen

Bio link builder for TikTok creators.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository at https://vercel.com/new.
3. Keep the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click Deploy.

The included `vercel.json` keeps public routes working with the Vite SPA.

## Current MVP storage

When Supabase is configured, profile, links, theme, publish state and analytics are stored in the `bio_pages` table so public links work across devices. Without Supabase, the app falls back to localStorage.

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase.sql`](./supabase.sql) in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
4. Redeploy on Vercel with the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables.
