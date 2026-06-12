interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <div className="flex items-end justify-between px-5 pt-1.5 pb-4">
      <div>
        {subtitle && (
          <div className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            {subtitle}
          </div>
        )}
        <h1 className="font-display text-[27px] leading-none font-bold uppercase text-foreground">
          {title}
        </h1>
      </div>
      {right}
    </div>
  );
}
