import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostForm } from "@/components/feed/PostForm";
import { JobCard } from "@/components/vagas/JobCard";
import { listFeedPosts } from "@/lib/actions/posts";
import { getRecommendations } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const [result, recs] = await Promise.all([listFeedPosts(), getRecommendations()]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12">
      <h1 className="text-primary">Feed</h1>

      <section aria-labelledby="vagas-para-voce">
        <h2 id="vagas-para-voce">Vagas para você</h2>
        {recs.jobs.length === 0 ? (
          <p className="mt-2 text-neutral-600">
            Sem sugestão ainda. Adicione habilidades no{" "}
            <Link href="/perfil/editar" className="text-primary underline underline-offset-4">
              perfil
            </Link>{" "}
            — a vaga precisa cruzar com elas e ser remota ou do seu estado.
          </p>
        ) : (
          <ul className="mt-3 space-y-4">
            {recs.jobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="cursos-recomendados">
        <h2 id="cursos-recomendados">Cursos recomendados</h2>
        {recs.courses.length === 0 ? (
          <p className="mt-2 text-neutral-600">
            Abra ou candidate-se a vagas para vermos habilidades que ainda não
            estão no seu perfil. Depois sugerimos cursos nessas categorias. Veja
            o{" "}
            <Link href="/cursos" className="text-primary underline underline-offset-4">
              catálogo completo
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {recs.courses.map((course) => (
              <li key={course.id} className="rounded-xl border border-border p-4">
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-neutral-600">
                  {course.provider}
                  {course.category ? ` · ${course.category}` : ""}
                </p>
                <p className="mt-2">
                  <Link href="/cursos" className="text-primary underline underline-offset-4">
                    Ver nos cursos
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PostForm />

      {result.error ? <p role="alert">{result.error}</p> : null}

      {!result.hasConnections ? (
        <p role="status" className="rounded-md border border-border bg-neutral-100 p-4">
          Você ainda não tem conexões aceitas. O feed mostra os posts das pessoas
          com quem você se conectou. Vá em{" "}
          <Link href="/conexoes" className="text-primary underline underline-offset-4">
            Conexões
          </Link>{" "}
          para aceitar pedidos ou enviar novos.
        </p>
      ) : result.data.length === 0 ? (
        <p>Ainda não há posts na sua rede.</p>
      ) : (
        <ul className="space-y-4">
          {result.data.map((post) => (
            <li key={post.id}>
              <article className="rounded-xl border border-border p-4">
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
                    <p className="font-medium">
                      <Link
                        href={`/perfil/${post.author.id}`}
                        className="text-primary focus-visible:outline-offset-1"
                      >
                        {post.author.full_name}
                      </Link>
                    </p>
                    {post.author.headline ? (
                      <p className="text-sm text-neutral-600">{post.author.headline}</p>
                    ) : null}
                  </div>
                </header>
                <p className="whitespace-pre-wrap">{post.content}</p>
                {post.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image_url}
                    alt={post.image_alt || `Imagem publicada por ${post.author.full_name}`}
                    className="mt-3 max-h-96 w-full rounded-lg object-cover"
                  />
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
