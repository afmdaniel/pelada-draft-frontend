"use client";

import { ArrowLeft, Shuffle, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { PositionBadge } from "@/components/players/position-badge";
import { StarRating } from "@/components/players/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { getApiErrorMessage } from "@/lib/api/axios";
import { useDrawTeams } from "@/lib/hooks/use-draw";
import { usePelada } from "@/lib/hooks/use-peladas";
import { drawSchema } from "@/lib/validations/draw";

export default function DrawPage() {
  const { peladaId } = useParams<{ peladaId: string }>();
  const { data: pelada, isLoading, isError, error, refetch } = usePelada(peladaId);
  const drawMutation = useDrawTeams(peladaId);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teamsQuantity, setTeamsQuantity] = useState("2");
  const [withPosition, setWithPosition] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (isError || !pelada) {
    return (
      <Card className="items-center py-10 text-center">
        <CardHeader>
          <CardTitle>Não foi possível carregar a pelada</CardTitle>
          <CardDescription>{getApiErrorMessage(error)}</CardDescription>
        </CardHeader>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Tentar novamente
          </Button>
          <Button render={<Link href="/peladas" />}>Voltar para a lista</Button>
        </div>
      </Card>
    );
  }

  const players = pelada.players ?? [];
  const allSelected = players.length > 0 && selectedIds.length === players.length;
  const result = drawMutation.data?.data;

  function togglePlayer(playerId: string, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? [...current, playerId]
        : current.filter((id) => id !== playerId)
    );
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? players.map((player) => player.id) : []);
  }

  function handleDraw() {
    const parsed = drawSchema.safeParse({
      playersIds: selectedIds,
      teamsQuantity,
      withPosition,
    });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setValidationError(null);
    drawMutation.mutate(parsed.data);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2 text-muted-foreground"
          render={<Link href={`/peladas/${peladaId}`} />}
        >
          <ArrowLeft />
          {pelada.name}
        </Button>
        <h1 className="font-heading text-2xl font-semibold">Sorteio de times</h1>
        <p className="text-sm text-muted-foreground">
          Selecione os jogadores presentes e monte times equilibrados.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Jogadores presentes</CardTitle>
                <CardDescription>
                  {selectedIds.length} de {players.length} selecionados
                </CardDescription>
              </div>
              {players.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleAll(checked === true)}
                  />
                  <Label
                    htmlFor="select-all"
                    className="text-sm text-muted-foreground"
                  >
                    Todos
                  </Label>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {players.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Cadastre jogadores na pelada antes de sortear os times.
              </p>
            ) : (
              <div className="flex flex-col">
                {players.map((player, index) => (
                  <div key={player.id}>
                    {index > 0 && <Separator />}
                    <label
                      htmlFor={`player-${player.id}`}
                      className="flex cursor-pointer items-center justify-between gap-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Checkbox
                          id={`player-${player.id}`}
                          checked={selectedIds.includes(player.id)}
                          onCheckedChange={(checked) =>
                            togglePlayer(player.id, checked === true)
                          }
                        />
                        <span className="truncate text-sm font-medium">
                          {player.name}
                        </span>
                        <PositionBadge position={player.position} />
                      </div>
                      <StarRating stars={player.stars} />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
            <CardDescription>Defina como o sorteio será feito.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="teams-quantity">Quantidade de times</Label>
              <Input
                id="teams-quantity"
                type="number"
                min={2}
                step={1}
                value={teamsQuantity}
                onChange={(event) => setTeamsQuantity(event.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="with-position">Equilibrar por posição</Label>
                <p className="text-xs text-muted-foreground">
                  Distribui zaga, meio e ataque entre os times.
                </p>
              </div>
              <Switch
                id="with-position"
                checked={withPosition}
                onCheckedChange={setWithPosition}
              />
            </div>
            {validationError && (
              <p className="text-xs text-destructive">{validationError}</p>
            )}
            <Button
              className="w-full"
              disabled={drawMutation.isPending || players.length === 0}
              onClick={handleDraw}
            >
              <Shuffle />
              {drawMutation.isPending
                ? "Sorteando..."
                : result
                  ? "Sortear novamente"
                  : "Sortear times"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold">Resultado</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.teams.map((team, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>Time {index + 1}</CardTitle>
                    <Badge variant="secondary" className="gap-1">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {team.totalStars}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    {team.players.map((player, playerIndex) => (
                      <div key={`${player.name}-${playerIndex}`}>
                        {playerIndex > 0 && <Separator />}
                        <div className="flex items-center justify-between gap-3 py-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-sm">
                              {player.name}
                            </span>
                            <PositionBadge position={player.position} />
                          </div>
                          <StarRating stars={player.stars} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
