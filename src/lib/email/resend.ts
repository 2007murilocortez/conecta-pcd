import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * E-mail transacional via Resend.
 *
 * Sender: onboarding@resend.dev — funciona sem domínio verificado, mas o
 * Resend só entrega para o e-mail da conta dona da API key. Em produção
 * de verdade (apresentação final) é preciso verificar um domínio no Resend
 * e trocar o `from` para algo como notificacoes@seudominio.
 *
 * Só usamos service role aqui, no servidor, para resolver o e-mail em
 * auth.users. Nunca exponha essa chave no client.
 *
 * Falha de envio nunca deve quebrar o fluxo principal (candidatura /
 * mentoria já foram persistidas). Só logamos o erro.
 */
const FROM = "Conecta PCD <onboarding@resend.dev>";

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function sendTransactionalEmail(input: {
  profileId: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY ausente; e-mail não enviado.");
    return;
  }

  const admin = createAdminClient();
  if (!admin) {
    console.error(
      "[email] SUPABASE_SERVICE_ROLE_KEY ausente; não foi possível resolver o e-mail do destinatário.",
    );
    return;
  }

  try {
    const { data, error } = await admin.auth.admin.getUserById(input.profileId);
    const to = data.user?.email?.trim();
    if (error || !to) {
      console.error("[email] destinatário sem e-mail", error);
      return;
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    if (result.error) {
      console.error("[email] Resend recusou o envio", result.error);
    }
  } catch (error) {
    console.error("[email] falha ao enviar", error);
  }
}

export function applicationStatusEmail(input: {
  jobTitle: string;
  statusLabel: string;
  siteUrl: string;
}) {
  const subject = `Candidatura atualizada: ${input.jobTitle}`;
  const text = `Sua candidatura para ${input.jobTitle} mudou para ${input.statusLabel}. Acompanhe em ${input.siteUrl}/candidaturas`;
  const html = `<p>Sua candidatura para <strong>${escapeHtml(input.jobTitle)}</strong> mudou para <strong>${escapeHtml(input.statusLabel)}</strong>.</p><p><a href="${input.siteUrl}/candidaturas">Ver candidaturas</a></p>`;
  return { subject, text, html };
}

export function mentorshipAcceptedEmail(input: {
  mentorName: string;
  siteUrl: string;
  mentorProfileId: string;
}) {
  const subject = "Sua mentoria foi aceita";
  const text = `${input.mentorName} aceitou seu pedido de mentoria. O contato é o perfil da pessoa: ${input.siteUrl}/perfil/${input.mentorProfileId}`;
  const html = `<p><strong>${escapeHtml(input.mentorName)}</strong> aceitou seu pedido de mentoria.</p><p>Neste MVP o contato é o perfil: <a href="${input.siteUrl}/perfil/${input.mentorProfileId}">abrir perfil</a>.</p>`;
  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
