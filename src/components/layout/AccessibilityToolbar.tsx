"use client";

import { useEffect, useState } from "react";
import { Contrast, Minus, Plus, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  saveAccessibilityPrefs,
  type AccessibilityPrefs,
} from "@/lib/actions/accessibility";

const MIN_SCALE = 1;
const MAX_SCALE = 1.5;
const STEP = 0.125;
const STORAGE_KEY = "conecta-a11y";

function applyToDocument(prefs: AccessibilityPrefs) {
  const root = document.documentElement;
  root.style.setProperty("--font-scale", String(prefs.font_scale));
  root.classList.toggle("high-contrast", prefs.high_contrast);
  root.classList.toggle("reduce-motion", prefs.reduce_motion);
}

function readLocal(): AccessibilityPrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AccessibilityPrefs>;
    return {
      font_scale: Number(parsed.font_scale) || 1,
      high_contrast: Boolean(parsed.high_contrast),
      reduce_motion: Boolean(parsed.reduce_motion),
    };
  } catch {
    return null;
  }
}

export function AccessibilityToolbar({
  initial,
  persist,
}: {
  initial: AccessibilityPrefs;
  persist: boolean;
}) {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const local = readLocal();
    if (local && !persist) {
      setPrefs(local);
    }
    setReady(true);
  }, [persist]);

  useEffect(() => {
    if (!ready) return;
    applyToDocument(prefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // storage cheio ou privado — a toolbar ainda funciona na sessão.
    }
    if (persist) {
      void saveAccessibilityPrefs(prefs);
    }
  }, [prefs, persist, ready]);

  function decreaseFont() {
    setPrefs((current) => ({
      ...current,
      font_scale: Math.max(MIN_SCALE, Number((current.font_scale - STEP).toFixed(3))),
    }));
  }

  function increaseFont() {
    setPrefs((current) => ({
      ...current,
      font_scale: Math.min(MAX_SCALE, Number((current.font_scale + STEP).toFixed(3))),
    }));
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
          disabled={prefs.font_scale <= MIN_SCALE}
          aria-label="Diminuir tamanho da fonte"
        >
          <Minus />
          <span className="sr-only">A-</span>
        </Button>
        <span
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm font-medium"
          aria-live="polite"
        >
          {Math.round(prefs.font_scale * 100)}%
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increaseFont}
          disabled={prefs.font_scale >= MAX_SCALE}
          aria-label="Aumentar tamanho da fonte"
        >
          <Plus />
          <span className="sr-only">A+</span>
        </Button>

        <Button
          type="button"
          variant={prefs.high_contrast ? "default" : "outline"}
          size="icon"
          onClick={() =>
            setPrefs((current) => ({ ...current, high_contrast: !current.high_contrast }))
          }
          aria-pressed={prefs.high_contrast}
          aria-label={
            prefs.high_contrast ? "Desativar alto contraste" : "Ativar alto contraste"
          }
        >
          <Contrast />
        </Button>

        <Button
          type="button"
          variant={prefs.reduce_motion ? "default" : "outline"}
          size="icon"
          onClick={() =>
            setPrefs((current) => ({ ...current, reduce_motion: !current.reduce_motion }))
          }
          aria-pressed={prefs.reduce_motion}
          aria-label={
            prefs.reduce_motion
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
