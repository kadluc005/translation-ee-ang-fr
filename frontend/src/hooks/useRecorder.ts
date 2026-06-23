import { useCallback, useEffect, useRef, useState } from "react";
import { blobToWav } from "../lib/audio";
import { transcribe as apiTranscribe, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type RecorderStatus = "idle" | "recording" | "processing";

interface UseRecorderResult {
  status: RecorderStatus;
  error: string | null;
  isRecording: boolean;
  start: () => Promise<void>;
  stop: () => void;
  /** Transcribe an existing WAV/audio file (upload path). */
  transcribeFile: (file: Blob) => Promise<string | null>;
}

/**
 * Records microphone audio, converts it to 16 kHz mono WAV and sends it to the
 * Ewe ASR endpoint. `onResult` receives the recognized text.
 */
export function useRecorder(
  onResult: (text: string) => void
): UseRecorderResult {
  const { token } = useAuth();
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => cleanupStream, [cleanupStream]);

  const sendAudio = useCallback(
    async (blob: Blob): Promise<string | null> => {
      setStatus("processing");
      setError(null);
      try {
        const wav = await blobToWav(blob);
        const text = await apiTranscribe(wav, token);
        onResult(text);
        return text;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "La transcription a échoué. Réessayez.";
        setError(message);
        return null;
      } finally {
        setStatus("idle");
      }
    },
    [onResult, token]
  );

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Le micro n'est pas disponible dans ce navigateur.");
      return;
    }
    try {
      // Disable echoCancellation and noiseSuppression: on some hardware
      // (SOF/PipeWire mic with WebRTC AEC) these produce entirely-silent audio.
      // This matches the getUserMedia patch used in the Streamlit reference app.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        cleanupStream();
        void sendAudio(blob);
      };

      recorder.start();
      setStatus("recording");
    } catch {
      setError("Autorisation du micro refusée.");
      cleanupStream();
    }
  }, [cleanupStream, sendAudio]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, []);

  const transcribeFile = useCallback(
    (file: Blob) => sendAudio(file),
    [sendAudio]
  );

  return {
    status,
    error,
    isRecording: status === "recording",
    start,
    stop,
    transcribeFile,
  };
}
