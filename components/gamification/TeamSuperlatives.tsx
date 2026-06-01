import { RetroCard } from "@/components/RetroCard";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { Sticker } from "@/components/ui/Sticker";
import {
  TEAM_SUPERLATIVES_UNLOCK_COUNT,
  getTeamSuperlatives,
  type SuperlativeEntry,
} from "@/lib/gamification";

type TeamSuperlativesProps = {
  entries: SuperlativeEntry[];
};

export function TeamSuperlatives({ entries }: TeamSuperlativesProps) {
  const superlatives = getTeamSuperlatives(entries);
  const remainingCount = Math.max(
    TEAM_SUPERLATIVES_UNLOCK_COUNT - entries.length,
    0,
  );

  if (superlatives.length === 0) {
    return (
      <RetroCard className="p-5" variant="notebook" withTape>
        <ProgressPill label="Zaključano" tone="pink" />
        <h2 className="mt-3 text-2xl font-black text-[var(--color-ink)]">
          Titule ekipe se uskoro otključavaju
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Trebaju još {remainingCount} upisa za prve superlative. Titule se
          dodjeljuju zabavno i bez čitanja privatnih odgovora.
        </p>
      </RetroCard>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <ProgressPill label="Otključano" tone="success" />
        <h2 className="mt-3 text-3xl font-black text-[var(--color-ink)]">
          Titule ekipe
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Lagani superlativi za admin pregled. Ne analiziraju privatne odgovore
          i služe samo za smijeh u ekipi.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {superlatives.map((superlative) => (
          <RetroCard
            className="flex gap-3 p-4"
            key={`${superlative.label}:${superlative.displayName}`}
            variant="sticker"
          >
            <Sticker className="shrink-0" size="sm" variant="yellow">
              {superlative.emoji}
            </Sticker>
            <div className="min-w-0">
              <p className="text-sm font-black text-[var(--color-gel-pink)]">
                {superlative.label}
              </p>
              <h3 className="mt-1 break-words text-xl font-black text-[var(--color-ink)]">
                {superlative.displayName}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {superlative.description}
              </p>
            </div>
          </RetroCard>
        ))}
      </div>
    </section>
  );
}
