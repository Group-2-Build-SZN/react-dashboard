import { api } from './client';
import type { ApiEnvelope } from './types';

export interface ApiReview {
  id: string;
  propertyId: string;
  reviewerId: string;
  reviewType: 'verified_resident' | 'community_tip';
  waterRating: number;
  electricityRating: number;
  securityRating: number;
  roadAccessibilityRating: number;
  cleanlinessRating: number;
  reviewText: string | null;
  photoUrls: string[] | null;
  submittedLat: number;
  submittedLng: number;
  distanceFromPropertyMetres: number;
  createdAt: string;
  updatedAt: string;
  reviewer_first_name?: string;
  reviewer_last_name?: string;
}

export interface SubmitReviewPayload {
  waterRating: number;
  electricityRating: number;
  securityRating: number;
  roadAccessibilityRating: number;
  cleanlinessRating: number;
  reviewText?: string;
  submittedLat: number;
  submittedLng: number;
}

export interface ApiReviewsResponse {
  success: boolean;
  verifiedResident: ApiReview[];
  communityTip: ApiReview[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function getReviews(propertyId: string, page = 1, limit = 20) {
  return api.get<ApiReviewsResponse>(
    `/properties/${propertyId}/reviews?page=${page}&limit=${limit}`
  );
}

export function submitReview(propertyId: string, payload: SubmitReviewPayload) {
  return api
    .post<ApiEnvelope<ApiReview>>(`/properties/${propertyId}/reviews`, payload)
    .then((r) => r.data);
}

export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location access is not available in this browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || 'Location access was denied')),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
