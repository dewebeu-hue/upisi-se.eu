# Launch readiness — upisi-se.eu

Ovaj dokument služi kao završni checklist prije soft launcha. Ne pokreće produkcijski deploy; opisuje što treba ručno provjeriti i postaviti.

## 1. Trenutni MVP scope

- Kreiranje leksikona bez registracije.
- Javni invite link `/l/[slug]`.
- Forma za upis prijateljice.
- Thank-you viralni loop nakon upisa.
- Privatni admin dashboard preko tokeniziranog linka.
- Edit/delete upisa preko privatnog tokeniziranog linka.
- Metadata, Open Graph preview, `robots.txt` i `sitemap.xml`.
- Privacy i Terms stranice.
- Bez registracije.
- Bez plaćanja.
- Bez analyticsa.
- Bez uploadanja slika.

## 2. Što nije dio soft launcha

- Auth/login.
- Email recovery.
- Stripe/payment.
- Premium teme.
- PDF export.
- Stvarni kviz.
- Upload slika.
- Analytics/pixel.
- Javni feed.
- Javni katalog leksikona.

## 3. Production env varijable

Potrebne varijable:

```env
NEXT_PUBLIC_CONVEX_URL=<production-convex-url>
TOKEN_PEPPER=<long-random-server-secret>
NEXT_PUBLIC_SITE_URL=https://upisi-se.eu
```

- `NEXT_PUBLIC_CONVEX_URL` je javna frontend varijabla.
- `TOKEN_PEPPER` je server-side secret i ne smije imati `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_SITE_URL` za produkciju treba biti `https://upisi-se.eu`.
- Stvarne vrijednosti ne idu u repo.
- `.env.local` se ne commita.
- `.env.example` smije sadržavati samo placeholder vrijednosti.

## 4. Convex production checklist

- [ ] Production deployment je u EU regiji.
- [ ] Schema validation prolazi.
- [ ] Ako postoje legacy `lexicons` dokumenti, odrađen je `backfillLexiconDefaults`.
- [ ] `TOKEN_PEPPER` je postavljen u Convex env varijablama gdje ga Convex funkcije čitaju.
- [ ] `createLexicon` radi.
- [ ] `createEntry` radi.
- [ ] `listEntriesForAdmin` radi.
- [ ] `getEntryForEdit` radi.
- [ ] Soft delete leksikona radi.
- [ ] Soft delete upisa radi.
- [ ] U bazi nema plaintext tokena; postoje samo hash polja.

## 5. Vercel checklist

- [ ] Repo je spojen na Vercel.
- [ ] Build command je ispravan.
- [ ] Production env varijable su postavljene.
- [ ] Custom domain `upisi-se.eu` je dodan.
- [ ] `www.upisi-se.eu` je dodan ili redirectan.
- [ ] SSL je validan.
- [ ] `NEXT_PUBLIC_SITE_URL=https://upisi-se.eu`.
- [ ] Preview deploy radi.
- [ ] Production deploy radi.
- [ ] Nakon deploya otvoriti `/`, `/novi`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml` i `/api/og`.

Ako se Convex deploy veže uz Vercel build, očekivani production build može biti:

```bash
npx convex deploy --cmd 'npm run build'
```

Trenutni repo ne mijenja build command automatski. Ovo je ručni production korak dok se ne potvrdi Vercel/Convex setup.

## 6. DNS/domain checklist

- [ ] A/CNAME zapisi su uneseni prema vrijednostima koje Vercel pokaže za domenu.
- [ ] Root domain `upisi-se.eu` radi.
- [ ] `www.upisi-se.eu` radi ili redirecta na root domain.
- [ ] HTTPS radi.
- [ ] `/robots.txt` je dostupan.
- [ ] `/sitemap.xml` je dostupan.

Ne hardkodirati DNS vrijednosti u repo; koristiti vrijednosti iz Vercel domain setupa.

## 7. Pre-launch QA checklist

- [ ] Landing `/`.
- [ ] Kreiranje leksikona na `/novi`.
- [ ] Javni invite `/l/[slug]`.
- [ ] Submit upisa na `/l/[slug]/upis`.
- [ ] Thank-you stranica `/l/[slug]/hvala`.
- [ ] Privatni admin dashboard `/admin/[lexiconId]?token=...`.
- [ ] Edit upisa `/e/[entryId]?token=...`.
- [ ] Delete upisa.
- [ ] Delete leksikona.
- [ ] Invalid admin token.
- [ ] Invalid edit token.
- [ ] Mobile viewport oko 375 px.
- [ ] OG image `/api/og/lexicon/[slug]`.
- [ ] `/robots.txt`.
- [ ] `/sitemap.xml`.
- [ ] Javni share link ne sadrži admin/edit token.

## 8. Privacy/security checklist

- [ ] Nema analyticsa.
- [ ] Nema upload slika.
- [ ] Nema autha.
- [ ] Nema paymenta.
- [ ] Tokeni nisu u `localStorage` ili session storage.
- [ ] Admin token nije na javnim rutama.
- [ ] Edit token nije na `/hvala`.
- [ ] Hash vrijednosti nisu u UI-ju.
- [ ] Share link ne sadrži tokene.
- [ ] Private rute su `noindex` i disallowane gdje treba.
- [ ] Sitemap ne sadrži privatne rute.
- [ ] Privacy i Terms postoje.
- [ ] Aplikacija nije namijenjena djeci mlađoj od 16 godina.
- [ ] Korisnica može obrisati svoj upis.
- [ ] Vlasnica može soft deleteati leksikon.

## 9. Soft launch plan

- Poslati link u 2-3 male WhatsApp/Viber grupe.
- Jasno reći da je beta.
- Ručno pratiti:
  - koliko ljudi kreira leksikon
  - koliko upisa nastaje po leksikonu
  - gdje korisnice zapinju
  - šalju li dalje javni link
- Ne uvoditi plaćanje prije feedbacka.
- Ne uvoditi analytics dok se ne riješi consent flow.
- Zapisivati kvalitativni feedback iz poruka, bez kopiranja privatnih odgovora iz leksikona.

## 10. Go / No-go odluka

DEMO READY:

- `npm run qa` prolazi.
- Lokalni Convex i Next rade.
- Ručni happy path prolazi barem jednom.

SOFT LAUNCH READY:

- Production env varijable su postavljene.
- Convex production schema i funkcije rade.
- Custom domena i SSL rade.
- Privacy/Terms su vidljivi.
- Ručni pre-launch QA prolazi.

PRODUCTION READY:

- Soft launch nema poznate kritične bugove.
- DNS, Vercel i Convex production setup su potvrđeni.
- Nema poznatog token leakagea.
- Postoji plan za support i ručno brisanje/problematične slučajeve.
