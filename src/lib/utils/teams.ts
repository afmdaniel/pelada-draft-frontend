export interface TeamColor {
  name: string;
  hex: string;
  ink: string;
  glow: string;
}

// Identidade dos times na ordem: Amarelo, Azul, Branco, Verde, Vermelho, Preto, Laranja, Roxo, Cinza, Rosa.
export const TEAM_COLORS: TeamColor[] = [
  { name: "Amarelo",  hex: "#F5C518", ink: "#1a1505", glow: "rgba(245,197,24,0.30)"  },
  { name: "Azul",     hex: "#2E7BFF", ink: "#ffffff", glow: "rgba(46,123,255,0.34)"  },
  { name: "Branco",   hex: "#E8EDF3", ink: "#15181d", glow: "rgba(232,237,243,0.26)" },
  { name: "Verde",    hex: "#22C55E", ink: "#06210f", glow: "rgba(34,197,94,0.30)"   },
  { name: "Vermelho", hex: "#FB4D54", ink: "#ffffff", glow: "rgba(251,77,84,0.32)"   },
  { name: "Preto",    hex: "#222831", ink: "#eef3f8", glow: "rgba(120,140,170,0.28)" },
  { name: "Laranja",  hex: "#F97316", ink: "#1c0500", glow: "rgba(249,115,22,0.32)"  },
  { name: "Roxo",     hex: "#9333EA", ink: "#ffffff", glow: "rgba(147,51,234,0.32)"  },
  { name: "Cinza",    hex: "#6B7280", ink: "#ffffff", glow: "rgba(107,114,128,0.28)" },
  { name: "Rosa",     hex: "#EC4899", ink: "#ffffff", glow: "rgba(236,72,153,0.30)"  },
];

export const MAX_TEAMS = 10;

export function teamColor(index: number): TeamColor {
  return TEAM_COLORS[index % TEAM_COLORS.length];
}
