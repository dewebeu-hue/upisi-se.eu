import type { Metadata } from "next";
import { EntryThankYou } from "@/components/entries/EntryThankYou";

type LexiconThanksPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Upisano u leksikon",
  description: "Thank-you stranica nakon upisa u digitalni leksikon.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LexiconThanksPage({
  params,
}: LexiconThanksPageProps) {
  const { slug } = await params;

  return <EntryThankYou slug={slug} />;
}
