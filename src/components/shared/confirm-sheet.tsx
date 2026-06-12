"use client";

import { Trash2 } from "lucide-react";

import { AppButton } from "@/components/shared/app-button";
import { BottomSheet } from "@/components/shared/bottom-sheet";

interface ConfirmSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
}

export function ConfirmSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Excluir",
  loading,
  onConfirm,
}: ConfirmSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <div className="flex gap-2.5">
          <AppButton
            variant="secondary"
            full
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </AppButton>
          <AppButton
            variant="danger"
            full
            icon={Trash2}
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmLabel}
          </AppButton>
        </div>
      }
    >
      <div className="px-0 pt-1.5 pb-1 text-center">
        <div className="mx-auto mb-3.5 grid size-[58px] place-items-center rounded-[18px] bg-danger-soft text-danger">
          <Trash2 className="size-[26px]" />
        </div>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </BottomSheet>
  );
}
