import { z } from "zod";

export const PRIVILEGES = ["MANAGE_PLAYERS", "DRAW_TEAMS"] as const;

export const permissionSchema = z.object({
  userIdentifier: z.string().min(1, "Informe o e-mail ou nome de usuário"),
  privilege: z.enum(PRIVILEGES, "Selecione um privilégio"),
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;
