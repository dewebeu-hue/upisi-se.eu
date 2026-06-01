# Convex data model

Ovaj dokument opisuje MVP podatkovni model za `Upiši se`. Model podržava digitalne leksikone bez korisničkih računa: javna pozivnica ide preko sluga, a privatni admin i edit/delete pristup idu preko tokeniziranih linkova čiji se tokeni u bazi spremaju samo kao hash.

## Zašto nema korisničkih računa

MVP je namijenjen brzom dijeljenju u WhatsApp/Viber grupama. Registracija bi dodala trenje na najvažnijem mjestu: korisnica treba brzo napraviti leksikon, poslati link i dobiti prve upise. Umjesto auth sustava, MVP koristi privatne linkove s tokenima.

## Linkovi i tokeni

Javni slug link je `/l/[slug]`. Slug je javan i služi samo za pozivnicu leksikona.

Privatni admin token link je `/admin/[lexiconId]?token=...`. Admin token se nikad ne sprema kao plaintext. U tablici `lexicons` postoji samo `adminTokenHash`.

Privatni edit/delete token link je `/e/[entryId]?token=...`. Token za brisanje ili uređivanje upisa se nikad ne sprema kao plaintext. U tablici `entries` postoji samo `deleteTokenHash`.

## Soft delete

MVP koristi soft delete: dokument dobiva `status: "deleted"` i `deletedAt`. To čuva konzistentnost dok ne uvedemo sigurnu politiku purgeanja. Stvarno brisanje iz baze ili periodični purge može se dodati kasnije, uz jasna pravila i testove.

## Tablice

### lexicons

Jedan dokument predstavlja jedan leksikon koji kreira vlasnica.

Ključna polja:
- `slug`: javni URL dio za pozivnicu.
- `ownerName`: ime vlasnice koje se može prikazati na pozivnici.
- `title`: naziv leksikona.
- `theme`, `coverStyle`, `questionPackKey`: izbor vizualnog i sadržajnog smjera.
- `adminTokenHash`: hash privatnog admin tokena.
- `entryCount`, `quizUnlockEntryCount`, `quizUnlocked`: brzi status za poruku poput `0/5 upisa do kviza`.
- `status`, `createdAt`, `updatedAt`, `deletedAt`: lifecycle i timestamp polja.

Indeksi:
- `by_slug`: brz dohvat javne pozivnice po slugu.
- `by_status_createdAt`: pregled aktivnih ili obrisanih leksikona u vremenskom redoslijedu.
- `by_createdAt`: osnovni interni vremenski pregled bez filtriranja po statusu.

Privatnosna napomena: `adminTokenHash` nikad nije plaintext token. Javni slug ne smije dati pristup admin podacima.

UI labeli se ne spremaju kao validacijski ključevi. Forma prikazuje labele poput `Turbo 2002`, ali mutation payload šalje stabilne keyjeve poput `turbo-2002`. Za MVP `theme` i `coverStyle` privremeno koriste isti canonical cover key.

Canonical cover/theme keyjevi:

- `grid-notebook`
- `pink-gel-pen`
- `y2k-sparkle`
- `spomenar`
- `turbo-2002`

Canonical question pack keyjevi:

- `osnovna-1998`
- `srednja-2004`
- `reunion`
- `djevojacka`

`theme` i `coverStyle` nisu samo metadata: UI ih koristi za isti vizualni stil kroz javnu pozivnicu, formu upisa, thank-you stranicu i privatni admin pregled. Ako je key nepoznat ili dolazi iz starijeg dokumenta, frontend koristi fallback `grid-notebook`.

`questionPackKey` bira stvarni set pitanja u `/l/[slug]/upis`. Pitanja su trenutačno centralizirana u `lib/question-packs.ts`, a buduća Convex `questionPacks` tablica može preuzeti isti shape. Ako je key nepoznat, forma koristi fallback `osnovna-1998`.

### entries

Jedan dokument predstavlja jedan upis prijateljice u leksikon.

Ključna polja:
- `lexiconId`: veza na leksikon.
- `displayName`: ime ili nadimak osobe koja se upisuje.
- `answers`: strukturirani odgovori s `questionId`, tekstom pitanja, odgovorom, vidljivošću i oznakom privatnosti.
- `stickerId`, `mood`: opcionalni lagani retro detalji.
- `deleteTokenHash`: hash privatnog edit/delete tokena.
- `consentOwnerView`: pristanak da vlasnica vidi upis.
- `consentQuizUse`: pristanak da se odgovori smiju koristiti u budućem kvizu.
- `status`, `createdAt`, `updatedAt`, `deletedAt`: lifecycle i timestamp polja.

