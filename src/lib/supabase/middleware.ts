import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { isOnboardingComplete } from "@/lib/validations/profile";

const DASHBOARD_PREFIXES = [
  "/feed",
  "/perfil",
  "/vagas",
  "/empresas",
  "/conexoes",
  "/mentoria",
  "/cursos",
  "/candidaturas",
  "/notificacoes",
];

const AUTH_PATHS = ["/login", "/cadastro"];

function isDashboardPath(pathname: string) {
  return DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub ?? null;
  const { pathname } = request.nextUrl;

  if (!userId && isDashboardPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (userId && isAuthPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (
    userId &&
    isDashboardPath(pathname) &&
    pathname !== "/perfil/editar"
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, headline")
      .eq("id", userId)
      .maybeSingle();

    // Critério: nome preenchido + headline salvo em /perfil/editar.
    // O trigger handle_new_user já pode preencher full_name no signup;
    // headline só existe depois que a pessoa grava os dados básicos.
    if (!profile || !isOnboardingComplete(profile)) {
      const url = request.nextUrl.clone();
      url.pathname = "/perfil/editar";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
