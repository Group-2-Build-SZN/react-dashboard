import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

import { UnlockContactScreen } from './screens/unclockContactScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { InteractiveMapScreen } from './screens/InteractiveMap';
import { ProcessingPaymentScreen } from './screens/ProcessingPaymentScreen';
import { ContactUsScreen } from './screens/ContactUsScreen';
import { SavedPropertiesScreen } from './screens/SavedPropertiesScreen';
import { ReportPropertyScreen } from './screens/ReportPropertyScreen';
import { ReportSuccessScreen } from './screens/ReportSuccessScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

import {
  mockProperty,
  mockNearbyProperties,
  mockAmenities,
  mockRatingBreakdown,
  mockReviews,
  mockPaymentSteps,
  mockContactMethods,
  mockSavedProperties,
  mockUserProfile,
  mockSettingsSections,
  mockReportConfirmation,
} from './data/mockData';

import type { PaymentMethod, Property, ReportReason } from './types';


const ALL_PROPERTIES: Property[] = [mockProperty, ...mockNearbyProperties, ...mockSavedProperties];

function findPropertyById(id: string | undefined): Property | undefined {
  return ALL_PROPERTIES.find((p) => p.id === id) ?? (id ? undefined : mockProperty);
}

function MapRoute() {
  const navigate = useNavigate();
  return (
    <InteractiveMapScreen
      centerProperty={mockProperty}
      nearbyProperties={mockNearbyProperties}
      amenities={mockAmenities}
      onBack={() => navigate(-1)}
      onViewDetails={(id) => navigate(`/reviews/${id}`)}
    />
  );
}

function SavedRoute() {
  const navigate = useNavigate();
  return (
    <SavedPropertiesScreen
      properties={mockSavedProperties}
      onBack={() => navigate(-1)}
      onToggleFavorite={(id) => console.log('toggle favorite', id)}
      onSelectProperty={(id) => navigate(`/reviews/${id}`)}
    />
  );
}

function ReviewsRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = findPropertyById(id);

  return (
    <ReviewsScreen
      property={property as Property}
      overallRating={4.6}
      reviewCount={128}
      breakdown={mockRatingBreakdown}
      reviews={mockReviews}
      onBack={() => navigate(-1)}
      onUnlockContact={() => navigate(`/unlock/${id}`)}
      onWriteReview={() => console.log('open write-review form for', id)}
    />
  );
}

function UnlockRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = findPropertyById(id);
  const [, setSelectedMethod] = useState<PaymentMethod | null>(null);

  return (
    <UnlockContactScreen
      property={property as Property}
      onBack={() => navigate(-1)}
      onConfirmPayment={async (method) => {
        setSelectedMethod(method);

        navigate(`/processing/${id}`);
      }}
    />
  );
}

function ProcessingRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = findPropertyById(id);

  return (
    <ProcessingPaymentScreen
      property={property as Property}
      steps={mockPaymentSteps}
      onBack={() => navigate(-1)}
    />
  );
}

function ContactRoute() {
  const navigate = useNavigate();
  return (
    <ContactUsScreen
      heroImageUrl={mockProperty.coverImageUrl}
      methods={mockContactMethods}
      onBack={() => navigate(-1)}
      onSelectMethod={(method) => {
        if (method.type === 'call') window.location.href = `tel:${method.detail.replace(/\s/g, '')}`;
        if (method.type === 'email') window.location.href = `mailto:${method.detail}`;
        // chat / office: wire to your own handlers as those flows get built
      }}
    />
  );
}

function ReportRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = findPropertyById(id);

  return (
    <ReportPropertyScreen
      property={property as Property}
      onBack={() => navigate(-1)}
      onSubmit={async (reason: ReportReason, description, files) => {
        console.log('Report submitted', { propertyId: id, reason, description, fileCount: files.length });
        await new Promise((r) => setTimeout(r, 800));
        navigate('/report-success');
      }}
    />
  );
}

function ReportSuccessRoute() {
  const navigate = useNavigate();
  return (
    <ReportSuccessScreen
      confirmation={mockReportConfirmation}
      onBackToHome={() => navigate('/map')}
    />
  );
}

function ProfileRoute() {
  const navigate = useNavigate();
  return (
    <ProfileScreen
      user={mockUserProfile}
      onEditAvatar={() => console.log('open avatar editor')}
      onOpenSettings={() => navigate('/settings')}
      onNavigate={(destination) => {
        if (destination === 'saved') navigate('/saved');
        // wire other destinations (inquiries, payment_methods, refer, help) as those screens get built
      }}
      onLogout={() => console.log('log out user')}
    />
  );
}

function SettingsRoute() {
  const navigate = useNavigate();
  return (
    <SettingsScreen
      sections={mockSettingsSections}
      onBack={() => navigate(-1)}
      onSelectItem={(itemId) => console.log('open setting', itemId)}
      onLogout={() => console.log('log out')}
      onDeleteAccount={() => console.log('delete account requested')}
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/map" element={<MapRoute />} />
      <Route path="/saved" element={<SavedRoute />} />
      <Route path="/reviews/:id" element={<ReviewsRoute />} />
      <Route path="/unlock/:id" element={<UnlockRoute />} />
      <Route path="/processing/:id" element={<ProcessingRoute />} />
      <Route path="/contact" element={<ContactRoute />} />
      <Route path="/report/:id" element={<ReportRoute />} />
      <Route path="/report-success" element={<ReportSuccessRoute />} />
      <Route path="/profile" element={<ProfileRoute />} />
      <Route path="/settings" element={<SettingsRoute />} />
      <Route path="*" element={<Navigate to="/map" replace />} />
    </Routes>
  );
}