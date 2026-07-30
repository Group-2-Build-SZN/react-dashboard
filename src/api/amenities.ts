import { api } from './client';
import type { ApiEnvelope } from './types';
import type { Amenity, AmenityType } from '../types';

interface ApiAmenity {
  id: string;
  name: string;
  type: AmenityType;
  longitude: number;
  latitude: number;
  distance_meters?: number;
}

export function listAmenities(params: { type?: AmenityType; lat?: number; lng?: number; radiusKm?: number } = {}) {
  const usp = new URLSearchParams();
  if (params.type) usp.set('type', params.type);
  if (params.lat !== undefined) usp.set('lat', String(params.lat));
  if (params.lng !== undefined) usp.set('lng', String(params.lng));
  if (params.radiusKm !== undefined) usp.set('radiusKm', String(params.radiusKm));
  const qs = usp.toString();

  return api.get<ApiEnvelope<ApiAmenity[]>>(`/amenities${qs ? `?${qs}` : ''}`).then((r) =>
    r.data.map(
      (a): Amenity => ({
        id: a.id,
        name: a.name,
        type: a.type,
        lat: a.latitude,
        lng: a.longitude,
      })
    )
  );
}
