# Upiši se

`Upiši se` je lokalni MVP digitalnog retro leksikona: korisnica napravi leksikon bez registracije, pošalje javni link frendicama u WhatsApp/Viber grupu i čita upise kroz privatni link za pregled.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Convex
- npm

## MVP flow

1. Korisnica otvori landing i napravi leksikon na `/novi`.
2. Dobije javni invite link i privatni link za pregled.
3. Frendice se upisuju preko `/l/[slug]/upis`.
4. Nakon upisa vide thank-you viralni loop na `/l/[slug]/hvala`.
5. Vlasnica čita upise preko `/admin/[lexiconId]?token=...`.
6. Osoba koja se upisala može urediti ili obrisati upis preko `/e/[entryId]?token=...`.

## Lokalni start

```bash
npm install
npx.cmd convex dev
npm.cmd run dev
```

Aplikacija se otvara na:

```text
http://localhost:3000
```

## Env varijable

Za lokalni rad dodaj `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=<tvoj-local-dev-convex-url>
TOKEN_PEPPER=<dugi-lokalni-random-string>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`TOKEN_PEPPER` je server-side tajna i ne smije biti `NEXT_PUBLIC_`. Ne commitati stvarne tajne.

Za produkciju `NEXT_PUBLIC_SITE_URL` treba biti:

```env
NEXT_PUBLIC_SITE_URL=https://upisi-se.eu
```

## Glavne rute

- `/` landing
- `/novi` kreiranje leksikona
- `/l/[slug]` javna pozivnica
- `/l/[slug]/upis` forma za upis
- `/l/[slug]/hvala` thank-you flow
- `/admin/[lexiconId]?token=...` privatni pregled vlasnice
- `/e/[entryId]?token=...` privatno uređivanje/brisanje upisa
- `/privacy` i `/terms`

## Provjere

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run qa
npm.cmd run deploy:check
```

Ručni QA checklist je u [docs/local-qa-checklist.md](docs/local-qa-checklist.md).
Launch readiness checklist je u [docs/launch-readiness.md](docs/launch-readiness.md).
Production setup i Convex deploy runbook su u [docs/production-setup.md](docs/production-setup.md).

## Production deploy

Convex production funkcije moraju biti deployane prije Vercel production redeploya. Ako Vercel koristi production Convex URL, a Convex Production nema funkcije, aplikacija će prijaviti da ne može pronaći javnu funkciju poput `lexicons:getPublicLexiconBySlug`.

Ručni production fix:

```bash
npm run convex:deploy:prod
```

Zatim u Convex Dashboardu provjeri Production -> Functions i napravi Vercel redeploy.

Ako želiš da Vercel build automatski deploya Convex, koristi production deploy key u Vercelu i build command:

```bash
npx convex deploy --cmd 'npm run build'
```

Ne koristiti preview deploy key za production. Stvarne tajne ne idu u repo.

## Scope granice

U MVP-u nema autha, paymenta, Stripea, analyticsa, uploadanja slika, javnog feeda ni javnog kataloga leksikona.