Indeksi:
- `by_lexiconId`: dohvat upisa za jedan leksikon.
- `by_lexiconId_status_createdAt`: dohvat aktivnih upisa za admin pregled u vremenskom redoslijedu.
- `by_status_createdAt`: interni pregled po statusu.

Privatnosna napomena: privatniji odgovori (`isPrivate: true` ili `visibility: "ownerOnly"`) ne smiju se javno prikazivati. `consentOwnerView` mora kasnije biti `true` prije spremanja upisa.

### questionPacks

Paketi pitanja za različite modeove, npr. osnovna, srednja, djevojačka ili reunion.

Ključna polja:
- `key`: stabilni identifikator paketa.
- `name`, `description`, `theme`: copy i smjer paketa.
- `questions`: pitanja s tipom, optional helper tekstom, required oznakom, privatnosti, quiz eligibilityjem i max length limitom.
- `active`, `sortOrder`: kontrola prikaza i redoslijeda.
- `createdAt`, `updatedAt`: timestamp polja.

Indeksi:
- `by_key`: brz dohvat paketa po ključu.
- `by_active_sortOrder`: prikaz aktivnih paketa u stabilnom redoslijedu.

Privatnosna napomena: `optionalSecret` pitanja, poput inicijala simpatije, moraju ostati opcionalna. `quizEligible` određuje smije li pitanje ući u budući kviz.

### quizRounds

Budući trajni model za “Pogodi čiji je odgovor?” kviz. Faza 2 trenutno ne piše u ovu tablicu; read-only query `quiz:getQuizBySlug` privremeno gradi runde iz aktivnih upisa koji imaju quiz consent i javno dopuštene odgovore.

Ključna polja:
- `lexiconId`: leksikon kojem runda pripada.
- `entryId`: upis iz kojeg odgovor dolazi.
- `questionId`: pitanje koje se pogađa.
- `answer`: odgovor koji ulazi u rundu.
- `status`, `createdAt`: lifecycle i timestamp.

Indeksi:
- `by_lexiconId`: dohvat quiz rundi za leksikon.
- `by_lexiconId_status_createdAt`: aktivne runde za leksikon u vremenskom redoslijedu.
- `by_entryId`: dohvat rundi vezanih uz jedan upis.

Privatnosna napomena: u quiz runde ne smiju ulaziti privatni odgovori, owner-only odgovori, optional secret odgovori ni odgovori bez `consentQuizUse`.

### events

Minimalni interni product event log bez third-party analyticsa.

Ključna polja:
- `type`: dopušteni event tipovi poput `lexicon_created`, `invite_opened`, `entry_submitted` ili `quiz_unlocked`.
- `lexiconId`, `entryId`: opcionalne veze na relevantne dokumente.
- `createdAt`: timestamp.
- `meta`: opcionalni mali objekt sa `source` i `label`.

Indeksi:
- `by_type_createdAt`: pregled eventa po tipu i vremenu.
- `by_lexiconId_createdAt`: pregled eventa za jedan leksikon.
- `by_createdAt`: osnovni vremenski pregled.

Privatnosna napomena: `events` ne smije sadržavati raw IP adresu, user-agent, osobne podatke ili slobodni tekst koji može otkriti identitet osobe. Ovo nije Google Analytics zamjena, nego minimalni interni log za MVP odluke.

## Helperi za slugove, tokene i validaciju

`adminTokenHash` i `deleteTokenHash` nastaju preko helpera iz `lib/tokens.ts`. Helper hashira kombinaciju tokena i server-side peppera; plaintext token se ne sprema u bazu.

Slug nastaje preko helpera iz `lib/slug.ts`. Taj helper normalizira hrvatska slova, čisti nedopuštene znakove i ograničava slug na 64 znaka.

Stvarna jedinstvenost sluga se ne provjerava u `lib/slug.ts`. Jedinstvenost se kasnije mora provjeriti u Convex mutation funkciji prije inserta.

## Leksikon lifecycle

`createLexicon` je prva mutation funkcija za stvaranje leksikona. Prima ime vlasnice, naslov, temu, stil korica i ključ paketa pitanja. Prije spremanja validira inpute, generira čitljiv javni slug i provjerava jedinstvenost preko `by_slug` indeksa.

