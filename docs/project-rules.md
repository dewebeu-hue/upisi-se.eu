# Pravila projekta

Ova pravila vrijede za buduće promjene u projektu `Upiši se`.

## Product pravila

- UI copy je na hrvatskom.
- Flow je mobile-first.
- Projekt ostaje jednostavan i lokalno pokretljiv.
- Nema registracije dok je eksplicitno ne uvedemo.
- Nema plaćanja dok ga eksplicitno ne uvedemo.
- Nema javnog feeda i javnog pretraživanja leksikona.
- Nema uploadanja slika u MVP-u.

## Tehnička pravila

- Koristi npm dok god je `package-lock.json` prisutan.
- Ne dodavati velike dependencyje bez jasne potrebe.
- Ne uvoditi dodatne CSS frameworke.
- Ne uvoditi animacijske biblioteke za placeholder UI.
- Ne dodavati vanjske fontove preko CDN-a.
- Ne hardkodirati `localhost` u route helperima.
- Ne hardkodirati production Convex URL.
- Ne commitati production tajne ni lokalne `.env.local` vrijednosti.

## Integracije koje nisu dopuštene bez posebne odluke

- Auth provider, uključujući Clerk, Auth.js ili slične pakete.
- Stripe ili bilo koji payment provider.
- Google Analytics, Meta Pixel ili bilo kakav vanjski tracking.
- Cookie consent banner dok nema neesencijalnih kolačića.

## Sigurnost i podaci

- Sve korisničke inpute treba validirati.
- Sve Convex funkcije moraju imati argument validaciju.
- Svi tokeni se moraju hashirati prije spremanja.
- Privatni odgovori se ne smiju prikazivati javno.
- Admin rute se ne smiju oslanjati samo na ID.
- Delete/edit rute se ne smiju oslanjati samo na ID.
- Inputi moraju imati max length limite.
- Izbjegavati osjetljive podatke i pitanja koja bi korisnice mogla dovesti u neugodan položaj.

## UX pravila

- Primarna akcija mora biti jasna na svakoj stranici.
- Placeholder stranice moraju jasno reći što će tu kasnije biti.
- Greške, prazna stanja i uspješni završeci moraju imati koristan hrvatski copy.
- Retro estetika treba biti topla i nostalgična, ali UI mora ostati čitljiv i jednostavan.

## Design system pravila

- UI se dizajnira product-first: prvo flow i hijerarhija, zatim vizualni detalji.
- Retro detalji služe za toplinu i prepoznatljivost, ne za vizualni nered.
- Ne koristiti vanjske fontove, remote assete ni slike s interneta za osnovni MVP UI.
- Emoji, CSS naljepnice, tape elementi, grid/line pozadine i system fontovi su dopušteni.
- Boje se koriste semantički: pozadina, papir, tekst, muted tekst, primarna akcija, danger, success i dekorativni akcenti.
- Komponente moraju biti reusable, mobile-first i state-aware: hover, focus, active, disabled, empty, error i success stanja gdje imaju smisla.
- Accessibility i focus-visible stanja su dio kvalitete, ne dodatak.
- UI copy ostaje hrvatski, kratak i koristan.
