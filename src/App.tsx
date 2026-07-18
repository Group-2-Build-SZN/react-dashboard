import { useEffect, useState } from "react";

import Splash from "./pages/Splash/Splash";
import Onboarding from "./pages/Onboarding/Onboarding";
import Welcome from "./pages/Welcome/Welcome";
import SignUp from "./pages/SignUp/SignUp";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import Login from "./pages/Login/Login";
import EnterCode from "./pages/EnterCode/EnterCode";
import PropertyListing from "./pages/PropertyListing/PropertyListing";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import VideoWalkthrough from "./pages/VideoWalkthrough/VideoWalkthrough";

type View =
  | { screen: "splash" }
  | { screen: "onboarding" }
  | { screen: "welcome" }
  | { screen: "signup" }
  | { screen: "verify-email"; email: string }
  | { screen: "login" }
  | { screen: "enter-code" }
  | { screen: "listing" }
  | { screen: "details"; propertyId: number }
  | { screen: "video"; propertyId: number };

function App() {
  const [view, setView] = useState<View>({ screen: "splash" });

  // Splash auto-advances into Onboarding after 2s
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
        // Continue with Google falls through to listing for now — will
        // repoint once that flow is defined.
        <SignUp
          onBack={() => setView({ screen: "welcome" })}
          onContinueWithEmail={(email) => setView({ screen: "verify-email", email })}
          onContinueWithGoogle={() => setView({ screen: "listing" })}
          onSignIn={() => setView({ screen: "login" })}
        />
      )}

      {view.screen === "verify-email" && (
        <VerifyEmail
          email={view.email || "example@gmail.com"}
          onVerified={() => setView({ screen: "listing" })}
        />
      )}

      {view.screen === "login" && (
        // Continue with Google falls through to the listing screen for now.
        <Login
          onBack={() => setView({ screen: "welcome" })}
          onContinueWithEmail={() => setView({ screen: "enter-code" })}
          onContinueWithGoogle={() => setView({ screen: "listing" })}
          onSignUp={() => setView({ screen: "signup" })}
        />
      )}

      {view.screen === "enter-code" && (
        <EnterCode onVerified={() => setView({ screen: "listing" })} />
      )}

      {view.screen === "listing" && (
        <PropertyListing
          onSelectProperty={(propertyId) => setView({ screen: "details", propertyId })}
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
        />
      )}
    </div>
  );
}

export default App;
