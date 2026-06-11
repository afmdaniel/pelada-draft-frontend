"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldAlert, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api/axios";
import { usePelada } from "@/lib/hooks/use-peladas";
import {
  useManagePermission,
  usePermissions,
} from "@/lib/hooks/use-permissions";
import { PRIVILEGE_LABELS } from "@/lib/utils/positions";
import {
  permissionSchema,
  PRIVILEGES,
  type PermissionFormValues,
} from "@/lib/validations/permission";
import type { Privilege } from "@/types/api";

export default function PermissionsPage() {
  const { peladaId } = useParams<{ peladaId: string }>();
  const { data: pelada } = usePelada(peladaId);
  const {
    data: permissions,
    isLoading,
    isError,
    error,
  } = usePermissions(peladaId);
  const manageMutation = useManagePermission(peladaId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { userIdentifier: "", privilege: "MANAGE_PLAYERS" },
  });

  function onAssign(values: PermissionFormValues) {
    manageMutation.mutate(
      { ...values, action: "ASSIGN" },
      { onSuccess: () => reset() }
    );
  }

  function onRevoke(username: string, privilege: Privilege) {
    manageMutation.mutate({
      userIdentifier: username,
      privilege,
      action: "REVOKE",
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="items-center py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="size-6 text-destructive" />
        </span>
        <CardHeader>
          <CardTitle>Acesso restrito</CardTitle>
          <CardDescription>{getApiErrorMessage(error)}</CardDescription>
        </CardHeader>
        <Button render={<Link href={`/peladas/${peladaId}`} />}>
          Voltar para a pelada
        </Button>
      </Card>
    );
  }

  const users = permissions ?? [];

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
          {pelada?.name ?? "Pelada"}
        </Button>
        <h1 className="font-heading text-2xl font-semibold">Permissões</h1>
        <p className="text-sm text-muted-foreground">
          Conceda ou revogue privilégios de outros usuários nesta pelada.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conceder permissão</CardTitle>
          <CardDescription>
            Informe o e-mail ou nome de usuário e escolha o privilégio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onAssign)}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
            noValidate
          >
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="user-identifier">Usuário</Label>
              <Input
                id="user-identifier"
                placeholder="email@exemplo.com ou username"
                aria-invalid={!!errors.userIdentifier}
                {...register("userIdentifier")}
              />
              {errors.userIdentifier && (
                <p className="text-xs text-destructive">
                  {errors.userIdentifier.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label id="privilege-label">Privilégio</Label>
              <Controller
                control={control}
                name="privilege"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    items={PRIVILEGES.map((privilege) => ({
                      value: privilege,
                      label: PRIVILEGE_LABELS[privilege],
                    }))}
                  >
                    <SelectTrigger
                      className="w-full sm:w-52"
                      aria-labelledby="privilege-label"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIVILEGES.map((privilege) => (
                        <SelectItem key={privilege} value={privilege}>
                          {PRIVILEGE_LABELS[privilege]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Button type="submit" disabled={manageMutation.isPending}>
              <UserPlus />
              Conceder
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários com permissões</CardTitle>
          <CardDescription>
            Clique no “x” de um privilégio para revogá-lo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum usuário com permissões nesta pelada ainda.
            </p>
          ) : (
            <div className="flex flex-col">
              {users.map((user, index) => (
                <div key={user.username}>
                  {index > 0 && <Separator />}
                  <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.username}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {user.privileges.length === 0 ? (
                        <Badge variant="outline">Sem privilégios</Badge>
                      ) : (
                        user.privileges.map((privilege) => (
                          <Badge
                            key={privilege}
                            variant="secondary"
                            className="gap-1 pr-1"
                          >
                            {PRIVILEGE_LABELS[privilege]}
                            <button
                              type="button"
                              className="rounded-full p-0.5 hover:bg-foreground/10 disabled:opacity-50"
                              aria-label={`Revogar ${PRIVILEGE_LABELS[privilege]} de ${user.username}`}
                              disabled={manageMutation.isPending}
                              onClick={() => onRevoke(user.username, privilege)}
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
