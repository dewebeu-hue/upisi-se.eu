import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { homePath } from "@/lib/routes";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 items-center px-5 py-16 sm:px-8">
      <EmptyState
        action={<ButtonLink href={homePath()}>Natrag na početnu</ButtonLink>}
        description="Link je možda pogrešno zalijepljen, obrisan ili još nije upisan u naš mali digitalni spomenar."
        sticker="📼"
        title="Ova stranica još nije upisana"
      />
    </section>
  );
}
