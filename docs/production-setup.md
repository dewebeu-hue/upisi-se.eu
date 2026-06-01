# Production setup

Ovaj dokument opisuje kako spojiti Vercel production app na Convex production deployment bez commitanja tajni.

## Root cause: "Could not find public function"

Greška poput:

```text
Could not find public function for 'lexicons:getPublicLexiconBySlug'. Did you forget to run `npx convex dev`?
```

znači da frontend zove Convex deployment koji nema deployane funkcije. Development deployment može imati funkcije, a Production deployment može biti prazan.

Trenutni poznati slučaj:

- Development deployment `fortunate-ptarmigan-715` ima funkcije.
- Production deployment `jovial-poodle-631` nema funkcije.
- Vercel frontend koristi production Convex URL, pa production aplikacija puca dok se Convex funkcije ne deployaju u production.

## Function name check

Frontend očekuje ove Convex funkcije:

- `lexicons:createLexicon`
- `lexicons:getPublicLexiconBySlug`
- `lexicons:getAdminLexicon`
- `lexicons:softDeleteLexicon`
- `entries:createEntry`
- `entries:listEntriesForAdmin`
- `entries:getEntryForEdit`
- `entries:updateEntry`
- `entries:softDeleteEntry`

Backend exporti su u:

- `convex/lexicons.ts`
- `convex/entries.ts`

Ako se u produkciji pojavi greška za jedno od ovih imena, prvo provjeri Convex Dashboard -> Production -> Functions. Ako funkcije nisu tamo, problem je deploy, ne frontend import.

## Option A: manual Convex production deploy

Ovo je najjednostavnija i najkontroliranija opcija za prvi production fix.

1. U Convex Dashboardu otvori Production deployment.
2. Production -> Environment Variables:

```env
TOKEN_PEPPER=<long random server-side secret>
```

3. Lokalno pokreni:

```bash
npm run convex:deploy:prod
```

Napomena: u trenutno instaliranom Convex CLI-ju `convex deploy` po defaultu deploya production deployment. CLI ne podržava `--deployment production`. Ako je postavljen `CONVEX_DEPLOY_KEY` s preview ključem, naredba bi deployala preview, zato preview key ne smije biti u production shellu.

4. U Convex Dashboardu provjeri Production -> Functions. Treba vidjeti barem:

- `lexicons:createLexicon`
- `lexicons:getPublicLexiconBySlug`
- `lexicons:getAdminLexicon`
- `lexicons:softDeleteLexicon`
- `entries:createEntry`
- `entries:listEntriesForAdmin`
- `entries:getEntryForEdit`
- `entries:updateEntry`
- `entries:softDeleteEntry`

5. U Vercelu redeployaj aplikaciju.

Vercel build command za ovu opciju ostaje:

```bash
npm run build
```

## Option B: automatic Convex deploy in Vercel

Ovu opciju koristi tek kad želiš da Vercel build automatski deploya Convex funkcije.

1. U Convexu stvori production deploy key, ne preview key.
2. U Vercelu dodaj production environment varijablu:

```env
CONVEX_DEPLOY_KEY=<prod deploy key>
```

3. Vercel build command postavi na:

```bash
npx convex deploy --cmd 'npm run build'
```

Preview key počinje s `preview:...` i nije za production deploy. Production deploy key mora biti production/prod key.

## Vercel environment variables

Za test production deployment bez custom domene:

```env
NEXT_PUBLIC_CONVEX_URL=https://jovial-poodle-631.eu-west-1.convex.cloud
NEXT_PUBLIC_SITE_URL=https://upisi-se-eu.vercel.app
```

Nakon spajanja custom domene:

```env
NEXT_PUBLIC_CONVEX_URL=https://jovial-poodle-631.eu-west-1.convex.cloud
NEXT_PUBLIC_SITE_URL=https://upisi-se.eu
```

Ako se koristi automatic Convex deploy iz Vercel builda, dodaj i:

```env
CONVEX_DEPLOY_KEY=<prod deploy key>
```

Ne stavljati:

- `TOKEN_PEPPER` kao `NEXT_PUBLIC_` varijablu
- preview deploy key u production environment
- stvarne tajne u repo

## Convex production environment variables

U Convex Dashboardu, na Production deploymentu, postavi:

```env
TOKEN_PEPPER=<long random server-side secret>
```

`TOKEN_PEPPER` je server-side tajna za hashiranje admin/edit tokena. Ne smije se logirati, commitati niti slati klijentu.

## Exact production fix order

1. Convex Dashboard -> Production -> Environment Variables -> dodaj `TOKEN_PEPPER`.
2. Lokalno pokreni:

```bash
npm run convex:deploy:prod
```

3. Convex Dashboard -> Production -> Functions -> potvrdi da su funkcije deployane.
4. Vercel Settings -> Environment Variables:

```env
NEXT_PUBLIC_CONVEX_URL=https://jovial-poodle-631.eu-west-1.convex.cloud
NEXT_PUBLIC_SITE_URL=https://upisi-se-eu.vercel.app
```

5. Vercel -> Redeploy.
6. Testiraj:

- `/`
- `/novi`
- `/demo/pozivnica`
- `/l/nepostojeci-slug`
- `/privacy`
- `/terms`

## Schema and backfill note

Ako production deploy sheme pukne zbog legacy `lexicons` dokumenata, provjeri imaju li stari dokumenti ova required polja:

- `coverStyle`
- `theme`
- `questionPackKey`
- `quizUnlockEntryCount`

U repo postoji internal migration helper:

```text
convex/migrations.ts
```

Funkcija:

```text
migrations:backfillLexiconDefaults
```

Default vrijednosti:

```text
coverStyle: "Bilježnica na kockice"
theme: "grid-notebook"
questionPackKey: "osnovna-1998"
quizUnlockEntryCount: 5
```

Ako je funkcija već deployana i dostupna u dashboard/dev tools, pokreni je bez argumenata. Ne briše podatke, ne mijenja `adminTokenHash`, ne generira novi token i patcha samo polja koja nedostaju.

Ne brisati production podatke automatski. Ako schema deploy ne može proći dok se legacy dokumenti ne usklade, najprije ručno procijeni podatke u Convex Dashboardu.

## Local deploy checks

Prije production deploya pokreni:

```bash
npm run deploy:check
npm run qa
```

`deploy:check` pokreće lint, typecheck i build. `qa` radi isti osnovni set u ovom repo-u, ali ga ostavljamo kao poznati lokalni gate.
