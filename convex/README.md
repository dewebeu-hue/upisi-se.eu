# Convex

Ovaj folder sadrži lokalni Convex model za MVP projekta `Upiši se`.

## Schema

Glavna shema je u:

```text
convex/schema.ts
```

Trenutne MVP tablice:

- `lexicons`
- `entries`
- `questionPacks`
- `quizRounds`
- `events`

Detaljna dokumentacija modela podataka je u `docs/data-model.md`.

## Lokalni Convex development

Za lokalni Convex development pokreni:

```bash
npm run convex:dev
```

Ova naredba može tražiti lokalni Convex login i inicijalizaciju projekta. Production deploy nije dio ovog koraka.

## Production deploy

Za production deployment funkcija koristi:

```bash
npm run convex:deploy:prod
```

U trenutno instaliranom Convex CLI-ju `convex deploy` po defaultu deploya production deployment. Opcija `--deployment production` nije dostupna u ovom CLI-ju. Ako je u shellu postavljen preview `CONVEX_DEPLOY_KEY`, naredba može deployati preview, zato za production koristi production deploy key ili lokalni login povezan s production projektom.

Prije deploya postavi `TOKEN_PEPPER` u Convex Dashboardu na Production deploymentu. Nakon deploya provjeri Production -> Functions i potvrdi da postoje `lexicons:*` i `entries:*` funkcije.

Detaljan runbook je u `docs/production-setup.md`.

## Funkcije

`convex/lexicons.ts` sadrži prve MVP funkcije za leksikone:

- `createLexicon`: kreira leksikon, generira jedinstveni slug, generira admin token i sprema samo `adminTokenHash`.
- `getPublicLexiconBySlug`: vraća javno sigurne podatke za pozivnicu.
- `getAdminLexicon`: vraća privatni admin pregled samo ako je token valjan.
- `softDeleteLexicon`: radi soft delete leksikona preko admin tokena.

`convex/entries.ts` sadrži MVP funkcije za upise:

- `createEntry`: sprema upis u aktivni leksikon, generira edit/delete token i sprema samo `deleteTokenHash`.
- `listEntriesForAdmin`: vraća aktivne upise nakon provjere admin tokena.
- `getEntryForEdit`: vraća jedan upis samo preko valjanog edit/delete tokena.
- `updateEntry`: uređuje upis preko edit/delete tokena.
- `softDeleteEntry`: radi soft delete upisa i sinkronizira `entryCount`.

UI još nije namjerno spojen na ove nove funkcije u ovom koraku. Spajanje `/novi`, javne pozivnice, upis forme i admin dashboarda dolazi u sljedećim promptovima.

Kviz logika i generiranje quiz rundi dolaze kasnije.

Stranica `/novi` sada koristi `createLexicon` za stvarno kreiranje leksikona. Nakon uspješnog kreiranja frontend prikazuje javni invite link i privatni admin link.

`adminToken` se vraća samo jednom, odmah nakon kreiranja leksikona. Frontend ga smije prikazati samo kao dio privatnog admin linka i ne smije ga spremati u `localStorage`, session storage, analytics ili logove.

`convex/shared.ts` sadrži male Convex-safe helpere za timestamp i status vrijednosti. Ne sadrži frontend-only kod.

## Tokeni

`adminTokenHash` i `deleteTokenHash` nikad nisu plaintext tokeni. Originalni token smije postojati samo u privatnom linku koji korisnica dobije.

Za lokalni rad s novim mutation/query funkcijama potreban je server-side env u Convex runtimeu:

```env
TOKEN_PEPPER=replace-with-long-random-secret
```

`TOKEN_PEPPER` ne smije biti `NEXT_PUBLIC_`. Pepper se ne smije hardkodirati, logirati ni slati klijentu. `.env.example` sadrži samo placeholder, bez stvarne tajne.

Ako `_generated` datoteke nedostaju ili nisu ažurne, pokreni `npx.cmd convex dev` kako bi Convex generirao tipove i povezao lokalni projekt.

Ako `/novi` prikaže da Convex nije spojen, pokreni `npx.cmd convex dev` i provjeri da lokalni frontend ima `NEXT_PUBLIC_CONVEX_URL`.

## Local data backfill

Ako lokalna Convex baza već ima stare `lexicons` dokumente nastale prije finalne sheme, schema validation može prijaviti da dokumentima nedostaju required polja:

- `coverStyle`
- `theme`
- `questionPackKey`
- `quizUnlockEntryCount`

Za taj slučaj postoji jednokratni dev/internal helper:

```text
convex/migrations.ts
```

Funkcija `backfillLexiconDefaults` prolazi kroz postojeće leksikone i patcha samo polja koja nedostaju. Ne mijenja `adminTokenHash`, ne generira novi admin token, ne mijenja `slug`, `ownerName`, `title` ni postojeće vrijednosti.

Default vrijednosti:

```text
coverStyle: "grid-notebook"
theme: "grid-notebook"
questionPackKey: "osnovna-1998"
quizUnlockEntryCount: 5
```

Nakon što `npx.cmd convex dev` uspješno pusha funkcije, backfill se može pokrenuti iz lokalnog Convex dev okruženja:

```bash
npx.cmd convex run migrations:backfillLexiconDefaults
```

Ako koristiš Convex dashboard function runner i vidiš internal funkcije, možeš pokrenuti istu funkciju od tamo bez argumenata. Rezultat je:

```ts
{
  scanned: number;
  patched: number;
}
```

Ako Convex ne može ni startati/pushati shemu dok se dokumenti ne usklade, najbrži lokalni fix je ručno otvoriti `lexicons` tablicu u Convex dashboardu i za stare dokumente dodati gore navedena default polja, zatim ponovno pokrenuti `npx.cmd convex dev`. Alternativa je privremeno deployati shemu s optional poljima samo za migration, pokrenuti backfill, pa odmah vratiti required polja; to nije trajni model.

Ne commitati stvarne tajne. Backfill ne treba `TOKEN_PEPPER` jer ne čita ni ne mijenja token hash polja.

## Privatnost

- Nema auth tablica.
- Nema payment tablica.
- Nema public profile, feed, comments, email subscriber ili upload tablica.
- `events` ne smije spremati raw IP adresu, user-agent ili osobne podatke.
