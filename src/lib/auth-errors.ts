const TEST_LOCAL_PARTS = new Set([
  "test",
  "teste",
  "testing",
  "example",
  "asdf",
  "foo",
  "bar",
  "email",
  "user",
  "admin",
]);

const TEST_DOMAINS = new Set([
  "example.com",
  "example.net",
  "example.org",
  "test.com",
  "teste.com",
  "mailinator.com",
]);

export function isBlockedTestEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const [local, domain] = normalized.split("@");
  if (!local || !domain) return false;
  return TEST_LOCAL_PARTS.has(local) || TEST_DOMAINS.has(domain);
}

export function authErrorMessage(raw: string, code?: string): string {
  const message = raw.toLowerCase();
  const errorCode = (code ?? "").toLowerCase();

  if (
    errorCode === "email_address_invalid" ||
    (message.includes("email address") && message.includes("invalid"))
  ) {
    return "Este e-mail não pode ser usado. O Supabase bloqueia endereços de teste (teste@, test@, example@). Use um e-mail real seu.";
  }

  if (
    errorCode === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("user already")
  ) {
    return "Este e-mail já tem uma conta. Entre ou use outro e-mail.";
  }

  if (
    errorCode === "over_email_send_rate_limit" ||
    message.includes("rate limit")
  ) {
    return "Muitas tentativas seguidas. Espere um minuto e tente de novo.";
  }

  if (errorCode === "weak_password" || message.includes("weak password")) {
    return "A senha está fraca. Use pelo menos 8 caracteres.";
  }

  if (
    errorCode === "email_not_confirmed" ||
    message.includes("email not confirmed")
  ) {
    return "Confirme seu e-mail antes de entrar.";
  }

  if (
    errorCode === "invalid_credentials" ||
    message.includes("invalid login") ||
    message.includes("invalid credentials")
  ) {
    return "E-mail ou senha inválidos.";
  }

  if (
    message.includes("load failed") ||
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("fetch")
  ) {
    return "Não foi possível conectar ao servidor. Verifique a internet e tente de novo em alguns segundos.";
  }

  return "Não foi possível concluir agora. Tente de novo em instantes.";
}
