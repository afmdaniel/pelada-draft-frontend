"use client";

import { toPng } from "html-to-image";
import { Check, ImageDown, Share2, Shuffle, Trophy, Volleyball } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";

import { TeamPanel } from "@/components/draw/team-panel";
import { usePeladaDraft } from "@/components/peladas/pelada-draft-context";
import { StarRow } from "@/components/players/star-row";
import { Stepper } from "@/components/shared/stepper";
import { AppButton } from "@/components/shared/app-button";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { PrivBadge } from "@/components/shared/priv-badge";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api/axios";
import { usePelada } from "@/lib/hooks/use-peladas";
import { POSITION_META } from "@/lib/utils/positions";
import { teamColor } from "@/lib/utils/teams";
import type { DrawTeam } from "@/types/api";

function teamsAsText(peladaName: string, teams: DrawTeam[]): string {
  const lines = [`⚽ ${peladaName} — times sorteados:`, ""];
  teams.forEach((team, index) => {
    const color = teamColor(index);
    lines.push(`*Time ${color.name}* (★${team.totalStars})`);
    team.players.forEach((player) => {
      lines.push(`- ${player.name} (${POSITION_META[player.position].short} ★${player.stars})`);
    });
    lines.push("");
  });
  lines.push("Sorteado no PeladaDraft");
  return lines.join("\n");
}

