// Thin fetch wrapper around the My Ulo API.
//
// - Base URL comes from VITE_API_BASE_URL (see .env.example).
// - Access token is kept in memory (see tokenStore below) and sent as
//   `Authorization: Bearer <token>`.
// - The refresh token lives in an httpOnly cookie set by the backend, so we
//   always send `credentials: 'include'` and let the browser handle it.
// - On a 401 (except on the refresh call itself) we try POST /auth/refresh
//   once, then replay the original request.

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!BASE_URL) {
  // Fails loudly in dev rather than silently hitting a relative path.
  console.warn(
    '[api] VITE_API_BASE_URL is not set — copy .env.example to .env'
  );
}

export interface ApiErrorShape {
  message: string;
  code?: string;
}

export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(status: number, shape: ApiErrorShape) {
    super(shape.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = shape.code;
  }
}

// --- token store -----------------------------------------------------------
// In-memory only. Access tokens are short-lived (see swagger example: ~15min
// exp), so we don't persist them to localStorage. On a hard page refresh the
// app should call /auth/refresh on boot to get a new one from the refresh
// cookie — wire that in App.tsx / an AuthProvider.

let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
};

// --- core request ------------------------------------------------------------

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown; // will be JSON.stringify'd unless it's already FormData
  skipAuthRetry?: boolean; // internal — prevents infinite refresh loops
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuthRetry, headers, ...rest } = options;

  const isFormData = body instanceof FormData;

  const finalHeaders: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include', // send the refresh-token cookie
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  // Attempt a single silent refresh on 401, then replay the request.
  if (res.status === 401 && !skipAuthRetry && path !== '/auth/refresh') {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, { ...options, skipAuthRetry: true });
    }
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const errShape: ApiErrorShape = payload?.error ?? {
      message: payload?.message ?? res.statusText,
    };
    throw new ApiError(res.status, errShape);
  }

  return payload as T;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const data = await request<{ success: boolean; data: { accessToken: string } }>(
      '/auth/refresh',
      { method: 'POST', skipAuthRetry: true }
    );
    if (data?.data?.accessToken) {
      tokenStore.set(data.data.accessToken);
      return true;
    }
    return false;
  } catch {
    tokenStore.set(null);
    return false;
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};
