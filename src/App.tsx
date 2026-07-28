import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

// --- your screens ---
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

// --- teammate's screens ---
import Splash from './pages/Splash/Splash';
import Onboarding from './pages/Onboarding/Onboarding';
import Welcome from './pages/Welcome/Welcome';
import SignUp from './pages/SignUp/SignUp';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import Login from './pages/Login/Login';
import EnterCode from './pages/EnterCode/EnterCode';
import ChooseUserType from './pages/ChooseUserType/ChooseUserType';
import type { ChooseUserTypeSubmission } from './pages/ChooseUserType/ChooseUserType';
import KYCVerification from './pages/KYCVerification/KYCVerification';
import HomeDashboard from './pages/HomeDashboard/HomeDashboard';
import Search from './pages/Search/Search';
import PropertyListing from './pages/PropertyListing/PropertyListing';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails';
import VideoWalkthrough from './pages/VideoWalkthrough/VideoWalkthrough';
import EnterCardDetails from './pages/EnterCardDetails/EnterCardDetails';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';

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

import * as authApi from './api/auth';
import { getMyStats } from './api/auth';
import { initSubscription } from './api/payments';
import { useAuth } from './context/AuthContext';

const ALL_PROPERTIES: Property[] = [mockProperty, ...mockNearbyProperties, ...mockSavedProperties];

function findPropertyById(id: string | undefined): Property | undefined {
  return ALL_PROPERTIES.find((p) => p.id === id) ?? (id ? undefined : mockProperty);
}

const NAV_TAB_PATHS: Record<string, string> = {
  home: '/home',
  explore: '/listing',
  map: '/map',
  saved: '/saved',
  profile: '/profile',
};

// ============================================================
// Your existing routes (unchanged behaviour)
// ============================================================

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
      onNavigateTab={(tab) => navigate(NAV_TAB_PATHS[tab] ?? `/${tab}`)}
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

// Both "unlock" flows in the app (this one, and teammate's
// EnterCardDetailsRoute below) hit the SAME backend endpoint —
// POST /payments/subscribe — because the API only has one flat
// ₦7,500/month paywall, not per-property unlocks. Confirmed with the
// project owner: keep both UIs, wire both to the same subscription call.
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

  // ProcessingPaymentScreen mocks a multi-step "processing" animation via
  // `steps`. Real payment confirmation happens async, via Paystack's redirect
  // + the /payments/webhook — this screen currently doesn't call
  // initSubscription()/redirect itself. See UnlockRoute two functions up:
  // that's where the real POST /payments/subscribe call + Paystack redirect
  // actually happens today, one step before this screen. If you want THIS
  // screen to own the redirect instead, add an onMount callback prop to
  // ProcessingPaymentScreen and call initSubscription() from it — its
  // internals weren't in scope for this pass so I didn't guess at that edit.
  return (
    <ProcessingPaymentScreen property={property as Property} steps={mockPaymentSteps} onBack={() => navigate(-1)} />
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
      }}
      onNavigateTab={(tab) => navigate(NAV_TAB_PATHS[tab] ?? `/${tab}`)}
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
  const { user } = useAuth();
  const [stats, setStats] = useState<{ savedProperties: number; viewedProperties: number; inquiriesMade: number } | null>(null);

  useState(() => {
    if (user) getMyStats().then(setStats).catch(() => setStats(null));
  });

  // Falls back to mock data only when logged out / still loading — real
  // user data (name, email, phone, verification status) is used once
  // /auth/refresh + /users/me resolve on app boot. If you're seeing mock
  // data ("Chinazor Okafor" etc.) here, it means bootstrapSession() didn't
  // find a valid refresh-token cookie — check that you're actually logged
  // in (completed the /verify-email or /enter-code step successfully).
  const profile = user
    ? {
        id: user.id,
        fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
        email: user.email,
        phone: user.phone ?? '',
        avatarUrl: user.avatarUrl ?? mockUserProfile.avatarUrl,
        isVerified: user.isPremium,
        savedPropertiesCount: stats?.savedProperties ?? 0,
        viewedPropertiesCount: stats?.viewedProperties ?? 0,
        inquiriesCount: stats?.inquiriesMade ?? 0,
      }
    : mockUserProfile;

  return (
    <ProfileScreen
      user={profile}
      onEditAvatar={() => console.log('open avatar editor')}
      onOpenSettings={() => navigate('/settings')}
      onNavigate={(destination) => {
        if (destination in NAV_TAB_PATHS) {
          navigate(NAV_TAB_PATHS[destination]);
        } else {
          // Profile menu items (inquiries, payment methods, verification,
          // refer & earn, help) don't have screens built yet — no route to
          // send them to. Logging rather than navigating to '*' → splash.
          console.log('Profile menu item not yet implemented:', destination);
        }
      }}
      onLogout={async () => {
        await authApi.logout();
        navigate('/welcome');
      }}
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
      onLogout={async () => {
        await authApi.logout();
        navigate('/welcome');
      }}
      onDeleteAccount={() => console.log('delete account requested')}
    />
  );
}

