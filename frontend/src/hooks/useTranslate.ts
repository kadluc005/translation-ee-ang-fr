import { useCallback, useState } from "react";
import { translate as apiTranslate, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { LangCode } from "../types";

interface UseTranslateResult {
  result: string;
  loading: boolean;
  error: string | null;
  /** Run a translation on demand (triggered by the "Traduire" button). */
  run: (text: string, source: LangCode, target: LangCode) => Promise<string | null>;
  reset: () => void;
}

export function useTranslate(): UseTranslateResult {
  const { token } = useAuth();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (text: string, source: LangCode, target: LangCode) => {
      const trimmed = text.trim();
      if (!trimmed) {
        setResult("");
        setError(null);
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const translation = await apiTranslate(trimmed, source, target, token);
        setResult(translation);
        return translation;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "La traduction a échoué. Réessayez.";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const reset = useCallback(() => {
    setResult("");
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, run, reset };
}
