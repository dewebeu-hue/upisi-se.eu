# Sigurnost i privatnost

`Upiši se` je osoban proizvod. Odgovori mogu biti nostalgični, smiješni ili neugodni, pa privatnost mora biti dio dizajna od prvog MVP-a.

## Osnovna pravila

- Nema javnog popisa leksikona.
- Nema javnog prikaza svih odgovora.
- Admin link mora imati token.
- Edit/delete link mora imati token.
- Tokeni se ne spremaju u plaintextu.
- Privatniji odgovori ne smiju biti javno vidljivi bez jasnog pristanka.
- Izbjegavati osjetljive podatke.
- Ne koristiti analytics dok nema jasne potrebe i consent flowa.

## Tokeni

Admin rute i edit/delete rute moraju provjeravati token, ne samo ID. Token se korisnici prikazuje samo kroz privatni link.

U bazi se mora spremati hash tokena, a ne originalni token.

## Inputi

Svi korisnički inputi moraju imati max length. Limiti se drže u `lib/limits.ts` i preslikavaju se u forme i Convex argument validaciju.

Privatnija pitanja trebaju biti opcionalna. Forma ne smije forsirati odgovore na pitanja koja korisnica možda ne želi podijeliti.

## Consent

Prije spremanja upisa treba jasno komunicirati:

- da vlasnica leksikona može vidjeti odgovor
- hoće li se odgovor koristiti u budućem kvizu ili recap prikazu
- što je opcionalno
- kako osoba može obrisati svoj upis

## Brisanje

Osoba koja se upisala mora moći obrisati svoj upis putem privatnog edit/delete linka.

Vlasnica mora moći obrisati cijeli leksikon preko privatnog admin linka.

## Podrška u Convex shemi

Schema podržava soft delete preko `status: "deleted"` i `deletedAt`, bez trenutnog hard delete/purge procesa.

Upisi imaju `consentOwnerView` za prikaz vlasnici i `consentQuizUse` za budući kviz/recap. Privatniji odgovori moraju ostati izvan javnih prikaza.

Privatni tokeni se spremaju samo kao hash polja: `adminTokenHash` za leksikon i `deleteTokenHash` za pojedini upis. Plaintext token ne smije biti spremljen u bazu.

`events` tablica ne smije spremati raw IP adresu, user-agent ni osobne podatke u `meta`.

## Analytics

U MVP-u nema Google Analyticsa, Meta Pixela ni drugog vanjskog trackinga. Ako kasnije uvedemo metrike, prvo treba definirati minimalni skup događaja, svrhu, retention i consent flow.

## Tokenizirani linkovi i hashiranje

Admin link vlasnice leksikona koristi privatni token u URL-u. Edit/delete link osobe koja se upisala također koristi privatni token u URL-u.

Token se korisnici prikazuje samo kao dio privatnog linka. U bazi se ne sprema plaintext token, nego hash dobiven preko helpera iz `lib/tokens.ts`.

Hash koristi token i server-side pepper iz env varijable. Pepper se ne smije hardkodirati, vraćati klijentu, pisati u dokumente baze ni logirati.

Tokeni se ne smiju logirati. Ako korisnica izgubi privatni link, MVP nema oporavak bez budućeg email/auth sustava.

## Validacija inputa

Svi tekstualni inputi imaju max length limite iz `lib/limits.ts`. Required polja se trimaju, normaliziraju i validiraju prije spremanja.

Odgovori se tretiraju kao plain text. Ne prikazujemo raw HTML i ne oslanjamo se na HTML sanitization library u MVP helperima.

Privatniji odgovori ostaju `ownerOnly` osim ako korisnica eksplicitno da consent za budući kviz/recap.

## Admin pristup bez login sustava

MVP nema korisničke račune. Vlasnica leksikona pristupa privatnom admin pregledu preko linka koji sadrži `lexiconId` i privatni token.

Baza ne sprema plaintext admin token. Sprema se samo `adminTokenHash`, dobiven hashiranjem tokena uz server-side `TOKEN_PEPPER`.

Ako vlasnica izgubi admin link, MVP nema recovery jer nema email ni auth sustav. Oporavak se može dodati kasnije tek uz jasan identitet korisnice i sigurni recovery flow.

Admin query i soft delete mutation ne smiju otkrivati je li problem u ID-u ili tokenu. Neuspjeh mora ostati generičan kako privatni linkovi ne bi curili kroz error poruke.

## Upisi prijateljica

Osoba koja se upiše dobiva privatni edit/delete link. Link sadrži token koji se korisnici prikazuje samo jednom, odmah nakon stvaranja upisa.

Baza ne čuva plaintext edit/delete token. U `entries.deleteTokenHash` sprema se samo hash tokena uz server-side `TOKEN_PEPPER`.

Vlasnica vidi upise samo kroz admin flow koji provjerava admin token. Javni invite link ne smije prikazivati privatne odgovore ni listu svih upisa.

