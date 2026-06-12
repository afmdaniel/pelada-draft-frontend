"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
}: BottomSheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[rgba(5,8,12,0.62)] animate-scrim" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-md flex-col",
            "max-h-[88dvh] rounded-t-3xl border-t border-line bg-surface outline-none",
            "shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.5)] animate-sheet-up",
            className
          )}
        >
          <div className="flex justify-center pt-2.5">
            <span className="h-1 w-9 rounded-full bg-line" />
          </div>
          <div className="flex items-center justify-between px-[18px] pt-3 pb-2">
            <DialogPrimitive.Title className="font-display text-[19px] font-semibold uppercase tracking-[0.01em] text-foreground">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Fechar"
              className="text-faint transition active:scale-90"
            >
              <X className="size-[22px]" />
            </DialogPrimitive.Close>
          </div>
          <div className="noscroll overflow-y-auto px-[18px] pt-1 pb-2">
            {children}
          </div>
          {footer && (
            <div className="border-t border-line-soft px-[18px] pt-3 pb-5">
              {footer}
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
