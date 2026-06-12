import { TabBarGate } from "@/components/shared/tab-bar-gate";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-1 flex-col bg-background sm:border-x sm:border-line-soft">
      <main className="flex flex-1 flex-col">{children}</main>
      <TabBarGate />
    </div>
  );
}
