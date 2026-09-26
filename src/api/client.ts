import { clearTokens, getTokens, setTokens } from './tokenStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

interface RawResult {
  status: number;
  body: { success: boolean; code: string; message: string; data: unknown } | null;
}

async function rawRequest(path: string, options: RequestOptions): Promise<RawResult> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth !== false) {
    const { accessToken } = getTokens();
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  return { status: res.status, body };
}

let refreshPromise: Promise<boolean> | null = null;

function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { refreshToken } = getTokens();
    if (!refreshToken) return false;

    try {
      const { status, body } = await rawRequest('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
        auth: false,
      });
      if (status === 200 && body?.success) {
        const data = body.data as { accessToken: string; refreshToken: string };
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  })();

  return refreshPromise.finally(() => {
    refreshPromise = null;
  });
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let { status, body } = await rawRequest(path, options);

  if (status === 401 && options.auth !== false) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      ({ status, body } = await rawRequest(path, options));
    } else {
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.hash = '#/login';
      }
      throw new ApiError('로그인이 필요합니다.', 'A003', 401);
    }
  }

  if (!body || body.success !== true) {
    throw new ApiError(body?.message ?? '요청 처리 중 오류가 발생했습니다.', body?.code ?? 'UNKNOWN', status);
  }

  return body.data as T;
}

export function get<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' });
}

export function post<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'POST', body });
}

export function put<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'PUT', body });
}

export function del<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'DELETE' });
}
