import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import type { KYCSubmission } from './pages/KYCVerification/KYCVerification';
import HomeDashboard from './pages/HomeDashboard/HomeDashboard';
import Search from './pages/Search/Search';
import PropertyListing from './pages/PropertyListing/PropertyListing';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails';
import VideoWalkthrough from './pages/VideoWalkthrough/VideoWalkthrough';
import EnterCardDetails from './pages/EnterCardDetails/EnterCardDetails';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';

import {
  mockProperty,
  mockRatingBreakdown,
  mockReviews,
  mockPaymentSteps,
  mockContactMethods,
  mockUserProfile,
  mockSettingsSections,
  mockReportConfirmation,
} from './data/mockData';

import type { Amenity, Property, ReportReason } from './types';

import * as authApi from './api/auth';
import { useProperty } from './hooks/useProperty';
import { listProperties, listSavedProperties, reportProperty, unsaveProperty } from './api/properties';
import { apiPropertyToProperty } from './api/adapters';
import { listAmenities } from './api/amenities';
import { getMyStats, uploadAvatar } from './api/auth';
import { initSubscription } from './api/payments';
import { verifyNin, verifyCac } from './api/kyc';
import { useAuth } from './context/AuthContext';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-muted">Loading…</p>
    </div>
  );
}

function NotFoundScreen({ message, onBack }: { message?: string | null; onBack: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
      <p className="text-sm text-error-600">{message ?? 'Property not found'}</p>
      <button onClick={onBack} className="rounded-xl border border-border-light px-4 py-2 text-sm font-medium">
        Go back
      </button>
    </div>
  );
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listProperties({ limit: 20 }), listAmenities()])
      .then(([propsRes, amenitiesRes]) => {
        if (cancelled) return;
        setProperties(propsRes.data.map(apiPropertyToProperty));
        setAmenities(amenitiesRes);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load map data', err);
        setError(err instanceof Error ? err.message : 'Failed to load map data');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error) return <NotFoundScreen message={error} onBack={() => navigate(-1)} />;
  if (properties.length === 0) {
    return <NotFoundScreen message="No properties to show on the map yet" onBack={() => navigate(-1)} />;
  }

  const [centerProperty, ...nearbyProperties] = properties;

  return (
    <InteractiveMapScreen
      centerProperty={centerProperty}
      nearbyProperties={nearbyProperties}
      amenities={amenities}
      onBack={() => navigate(-1)}
      onViewDetails={(id) => navigate(`/reviews/${id}`)}
    />
  );
}

function SavedRoute() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listSavedProperties()
      .then((items) => {
        if (!cancelled) setProperties(items.map((item) => apiPropertyToProperty(item.property)));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load saved properties', err);
        setError(err instanceof Error ? err.message : 'Failed to load saved properties');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error) return <NotFoundScreen message={error} onBack={() => navigate(-1)} />;

  return (
    <SavedPropertiesScreen
      properties={properties}
      onBack={() => navigate(-1)}
      onToggleFavorite={async (id) => {
        // Everything on this screen is, by definition, already saved —
        // toggling here always means "remove from saved."
        const removed = properties.find((p) => p.id === id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
        try {
          await unsaveProperty(id);
        } catch (err) {
          console.error('Failed to unsave property', err);
          if (removed) setProperties((prev) => [...prev, removed]);
        }
      }}
      onSelectProperty={(id) => navigate(`/reviews/${id}`)}
      onNavigateTab={(tab) => navigate(NAV_TAB_PATHS[tab] ?? `/${tab}`)}
    />
  );
}

function ReviewsRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, isLoading, error } = useProperty(id);

  if (isLoading) return <LoadingScreen />;
  if (error || !property) return <NotFoundScreen message={error} onBack={() => navigate(-1)} />;

  return (
    <ReviewsScreen
      property={property}
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
  const { property, isLoading, error } = useProperty(id);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (isLoading) return <LoadingScreen />;
  if (error || !property) return <NotFoundScreen message={error} onBack={() => navigate(-1)} />;

  return (
    <>
      {paymentError && (
        <p className="fixed inset-x-0 top-0 z-50 bg-error-600 px-4 py-2 text-center text-sm text-white">
          {paymentError}
        </p>
      )}
      <UnlockContactScreen
        property={property}
        onBack={() => navigate(-1)}
        onConfirmPayment={async () => {
          // This previously just navigated to the processing screen without
          // ever calling the real payment API — a fake "unlock" that
          // charged nobody and unlocked nothing. Now it actually starts the
          // real subscription and sends the browser to Paystack's checkout,
          // same as the other unlock flow (EnterCardDetailsRoute) does.
          try {
            const { authorization_url } = await initSubscription();
            window.location.href = authorization_url;
          } catch (e) {
            setPaymentError(e instanceof Error ? e.message : 'Failed to start payment — try again');
          }
        }}
      />
    </>
  );
}

function ProcessingRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, isLoading, error } = useProperty(id);

  if (isLoading) return <LoadingScreen />;
  if (error || !property) return <NotFoundScreen message={error} onBack={() => navigate(-1)} />;

  // NOTE: this route is currently unreachable — UnlockRoute now redirects
  // straight to Paystack's checkout instead of routing through here first
  // (see the payment fix in UnlockRoute above). Left in place in case you
  // want to reintroduce a "processing" step between confirming and the
  // Paystack redirect, but nothing navigates to /processing/:id right now.
  return <ProcessingPaymentScreen property={property} steps={mockPaymentSteps} onBack={() => navigate(-1)} />;
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
  const { property, isLoading, error } = useProperty(id);

  if (isLoading) return <LoadingScreen />;
  if (error || !property) return <NotFoundScreen message={error} onBack={() => navigate(-1)} />;

  return (
    <ReportPropertyScreen
      property={property}
      onBack={() => navigate(-1)}
      onSubmit={async (reason: ReportReason, description, files) => {
        const formData = new FormData();
        formData.set('reason', reason);
        if (description) formData.set('description', description);
        files.forEach((file) => formData.append('evidence', file));
        await reportProperty(property.id, formData);
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
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState<{ savedProperties: number; viewedProperties: number; inquiriesMade: number } | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useState(() => {
    if (user) getMyStats().then(setStats).catch(() => setStats(null));
  });

  async function handleAvatarSelected(file: File) {
    setAvatarError(null);
    try {
      const updatedUser = await uploadAvatar(file);
      setUser(updatedUser);
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : 'Failed to upload photo — try again');
    }
  }

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
        avatarUrl: user.avatarUrl,
        isVerified: user.isPremium,
        savedPropertiesCount: stats?.savedProperties ?? 0,
        viewedPropertiesCount: stats?.viewedProperties ?? 0,
        inquiriesCount: stats?.inquiriesMade ?? 0,
      }
    : mockUserProfile;

  return (
    <>
      {avatarError && (
        <p className="fixed inset-x-0 top-0 z-50 bg-error-600 px-4 py-2 text-center text-sm text-white">
          {avatarError}
        </p>
      )}
      <ProfileScreen
        user={profile}
        onAvatarSelected={handleAvatarSelected}
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
    </>
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
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  return (
    <ChooseUserType
      onBack={() => navigate(-1)}
      error={error}
      onContinue={async ({ role, firstName, lastName, phone }: ChooseUserTypeSubmission) => {
        setError(null);
        try {
          const updatedUser = await authApi.completeProfile({ firstName, lastName, phone, role });
          // Without this, the app kept showing stale/blank profile data
          // until the next full login — completeProfile's response was
          // being discarded instead of updating the in-memory user.
          setUser(updatedUser);
          navigate(role === 'tenant' ? '/home' : '/kyc-verification');
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to save your profile — try again');
        }
      }}
    />
  );
}

function KYCVerificationRoute() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  return (
    <KYCVerification
      onBack={() => navigate('/choose-user-type')}
      error={error}
      onContinue={async (submission: KYCSubmission) => {
        setError(null);
        try {
          const result =
            submission.type === 'individual'
              ? await verifyNin({
                  firstName: submission.firstName,
                  lastName: submission.lastName,
                  dateOfBirth: submission.dateOfBirth,
                  ninNumber: submission.ninNumber,
                })
              : await verifyCac({
                  companyName: submission.companyName,
                  rcNumber: submission.rcNumber,
                });

          if (result.status === 'rejected') {
            setError('Verification was rejected — double-check your details and try again.');
            return;
          }
          if (result.status === 'review_needed') {
            // Backend couldn't auto-verify; an admin resolves it later via
            // PATCH /admin/kyc/{id}/resolve. Nothing more the user can do
            // here — let them into the app and they can check status later.
            navigate('/home');
            return;
          }
          navigate('/home');
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Verification failed — try again');
        }
      }}
    />
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
