import { cn } from "@/lib/class-names";
import { getCoverThemeOption } from "@/lib/design";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { Sparkle } from "@/components/ui/Sparkle";
import { Sticker } from "@/components/ui/Sticker";
import { Tape } from "@/components/ui/Tape";

type CoverPreviewProps = {
  title: string;
  ownerName?: string;
  theme?: string;
  sticker?: string;
  className?: string;
};

const accentClasses: Record<string, string> = {
  pink: "from-[rgba(224,68,157,0.20)]",
  blue: "from-[rgba(36,87,214,0.18)]",
  purple: "from-[rgba(129,78,199,0.18)]",
  yellow: "from-[rgba(255,227,109,0.42)]",
  green: "from-[rgba(9,139,104,0.16)]",
};

export function CoverPreview({
  title,
  ownerName = "Tvoja ekipa",
  theme = "Bilježnica na kockice",
  sticker,
  className,
}: CoverPreviewProps) {
  const themeOption = getCoverThemeOption(theme);
  const displaySticker = sticker ?? themeOption.sticker;

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-sm rounded-[1.65rem] border-2 border-[var(--color-ink)] bg-[var(--color-paper-strong)] p-4 shadow-[8px_10px_0_rgba(36,27,47,0.20)]",
        className,
      )}
    >
      <Tape className="-top-3 left-1/2 -translate-x-1/2" rotate="right" />
      <div
        className={cn(
          "notebook-grid relative overflow-hidden rounded-[1.25rem] border border-[rgba(36,27,47,0.18)] bg-gradient-to-br to-transparent p-5",
          accentClasses[themeOption.accent],
        )}
      >
        <Sparkle
          className="sparkle-float absolute right-5 top-16 opacity-70"
          size="sm"
          tone="pink"
        />
        <Sparkle
          className="sparkle-float absolute bottom-20 left-5 opacity-65 [animation-delay:1.4s]"
          size="sm"
          tone="blue"
        />
        <Sparkle
          className="sparkle-pulse absolute bottom-7 right-7 opacity-75"
          size="md"
          tone="yellow"
        />
        <div className="flex items-center justify-between gap-3">
          <ProgressPill label={themeOption.name} tone="yellow" />
          <Sticker className="rotate-6" variant="pink">
            {displaySticker}
          </Sticker>
        </div>
        <div className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Upiši se
          </p>
          <h3 className="mt-3 break-words text-4xl font-black leading-[0.98] text-[var(--color-ink)]">
            {title}
          </h3>
          <p className="mt-5 inline-flex rounded-full bg-white/70 px-3 py-1 text-sm font-bold text-[var(--color-muted)]">
            vlasnica: {ownerName}
          </p>
        </div>
        <div className="mt-10 space-y-2" aria-hidden="true">
          <div className="h-2 w-10/12 rounded-full bg-[rgba(36,87,214,0.14)]" />
          <div className="h-2 w-8/12 rounded-full bg-[rgba(224,68,157,0.16)]" />
          <div className="h-2 w-11/12 rounded-full bg-[rgba(9,139,104,0.12)]" />
        </div>
      </div>
    </div>
  );
}
