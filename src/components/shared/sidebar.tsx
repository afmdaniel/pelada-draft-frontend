"use client";

import { LogOut, Volleyball } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/shared/nav-items";
import { useLogout, useMe } from "@/lib/hooks/use-auth";

function Logo() {
  return (
    <Link href="/peladas" className="flex items-center gap-3 px-5 py-6">
      <span
        className="grid size-10 shrink-0 place-items-center rounded-xl shadow-[0_0.5rem_1.25rem_-0.5rem_var(--accent-color)]"
        style={{
          background:
            "linear-gradient(150deg, var(--accent-color), var(--accent-press))",
        }}
      >
        <Volleyball
          className="size-6"
          strokeWidth={1.7}
          style={{ color: "var(--accent-ink)" }}
        />
      </span>
      <span className="font-display text-xl leading-none font-bold uppercase tracking-[0.01em] text-foreground">
        Pelada<span className="text-primary">Draft</span>
      </span>
    </Link>
  );
}

/** Navegação fixa à esquerda — apenas desktop (lg+). */
export function Sidebar() {
  const pathname = usePathname();
  const { data: me } = useMe();
  const logoutMutation = useLogout();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[16.5rem] flex-col border-r border-line-soft bg-surface lg:flex">
      <Logo />

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.75 font-sans text-sm font-bold transition ${
                active
                  ? "bg-accent-soft text-primary"
                  : "text-muted-foreground hover:bg-card-hi hover:text-foreground"
              }`}
            >
              <Icon className="size-5" strokeWidth={active ? 2.2 : 1.9} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* usuário */}
      <div className="border-t border-line-soft p-3.5">
        <div className="flex items-center gap-3 rounded-xl bg-card p-3">
          <span
            className="grid size-10 shrink-0 place-items-center rounded-xl font-display text-sm font-bold uppercase"
            style={{
              background:
                "linear-gradient(150deg, var(--accent-color), var(--accent-press))",
              color: "var(--accent-ink)",
            }}
          >
            {(me?.username ?? "?").slice(0, 2)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-sm font-bold text-foreground">
              @{me?.username ?? "jogador"}
            </p>
            <p className="truncate font-sans text-xs text-faint">
              {me?.email ?? "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            aria-label="Sair da conta"
            title="Sair da conta"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-faint transition hover:bg-danger-soft hover:text-danger disabled:opacity-50"
          >
            <LogOut className="size-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

/** Barra superior — apenas tablet (md a lg). */
export function TopNav() {
  const pathname = usePathname();
  const { data: me } = useMe();

  return (
    <header className="sticky top-0 z-40 hidden h-16 items-center gap-6 border-b border-line-soft bg-[color-mix(in_oklch,var(--surface)_92%,transparent)] px-6 backdrop-blur-xl md:flex lg:hidden">
      <Link href="/peladas" className="flex items-center gap-2.5">
        <span
          className="grid size-9 place-items-center rounded-lg"
          style={{
            background:
              "linear-gradient(150deg, var(--accent-color), var(--accent-press))",
          }}
        >
          <Volleyball
            className="size-5.5"
            strokeWidth={1.7}
            style={{ color: "var(--accent-ink)" }}
          />
        </span>
        <span className="font-display text-lg leading-none font-bold uppercase text-foreground">
          Pelada<span className="text-primary">Draft</span>
        </span>
      </Link>

      <nav className="flex flex-1 items-center gap-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-11 items-center gap-2 rounded-xl px-3.5 font-sans text-sm font-bold transition ${
                active
                  ? "bg-accent-soft text-primary"
                  : "text-muted-foreground hover:bg-card-hi hover:text-foreground"
              }`}
            >
              <Icon className="size-4.5" strokeWidth={active ? 2.2 : 1.9} />
              {label}
            </Link>
          );
        })}
      </nav>

      <span
        className="grid size-9 shrink-0 place-items-center rounded-xl font-display text-xs font-bold uppercase"
        style={{
          background:
            "linear-gradient(150deg, var(--accent-color), var(--accent-press))",
          color: "var(--accent-ink)",
        }}
        title={me ? `@${me.username}` : undefined}
      >
        {(me?.username ?? "?").slice(0, 2)}
      </span>
    </header>
  );
}
