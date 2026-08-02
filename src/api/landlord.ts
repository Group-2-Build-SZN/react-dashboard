import { api } from './client';
import type { ApiEnvelope, ApiPaginatedList } from './types';

export interface ApiLandlordStats {
  totalProperties: number;
  activeListings: number;
  totalViews: number;
  recentSearches: number;
  topPerformingProperty: {
    id: string;
    listingTitle: string;
    coverImageUrl: string | null;
    price: string;
    viewCount: number;
  } | null;
}

export function getLandlordStats() {
  return api
    .get<ApiEnvelope<ApiLandlordStats>>('/landlord/stats')
    .then((r) => r.data);
}

export interface ApiLandlordInquiry {
  id: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  propertyId: string;
  propertyTitle: string;
  tenantFirstName: string;
  tenantLastName: string;
  tenantAvatarUrl: string | null;
}

export function getRecentInquiries(page = 1, limit = 5) {
  return api.get<ApiPaginatedList<ApiLandlordInquiry>>(
    `/landlord/inquiries/recent?page=${page}&limit=${limit}`
  );
}
