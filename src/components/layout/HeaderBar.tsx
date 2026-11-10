"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, User } from "lucide-react";
import { LogoutButton, LogoutMenuItem } from "@/components/auth/LogoutButton";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "cn";

const PUBLIC_LINKS = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#para-empresas", label: "Para empresas" },
  { href: "/sobre-acessibilidade", label: "Acessibilidade" },
] as const;

const NAV_GROUPS = [
  {
    label: "Descobrir",
    items: [
      { href: "/feed", label: "Feed" },
      { href: "/vagas", label: "Vagas" },
      { href: "/empresas", label: "Empresas" },
      { href: "/cursos", label: "Cursos" },
      { href: "/conexoes", label: "Conexões" },
    ],
  },
  {
    label: "Minha atividade",
    items: [
      { href: "/candidaturas", label: "Candidaturas" },
      { href: "/notificacoes", label: "Notificações" },
      { href: "/perfil/editar", label: "Meu perfil" },
    ],
  },
] as const;

type HeaderBarProps = {
  isLoggedIn: boolean;
  unreadCount: number;
  companies: { id: string; name: string }[];
};

function isActivePath(pathname: string, href: string) {
  const path = href.split("?")[0];
  if (path === "/feed") return pathname === "/feed";
  if (path === "/empresas" && href.includes("minhas=1")) {
    return false;
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-xl px-3 font-medium transition-colors",
        active
          ? "bg-brand-light text-primary-dark"
          : "text-neutral-900 hover:bg-brand-light/70 hover:text-primary-dark",
      )}
    >
      {label}
    </Link>
  );
}

export function HeaderBar({ isLoggedIn, unreadCount, companies }: HeaderBarProps) {
  const pathname = usePathname();
  const hasCompany = companies.length > 0;
  const allLoggedLinks: { href: string; label: string }[] = [
    ...NAV_GROUPS.flatMap((group) => [...group.items]),
    ...(hasCompany
      ? [
          { href: "/empresas?minhas=1", label: "Minhas empresas" },
          { href: "/vagas/nova", label: "Publicar vaga" },
        ]
      : [{ href: "/empresas/nova", label: "Criar página de empresa" }]),
  ];

  return (
    <>
      {isLoggedIn ? (
        <aside
          data-app-sidebar
          className="fixed top-0 left-0 z-40 hidden h-full w-[17rem] flex-col border-r border-border bg-white px-4 py-5 lg:flex"
        >
          <Link href="/feed" className="mb-6 inline-flex items-center px-1">
            <BrandLogo priority />
          </Link>
          <nav aria-label="Área logada" className="flex flex-1 flex-col gap-6 overflow-y-auto">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1 px-3 text-xs font-medium tracking-wide text-neutral-600">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <NavLink href={item.href} label={item.label} pathname={pathname} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="mb-1 px-3 text-xs font-medium tracking-wide text-neutral-600">
                Gerenciar
              </p>
              <ul className="flex flex-col gap-0.5">
                {hasCompany ? (
                  <>
                    <li>
                      <NavLink href="/empresas?minhas=1" label="Minhas empresas" pathname={pathname} />
                    </li>
                    <li>
                      <NavLink href="/vagas/nova" label="Publicar vaga" pathname={pathname} />
                    </li>
                  </>
                ) : (
                  <li>
                    <NavLink href="/empresas/nova" label="Criar página de empresa" pathname={pathname} />
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </aside>
      ) : null}

      <header
        className={cn(
          "sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md",
          isLoggedIn && "lg:pl-[17rem]",
        )}
      >
        <div
          className={cn(
            "mx-auto flex min-h-16 w-full items-center justify-between gap-4 px-4 py-2",
            isLoggedIn ? "max-w-none" : "max-w-6xl",
          )}
        >
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                      <Menu />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-56">
                    {allLoggedLinks.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <LogoutMenuItem />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                      <Menu />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {PUBLIC_LINKS.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                      <Link href="/login">Entrar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/cadastro">Criar perfil</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <Link href={isLoggedIn ? "/feed" : "/"} className="inline-flex items-center">
              <BrandLogo className={isLoggedIn ? "lg:hidden" : undefined} priority />
            </Link>
          </div>

          {!isLoggedIn ? (
            <nav aria-label="Principal" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {PUBLIC_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center px-3 font-medium text-neutral-900 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={
                    unreadCount > 0
                      ? `Notificações, ${unreadCount} não lidas`
                      : "Notificações"
                  }
                  asChild
                >
                  <Link href="/notificacoes" className="relative">
                    <Bell />
                    {unreadCount > 0 ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-1 right-1 size-2 rounded-full bg-primary"
                      />
                    ) : null}
                  </Link>
                </Button>
                <LogoutButton />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Abrir menu da conta">
                      <User />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/editar">Editar perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/candidaturas">Candidaturas</Link>
                    </DropdownMenuItem>
                    {hasCompany ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/empresas?minhas=1">Minhas empresas</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/vagas/nova">Publicar vaga</Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link href="/empresas/nova">Criar página de empresa</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <LogoutMenuItem />
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="hidden sm:inline-flex">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/cadastro">Criar perfil</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
