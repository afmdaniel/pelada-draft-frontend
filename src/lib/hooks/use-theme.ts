"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "pelada-draft:theme";

let listeners: Array<() => void> = [];

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("theme-light")
    ? "light"
    : "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "dark");

  const setTheme = useCallback((next: "light" | "dark") => {
    document.documentElement.classList.toggle("theme-light", next === "light");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // armazenamento indisponível — tema vale só para a sessão
    }
    emit();
  }, []);

  return { theme, setTheme };
}
