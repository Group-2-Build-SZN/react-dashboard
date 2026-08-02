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

export interface CreatePropertyPayload {
  listingTitle: string;
  listingPurpose?: 'rent' | 'sale';
  description?: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  price: number;
  address: string;
  latitude: number | null;
  longitude: number | null;
  videoUrls?: string[];
  features?: string[];
}

export function createProperty(payload: CreatePropertyPayload) {
  return api
    .post<ApiEnvelope<ApiPropertyDetail>>('/properties', payload)
    .then((r) => r.data);
}

export function uploadPropertyMedia(
  propertyId: string,
  formData: FormData
) {
  return api
    .post<ApiEnvelope<ApiPropertyDetail>>(`/properties/${propertyId}/media`, formData)
    .then((r) => r.data);
}

export function publishProperty(propertyId: string) {
  return api
    .patch<ApiEnvelope<ApiPropertyDetail>>(`/properties/${propertyId}/publish`, {})
    .then((r) => r.data);
}

export function deleteProperty(propertyId: string) {
  return api.delete(`/properties/${propertyId}`);
}

export async function listMyProperties(ownerId: string) {
  const first = await listProperties({ limit: 50, page: 1 });
  const pages = [first];
  for (let page = 2; page <= first.pagination.totalPages; page++) {
    pages.push(await listProperties({ limit: 50, page }));
  }
  return {
    ...first,
    data: pages.flatMap((p) => p.data).filter((item) => item.owner_id === ownerId),
  };
}