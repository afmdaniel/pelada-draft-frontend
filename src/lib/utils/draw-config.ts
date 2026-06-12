import { useSyncExternalStore } from "react";

export interface DrawConfig {
  playersIds: string[];
  teamsQuantity: number;
  withPosition: boolean;
}

export function drawConfigKey(peladaId: string) {
  return `pelada-draft:draw-config:${peladaId}`;
}

export function saveDrawConfig(peladaId: string, config: DrawConfig) {
  sessionStorage.setItem(drawConfigKey(peladaId), JSON.stringify(config));
}

// cache por pelada para que o snapshot seja referencialmente estável
const cache = new Map<string, { raw: string; config: DrawConfig }>();

export function loadDrawConfig(peladaId: string): DrawConfig | null {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(drawConfigKey(peladaId));
  } catch {
    return null;
  }
  if (!raw) return null;
  const cached = cache.get(peladaId);
  if (cached && cached.raw === raw) return cached.config;
  try {
    const config = JSON.parse(raw) as DrawConfig;
    cache.set(peladaId, { raw, config });
    return config;
  } catch {
    return null;
  }
}

const subscribe = () => () => {};

/**
 * Configuração do sorteio gravada na tela da pelada (sessionStorage).
 * Retorna null no servidor e quando não há configuração.
 */
export function useDrawConfig(peladaId: string): DrawConfig | null {
  return useSyncExternalStore(
    subscribe,
    () => loadDrawConfig(peladaId),
    () => null
  );
}
