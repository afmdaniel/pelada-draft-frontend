import { Crown } from "lucide-react";

import type { Privilege } from "@/types/api";

type Tone = "owner" | "draw" | "manage" | "muted";

const TONES: Record<Tone, React.CSSProperties> = {
  owner: {
    background: "color-mix(in oklch, var(--gold) 18%, transparent)",
    color: "var(--gold)",
  },
  draw: { background: "var(--accent-soft)", color: "var(--accent-color)" },
  manage: {
    background: "color-mix(in oklch, oklch(0.78 0.12 178) 16%, transparent)",
    color: "oklch(0.80 0.12 178)",
  },
  muted: { background: "var(--card-hi)", color: "var(--faint)" },
};

export function PrivBadge({
  tone = "muted",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[7px] px-2 py-[3px] font-sans text-[10.5px] font-bold whitespace-nowrap"
      style={TONES[tone]}
    >
      {children}
    </span>
  );
}

export function PrivBadges({
  isOwner,
  privileges,
}: {
  isOwner: boolean;
  privileges: Privilege[];
}) {
  if (isOwner) {
    return (
      <PrivBadge tone="owner">
        <Crown className="size-[11px]" strokeWidth={2.4} /> Dono
      </PrivBadge>
    );
  }
  const manage = privileges.includes("MANAGE_PLAYERS");
  const draw = privileges.includes("DRAW_TEAMS");
  if (manage && draw) {
    return <PrivBadge tone="owner">ALL</PrivBadge>;
  }
  return (
    <>
      {manage && <PrivBadge tone="manage">Gerenciar</PrivBadge>}
      {draw && <PrivBadge tone="draw">Sortear</PrivBadge>}
      {!manage && !draw && <PrivBadge tone="muted">Sem privilégios</PrivBadge>}
    </>
  );
}
