interface TranslateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export function TranslateButton({
  onClick,
  loading,
  disabled,
}: TranslateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5
        text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover
        disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint"
    >
      {loading && (
        <span className="spinner h-4 w-4 border-white/40 border-t-white" />
      )}
      Traduire
    </button>
  );
}
