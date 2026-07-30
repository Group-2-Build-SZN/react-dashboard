// Single place that absorbs the gap between what the API actually returns
// and what the UI wants. Two jobs:
//
//   1. apiPropertyToProperty()   -> the app's canonical `Property` type
//      (src/types/index.ts, originally yours). Use this everywhere.
//
//   2. toPropertyCardViewModel() -> the display-formatted shape teammate's
//      PropertyCard / RecommendedPropertyCard / SearchResultCard components
//      expect (pre-formatted price strings, "Good"/"Fair" labels, etc).
//
// Honest gap you should know about: teammate's card components render
// `videoDuration`, `views`, and `size` (sqm) — none of which exist anywhere
// in the backend. There's no video-length field, no view-counter, and no
// floor-area field in the API. toPropertyCardViewModel() below fills these
// with a placeholder ('—') rather than inventing numbers. The real fix is
// either dropping those fields from the card UI or asking the backend team
// to add them — that's a product decision, not something to paper over here.

import type { Property, PropertyType } from '../types';
import type { ApiPropertyDetail, ApiPropertyListItem, ApiPropertySearchParams } from './types';
import type { PropertyFilters } from '../components/FilterBottomSheet/FilterBottomSheet';

// The API is PostGIS-flavoured: list endpoints give `location` as a WKB hex
// string we don't decode (lat/lng come from the `lat`/`lng` query instead
// when doing proximity search), detail endpoints give `{ x, y }` (x = lng,
// y = lat). Neither reliably gives lat/lng for map pins from a plain list
// call — if you need map pins for a bare list fetch, request with lat/lng/
// radiusKm set so distance-based results are meaningful, or fetch details.
function extractLatLng(item: ApiPropertyListItem | ApiPropertyDetail): { lat: number; lng: number } {
  if ('location' in item && item.location && typeof item.location === 'object') {
    return { lat: item.location.y, lng: item.location.x };
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

/** Normalizes either raw API shape into the app's canonical Property type. */
export function apiPropertyToProperty(item: ApiPropertyListItem | ApiPropertyDetail): Property {
  const { lat, lng } = extractLatLng(item);

  if (isListItem(item)) {
    return {
      id: item.id,
      listingTitle: item.listing_title,
      address: item.address,
      neighborhood: item.address, // API has no separate neighborhood field
      price: Number(item.price),
      pricePeriod: 'year',
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      coverImageUrl: item.photo_urls?.[0] ?? '',
      lat,
      lng,
      // Publishing a listing requires the owner's KYC to already be
      // verified (see PATCH /properties/{id}/publish in the docs), so
      // is_published is actually a reasonable proxy for "verified owner" —
      // availability_status was an unrelated condition that had nothing to
      // do with verification and was making almost every normal listing
      // show a "Verified" badge while ?verifiedOnly=true still returned
      // nothing. If that mismatch persists after this, the backend's
      // definition of "verified" likely isn't is_published at all — worth
      // confirming with the backend team what that flag actually checks.
      isVerified: item.is_published,
      listingCategory: item.listing_purpose === 'rent' ? 'for_rent' : 'for_sale',
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
    listingCategory: item.listingPurpose === 'rent' ? 'for_rent' : 'for_sale',
    isFavorited: item.isSaved ?? false,
    description: item.description ?? undefined,
    photoUrls: item.photoUrls ?? [],
    videoUrls: item.videoUrls ?? [],
    features: item.features ?? [],
    propertyType: item.propertyType as PropertyType,
    trustScore: item.trustSummary ? Number(item.trustSummary.trust_score) : 0,
    waterScore: item.trustSummary ? Number(item.trustSummary.water_rating) : undefined,
    powerScore: item.trustSummary ? Number(item.trustSummary.electricity_rating) : undefined,
    securityScore: item.trustSummary ? Number(item.trustSummary.security_rating) : undefined,
    roadScore: item.trustSummary ? Number(item.trustSummary.road_accessiblity_rating) : undefined,
    ownerId: item.ownerId,
    owner: item.owner
      ? {
          name: `${item.owner.firstName} ${item.owner.lastName}`.trim(),
          // The API's example response has `memberSince: true` (looks like a
          // backend bug — a join-date field returning a boolean). Guard
          // against that rather than displaying "true" as a date.
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

// AmenitiesGrid's icon map keys on specific display labels ("24/7 Power",
// "Water Supply", etc). The real API's `features` array is freeform strings
// set by whoever created the listing — seed data uses simple lowercase keys
// like "water_supply", "security", "generator", "parking". This maps the
// ones we know about; anything else falls through to a title-cased version
// of the raw string rather than silently dropping it.
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

/** Display-formatted shape for teammate's PropertyCard / RecommendedPropertyCard / SearchResultCard. */
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

// The FilterBottomSheet's UI options don't line up 1:1 with the API's actual
// enum/param shapes — mapped as closely as possible, with the mismatches
// called out inline rather than silently guessed at.

const PROPERTY_TYPE_FILTER_MAP: Partial<Record<string, string>> = {
  // "Flats" and "Self-Contain" in the UI are broader than any single API
  // enum value (self_contained, one_bedroom_flat, two_bedroom_flat,
  // three_bedroom_flat, single_room, shared_apartment all exist separately),
  // so they're left unmapped — "All" behavior (no filter) rather than a
  // wrong guess.
  Duplex: 'duplex',
  Bungalow: 'bungalow',
};

// UI amenity labels -> the lowercase snake_case values the API's `features`
// examples use (e.g. "water_supply", "generator", "security", "parking").
// "Pop Ceiling" / "Kitchen Cabinets" have no precedent in the example data —
// best-effort snake_case guesses.
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
  // "5+" / "4+" -> API has no ">=" operator on these params (exact-match
  // integer only per the swagger doc), so this sends the base number as
  // the closest available approximation rather than silently dropping the
  // filter. Worth a follow-up with the backend team if a real "or more"
  // filter is needed.
  return parseInt(option, 10);
}

/** Maps the FilterBottomSheet's UI filter state onto real /properties query params. */
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
