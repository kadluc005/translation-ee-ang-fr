import { MicIcon, StopIcon } from "./Icons";

interface MicButtonProps {
  isRecording: boolean;
  processing: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function MicButton({
  isRecording,
  processing,
  disabled,
  onStart,
  onStop,
}: MicButtonProps) {
  if (processing) {
    return (
      <span className="icon-btn" aria-label="Transcription en cours">
        <span className="spinner h-4 w-4" />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={isRecording ? onStop : onStart}
      disabled={disabled}
      aria-label={isRecording ? "Arrêter l'enregistrement" : "Parler (Éwé)"}
      aria-pressed={isRecording}
      title={
        disabled
          ? "Le micro ne transcrit que l'Éwé"
          : isRecording
            ? "Arrêter"
            : "Parler (Éwé)"
      }
      className={`icon-btn ${
        isRecording
          ? "bg-danger text-white hover:bg-danger hover:text-white"
          : ""
      }`}
    >
      {isRecording ? <StopIcon /> : <MicIcon />}
    </button>
  );
}
