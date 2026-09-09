import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ACCESSIBILITY_RESOURCES, labelFor } from "@/lib/constants/jobs";

export const dynamic = "force-dynamic";

export default async function EmpresaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!company) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-primary">{company.name}</h1>
      {company.is_verified_inclusive ? (
        <p className="font-medium text-secondary">Empresa inclusiva verificada</p>
      ) : null}
      {company.sector ? <p className="text-neutral-600">{company.sector}</p> : null}
      {company.description ? <p className="mt-4">{company.description}</p> : null}
      {company.website ? (
        <p className="mt-2">
          <a
            href={
              /^https?:\/\//i.test(company.website)
                ? company.website
                : `https://${company.website}`
            }
            className="text-primary underline underline-offset-4"
          >
            Site da empresa
          </a>
        </p>
      ) : null}
      {company.accessibility_features && company.accessibility_features.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {company.accessibility_features.map((feature) => (
            <li
              key={feature}
              className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary"
            >
              {labelFor(ACCESSIBILITY_RESOURCES, feature)}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-6 text-neutral-600">
        Avaliações, equipe e o selo completo ficam para o próximo sprint. Aqui
        só o essencial para chegar nas vagas.
      </p>
      <div className="mt-4">
        <Button asChild>
          <Link href={`/vagas?empresa=${company.id}`}>Ver vagas</Link>
        </Button>
      </div>
    </div>
  );
}
