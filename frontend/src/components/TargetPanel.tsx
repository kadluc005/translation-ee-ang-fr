import { LanguageTabs } from "./LanguageTabs";
import { SpeakerButton } from "./SpeakerButton";
import type { LangCode } from "../types";

interface TargetPanelProps {
  result: string;
  loading: boolean;
  error: string | null;
  lang: LangCode;
  onLangChange: (lang: LangCode) => void;
}

export function TargetPanel({
  result,
  loading,
  error,
  lang,
  onLangChange,
}: TargetPanelProps) {
  return (
    <section
      className="flex flex-1 flex-col bg-hover/40 lg:bg-transparent"
      aria-label="Traduction"
    >
      <LanguageTabs
        value={lang}
        onChange={onLangChange}
        ariaLabel="Langue cible"
      />

      <div className="relative min-h-[160px] flex-1 px-5 py-4">
        {loading ? (
          <div className="flex items-center gap-3 text-ink-muted">
            <span className="spinner h-5 w-5" />
            <span>Traduction…</span>
          </div>
        ) : error ? (
          <p className="text-base text-danger" role="alert">
            {error}
          </p>
        ) : result ? (
          <p className="whitespace-pre-wrap text-2xl leading-relaxed text-ink">
            {result}
          </p>
        ) : (
          <p className="text-2xl text-ink-faint">Traduction</p>
        )}
      </div>

      <div className="flex items-center justify-start px-3 py-2">
        <SpeakerButton text={result} lang={lang} />
      </div>
    </section>
  );
}
