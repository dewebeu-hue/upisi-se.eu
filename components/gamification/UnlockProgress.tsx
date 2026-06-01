import { ProgressPill } from "@/components/ui/ProgressPill";
import { cn } from "@/lib/class-names";
import { getUnlockMilestones } from "@/lib/gamification";

type UnlockProgressProps = {
  entryCount: number;
  quizUnlockEntryCount: number;
  quizUnlocked?: boolean;
  compact?: boolean;
  className?: string;
};

export function UnlockProgress({
  className,
  compact = false,
  entryCount,
  quizUnlocked = false,
  quizUnlockEntryCount,
}: UnlockProgressProps) {
  const milestones = getUnlockMilestones(entryCount, quizUnlockEntryCount);
  const nextMilestone = milestones.find((milestone) => !milestone.unlocked);
  const completedCount = milestones.filter((milestone) => milestone.unlocked).length;
  const nextCount = nextMilestone
    ? Math.max(nextMilestone.requiredCount - entryCount, 0)
    : 0;
  const summary = quizUnlocked
    ? "Dovoljno upisa za kviz 🎉"
    : nextMilestone
      ? `Još ${nextCount} do: ${nextMilestone.label}`
      : "Svi MVP milestonei su otključani";

  return (
    <section
      className={cn(
        "w-full max-w-full min-w-0 overflow-hidden rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-4 shadow-[var(--shadow-soft)] sm:p-5",
        compact && "p-4",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-black uppercase tracking-[0.12em] text-[var(--color-gel-purple)] [overflow-wrap:anywhere] sm:tracking-[0.14em]">
            Unlock progress
          </p>
          <h2
            className={cn(
              "mt-2 break-words font-black text-[var(--color-ink)] [overflow-wrap:anywhere]",
              compact ? "text-xl" : "text-2xl",
            )}
          >
            {summary}
          </h2>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere]">
            Svaki upis puni leksikon. Kviz još nije prava igra u ovoj fazi, ali
            skupljamo dovoljno odgovora za nju.
          </p>
        </div>
        <ProgressPill
          className={quizUnlocked ? "glitter-border" : undefined}
          label={`${entryCount}/${quizUnlockEntryCount} za kviz`}
          tone={quizUnlocked ? "success" : "yellow"}
        />
      </div>

      <div
        className={cn(
          "mt-5 grid min-w-0 gap-3",
          compact ? "sm:grid-cols-2" : "sm:grid-cols-3",
        )}
      >
        {milestones.map((milestone) => (
          <div
            className={cn(
              "min-w-0 overflow-hidden rounded-[1rem] border bg-white/58 p-3",
              milestone.unlocked
                ? "border-[rgba(9,139,104,0.22)]"
                : milestone.current
                  ? "border-[rgba(224,68,157,0.30)]"
                  : "border-[rgba(36,27,47,0.10)] opacity-80",
            )}
            key={milestone.key}
          >
            <div className="flex min-w-0 items-center justify-between gap-2">
              <p className="min-w-0 break-words text-sm font-black text-[var(--color-ink)] [overflow-wrap:anywhere]">
                {milestone.label}
              </p>
              <span
                className="text-base"
                aria-label={milestone.unlocked ? "Otključano" : "Zaključano"}
                role="img"
              >
                {milestone.unlocked ? "✓" : "🔒"}
              </span>
            </div>
            {!compact ? (
              <p className="mt-2 break-words text-xs leading-5 text-[var(--color-muted)] [overflow-wrap:anywhere]">
                {milestone.description}
              </p>
            ) : null}
            <p className="mt-2 break-words text-xs font-black uppercase tracking-[0.10em] text-[var(--color-muted)] [overflow-wrap:anywhere]">
              {milestone.requiredCount} upisa
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 break-words text-xs font-bold text-[var(--color-muted)] [overflow-wrap:anywhere]">
        Otključano: {completedCount}/{milestones.length}
      </p>
    </section>
  );
}
