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

/** Bottom sheet no mobile; modal centrado a partir de sm. */
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
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-md flex-col outline-none",
            "max-h-[88dvh] rounded-t-3xl border-t border-line bg-surface",
            "shadow-[0_-1.25rem_3.125rem_-0.625rem_rgba(0,0,0,0.5)] max-sm:animate-sheet-up",
            "sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[85dvh] sm:max-w-[30rem] sm:rounded-3xl sm:border sm:border-line sm:shadow-[0_1.5rem_4rem_-1rem_rgba(0,0,0,0.55)] sm:animate-pop-in",
            className
          )}
        >
          <div className="flex justify-center pt-2.5 sm:hidden">
            <span className="h-1 w-9 rounded-full bg-line" />
          </div>
          <div className="flex items-center justify-between px-4.5 pt-3 pb-2 sm:pt-4.5">
            <DialogPrimitive.Title className="font-display text-[1.1875rem] font-semibold uppercase tracking-[0.01em] text-foreground">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Fechar"
              className="-m-2.5 p-2.5 text-faint transition active:scale-90"
            >
              <X className="size-5.5" />
            </DialogPrimitive.Close>
          </div>
          <div className="noscroll overflow-y-auto px-4.5 pt-1 pb-2">
            {children}
          </div>
          {footer && (
            <div className="border-t border-line-soft px-4.5 pt-3 pb-5 sm:rounded-b-3xl">
              {footer}
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
