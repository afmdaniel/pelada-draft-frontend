import { BottomTabBar } from "@/components/shared/bottom-tab-bar";

export default function TabsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex flex-1 flex-col pt-3">{children}</main>
      <div className="sticky bottom-0 z-40">
        <BottomTabBar />
      </div>
    </>
  );
}