Odgovori s `visibility: "ownerOnly"` ili `isPrivate: true` nisu javni. `consentQuizUse` kontrolira smiju li se odgovori koristiti u budućem kvizu; ako je `false`, taj upis se ne smije koristiti za quiz runde.

Soft delete upisa skriva upis iz admin pregleda, postavlja `status: "deleted"` i smanjuje `entryCount` na leksikonu. Broj upisa se ne smije spustiti ispod nule.

Kod upisa se ne logiraju tokeni, pepper, raw IP adrese, user-agent ni sadržaj odgovora u event metapodatke.

## Create flow i admin link

Privatni admin link prikazuje se samo nakon uspješnog kreiranja leksikona. Korisnica ga mora spremiti jer MVP nema email recovery, login ni drugi način povrata izgubljenog linka.

Admin token se smije nalaziti samo u privatnom linku prikazanom u success stateu. Frontend ga ne smije logirati, slati u analytics, spremati u `localStorage` ili skrivene browser storage mehanizme.

Ako create mutation ne uspije, UI mora prikazati generičku korisnu poruku bez stack tracea, tokena, peppera ili internih Convex detalja.

## Javna pozivnica

Javna pozivnica `/l/[slug]` ne prikazuje privatne upise, admin link, admin token ni hash vrijednosti. Prikazuje samo podatke koji su sigurni za share: vlasnicu, naslov, cover smjer i broj upisa.

Share tekst nikad ne smije sadržavati admin link ili token. Smije sadržavati samo javni invite link.

Javni slug nije tajna. Služi za pozivnicu i ne smije sam po sebi davati pristup admin pregledu, edit/delete flowu ili privatnim odgovorima.

## Forma za upis

Osoba koja se upiše dobiva privatni edit/delete link odmah nakon submitanja. Edit/delete token se prikazuje samo jednom kao dio tog linka i ne sprema se u `localStorage`, session storage, analytics ili logove.

`consentOwnerView` je obavezan jer vlasnica bez tog pristanka ne smije vidjeti upis. `consentQuizUse` je opcionalan i u UI-ju je default `false`.

Ako `consentQuizUse` ostane `false`, odgovori se šalju kao `ownerOnly` i ne smiju se koristiti u budućem kvizu. Privatno/secret pitanje nije quiz eligible i uvijek ostaje `ownerOnly`.

Share i thank-you flow ne smiju sadržavati edit/delete link. Taj link pripada samo osobi koja se upisala.

## Thank-you stranica nakon upisa

Ruta `/l/[slug]/hvala` je javna po slugu i koristi samo public-safe podatke leksikona. U URL-u ne smije nositi `entryId`, edit/delete token, admin token ni admin link.

Thank-you stranica smije nuditi viralni CTA za `/novi` i dijeljenje javne pozivnice `/l/[slug]`. Share tekst i clipboard akcije smiju sadržavati samo javni invite link.

Privatni edit/delete link prikazuje se samo odmah nakon uspješnog submitanja upisa. `/hvala` ga namjerno ne prikazuje i ne sprema ga u `localStorage`, session storage ili analytics.

## Privatni edit/delete flow upisa

Ruta `/e/[entryId]` ne smije raditi bez `token` query parametra. Edit/delete token se čita iz URL-a samo za provjeru pristupa pojedinom upisu i ne sprema se u `localStorage`, session storage, analytics ili logove.

Edit/delete token se ne smije dijeliti u grupu i ne prikazuje se u UI-ju kao zaseban tekst. Ako osoba izgubi privatni edit/delete link, MVP nema recovery bez budućeg email/auth sustava.

Admin link i edit/delete link su različiti. Admin link pripada vlasnici leksikona, a edit/delete link pripada osobi koja je napravila upis. Ti se linkovi ne smiju miješati u copy/share akcijama.

`deleteTokenHash` i `adminTokenHash` ne smiju se vraćati frontend UI-ju. Privatni odgovori ostaju označeni kao privatni i nakon uređivanja; ako se `consentQuizUse` isključi, odgovori se spremaju kao `ownerOnly`.

Soft delete upisa sakriva upis iz admin pregleda, ažurira broj upisa na leksikonu i ne radi fizičko brisanje dokumenta dok ne definiramo purge politiku.

## Privatni admin dashboard

Ruta `/admin/[lexiconId]` ne smije raditi bez `token` query parametra. Token se čita iz URL-a samo za provjeru privatnog admin pristupa i ne sprema se u `localStorage`, session storage, analytics ili logove.

Javni invite link i privatni admin link moraju ostati jasno odvojeni. Admin dashboard smije kopirati samo javni `/l/[slug]` link za dijeljenje frendicama; privatni admin link se ne smije slati drugima.

Vlasnica smije vidjeti `ownerOnly` i privatno označene odgovore jer je to svrha admin pregleda, ali takvi odgovori moraju biti jasno označeni kao privatni i ne smiju se pojaviti na javnoj pozivnici.

