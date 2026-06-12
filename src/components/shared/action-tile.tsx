"use client";

import { Lock, type LucideIcon } from "lucide-react";

interface ActionTileProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  locked?: boolean;
  danger?: boolean;
}

export function ActionTile({
  icon: Icon,
  label,
  onClick,
  locked,
  danger,
}: ActionTileProps) {
  const Glyph = locked ? Lock : Icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-line-soft bg-card px-1.5 py-3 transition active:scale-95 ${
        danger && !locked ? "text-danger" : "text-muted-foreground"
      } ${locked ? "opacity-55" : ""}`}
    >
      <Glyph className="size-5" strokeWidth={2} />
      <span
        className={`font-sans text-[11px] font-bold ${
          danger && !locked ? "text-danger" : "text-foreground"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
