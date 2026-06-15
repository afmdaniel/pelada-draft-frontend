"use client";

import { ChevronLeft } from "lucide-react";

interface TopBarProps {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}

export function TopBar({ title, onBack, right }: TopBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 px-3 pt-1 pb-3 lg:px-0">
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="grid size-10 place-items-center rounded-xl border border-line-soft bg-card-hi text-foreground transition active:scale-90"
      >
        <ChevronLeft className="size-5" />
      </button>
      <h1 className="min-w-0 flex-1 truncate font-display text-xl leading-tight font-semibold uppercase text-foreground">
        {title}
      </h1>
      {right}
    </div>
  );
}
