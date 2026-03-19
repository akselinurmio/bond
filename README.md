# Who’s your favorite Bond?

## Getting started

1. Set these variables in `.env`:

- `POSTGRES_URL`: PostgreSQL connection string
- `TMDB_API_TOKEN`: TMDB API bearer token

2. Start the development server:

```bash
npm run dev
```

## Rendering strategy

- The landing pages run in Astro server mode behind Vercel ISR with a 5 minute revalidation window.
- All page routes stay in server mode because Astro currently does not support prerendered routes when multiple i18n domains are configured.
- `/api/vote` is excluded from ISR and stays fully dynamic.
