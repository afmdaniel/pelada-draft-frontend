"use client";

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function Stepper({ value, min, max, onChange }: StepperProps) {
  const button = (label: string, fn: () => void, disabled: boolean) => (
    <button
      type="button"
      onClick={fn}
      disabled={disabled}
      className="grid size-[30px] place-items-center rounded-[9px] border border-line bg-card-hi font-display text-lg font-bold text-foreground transition active:scale-90 disabled:opacity-40"
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      {button("–", () => onChange(Math.max(min, value - 1)), value <= min)}
      <span className="w-4 text-center font-display text-lg font-bold text-foreground">
        {value}
      </span>
      {button("+", () => onChange(Math.min(max, value + 1)), value >= max)}
    </div>
  );
}
