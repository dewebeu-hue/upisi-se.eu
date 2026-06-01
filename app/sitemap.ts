import type { MetadataRoute } from "next";
import {
  homePath,
  newLexiconPath,
  privacyPath,
  termsPath,
} from "@/lib/routes";
import { createAbsoluteUrl, getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: createAbsoluteUrl(homePath(), siteUrl),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: createAbsoluteUrl(newLexiconPath(), siteUrl),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: createAbsoluteUrl(privacyPath(), siteUrl),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: createAbsoluteUrl(termsPath(), siteUrl),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
