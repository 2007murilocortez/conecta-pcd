"use client";

import Link from "next/link";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/vagas", label: "Vagas" },
  { href: "/empresas", label: "Empresas" },
  { href: "/mentoria", label: "Mentoria" },
] as const;

type HeaderBarProps = {
  isLoggedIn: boolean;
  companies: { id: string; name: string }[];
};

export function HeaderBar({ isLoggedIn, companies }: HeaderBarProps) {
  const hasCompany = companies.length > 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold text-primary focus-visible:outline-offset-1"
        >
          Conecta PCD
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center px-3 font-medium text-neutral-900 hover:text-primary focus-visible:outline-offset-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {NAV_LINKS.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon" aria-label="Notificações" asChild>
            <Link href="/notificacoes">
              <Bell />
            </Link>
          </Button>

          {isLoggedIn ? (
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
                {hasCompany ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/empresas/nova">Criar outra empresa</Link>
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" aria-label="Entrar" asChild>
              <Link href="/login">
                <User />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
