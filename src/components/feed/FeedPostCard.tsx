import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/jobs/format";
import type { FeedPost } from "@/lib/actions/posts";

export function FeedPostCard({ post }: { post: FeedPost }) {
  return (
    <article className="surface-card p-5 sm:p-6">
      <header className="mb-4 flex items-start gap-3">
        <Link href={`/perfil/${post.author.id}`} className="shrink-0">
          <Avatar className="size-12">
            {post.author.avatar_url ? (
              <AvatarImage src={post.author.avatar_url} alt="" />
            ) : null}
            <AvatarFallback>{post.author.full_name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0">
          <p className="mb-0 font-semibold text-primary-dark">
            <Link
              href={`/perfil/${post.author.id}`}
              className="focus-visible:outline-offset-1"
            >
              {post.author.full_name}
            </Link>
          </p>
          {post.author.headline ? (
            <p className="mb-0 text-sm text-neutral-600">{post.author.headline}</p>
          ) : null}
          <p className="mb-0 text-sm text-neutral-600">
            <time dateTime={post.created_at}>{formatRelativeTime(post.created_at)}</time>
          </p>
        </div>
      </header>
      <p className="mb-0 whitespace-pre-wrap text-[1.05rem] leading-relaxed">{post.content}</p>
      {post.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image_url}
          alt={post.image_alt || `Imagem publicada por ${post.author.full_name}`}
          className="mt-4 max-h-96 w-full rounded-2xl object-cover"
        />
      ) : null}
    </article>
  );
}
