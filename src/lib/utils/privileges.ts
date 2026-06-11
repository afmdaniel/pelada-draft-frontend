import type { PeladaSummary, Privilege } from "@/types/api";

// A API não expõe um endpoint /auth/me; o identificador usado no login fica
// salvo localmente e a comparação com ownerUsername só funciona quando o
// usuário entra com o username (não com o e-mail). O backend continua sendo
// a fonte de verdade — ações sem permissão retornam erro e são exibidas em toast.
export function isOwner(pelada: PeladaSummary, identifier: string | null) {
  return identifier !== null && pelada.ownerUsername === identifier;
}

export function hasPrivilege(
  pelada: PeladaSummary,
  privilege: Privilege,
  identifier: string | null
) {
  return isOwner(pelada, identifier) || pelada.privileges.includes(privilege);
}
