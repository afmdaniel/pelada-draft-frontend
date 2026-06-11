"use client";

import { LogOut, Volleyball } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/lib/hooks/use-auth";
import { useCurrentIdentifier } from "@/lib/hooks/use-current-user";

export function Header() {
  const identifier = useCurrentIdentifier();
  const logoutMutation = useLogout();

  const initial = identifier?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/peladas" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Volleyball className="size-4" />
          </span>
          <span className="font-heading text-base font-semibold">
            Pelada Draft
          </span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Menu do usuário" />
            }
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {initial}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="max-w-48 truncate">
              {identifier ?? "Minha conta"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
