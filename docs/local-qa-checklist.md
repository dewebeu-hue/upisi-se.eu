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
- Dodatna pitanja: prvo ih ostavi praznima, zatim u drugom testu otvori sekciju `Želim ispuniti još pitanja ✨` i popuni barem `MSN status`, `najveća drama` i `tajna poruka`.

## B) Happy path

- Otvori `/`.
- Provjeri da CTA `Vidi primjer pozivnice` otvara `/demo/pozivnica`.
- Otvori `/novi`.
- Promijeni nekoliko tema korica i provjeri da se CoverPreview vidljivo mijenja.
- Promijeni nekoliko paketa pitanja i provjeri da preview pitanja ispod odabira stvarno mijenja sadržaj.
- Kreiraj leksikon.
- Kopiraj javni invite link.
- Kopiraj privatni link za pregled.
- Otvori invite link.
- Klikni `Upiši se`.
- Provjeri da `/l/[slug]/upis` prikazuje pitanja iz odabranog paketa, a ne generički isti set za svaki leksikon.
- Ispuni osnovna pitanja u formi.
- Provjeri da je sekcija `Želim ispuniti još pitanja ✨` zatvorena po defaultu.
- Pošalji upis s praznim dodatnim pitanjima i provjeri da submit nije blokiran.
- Provjeri da success state nakon upisa prikazuje karticu `Ti si...` i CTA `Napravi svoj leksikon`.
- U drugom prolazu otvori dodatna pitanja, popuni nekoliko optional odgovora i provjeri da se spremaju u admin pregledu.
- Provjeri da `Tajna poruka samo za vlasnicu leksikona` ne ide u kviz i ostaje owner-only.
- Spremi privatni link za uređivanje i brisanje upisa.
- Otiđi na `/hvala`.
- Otvori privatni link za pregled.
- Provjeri da se upis vidi u admin dashboardu.
- Otvori privatni link za uređivanje i brisanje.
- Promijeni jedan odgovor i spremi.
- Vrati se u admin dashboard i provjeri da je izmjena vidljiva.
- Nakon najmanje 3 aktivna upisa provjeri da admin prikazuje `Titule ekipe`.
- Nakon 5 aktivnih upisa provjeri da progress kaže da ima dovoljno upisa za budući kviz, ali da se stvarni kviz još ne otvara.
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
- Provjeri da `/l/nepostojeci-slug` prikazuje `Leksikon nije pronađen`, a ne production crash.
- Pokušaj submitati `/novi` bez required polja.
- Pokušaj submitati `/l/[slug]/upis` bez required polja.
- Otvori dodatna pitanja i ostavi ih praznima; provjeri da prazni optional odgovori ne stvaraju validation error.
- Pokušaj predugi odgovor u formi upisa.
- Pokušaj poslati upis bez `consentOwnerView`.
- Isključi `consentQuizUse` i provjeri da se odgovori u adminu tretiraju kao owner-only za budući kviz.
- Privremeno ukloni `NEXT_PUBLIC_CONVEX_URL` i provjeri missing Convex state.

## D) Privacy/security checks

- Privatni link za pregled ne pojavljuje se na javnoj pozivnici.
- Privatni link za uređivanje i brisanje ne pojavljuje se na `/hvala`.
- `adminTokenHash` se nikad ne prikazuje u UI-ju.
- `deleteTokenHash` se nikad ne prikazuje u UI-ju.
- Javni share link ne sadrži `token`.
- Admin dashboard kopira samo javni invite link.
- Kartica `Ti si...`, unlock progress i `Titule ekipe` ne prikazuju admin token, edit/delete token, hash vrijednosti ni privatne linkove.
- `/sitemap.xml` ne uključuje `/admin/`, `/e/`, `/l/[slug]`, `/l/[slug]/upis`, `/l/[slug]/hvala` ni `/api/`.
- Privatne i flow rute imaju `noindex`.
- Nema Google Analyticsa, Meta Pixela, tracking skripti, Stripea, autha ni uploadanja slika.

## E) UI/mobile checks

- Cover theme badge i CoverPreview izgled ostaju dosljedni na invite, upis, hvala i admin stranicama.
- Testiraj barem dva različita paketa pitanja i potvrdi da se labeli/form fields razlikuju.
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
- Otvori `/demo/pozivnica` i provjeri da ima `noindex`.
- Otvori `/api/og`.
- Otvori `/api/og/lexicon/[slug]`.
- Provjeri da OG preview ne sadrži privatne linkove, tokene, hash vrijednosti ni odgovore.
- Provjeri da `/l/[slug]` ima OG image referencu i `noindex`.
