import { useState } from "react";
import { Header } from "./components/Header";
import { SourcePanel } from "./components/SourcePanel";
import { TargetPanel } from "./components/TargetPanel";
import { SwapButton } from "./components/SwapButton";
import { TranslateButton } from "./components/TranslateButton";
import { HistoryPanel } from "./components/HistoryPanel";
import { AuthModal } from "./components/auth/AuthModal";
import { useTranslate } from "./hooks/useTranslate";
import { useHistory } from "./hooks/useHistory";
import type { HistoryItem, LangCode } from "./types";

export default function App() {
  const [source, setSource] = useState<LangCode>("ee");
  const [target, setTarget] = useState<LangCode>("fr");
  const [text, setText] = useState("");

  const [historyOpen, setHistoryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const { result, loading, error, run, reset } = useTranslate();
  const history = useHistory();

  const handleSourceLang = (lang: LangCode) => {
    if (lang === target) {
      // Picking the target language as source => swap.
      setTarget(source);
    }
    setSource(lang);
    reset();
  };

  const handleTargetLang = (lang: LangCode) => {
    if (lang === source) {
      setSource(target);
    }
    setTarget(lang);
    reset();
  };

  const handleSwap = () => {
    setSource(target);
    setTarget(source);
    setText(result);
    reset();
  };

  const handleTranslate = async () => {
    const translation = await run(text, source, target);
    if (translation) {
      history.add({
        source,
        target,
        sourceText: text,
        translatedText: translation,
      });
    }
  };

  const handleClear = () => {
    setText("");
    reset();
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setSource(item.source);
    setTarget(item.target);
    setText(item.sourceText);
    reset();
    setHistoryOpen(false);
  };

  return (
    <div className="flex min-h-full flex-col">
      <Header
        onToggleHistory={() => setHistoryOpen((v) => !v)}
        onOpenAuth={() => setAuthOpen(true)}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-2 sm:px-6">
        <div className="overflow-hidden rounded-xl2 border border-line bg-white shadow-card">
          <div className="relative flex flex-col lg:flex-row">
            <SourcePanel
              value={text}
              onChange={setText}
              lang={source}
              onLangChange={handleSourceLang}
              onClear={handleClear}
            />

            {/* Divider + swap control */}
            <div className="relative flex items-center justify-center border-line lg:border-l">
              <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 lg:left-0 lg:top-1/2 lg:-translate-y-1/2">
                <SwapButton onClick={handleSwap} />
              </div>
            </div>

            <TargetPanel
              result={result}
              loading={loading}
              error={error}
              lang={target}
              onLangChange={handleTargetLang}
            />
          </div>

          <div className="flex justify-end border-t border-line px-4 py-3">
            <TranslateButton
              onClick={handleTranslate}
              loading={loading}
              disabled={!text.trim()}
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Traduction Éwé · Anglais · Français — transcription vocale disponible
          en Éwé.
        </p>
      </main>

      <HistoryPanel
        open={historyOpen}
        items={history.items}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleSelectHistory}
        onRemove={history.remove}
        onClear={history.clear}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
