import type {
  AuthResponse,
  LangCode,
  TranscriptionResponse,
  TranslationResponse,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseError(res: Response): Promise<never> {
  let detail = `Erreur ${res.status}`;
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") {
      detail = data.detail;
    } else if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
      detail = data.detail[0].msg;
    }
  } catch {
    // response had no JSON body; keep the generic message
  }
  throw new ApiError(detail, res.status);
}

function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function translate(
  text: string,
  source: LangCode,
  target: LangCode,
  token: string | null = null
): Promise<string> {
  const res = await fetch(`${BASE_URL}/translation/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ text, source, target }),
  });
  if (!res.ok) await parseError(res);
  const data: TranslationResponse = await res.json();
  return data.translation;
}

export async function transcribe(
  file: Blob,
  token: string | null = null
): Promise<string> {
  const form = new FormData();
  form.append("file", file, "audio.wav");
  const res = await fetch(`${BASE_URL}/speech/transcribe`, {
    method: "POST",
    headers: { ...authHeaders(token) },
    body: form,
  });
  if (!res.ok) await parseError(res);
  const data: TranscriptionResponse = await res.json();
  return data.text;
}

/** Synthesize speech for `text` in `lang` (ee/en/fr) via backend MMS-VITS. */
export async function synthesize(
  text: string,
  lang: LangCode,
  token: string | null = null
): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/tts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ text, lang }),
  });
  if (!res.ok) await parseError(res);
  return res.blob();
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}
