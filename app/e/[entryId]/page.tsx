import type { Metadata } from "next";
import { EditEntryForm } from "@/components/entries/EditEntryForm";

type EditEntryPageProps = {
  params: Promise<{
    entryId: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Uredi ili obriši upis",
  description: "Privatni flow za uređivanje ili brisanje vlastitog upisa.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditEntryPage({
  params,
  searchParams,
}: EditEntryPageProps) {
  const { entryId } = await params;
  const { token } = await searchParams;

  return <EditEntryForm entryId={entryId} token={token} />;
}
