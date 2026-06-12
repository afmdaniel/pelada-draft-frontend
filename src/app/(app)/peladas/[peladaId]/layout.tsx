"use client";

import { useParams } from "next/navigation";

import { PeladaDraftProvider } from "@/components/peladas/pelada-draft-context";

export default function PeladaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { peladaId } = useParams<{ peladaId: string }>();
  return (
    <PeladaDraftProvider peladaId={peladaId}>{children}</PeladaDraftProvider>
  );
}
