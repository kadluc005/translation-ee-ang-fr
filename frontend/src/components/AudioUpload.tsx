import { useRef } from "react";
import { UploadIcon } from "./Icons";

interface AudioUploadProps {
  disabled?: boolean;
  onFile: (file: File) => void;
}

export function AudioUpload({ disabled, onFile }: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        aria-label="Téléverser un fichier audio (Éwé)"
        title={
          disabled
            ? "La transcription ne supporte que l'Éwé"
            : "Téléverser un fichier audio (Éwé)"
        }
        className="icon-btn"
      >
        <UploadIcon />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
