import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyRatings } from "@/components/empresas/CompanyRatings";
import { OwnPcdBadgeToggle } from "@/components/empresas/OwnPcdBadgeToggle";
import { ReviewForm } from "@/components/empresas/ReviewForm";
import { VerifiedInclusiveBadge } from "@/components/empresas/VerifiedInclusiveBadge";
import { EmptyState, PageShell } from "@/components/shared";
import { JobCard } from "@/components/vagas/JobCard";
import { getCompanyPublicPage } from "@/lib/actions/company";
import { ACCESSIBILITY_RESOURCES, labelFor } from "@/lib/constants/jobs";

export const dynamic = "force-dynamic";

const ROLE_LABEL = {
  dono: "Dono",
  recrutador: "Recrutador",
} as const;

export default async function EmpresaDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aviso?: string }>;
}) {
  const { id } = await params;
  const { aviso } = await searchParams;
  const result = await getCompanyPublicPage(id);

  if (result.error || !result.data) {
    notFound();
  }

  const {
    company,
    team,
    reviews,
    ratings,
    jobs,
    isOwner,
    isMember,
    ownReview,
    ownPcdBadge,
  } = result.data;

  return (
    <PageShell width="default" className="space-y-6">
      {aviso === "equipe" ? (
        <p role="status" className="rounded-[1.15rem] border border-border bg-brand-light p-4">
          Só quem é dono desta empresa acessa a gestão da equipe.
        </p>
      ) : null}

      <header className="overflow-hidden rounded-[1.25rem] border border-border bg-white shadow-[var(--shadow-card)]">
        <div className="h-24 bg-linear-to-r from-primary-dark via-primary to-brand-sky" />
        <div className="space-y-3 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1>{company.name}</h1>
              {company.sector ? <p className="mb-0 text-neutral-600">{company.sector}</p> : null}
            </div>
            {company.is_verified_inclusive ? <VerifiedInclusiveBadge /> : null}
          </div>
          <CompanyRatings
            ratingAvg={ratings.rating_avg}
            accessibilityRatingAvg={ratings.accessibility_rating_avg}
            reviewCount={ratings.review_count}
          />
          {isOwner ? (
            <Button variant="outline" asChild>
              <Link href={`/empresas/${company.id}/equipe`}>Gerenciar equipe</Link>
            </Button>
          ) : null}
        </div>
      </header>

      <section className="surface-card p-6">
        <h2>Sobre</h2>
        {company.description ? (
          <p className="whitespace-pre-wrap">{company.description}</p>
        ) : (
          <p className="text-neutral-600">A empresa ainda não escreveu uma descrição.</p>
        )}
        {company.website ? (
          <p className="mt-2 mb-0">
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
      </section>

      <section className="surface-card p-6">
        <h2>Recursos de acessibilidade</h2>
        {company.accessibility_features && company.accessibility_features.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {company.accessibility_features.map((feature) => (
              <li
                key={feature}
                className="rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text"
              >
                {labelFor(ACCESSIBILITY_RESOURCES, feature)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-0 text-neutral-600">Nenhum recurso informado ainda.</p>
        )}
      </section>

      <section className="surface-card p-6">
        <h2>Equipe</h2>
        {team.length === 0 ? (
          <p>Nenhuma pessoa listada.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {team.map((member) => (
              <li key={member.id} className="rounded-2xl border border-border bg-white p-3">
                <p className="mb-0 font-medium">
                  {member.full_name}
                  {member.show_pcd_badge ? (
                    <Star
                      className="ml-2 inline size-4 text-success-text"
                      aria-label="Pessoa com deficiência na equipe de recrutamento"
                    />
                  ) : null}
                </p>
                <p className="mb-0 text-sm text-neutral-600">{ROLE_LABEL[member.member_role]}</p>
              </li>
            ))}
          </ul>
        )}
        {isMember ? (
          <div className="mt-4">
            <OwnPcdBadgeToggle companyId={company.id} checked={ownPcdBadge} />
          </div>
        ) : null}
      </section>

      <section>
        <h2>Vagas abertas</h2>
        {jobs.length === 0 ? (
          <EmptyState
            title="Nenhuma vaga aberta no momento"
            description="Quando esta empresa publicar oportunidades, elas aparecem nesta página."
          />
        ) : (
          <ul className="mt-4 space-y-4">
            {jobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card p-6">
        <h2>Avaliações</h2>
        {reviews.length === 0 ? (
          <p className="mb-0 text-neutral-600">Ainda não há avaliações públicas.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-2xl border border-border bg-white p-4">
                <p className="mb-0 font-medium">{review.author_label}</p>
                <p className="mb-0 text-sm text-neutral-600">
                  Geral {review.rating}/5 · Acessibilidade {review.accessibility_rating}/5
                </p>
                {review.comment ? (
                  <p className="mt-2 mb-0 whitespace-pre-wrap">{review.comment}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card p-6">
        <h2>{ownReview ? "Sua avaliação" : "Avaliar esta empresa"}</h2>
        <ReviewForm companyId={company.id} existing={ownReview} />
      </section>
    </PageShell>
  );
}
