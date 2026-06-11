"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
import { useCreatePelada, useUpdatePelada } from "@/lib/hooks/use-peladas";
import { peladaSchema, type PeladaFormValues } from "@/lib/validations/pelada";

interface PeladaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pelada?: { id: string; name: string };
}

export function PeladaFormDialog({
  open,
  onOpenChange,
  pelada,
}: PeladaFormDialogProps) {
  const isEditing = !!pelada;
  const createMutation = useCreatePelada();
  const updateMutation = useUpdatePelada(pelada?.id ?? "");
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PeladaFormValues>({
    resolver: zodResolver(peladaSchema),
    defaultValues: { name: pelada?.name ?? "" },
  });

  useEffect(() => {
    if (open) reset({ name: pelada?.name ?? "" });
  }, [open, pelada, reset]);

  function onSubmit(values: PeladaFormValues) {
    mutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar pelada" : "Nova pelada"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Altere o nome da sua pelada."
              : "Dê um nome para a sua pelada."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pelada-name">Nome</Label>
            <Input
              id="pelada-name"
              placeholder="Pelada de quinta"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Salvando..."
                : isEditing
                  ? "Salvar"
                  : "Criar pelada"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
