"use client";

import { Check, Trash2, User } from "lucide-react";
import { useState } from "react";

import { StarRow } from "@/components/players/star-row";
import { AppButton } from "@/components/shared/app-button";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Field, TextField } from "@/components/shared/field";
import { POSITION_META } from "@/lib/utils/positions";
import { playerSchema, POSITIONS } from "@/lib/validations/player";
import type { Player, PlayerPayload, Position } from "@/types/api";

interface PlayerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  loading?: boolean;
  onSave: (payload: PlayerPayload) => void;
  onDelete?: (player: Player) => void;
}

export function PlayerSheet(props: PlayerSheetProps) {
  // desmontar quando fechado garante que o formulário reinicia a cada abertura
  if (!props.open) return null;
  return <PlayerSheetContent {...props} />;
}

function PlayerSheetContent({
  open,
  onOpenChange,
  player,
  loading,
  onSave,
  onDelete,
}: PlayerSheetProps) {
  const editing = !!player;
  const [name, setName] = useState(player?.name ?? "");
  const [stars, setStars] = useState(player?.stars ?? 5);
  const [position, setPosition] = useState<Position>(player?.position ?? "MEIO");
  const [error, setError] = useState<string | null>(null);

  function save() {
    const parsed = playerSchema.safeParse({ name: name.trim(), stars, position });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setError(null);
    onSave(parsed.data);
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Editar jogador" : "Novo jogador"}
      footer={
        <div className="flex gap-2.5">
          {editing && onDelete && (
            <AppButton
              variant="danger"
              icon={Trash2}
              onClick={() => onDelete(player)}
              disabled={loading}
              className="px-4"
            >
              Remover
            </AppButton>
          )}
          <AppButton full icon={Check} onClick={save} disabled={loading}>
            {editing ? "Salvar" : "Adicionar"}
          </AppButton>
        </div>
      }
    >
      <Field label="Nome do jogador" error={error ?? undefined}>
        <TextField
          icon={User}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Léo Andrade"
          maxLength={40}
          invalid={!!error}
        />
      </Field>

      <Field label="Posição">
        <div className="grid grid-cols-4 gap-[7px]">
          {POSITIONS.map((key) => {
            const on = position === key;
            const meta = POSITION_META[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPosition(key)}
                className="h-[46px] rounded-xl font-display text-xs font-semibold uppercase tracking-[0.03em] transition active:scale-95"
                style={{
                  background: on
                    ? `color-mix(in oklch, ${meta.accent} 18%, transparent)`
                    : "var(--card)",
                  color: on ? meta.accent : "var(--muted-text)",
                  border: `1px solid ${on ? meta.accent : "var(--line-soft)"}`,
                }}
              >
                {meta.short}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label={`Estrelas · ${stars}/10`}>
        <div className="rounded-[13px] border border-line-soft bg-card px-3.5 pt-3.5 pb-2.5">
          <div className="mb-3 flex justify-center">
            <StarRow stars={stars} size={26} gap={5} />
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={stars}
            onChange={(event) => setStars(Number(event.target.value))}
            className="w-full"
            aria-label="Estrelas"
          />
          <div className="mt-0.5 flex justify-between text-[10.5px] text-faint">
            <span>0</span>
            <span>10</span>
          </div>
        </div>
      </Field>
    </BottomSheet>
  );
}
