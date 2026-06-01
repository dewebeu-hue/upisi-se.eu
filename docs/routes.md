# Plan ruta

Ovo je plan javnih i privatnih ruta za lokalni MVP.

## Rute

| Ruta | Namjena | Status |
| --- | --- | --- |
| `/` | Landing stranica | Postoji |
| `/novi` | Kreiranje novog leksikona | Prva forma + Convex mutation |
| `/l/[slug]` | Javna pozivnica leksikona | Convex query + prazno/loading/error stanje |
| `/l/[slug]/upis` | Forma za upis prijateljice | Prva forma + Convex mutation |
| `/l/[slug]/hvala` | Thank-you stranica nakon upisa | Javni viralni CTA bez privatnih tokena |
| `/demo/pozivnica` | Statički primjer javne pozivnice | Demo bez Convex queryja |
| `/admin/[lexiconId]` | Privatni admin pregled | Convex query, zahtijeva `token` query param |
| `/e/[entryId]` | Edit/delete upisa | Convex query/mutations, zahtijeva `token` query param |
| `/privacy` | Beta politika privatnosti | Placeholder tekst |
| `/terms` | Beta uvjeti korištenja | Placeholder tekst |

## Pravila ruta

- Route helperi žive u `lib/routes.ts`.
- Helperi vraćaju relativne pathove.
- Route helperi ne smiju hardkodirati `localhost`.
- Ako ruta prima token, token se dodaje kao query param.
- Admin i edit/delete rute moraju provjeravati token.
- Javni invitation slug ne smije otkrivati privatne admin podatke.
- Apsolutni URL-ovi za metadata/share sloj grade se preko `NEXT_PUBLIC_SITE_URL`, uz lokalni fallback `http://localhost:3000`.
- Sitemap smije sadržavati samo stabilne javne stranice: `/`, `/novi`, `/privacy` i `/terms`.
- Robots pravila ne smiju blokirati `/l/` jer chat i crawler previewi trebaju dohvatiti metadata i OG sliku, ali pojedinačne invite stranice ostaju `noindex`.
- Admin, edit/delete, submit i thank-you rute moraju imati `noindex`.

## `/l/[slug]` javna pozivnica

Ruta `/l/[slug]` je javna i koristi slug kao čitljiv dio linka koji se dijeli u WhatsApp/Viber grupi.

Stranica dohvaća leksikon preko `getPublicLexiconBySlug` i prikazuje samo public-safe podatke: naslov, vlasnicu, temu/korice, broj upisa i status kviza. Ne prikazuje `adminToken`, `adminTokenHash`, privatni admin link, edit/delete tokene ni same upise.

Primarna akcija vodi na `/l/[slug]/upis`. Sekundarna akcija vodi na `/novi` za osobu koja želi napraviti svoj leksikon.

Metadata za ovu rutu koristi samo public-safe podatke. Ako server-side Convex dohvat nije dostupan lokalno, stranica i OG ruta koriste brendirani fallback bez privatnih podataka.

OG slika za invite link nalazi se na `/api/og/lexicon/[slug]`. Ruta smije prikazati vlasničko ime i javni poziv, ali ne smije čitati admin token, upise, edit/delete tokene ni privatne odgovore.

Ako slug ne postoji, ako je leksikon obrisan ili ako Convex query ne uspije, stranica mora prikazati siguran not-found/error state bez stack tracea i internih Convex detalja.

## `/demo/pozivnica` statički demo

Ruta `/demo/pozivnica` je statički primjer javne pozivnice. Ne koristi Convex query, ne sprema podatke i služi kao siguran odredišni URL za landing CTA `Vidi primjer pozivnice`.

Demo mora jasno reći da je riječ o primjeru. CTA `Napravi svoj leksikon` vodi na `/novi`, a demo ne glumi stvarni submit upisa.

Ruta ima `noindex` i ne ulazi u sitemap jer nije SEO landing stranica.

## `/l/[slug]/upis` forma za upis

Ruta `/l/[slug]/upis` je javna ruta za osobu koja je dobila invite link. Učitava public-safe leksikon po slugu preko `getPublicLexiconBySlug`, zatim sprema upis preko `createEntry`.

Forma ne zahtijeva registraciju. Nakon submitanja prikazuje privatni edit/delete link koji osoba mora spremiti ako želi kasnije urediti ili obrisati svoj upis.

Forma ima dvije grupe pitanja:

- osnovna pitanja su odmah vidljiva i drže flow kratkim
- dodatna pitanja su opcionalna i zatvorena po defaultu u sekciji `Želim ispuniti još pitanja ✨`

