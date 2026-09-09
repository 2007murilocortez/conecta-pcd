import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanyRatings } from "@/components/empresas/CompanyRatings";
import { VerifiedInclusiveBadge } from "@/components/empresas/VerifiedInclusiveBadge";
import { listCompanies } from "@/lib/actions/company";
import { ACCESSIBILITY_RESOURCES, labelFor } from "@/lib/constants/jobs";

export const dynamic = "force-dynamic";

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ minhas?: string }>;
}) {
  const { minhas } = await searchParams;
  const onlyMine = minhas === "1";
  const result = await listCompanies(onlyMine);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-primary">{onlyMine ? "Minhas empresas" : "Empresas"}</h1>
          <p>
            {onlyMine
              ? "Empresas em que você é dono ou recrutador."
              : "Veja o selo, as notas e os recursos de acessibilidade antes de se candidatar."}
          </p>
        </div>
        <Button asChild>
          <Link href="/empresas/nova">Criar página de empresa</Link>
        </Button>
      </div>

      {onlyMine ? (
        <p className="mb-6">
          <Link href="/empresas" className="text-primary underline underline-offset-4">
            Ver todas as empresas
          </Link>
        </p>
      ) : (
        <p className="mb-6">
          <Link href="/empresas?minhas=1" className="text-primary underline underline-offset-4">
            Ver só as minhas
          </Link>
        </p>
      )}

      {result.error ? (
        <p role="alert">{result.error}</p>
      ) : result.data.length === 0 ? (
        <p>Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {result.data.map((company) => (
            <li key={company.id} className="rounded-xl border border-border p-4">
              <h2 className="text-lg font-semibold">
                <Link
                  href={`/empresas/${company.id}`}
                  className="text-primary focus-visible:outline-offset-1"
                >
                  {company.name}
                </Link>
              </h2>
              {company.is_verified_inclusive ? (
                <div className="mt-2">
                  <VerifiedInclusiveBadge />
                </div>
              ) : null}
              <CompanyRatings
                ratingAvg={company.rating_avg}
                accessibilityRatingAvg={company.accessibility_rating_avg}
                reviewCount={company.review_count}
              />
              {company.sector ? <p className="text-neutral-600">{company.sector}</p> : null}
              {company.accessibility_features && company.accessibility_features.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-2">
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
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <Link href={`/vagas?empresa=${company.id}`}>Ver vagas</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
