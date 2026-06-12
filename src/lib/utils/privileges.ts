import type { CurrentUser, PeladaSummary, Privilege } from "@/types/api";

export function isOwner(
  pelada: PeladaSummary,
  user: CurrentUser | undefined
) {
  return !!user && pelada.ownerUsername === user.username;
}

export function hasPrivilege(
  pelada: PeladaSummary,
  privilege: Privilege,
  user: CurrentUser | undefined
) {
  return isOwner(pelada, user) || pelada.privileges.includes(privilege);
}
