import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostForm } from "@/components/feed/PostForm";
import { listFeedPosts } from "@/lib/actions/posts";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const result = await listFeedPosts();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12">
      <h1 className="text-primary">Feed</h1>
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
