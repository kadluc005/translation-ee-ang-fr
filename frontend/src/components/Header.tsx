import { useState } from "react";
import { Logo } from "./Logo";
import { GridIcon, HistoryIcon, MenuIcon, UserIcon } from "./Icons";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onToggleHistory: () => void;
  onOpenAuth: () => void;
}

export function Header({ onToggleHistory, onOpenAuth }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = (user?.username || user?.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-4 py-2.5 sm:px-6">
      <div className="flex items-center gap-3">
        <button className="icon-btn sm:hidden" aria-label="Menu">
          <MenuIcon />
        </button>
        <Logo />
      </div>

      <div className="flex items-center gap-1">
        <button
          className="icon-btn"
          onClick={onToggleHistory}
          aria-label="Historique"
          title="Historique"
        >
          <HistoryIcon />
        </button>
        <button
          className="icon-btn hidden sm:inline-flex"
          aria-label="Applications"
        >
          <GridIcon />
        </button>

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Compte"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
            >
              {initial}
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 z-20 mt-2 w-56 animate-fade-in rounded-xl border border-line bg-white p-2 shadow-pop"
                >
                  <p className="truncate px-3 py-2 text-sm text-ink-muted">
                    {user?.email}
                  </p>
                  <button
                    role="menuitem"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-hover"
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="ml-1 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            <UserIcon width={16} height={16} />
            Connexion
          </button>
        )}
      </div>
    </header>
  );
}
