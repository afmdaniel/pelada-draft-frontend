import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { POSITION_BADGE_CLASSES, POSITION_LABELS } from "@/lib/utils/positions";
import type { Position } from "@/types/api";

export function PositionBadge({ position }: { position: Position }) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", POSITION_BADGE_CLASSES[position])}
    >
      {POSITION_LABELS[position]}
    </Badge>
  );
}
