const STORAGE_KEY = "pelada-draft:identifier";

export function saveIdentifier(identifier: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, identifier);
}

export function getIdentifier(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function clearIdentifier() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
