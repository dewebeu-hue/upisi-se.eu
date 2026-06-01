import { PlaceholderPage } from "@/components/PlaceholderPage";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SectionTitle } from "@/components/ui/SectionTitle";

const terms = [
  "Aplikacija je zabavni beta proizvod za nostalgične digitalne leksikone.",
  "Nije namijenjena djeci mlađoj od 16 godina.",
  "Zabranjen je uvredljiv, nezakonit ili tuđi osjetljiv sadržaj.",
  "Ne unositi tuđe osobne, osjetljive ili povjerljive podatke bez pristanka.",
  "Korisnica je odgovorna za sadržaj koji unosi i linkove koje dijeli.",
  "Sadržaj se može ukloniti ako krši pravila ili privatnost drugih osoba.",
  "Beta verzija može imati greške, promjene flowa ili privremene prekide dostupnosti.",
] as const;

export default function TermsPage() {
  return (
    <PlaceholderPage
      description="Kratki beta uvjeti za MVP. Ovo nije finalni pravni dokument, nego minimum pravila za sigurno testiranje."
      eyebrow="Beta uvjeti"
      sticker="⭐"
      title="Uvjeti korištenja"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <ProgressPill label="Beta" tone="yellow" />
          <ProgressPill label="16+" tone="blue" />
          <ProgressPill label="Bez plaćanja" tone="success" />
        </div>
        <SectionTitle
          description="Pravila su kratka jer je MVP mali, ali granice moraju biti jasne od prvog dana."
          title="Zabavno, nostalgično i pristojno"
        />
        <ul className="space-y-3">
          {terms.map((term) => (
            <li
              className="rounded-[1.15rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4 text-sm leading-6 text-[var(--color-muted)]"
              key={term}
            >
              {term}
            </li>
          ))}
        </ul>
      </div>
    </PlaceholderPage>
  );
}
