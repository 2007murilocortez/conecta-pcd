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
