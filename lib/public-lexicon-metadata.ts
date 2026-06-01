import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { isValidSlug } from "@/lib/slug";

export type PublicLexiconMetadata = {
  ownerName: string;
  title: string;
  slug: string;
};

export async function getPublicLexiconMetadata(
  slug: string,
): Promise<PublicLexiconMetadata | null> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();

  if (!convexUrl || !isValidSlug(slug)) {
    return null;
  }

  try {
    const client = new ConvexHttpClient(convexUrl);
    const lexicon = await client.query(api.lexicons.getPublicLexiconBySlug, {
      slug,
    });

    if (!lexicon) {
      return null;
    }

    return {
      ownerName: lexicon.ownerName,
      title: lexicon.title,
      slug: lexicon.slug,
    };
  } catch {
    return null;
  }
}