// ============================================================
// Teammate's routes, converted from local useState view-switching to
// react-router. His page components didn't need internal changes for
// this — they already took onXxx callback props, same pattern as yours.
// ============================================================

function SplashRoute() {
  const navigate = useNavigate();
  // was a setTimeout in his old App.tsx; kept the same 2s beat here.
  useState(() => {
    setTimeout(() => navigate('/onboarding'), 2000);
  });
  return <Splash />;
}

function OnboardingRoute() {
  const navigate = useNavigate();
  return <Onboarding onComplete={() => navigate('/welcome')} />;
}

function WelcomeRoute() {
  const navigate = useNavigate();
  return <Welcome onGetStarted={() => navigate('/signup')} onLogIn={() => navigate('/login')} />;
}

function SignUpRoute() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  return (
    <SignUp
      onBack={() => navigate('/welcome')}
      error={error}
      onContinueWithEmail={async (email) => {
        setError(null);
        try {
          await authApi.requestCode(email);
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to send code — try again');
        }
      }}
      onContinueWithGoogle={() => navigate('/home')}
      onSignIn={() => navigate('/login')}
    />
  );
}

function VerifyEmailRoute() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const email = new URLSearchParams(window.location.search).get('email') ?? 'example@gmail.com';
  return (
    <VerifyEmail
      email={email}
      error={error}
      onVerified={async (code) => {
        setError(null);
        try {
          const user = await authApi.verifyCode(email, code);
          setUser(user);
          navigate('/choose-user-type');
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Invalid or expired code — try again');
        }
      }}
      onResend={() =>
        authApi.requestCode(email).catch((e) => setError(e instanceof Error ? e.message : 'Failed to resend'))
      }
    />
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  return (
    <Login
      onBack={() => navigate('/welcome')}
      error={error}
      onContinueWithEmail={async (email) => {
        setError(null);
        try {
          await authApi.requestCode(email);
          navigate(`/enter-code?email=${encodeURIComponent(email)}`);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to send code — try again');
        }
      }}
      onContinueWithGoogle={() => navigate('/home')}
      onSignUp={() => navigate('/signup')}
    />
  );
}

function EnterCodeRoute() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const email = new URLSearchParams(window.location.search).get('email') ?? '';
  return (
    <EnterCode
      email={email}
      error={error}
      onVerified={async (code) => {
        setError(null);
        try {
          const user = await authApi.verifyCode(email, code);
          setUser(user);
          navigate('/home');
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Invalid or expired code — try again');
        }
      }}
      onResend={() =>
        authApi.requestCode(email).catch((e) => setError(e instanceof Error ? e.message : 'Failed to resend'))
      }
    />
  );
}

function ChooseUserTypeRoute() {
  const navigate = useNavigate();
  return (
    <ChooseUserType
      onBack={() => navigate(-1)}
      onContinue={async ({ role, firstName, lastName, phone }: ChooseUserTypeSubmission) => {
        try {
          await authApi.completeProfile({
            firstName,
            lastName,
            phone,
            role,
          });
        } catch (e) {
          console.error('Failed to complete profile', e);
        }
        navigate(role === 'tenant' ? '/home' : '/kyc-verification');
      }}
    />
  );
}

function KYCVerificationRoute() {
  const navigate = useNavigate();
  return (
    <KYCVerification onBack={() => navigate('/choose-user-type')} onContinue={() => navigate('/home')} />
  );
}

function HomeRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <HomeDashboard
      userName={user?.firstName ?? undefined}
      onSelectProperty={(propertyId) => navigate(`/property/${propertyId}`)}
      onSeeAll={() => navigate('/listing')}
      onOpenSearch={(query) => navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`)}
      onOpenFilters={() => navigate('/search')}
      onNavigate={(tab) => {
        if (tab === 'explore') navigate('/listing');
        if (tab === 'map') navigate('/map');
        if (tab === 'saved') navigate('/saved');
        if (tab === 'profile') navigate('/profile');
      }}
    />
  );
}

function SearchRoute() {
  const navigate = useNavigate();
  const initialQuery = new URLSearchParams(window.location.search).get('q') ?? undefined;
  return (
    <Search
      initialQuery={initialQuery}
      onBack={() => navigate(-1)}
      onSelectProperty={(propertyId) => navigate(`/property/${propertyId}`)}
    />
  );
}

function ListingRoute() {
  const navigate = useNavigate();
  return (
    <PropertyListing
      onSelectProperty={(id) => navigate(`/property/${id}`)}
      onBack={() => navigate(-1)}
      onNavigate={(tab) => {
        if (tab === 'home') navigate('/home');
        if (tab === 'map') navigate('/map');
        if (tab === 'saved') navigate('/saved');
        if (tab === 'profile') navigate('/profile');
      }}
    />
  );
}

// PropertyDetails / VideoWalkthrough / EnterCardDetails / PaymentSuccess are
// now wired the same way as PropertyListing/HomeDashboard/Search: real fetch
// via getProperty(id) + apiPropertyToProperty, string UUID ids throughout.
// The local data/properties.ts mock is no longer used by these four screens.

function PropertyDetailsRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <PropertyDetails
      propertyId={id}
      onClose={() => navigate('/home')}
      onOpenVideo={(propertyId) => navigate(`/video/${propertyId}`)}
      onReport={(propertyId) => navigate(`/report/${propertyId}`)}
    />
  );
}

function VideoWalkthroughRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <VideoWalkthrough
      propertyId={id}
      onBack={() => navigate(`/property/${id}`)}
      onUnlockContact={(propertyId) => navigate(`/pay/${propertyId}`)}
    />
  );
}

// See the big comment on UnlockRoute above — this is the SECOND UI that
// triggers the SAME POST /payments/subscribe call. His screen collects raw
// card fields (number/expiry/cvv), but the real backend doesn't accept a raw
// card charge at all — Paystack integration here is redirect-based: the API
// just hands back an `authorization_url` to send the browser to. So the
// entered card fields currently aren't actually sent anywhere; the button
// triggers the real subscription init and redirects to Paystack's hosted
// checkout, same as UnlockContactScreen does. Worth deciding with your
// teammate whether to keep the custom card-entry UI (as pure decoration
// before the redirect) or drop it in favor of a plain "Continue to Paystack"
// button — right now it's the former.
function EnterCardDetailsRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <EnterCardDetails
      propertyId={id}
      onBack={() => navigate(`/video/${id}`)}
      onPaymentSuccess={async (propertyId) => {
        try {
          const { authorization_url } = await initSubscription();
          window.location.href = authorization_url;
        } catch (e) {
          console.error('Failed to start subscription', e);
          navigate(`/payment-success/${propertyId}`);
        }
      }}
    />
  );
}

function PaymentSuccessRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <PaymentSuccess
      propertyId={id}
      onBackToHome={() => navigate('/home')}
      onContactUs={() => navigate('/contact')}
    />
  );
}

export default function App() {
  return (
    <Routes>
      {/* Onboarding / auth (teammate) */}
      <Route path="/" element={<SplashRoute />} />
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route path="/welcome" element={<WelcomeRoute />} />
      <Route path="/signup" element={<SignUpRoute />} />
      <Route path="/verify-email" element={<VerifyEmailRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/enter-code" element={<EnterCodeRoute />} />
      <Route path="/choose-user-type" element={<ChooseUserTypeRoute />} />
      <Route path="/kyc-verification" element={<KYCVerificationRoute />} />

      {/* Browse (teammate) */}
      <Route path="/home" element={<HomeRoute />} />
      <Route path="/search" element={<SearchRoute />} />
      <Route path="/listing" element={<ListingRoute />} />
      <Route path="/property/:id" element={<PropertyDetailsRoute />} />
      <Route path="/video/:id" element={<VideoWalkthroughRoute />} />
      <Route path="/pay/:id" element={<EnterCardDetailsRoute />} />
      <Route path="/payment-success/:id" element={<PaymentSuccessRoute />} />

      {/* Map / reviews / unlock-contact / account (yours) */}
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
