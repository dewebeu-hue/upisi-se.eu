import type { Metadata } from "next";
import { CreateEntryForm } from "@/components/entries/CreateEntryForm";

type LexiconEntryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Upiši se u leksikon",
  description: "Privatna forma za upis u digitalni leksikon.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LexiconEntryPage({
  params,
}: LexiconEntryPageProps) {
  const { slug } = await params;

  return <CreateEntryForm slug={slug} />;
}
