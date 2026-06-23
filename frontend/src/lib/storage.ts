import type { HistoryItem, User } from "../types";

const TOKEN_KEY = "tr_token";
const USER_KEY = "tr_user";
const HISTORY_KEY = "tr_history";
const HISTORY_LIMIT = 50;

export const tokenStore = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export const userStore = {
  get(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  set(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear(): void {
    localStorage.removeItem(USER_KEY);
  },
};

export const historyStore = {
  getAll(): HistoryItem[] {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as HistoryItem[];
    } catch {
      return [];
    }
  },
  save(items: HistoryItem[]): void {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, HISTORY_LIMIT)));
  },
  clear(): void {
    localStorage.removeItem(HISTORY_KEY);
  },
};
