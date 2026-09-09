"use client";

import { useEffect, useState } from "react";
import { Contrast, Minus, Plus, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN_SCALE = 1;
const MAX_SCALE = 1.5;
const STEP = 0.125;

export function AccessibilityToolbar() {
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-scale", String(fontScale));
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("reduce-motion", reduceMotion);
  }, [fontScale, highContrast, reduceMotion]);

  function decreaseFont() {
    setFontScale((current) => Math.max(MIN_SCALE, Number((current - STEP).toFixed(3))));
  }

  function increaseFont() {
    setFontScale((current) => Math.min(MAX_SCALE, Number((current + STEP).toFixed(3))));
  }

  return (
    <div
      role="region"
      aria-label="Ajustes de acessibilidade"
      className="fixed bottom-4 left-4 z-50 rounded-lg border border-border bg-bg p-2 shadow-md"
    >
      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decreaseFont}
          disabled={fontScale <= MIN_SCALE}
          aria-label="Diminuir tamanho da fonte"
        >
          <Minus />
          <span className="sr-only">A-</span>
        </Button>
        <span
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm font-medium"
          aria-live="polite"
        >
          {Math.round(fontScale * 100)}%
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increaseFont}
          disabled={fontScale >= MAX_SCALE}
          aria-label="Aumentar tamanho da fonte"
        >
          <Plus />
          <span className="sr-only">A+</span>
        </Button>

        <Button
          type="button"
          variant={highContrast ? "default" : "outline"}
          size="icon"
          onClick={() => setHighContrast((current) => !current)}
          aria-pressed={highContrast}
          aria-label={
            highContrast ? "Desativar alto contraste" : "Ativar alto contraste"
          }
        >
          <Contrast />
        </Button>

        <Button
          type="button"
          variant={reduceMotion ? "default" : "outline"}
          size="icon"
          onClick={() => setReduceMotion((current) => !current)}
          aria-pressed={reduceMotion}
          aria-label={
            reduceMotion
              ? "Permitir animações"
              : "Reduzir movimento e animações"
          }
        >
          <PersonStanding />
        </Button>
      </div>
    </div>
  );
}
