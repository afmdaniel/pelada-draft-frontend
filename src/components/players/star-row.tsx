import { starFill } from "@/lib/utils/stars";

const STAR_PATH =
  "M12 3l2.7 5.7L21 9.5l-4.5 4.3 1.1 6.2L12 17l-5.6 3 1.1-6.2L3 9.5l6.3-.8L12 3z";

function StarGlyph({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="block">
      <path
        d={STAR_PATH}
        fill={color}
        stroke={color}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarItem({
  fill,
  size = 13,
  color = "var(--gold)",
  empty = "var(--line)",
}: {
  fill: number;
  size?: number;
  color?: string;
  empty?: string;
}) {
  return (
    <span
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <StarGlyph color={empty} size={size} />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${fill * 100}%` }}
      >
        <StarGlyph color={color} size={size} />
      </span>
    </span>
  );
}

export function StarRow({
  stars,
  size = 13,
  gap = 2,
}: {
  stars: number;
  size?: number;
  gap?: number;
}) {
  return (
    <div className="flex" style={{ gap }}>
      {starFill(stars).map((fill, index) => (
        <StarItem key={index} fill={fill} size={size} />
      ))}
    </div>
  );
}
