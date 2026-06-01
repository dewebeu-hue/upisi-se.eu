# Lokalni QA checklist

Ovaj checklist služi za završni lokalni prolaz MVP flowa prije launch-readiness koraka. Cilj nije dodavati nove featuree, nego potvrditi da postojeći flow radi, da privatni linkovi ostaju privatni i da UI izgleda kao jedan proizvod.

## A) Setup

- Pokreni `npm install`.
- Pokreni `npx.cmd convex dev`.
- Provjeri `.env.local`:
  - `NEXT_PUBLIC_CONVEX_URL`
  - `TOKEN_PEPPER`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- Pokreni `npm.cmd run dev`.
- Otvori `http://localhost:3000`.

## Demo vrijednosti za ručni test

Ako ne koristiš dev seed, unesi testne podatke ručno:

- Ime vlasnice: `Ana`
- Naziv leksikona: `Anin leksikon iz 2002.`
- Korice: `Rozi gel pen`
- Paket pitanja: `Osnovna 1998.`
- Ime upisa: `Maja iz 8.b`
- Pjesma: `Freestyler`
- Uspomena: `Veliki odmor, sendvič iz pekare i planovi za subotu.`
- Uloga u ekipi: `Organizatorica drame`
- Inicijali simpatije: ostavi prazno ili upiši testne inicijale
- Poruka za kraj: `Ovo je testni upis za lokalni QA.`

## B) Happy path

- Otvori `/`.
- Otvori `/novi`.
- Kreiraj leksikon.
- Kopiraj javni invite link.
- Kopiraj privatni link za pregled.
- Otvori invite link.
- Klikni `Upiši se`.
- Ispuni formu.
- Spremi privatni link za uređivanje i brisanje upisa.
- Otiđi na `/hvala`.
- Otvori privatni link za pregled.
- Provjeri da se upis vidi u admin dashboardu.
- Otvori privatni link za uređivanje i brisanje.
- Promijeni jedan odgovor i spremi.
- Vrati se u admin dashboard i provjeri da je izmjena vidljiva.
- Obriši upis.
- Vrati se u admin dashboard i provjeri da upis više nije aktivan.
- Obriši leksikon.
- Otvori javni invite link i provjeri da više ne prikazuje aktivan leksikon.

## C) Negative path

- Otvori `/admin/[id]` bez tokena.
- Otvori `/admin/[id]?token=wrong`.
- Otvori `/e/[id]` bez tokena.
- Otvori `/e/[id]?token=wrong`.
- Otvori `/l/nepostojeci-slug`.
- Pokušaj submitati `/novi` bez required polja.
- Pokušaj submitati `/l/[slug]/upis` bez required polja.
- Pokušaj predugi odgovor u formi upisa.
- Pokušaj poslati upis bez `consentOwnerView`.
- Privremeno ukloni `NEXT_PUBLIC_CONVEX_URL` i provjeri missing Convex state.

## D) Privacy/security checks

- Privatni link za pregled ne pojavljuje se na javnoj pozivnici.
- Privatni link za uređivanje i brisanje ne pojavljuje se na `/hvala`.
- `adminTokenHash` se nikad ne prikazuje u UI-ju.
- `deleteTokenHash` se nikad ne prikazuje u UI-ju.
- Javni share link ne sadrži `token`.
- Admin dashboard kopira samo javni invite link.
- `/sitemap.xml` ne uključuje `/admin/`, `/e/`, `/l/[slug]`, `/l/[slug]/upis`, `/l/[slug]/hvala` ni `/api/`.
- Privatne i flow rute imaju `noindex`.
- Nema Google Analyticsa, Meta Pixela, tracking skripti, Stripea, autha ni uploadanja slika.

## E) UI/mobile checks

- Mobile landing nema horizontalni scroll.
- Mobile `/novi` ima pune širine inpute i jasan primarni CTA.
- Mobile invite jasno razlikuje `Upiši se` od `Napravi svoj leksikon`.
- Mobile entry form ima čitljive label-e, checkboxe i error poruke.
- Mobile thank-you ne prikazuje privatni edit/delete link.
- Mobile admin kartice i dugi odgovori se prelamaju.
- Mobile edit/delete forma jasno odvaja spremanje od opasne zone.
- Focus states su vidljivi na linkovima, inputima, checkboxima i gumbima.
- Button tap targeti su dovoljno veliki.
- Kontrast teksta je čitljiv na papirnatim podlogama.
- Nema horizontalnog scrolla na širinama oko 375 px.

## F) Metadata/OG checks

- Otvori `/robots.txt`.
- Otvori `/sitemap.xml`.
- Otvori `/api/og`.
- Otvori `/api/og/lexicon/[slug]`.
- Provjeri da OG preview ne sadrži privatne linkove, tokene, hash vrijednosti ni odgovore.
- Provjeri da `/l/[slug]` ima OG image referencu i `noindex`.
