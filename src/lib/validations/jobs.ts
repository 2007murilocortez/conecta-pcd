import { z } from "zod";
import { BRAZILIAN_STATES } from "@/lib/constants/profile";
import {
  ACCESSIBILITY_RESOURCES,
  APPLICATION_STATUSES,
  JOB_TYPES,
  WORK_MODES,
} from "@/lib/constants/jobs";

const jobTypeValues = JOB_TYPES.map((item) => item.value) as [string, ...string[]];
const workModeValues = WORK_MODES.map((item) => item.value) as [string, ...string[]];
const resourceValues = ACCESSIBILITY_RESOURCES.map((item) => item.value) as [
  string,
  ...string[],
];
const applicationStatusValues = APPLICATION_STATUSES.map((item) => item.value) as [
  string,
  ...string[],
];
const stateValues = BRAZILIAN_STATES as unknown as [string, ...string[]];

const optionalText = z.string().trim().optional();

const optionalSalary = z.number().nonnegative("Informe um valor válido").optional();

export const jobSchema = z
  .object({
    company_id: z.string().uuid("Selecione a empresa"),
    title: z.string().trim().min(2, "Informe o título da vaga"),
    description: z.string().trim().min(10, "Descreva a vaga com pelo menos 10 caracteres"),
    requirements: optionalText,
    type: z.enum(jobTypeValues, { message: "Selecione o tipo da vaga" }),
    work_mode: z.enum(workModeValues, { message: "Selecione a modalidade" }),
    location_city: optionalText,
    location_state: z
      .string()
      .optional()
      .refine((value) => !value || stateValues.includes(value), "Selecione um estado válido"),
    salary_min: optionalSalary,
    salary_max: optionalSalary,
    salary_visible: z.boolean(),
    accessibility_resources: z.array(z.enum(resourceValues)),
  })
  .refine(
    (data) =>
      data.salary_min === undefined ||
      data.salary_max === undefined ||
      data.salary_max >= data.salary_min,
    {
      message: "O salário máximo precisa ser igual ou maior que o mínimo",
      path: ["salary_max"],
    },
  );

export const applyToJobSchema = z.object({
  job_id: z.string().uuid("Vaga inválida"),
  cover_letter: optionalText,
});

export const updateApplicationStatusSchema = z.object({
  application_id: z.string().uuid("Candidatura inválida"),
  status: z.enum(applicationStatusValues, { message: "Selecione um status válido" }),
});

export const jobIdSchema = z.object({
  id: z.string().uuid("Identificador inválido"),
});

export type JobInput = z.infer<typeof jobSchema>;
export type ApplyToJobInput = z.infer<typeof applyToJobSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
