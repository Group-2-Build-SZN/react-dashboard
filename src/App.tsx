import { Routes, Route, Navigate, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  mockPaymentSteps,
  mockContactMethods,
  mockUserProfile,
  mockSettingsSections,
  mockReportConfirmation,
} from './data/mockData';

import type { Amenity, Property, ReportReason } from './types';

import * as authApi from './api/auth';
import { useProperty } from './hooks/useProperty';
import { useReviews } from './hooks/useReviews';
import { listProperties, listSavedProperties, reportProperty, unsaveProperty } from './api/properties';
import { apiPropertyToProperty } from './api/adapters';
import { listAmenities } from './api/amenities';
import { getMyStats, uploadAvatar } from './api/auth';
import { initSubscription, getSubscriptionStatus } from './api/payments';
import { verifyNin, verifyCac, getKycStatus } from './api/kyc';
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
  const {
    reviews,
    breakdown,
    overallRating,
    reviewCount,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useReviews(id);

  if (isLoading || reviewsLoading) return <LoadingScreen />;
  if (error || !property) return <NotFoundScreen message={error} onBack={() => navigate(-1)} />;

  if (reviewsError) console.error('Failed to load reviews', reviewsError);

  return (
    <ReviewsScreen
      property={property}
      overallRating={overallRating}
      reviewCount={reviewCount}
      breakdown={breakdown}
      reviews={reviews}
      onBack={() => navigate(-1)}
      onUnlockContact={() => navigate(`/unlock/${id}`)}
      onWriteReview={() => console.log('open write-review form for', id)}
      onReviewSubmitted={refetchReviews}
    />
  );
}

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
          try {
            const { authorization_url } = await initSubscription();
            sessionStorage.setItem('myulo:postPaymentPropertyId', property.id);
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
        if (method.type === 'chat') {
          const whatsappNumber = mockContactMethods
            .find((m) => m.type === 'call')
            ?.detail.replace(/[^\d]/g, '')
            .replace(/^0/, '234');
          window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer');
        }
        if (method.type === 'office') {
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(method.detail)}`,
            '_blank',
            'noopener,noreferrer'
          );
        }
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
        const result = await reportProperty(property.id, formData);
        navigate('/report-success', { state: { referenceId: result.referenceId } });
      }}
    />
  );
}

function ReportSuccessRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const referenceId = (location.state as { referenceId?: string } | null)?.referenceId;
  return (
    <ReportSuccessScreen
      confirmation={{
        reportId: referenceId ?? mockReportConfirmation.reportId,
        submittedAt: new Date().toISOString(),
      }}
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


function SplashRoute() {
  const navigate = useNavigate();
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
          setUser(updatedUser);
          navigate('/kyc-verification');
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to save your profile — try again');
        }
      }}
    />
  );
}

function KYCVerificationRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Tenants verify via NIN (individual); landlords/agents via CAC (business).
  // Not a user choice — determined by the role picked on the previous screen.
  const lockedType = user?.role === 'tenant' ? 'individual' : 'business';

  useEffect(() => {
    let cancelled = false;
    getKycStatus()
      .then((record) => {
        if (cancelled) return;
        if (record.status === 'verified' || record.status === 'review_needed') {
          navigate('/home', { replace: true });
          return;
        }
        setIsChecking(false);
      })
      .catch(() => {
        if (!cancelled) setIsChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (isChecking) return <LoadingScreen />;

  return (
    <KYCVerification
      onBack={() => navigate('/choose-user-type')}
      error={error}
      lockedType={lockedType}
      onContinue={async (submission: KYCSubmission) => {
        setError(null);
        try {
          const result =
            lockedType === 'individual'
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
  const { user } = useAuth();
  return (
    <VideoWalkthrough
      propertyId={id}
      isPremium={!!user?.isPremium}
      onBack={() => navigate(`/property/${id}`)}
      onUnlockContact={(propertyId) => navigate(`/pay/${propertyId}`)}
    />
  );
}

function EnterCardDetailsRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  return (
    <>
      {paymentError && (
        <p className="fixed inset-x-0 top-0 z-50 bg-error-600 px-4 py-2 text-center text-sm text-white">
          {paymentError}
        </p>
      )}
      <EnterCardDetails
        propertyId={id}
        onBack={() => navigate(`/video/${id}`)}
        onPaymentSuccess={async (propertyId) => {
          setPaymentError(null);
          try {
            const { authorization_url } = await initSubscription();
            sessionStorage.setItem('myulo:postPaymentPropertyId', propertyId);
            window.location.href = authorization_url;
          } catch (e) {
            console.error('Failed to start subscription', e);
            setPaymentError(e instanceof Error ? e.message : 'Failed to start payment — try again');
          }
        }}
      />
    </>
  );
}

function PaymentCallbackRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'checking' | 'pending' | 'failed'>('checking');
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const propertyId = sessionStorage.getItem('myulo:postPaymentPropertyId');

  useEffect(() => {
    let cancelled = false;

    async function confirm() {
      if (!reference) {
        if (!cancelled) setStatus('failed');
        return;
      }

      for (let attempt = 0; attempt < 5; attempt++) {
        if (cancelled) return;
        try {
          const subscription = await getSubscriptionStatus();
          if (subscription.isPremium) {
            const freshUser = await authApi.getMe();
            if (cancelled) return;
            setUser(freshUser);
            sessionStorage.removeItem('myulo:postPaymentPropertyId');
            navigate(propertyId ? `/payment-success/${propertyId}` : '/home', { replace: true });
            return;
          }
        } catch (e) {
          console.error('Failed to check subscription status', e);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (!cancelled) setStatus('pending');
    }

    confirm();
    return () => {
      cancelled = true;
    };
  }, [reference, propertyId, navigate, setUser]);

  if (status === 'pending') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <p className="text-sm text-gray-500">
          Still confirming your payment — this can take a little longer for some methods. Check
          your account in a few minutes, or try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl border border-border-light px-4 py-2 text-sm font-medium"
        >
          Check again
        </button>
        <button onClick={() => navigate('/home')} className="text-sm text-primary-800 underline">
          Go to home
        </button>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <p className="text-sm text-error-600">
          We couldn't find a payment reference for this session. If you completed a payment on
          Paystack, it may still be processing.
        </p>
        <button onClick={() => navigate('/home')} className="rounded-xl border border-border-light px-4 py-2 text-sm font-medium">
          Go to home
        </button>
      </div>
    );
  }

  return <LoadingScreen />;
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
      {}
      <Route path="/" element={<SplashRoute />} />
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route path="/welcome" element={<WelcomeRoute />} />
      <Route path="/signup" element={<SignUpRoute />} />
      <Route path="/verify-email" element={<VerifyEmailRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/enter-code" element={<EnterCodeRoute />} />
      <Route path="/choose-user-type" element={<ChooseUserTypeRoute />} />
      <Route path="/kyc-verification" element={<KYCVerificationRoute />} />

      {}
      <Route path="/home" element={<HomeRoute />} />
      <Route path="/search" element={<SearchRoute />} />
      <Route path="/listing" element={<ListingRoute />} />
      <Route path="/property/:id" element={<PropertyDetailsRoute />} />
      <Route path="/video/:id" element={<VideoWalkthroughRoute />} />
      <Route path="/pay/:id" element={<EnterCardDetailsRoute />} />
      <Route path="/subscription/success" element={<PaymentCallbackRoute />} />
      <Route path="/payment-success/:id" element={<PaymentSuccessRoute />} />

      {}
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
