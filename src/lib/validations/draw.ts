import { z } from "zod";

export const drawSchema = z
  .object({
    playersIds: z.array(z.string()).min(2, "Selecione pelo menos 2 jogadores"),
    teamsQuantity: z.coerce
      .number<number>("Informe um número")
      .int("Use um número inteiro")
      .min(2, "Mínimo de 2 times"),
    withPosition: z.boolean(),
  })
  .refine((values) => values.playersIds.length >= values.teamsQuantity, {
    message: "Selecione pelo menos um jogador por time",
    path: ["playersIds"],
  });

export type DrawFormValues = z.infer<typeof drawSchema>;
