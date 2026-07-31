import { api } from './client';
import type {
  ApiEnvelope,
  ApiInquiry,
  ApiPaginatedList,
  ApiPropertyDetail,
  ApiPropertyListItem,
  ApiPropertySearchParams,
} from './types';

function toQueryString(params: Record<string, unknown>): string {
  const usp = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    usp.set(key, String(value));
  }

  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

export function listProperties(params: ApiPropertySearchParams = {}) {
  return api.get<ApiPaginatedList<ApiPropertyListItem>>(
    `/properties${toQueryString({ ...params })}`
  );
}

export function getRecommendedProperties() {
  return api
    .get<ApiEnvelope<ApiPropertyListItem[]>>('/properties/recommended')
    .then((r) => r.data);
}

export function getProperty(id: string) {
  return api
    .get<ApiEnvelope<ApiPropertyDetail>>(`/properties/${id}`)
    .then((r) => r.data);
}

export function saveProperty(id: string) {
  return api.post(`/properties/${id}/save`);
}

export function unsaveProperty(id: string) {
  return api.delete(`/properties/${id}/save`);
}

export function listSavedProperties(
  listingPurpose?: 'rent' | 'sale'
) {
  return api
    .get<ApiEnvelope<{ savedAt: string; property: ApiPropertyDetail }[]>>(
      `/saved${
        listingPurpose
          ? `?listingPurpose=${listingPurpose}`
          : ''
      }`
    )
    .then((r) => r.data);
}

export function submitInquiry(
  propertyId: string,
  message: string
) {
  return api.post(`/properties/${propertyId}/inquiries`, {
    message,
  });
}

export function listInquiries() {
  return api
    .get<ApiEnvelope<{ inquiry: ApiInquiry; property: ApiPropertyDetail }[]>>(
      '/inquiries'
    )
    .then((r) => r.data);
}

export interface ApiPropertyReport {
  id: string;
  referenceId: string;
  propertyId: string;
  reporterId: string;
  reason: string;
  description: string | null;
  evidenceUrls: string[] | null;
  status: string;
  createdAt: string;
}

export function reportProperty(
  propertyId: string,
  formData: FormData
) {
  return api
    .post<ApiEnvelope<ApiPropertyReport>>(`/properties/${propertyId}/report`, formData)
    .then((r) => r.data);
}