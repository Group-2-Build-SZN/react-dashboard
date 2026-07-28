export type PropertyType =
    | 'self_contained'
    | 'single_room'
    | 'one_bedroom_flat'
    | 'two_bedroom_flat'
    | 'three_bedroom_flat'
    | 'duplex'
    | 'bungalow'
    | 'shared_apartment';

export type ListingCategory = 'for_rent' | 'for_sale';

export interface Property {
    id: string;
    listingTitle: string;
    address: string;
    neighborhood: string;
    price: number;
    pricePeriod: 'year' | 'month';
    bedrooms: number;
    bathrooms: number;
    areaSqm?: number;
    coverImageUrl: string;
    lat: number;
    lng: number;
    isVerified: boolean;
    listingCategory: ListingCategory;
    isFavorited: boolean;
    // --- extended for the merged app (from the real API, not in the original mock) ---
    description?: string;
    photoUrls: string[];
    videoUrls: string[];
    features: string[];
    propertyType: PropertyType;
    trustScore: number; // 0-100 raw score from the API
    waterScore?: number;
    powerScore?: number;
    securityScore?: number;
    roadScore?: number;
    ownerId: string;
    // Only populated from GET /properties/{id} (list endpoints don't include
    // owner details) — undefined until the detail screens fetch by id.
    owner?: {
        name: string;
        memberSince: string;
        isVerified: boolean;
        phone?: string;
        email?: string;
    };
}

export type AmenityType = 'school' | 'hospital' | 'market' | 'filling_station';

export interface Amenity {
    id: string;
    name: string;
    type: AmenityType;
    lat: number;
    lng: number;
}

export interface RatingBreakdown {
    water: number;
    electricity: number;
    security: number;
    amenityAccessibility: number;
}

export type ReviewType = 'verified_resident' | 'community_tip';

export interface Review {
    id: string;
    reviewerName: string;
    reviewerAvatarUrl?: string;
    reviewType: ReviewType;
    overallRating: number;
    createdAt: string;
    text: string;
    tags?: { label: string; sentiment: 'good' | 'neutral' | 'bad' }[];
}

export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd';

export const UNLOCK_FEE_NGN = 7500;

export type PaymentStepStatus = 'complete' | 'active' | 'pending';

export interface PaymentStep {
    id: string;
    title: string;
    subtitle: string;
    status: PaymentStepStatus;
}

export type ContactMethodType = 'call' | 'email' | 'chat' | 'office';

export interface ContactMethod {
    id: string;
    type: ContactMethodType;
    title: string;
    detail: string;
    isOnline?: boolean;
}
export type ReportReason =
    | 'fake_listing'
    | 'wrong_photos'
    | 'agent_unresponsive'
    | 'price_mismatch'
    | 'already_taken'
    | 'scam_suspected'
    | 'other';

export interface ReportSubmission {
    propertyId: string;
    reason: ReportReason;
    description?: string;
    evidenceFiles: File[];
}

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string;
    isVerified: boolean;
    savedPropertiesCount: number;
    viewedPropertiesCount: number;
    inquiriesCount: number;
}
export interface SettingsItem {
    id: string;
    label: string;
    value?: string; // e.g. "English", "NGN", "v1.0.0" — shown right-aligned
}

export interface SettingsSection {
    id: string;
    title: string;
    items: SettingsItem[];
}
export interface ReportConfirmation {
    reportId: string;
    submittedAt: string;
}