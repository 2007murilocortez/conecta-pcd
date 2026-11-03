const SKIP_SELECTOR =
  "[data-a11y-toolbar], [vw], [vw-access-button], .vw-plugin-wrapper, .skip-link, header, footer, script, style, noscript, [aria-hidden='true']";

function getVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

function pickPortugueseVoice() {
  const voices = getVoices();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "pt-br") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("pt")) ??
    null
  );
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking() {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
}

export function speakText(
  text: string,
  onEnd?: () => void,
): boolean {
  if (!canSpeak()) return false;

  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) {
    onEnd?.();
    return false;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.getVoices();

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = "pt-BR";
  utterance.rate = 0.95;
  const voice = pickPortugueseVoice();
  if (voice) utterance.voice = voice;

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
  return true;
}

function visibleText(node: ParentNode) {
  const clone = (node as HTMLElement).cloneNode(true) as HTMLElement;
  clone.querySelectorAll(SKIP_SELECTOR).forEach((el) => el.remove());
  return (clone.innerText ?? clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

export function getMainText() {
  const main = document.getElementById("conteudo-principal") ?? document.body;
  return visibleText(main);
}

export function getSelectedText() {
  return window.getSelection()?.toString().replace(/\s+/g, " ").trim() ?? "";
}

export function getClickedText(target: EventTarget | null) {
  if (!(target instanceof Element)) return "";

  const start = target instanceof HTMLElement ? target : target.parentElement;
  if (!start) return "";
  if (start.closest(SKIP_SELECTOR)) return "";

  let node: HTMLElement | null = start;
  let best = "";

  while (node && node !== document.body) {
    if (node.closest(SKIP_SELECTOR)) break;
    const text = visibleText(node);
    if (text.length >= 2 && text.length <= 900) {
      best = text;
      if (
        node.matches(
          "p, h1, h2, h3, h4, h5, h6, li, article, button, a, label, td, th, blockquote, [role='article']",
        )
      ) {
        return text;
      }
    }
    if (text.length > 900 && best) return best;
    node = node.parentElement;
  }

  return best || visibleText(start);
}

export function shouldIgnoreClick(target: EventTarget | null) {
  if (!(target instanceof Element)) return true;
  return Boolean(target.closest(SKIP_SELECTOR));
}
