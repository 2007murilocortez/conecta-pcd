"use client";

import { useFormStatus } from "react-dom";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

function HeaderLogoutSubmit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" disabled={pending} aria-label="Sair da conta">
      {pending ? "Saindo…" : "Sair"}
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <HeaderLogoutSubmit />
    </form>
  );
}

export function LogoutMenuItem() {
  return (
    <form action={signOutAction}>
      <DropdownMenuItem asChild>
        <button type="submit">Sair</button>
      </DropdownMenuItem>
    </form>
  );
}
