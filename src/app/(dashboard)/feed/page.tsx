import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState, PageHeading, PageShell } from "@/components/shared";
import { PostForm } from "@/components/feed/PostForm";
import { JobCard } from "@/components/vagas/JobCard";
import { listFeedPosts } from "@/lib/actions/posts";
import { formatRelativeTime } from "@/lib/jobs/format";
import { getRecommendations } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const [result, recs] = await Promise.all([listFeedPosts(), getRecommendations()]);

  return (
    <PageShell width="wide">
      <PageHeading
        eyebrow="Sua rede"
        title="Feed"
        description="Publique para a sua rede, acompanhe conexões e veja vagas e cursos sugeridos ao lado."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-6">
          <PostForm />

          {result.error ? <p role="alert">{result.error}</p> : null}

          {!result.hasConnections ? (
            <p role="status" className="rounded-[1.15rem] border border-border bg-brand-light/70 p-4">
              Sem conexões aceitas ainda, você vê só o que você publica. Em{" "}
              <Link href="/conexoes" className="text-primary underline underline-offset-4">
                Conexões
              </Link>{" "}
              dá para aceitar pedidos e ampliar o feed.
            </p>
          ) : null}

          {result.data.length === 0 ? (
            <EmptyState
              title="Ainda não há posts"
              description="Escreva o primeiro acima — ou use um dos modelos para começar."
            />
          ) : (
            <ul className="space-y-4">
              {result.data.map((post) => (
                <li key={post.id}>
                  <article className="surface-card p-5 sm:p-6">
                    <header className="mb-3 flex items-center gap-3">
                      <Avatar>
                        {post.author.avatar_url ? (
                          <AvatarImage src={post.author.avatar_url} alt="" />
                        ) : null}
                        <AvatarFallback>
                          {post.author.full_name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="mb-0 font-medium">
                          <Link
                            href={`/perfil/${post.author.id}`}
                            className="text-primary-dark focus-visible:outline-offset-1"
                          >
                            {post.author.full_name}
                          </Link>
                        </p>
                        <p className="mb-0 text-sm text-neutral-600">
                          {post.author.headline ? `${post.author.headline} · ` : null}
                          <time dateTime={post.created_at}>
                            {formatRelativeTime(post.created_at)}
                          </time>
                        </p>
                      </div>
                    </header>
                    <p className="mb-0 whitespace-pre-wrap">{post.content}</p>
                    {post.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image_url}
                        alt={post.image_alt || `Imagem publicada por ${post.author.full_name}`}
                        className="mt-3 max-h-96 w-full rounded-2xl object-cover"
                      />
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <section className="surface-card p-5" aria-labelledby="vagas-para-voce">
            <h2 id="vagas-para-voce" className="text-lg">Vagas para você</h2>
            {recs.jobs.length === 0 ? (
              <p className="mt-2 mb-0 text-sm text-neutral-600">
                Sem sugestão ainda. Adicione habilidades no{" "}
                <Link href="/perfil/editar" className="text-primary underline underline-offset-4">
                  perfil
                </Link>{" "}
                — a vaga precisa cruzar com elas e ser remota ou do seu estado.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {recs.jobs.map((job) => (
                  <li key={job.id}>
                    <JobCard job={job} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="surface-card p-5" aria-labelledby="cursos-recomendados">
            <h2 id="cursos-recomendados" className="text-lg">Cursos recomendados</h2>
            {recs.courses.length === 0 ? (
              <p className="mt-2 mb-0 text-sm text-neutral-600">
                Abra ou candidate-se a vagas para vermos habilidades que ainda não
                estão no seu perfil. Depois sugerimos cursos nessas categorias. Veja o{" "}
                <Link href="/cursos" className="text-primary underline underline-offset-4">
                  catálogo completo
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {recs.courses.map((course) => (
                  <li key={course.id} className="rounded-2xl border border-border bg-white p-4">
                    <p className="mb-1 font-medium text-primary-dark">{course.title}</p>
                    <p className="mb-2 text-sm text-neutral-600">
                      {course.provider}
                      {course.category ? ` · ${course.category}` : ""}
                    </p>
                    <Link href="/cursos" className="text-primary underline underline-offset-4">
                      Ver nos cursos
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
