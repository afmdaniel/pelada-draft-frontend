"use client";

import {
  ArrowLeft,
  Crown,
  Pencil,
  Plus,
  Shield,
  Shuffle,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { PeladaFormDialog } from "@/components/peladas/pelada-form-dialog";
import { PlayerFormDialog } from "@/components/players/player-form-dialog";
import { PositionBadge } from "@/components/players/position-badge";
import { StarRating } from "@/components/players/star-rating";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api/axios";
import { useCurrentIdentifier } from "@/lib/hooks/use-current-user";
import { useDeletePelada, usePelada } from "@/lib/hooks/use-peladas";
import { useDeletePlayer } from "@/lib/hooks/use-players";
import { hasPrivilege, isOwner } from "@/lib/utils/privileges";
import type { Player } from "@/types/api";

export default function PeladaDetailsPage() {
  const { peladaId } = useParams<{ peladaId: string }>();
  const router = useRouter();
  const identifier = useCurrentIdentifier();

  const { data: pelada, isLoading, isError, error, refetch } = usePelada(peladaId);
  const deletePeladaMutation = useDeletePelada();
  const deletePlayerMutation = useDeletePlayer(peladaId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | undefined>();
  const [playerToDelete, setPlayerToDelete] = useState<Player | undefined>();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-72 rounded-xl" />
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

  const owner = isOwner(pelada, identifier);
  const canManagePlayers = hasPrivilege(pelada, "MANAGE_PLAYERS", identifier);
  const canDraw = hasPrivilege(pelada, "DRAW_TEAMS", identifier);
  const players = pelada.players ?? [];

  function openCreatePlayer() {
    setPlayerToEdit(undefined);
    setPlayerFormOpen(true);
  }

  function openEditPlayer(player: Player) {
    setPlayerToEdit(player);
    setPlayerFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2 text-muted-foreground"
          render={<Link href="/peladas" />}
        >
          <ArrowLeft />
          Minhas peladas
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold">{pelada.name}</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {owner && <Crown className="size-3.5 text-amber-500" />}
              {owner ? "Você é o dono" : `Dono: ${pelada.ownerUsername}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canDraw && (
              <Button render={<Link href={`/peladas/${pelada.id}/draw`} />}>
                <Shuffle />
                Sortear times
              </Button>
            )}
            {owner && (
              <>
                <Button
                  variant="outline"
                  render={<Link href={`/peladas/${pelada.id}/permissions`} />}
                >
                  <Shield />
                  Permissões
                </Button>
                <Button variant="outline" onClick={() => setEditOpen(true)}>
                  <Pencil />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 />
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4" />
                Jogadores
                <span className="text-sm font-normal text-muted-foreground">
                  ({players.length})
                </span>
              </CardTitle>
              <CardDescription>
                Jogadores cadastrados nesta pelada.
              </CardDescription>
            </div>
            {canManagePlayers && (
              <Button size="sm" onClick={openCreatePlayer}>
                <Plus />
                Adicionar jogador
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum jogador cadastrado ainda.
              {canManagePlayers && " Adicione o primeiro jogador para começar."}
            </p>
          ) : (
            <div className="flex flex-col">
              {players.map((player, index) => (
                <div key={player.id}>
                  {index > 0 && <Separator />}
                  <div className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="truncate text-sm font-medium">
                        {player.name}
                      </span>
                      <PositionBadge position={player.position} />
                    </div>
                    <div className="flex items-center gap-1">
                      <StarRating stars={player.stars} className="mr-2" />
                      {canManagePlayers && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Editar ${player.name}`}
                            onClick={() => openEditPlayer(player)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label={`Remover ${player.name}`}
                            onClick={() => setPlayerToDelete(player)}
                          >
                            <Trash2 />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PeladaFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        pelada={{ id: pelada.id, name: pelada.name }}
      />

      <PlayerFormDialog
        peladaId={pelada.id}
        open={playerFormOpen}
        onOpenChange={setPlayerFormOpen}
        player={playerToEdit}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir pelada"
        description={`Tem certeza que deseja excluir "${pelada.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deletePeladaMutation.isPending}
        onConfirm={() =>
          deletePeladaMutation.mutate(pelada.id, {
            onSuccess: () => {
              setDeleteOpen(false);
              router.push("/peladas");
            },
          })
        }
      />

      <ConfirmDialog
        open={!!playerToDelete}
        onOpenChange={(open) => {
          if (!open) setPlayerToDelete(undefined);
        }}
        title="Remover jogador"
        description={`Tem certeza que deseja remover "${playerToDelete?.name}" da pelada?`}
        confirmLabel="Remover"
        loading={deletePlayerMutation.isPending}
        onConfirm={() => {
          if (!playerToDelete) return;
          deletePlayerMutation.mutate(playerToDelete.id, {
            onSuccess: () => setPlayerToDelete(undefined),
          });
        }}
      />
    </div>
  );
}
