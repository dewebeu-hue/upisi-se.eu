import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

type AdminLexiconPageProps = {
  params: Promise<{
    lexiconId: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Privatni pregled leksikona",
  description: "Privatni admin pregled leksikona preko tokeniziranog linka.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLexiconPage({
  params,
  searchParams,
}: AdminLexiconPageProps) {
  const { lexiconId } = await params;
  const { token } = await searchParams;

  return <AdminDashboard lexiconId={lexiconId} token={token} />;
}
