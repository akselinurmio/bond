# Who’s your favorite Bond?

## Getting started

1. Link the project to Vercel:

```bash
vercel link
```

2. Start the development server:

```bash
npm run dev
```

## Database

```bash
npx kysely migrate latest --environment local   # apply pending migrations
npx kysely migrate make <name> --environment local  # create a new migration
npx kysely migrate list --environment local     # list migration status
```
