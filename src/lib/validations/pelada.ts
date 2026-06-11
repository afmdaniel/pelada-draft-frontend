import { z } from "zod";

export const peladaSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(30, "O nome deve ter no máximo 30 caracteres"),
});

export type PeladaFormValues = z.infer<typeof peladaSchema>;
