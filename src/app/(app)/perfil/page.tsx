"use client";

import {
  ChevronRight,
  LogOut,
  Settings,
  Shield,
  Volleyball,
} from "lucide-react";
import { toast } from "sonner";

import { ScreenHeader } from "@/components/shared/screen-header";
import { useLogout, useMe } from "@/lib/hooks/use-auth";
import { useTheme } from "@/lib/hooks/use-theme";

const MENU = [
  { icon: Settings, label: "Configurações da conta" },
  { icon: Shield, label: "Privacidade e segurança" },
  { icon: Volleyball, label: "Sobre o PeladaDraft" },
];

export default function PerfilPage() {
  const { data: me } = useMe();
  const { theme, setTheme } = useTheme();
  const logoutMutation = useLogout();

  const display = me?.username ?? "jogador";

  return (
    <div className="flex flex-1 flex-col pt-3">
      <ScreenHeader subtitle="Conta" title="Perfil" />
      <div className="px-4 pb-6">
        {/* cartão do usuário */}
        <div
          className="flex items-center gap-3.5 rounded-[18px] border border-line-soft p-4 shadow-card"
          style={{
            background: "linear-gradient(160deg, var(--card-hi), var(--card))",
          }}
        >
          <div
            className="grid size-[60px] place-items-center rounded-[18px]"
            style={{
              background:
                "linear-gradient(150deg, var(--accent-color), var(--accent-press))",
              color: "var(--accent-ink)",
            }}
          >
            <span className="font-display text-2xl font-bold uppercase">
              {display.slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0">
            <div className="truncate font-display text-xl font-semibold uppercase text-foreground">
              @{display}
            </div>
            <div className="truncate font-sans text-[12.5px] text-faint">
              {me?.email ?? "—"}
            </div>
          </div>
        </div>

        {/* tema */}
        <div className="mt-3 rounded-2xl border border-line-soft bg-card p-3.5">
          <div className="mb-[11px] font-display text-[13px] font-semibold uppercase text-foreground">
            Tema
          </div>
          <div className="flex gap-[7px]">
            {(
              [
                ["Escuro", "dark"],
                ["Claro", "light"],
              ] as const
            ).map(([label, value]) => {
              const on = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={`h-[42px] flex-1 rounded-[11px] font-sans text-[13.5px] font-bold transition ${
                    on
                      ? "bg-primary text-primary-foreground"
                      : "border border-line-soft bg-card-hi text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* menu */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-line-soft bg-card">
          {MENU.map(({ icon: Icon, label }, index) => (
            <button
              key={label}
              type="button"
              onClick={() => toast("Em breve.")}
              className={`flex w-full items-center gap-[13px] px-[15px] py-3.5 text-left text-foreground transition active:bg-black/10 ${
                index > 0 ? "border-t border-line-soft" : ""
              }`}
            >
              <Icon className="size-[19px] text-muted-foreground" />
              <span className="flex-1 font-sans text-sm font-semibold">
                {label}
              </span>
              <ChevronRight className="size-[17px] text-faint" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="mt-3.5 mb-2 flex h-[50px] w-full items-center justify-center gap-[9px] rounded-[14px] border bg-danger-soft text-danger transition active:scale-[0.98] disabled:opacity-50"
          style={{
            borderColor: "color-mix(in oklch, var(--danger) 35%, transparent)",
          }}
        >
          <LogOut className="size-[19px]" />
          <span className="font-sans text-[14.5px] font-bold">
            {logoutMutation.isPending ? "Saindo..." : "Sair da conta"}
          </span>
        </button>
      </div>
    </div>
  );
}
