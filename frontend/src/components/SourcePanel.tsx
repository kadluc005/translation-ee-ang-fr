import { useCallback } from "react";
import { LanguageTabs } from "./LanguageTabs";
import { MicButton } from "./MicButton";
import { AudioUpload } from "./AudioUpload";
import { CharCount } from "./CharCount";
import { useRecorder } from "../hooks/useRecorder";
import { LANGUAGE_MAP, type LangCode } from "../types";

const MAX_CHARS = 5000;

interface SourcePanelProps {
  value: string;
  onChange: (text: string) => void;
  lang: LangCode;
  onLangChange: (lang: LangCode) => void;
  onClear: () => void;
}

export function SourcePanel({
  value,
  onChange,
  lang,
  onLangChange,
  onClear,
}: SourcePanelProps) {
  const canTranscribe = LANGUAGE_MAP[lang].canTranscribe;

  const handleResult = useCallback(
    (text: string) => {
      if (text) onChange(text);
    },
    [onChange],
  );

  const recorder = useRecorder(handleResult);

  return (
    <section className="flex flex-1 flex-col" aria-label="Texte source">
      <LanguageTabs
        value={lang}
        onChange={onLangChange}
        ariaLabel="Langue source"
      />

      <div className="relative flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Saisir le texte"
          aria-label="Texte à traduire"
          className="h-full min-h-[160px] w-full resize-none bg-transparent px-5 py-4 text-2xl
            leading-relaxed text-ink outline-none placeholder:text-ink-faint"
        />
        {value && (
          <button
            onClick={onClear}
            aria-label="Effacer le texte"
            className="absolute right-3 top-3 icon-btn h-8 w-8"
          >
            ✕
          </button>
        )}
      </div>

      {recorder.error && (
        <p className="px-5 pb-1 text-sm text-danger" role="alert">
          {recorder.error}
        </p>
      )}

      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1">
          <MicButton
            isRecording={recorder.isRecording}
            processing={recorder.status === "processing"}
            disabled={!canTranscribe}
            onStart={recorder.start}
            onStop={recorder.stop}
          />
          <AudioUpload
            disabled={!canTranscribe}
            onFile={(file) => recorder.transcribeFile(file)}
          />
        </div>
        <CharCount count={value.length} max={MAX_CHARS} />
      </div>
    </section>
  );
}
