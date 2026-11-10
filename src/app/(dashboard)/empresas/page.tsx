import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanyRatings } from "@/components/empresas/CompanyRatings";
import { VerifiedInclusiveBadge } from "@/components/empresas/VerifiedInclusiveBadge";
import { EmptyState, PageHeading, PageShell } from "@/components/shared";
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
    <PageShell width="wide">
      <PageHeading
        eyebrow="Mercado"
        title={onlyMine ? "Minhas empresas" : "Empresas"}
        description={
          onlyMine
            ? "Empresas em que você é dono ou recrutador."
            : "Veja o selo, as notas e os recursos de acessibilidade antes de se candidatar."
        }
        actions={
          <Button asChild>
            <Link href="/empresas/nova">Criar página de empresa</Link>
          </Button>
        }
      />

      <p className="mb-6">
        {onlyMine ? (
          <Link href="/empresas" className="text-primary underline underline-offset-4">
            Ver todas as empresas
          </Link>
        ) : (
          <Link href="/empresas?minhas=1" className="text-primary underline underline-offset-4">
            Ver só as minhas
          </Link>
        )}
      </p>

      {result.error ? (
        <p role="alert">{result.error}</p>
      ) : result.data.length === 0 ? (
        <EmptyState
          title="Nenhuma empresa encontrada"
          description={
            onlyMine
              ? "Crie a primeira página para publicar vagas em nome da organização."
              : "Quando as empresas tiverem páginas públicas, elas aparecem aqui."
          }
          action={
            <Button asChild>
              <Link href="/empresas/nova">Criar página de empresa</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {result.data.map((company) => (
            <li key={company.id} className="surface-card surface-card-hover p-6">
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-brand-light text-lg font-semibold text-primary-dark" aria-hidden>
                {company.name.slice(0, 1).toUpperCase()}
              </div>
              <h2 className="text-xl">
                <Link
                  href={`/empresas/${company.id}`}
                  className="text-primary-dark focus-visible:outline-offset-1"
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
                <ul className="mt-3 flex flex-wrap gap-2">
                  {company.accessibility_features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text"
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
    </PageShell>
  );
}
