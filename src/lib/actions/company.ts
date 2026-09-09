"use server";

import { revalidatePath } from "next/cache";
import { getAuthedUser } from "@/lib/supabase/user";

function emptyToUndef(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
import { createCompanySchema } from "@/lib/validations/company";
import type { Tables } from "@/types/database.types";

type ActionResult<T = undefined> = {
  error?: string;
  data?: T;
};

export type CompanyMembership = {
  company_id: string;
  member_role: Tables<"company_members">["member_role"];
  company: Pick<Tables<"companies">, "id" | "name" | "is_verified_inclusive">;
};

function unwrapCompany(
  value: Tables<"companies"> | Tables<"companies">[] | null,
) {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getMyCompanies(): Promise<CompanyMembership[]> {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) return [];

  const { data, error } = await supabase
    .from("company_members")
    .select("company_id, member_role, companies(id, name, is_verified_inclusive)")
    .eq("profile_id", userId);

  if (error || !data) return [];

  return data.flatMap((row) => {
    const company = unwrapCompany(row.companies as Tables<"companies"> | Tables<"companies">[] | null);
    if (!company) return [];
    return [
      {
        company_id: row.company_id,
        member_role: row.member_role,
        company: {
          id: company.id,
          name: company.name,
          is_verified_inclusive: company.is_verified_inclusive,
        },
      },
    ];
  });
}

export async function listCompanies(onlyMine = false) {
  const { supabase, userId } = await getAuthedUser();

  if (onlyMine) {
    if (!userId) {
      return { error: "Você precisa entrar para ver suas empresas.", data: [] as Tables<"companies">[] };
    }

    const memberships = await getMyCompanies();
    const ids = memberships.map((item) => item.company_id);
    if (ids.length === 0) {
      return { data: [] as Tables<"companies">[] };
    }

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .in("id", ids)
      .order("name");

    if (error) {
      return { error: "Não foi possível carregar suas empresas.", data: [] as Tables<"companies">[] };
    }

    return { data: data ?? [] };
  }

  const { data, error } = await supabase.from("companies").select("*").order("name");

  if (error) {
    return { error: "Não foi possível carregar as empresas.", data: [] as Tables<"companies">[] };
  }

  return { data: data ?? [] };
}

export async function createCompany(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createCompanySchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para criar uma empresa." };
  }

  const { data: companyId, error } = await supabase.rpc("create_company", {
    p_name: parsed.data.name,
    p_description: emptyToUndef(parsed.data.description),
    p_website: emptyToUndef(parsed.data.website),
    p_sector: emptyToUndef(parsed.data.sector),
    p_size: emptyToUndef(parsed.data.size),
    p_show_pcd_badge: parsed.data.show_pcd_badge,
  });

  if (error || !companyId) {
    return { error: "Não foi possível criar a empresa." };
  }

  if (parsed.data.accessibility_features.length > 0) {
    const { error: updateError } = await supabase
      .from("companies")
      .update({ accessibility_features: parsed.data.accessibility_features })
      .eq("id", companyId);

    if (updateError) {
      return {
        error:
          "A empresa foi criada, mas os recursos de acessibilidade não puderam ser salvos. Edite-os depois.",
        data: { id: companyId },
      };
    }
  }

  revalidatePath("/empresas");
  revalidatePath("/vagas/nova");
  return { data: { id: companyId } };
}
