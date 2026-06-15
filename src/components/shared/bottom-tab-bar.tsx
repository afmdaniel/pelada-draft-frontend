"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/shared/nav-items";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 border-t border-line-soft bg-[color-mix(in_oklch,var(--surface)_88%,transparent)] px-2 pt-2 pb-1.5 backdrop-blur-xl">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-1 transition active:scale-95 ${
              active ? "text-primary" : "text-faint"
            }`}
          >
            <Icon
              className="size-6"
              strokeWidth={active ? 2.2 : 1.9}
              fill={active ? "var(--accent-soft)" : "none"}
            />
            <span className="font-sans text-[0.65rem] font-bold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
