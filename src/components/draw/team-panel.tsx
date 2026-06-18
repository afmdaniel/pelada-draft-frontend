import { Star } from "lucide-react";

import { StarRow } from "@/components/players/star-row";
import { POSITION_META } from "@/lib/utils/positions";
import type { TeamColor } from "@/lib/utils/teams";
import type { DrawTeam, DrawTeamPlayer } from "@/types/api";

function Jersey({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M8.5 3L4 5.5 5.5 10l1.5-.6V20a1 1 0 001 1h8a1 1 0 001-1V9.4l1.5.6L20 5.5 15.5 3a3.5 3.5 0 01-7 0z" />
    </svg>
  );
}

function MiniPlayerRow({
  player,
  ink,
  index,
  selected,
  onClick,
}: {
  player: DrawTeamPlayer;
  ink: string;
  index: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  const meta = POSITION_META[player.position];
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
      className={[
        "flex items-center gap-[9px] rounded-[11px] border px-2.5 py-[7px] animate-slide-in transition-all",
        onClick ? "cursor-pointer active:scale-[0.97]" : "",
        selected
          ? "border-primary/60 shadow-[0_0_0_2px_var(--accent-soft)]"
          : "border-line-soft",
      ].join(" ")}
      style={{
        background: selected
          ? `color-mix(in oklch, var(--accent-color) 14%, var(--card))`
          : `color-mix(in oklch, ${ink} 8%, var(--card))`,
        animationDelay: `${Math.min(index, 14) * 40}ms`,
      }}
    >
      <span
        className="grid h-8 w-[34px] shrink-0 place-items-center rounded-lg"
        style={{
          background: `color-mix(in oklch, ${meta.accent} 20%, var(--surface))`,
          border: `1px solid color-mix(in oklch, ${meta.accent} 32%, transparent)`,
          color: meta.accent,
        }}
      >
        <span className="font-display text-xs font-bold uppercase tracking-[0.02em]">
          {meta.short}
        </span>
      </span>
      <span className="min-w-0 flex-1 truncate font-sans text-[13.5px] font-semibold text-foreground">
        {player.name}
      </span>
      <StarRow stars={player.stars} size={11} gap={1.5} />
      <span className="w-[18px] text-right font-display text-base leading-none font-bold text-foreground">
        {player.stars}
      </span>
    </div>
  );
}

interface TeamPanelProps {
  team: DrawTeam;
  color: TeamColor;
  startIndex: number;
  baseDelay: number;
  selectedPlayerIndex?: number;
  onPlayerSelect?: (playerIndex: number) => void;
}

export function TeamPanel({
  team,
  color,
  startIndex,
  baseDelay,
  selectedPlayerIndex,
  onPlayerSelect,
}: TeamPanelProps) {
  const lightJersey = color.name === "Branco" || color.name === "Amarelo";
  return (
    <div
      className="overflow-hidden rounded-[18px] border border-line-soft bg-card shadow-card animate-pop-in"
      style={{ animationDelay: `${baseDelay}ms` }}
    >
      <div
        className="flex items-center gap-[11px] px-3.5 py-3"
        style={{
          background: `linear-gradient(100deg, ${color.glow}, transparent 70%)`,
          borderBottom: `2px solid ${color.hex}`,
        }}
      >
        <span
          className="grid size-[38px] place-items-center rounded-[11px]"
          style={{
            background: color.hex,
            boxShadow: `0 6px 16px -6px ${color.hex}`,
          }}
        >
          <Jersey color={color.ink} size={24} />
        </span>
        <div className="flex-1">
          <div
            className="font-display text-lg leading-none font-bold uppercase tracking-[0.02em]"
            style={{ color: lightJersey ? color.hex : "var(--text)" }}
          >
            Time {color.name}
          </div>
          <div className="mt-0.5 font-sans text-[11.5px] font-semibold text-faint">
            {team.players.length} jogadores
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Star className="size-3.5 fill-gold text-gold" strokeWidth={0.6} />
            <span className="font-display text-xl leading-none font-bold text-foreground">
              {team.totalStars}
            </span>
          </div>
          <div className="mt-0.5 font-sans text-[8.5px] font-semibold uppercase tracking-[0.1em] text-faint">
            força
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[7px] p-2.5">
        {team.players.map((player, index) => (
          <MiniPlayerRow
            key={`${player.name}-${index}`}
            player={player}
            ink={color.hex}
            index={startIndex + index}
            selected={selectedPlayerIndex === index}
            onClick={onPlayerSelect ? () => onPlayerSelect(index) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
