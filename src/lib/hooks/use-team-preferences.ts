"use client";

import { useState } from "react";

import { TEAM_COLORS, type TeamColor } from "@/lib/utils/teams";

const STORAGE_KEY = "pelada-draft:team-prefs";
const SLOTS = 10;

interface TeamPref {
  name: string;
  colorIndex: number;
}

function defaultPrefs(): TeamPref[] {
  return Array.from({ length: SLOTS }, (_, i) => ({ name: "", colorIndex: i }));
}

function loadPrefs(): TeamPref[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrefs();
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return defaultPrefs();
    const defaults = defaultPrefs();
    return defaults.map((def, i) => {
      const item = parsed[i];
      if (!item || typeof item !== "object") return def;
      const p = item as Record<string, unknown>;
      return {
        name: typeof p.name === "string" ? p.name : def.name,
        colorIndex:
          typeof p.colorIndex === "number" &&
          p.colorIndex >= 0 &&
          p.colorIndex < TEAM_COLORS.length
            ? p.colorIndex
            : def.colorIndex,
      };
    });
  } catch {
    return defaultPrefs();
  }
}

function savePrefs(prefs: TeamPref[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // armazenamento indisponível
  }
}

export function useTeamPreferences() {
  const [prefs, setPrefs] = useState<TeamPref[]>(loadPrefs);

  function getTeamName(index: number): string {
    const pref = prefs[index];
    if (!pref) return TEAM_COLORS[index % TEAM_COLORS.length].name;
    return pref.name.trim() || TEAM_COLORS[index % TEAM_COLORS.length].name;
  }

  function getTeamColor(index: number): TeamColor {
    const pref = prefs[index];
    const colorIndex = pref?.colorIndex ?? index;
    return TEAM_COLORS[colorIndex % TEAM_COLORS.length];
  }

  function setTeamPref(index: number, patch: Partial<TeamPref>) {
    setPrefs((prev) => {
      const next = prev.map((p, i) => (i === index ? { ...p, ...patch } : p));
      savePrefs(next);
      return next;
    });
  }

  return { getTeamName, getTeamColor, setTeamPref, prefs };
}
