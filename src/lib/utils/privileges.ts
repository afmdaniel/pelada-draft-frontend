import type { CurrentUser, PeladaSummary, Privilege } from "@/types/api";

export function isOwner(pelada: PeladaSummary, user: CurrentUser | undefined) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return pelada.ownerUsername === user.username;
}

export function hasPrivilege(
  pelada: PeladaSummary,
  privilege: Privilege,
  user: CurrentUser | undefined
) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return isOwner(pelada, user) || pelada.privileges.includes(privilege);
}
