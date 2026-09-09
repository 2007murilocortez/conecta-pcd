import { z } from "zod";
import {
  ACCESSIBILITY_NEEDS,
  BRAZILIAN_STATES,
  DISABILITY_TYPES,
} from "@/lib/constants/profile";

const accessibilityNeedValues = ACCESSIBILITY_NEEDS.map((item) => item.value) as [
  string,
  ...string[],
];
const disabilityTypeValues = DISABILITY_TYPES.map((item) => item.value) as [
  string,
  ...string[],
];
const stateValues = BRAZILIAN_STATES as unknown as [string, ...string[]];

const optionalText = z.string().trim().optional();

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome completo"),
  headline: z
    .string()
    .trim()
    .min(2, "Informe um título profissional, por exemplo: Pessoa desenvolvedora front-end"),
  bio: optionalText,
  phone: optionalText,
  location_city: optionalText,
  location_state: z
    .string()
    .optional()
    .refine(
      (value) => !value || stateValues.includes(value),
      "Selecione um estado válido",
    ),
  discloses_disability: z.boolean(),
  disability_types: z.array(z.enum(disabilityTypeValues)),
  accessibility_needs: z.array(z.enum(accessibilityNeedValues)),
  accessibility_needs_other: optionalText,
  disability_types_other: optionalText,
})
  .refine(
    (data) =>
      !data.accessibility_needs.includes("outro") ||
      Boolean(data.accessibility_needs_other?.trim()),
    {
      message: "Descreva o recurso de acessibilidade",
      path: ["accessibility_needs_other"],
    },
  )
  .refine(
    (data) =>
      !data.discloses_disability ||
      !data.disability_types.includes("outra") ||
      Boolean(data.disability_types_other?.trim()),
    {
      message: "Descreva o tipo de deficiência",
      path: ["disability_types_other"],
    },
  );

export const educationSchema = z
  .object({
    institution: z.string().trim().min(2, "Informe a instituição"),
    course: z.string().trim().min(2, "Informe o curso"),
    level: optionalText,
    start_date: optionalText,
    end_date: optionalText,
    is_current: z.boolean(),
  })
  .refine(
    (data) => data.is_current || !data.start_date || !data.end_date || data.end_date >= data.start_date,
    {
      message: "A data de término precisa ser igual ou posterior ao início",
      path: ["end_date"],
    },
  );

export const experienceSchema = z
  .object({
    company_name: z.string().trim().min(2, "Informe a empresa"),
    role_title: z.string().trim().min(2, "Informe o cargo"),
    description: optionalText,
    start_date: optionalText,
    end_date: optionalText,
    is_current: z.boolean(),
  })
  .refine(
    (data) => data.is_current || !data.start_date || !data.end_date || data.end_date >= data.start_date,
    {
      message: "A data de término precisa ser igual ou posterior ao início",
      path: ["end_date"],
    },
  );

export const skillNameSchema = z.object({
  name: z.string().trim().min(2, "Informe a habilidade"),
});

export const idSchema = z.object({
  id: z.string().uuid("Identificador inválido"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type SkillNameInput = z.infer<typeof skillNameSchema>;

/**
 * Onboarding completo quando o perfil tem nome (pode vir do signup via
 * trigger) e um headline salvo em /perfil/editar. O headline não é
 * preenchido pelo handle_new_user — só existe depois que a pessoa
 * grava a seção de dados básicos.
 */
export function isOnboardingComplete(profile: {
  full_name: string;
  headline: string | null;
}) {
  return profile.full_name.trim().length > 0 && Boolean(profile.headline?.trim());
}
