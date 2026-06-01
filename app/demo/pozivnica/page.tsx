import type { Metadata } from "next";
import { LexiconInviteView } from "@/components/lexicons/LexiconInviteView";

export const metadata: Metadata = {
  title: "Demo pozivnica za leksikon",
  description: "Statički primjer javne pozivnice bez spremanja podataka.",
  robots: {
    index: false,
    follow: false,
  },
};

const demoLexicon = {
  ownerName: "Ana",
  title: "Anin leksikon iz 2002.",
  slug: "demo-pozivnica",
  theme: "pink-gel-pen",
  coverStyle: "pink-gel-pen",
  entryCount: 3,
  quizUnlockEntryCount: 5,
  quizUnlocked: false,
} as const;

export default function DemoInvitePage() {
  return <LexiconInviteView isDemo lexicon={demoLexicon} />;
}
