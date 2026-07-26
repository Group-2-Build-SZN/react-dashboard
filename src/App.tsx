import { useEffect, useState } from "react";

import Splash from "./pages/Splash/Splash";
import Onboarding from "./pages/Onboarding/Onboarding";
import Welcome from "./pages/Welcome/Welcome";
import SignUp from "./pages/SignUp/SignUp";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import Login from "./pages/Login/Login";
import EnterCode from "./pages/EnterCode/EnterCode";
import ChooseUserType from "./pages/ChooseUserType/ChooseUserType";
import KYCVerification from "./pages/KYCVerification/KYCVerification";
import HomeDashboard from "./pages/HomeDashboard/HomeDashboard";
import Search from "./pages/Search/Search";
import PropertyListing from "./pages/PropertyListing/PropertyListing";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import VideoWalkthrough from "./pages/VideoWalkthrough/VideoWalkthrough";
import EnterCardDetails from "./pages/EnterCardDetails/EnterCardDetails";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";

type View =
  | { screen: "splash" }
  | { screen: "onboarding" }
  | { screen: "welcome" }
  | { screen: "signup" }
  | { screen: "verify-email"; email: string }
  | { screen: "login" }
  | { screen: "enter-code" }
  | { screen: "choose-user-type" }
  | { screen: "kyc-verification" }
  | { screen: "home" }
  | { screen: "search"; query?: string }
  | { screen: "listing" }
  | { screen: "details"; propertyId: number }
  | { screen: "video"; propertyId: number }
  | { screen: "enter-card-details"; propertyId: number }
  | { screen: "payment-success"; propertyId: number };

function App() {
  const [view, setView] = useState<View>({ screen: "splash" });

  useEffect(() => {
    if (view.screen !== "splash") return;
    const timer = setTimeout(() => setView({ screen: "onboarding" }), 2000);
    return () => clearTimeout(timer);
  }, [view.screen]);

  return (
    <div className="relative mx-auto min-h-screen max-w-md overflow-x-hidden bg-white shadow-xl">
      {view.screen === "splash" && <Splash />}

      {view.screen === "onboarding" && (
        <Onboarding onComplete={() => setView({ screen: "welcome" })} />
      )}

      {view.screen === "welcome" && (
        <Welcome
          onGetStarted={() => setView({ screen: "signup" })}
          onLogIn={() => setView({ screen: "login" })}
        />
      )}

      {view.screen === "signup" && (

        <SignUp
          onBack={() => setView({ screen: "welcome" })}
          onContinueWithEmail={(email) => setView({ screen: "verify-email", email })}
          onContinueWithGoogle={() => setView({ screen: "home" })}
          onSignIn={() => setView({ screen: "login" })}
        />
      )}

      {view.screen === "verify-email" && (
        <VerifyEmail
          email={view.email || "example@gmail.com"}
          onVerified={() => setView({ screen: "choose-user-type" })}
        />
      )}

      {view.screen === "login" && (

        <Login
          onBack={() => setView({ screen: "welcome" })}
          onContinueWithEmail={() => setView({ screen: "enter-code" })}
          onContinueWithGoogle={() => setView({ screen: "home" })}
          onSignUp={() => setView({ screen: "signup" })}
        />
      )}

      {view.screen === "enter-code" && (
        <EnterCode onVerified={() => setView({ screen: "home" })} />
      )}

      {view.screen === "choose-user-type" && (
        <ChooseUserType
          onBack={() => setView({ screen: "verify-email", email: "example@gmail.com" })}
          onContinue={(role) =>
            setView(
              role === "tenant"
                ? { screen: "home" }
                : { screen: "kyc-verification" }
            )
          }
        />
      )}

      {view.screen === "kyc-verification" && (

        <KYCVerification
          onBack={() => setView({ screen: "choose-user-type" })}
          onContinue={() => setView({ screen: "home" })}
        />
      )}

      {view.screen === "home" && (
        <HomeDashboard
          onSelectProperty={(propertyId) => setView({ screen: "details", propertyId })}
          onSeeAll={() => setView({ screen: "listing" })}
          onOpenSearch={(query) => setView({ screen: "search", query })}
          onOpenFilters={() => setView({ screen: "search" })}
          onNavigate={(tab) => {
            if (tab === "explore") setView({ screen: "listing" });
          }}
        />
      )}

      {view.screen === "search" && (
        <Search
          initialQuery={view.query}
          onBack={() => setView({ screen: "home" })}
          onSelectProperty={(propertyId) => setView({ screen: "details", propertyId })}
        />
      )}

      {view.screen === "listing" && (
        <PropertyListing
          onSelectProperty={(propertyId) => setView({ screen: "details", propertyId })}
          onNavigate={(tab) => {
            if (tab === "home") setView({ screen: "home" });
          }}
        />
      )}

      {view.screen === "details" && (
        <PropertyDetails
          propertyId={view.propertyId}
          onClose={() => setView({ screen: "listing" })}
          onOpenVideo={(propertyId) => setView({ screen: "video", propertyId })}
        />
      )}

      {view.screen === "video" && (
        <VideoWalkthrough
          propertyId={view.propertyId}
          onBack={() => setView({ screen: "details", propertyId: view.propertyId })}
          onUnlockContact={(propertyId) => setView({ screen: "enter-card-details", propertyId })}
        />
      )}

      {view.screen === "enter-card-details" && (
        <EnterCardDetails
          propertyId={view.propertyId}
          onBack={() => setView({ screen: "video", propertyId: view.propertyId })}
          onPaymentSuccess={(propertyId) => setView({ screen: "payment-success", propertyId })}
        />
      )}

      {view.screen === "payment-success" && (
        <PaymentSuccess
          propertyId={view.propertyId}
          onBackToHome={() => setView({ screen: "home" })}
        />
      )}
    </div>
  );
}

export default App;
