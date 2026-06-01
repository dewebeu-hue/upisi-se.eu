import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { AppShell } from "@/components/AppShell";
import {
  APP_DEFAULT_DESCRIPTION,
  APP_DEFAULT_TITLE,
  APP_NAME,
} from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: APP_DEFAULT_TITLE,
  description: APP_DEFAULT_DESCRIPTION,
  applicationName: APP_NAME,
  openGraph: {
    title: APP_DEFAULT_TITLE,
    description: APP_DEFAULT_DESCRIPTION,
    url: "/",
    siteName: APP_NAME,
    locale: "hr_HR",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: APP_DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_DEFAULT_TITLE,
    description: APP_DEFAULT_DESCRIPTION,
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="hr">
      <body>
        <ConvexClientProvider>
          <AppShell>{children}</AppShell>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
