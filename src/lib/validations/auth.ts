import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Informe seu e-mail ou nome de usuário"),
  password: z.string().min(1, "Informe sua senha"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.email("Informe um e-mail válido"),
    username: z
      .string()
      .min(3, "O nome de usuário deve ter no mínimo 3 caracteres")
      .max(30, "O nome de usuário deve ter no máximo 30 caracteres"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    passwordConfirmation: z.string().min(1, "Confirme sua senha"),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "As senhas não conferem",
    path: ["passwordConfirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
