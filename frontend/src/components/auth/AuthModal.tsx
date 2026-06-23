import { useState } from "react";
import { CloseIcon } from "../Icons";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";

type Mode = "login" | "register";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const reset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      close();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue. Réessayez.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      onClick={close}
    >
      <div
        className="w-full max-w-md animate-fade-in rounded-xl2 bg-white p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="auth-title" className="text-xl font-medium text-ink">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h2>
          <button onClick={close} className="icon-btn" aria-label="Fermer">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <Field
              id="username"
              label="Nom d'utilisateur"
              type="text"
              value={username}
              onChange={setUsername}
              autoComplete="username"
              required
            />
          )}
          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <Field
            id="password"
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
          />

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5
              text-sm font-medium text-white transition-colors hover:bg-brand-hover
              disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="spinner h-4 w-4 border-white/40 border-t-white" />
            )}
            {mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-muted">
          {mode === "login" ? (
            <>
              Pas de compte ?{" "}
              <button
                onClick={() => switchMode("register")}
                className="font-medium text-brand hover:underline"
              >
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà inscrit ?{" "}
              <button
                onClick={() => switchMode("login")}
                className="font-medium text-brand hover:underline"
              >
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-ink-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-lg border border-line px-3 py-2 text-ink outline-none
          transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
