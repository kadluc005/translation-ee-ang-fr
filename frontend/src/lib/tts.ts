import type { LangCode } from "../types";
import { synthesize as apiSynthesize } from "./api";

// Use the backend MMS-VITS model for ALL languages (ee/en/fr).
// - Éwé:     facebook/mms-tts-ewe
// - English: facebook/mms-tts-eng
// - French:  facebook/mms-tts-fra
// This matches the Streamlit reference app and avoids the robotic browser
// SpeechSynthesis voices for English and French.

let currentAudio: HTMLAudioElement | null = null;

export function isTtsSupported(_lang: LangCode): boolean {
  // All three languages are supported via the backend MMS-VITS models.
  return true;
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
}

/** Speak `text` in the given language using the backend MMS-VITS model. */
export async function speak(
  text: string,
  lang: LangCode,
  token: string | null = null
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  stopSpeaking();
  const blob = await apiSynthesize(trimmed, lang, token);
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;
  audio.onended = () => URL.revokeObjectURL(url);
  await audio.play();
}
