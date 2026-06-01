import { cn } from "@/lib/class-names";
import { getCoverThemeByKey } from "@/lib/design";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { Sticker } from "@/components/ui/Sticker";
import { Tape } from "@/components/ui/Tape";

type CoverPreviewProps = {
  title: string;
  ownerName?: string;
  theme?: string;
  sticker?: string;
  className?: string;
};

export function CoverPreview({
  title,
  ownerName = "Tvoja ekipa",
  theme = "grid-notebook",
  sticker,
  className,
}: CoverPreviewProps) {
  const themeOption = getCoverThemeByKey(theme);
  const displaySticker = sticker ?? themeOption.sticker;
  const decorativeStickers = themeOption.stickerSet;

  return (
    <div
      className={cn(
        "cover-preview relative mx-auto w-full max-w-sm min-w-0 overflow-hidden rounded-[1.65rem] border-2 p-3 sm:p-4",
        themeOption.coverClassName,
        className,
      )}
    >
      <Tape className="-top-3 left-1/2 -translate-x-1/2" rotate="right" />
      <div className="cover-preview__page relative min-w-0 overflow-hidden rounded-[1.25rem] border p-4 sm:p-5">
        <div className="cover-preview__corner-stickers" aria-hidden="true">
          <span>{decorativeStickers[0]}</span>
          <span>{decorativeStickers[1]}</span>
          <span>{decorativeStickers[2]}</span>
        </div>
        <div className="cover-preview__shine" aria-hidden="true" />
        <div className="relative z-[1] flex min-w-0 flex-wrap items-center justify-between gap-2 sm:gap-3">
          <ProgressPill
            className="min-w-0"
            label={themeOption.shortLabel}
            tone={themeOption.tone}
          />
          <Sticker className="rotate-6" variant="pink">
            {displaySticker}
          </Sticker>
        </div>
        <div className="relative z-[1] mt-12">
          <p className="cover-preview__eyebrow text-sm font-black uppercase tracking-[0.16em]">
            Upiši se
          </p>
          <h3 className="mt-3 max-w-full break-words text-3xl font-black leading-tight text-[var(--color-ink)] [overflow-wrap:anywhere] sm:text-4xl">
            {title}
          </h3>
          <p className="cover-preview__owner mt-5 inline-block max-w-full rounded-full px-3 py-1 text-sm font-bold leading-snug break-words [overflow-wrap:anywhere]">
            vlasnica: {ownerName}
          </p>
        </div>
        <div className="relative z-[1] mt-10 space-y-2" aria-hidden="true">
          <div className="cover-preview__line h-2 w-10/12 rounded-full" />
          <div className="cover-preview__line h-2 w-8/12 rounded-full" />
          <div className="cover-preview__line h-2 w-11/12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
