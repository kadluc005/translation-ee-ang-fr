import { LANGUAGES, type LangCode } from "../types";

interface LanguageTabsProps {
  value: LangCode;
  onChange: (lang: LangCode) => void;
  /** The language selected in the opposite panel, shown but still selectable (triggers a swap upstream). */
  ariaLabel: string;
}

export function LanguageTabs({
  value,
  onChange,
  ariaLabel,
}: LanguageTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex items-center gap-1 border-b border-line px-2 py-1.5"
    >
      {LANGUAGES.map((lang) => {
        const active = lang.code === value;
        return (
          <button
            key={lang.code}
            role="tab"
            aria-selected={active}
            className={`lang-tab ${active ? "lang-tab-active" : ""}`}
            onClick={() => onChange(lang.code)}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
