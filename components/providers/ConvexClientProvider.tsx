"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

type ConvexClientProviderProps = {
  children: ReactNode;
};

export function hasConvexClientConfig(): boolean {
  return Boolean(convexUrl);
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  if (!convexClient) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
