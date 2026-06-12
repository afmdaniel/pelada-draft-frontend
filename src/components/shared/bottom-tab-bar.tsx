"use client";

import { List, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/peladas", label: "Peladas", icon: List },
  { href: "/sorteios", label: "Sorteios", icon: Trophy },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 border-t border-line-soft bg-[color-mix(in_oklch,var(--surface)_88%,transparent)] px-2 pt-2 pb-1.5 backdrop-blur-xl">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-[3px] py-[5px] transition active:scale-95 ${
              active ? "text-primary" : "text-faint"
            }`}
          >
            <Icon
              className="size-[23px]"
              strokeWidth={active ? 2.2 : 1.9}
              fill={active ? "var(--accent-soft)" : "none"}
            />
            <span className="font-sans text-[10.5px] font-bold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
