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

export function submitReview(propertyId: string, payload: SubmitReviewPayload) {
  return api
    .post<ApiEnvelope<ApiReview>>(`/properties/${propertyId}/reviews`, payload)
    .then((r) => r.data);
}

/** Wraps the browser Geolocation API in a promise — reviews are GPS-gated per the API. */
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