function ShareSheet({
  open,
  onOpenChange,
  peladaName,
  teams,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  peladaName: string;
  teams: DrawTeam[];
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const date = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(teamsAsText(peladaName, teams));
      toast.success("Times copiados para a área de transferência.");
    } catch {
      toast.error("Não foi possível copiar os times.");
    }
  }

  function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(
      teamsAsText(peladaName, teams)
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function shareImage() {
    if (!previewRef.current) return;
    const el = previewRef.current;
    try {
      await document.fonts.ready;
      el.style.borderRadius = "0";
      const dataUrl = await toPng(el, { pixelRatio: 2 });
      el.style.borderRadius = "";

      const fileName = `times-${peladaName.toLowerCase().replace(/\s+/g, "-")}.png`;

      const canShareFiles =
        typeof navigator.share === "function" &&
        navigator.canShare?.({
          files: [new File([""], "test.png", { type: "image/png" })],
        });

      if (canShareFiles) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: "image/png" });
        await navigator.share({ title: `Times — ${peladaName}`, files: [file] });
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      el.style.borderRadius = "";
      if (err instanceof DOMException && err.name === "AbortError") return;
      toast.error("Não foi possível exportar a imagem.");
    }
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Compartilhar times"
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex gap-2.5">
            <AppButton variant="secondary" icon={Share2} onClick={copy} className="px-3 shrink-0">
              Copiar texto
            </AppButton>
            <AppButton full onClick={shareWhatsApp}>
              WhatsApp
            </AppButton>
          </div>
          <AppButton variant="soft" full icon={ImageDown} onClick={shareImage}>
            Exportar como imagem
          </AppButton>
        </div>
      }
    >
      {/* prévia do gráfico exportável */}
      <div
        ref={previewRef}
        className="relative overflow-hidden rounded-[18px] border border-line p-4"
        style={{ background: "linear-gradient(165deg, #131a26, #0d121b)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(420px 180px at 80% -10%, var(--accent-soft), transparent 60%)",
          }}
        />
        <div className="relative flex items-center gap-2">
          <div className="grid size-[30px] place-items-center rounded-[9px] bg-primary">
            <Volleyball
              className="size-[18px]"
              strokeWidth={1.7}
              style={{ color: "var(--accent-ink)" }}
            />
          </div>
          <div className="flex-1">
            <div className="font-display text-[0.9375rem] leading-none font-bold uppercase text-white">
              {peladaName}
            </div>
            <div className="font-sans text-[0.65625rem] font-semibold text-white/50">
              {date} · {teams.length} times
            </div>
          </div>
          <div className="font-display text-[0.625rem] font-bold uppercase tracking-[0.06em] text-primary">
            PeladaDraft
          </div>
        </div>

        <div className="relative mt-3.5 grid grid-cols-2 gap-2">
          {teams.map((team, index) => {
            const color = teamColor(index);
            return (
              <div
                key={index}
                className="rounded-[11px] border border-white/[0.07] bg-white/[0.035] px-2.5 py-[9px]"
                style={{ borderTop: `2px solid ${color.hex}` }}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className="font-display text-xs font-bold uppercase"
                    style={{ color: color.hex }}
                  >
                    {color.name}
                  </span>
                  <span className="font-display text-xs font-bold text-white/85">
                    ★{team.totalStars}
                  </span>
                </div>
                <div className="flex flex-col gap-[3px]">
                  {team.players.map((player, playerIndex) => {
                    const meta = POSITION_META[player.position];
                    return (
                      <div
                        key={`${player.name}-${playerIndex}`}
                        className="flex items-center gap-[5px]"
                      >
                        <span
                          className="w-5 shrink-0 font-display text-[8.5px] font-bold uppercase tracking-[0.03em]"
                          style={{ color: meta.accent }}
                        >
                          {meta.short}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-sans text-[10.5px] font-semibold text-white/85">
                          {player.name}
                        </span>
                        <span className="shrink-0">
                          <StarRow stars={player.stars} size={7} gap={1} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}

type SwapSelection = { teamIndex: number; playerIndex: number };

export default function DrawPage() {
  const { peladaId } = useParams<{ peladaId: string }>();
  const router = useRouter();
  const { data: pelada } = usePelada(peladaId);
  const {
    draw, drawKey, runDraw,
    teamsQuantity, setTeamsQuantity,
    withPosition, setWithPosition,
    selectedIds,
  } = usePeladaDraft();

  const maxTeams = Math.max(2, Math.floor(selectedIds.length / 2));

  const [shareOpen, setShareOpen] = useState(false);

  // Local mutable copy of teams for client-side swaps
  const [localTeams, setLocalTeams] = useState<DrawTeam[] | null>(null);
  const [swapSelection, setSwapSelection] = useState<SwapSelection | null>(null);
  const [showHint, setShowHint] = useState(false);
  const isAnimatingRef = useRef(false);

  // Sync local teams whenever a new draw result arrives
  useEffect(() => {
    if (!draw.data) return;
    setLocalTeams(draw.data.data.draw.map((t) => ({ ...t, players: [...t.players] })));
    setSwapSelection(null);
    setShowHint(true);
    isAnimatingRef.current = false;
  }, [drawKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hide the swap hint after 5 seconds
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, [showHint]);

  // Clean up any dangling clones if the component unmounts mid-animation
  useEffect(() => {
    return () => {
      document.querySelectorAll("[data-swap-clone]").forEach((el) => el.remove());
    };
  }, []);

  const orphan = draw.isIdle && !draw.data;
  useEffect(() => {
    if (orphan) router.replace(`/peladas/${peladaId}`);
  }, [orphan, peladaId, router]);

  const peladaName = pelada?.name ?? "Pelada";

  function handlePlayerSelect(teamIndex: number, playerIndex: number) {
    if (isAnimatingRef.current) return;

    if (!swapSelection) {
      setSwapSelection({ teamIndex, playerIndex });
      return;
    }
    // Same player tapped — deselect
    if (swapSelection.teamIndex === teamIndex && swapSelection.playerIndex === playerIndex) {
      setSwapSelection(null);
      return;
    }
    // Same team, different player — re-select
    if (swapSelection.teamIndex === teamIndex) {
      setSwapSelection({ teamIndex, playerIndex });
      return;
    }

    // ── Different team: FLIP clone animation ──────────────────────────────
    const sel = swapSelection;
    const el1 = document.querySelector<HTMLElement>(
      `[data-swap-id="${sel.teamIndex}-${sel.playerIndex}"]`
    );
    const el2 = document.querySelector<HTMLElement>(
      `[data-swap-id="${teamIndex}-${playerIndex}"]`
    );

    if (!el1 || !el2) {
      // Fallback: instant swap with no animation
      flushSync(() => {
        setLocalTeams((prev) => applySwap(prev, sel, teamIndex, playerIndex));
        setSwapSelection(null);
        setShowHint(false);
      });
      return;
    }

    isAnimatingRef.current = true;

    // FIRST — capture starting positions
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    // Build fixed-position clones that sit exactly over the originals
    const clone1 = el1.cloneNode(true) as HTMLElement;
    const clone2 = el2.cloneNode(true) as HTMLElement;
    for (const [clone, rect] of [[clone1, rect1], [clone2, rect2]] as const) {
      clone.setAttribute("data-swap-clone", "");
      clone.removeAttribute("data-swap-id");
      clone.style.cssText = `
        position:fixed;top:${rect.top}px;left:${rect.left}px;
        width:${rect.width}px;height:${rect.height}px;
        margin:0;padding-left:${getComputedStyle(el1).paddingLeft};
        pointer-events:none;z-index:9999;
        border-radius:11px;
      `;
      document.body.appendChild(clone);
    }

    // Hide originals so DOM update is invisible
    el1.style.opacity = "0";
    el2.style.opacity = "0";

    // LAST — synchronously update the DOM (cards now show new content, still hidden)
    let teamsAfterSwap: DrawTeam[] | null = null;
    flushSync(() => {
      setLocalTeams((prev) => {
        const next = applySwap(prev, sel, teamIndex, playerIndex);
        teamsAfterSwap = next;
        return next;
      });
      setSwapSelection(null);
      setShowHint(false);
    });

    // INVERT+PLAY — animate clones from old positions to destinations
    const dx = rect2.left - rect1.left;
    const dy = rect2.top - rect1.top;
    const opts: KeyframeAnimationOptions = { duration: 420, easing: "ease-in-out" };

    const anim1 = clone1.animate(
      [{ transform: "translate(0,0)" }, { transform: `translate(${dx}px,${dy}px)` }],
      opts
    );
    const anim2 = clone2.animate(
      [{ transform: "translate(0,0)" }, { transform: `translate(${-dx}px,${-dy}px)` }],
      opts
    );

    const swapCleanup = () => {
      el1.style.opacity = "";
      el2.style.opacity = "";
      clone1.remove();
      clone2.remove();
      // FLIP-animate the star-order reorder; it will set isAnimatingRef = false when done
      animateReorder([sel.teamIndex, teamIndex], teamsAfterSwap);
    };

    Promise.all([anim1.finished, anim2.finished]).then(swapCleanup).catch(swapCleanup);
  }

  function applySwap(
    prev: DrawTeam[] | null,
    sel: SwapSelection,
    teamIndex: number,
    playerIndex: number
  ): DrawTeam[] | null {
    if (!prev) return prev;
    const next = prev.map((t) => ({ ...t, players: [...t.players] }));
    const p1 = next[sel.teamIndex].players[sel.playerIndex];
    const p2 = next[teamIndex].players[playerIndex];
    next[sel.teamIndex].players[sel.playerIndex] = p2;
    next[teamIndex].players[playerIndex] = p1;
    next[sel.teamIndex].totalStars = next[sel.teamIndex].players.reduce((s, p) => s + p.stars, 0);
    next[teamIndex].totalStars = next[teamIndex].players.reduce((s, p) => s + p.stars, 0);
    return next;
  }

  // FLIP animation for the star-order reorder that follows every swap.
  // Uses flying clones (same pattern as the swap itself) so cards with key={index}
  // appear to slide to their new positions even though React updates them in place.
  function animateReorder(teamIndices: number[], snapshot: DrawTeam[] | null) {
    if (!snapshot) {
      isAnimatingRef.current = false;
      return;
    }

    type CloneEntry = { clone: HTMLElement; dx: number; dy: number };
    const pendingClones: CloneEntry[] = [];
    const elemsToReveal: HTMLElement[] = [];

    for (const ti of teamIndices) {
      const players = snapshot[ti].players;
      const sorted = [...players].sort((a, b) => b.stars - a.stars);

      if (players.every((p, pi) => p.name === sorted[pi].name)) continue;

      // Capture the screen rect of every slot in this team (slot positions are stable)
      const slotRects = players.map(
        (_, pi) =>
          document.querySelector<HTMLElement>(`[data-swap-id="${ti}-${pi}"]`)?.getBoundingClientRect()
      );

      // Identify which index slots change content after sort
      const dirtySlots = new Set<number>();
      for (let pi = 0; pi < players.length; pi++) {
        const newPi = sorted.findIndex((p) => p.name === players[pi].name);
        if (newPi !== pi) {
          dirtySlots.add(pi);
          dirtySlots.add(newPi);
        }
      }

      // Create a flying clone for each player that moves to a new slot
      for (let pi = 0; pi < players.length; pi++) {
        const newPi = sorted.findIndex((p) => p.name === players[pi].name);
        if (newPi === pi) continue;

        const el = document.querySelector<HTMLElement>(`[data-swap-id="${ti}-${pi}"]`);
        const oldRect = slotRects[pi];
        const destRect = slotRects[newPi];
        if (!el || !oldRect || !destRect) continue;

        const clone = el.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-swap-clone", "");
        clone.removeAttribute("data-swap-id");
        clone.style.cssText = `
          position:fixed;top:${oldRect.top}px;left:${oldRect.left}px;
          width:${oldRect.width}px;height:${oldRect.height}px;
          margin:0;pointer-events:none;z-index:9998;border-radius:11px;
        `;
        document.body.appendChild(clone);
        pendingClones.push({ clone, dx: destRect.left - oldRect.left, dy: destRect.top - oldRect.top });
      }

      // Hide dirty slots so the in-place React update is invisible until clones land
      for (const pi of dirtySlots) {
        const el = document.querySelector<HTMLElement>(`[data-swap-id="${ti}-${pi}"]`);
        if (el) { el.style.opacity = "0"; elemsToReveal.push(el); }
      }
    }

    // Commit the sort to React state
    flushSync(() => {
      setLocalTeams((prev) => {
        if (!prev) return prev;
        const next = [...prev];
        for (const ti of teamIndices) {
          next[ti] = { ...next[ti], players: [...next[ti].players].sort((a, b) => b.stars - a.stars) };
        }
        return next;
      });
    });

    const finish = () => {
      elemsToReveal.forEach((el) => { el.style.opacity = ""; });
      pendingClones.forEach(({ clone }) => clone.remove());
      isAnimatingRef.current = false;
    };

    if (pendingClones.length === 0) { finish(); return; }

    const anims = pendingClones.map(({ clone, dx, dy }) =>
      clone.animate(
        [{ transform: "translate(0,0)" }, { transform: `translate(${dx}px,${dy}px)` }],
        { duration: 300, easing: "ease-in-out" }
      )
    );

    Promise.all(anims.map((a) => a.finished)).then(finish).catch(finish);
  }

  if (orphan) return null;

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        title="Sorteio"
        onBack={() => router.push(`/peladas/${peladaId}`)}
        right={
          localTeams && (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              aria-label="Compartilhar"
              className="grid size-10 place-items-center rounded-xl bg-accent-soft text-primary transition active:scale-90"
            >
              <Share2 className="size-[19px]" />
            </button>
          )
        }
      />

      <div className="flex-1 px-4 pb-3 lg:px-0">
        {/* hero */}
        <div className="mb-4 animate-fade-up">
          <div className="mb-[5px] font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-primary">
            {peladaName}
          </div>
          <h1 className="font-display text-[1.875rem] leading-[0.95] font-bold uppercase text-foreground">
            Times Sorteados
          </h1>
          <div className="mt-[11px] flex gap-[7px]">
            <PrivBadge tone="draw">
              <Trophy className="size-[11px]" /> {localTeams?.length ?? teamsQuantity} times
            </PrivBadge>
            <PrivBadge tone={withPosition ? "manage" : "muted"}>
              {withPosition
                ? "Equilíbrio por posição"
                : "Equilíbrio por estrelas"}
            </PrivBadge>
          </div>
        </div>

        {draw.isPending && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton className="h-48 rounded-[18px]" />
            <Skeleton className="h-48 rounded-[18px]" />
          </div>
        )}

        {draw.isError && !draw.isPending && (
          <div className="rounded-[18px] border border-line-soft bg-card p-6 text-center">
            <p className="font-sans text-sm text-muted-foreground">
              {getApiErrorMessage(draw.error)}
            </p>
            <AppButton
              variant="secondary"
              size="sm"
              onClick={runDraw}
              className="mx-auto mt-4"
            >
              Tentar novamente
            </AppButton>
          </div>
        )}

        {localTeams && !draw.isPending && (
          <>
            {showHint && (
              <p className="mb-3 text-center font-sans text-[0.75rem] text-faint animate-fade-up">
                Toque em um jogador para trocar entre times
              </p>
            )}
            <div
              key={drawKey}
              className="grid grid-cols-1 gap-[13px] sm:grid-cols-2 xl:grid-cols-3"
            >
              {localTeams.map((team, index) => (
                <TeamPanel
                  key={index}
                  team={team}
                  color={teamColor(index)}
                  teamIndex={index}
                  startIndex={localTeams
                    .slice(0, index)
                    .reduce((sum, t) => sum + t.players.length, 0)}
                  baseDelay={index * 90}
                  selectedPlayerIndex={
                    swapSelection?.teamIndex === index ? swapSelection.playerIndex : undefined
                  }
                  onPlayerSelect={(playerIndex) => handlePlayerSelect(index, playerIndex)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ações */}
      <div className="sticky bottom-0 z-40 border-t border-line-soft bg-[color-mix(in_oklch,var(--surface)_90%,transparent)] backdrop-blur-md">
        {/* controls row: team counter (left) + position toggle (right) */}
        <div className="flex items-center justify-between gap-4 px-4 pt-2.5">
          <div className="flex items-center gap-[9px]">
            <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-faint">
              Times
            </span>
            <Stepper value={teamsQuantity} min={2} max={maxTeams} onChange={setTeamsQuantity} />
          </div>
          <button
            type="button"
            onClick={() => setWithPosition((v) => !v)}
            className={`flex items-center gap-[7px] rounded-[10px] px-3 py-2 transition active:scale-95 ${
              withPosition
                ? "border border-transparent bg-accent-soft"
                : "border border-line-soft bg-card-hi"
            }`}
          >
            <span
              className="grid size-4 place-items-center rounded-[5px]"
              style={{
                background: withPosition ? "var(--accent-color)" : "transparent",
                border: `1.5px solid ${withPosition ? "var(--accent-color)" : "var(--line)"}`,
                color: "var(--accent-ink)",
              }}
            >
              {withPosition && <Check className="size-[11px]" strokeWidth={3} />}
            </span>
            <span
              className={`font-sans text-xs font-bold ${
                withPosition ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Equilibrar posição
            </span>
          </button>
        </div>

        {/* buttons row */}
        <div className="flex gap-2.5 px-4 pt-2 pb-3.5">
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            disabled={!localTeams}
            aria-label="Compartilhar"
            className="grid h-[54px] w-14 shrink-0 place-items-center rounded-2xl border border-line bg-card-hi text-foreground transition active:scale-95 disabled:opacity-40"
          >
            <Share2 className="size-[21px]" />
          </button>
          <button
            type="button"
            onClick={runDraw}
            disabled={draw.isPending}
            className="flex h-[54px] flex-1 items-center justify-center gap-[9px] rounded-2xl transition active:scale-[0.98] disabled:opacity-60"
            style={{
              background:
                "linear-gradient(120deg, var(--accent-color), var(--accent-press))",
              color: "var(--accent-ink)",
              boxShadow: "0 14px 30px -12px var(--accent-color)",
            }}
          >
            <Shuffle className="size-[21px]" strokeWidth={2.2} />
            <span className="font-display text-[1.0625rem] font-bold uppercase tracking-[0.02em] whitespace-nowrap">
              {draw.isPending ? "Sorteando..." : "Refazer Sorteio"}
            </span>
          </button>
        </div>
      </div>

      {localTeams && (
        <ShareSheet
          open={shareOpen}
          onOpenChange={setShareOpen}
          peladaName={peladaName}
          teams={localTeams}
        />
      )}
    </div>
  );
}
