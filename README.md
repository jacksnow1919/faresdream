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

Cloudflare builds with npm 10, which checks the lockfile more strictly than npm 11. After changing packages, refresh the lockfile with `npx npm@10.9.2 install`.

## Airports

The search boxes load every airport from `src/lib/airports-all.gen.ts`, built from Duffel's airport list. Refresh it with `node scripts/update-airports.mjs`.

## Checks

```bash
npx tsc --noEmit
node --test scripts/admin-logic.test.ts scripts/fare-filters.test.ts scripts/airports.test.ts scripts/regional.test.ts
npm run build
```
