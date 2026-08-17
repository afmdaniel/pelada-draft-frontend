"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { AppButton } from "@/components/shared/app-button";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { TEAM_COLORS } from "@/lib/utils/teams";

interface TeamEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  currentColorIndex: number;
  onSave: (name: string, colorIndex: number) => void;
}

export function TeamEditSheet({
  open,
  onOpenChange,
  currentName,
  currentColorIndex,
  onSave,
}: TeamEditSheetProps) {
  const [name, setName] = useState(currentName);
  const [colorIndex, setColorIndex] = useState(currentColorIndex);

  // Sync local state when sheet opens for a different team
  useEffect(() => {
    if (open) {
      setName(currentName);
      setColorIndex(currentColorIndex);
    }
  }, [open, currentName, currentColorIndex]);

  function handleSave() {
    onSave(name.trim(), colorIndex);
    onOpenChange(false);
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar time"
      footer={
        <AppButton full onClick={handleSave}>
          Salvar
        </AppButton>
      }
    >
      <div className="flex flex-col gap-5 pb-1">
        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[0.8125rem] font-semibold text-faint">
            Nome do time
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            placeholder={TEAM_COLORS[colorIndex % TEAM_COLORS.length].name}
            className="h-11 w-full rounded-[0.75rem] border border-line-soft bg-card px-4 font-sans text-[0.9375rem] text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Color grid */}
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[0.8125rem] font-semibold text-faint">
            Cor do time
          </span>
          <div className="grid grid-cols-5 gap-3">
            {TEAM_COLORS.map((color, index) => {
              const selected = index === colorIndex;
              return (
                <button
                  key={color.name}
                  type="button"
                  aria-label={color.name}
                  onClick={() => setColorIndex(index)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className="relative grid size-12 place-items-center rounded-full transition active:scale-90"
                    style={{
                      background: color.hex,
                      boxShadow: selected
                        ? `0 0 0 3px var(--surface), 0 0 0 5px ${color.hex}`
                        : undefined,
                    }}
                  >
                    {selected && (
                      <Check
                        className="size-5"
                        strokeWidth={2.5}
                        style={{ color: color.ink }}
                      />
                    )}
                  </span>
                  <span className="font-sans text-[0.6875rem] font-semibold text-faint">
                    {color.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
