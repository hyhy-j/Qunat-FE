export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  nickname: string | null;
}

const STORAGE_KEY = 'quantai-auth';
const EMPTY_TOKENS: AuthTokens = { accessToken: null, refreshToken: null, nickname: null };

type Listener = (tokens: AuthTokens) => void;

const listeners = new Set<Listener>();
let state: AuthTokens = load();

function load(): AuthTokens {
  if (typeof window === 'undefined') return EMPTY_TOKENS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_TOKENS;
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      nickname: parsed.nickname ?? null,
    };
  } catch {
    return EMPTY_TOKENS;
  }
}

function persist() {
  if (typeof window === 'undefined') return;
  if (!state.accessToken) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function getTokens(): AuthTokens {
  return state;
}

export function setTokens(next: Partial<AuthTokens>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((listener) => listener(state));
}

export function clearTokens() {
  state = EMPTY_TOKENS;
  persist();
  listeners.forEach((listener) => listener(state));
}

export function subscribeTokens(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
