"use client";

import { ChevronRight, Crown, Plus, Volleyball } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PeladaFormDialog } from "@/components/peladas/pelada-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api/axios";
import { useCurrentIdentifier } from "@/lib/hooks/use-current-user";
import { usePeladas } from "@/lib/hooks/use-peladas";
import { isOwner } from "@/lib/utils/privileges";
import { PRIVILEGE_LABELS } from "@/lib/utils/positions";

export default function PeladasPage() {
  const identifier = useCurrentIdentifier();
  const { data: peladas, isLoading, isError, error, refetch } = usePeladas();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Minhas peladas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus grupos e sorteie times equilibrados.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          Nova pelada
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <Card className="items-center py-10 text-center">
          <CardHeader>
            <CardTitle>Não foi possível carregar suas peladas</CardTitle>
            <CardDescription>{getApiErrorMessage(error)}</CardDescription>
          </CardHeader>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </Card>
      )}

      {peladas && peladas.length === 0 && (
        <Card className="items-center py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Volleyball className="size-6 text-muted-foreground" />
          </span>
          <CardHeader>
            <CardTitle>Nenhuma pelada por aqui</CardTitle>
            <CardDescription>
              Crie sua primeira pelada para começar a montar os times.
            </CardDescription>
          </CardHeader>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus />
            Criar pelada
          </Button>
        </Card>
      )}

      {peladas && peladas.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {peladas.map((pelada) => {
            const owner = isOwner(pelada, identifier);
            return (
              <Link key={pelada.id} href={`/peladas/${pelada.id}`}>
                <Card className="h-full transition-colors hover:border-primary/40 hover:bg-muted/40">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                      <span className="truncate">{pelada.name}</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      {owner && <Crown className="size-3.5 text-amber-500" />}
                      {owner ? "Você é o dono" : `Dono: ${pelada.ownerUsername}`}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {owner ? (
                        <Badge variant="secondary">Acesso total</Badge>
                      ) : pelada.privileges.length > 0 ? (
                        pelada.privileges.map((privilege) => (
                          <Badge key={privilege} variant="secondary">
                            {PRIVILEGE_LABELS[privilege]}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Somente visualização</Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <PeladaFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
