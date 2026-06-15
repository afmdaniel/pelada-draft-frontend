import { Sidebar, TopNav } from "@/components/shared/sidebar";
import { TabBarGate } from "@/components/shared/tab-bar-gate";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-background">
      <Sidebar />
      <TopNav />
      <div className="flex flex-1 flex-col lg:pl-[16.5rem]">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col bg-background sm:max-md:border-x sm:max-md:border-line-soft md:max-w-3xl md:pt-6 lg:max-w-[80rem] lg:px-8 lg:pt-8 lg:pb-10">
          {children}
        </main>
      </div>
      <TabBarGate />
    </div>
  );
}
