"use client";

import { useSyncExternalStore } from "react";

import { getIdentifier } from "@/lib/utils/current-user";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useCurrentIdentifier(): string | null {
  return useSyncExternalStore(subscribe, getIdentifier, () => null);
}
