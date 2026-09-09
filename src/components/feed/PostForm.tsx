"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createPost } from "@/lib/actions/posts";

export function PostForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await createPost(new FormData(event.currentTarget));
    setPending(false);
    setStatus(result.error ?? "Post publicado.");
    if (!result.error) {
      event.currentTarget.reset();
      setHasImage(false);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {status ? <p role={status.includes("Não") ? "alert" : "status"}>{status}</p> : null}

      <Field>
        <FieldLabel htmlFor="post_content">O que você quer compartilhar</FieldLabel>
        <Textarea id="post_content" name="content" className="min-h-28" required />
      </Field>

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
            : "Preencha se for enviar uma imagem, para leitores de tela."}
        </FieldDescription>
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? "Publicando…" : "Publicar"}
      </Button>
    </form>
  );
}