Prazna dodatna pitanja se ne šalju u `answers` array. Ako je dodatno pitanje popunjeno, validira se prema svom `maxLength`. Privatno `optionalSecret` pitanje sprema se samo ako nije prazno, označeno je kao `ownerOnly` i ne ulazi u budući kviz.

Ako osoba ne potvrdi consent za budući kviz, svi odgovori se spremaju s vidljivošću `ownerOnly`, čak i kada je pitanje inače quiz-eligible. Ako je consent uključen, samo neprivatna quiz-eligible pitanja mogu dobiti `quizEligible` vidljivost.

Nakon uspješnog spremanja CTA `Nastavi` vodi na `/l/[slug]/hvala`. Taj thank-you flow ne smije sadržavati privatni edit/delete token.

Ruta je `noindex` jer je dio interakcijskog flowa, ne javna landing stranica za tražilice.

## `/l/[slug]/hvala` thank-you stranica

Ruta `/l/[slug]/hvala` je javna stranica po slugu. Dohvaća samo public-safe podatke leksikona preko `getPublicLexiconBySlug` i služi za viralni loop nakon upisa.

Stranica ne čita `entryId`, `token`, admin token ni edit/delete token iz query parametara. Ne prikazuje privatni edit/delete link jer se taj link prikazuje samo odmah nakon slanja upisa.

Primarna akcija vodi na `/novi` kako bi osoba mogla napraviti svoj leksikon. Sekundarne akcije smiju kopirati ili dijeliti samo javni invite link `/l/[slug]`.

Ruta je `noindex` jer je post-submit state i ne treba ulaziti u sitemap ni rezultate tražilice.

## `/admin/[lexiconId]` privatni admin pregled

Ruta `/admin/[lexiconId]` je privatna ruta za vlasnicu leksikona i zahtijeva `token` query parametar. Bez tokena ili s neispravnim tokenom prikazuje generički invalid/private-link state i ne otkriva je li problem u ID-u, tokenu ili obrisanom leksikonu.

Dashboard koristi admin token provjeru preko `listEntriesForAdmin`. Prikazuje osnovne podatke leksikona, status kviza, javni invite link `/l/[slug]` i aktivne upise prijateljica.

Admin pregled ne prikazuje `adminTokenHash`, `deleteTokenHash`, plaintext tokene ni privatni admin link kao shareable vrijednost. Copy/share akcija u dashboardu smije kopirati samo javni invite link.

Vlasnica kroz ovu rutu može soft deleteati leksikon preko `softDeleteLexicon`. Soft delete skriva javnu pozivnicu i admin pregled, ali ne radi fizičko brisanje dok ne definiramo purge politiku.

Ruta je disallowana u `robots.txt` i dodatno ima `noindex, nofollow`.

## `/e/[entryId]` privatni edit/delete upisa

Ruta `/e/[entryId]` je privatna ruta za osobu koja se upisala u leksikon i zahtijeva `token` query parametar. Bez tokena ili s neispravnim tokenom prikazuje generički invalid/private-link state i ne otkriva je li problem u ID-u, tokenu, obrisanom upisu ili obrisanom leksikonu.

Edit/delete flow koristi `getEntryForEdit` za dohvat postojećeg upisa, `updateEntry` za spremanje promjena i `softDeleteEntry` za brisanje upisa. Ruta ne služi za admin uređivanje tuđih upisa.

Stranica ne prikazuje `deleteTokenHash`, `adminTokenHash`, plaintext tokene ni admin podatke. Nakon spremanja ili brisanja smije voditi samo na javnu pozivnicu `/l/[slug]` ili na `/novi`.

Ruta je disallowana u `robots.txt` i dodatno ima `noindex, nofollow`.

## Metadata i OG rute

- Globalni metadata živi u `app/layout.tsx`.
- Default share slika generira se kroz `/api/og`.
- Dinamična share slika za javnu pozivnicu generira se kroz `/api/og/lexicon/[slug]`.
- OG rute su isključene iz robots crawlanja preko `/api/`, ali se mogu direktno dohvatiti kada ih metadata referencira.
- OG slike koriste samo tekst, emoji i CSS. Nema vanjskih slika, Google fontova ni privatnih podataka.
- `/admin/[lexiconId]`, `/e/[entryId]`, `/l/[slug]/upis` i `/l/[slug]/hvala` ne ulaze u sitemap.

## Primjeri

```ts
newLexiconPath(); // /novi
lexiconInvitePath("moj-leksikon"); // /l/moj-leksikon
adminPath("abc123", "tajni-token"); // /admin/abc123?token=tajni-token
editEntryPath("entry123", "tajni-token"); // /e/entry123?token=tajni-token
```
