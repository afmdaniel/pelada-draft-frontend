"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePlayer, useUpdatePlayer } from "@/lib/hooks/use-players";
import { POSITION_LABELS } from "@/lib/utils/positions";
import {
  playerSchema,
  POSITIONS,
  type PlayerFormValues,
} from "@/lib/validations/player";
import type { Player } from "@/types/api";

interface PlayerFormDialogProps {
  peladaId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player?: Player;
}

const EMPTY_VALUES: PlayerFormValues = {
  name: "",
  stars: 5,
  position: "GERAL",
};

export function PlayerFormDialog({
  peladaId,
  open,
  onOpenChange,
  player,
}: PlayerFormDialogProps) {
  const isEditing = !!player;
  const createMutation = useCreatePlayer(peladaId);
  const updateMutation = useUpdatePlayer(peladaId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        player
          ? { name: player.name, stars: player.stars, position: player.position }
          : EMPTY_VALUES
      );
    }
  }, [open, player, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: PlayerFormValues) {
    if (isEditing) {
      updateMutation.mutate(
        { playerId: player.id, payload: values },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar jogador" : "Adicionar jogador"}
          </DialogTitle>
          <DialogDescription>
            Informe o nome, o nível de habilidade e a posição do jogador.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="player-name">Nome</Label>
            <Input
              id="player-name"
              placeholder="Nome do jogador"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="player-stars">Estrelas (0 a 10)</Label>
              <Input
                id="player-stars"
                type="number"
                min={0}
                max={10}
                step={1}
                aria-invalid={!!errors.stars}
                {...register("stars")}
              />
              {errors.stars && (
                <p className="text-xs text-destructive">
                  {errors.stars.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label id="player-position-label">Posição</Label>
              <Controller
                control={control}
                name="position"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    items={POSITIONS.map((position) => ({
                      value: position,
                      label: POSITION_LABELS[position],
                    }))}
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-labelledby="player-position-label"
                      aria-invalid={!!errors.position}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((position) => (
                        <SelectItem key={position} value={position}>
                          {POSITION_LABELS[position]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.position && (
                <p className="text-xs text-destructive">
                  {errors.position.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
