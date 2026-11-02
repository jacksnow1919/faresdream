# FaresDream

Flight search and booking website: [faresdream.com](https://www.faresdream.com).

- **App:** TanStack Start, React and Tailwind CSS
- **Hosting:** Cloudflare Workers (deploys automatically from `main`)
- **Database and sign-in:** Supabase
- **Flight data:** Duffel

## Run it locally

```bash
npm install
npm run dev
```

Secrets go in `.env.local`, which is never committed. `.env` only holds the public Supabase values.

## Checks

```bash
npx tsc --noEmit
node --test scripts/admin-logic.test.ts scripts/fare-filters.test.ts
npm run build
```
