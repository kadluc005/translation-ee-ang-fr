import { CloseIcon, TrashIcon } from "./Icons";
import { LANGUAGE_MAP, type HistoryItem } from "../types";

interface HistoryPanelProps {
  open: boolean;
  items: HistoryItem[];
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  open,
  items,
  onClose,
  onSelect,
  onRemove,
  onClear,
}: HistoryPanelProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed right-0 top-0 z-40 flex h-full w-full max-w-sm animate-fade-in flex-col bg-white shadow-pop"
        aria-label="Historique des traductions"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-lg font-medium text-ink">Historique</h2>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={onClear}
                className="icon-btn"
                aria-label="Tout effacer"
                title="Tout effacer"
              >
                <TrashIcon />
              </button>
            )}
            <button
              onClick={onClose}
              className="icon-btn"
              aria-label="Fermer l'historique"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-ink-faint">
              <p className="text-sm">Aucune traduction pour l'instant.</p>
              <p className="mt-1 text-xs">
                Vos traductions récentes apparaîtront ici.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="group relative">
                  <button
                    onClick={() => onSelect(item)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-hover"
                  >
                    <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">
                      {LANGUAGE_MAP[item.source].label} →{" "}
                      {LANGUAGE_MAP[item.target].label}
                    </div>
                    <p className="truncate text-sm font-medium text-ink">
                      {item.sourceText}
                    </p>
                    <p className="truncate text-sm text-ink-muted">
                      {item.translatedText}
                    </p>
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    aria-label="Supprimer"
                    className="absolute right-2 top-2 hidden icon-btn h-8 w-8 group-hover:inline-flex"
                  >
                    <CloseIcon width={16} height={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
