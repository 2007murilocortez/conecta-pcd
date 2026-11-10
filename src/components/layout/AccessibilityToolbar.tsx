"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Contrast, Minus, Plus, PersonStanding, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  saveAccessibilityPrefs,
  type AccessibilityPrefs,
} from "@/lib/actions/accessibility";
import {
  canSpeak,
  getClickedText,
  getMainText,
  getSelectedText,
  shouldIgnoreClick,
  speakText,
  stopSpeaking,
} from "@/lib/read-aloud";

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
  const [listenMode, setListenMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const keepAliveRef = useRef<number | null>(null);
  const pathname = usePathname();

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

  function clearKeepAlive() {
    if (keepAliveRef.current) {
      window.clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }

  function startKeepAlive() {
    clearKeepAlive();
    keepAliveRef.current = window.setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearKeepAlive();
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 12000);
  }

  function stopListen() {
    stopSpeaking();
    clearKeepAlive();
    setSpeaking(false);
    setListenMode(false);
  }

  function read(text: string) {
    const started = speakText(text, () => {
      clearKeepAlive();
      setSpeaking(false);
    });
    setSpeaking(started);
    if (started) startKeepAlive();
  }

  const readRef = useRef(read);
  readRef.current = read;

  useEffect(() => {
    setSpeechSupported(canSpeak());
  }, []);

  useEffect(() => {
    if (!listenMode) return;

    function onClick(event: MouseEvent) {
      if (shouldIgnoreClick(event.target)) return;
      const text = getClickedText(event.target);
      if (!text) return;
      event.preventDefault();
      event.stopPropagation();
      readRef.current(text);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [listenMode]);

  useEffect(() => {
    stopSpeaking();
    clearKeepAlive();
    setSpeaking(false);
    setListenMode(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      clearKeepAlive();
    };
  }, []);

  function toggleListen() {
    if (!canSpeak()) {
      setSpeechSupported(false);
      return;
    }

    if (listenMode) {
      stopListen();
      return;
    }

    setListenMode(true);
    const selected = getSelectedText();
    read(selected || getMainText());
  }

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
      data-a11y-toolbar="true"
      role="region"
      aria-label="Ajustes de acessibilidade"
      className="fixed bottom-4 left-4 z-50 rounded-2xl border border-border bg-white p-2 shadow-[var(--shadow-card)]"
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

        <Button
          type="button"
          variant={listenMode ? "default" : "outline"}
          size="icon"
          onClick={toggleListen}
          disabled={!speechSupported}
          aria-pressed={listenMode}
          aria-label={
            !speechSupported
              ? "Leitura em voz alta não disponível neste navegador"
              : listenMode
                ? "Parar leitura em voz alta"
                : "Ouvir o texto da página"
          }
        >
          {listenMode ? <VolumeX /> : <Volume2 />}
        </Button>
      </div>
      {listenMode ? (
        <p className="mt-1 max-w-64 px-1 text-sm text-neutral-700" aria-live="polite">
          {speaking
            ? "Lendo. Clique noutro texto, ou no botão, para parar."
            : "Clique no texto que quiser ouvir."}
        </p>
      ) : null}
      {!speechSupported ? (
        <p className="mt-1 max-w-64 px-1 text-sm text-neutral-700" role="status">
          Este navegador não lê texto em voz alta.
        </p>
      ) : null}
    </div>
  );
}
