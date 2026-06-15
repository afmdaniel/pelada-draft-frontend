"use client";

import { Check, Pencil } from "lucide-react";

import { StarRow } from "@/components/players/star-row";
import { POSITION_META } from "@/lib/utils/positions";
import type { Player } from "@/types/api";

interface PlayerCardProps {
  player: Player;
  selectable?: boolean;
  selected?: boolean;
  dim?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
}

export function PlayerCard({
  player,
  selectable,
  selected,
  dim,
  onToggle,
  onEdit,
}: PlayerCardProps) {
  const meta = POSITION_META[player.position];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        disabled={!selectable}
        className="relative w-full overflow-hidden rounded-[18px] p-[0.8125rem] text-left transition active:scale-[0.98] disabled:active:scale-100"
        style={{
          background:
            "linear-gradient(157deg, var(--card-hi) 0%, var(--card) 52%, var(--card) 100%)",
          border: `1px solid ${selected ? "var(--accent-color)" : "var(--line-soft)"}`,
          boxShadow: selected
            ? "0 0 0 2px var(--accent-soft), var(--shadow-card)"
            : "var(--shadow-card)",
          opacity: dim && !selected ? 0.5 : 1,
          cursor: selectable ? "pointer" : "default",
        }}
      >
        {/* filete de cor da posição */}
        <span
          className="absolute left-0 w-[3px] rounded-[3px]"
          style={{ top: "0.875rem", bottom: "0.875rem", background: meta.accent }}
        />
        {/* brilho */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 38%)",
          }}
        />

        {selectable && (
          <span
            className="absolute top-2.5 right-2.5 grid size-[1.375rem] place-items-center rounded-full transition-all"
            style={{
              background: selected ? "var(--accent-color)" : "transparent",
              border: `1.6px solid ${selected ? "var(--accent-color)" : "var(--line)"}`,
              color: "var(--accent-ink)",
            }}
          >
            {selected && <Check className="size-[0.8125rem]" strokeWidth={3} />}
          </span>
        )}

        <div className="relative flex items-center gap-3">
          {/* bloco de rating */}
          <div className="w-[2.875rem] shrink-0 pl-1 text-center">
            <div className="font-display text-[2.125rem] leading-[0.9] font-bold text-foreground">
              {player.stars}
            </div>
            <div className="mt-0.5 font-display text-[0.5625rem] font-medium uppercase tracking-[0.12em] text-faint">
              OVR
            </div>
          </div>
          {/* badge de posição */}
          <div
            className="flex size-[3.25rem] shrink-0 flex-col items-center justify-center gap-px rounded-[14px]"
            style={{
              background: `color-mix(in oklch, ${meta.accent} 18%, var(--surface))`,
              border: `1px solid color-mix(in oklch, ${meta.accent} 35%, transparent)`,
              color: meta.accent,
            }}
          >
            <span className="font-display text-[1.0625rem] leading-none font-bold uppercase tracking-[0.02em]">
              {meta.short}
            </span>
            <span className="font-sans text-[0.46875rem] font-semibold uppercase tracking-[0.08em] opacity-80">
              {meta.label}
            </span>
          </div>
          {/* nome + estrelas */}
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-base font-semibold uppercase tracking-[0.01em] text-foreground">
              {player.name}
            </div>
            <div className="mt-1.5">
              <StarRow stars={player.stars} size={13} />
            </div>
          </div>
        </div>
      </button>

      {onEdit && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          aria-label={`Editar ${player.name}`}
          className="absolute right-2.5 bottom-2.5 z-[2] grid size-[1.875rem] place-items-center rounded-[9px] border border-line bg-surface text-muted-foreground transition active:scale-90"
        >
          <Pencil className="size-3.5" />
        </button>
      )}
    </div>
  );
}
