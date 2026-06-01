# Arhitektura projekta

`Upiši se` je lokalni MVP digitalnog retro leksikona. Projekt je namjerno jednostavan: brz mobilni flow, hrvatski UI copy, bez registracije, bez plaćanja i bez javnog feeda.

## Frontend

Frontend koristi Next.js App Router. Rute žive u root-level `app/` folderu, bez `src/` foldera. App Router nam daje jasnu strukturu za javne stranice, tokenizirane privatne linkove i buduće server/client granice.

Početni UI je mobile-first landing i prvi set MVP flowova: kreiranje leksikona, javna pozivnica, forma za upis, thank-you stranica, privatni admin pregled i edit/delete link za upis. Kviz i napredni admin alati dolaze kasnije.

## Backend i baza

Convex je backend i baza za MVP. Paket `convex` je instaliran, a `convex/schema.ts` definira početni model podataka.

Convex provider se dodaje tek nakon što lokalni `npx convex dev` pripremi `NEXT_PUBLIC_CONVEX_URL`. Ne smije se hardkodirati production Convex URL.

Plan budućih Convex modula:

- `convex/schema.ts` - tablice, indeksi i osnovni model podataka. Trenutno postoje `lexicons`, `entries`, `questionPacks`, `quizRounds` i `events`.
- `convex/lexicons.ts` - kreiranje leksikona, dohvat pozivnice i admin dohvat.
- `convex/entries.ts` - upisi prijateljica, edit i delete flow.
- `convex/quiz.ts` - budući recap/kviz nakon dovoljnog broja upisa.
- `convex/events.ts` - lagani interni događaji ako zatreba za product metrike, bez vanjskog trackinga.
- `convex/questionPacks.ts` - setovi nostalgičnih pitanja.

## Convex data model

Autoritativni MVP data model živi u `convex/schema.ts`, a detaljno je opisan u `docs/data-model.md`.

Model pokriva `lexicons`, `entries`, `questionPacks`, `quizRounds` i `events`. Nema korisničkih računa, payment tablica, javnih profila, feeda, komentara, upload storagea ni email/subscriber modela. Privatni pristup se kasnije provjerava preko hashiranih tokena (`adminTokenHash`, `deleteTokenHash`), a brisanje se modelira kao soft delete preko `status: "deleted"` i `deletedAt`.

## Styling

Tailwind CSS se koristi za UI. Globalni stilovi u `app/globals.css` definiraju papir/bilježnica pozadinu, retro karticu, gel-pen naglasak i osnovne link/button stilove.

Ne koristimo vanjske fontove preko CDN-a i ne koristimo slike s interneta.

## Lokalni razvojni flow

Osnovni lokalni flow:

```bash
npm install
npm run dev
```

Za Convex kasnije:

```bash
npx convex dev
```

Convex init/login je ručni korak i ne radi se kao production deploy.

## Zašto nema autha u MVP-u

MVP je namijenjen brzom dijeljenju u WhatsApp/Viber grupama. Registracija bi dodala trenje i usporila glavni loop: kreiraj leksikon, pošalji link, prijateljica se upiše.

Umjesto login sustava, MVP će koristiti privatne tokenizirane linkove za:

- admin pregled vlasnice leksikona
- edit/delete flow za osobu koja se upisala

Auth provider se uvodi samo ako kasniji scope to eksplicitno zatraži.

## Privatni tokenizirani linkovi

Admin i edit/delete rute ne smiju se oslanjati samo na ID. ID može biti pogađan ili slučajno podijeljen. Svaka privatna ruta kasnije mora tražiti token.

Tokeni se ne smiju spremati u plaintextu. U bazi se sprema hash tokena, a originalni token postoji samo u privatnom linku koji korisnica dobije.
