import type { Position, Privilege } from "@/types/api";

export const POSITION_LABELS: Record<Position, string> = {
  ZAGA: "Zaga",
  MEIO: "Meio",
  ATAQUE: "Ataque",
  GERAL: "Geral",
};

export const POSITION_BADGE_CLASSES: Record<Position, string> = {
  ZAGA: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  MEIO: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  ATAQUE: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  GERAL: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export const PRIVILEGE_LABELS: Record<Privilege, string> = {
  MANAGE_PLAYERS: "Gerenciar jogadores",
  DRAW_TEAMS: "Sortear times",
};
