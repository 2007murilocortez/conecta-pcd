"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Contrast, Minus, Pause, Plus, Volume2, VolumeX, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hasCustomPrefs =
    prefs.font_scale !== 1 || prefs.high_contrast || prefs.reduce_motion || listenMode;

  return (
    <div data-a11y-toolbar="true" className="fixed bottom-4 left-4 z-50 max-w-[min(100%-2rem,20rem)]">
      {open ? (
        <div
          id="menu-acessibilidade"
          role="region"
          aria-label="Ajustes de acessibilidade"
          className="max-h-[min(32rem,calc(100dvh-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-card)]"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="mb-0 text-sm font-semibold text-primary-dark">Acessibilidade</p>
              <p className="mb-0 text-sm text-neutral-600">Ajuste a leitura desta página.</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fechar ajustes de acessibilidade"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-900">Tamanho do texto</p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={decreaseFont}
                  disabled={prefs.font_scale <= MIN_SCALE}
                  aria-label="Diminuir tamanho da fonte"
                >
                  <Minus />
                </Button>
                <span
                  className="inline-flex min-h-11 min-w-14 items-center justify-center text-sm font-medium"
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
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant={prefs.high_contrast ? "default" : "outline"}
              className="h-auto w-full justify-start gap-2 py-2.5"
              onClick={() =>
                setPrefs((current) => ({ ...current, high_contrast: !current.high_contrast }))
              }
              aria-pressed={prefs.high_contrast}
            >
              <Contrast />
              {prefs.high_contrast ? "Alto contraste ligado" : "Alto contraste"}
            </Button>

            <Button
              type="button"
              variant={prefs.reduce_motion ? "default" : "outline"}
              className="h-auto w-full justify-start gap-2 py-2.5"
              onClick={() =>
                setPrefs((current) => ({ ...current, reduce_motion: !current.reduce_motion }))
              }
              aria-pressed={prefs.reduce_motion}
            >
              <Pause />
              {prefs.reduce_motion ? "Movimento reduzido" : "Reduzir movimento"}
            </Button>

            <Button
              type="button"
              variant={listenMode ? "default" : "outline"}
              className="h-auto w-full justify-start gap-2 py-2.5"
              onClick={toggleListen}
              disabled={!speechSupported}
              aria-pressed={listenMode}
            >
              {listenMode ? <VolumeX /> : <Volume2 />}
              {!speechSupported
                ? "Leitura em voz alta indisponível"
                : listenMode
                  ? "Parar leitura"
                  : "Ouvir o texto da página"}
            </Button>
          </div>

          {listenMode ? (
            <p className="mt-3 mb-0 text-sm text-neutral-700" aria-live="polite">
              {speaking
                ? "Lendo. Clique noutro texto, ou em Parar leitura, para interromper."
                : "Clique no texto que quiser ouvir."}
            </p>
          ) : null}
          {!speechSupported ? (
            <p className="mt-3 mb-0 text-sm text-neutral-700" role="status">
              Este navegador não lê texto em voz alta.
            </p>
          ) : null}
        </div>
      ) : (
        <Button
          type="button"
          className="h-auto min-h-11 gap-2 px-4 py-2.5 shadow-[var(--shadow-card)]"
          aria-expanded={false}
          aria-controls="menu-acessibilidade"
          onClick={() => setOpen(true)}
        >
          Acessibilidade
          {hasCustomPrefs ? (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
              ativo
            </span>
          ) : null}
        </Button>
      )}
    </div>
  );
}
