import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function VerifiedInclusiveBadge() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-1 rounded-full bg-secondary/10 px-3 text-sm font-medium text-secondary focus-visible:outline-offset-1"
        >
          <BadgeCheck className="size-4" aria-hidden />
          Empresa Inclusiva Verificada
        </button>
      </TooltipTrigger>
      <TooltipContent>
        Selo concedido só por quem administra a plataforma, depois de uma
        verificação. A empresa não pode se autoatribuir.
      </TooltipContent>
    </Tooltip>
  );
}
