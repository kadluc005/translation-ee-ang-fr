import { SwapIcon } from "./Icons";

export function SwapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Inverser les langues"
      title="Inverser les langues"
      className="icon-btn border border-line bg-white shadow-sm hover:bg-hover"
    >
      <SwapIcon />
    </button>
  );
}
