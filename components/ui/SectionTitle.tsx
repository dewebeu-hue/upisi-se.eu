type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-gel-blue)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-balance text-2xl font-black leading-tight text-[var(--color-ink)] sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-pretty text-sm leading-6 text-[var(--color-muted)] sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
