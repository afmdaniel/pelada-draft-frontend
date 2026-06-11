import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  stars,
  className,
}: {
  stars: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
        className
      )}
      title={`${stars} de 10 estrelas`}
    >
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      {stars}
    </span>
  );
}
