import type { Position, Privilege } from "@/types/api";

export interface PositionMeta {
  label: string;
  short: string;
  accent: string;
}

export const POSITION_META: Record<Position, PositionMeta> = {
  ZAGA: { label: "Zaga", short: "ZAG", accent: "oklch(0.70 0.13 233)" },
  MEIO: { label: "Meio", short: "MEI", accent: "oklch(0.78 0.12 178)" },
  ATAQUE: { label: "Ataque", short: "ATA", accent: "oklch(0.74 0.16 48)" },
  GERAL: { label: "Geral", short: "GER", accent: "oklch(0.70 0.02 250)" },
};

export const POSITION_LABELS: Record<Position, string> = {
  ZAGA: "Zaga",
  MEIO: "Meio",
  ATAQUE: "Ataque",
  GERAL: "Geral",
};

export const POSITION_ORDER: Position[] = ["ATAQUE", "MEIO", "ZAGA", "GERAL"];

export const PRIVILEGE_LABELS: Record<Privilege, string> = {
  MANAGE_PLAYERS: "Gerenciar jogadores",
  DRAW_TEAMS: "Sortear times",
};
