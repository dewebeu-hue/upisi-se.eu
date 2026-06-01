import { PlaceholderPage } from "@/components/PlaceholderPage";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SectionTitle } from "@/components/ui/SectionTitle";

const privacySections = [
  {
    title: "Što spremamo",
    text: "Spremamo naziv leksikona, ime ili nadimak vlasnice, javni slug, upise prijateljica, consent odabire i hashirane tokene za privatne linkove.",
  },
  {
    title: "Što ne radimo",
    text: "U MVP-u nema analyticsa, uploadanja slika, plaćanja, auth providera, Google/Meta tracking skripti ni javnog popisa leksikona.",
  },
  {
    title: "Javni i privatni linkovi",
    text: "Leksikon je dostupan preko javnog invite linka. Odgovore vidi vlasnica preko privatnog linka za pregled. Privatne linkove ne treba slati u grupu.",
  },
  {
    title: "Brisanje",
    text: "Osoba koja se upisala može obrisati svoj upis preko privatnog linka za uređivanje i brisanje. Vlasnica može soft deleteati cijeli leksikon.",
  },
  {
    title: "Dobna granica",
    text: "Aplikacija nije namijenjena djeci mlađoj od 16 godina. Nemoj unositi osjetljive podatke o sebi ili drugim osobama.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      description="Kratka beta politika privatnosti za MVP. Tekst nije pravno finalan, ali opisuje osnovna pravila prije soft launcha."
      eyebrow="Beta privatnost"
      sticker="🔒"
      title="Privatnost"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <ProgressPill label="Nema analyticsa" tone="blue" />
          <ProgressPill label="Nema uploadanja slika" tone="pink" />
          <ProgressPill label="Nema plaćanja" tone="success" />
        </div>
        <SectionTitle
          description="Privatnost je dio proizvoda, ne dodatak na kraju. MVP zato koristi privatne linkove i minimalan skup podataka."
          title="Minimalno podataka, jasni privatni linkovi"
        />
        <div className="grid gap-3">
          {privacySections.map((section) => (
            <section
              className="rounded-[1.15rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4"
              key={section.title}
            >
              <h2 className="text-lg font-black text-[var(--color-ink)]">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </div>
    </PlaceholderPage>
  );
}
