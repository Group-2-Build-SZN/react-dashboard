
import type { Property, PropertyType, Review, RatingBreakdown } from '../types';
import type { ApiPropertyDetail, ApiPropertyListItem, ApiPropertySearchParams } from './types';
import type { PropertyFilters } from '../components/FilterBottomSheet/FilterBottomSheet';
import type { ApiReview } from './reviews';

function decodeEwkbPoint(hex: string): { lat: number; lng: number } | null {
  if (hex.length < 50) return null;
  try {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    const isLittleEndian = bytes[0] === 1;
    const view = new DataView(bytes.buffer);
    const lng = view.getFloat64(9, isLittleEndian);
    const lat = view.getFloat64(17, isLittleEndian);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

function extractLatLng(item: ApiPropertyListItem | ApiPropertyDetail): { lat: number; lng: number } {
  if ('location' in item && item.location && typeof item.location === 'object') {
    return { lat: item.location.y, lng: item.location.x };
  }
  if ('location' in item && typeof item.location === 'string') {
    const decoded = decodeEwkbPoint(item.location);
    if (decoded) return decoded;
  }
  return { lat: 0, lng: 0 };
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  self_contained: 'Self-Contained',
  single_room: 'Single Room',
  one_bedroom_flat: '1 Bedroom Flat',
  two_bedroom_flat: '2 Bedroom Flat',
  three_bedroom_flat: '3 Bedroom Flat',
  duplex: 'Duplex',
  bungalow: 'Bungalow',
  shared_apartment: 'Shared Apartment',
};

export function propertyTypeLabel(type: string): string {
  return PROPERTY_TYPE_LABELS[type] ?? type;
}

function isListItem(
  item: ApiPropertyListItem | ApiPropertyDetail
): item is ApiPropertyListItem {
  return 'listing_title' in item;
}

function ratingToScore(rating: number): number {
  return Math.max(0, Math.min(100, rating * 20));
}

function toListingCategory(purpose: 'rent' | 'sale'): 'for_rent' | 'for_sale' {
  return purpose === 'sale' ? 'for_sale' : 'for_rent';
}

export function apiPropertyToProperty(item: ApiPropertyListItem | ApiPropertyDetail): Property {
  const { lat, lng } = extractLatLng(item);

  if (isListItem(item)) {
    return {
      id: item.id,
      listingTitle: item.listing_title,
      address: item.address,
      neighborhood: item.address, 
      price: Number(item.price),
      pricePeriod: 'year',
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      coverImageUrl: item.photo_urls?.[0] ?? '',
      lat,
      lng,
      isVerified: item.is_published,
      availabilityStatus: item.availability_status,
      listingCategory: toListingCategory(item.listing_purpose),
      isFavorited: item.is_saved ?? false,
      description: item.description ?? undefined,
      photoUrls: item.photo_urls ?? [],
      videoUrls: item.video_urls ?? [],
      features: item.features ?? [],
      propertyType: item.property_type as PropertyType,
      trustScore: Number(item.trust_score),
      waterScore: item.water_score !== undefined ? Number(item.water_score) : undefined,
      powerScore: item.power_score !== undefined ? Number(item.power_score) : undefined,
      securityScore: item.security_score !== undefined ? Number(item.security_score) : undefined,
      ownerId: item.owner_id,
    };
  }

  return {
    id: item.id,
    listingTitle: item.listingTitle,
    address: item.address,
    neighborhood: item.address,
    price: Number(item.price),
    pricePeriod: 'year',
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    coverImageUrl: item.photoUrls?.[0] ?? '',
    lat,
    lng,
    isVerified: item.isPublished,
    availabilityStatus: item.availabilityStatus,
    listingCategory: toListingCategory(item.listingPurpose),
    isFavorited: item.isSaved ?? false,
    description: item.description ?? undefined,
    photoUrls: item.photoUrls ?? [],
    videoUrls: item.videoUrls ?? [],
    features: item.features ?? [],
    propertyType: item.propertyType as PropertyType,
    trustScore: item.trustSummary ? Number(item.trustSummary.trust_score) : 0,
    waterScore: item.trustSummary ? ratingToScore(Number(item.trustSummary.water_rating)) : undefined,
    powerScore: item.trustSummary ? ratingToScore(Number(item.trustSummary.electricity_rating)) : undefined,
    securityScore: item.trustSummary ? ratingToScore(Number(item.trustSummary.security_rating)) : undefined,
    roadScore: item.trustSummary ? ratingToScore(Number(item.trustSummary.road_accessiblity_rating)) : undefined,
    ownerId: item.ownerId,
    owner: item.owner
      ? {
          name: `${item.owner.firstName} ${item.owner.lastName}`.trim(),
          memberSince: typeof item.owner.memberSince === 'string' ? item.owner.memberSince : 'Member',
          isVerified: true, // no explicit per-owner verified flag in the API; KYC-gated publishing implies it
          phone: item.owner.contact?.phone,
          email: item.owner.contact?.email,
        }
      : undefined,
  };
}

export function scoreLabel(score: number | undefined): string {
  if (score === undefined) return '—';
  if (score >= 80) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score > 0) return 'Poor';
  return 'No Data';
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

const FEATURE_LABELS: Record<string, string> = {
  water: 'Water Supply',
  water_supply: 'Water Supply',
  power: '24/7 Power',
  electricity: '24/7 Power',
  generator: '24/7 Power',
  security: 'Security',
  parking: 'Parking Space',
  parking_space: 'Parking Space',
  balcony: 'Balcony',
  fitted_kitchen: 'Fitted Kitchen',
  kitchen: 'Fitted Kitchen',
  wifi: 'Wi-Fi',
};

export function featureLabel(feature: string): string {
  const known = FEATURE_LABELS[feature.toLowerCase()];
  if (known) return known;
  return feature
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function averageReviewRating(item: ApiReview): number {
  const scores = [item.waterRating, item.electricityRating, item.securityRating, item.roadAccessibilityRating];
  const sum = scores.reduce((total, s) => total + (Number(s) || 0), 0);
  return sum / scores.length;
}

export function apiReviewToReview(item: ApiReview): Review {
  const name = [item.reviewer_first_name, item.reviewer_last_name].filter(Boolean).join(' ').trim();
  return {
    id: item.id,
    reviewerName: name || 'Anonymous',
    reviewType: item.reviewType,
    overallRating: averageReviewRating(item),
    createdAt: new Date(item.createdAt).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    text: item.reviewText ?? '',
  };
}

export function reviewsToBreakdown(items: ApiReview[]): RatingBreakdown {
  if (items.length === 0) {
    return { water: 0, electricity: 0, security: 0, amenityAccessibility: 0 };
  }
  const totals = items.reduce(
    (acc, item) => ({
      water: acc.water + (Number(item.waterRating) || 0),
      electricity: acc.electricity + (Number(item.electricityRating) || 0),
      security: acc.security + (Number(item.securityRating) || 0),
      amenityAccessibility: acc.amenityAccessibility + (Number(item.roadAccessibilityRating) || 0),
    }),
    { water: 0, electricity: 0, security: 0, amenityAccessibility: 0 }
  );
  const n = items.length;
  return {
    water: totals.water / n,
    electricity: totals.electricity / n,
    security: totals.security / n,
    amenityAccessibility: totals.amenityAccessibility / n,
  };
}

export function toPropertyCardViewModel(p: Property) {
  return {
    image: p.coverImageUrl || '',
    name: p.listingTitle,
    location: p.neighborhood,
    address: p.address,
    price: formatNaira(p.price),
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    size: '—', // not provided by the API
    videoDuration: p.videoUrls.length > 0 ? '—' : '', // API has no duration field
    views: 0, // API has no view-counter
    verified: p.isVerified,
    trustScore: p.trustScore,
    trustRating: scoreLabel(p.trustScore),
    security: scoreLabel(p.securityScore),
    water: scoreLabel(p.waterScore),
  };
}

export type { PropertyType };


const PROPERTY_TYPE_FILTER_MAP: Partial<Record<string, string>> = {
  Duplex: 'duplex',
  Bungalow: 'bungalow',
};

const AMENITY_FEATURE_MAP: Record<string, string> = {
  Parking: 'parking',
  Security: 'security',
  Generator: 'generator',
  'Water Supply': 'water_supply',
  'Pop Ceiling': 'pop_ceiling',
  'Kitchen Cabinets': 'kitchen_cabinets',
};

function parseBedroomBathroomOption(option: string): number | undefined {
  if (option === 'Any') return undefined;
  return parseInt(option, 10);
}

export function propertyFiltersToApiParams(filters: PropertyFilters): ApiPropertySearchParams {
  return {
    propertyType: PROPERTY_TYPE_FILTER_MAP[filters.propertyType],
    bedrooms: parseBedroomBathroomOption(filters.bedrooms),
    bathrooms: parseBedroomBathroomOption(filters.bathrooms),
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice: filters.priceRange[1] > 0 ? filters.priceRange[1] : undefined,
    features: filters.amenities.length
      ? filters.amenities.map((a) => AMENITY_FEATURE_MAP[a] ?? a.toLowerCase()).join(',')
      : undefined,
  };
}
