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
    description?: string;
    photoUrls: string[];
    videoUrls: string[];
    features: string[];
    propertyType: PropertyType;
    trustScore: number;
    waterScore?: number;
    powerScore?: number;
    securityScore?: number;
    roadScore?: number;
    ownerId: string;
    owner?: {
        name: string;
        memberSince: string;
        isVerified: boolean;
        phone?: string;
        email?: string;
    };
}

export type AmenityType = 'school' | 'hospital' | 'market' | 'filling_station' | 'shop' | 'town_center';

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
    | 'scam_or_fraud'
    | 'misleading_information'
    | 'inappropriate_content'
    | 'already_rented_or_sold'
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
    avatarUrl: string | null;
    isVerified: boolean;
    savedPropertiesCount: number;
    viewedPropertiesCount: number;
    inquiriesCount: number;
}
export interface SettingsItem {
    id: string;
    label: string;
    value?: string;
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