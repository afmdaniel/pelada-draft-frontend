"use client";

import { Check, Volleyball } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/shared/app-button";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Field, TextField } from "@/components/shared/field";
import { peladaSchema } from "@/lib/validations/pelada";

interface PeladaNameSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  loading?: boolean;
  onSubmit: (name: string) => void;
}

export function PeladaNameSheet(props: PeladaNameSheetProps) {
  // desmontar quando fechado garante que o formulário reinicia a cada abertura
  if (!props.open) return null;
  return <PeladaNameSheetContent {...props} />;
}

function PeladaNameSheetContent({
  open,
  onOpenChange,
  initialName,
  loading,
  onSubmit,
}: PeladaNameSheetProps) {
  const editing = initialName !== undefined;
  const [name, setName] = useState(initialName ?? "");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const parsed = peladaSchema.safeParse({ name: name.trim() });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Nome inválido");
      return;
    }
    setError(null);
    onSubmit(parsed.data.name);
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Editar nome" : "Nova Pelada"}
      footer={
        <AppButton full size="lg" icon={Check} onClick={submit} disabled={loading}>
          {editing ? "Salvar" : "Criar Pelada"}
        </AppButton>
      }
    >
      {!editing && (
        <p className="mb-4 font-sans text-[13.5px] leading-relaxed text-muted-foreground">
          Dê um nome ao grupo. Você será o{" "}
          <strong className="text-foreground">dono</strong> e poderá adicionar
          jogadores e gerenciar permissões.
        </p>
      )}
      <Field
        label="Nome da pelada"
        hint="Entre 3 e 30 caracteres"
        error={error ?? undefined}
      >
        <TextField
          icon={Volleyball}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Pelada de Quinta"
          maxLength={30}
          invalid={!!error}
        />
      </Field>
    </BottomSheet>
  );
}
