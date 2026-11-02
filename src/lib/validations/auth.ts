import { z } from "zod";
import { isBlockedTestEmail } from "@/lib/auth-errors";

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .max(120, "O nome pode ter no máximo 120 caracteres"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido, por exemplo nome@gmail.com")
    .refine(
      (email) => !isBlockedTestEmail(email),
      "Use um e-mail real seu. Endereços como teste@gmail.com são bloqueados.",
    ),
  password: z
    .string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres")
    .max(72, "A senha pode ter no máximo 72 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe a senha"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
