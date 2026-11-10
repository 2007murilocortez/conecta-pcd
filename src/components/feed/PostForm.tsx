"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/lib/actions/posts";

type PostFormProps = {
  authorName: string;
  authorAvatarUrl: string | null;
};

export function PostForm({ authorName, authorAvatarUrl }: PostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = event.currentTarget;
    const result = await createPost(new FormData(form));
    setPending(false);

    if (result.error) {
      setStatus(result.error);
      return;
    }

    setStatus("Publicado na sua rede.");
    form.reset();
    setContent("");
    setShowImage(false);
    setHasImage(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-4 p-5" noValidate>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {status ? (
        <p
          role={status.startsWith("Publicado") ? "status" : "alert"}
          className={
            status.startsWith("Publicado")
              ? "text-sm text-success-text"
              : "text-sm font-medium text-destructive"
          }
        >
          {status}
        </p>
      ) : null}

      <div className="flex items-start gap-3">
        <Avatar className="mt-1 size-12">
          {authorAvatarUrl ? <AvatarImage src={authorAvatarUrl} alt="" /> : null}
          <AvatarFallback>{authorName.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Field className="min-w-0 flex-1">
          <FieldLabel htmlFor="post_content">Escrever para a rede</FieldLabel>
          <Textarea
            id="post_content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-28"
            maxLength={2000}
            required
            placeholder="Compartilhe uma conquista, uma vaga ou um aprendizado da rotina."
          />
        </Field>
      </div>

      {showImage ? (
        <div className="space-y-4 sm:pl-[3.75rem]">
          <Field>
            <FieldLabel htmlFor="post_image">Imagem (opcional)</FieldLabel>
            <Input
              id="post_image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="min-h-11"
              onChange={(event) => setHasImage(Boolean(event.target.files?.[0]))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="post_image_alt">Descrição da imagem</FieldLabel>
            <Input id="post_image_alt" name="image_alt" className="min-h-11" />
            <FieldDescription>
              {hasImage
                ? "Se você não descrever, salvamos um texto padrão com o seu nome."
                : "Para leitores de tela, se for enviar foto."}
            </FieldDescription>
          </Field>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 sm:pl-[3.75rem]">
        {showImage ? null : (
          <Button type="button" variant="ghost" onClick={() => setShowImage(true)}>
            Anexar imagem
          </Button>
        )}
        <Button type="submit" className="ml-auto" disabled={pending || content.trim().length === 0}>
          {pending ? "Publicando…" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
