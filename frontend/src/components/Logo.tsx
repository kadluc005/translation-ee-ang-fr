export function Logo() {
  return (
    <div
      className="flex items-center gap-2 select-none"
      aria-label="Traducteur"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-base font-bold text-white">
        Ɛ
      </span>
      <span className="text-xl text-ink-muted">
        <span className="font-medium text-ink">Traducteur</span> Éwé
      </span>
    </div>
  );
}
