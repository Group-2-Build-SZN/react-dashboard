import { api, tokenStore } from './client';
import type { ApiEnvelope, ApiUser } from './types';

export function requestCode(email: string) {
  return api.post<ApiEnvelope<{ message: string }>>('/auth/request-code', { email });
}

export async function verifyCode(email: string, code: string) {
  const res = await api.post<ApiEnvelope<{ user: ApiUser; accessToken: string }>>(
    '/auth/verify-code',
    { email, code }
  );
  tokenStore.set(res.data.accessToken);
  return res.data.user;
}

export async function signInWithGoogle(idToken: string) {
  const res = await api.post<ApiEnvelope<{ user: ApiUser; accessToken: string }>>('/auth/google', {
    idToken,
  });
  tokenStore.set(res.data.accessToken);
  return res.data.user;
}

export function completeProfile(payload: {
  firstName: string;
  lastName: string;
  phone: string;
  role: 'tenant' | 'agent' | 'landlord';
  referralCode?: string;
}) {
  return api.patch<ApiEnvelope<ApiUser>>('/auth/complete-profile', payload).then((r) => r.data);
}

export async function logout() {
  await api.post('/auth/logout');
  tokenStore.set(null);
}

/** Call on app boot to silently exchange the refresh cookie for an access token. */
export async function bootstrapSession(): Promise<ApiUser | null> {
  try {
    const res = await api.post<ApiEnvelope<{ accessToken: string }>>('/auth/refresh');
    tokenStore.set(res.data.accessToken);
    return getMe();
  } catch {
    return null;
  }
}

export function getMe() {
  return api.get<ApiEnvelope<ApiUser>>('/users/me').then((r) => r.data);
}

export function getMyStats() {
  return api
    .get<ApiEnvelope<{ savedProperties: number; viewedProperties: number; inquiriesMade: number }>>(
      '/users/me/stats'
    )
    .then((r) => r.data);
}
