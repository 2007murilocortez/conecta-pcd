import { z } from "zod";

export const courseIdSchema = z.object({
  course_id: z.string().uuid("Curso inválido"),
});

export type CourseIdInput = z.infer<typeof courseIdSchema>;
