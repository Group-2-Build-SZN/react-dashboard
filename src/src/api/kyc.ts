import { api } from './client';
import type { ApiEnvelope } from './types';

export interface ApiKycRecord {
  id: string;
  userId: string;
  type: 'nin' | 'cac';
  idNumberHash: string;
  idNumberLast4: string;
  status: 'verified' | 'review_needed' | 'rejected';
  providerReference: string | null;
  verifiedAt: string;
  createdAt: string;
}

export function verifyNin(payload: {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  ninNumber: string;
}) {
  return api.post<ApiEnvelope<ApiKycRecord>>('/kyc/verify-nin', payload).then((r) => r.data);
}

export function verifyCac(payload: { companyName: string; rcNumber: string }) {
  return api.post<ApiEnvelope<ApiKycRecord>>('/kyc/verify-cac', payload).then((r) => r.data);
}

export function getKycStatus() {
  return api.get<ApiEnvelope<ApiKycRecord>>('/kyc/status').then((r) => r.data);
}
