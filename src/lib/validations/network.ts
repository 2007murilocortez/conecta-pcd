import { z } from "zod";

export const requestConnectionSchema = z.object({
  addressee_id: z.string().uuid("Perfil inválido"),
});

export const respondConnectionSchema = z.object({
  connection_id: z.string().uuid("Pedido inválido"),
  status: z.enum(["aceita", "recusada"]),
});

export const createPostSchema = z.object({
  content: z.string().trim().min(1, "Escreva algo para publicar"),
  image_alt: z.string().trim().optional(),
});

export const requestMentorshipSchema = z.object({
  mentor_id: z.string().uuid("Perfil inválido"),
  message: z.string().trim().min(2, "Escreva uma mensagem inicial"),
});

export const respondMentorshipSchema = z.object({
  mentorship_id: z.string().uuid("Pedido inválido"),
  accept: z.boolean(),
});

export type RequestConnectionInput = z.infer<typeof requestConnectionSchema>;
export type RespondConnectionInput = z.infer<typeof respondConnectionSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type RequestMentorshipInput = z.infer<typeof requestMentorshipSchema>;
export type RespondMentorshipInput = z.infer<typeof respondMentorshipSchema>;
