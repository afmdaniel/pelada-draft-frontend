export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export type Position = "ZAGA" | "MEIO" | "ATAQUE" | "GERAL";

export type Privilege = "MANAGE_PLAYERS" | "DRAW_TEAMS";

export type PermissionAction = "ASSIGN" | "REVOKE";

export interface Player {
  id: string;
  name: string;
  stars: number;
  position: Position;
}

export interface PeladaSummary {
  id: string;
  name: string;
  ownerUsername: string;
  privileges: Privilege[];
}

export interface PeladaDetails extends PeladaSummary {
  players: Player[];
}

export interface DrawTeamPlayer {
  name: string;
  stars: number;
  position: Position;
}

export interface DrawTeam {
  totalStars: number;
  players: DrawTeamPlayer[];
}

export interface DrawResult {
  teams: DrawTeam[];
}

export interface PermissionUser {
  username: string;
  email: string;
  privileges: Privilege[];
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface PeladaPayload {
  name: string;
}

export interface PlayerPayload {
  name: string;
  stars: number;
  position: Position;
}

export interface DrawPayload {
  playersIds: string[];
  teamsQuantity: number;
  withPosition: boolean;
}

export interface PermissionPayload {
  userIdentifier: string;
  privilege: Privilege;
  action: PermissionAction;
}
