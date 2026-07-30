import type {
    Property,
    Amenity,
    RatingBreakdown,
    Review,
    PaymentStep,
    ContactMethod,
    UserProfile,
    SettingsSection,
    ReportConfirmation,
} from '../types';

export const mockProperty: Property = {
    id: '1',
    listingTitle: '2 Bedroom Apartment in Lekki',
    address: 'Lekki Phase 1, Lagos',
    neighborhood: 'Lekki Phase 1',
    price: 2_500_000,
    pricePeriod: 'year',
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 120,
    lat: 6.4474,
    lng: 3.4729,
    coverImageUrl: 'https://picsum.photos/300/200',
    isVerified: true,
    listingCategory: 'for_rent',
    isFavorited: false,
};

export const mockNearbyProperties: Property[] = [
    {
        ...mockProperty,
        id: '2',
        price: 1_800_000,
        lat: 6.448,
        lng: 3.47,
        listingTitle: 'Mini Flat in Lekki',
    },
];

export const mockAmenities: Amenity[] = [
    { id: 'a1', name: 'General Hospital', type: 'hospital', lat: 6.447, lng: 3.473 },
    { id: 'a2', name: 'Lekki Market', type: 'market', lat: 6.449, lng: 3.471 },
];

export const mockRatingBreakdown: RatingBreakdown = {
    water: 4.5,
    security: 4.8,
    electricity: 4.6,
    amenityAccessibility: 4.2,
};

export const mockReviews: Review[] = [
    {
        id: 'r1',
        reviewerName: 'John Doe',
        reviewerAvatarUrl: '',
        reviewType: 'verified_resident',
        createdAt: '2 weeks ago',
        overallRating: 4.5,
        text: 'Great place to stay, very secure and clean.',
        tags: [
            { label: 'Secure', sentiment: 'good' },
            { label: 'Clean', sentiment: 'good' },
        ],
    },
];

export const mockPaymentSteps: PaymentStep[] = [
    { id: 'payment_initiated', title: 'Payment Initiated', subtitle: 'Securely connecting to Paystack', status: 'complete' },
    { id: 'verifying_card', title: 'Verifying Card Details', subtitle: 'Verifying your card information', status: 'complete' },
    { id: 'processing', title: 'Processing Payments', subtitle: "Please don't close this screen", status: 'active' },
    { id: 'authorizing', title: 'Authorizing Payments', subtitle: 'Connecting your bank for approval', status: 'pending' },
    { id: 'finalizing', title: 'Finalizing', subtitle: 'Completing your transaction', status: 'pending' },
];

export const mockContactMethods: ContactMethod[] = [
    { id: 'call', type: 'call', title: 'Call Us', detail: '+234 801 234 5678' },
    { id: 'email', type: 'email', title: 'Email Us', detail: 'hello@myulo.com' },
    { id: 'chat', type: 'chat', title: 'Live Chat', detail: 'Chat with our support team', isOnline: true },
    { id: 'office', type: 'office', title: 'Visit Our Office', detail: 'No. 12 Park Avenue, Enugu, Enugu State' },
];

export const mockSavedProperties: Property[] = [
    { ...mockProperty, id: 'saved_1', listingTitle: '4 Bedroom Duplex', neighborhood: 'New Haven, Enugu', price: 2_500_000, listingCategory: 'for_rent', isFavorited: true },
    { ...mockProperty, id: 'saved_2', listingTitle: '3 Bedroom Bungalow', neighborhood: 'G.R.A, Enugu', price: 1_800_000, listingCategory: 'for_rent', isFavorited: true },
    { ...mockProperty, id: 'saved_3', listingTitle: 'Luxury Pool Villa', neighborhood: 'Independence Layout, Enugu', price: 45_000_000, pricePeriod: 'year', listingCategory: 'for_sale', isFavorited: false },
];

export const mockUserProfile: UserProfile = {
    id: 'user_1',
    fullName: 'Chinedu Okafor',
    email: 'chinedu.okafor@gmail.com',
    phone: '+234 801 234 5678',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isVerified: true,
    savedPropertiesCount: 6,
    viewedPropertiesCount: 24,
    inquiriesCount: 3,
};

export const mockSettingsSections: SettingsSection[] = [
    {
        id: 'general',
        title: 'General',
        items: [
            { id: 'notifications', label: 'Notifications' },
            { id: 'privacy_security', label: 'Privacy & Security' },
            { id: 'language', label: 'Language', value: 'English' },
            { id: 'currency', label: 'Currency', value: 'NGN' },
        ],
    },
    {
        id: 'preferences',
        title: 'Preferences',
        items: [
            { id: 'search_preferences', label: 'Search Preferences' },
            { id: 'map_preferences', label: 'Map Preferences' },
            { id: 'saved_filters', label: 'Saved Filters' },
        ],
    },
    {
        id: 'support',
        title: 'Support',
        items: [
            { id: 'help_center', label: 'Help Center' },
            { id: 'terms', label: 'Terms & Conditions' },
            { id: 'about', label: 'About My Ulo', value: 'v1.0.0' },
        ],
    },
];

export const mockReportConfirmation: ReportConfirmation = {
    reportId: '#MU-2026-05-21-12847',
    submittedAt: new Date().toISOString(),
};