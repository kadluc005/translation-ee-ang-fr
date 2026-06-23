import { useState } from "react";
import { SpeakerIcon } from "./Icons";
import { isTtsSupported, speak, stopSpeaking } from "../lib/tts";
import { useAuth } from "../context/AuthContext";
import type { LangCode } from "../types";

interface SpeakerButtonProps {
  text: string;
  lang: LangCode;
}

export function SpeakerButton({ text, lang }: SpeakerButtonProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const supported = isTtsSupported(lang);
  const disabled = !text.trim() || !supported || loading;

  const handleClick = async () => {
    if (disabled) return;
    setLoading(true);
    try {
      stopSpeaking();
      await speak(text, lang, token);
    } catch {
      // Playback failures are non-critical; stay silent.
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label="Écouter"
      title={supported ? "Écouter" : "Synthèse vocale indisponible"}
      className="icon-btn"
    >
      {loading ? <span className="spinner h-4 w-4" /> : <SpeakerIcon />}
    </button>
  );
}
