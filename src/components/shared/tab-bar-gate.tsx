"use client";

import { usePathname } from "next/navigation";

import { BottomTabBar } from "@/components/shared/bottom-tab-bar";

const TAB_PATHS = ["/peladas", "/sorteios", "/perfil"];

/** Exibe a tab bar apenas nas telas raiz (lista, sorteios, perfil). */
export function TabBarGate() {
  const pathname = usePathname();
  if (!TAB_PATHS.includes(pathname)) return null;
  return (
    <div className="sticky bottom-0 z-40">
      <BottomTabBar />
    </div>
  );
}
