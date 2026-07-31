
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPaginatedList<T> extends ApiEnvelope<T[]> {
  pagination: ApiPagination;
}


export interface ApiUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: 'tenant' | 'agent' | 'landlord' | null;
  googleId: string | null;
  avatarUrl: string | null;
  referralCode: string | null;
  isPremium: boolean;
  premiumUntil: string | null;
  isBlacklisted: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface ApiPropertyListItem {
  id: string;
  owner_id: string;
  listing_title: string;
  description: string | null;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  address: string;
  location?: string;
  video_urls: string[] | null;
  photo_urls: string[] | null;
  flag_count: number;
  availability_status: 'available' | 'taken' | 'under_review';
  is_published: boolean;
  created_at: string;
  updated_at: string;
  features: string[] | null;
  listing_purpose: 'rent' | 'sale';
  water_score?: string;
  power_score?: string;
  security_score?: string;
  trust_score: string;
  is_saved?: boolean;
}

export interface ApiPropertyDetail {
  id: string;
  ownerId: string;
  listingTitle: string;
  listingPurpose: 'rent' | 'sale';
  description: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  address: string;
  location: { x: number; y: number };
  videoUrls: string[] | null;
  photoUrls: string[] | null;
  features: string[] | null;
  flagCount: number;
  availabilityStatus: 'available' | 'taken' | 'under_review';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  trustSummary?: {
    review_count: string;
    water_rating: string;
    electricity_rating: string;
    security_rating: string;
    road_accessiblity_rating: string;
    cleanliness_rating: string;
    trust_score: string;
  };
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    memberSince: boolean | string;
    contact: { phone: string; email: string };
  };
  trekCheck?: { type: string; name: string; distance_metres: number }[];
}

export interface ApiInquiry {
  id: string;
  propertyId: string;
  tenantId: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
}

export interface ApiPropertySearchParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyType?: string;
  listingPurpose?: 'rent' | 'sale';
  bedrooms?: number;
  bathrooms?: number;
  features?: string;
  verifiedOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}


export interface ApiSubscriptionInit {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface ApiSubscriptionStatus {
  isPremium: boolean;
  premiumUntil: string | null;
  hasActiveSubscription: boolean;
}