Soft delete leksikona preko admin dashboarda postavlja leksikon u obrisano stanje i skriva javnu pozivnicu i privatni admin pregled. U MVP-u nema recoveryja bez budućeg email/auth sustava, zato UI mora jasno reći da vlasnica treba spremiti privatni admin link.

## Metadata i indeksiranje

Globalni metadata i OG previewi smiju koristiti samo javno sigurne podatke. Javni invite `/l/[slug]` smije prikazati vlasnicu, naslov i osnovni poziv, ali ne smije dohvaćati upise, admin token, edit/delete tokene, hash vrijednosti ni privatne odgovore.

`/l/[slug]` ostaje dostupan crawlerima zbog chat previewa, ali ima `noindex` kako se pojedinačni leksikoni ne bi namjerno pojavljivali u rezultatima tražilica. `/l/[slug]/upis`, `/l/[slug]/hvala`, `/admin/[lexiconId]` i `/e/[entryId]` također imaju `noindex`.

`robots.txt` blokira `/admin/`, `/e/` i `/api/`, ali ne blokira `/l/`. Sitemap uključuje samo stabilne javne stranice: landing, kreiranje, privatnost i uvjete.

OG image rute koriste CSS, tekst i emoji bez vanjskih slika ili fontova. Ako Convex metadata dohvat nije dostupan lokalno, OG ruta vraća sigurni brendirani fallback bez privatnih podataka.

## Gamification Faza 1

Gamification u MVP-u smije motivirati korisnice kroz rezultat `Ti si...`, unlock progress i `Titule ekipe`, ali ne smije analizirati privatne odgovore ni stvarati javni prikaz upisa.

Rezultat nakon upisa računa se iz sigurnog seeda vezanog uz sam upis i UI odabire. Ne sprema se kao osjetljiv podatak, ne koristi `adminToken`, `deleteToken`, hash vrijednosti, pepper ni privatne odgovore.

`Titule ekipe` u adminu rade samo nad aktivnim upisima i koriste javno prikazivo ime/nadimak, ID i redoslijed. Privatni odgovori, owner-only odgovori i secret pitanja ne smiju ulaziti u izračun titula.

Share copy u gamified flowu smije sadržavati samo javni invite link. Ne smije sadržavati admin link, edit/delete link, token query parametre, hash vrijednosti ni sadržaj privatnih odgovora.

## Gamification Faza 2: read-only kviz

Kviz `Pogodi čiji je odgovor?` smije koristiti samo aktivne upise koji imaju `consentQuizUse: true`. U runde smiju ući samo odgovori s `visibility: "quizEligible"` i `isPrivate: false`.

Privatna pitanja, `ownerOnly` odgovori, optional secret odgovori i upisi bez consent-a za kviz ne smiju ući u kviz ni kao pitanje ni kao odgovor.

Kviz ne smije vraćati `entryId`, `adminToken`, `adminTokenHash`, `deleteTokenHash`, plaintext tokene, pepper ni privatne linkove. Izbori u kvizu prikazuju samo javno prikazivo ime/nadimak.

U Fazi 2 rezultat se ne sprema u bazu, ne postoji leaderboard, ne šalju se eventovi i ne uvodi se analytics. Ako kasnije uvedemo spremanje rezultata, treba zasebno definirati privacy pravila, retention i korisnički consent.

## Gamification Faza 3: shareable quiz rezultat

Faza 3 smije prikazati zabavnu titulu rezultata i omogućiti kopiranje ili WhatsApp/Viber share rezultata. Share tekst smije sadržavati samo naziv leksikona, ime vlasnice, javni quiz link, broj pogođenih odgovora i generičku titulu rezultata.

Share rezultat ne smije sadržavati privatne odgovore, konkretne odgovore iz kviza, `entryId`, admin link, edit/delete link, token query parametre, hash vrijednosti, pepper, IP adresu, user-agent ni druge interne podatke.

Rezultat se i dalje ne sprema u Convex, ne šalje se u analytics i ne postoji leaderboard. Titula rezultata računa se lokalno iz `score/totalRounds` i nije identitet ili profil korisnice.

## MVP privacy checklist

- Nema Google Analyticsa, Meta Pixela ni vanjskog trackinga.
- Nema auth providera ni korisničkih profila.
- Nema uploadanja slika.
- Nema payment flowa, Stripea ni premium plana.
- Privatni tokeni se ne spremaju u `localStorage` ili session storage.
- `adminTokenHash` i `deleteTokenHash` ne prikazuju se u UI-ju.
- Javni share link ne sadrži `token` query param.
- `/admin/[lexiconId]`, `/e/[entryId]`, `/l/[slug]/upis`, `/l/[slug]/hvala` i `/l/[slug]/kviz` imaju `noindex`.
- Sitemap ne uključuje privatne rute, flow rute, pojedinačne leksikone ni API rute.
- OG metadata i OG slike ne prikazuju privatne odgovore, hash vrijednosti ni privatne linkove.
