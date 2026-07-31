import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { getSubscriptionStatus } from "../../api/payments";
import { getMe } from "../../api/auth";
import { useAuth } from "../lib/AuthContext";

const POLL_ATTEMPTS = 5;
const POLL_DELAY_MS = 2000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RETURN_KEY = "myulo:postPaymentReturnTo";

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<"checking" | "success" | "pending" | "failed">("checking");

  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const returnTo = sessionStorage.getItem(RETURN_KEY);

  useEffect(() => {
    let cancelled = false;

    async function confirm() {
      if (!reference) {
        if (!cancelled) setStatus("failed");
        return;
      }

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        if (cancelled) return;
        try {
          const subscription = await getSubscriptionStatus();
          if (subscription.isPremium) {
            const freshUser = await getMe();
            if (cancelled) return;
            setUser(freshUser);
            setStatus("success");
            sessionStorage.removeItem(RETURN_KEY);
            return;
          }
        } catch (err) {
          console.error("Failed to check subscription status", err);
        }
        await wait(POLL_DELAY_MS);
      }

      if (!cancelled) setStatus("pending");
    }

    confirm();
    return () => {
      cancelled = true;
    };
  }, [reference, setUser]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-md text-center">
          {status === "checking" && (
            <>
              <Loader2 size={40} className="mx-auto animate-spin text-primary" />
              <h1 className="mt-4 text-h3 font-bold text-neutral">Confirming your payment…</h1>
              <p className="mt-2 text-body text-neutral-500">
                This usually takes a few seconds. Please don't close this page.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 size={48} className="mx-auto text-secondary" />
              <h1 className="mt-4 text-h3 font-bold text-neutral">Payment successful!</h1>
              <p className="mt-2 text-body text-neutral-500">
                My Ulo Premium is now active on your account. You can unlock contact details and
                video walkthroughs on any listing.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {returnTo && (
                  <Button fullWidth onClick={() => navigate(returnTo)}>
                    Back to property
                  </Button>
                )}
                <Button
                  fullWidth
                  variant={returnTo ? "outline" : "primary"}
                  onClick={() => navigate("/dashboard")}
                >
                  Go to dashboard
                </Button>
              </div>
            </>
          )}

          {status === "pending" && (
            <>
              <Loader2 size={40} className="mx-auto text-neutral-400" />
              <h1 className="mt-4 text-h3 font-bold text-neutral">Still processing</h1>
              <p className="mt-2 text-body text-neutral-500">
                We haven't received confirmation from Paystack yet. This can take a little longer
                for some payment methods — check your account in a few minutes, or refresh this
                page to check again.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button fullWidth onClick={() => window.location.reload()}>
                  Check again
                </Button>
                <Button fullWidth variant="outline" onClick={() => navigate("/dashboard")}>
                  Go to dashboard
                </Button>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle size={48} className="mx-auto text-red-500" />
              <h1 className="mt-4 text-h3 font-bold text-neutral">Payment not confirmed</h1>
              <p className="mt-2 text-body text-neutral-500">
                We couldn't find a payment reference for this session. If you completed a payment
                on Paystack, it may still be processing — check your account shortly.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {returnTo && (
                  <Link
                    to={returnTo}
                    className="w-full rounded-lg border border-neutral-300 px-5 py-3 text-button text-neutral-700 hover:bg-neutral-50"
                  >
                    Back to property
                  </Link>
                )}
                <Button fullWidth variant="outline" onClick={() => navigate("/dashboard")}>
                  Go to dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
