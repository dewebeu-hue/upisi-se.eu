import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverPreview } from "@/components/ui/CoverPreview";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SharePreviewCard } from "@/components/ui/SharePreviewCard";
import { Sparkle } from "@/components/ui/Sparkle";
import { StepCard } from "@/components/ui/StepCard";
import { BETA_LABEL, LANDING_COPY } from "@/lib/app-copy";
import { badgeText, stepLabels } from "@/lib/design";
import { demoInvitePath, newLexiconPath } from "@/lib/routes";

const landingTitle = "Upiši se — digitalni leksikon kao iz osnovne";
const landingDescription =
  "Napravi leksikon, pošalji link frendicama i otkrij koliko se zapravo poznajete.";

export const metadata: Metadata = {
  title: landingTitle,
  description: landingDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: landingTitle,
    description: landingDescription,
    url: "/",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: landingTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: landingTitle,
    description: landingDescription,
    images: ["/api/og"],
  },
};

const flowSteps = [
  {
    title: stepLabels[0],
    description:
      "Odabereš ime, korice i osnovni ton leksikona. Bez registracije i dugog namještanja.",
    sticker: "💖",
  },
  {
    title: stepLabels[1],
    description:
      "Javni link ide ravno u WhatsApp ili Viber grupu, baš tamo gdje ekipa već živi.",
    sticker: "📼",
  },
  {
    title: stepLabels[2],
    description:
      "Prijateljice se upisuju kratkom formom, a ti odgovore čitaš privatno.",
    sticker: "⭐",
  },
  {
    title: stepLabels[3],
    description:
      "Kad se skupi dovoljno upisa, leksikon može dobiti zajednički kviz/recap.",
    sticker: "💿",
  },
] as const;

const faqItems = [
  {
    question: "Moram li se registrirati?",
    answer: "Ne. MVP koristi privatne linkove umjesto korisničkih računa.",
  },
  {
    question: "Tko vidi odgovore?",
    answer: "Odgovore vidi vlasnica leksikona preko privatnog linka za pregled.",
  },
  {
    question: "Je li besplatno?",
    answer: "Da, beta verzija je besplatna.",
  },
] as const;

export default function Home() {
  return (
    <div className="w-full">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-20">
        <div className="relative max-w-2xl">
          <Sparkle
            className="sparkle-float absolute -right-2 top-24 hidden opacity-70 sm:inline-flex"
            size="lg"
            tone="pink"
          />
          <Sparkle
            className="sparkle-pulse absolute -left-3 top-44 hidden opacity-70 sm:inline-flex"
            size="md"
            tone="blue"
          />
          <div className="flex flex-wrap gap-2">
            <ProgressPill label={BETA_LABEL} tone="yellow" />
            <ProgressPill label={badgeText.noRegistration} tone="blue" />
            <ProgressPill label={badgeText.free} tone="success" />
          </div>
          <h1 className="mt-6 text-balance text-5xl font-black leading-[0.96] text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
            {LANDING_COPY.title}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-[var(--color-muted)] sm:text-xl">
            {LANDING_COPY.subtitle}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--color-muted)] sm:text-base">
            {LANDING_COPY.support}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={newLexiconPath()} size="lg">
              {LANDING_COPY.primaryCta}
            </ButtonLink>
            <ButtonLink
              href={demoInvitePath()}
              size="lg"
              variant="secondary"
            >
              {LANDING_COPY.secondaryCta}
            </ButtonLink>
          </div>
        </div>

        <div className="space-y-5">
          <CoverPreview
            ownerName="Ana"
            sticker="✨"
            theme="pink-gel-pen"
            title="Leksikon naše ekipe"
          />
          <SharePreviewCard
            description={LANDING_COPY.previewNote}
            title="Upiši se u moj digitalni leksikon"
            urlLabel={demoInvitePath()}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8 sm:pb-16">
        <SectionTitle
          description="Flow je namjerno kratak: napravi, pošalji, skupi upise i vrati ekipu u zajedničku malu nostalgiju."
          eyebrow="Kako radi"
          title="Od prve ideje do prvih upisa u nekoliko minuta"
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flowSteps.map((step, index) => (
            <StepCard
              description={step.description}
              key={step.title}
              number={index + 1}
              sticker={step.sticker}
              title={step.title}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionTitle
            description="Dovoljno sigurno da se usudiš probati, dovoljno lagano da ga stvarno pošalješ u grupu."
            eyebrow="Mala pravila"
            title="Zabavno, ali s privatnim linkovima"
          />
          <div className="grid gap-3">
            {faqItems.map((item) => (
              <div
                className="rounded-[1.2rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4 shadow-[var(--shadow-soft)]"
                key={item.question}
              >
                <h3 className="font-black text-[var(--color-ink)]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
