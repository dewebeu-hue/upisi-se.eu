# Lokalni razvoj

## Instalacija

```bash
npm install
```

## Next.js dev server

```bash
npm run dev
```

Aplikacija se lokalno otvara na:

```text
http://localhost:3000
```

## Convex dev

Convex paket je dio projekta, ali production deploy se ne radi u ovom koraku.

Za lokalni Convex development pokreni:

```bash
npx.cmd convex dev
```

Ručni korak: ova naredba može tražiti tvoj Convex login i lokalnu inicijalizaciju projekta. Nakon promjena u `convex/` folderu treba biti pokrenuta kako bi se funkcije pushale u lokalni/dev Convex deployment.

## Env varijable

Za stvarni `/novi` create flow trebaju lokalne vrijednosti u `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=<tvoj-local-dev-convex-url>
TOKEN_PEPPER=<dugi-lokalni-random-string>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_CONVEX_URL` je javna frontend varijabla i smije biti dostupna clientu. `TOKEN_PEPPER` je server-side tajna i ne smije biti `NEXT_PUBLIC_`.

Nemoj dodavati production tajne u kod. Za lokalni rad koristi `.env.local`, koji se ne commita. `.env.example` sadrži samo placeholder vrijednosti.

Ako `NEXT_PUBLIC_CONVEX_URL` nedostaje, `/novi` će prikazati developer-friendly poruku umjesto rušenja cijele aplikacije.

## Kako lokalno proći cijeli MVP flow

1. Pokreni `npx.cmd convex dev`.
2. Pokreni `npm.cmd run dev`.
3. Otvori `/novi` i kreiraj testni leksikon.
4. Spremi javni invite link i privatni link za pregled.
5. Otvori javni invite link i napravi 2-3 testna upisa.
6. Spremi privatni link za uređivanje i brisanje barem jednog upisa.
7. Otvori privatni link za pregled i provjeri da se upisi vide.
8. Otvori privatni link za uređivanje/brisanje, promijeni odgovor i provjeri admin dashboard.
9. Obriši testni upis i provjeri da se admin dashboard ažurirao.
10. Provjeri `/robots.txt`, `/sitemap.xml`, `/api/og` i `/api/og/lexicon/[slug]`.

Detaljni ručni checklist je u `docs/local-qa-checklist.md`.

## Ručni test javne pozivnice

Za test stvarne javne pozivnice prvo pokreni Convex i Next dev server, zatim:

1. Otvori `/novi`.
2. Kreiraj testni leksikon.
3. Kopiraj javni invite link iz success statea.
4. Otvori dobiveni `/l/[slug]` link.
5. Provjeri da CTA `Upiši se` vodi na `/l/[slug]/upis`.
6. Provjeri da se privatni link za pregled ne prikazuje na javnoj pozivnici.

## Ručni test upisa

Za test stvarnog upisa:

1. Otvori `/novi`.
2. Kreiraj testni leksikon.
3. Otvori invite link.
4. Klikni `Upiši se`.
5. Ispuni formu i potvrdi vlasnički consent.
6. Pošalji upis.
7. Spremi privatni link za uređivanje i brisanje iz success statea.
8. Klikni `Nastavi` i provjeri da vodi na `/l/[slug]/hvala`.
9. Provjeri da `/hvala` prikazuje thank-you/viralni loop i CTA `Napravi svoj leksikon`.
10. Provjeri da share/copy akcije na `/hvala` koriste samo javni invite link `/l/[slug]`.
11. Provjeri da `/hvala` ne prikazuje privatni link za uređivanje/brisanje, `entryId` ni token u URL-u.

## Ručni test admin dashboarda

Za test privatnog admin pregleda:

1. Otvori `/novi`.
2. Kreiraj testni leksikon.
3. Spremi privatni link za pregled iz success statea.
4. Otvori javni invite link i napravi nekoliko testnih upisa.
5. Otvori privatni link za pregled `/admin/[lexiconId]?token=...`.
6. Provjeri da dashboard prikazuje vlasnicu, naslov, broj upisa i status kviza.
7. Provjeri da vidiš aktivne upise i njihove odgovore.
8. Provjeri da su privatni/owner-only odgovori označeni kao `Privatno`.
9. Kopiraj javni invite link iz dashboarda i provjeri da ne sadrži `token`.
10. Otvori `/admin/[lexiconId]` bez tokena i provjeri invalid/private-link state.
11. Testiraj delete confirmation, ali pazi: potvrda radi soft delete stvarnog testnog leksikona.

## Ručni test edit/delete upisa

Za test privatnog edit/delete flowa:

1. Otvori `/novi`.
2. Kreiraj testni leksikon.
3. Otvori javni invite link.
4. Napravi testni upis.
5. Spremi privatni link za uređivanje i brisanje iz success statea.
6. Otvori `/e/[entryId]?token=...`.
7. Promijeni jedan odgovor, naljepnicu ili mood.
8. Spremi izmjene i provjeri success poruku.
9. Otvori privatni link za pregled i provjeri da se izmjena vidi.
10. Vrati se na privatni link za uređivanje/brisanje i obriši upis kroz confirmation.
11. Otvori privatni link za pregled i provjeri da upis više nije aktivan.
12. Otvori `/e/[entryId]` bez tokena i provjeri invalid/private-link state.

## Ručni test metadata i OG previewa

Za lokalnu provjeru metadata sloja pokreni Next dev server i otvori:

```text
http://localhost:3000/robots.txt
http://localhost:3000/sitemap.xml
http://localhost:3000/api/og
http://localhost:3000/api/og/lexicon/testni-leksikon
```

Provjeri da `robots.txt` ne blokira `/l/`, ali blokira `/admin/`, `/e/` i `/api/`. `sitemap.xml` smije sadržavati samo `/`, `/novi`, `/privacy` i `/terms`.

Za dinamični OG title na `/l/[slug]` treba raditi lokalni Convex i postavljen `NEXT_PUBLIC_CONVEX_URL`. Ako Convex nije dostupan, OG ruta namjerno vraća sigurni default preview bez privatnih podataka.

## Provjere

```bash
npm run lint
npm run qa
npm run test
npm run typecheck
npm run build
```
