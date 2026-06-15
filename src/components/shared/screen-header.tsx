interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <div className="flex items-end justify-between px-5 pt-1.5 pb-4 lg:px-0">
      <div>
        {subtitle && (
          <div className="mb-1 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-primary">
            {subtitle}
          </div>
        )}
        <h1 className="font-display text-[1.6875rem] leading-none font-bold uppercase text-foreground md:text-[2rem]">
          {title}
        </h1>
      </div>
      {right}
    </div>
  );
}
