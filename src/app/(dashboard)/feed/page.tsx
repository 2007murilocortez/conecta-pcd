import Link from "next/link";
import { EmptyState, PageHeading, PageShell } from "@/components/shared";
import { FeedJobSuggestion } from "@/components/feed/FeedJobSuggestion";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { PostForm } from "@/components/feed/PostForm";
import { listFeedPosts } from "@/lib/actions/posts";
import { getRecommendations } from "@/lib/recommendations";
import { getAuthedUser } from "@/lib/supabase/user";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const { supabase, userId } = await getAuthedUser();
  const [result, recs, me] = await Promise.all([
    listFeedPosts(),
    getRecommendations(),
    userId
      ? supabase
          .from("profiles_public")
          .select("full_name, avatar_url")
          .eq("id", userId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const authorName = me.data?.full_name?.trim() || "Você";
  const authorAvatarUrl = me.data?.avatar_url ?? null;

  return (
    <PageShell width="wide">
      <PageHeading
        eyebrow="Rede profissional"
        title="Feed"
        description="Acompanhe o que as pessoas da sua rede estão compartilhando e as oportunidades alinhadas ao seu perfil."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-5">
          <PostForm authorName={authorName} authorAvatarUrl={authorAvatarUrl} />

          {result.error ? <p role="alert">{result.error}</p> : null}

          {!result.hasConnections ? (
            <p role="status" className="rounded-[1.15rem] border border-border bg-brand-light/70 p-4">
              Sem conexões aceitas, você vê só as suas publicações. Em{" "}
              <Link href="/conexoes" className="text-primary underline underline-offset-4">
                Conexões
              </Link>{" "}
              dá para ampliar a rede.
            </p>
          ) : null}

          {result.data.length === 0 ? (
            <EmptyState
              title="Sua rede ainda não publicou nada"
              description="Escreva a primeira atualização acima. Conquistas, rotina de trabalho e vagas costumam começar boas conversas."
            />
          ) : (
            <ul className="space-y-4">
              {result.data.map((post) => (
                <li key={post.id}>
                  <FeedPostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="surface-card p-5" aria-labelledby="vagas-para-voce">
            <h2 id="vagas-para-voce" className="text-lg">Vagas para você</h2>
            {recs.jobs.length === 0 ? (
              <p className="mt-2 mb-0 text-sm text-neutral-600">
                Sem sugestão ainda. Com habilidades no{" "}
                <Link href="/perfil/editar" className="text-primary underline underline-offset-4">
                  perfil
                </Link>
                , mostramos vagas remotas ou do seu estado.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {recs.jobs.slice(0, 3).map((job) => (
                  <li key={job.id}>
                    <FeedJobSuggestion job={job} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="surface-card p-5" aria-labelledby="cursos-recomendados">
            <h2 id="cursos-recomendados" className="text-lg">Cursos recomendados</h2>
            {recs.courses.length === 0 ? (
              <p className="mt-2 mb-0 text-sm text-neutral-600">
                Candidate-se a vagas para vermos categorias ainda não cobertas no perfil. Veja o{" "}
                <Link href="/cursos" className="text-primary underline underline-offset-4">
                  catálogo
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {recs.courses.slice(0, 3).map((course) => (
                  <li key={course.id} className="rounded-2xl border border-border bg-white p-4">
                    <p className="mb-1 font-medium text-primary-dark">{course.title}</p>
                    <p className="mb-2 text-sm text-neutral-600">
                      {course.provider}
                      {course.category ? ` · ${course.category}` : ""}
                    </p>
                    <Link href="/cursos" className="text-sm text-primary underline underline-offset-4">
                      Ver no catálogo
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </PageShell>
  );
}
