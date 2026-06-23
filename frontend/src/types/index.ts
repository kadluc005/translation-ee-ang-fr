export type LangCode = "ee" | "en" | "fr";

export interface Language {
  code: LangCode;
  label: string;
  /** Whether the ASR model can transcribe this language (Ewe only). */
  canTranscribe: boolean;
  /** BCP-47 tag for browser SpeechSynthesis (undefined when unsupported, e.g. Ewe). */
  ttsLang?: string;
}

export const LANGUAGES: Language[] = [
  { code: "ee", label: "Éwé", canTranscribe: true },
  { code: "en", label: "Anglais", canTranscribe: false, ttsLang: "en-US" },
  { code: "fr", label: "Français", canTranscribe: false, ttsLang: "fr-FR" },
];

export const LANGUAGE_MAP: Record<LangCode, Language> = LANGUAGES.reduce(
  (acc, lang) => {
    acc[lang.code] = lang;
    return acc;
  },
  {} as Record<LangCode, Language>
);

export interface TranslationResponse {
  translation: string;
}

export interface TranscriptionResponse {
  text: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  username?: string;
  email?: string;
}

export interface HistoryItem {
  id: string;
  source: LangCode;
  target: LangCode;
  sourceText: string;
  translatedText: string;
  createdAt: number;
}
