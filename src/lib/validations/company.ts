import { z } from "zod";
import {
  ACCESSIBILITY_RESOURCES,
  COMPANY_SIZES,
} from "@/lib/constants/jobs";

const resourceValues = ACCESSIBILITY_RESOURCES.map((item) => item.value) as [
  string,
  ...string[],
];
const sizeValues = COMPANY_SIZES.map((item) => item.value) as [
  string,
  ...string[],
];

const optionalText = z.string().trim().optional();

export const createCompanySchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da empresa"),
  description: optionalText,
  website: optionalText,
  sector: optionalText,
  size: z
    .string()
    .optional()
    .refine((value) => !value || sizeValues.includes(value), "Selecione um tamanho válido"),
  accessibility_features: z.array(z.enum(resourceValues)),
  show_pcd_badge: z.boolean(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export const addCompanyMemberSchema = z.object({
  company_id: z.string().uuid("Empresa inválida"),
  email: z.string().trim().email("Informe um e-mail válido"),
});

export const removeCompanyMemberSchema = z.object({
  company_id: z.string().uuid("Empresa inválida"),
  member_id: z.string().uuid("Membro inválido"),
});

export const ownPcdBadgeSchema = z.object({
  company_id: z.string().uuid("Empresa inválida"),
  show_pcd_badge: z.boolean(),
});

export const companyReviewSchema = z.object({
  id: z.string().uuid().optional(),
  company_id: z.string().uuid("Empresa inválida"),
  rating: z.number().int().min(1, "Dê uma nota de 1 a 5").max(5),
  accessibility_rating: z.number().int().min(1, "Dê uma nota de 1 a 5").max(5),
  comment: optionalText,
  is_anonymous: z.boolean(),
});

export const companySealSchema = z.object({
  company_id: z.string().uuid("Empresa inválida"),
  is_verified_inclusive: z.boolean(),
});

export type AddCompanyMemberInput = z.infer<typeof addCompanyMemberSchema>;
export type RemoveCompanyMemberInput = z.infer<typeof removeCompanyMemberSchema>;
export type OwnPcdBadgeInput = z.infer<typeof ownPcdBadgeSchema>;
export type CompanyReviewInput = z.infer<typeof companyReviewSchema>;
export type CompanySealInput = z.infer<typeof companySealSchema>;
