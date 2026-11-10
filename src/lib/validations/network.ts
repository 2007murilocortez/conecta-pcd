import { z } from "zod";

export const requestConnectionSchema = z.object({
  addressee_id: z.string().uuid("Perfil inválido"),
});

export const respondConnectionSchema = z.object({
  connection_id: z.string().uuid("Pedido inválido"),
  status: z.enum(["aceita", "recusada"]),
});

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escreva algo para publicar")
    .max(2000, "O post pode ter no máximo 2.000 caracteres"),
  image_alt: z.string().trim().optional(),
});

export type RequestConnectionInput = z.infer<typeof requestConnectionSchema>;
export type RespondConnectionInput = z.infer<typeof respondConnectionSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
