"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { useDrawTeams } from "@/lib/hooks/use-draw";

type DrawMutation = ReturnType<typeof useDrawTeams>;

interface PeladaDraftContextValue {
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  teamsQuantity: number;
  setTeamsQuantity: React.Dispatch<React.SetStateAction<number>>;
  withPosition: boolean;
  setWithPosition: React.Dispatch<React.SetStateAction<boolean>>;
  draw: DrawMutation;
  drawKey: number;
  runDraw: () => void;
}

const PeladaDraftContext = createContext<PeladaDraftContextValue | null>(null);

/**
 * Mantém em memória a configuração do sorteio (convocados, quantidade de
 * times, equilíbrio por posição) e o resultado, enquanto o usuário navega
 * pelas rotas da pelada. Montado no layout de /peladas/[peladaId], é
 * descartado ao sair dessas rotas.
 */
export function PeladaDraftProvider({
  peladaId,
  children,
}: {
  peladaId: string;
  children: React.ReactNode;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teamsQuantity, setTeamsQuantity] = useState(4);
  const [withPosition, setWithPosition] = useState(true);
  const [drawKey, setDrawKey] = useState(0);
  const draw = useDrawTeams(peladaId);

  const { mutate } = draw;

  const value = useMemo<PeladaDraftContextValue>(
    () => ({
      selectedIds,
      setSelectedIds,
      teamsQuantity,
      setTeamsQuantity,
      withPosition,
      setWithPosition,
      draw,
      drawKey,
      runDraw: () =>
        mutate(
          { playersIds: selectedIds, teamsQuantity, withPosition },
          { onSuccess: () => setDrawKey((key) => key + 1) }
        ),
    }),
    [selectedIds, teamsQuantity, withPosition, draw, drawKey, mutate]
  );

  return (
    <PeladaDraftContext.Provider value={value}>
      {children}
    </PeladaDraftContext.Provider>
  );
}

export function usePeladaDraft() {
  const context = useContext(PeladaDraftContext);
  if (!context) {
    throw new Error(
      "usePeladaDraft deve ser usado dentro de PeladaDraftProvider"
    );
  }
  return context;
}
