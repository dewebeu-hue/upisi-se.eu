import type { Metadata } from "next";
import { LexiconQuiz } from "@/components/quiz/LexiconQuiz";

type LexiconQuizPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Kviz: Pogodi čiji je odgovor",
  description:
    "Read-only kviz za otključane leksikone: pogodi koja je frendica napisala koji odgovor.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LexiconQuizPage({
  params,
}: LexiconQuizPageProps) {
  const { slug } = await params;

  return <LexiconQuiz slug={slug} />;
}
