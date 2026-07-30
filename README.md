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

This prototype stores profile, links, theme and analytics in the browser's localStorage. For multiple accounts, connect Supabase Auth/Database and replace the local storage adapter.
