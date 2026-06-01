import type { Metadata } from "next";
import { PublicLexiconInvite } from "@/components/lexicons/PublicLexiconInvite";
import { APP_NAME } from "@/lib/constants";
import { getPublicLexiconMetadata } from "@/lib/public-lexicon-metadata";
import { lexiconInvitePath } from "@/lib/routes";

type LexiconInvitePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const inviteDescription =
  "Upiši se kao nekad u osnovnoj. Još malo do kviza ‘Pogodi čiji je odgovor?’";

export async function generateMetadata({
  params,
}: LexiconInvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const lexicon = await getPublicLexiconMetadata(slug);
  const title = lexicon
    ? `${lexicon.ownerName} te zove u leksikon ✨`
    : "Pozivnica za leksikon ✨";
  const invitePath = lexiconInvitePath(slug);
  const ogImagePath = `/api/og/lexicon/${encodeURIComponent(slug)}`;

  return {
    title,
    description: inviteDescription,
    alternates: {
      canonical: invitePath,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description: inviteDescription,
      url: invitePath,
      siteName: APP_NAME,
      type: "website",
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: inviteDescription,
      images: [ogImagePath],
    },
  };
}

export default async function LexiconInvitePage({
  params,
}: LexiconInvitePageProps) {
  const { slug } = await params;

  return <PublicLexiconInvite slug={slug} />;
}
