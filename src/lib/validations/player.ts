import { z } from "zod";

export const POSITIONS = ["ZAGA", "MEIO", "ATAQUE", "GERAL"] as const;

export const playerSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter ao menos 2 caracteres")
    .max(40, "O nome deve ter no máximo 40 caracteres"),
  stars: z.coerce
    .number<number>("Informe um número")
    .int("Use um número inteiro")
    .min(0, "Mínimo de 0 estrelas")
    .max(10, "Máximo de 10 estrelas"),
  position: z.enum(POSITIONS, "Selecione uma posição"),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;
