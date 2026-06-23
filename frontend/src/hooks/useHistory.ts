import { useCallback, useState } from "react";
import { historyStore } from "../lib/storage";
import type { HistoryItem, LangCode } from "../types";

interface AddHistoryInput {
  source: LangCode;
  target: LangCode;
  sourceText: string;
  translatedText: string;
}

interface UseHistoryResult {
  items: HistoryItem[];
  add: (input: AddHistoryInput) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export function useHistory(): UseHistoryResult {
  const [items, setItems] = useState<HistoryItem[]>(() => historyStore.getAll());

  const persist = useCallback((next: HistoryItem[]) => {
    setItems(next);
    historyStore.save(next);
  }, []);

  const add = useCallback(
    (input: AddHistoryInput) => {
      const text = input.sourceText.trim();
      if (!text || !input.translatedText.trim()) return;

      setItems((prev) => {
        // Skip if identical to the most recent entry.
        const last = prev[0];
        if (
          last &&
          last.sourceText === text &&
          last.source === input.source &&
          last.target === input.target
        ) {
          return prev;
        }
        const item: HistoryItem = {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : String(Date.now()),
          createdAt: Date.now(),
          ...input,
          sourceText: text,
        };
        const next = [item, ...prev].slice(0, 50);
        historyStore.save(next);
        return next;
      });
    },
    []
  );

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((it) => it.id !== id);
        historyStore.save(next);
        return next;
      });
    },
    []
  );

  const clear = useCallback(() => {
    historyStore.clear();
    persist([]);
  }, [persist]);

  return { items, add, remove, clear };
}
