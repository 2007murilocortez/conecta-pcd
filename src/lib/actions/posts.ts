"use server";

import { revalidatePath } from "next/cache";
import { getAcceptedConnectionIds } from "@/lib/actions/connections";
import { getAuthedUser } from "@/lib/supabase/user";
import { createPostSchema } from "@/lib/validations/network";

type ActionResult<T = undefined> = {
  error?: string;
  data?: T;
};

export type FeedPost = {
  id: string;
  content: string;
  image_url: string | null;
  image_alt: string | null;
  created_at: string;
  author: {
    id: string;
    full_name: string;
    headline: string | null;
    avatar_url: string | null;
  };
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  const parsed = createPostSchema.safeParse({
    content: formData.get("content"),
    image_alt: formData.get("image_alt") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const file = formData.get("image");
  const image = file instanceof File && file.size > 0 ? file : null;

  if (image) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
      return { error: "Use uma imagem JPG, PNG ou WebP." };
    }
    if (image.size > 5 * 1024 * 1024) {
      return { error: "A imagem precisa ter no máximo 5 MB." };
    }
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para publicar." };
  }

  const { data: author } = await supabase
    .from("profiles_public")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  let imageUrl: string | null = null;
  let imageAlt: string | null = null;

  if (image) {
    const extension = image.type.split("/")[1] ?? "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(path, image, { contentType: image.type, upsert: false });

    if (uploadError) {
      return { error: "Não foi possível enviar a imagem." };
    }

    imageUrl = supabase.storage.from("posts").getPublicUrl(path).data.publicUrl;
    imageAlt =
      parsed.data.image_alt?.trim() ||
      `Imagem publicada por ${author?.full_name?.trim() || "uma pessoa da rede"}`;
  }

  const { error } = await supabase.from("posts").insert({
    profile_id: userId,
    content: parsed.data.content,
    image_url: imageUrl,
    image_alt: imageAlt,
  });

  if (error) {
    return { error: "Não foi possível publicar o post." };
  }

  revalidatePath("/feed");
  return {};
}

export async function listFeedPosts() {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para ver o feed.", hasConnections: false, data: [] as FeedPost[] };
  }

  const connectionIds = await getAcceptedConnectionIds(userId);
  const authorIds = [userId, ...connectionIds];

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, content, image_url, image_alt, created_at, profile_id, profiles_public(id, full_name, headline, avatar_url)",
    )
    .in("profile_id", authorIds)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Não foi possível carregar o feed.", hasConnections: connectionIds.length > 0, data: [] as FeedPost[] };
  }

  const posts: FeedPost[] = (data ?? []).flatMap((row) => {
    const author = unwrapOne(row.profiles_public);
    if (!author?.id) return [];
    return [
      {
        id: row.id,
        content: row.content,
        image_url: row.image_url,
        image_alt: row.image_alt,
        created_at: row.created_at,
        author: {
          id: author.id,
          full_name: author.full_name?.trim() || "Profissional",
          headline: author.headline,
          avatar_url: author.avatar_url,
        },
      },
    ];
  });

  return {
    data: posts,
    hasConnections: connectionIds.length > 0,
  };
}
