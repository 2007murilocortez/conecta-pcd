"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/lib/actions/posts";
import { POST_STARTERS } from "@/lib/constants/posts";

export function PostForm() {
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

    setStatus("Post publicado na sua rede.");
    form.reset();
    setContent("");
    setShowImage(false);
    setHasImage(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="surface-card space-y-4 p-5"
      noValidate
    >
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {status ? (
        <p
          role={status.startsWith("Post") ? "status" : "alert"}
          className={
            status.startsWith("Post")
              ? "text-sm text-secondary"
              : "text-sm font-medium text-destructive"
          }
        >
          {status}
        </p>
      ) : null}

      <Field>
        <FieldLabel htmlFor="post_content">Publicar na rede</FieldLabel>
        <Textarea
          id="post_content"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-24"
          maxLength={2000}
          required
          placeholder="Ex.: concluí um curso, estou buscando vaga remota ou quero uma dica de acessibilidade…"
        />
      </Field>

      <div>
        <p className="mb-2 text-sm text-neutral-600">Começar com um modelo</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {POST_STARTERS.map((starter) => (
            <li key={starter.label}>
              <Button
                type="button"
                variant="outline"
                className="h-auto py-1.5"
                onClick={() => {
                  setContent(starter.text);
                  setStatus(null);
                }}
              >
                {starter.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {showImage ? (
        <>
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
        </>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowImage(true)}
        >
          Anexar imagem
        </Button>
      )}

      <Button type="submit" disabled={pending || content.trim().length === 0}>
        {pending ? "Publicando…" : "Publicar"}
      </Button>
    </form>
  );
}