Javni slug koristi se samo za pozivnicu, npr. `/l/moj-leksikon`. Slug nije tajan i ne daje pristup privatnim odgovorima ni admin pregledu.

Privatni admin token generira se pri kreiranju leksikona i vraća se samo jednom, u odgovoru `createLexicon` mutationa. Frontend ga kasnije može staviti u privatni admin link, npr. `/admin/[lexiconId]?token=...`. Token se nikad ne čita iz baze jer se u bazu sprema samo `adminTokenHash`.

`getPublicLexiconBySlug` vraća samo javno sigurne podatke za pozivnicu. Ne vraća `adminTokenHash`, `deletedAt` ni sigurnosna polja.

`getAdminLexicon` provjerava privatni token usporedbom hasha s `adminTokenHash`. Ako ID ili token nisu valjani, funkcija vraća `null` bez otkrivanja koji dio privatnog linka je pogrešan.

`softDeleteLexicon` koristi isti admin token flow. Umjesto fizičkog brisanja postavlja `status: "deleted"`, `deletedAt` i `updatedAt`. Upisi se u ovom koraku ne brišu jer se funkcije za upise uvode kasnije.

Hash tokena koristi server-side `TOKEN_PEPPER`. Pepper nije `NEXT_PUBLIC_`, ne smije se hardkodirati i ne smije se logirati.

## Legacy lokalni dokumenti i backfill

Neki lokalni `lexicons` dokumenti mogu biti nastali prije finalne sheme i zato nemati sva required polja. To se može dogoditi u lokalnom Convex dev okruženju tijekom razvoja MVP-a.

Za takve dokumente postoji jednokratni dev/internal backfill u `convex/migrations.ts`, funkcija `backfillLexiconDefaults`. Ona patcha samo polja koja nedostaju i ne dira `adminTokenHash`, `slug`, `ownerName`, `title` ni postojeće vrijednosti.

Default vrijednosti za stare leksikone:

- `coverStyle`: `"grid-notebook"`
- `theme`: `"grid-notebook"`
- `questionPackKey`: `"osnovna-1998"`
- `quizUnlockEntryCount`: `5`

Ako nedostaju lifecycle/status polja, backfill postavlja sigurne MVP vrijednosti: `status: "active"`, `entryCount: 0`, `quizUnlocked: false` i `updatedAt: Date.now()`.

## Entry lifecycle

`createEntry` kreira jedan upis prijateljice u postojeći aktivni leksikon. Prima `lexiconId`, ime za prikaz, strukturiranu listu odgovora, opcionalnu naljepnicu/mood i consent vrijednosti.

Prije spremanja validiraju se `displayName`, lista odgovora i `consentOwnerView`. `consentOwnerView` mora biti `true`, jer vlasnica bez tog pristanka ne smije vidjeti upis. `consentQuizUse` je odvojen pristanak i određuje smiju li se odgovori kasnije koristiti za kviz/recap.

Pri kreiranju se generira privatni edit/delete token. Plaintext token se vraća samo jednom, odmah nakon `createEntry`, kako bi frontend mogao složiti `/e/[entryId]?token=...` link. U bazi se sprema samo `deleteTokenHash`.

`listEntriesForAdmin` vraća aktivne upise za vlasnicu tek nakon provjere admin tokena. Upisi se listaju po `createdAt` silazno, tako da najnoviji upisi dolaze prvi. Funkcija ne vraća `adminTokenHash`, `deleteTokenHash` ni obrisane upise.

`getEntryForEdit` dohvaća jedan aktivni upis samo ako je edit/delete token valjan. Vraća i osnovne podatke leksikona potrebne za buduću edit stranicu, ali ne vraća hash polja.

`updateEntry` dopušta uređivanje sadržaja upisa preko edit/delete tokena. Ne mijenja `deleteTokenHash`, `createdAt`, `lexiconId` ni `entryCount`.

`softDeleteEntry` postavlja `status: "deleted"`, `deletedAt` i `updatedAt`. Dokument se ne briše fizički u ovom koraku. Nakon soft deletea smanjuje se `lexicons.entryCount`, ali nikad ispod nule.

`entryCount` se povećava nakon uspješnog `createEntry` i smanjuje nakon `softDeleteEntry`. `quizUnlocked` se pali kad `entryCount >= quizUnlockEntryCount`; nakon brisanja se gasi ako broj aktivnih upisa padne ispod praga.
