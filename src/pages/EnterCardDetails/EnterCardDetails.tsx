import { useEffect, useState } from "react";
import { ArrowLeft, Lock, MapPin, ChevronDown, Eye, EyeOff, ShieldCheck } from "lucide-react";

import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import CardBrandBadges from "../../components/CardBrandBadges/CardBrandBadges";
import TrustBadge from "../../components/TrustBadge/TrustBadge";
import PaystackIcon from "../../components/PaystackIcon/PaystackIcon";

import { getProperty } from "../../api/properties";
import { apiPropertyToProperty } from "../../api/adapters";
import type { Property } from "../../types";
import { UNLOCK_FEE_NGN } from "../../types";

type EnterCardDetailsProps = {
  propertyId?: string;
  onBack?: () => void;
  onPaymentSuccess?: (propertyId: string) => void;
};

function EnterCardDetails({ propertyId, onBack, onPaymentSuccess }: EnterCardDetailsProps) {
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    getProperty(propertyId)
      .then((detail) => {
        if (!cancelled) setProperty(apiPropertyToProperty(detail));
      })
      .catch((err) => console.error("Failed to load property", err));
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pb-10 pt-5">

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>

        <div>
          <h1 className="text-[22px] font-bold leading-8 text-gray-900">
            Enter Card Details
          </h1>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <Lock size={12} />
            Secure payment powered by <PaystackIcon size={14} />
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-3 rounded-xl border border-border-light p-4">
        <img
          src={property?.coverImageUrl ?? ""}
          alt={property?.listingTitle ?? "Property"}
          className="h-16 w-20 flex-shrink-0 rounded-lg object-cover"
        />

        <div>
          <p className="text-sm font-semibold text-gray-900">
            {property?.listingTitle ?? "Loading…"}
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            {property?.neighborhood ?? ""}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Payment for inspection booking
          </p>

          <p className="mt-2 text-base font-bold text-primary-800">
            ₦{UNLOCK_FEE_NGN.toLocaleString('en-NG')}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
          <ShieldCheck size={18} />
        </span>

        <p className="flex-1 text-xs text-secondary-700">
          <span className="block text-sm font-semibold">
            Your payment is 100% secure
          </span>
          Your card details are encrypted and protected by Paystack
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900">
          Card Information
        </h2>

        <div className="mt-5 flex flex-col gap-5">
          <div>
            <label
              htmlFor="card-number"
              className="mb-[13px] block text-sm font-medium text-gray-700"
            >
              Card Number
            </label>

            <div className="relative flex items-center">
              <input
                id="card-number"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                placeholder="1234 5678 9012 3456"
                className="h-12 w-full rounded-xl border border-gray-100 bg-white py-3 pl-4 pr-32 text-sm text-gray-900 placeholder:text-muted focus:border-primary-800 focus:outline-none"
              />

              <span className="pointer-events-none absolute right-3">
                <CardBrandBadges />
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                id="expiry-date"
                label="Expiry Date"
                placeholder="MM / YY"
                value={expiryDate}
                onChange={(event) => setExpiryDate(event.target.value)}
              />
            </div>

            <div className="flex-1">
              <Input
                id="cvv"
                label="CVV"
                type={showCvv ? "text" : "password"}
                placeholder="123"
                value={cvv}
                onChange={(event) => setCvv(event.target.value)}
                icon={
                  <button onClick={() => setShowCvv(!showCvv)} className="pointer-events-auto">
                    {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                iconPosition="right"
              />
            </div>
          </div>

          <Input
            id="cardholder-name"
            label="Cardholder Name"
            placeholder="e.g. Chinedu Okafor"
            value={cardholderName}
            onChange={(event) => setCardholderName(event.target.value)}
          />

          <div>
            <label className="mb-[13px] block text-sm font-medium text-gray-700">
              Billing Address
            </label>

            <button className="flex h-12 w-full items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 text-left text-sm text-gray-900">
              <MapPin size={16} className="text-muted" />
              <span className="flex-1">Use my saved address</span>
              <ChevronDown size={16} className="text-muted" />
            </button>

            <p className="mt-2 text-xs text-gray-500">
              This should match the address associated with your card.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-2 border-t border-border-light pt-6">
        <input
          type="checkbox"
          id="save-card"
          checked={saveCard}
          onChange={(event) => setSaveCard(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300"
        />

        <label htmlFor="save-card" className="text-sm text-gray-700">
          <span className="block font-medium">Save card for faster payments</span>
          <span className="text-xs text-gray-500">
            Your card details will be securely saved
          </span>
        </label>
      </div>

      <div className="mt-8">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => propertyId && onPaymentSuccess?.(propertyId)}
        >
          Pay ₦{UNLOCK_FEE_NGN.toLocaleString('en-NG')}
        </Button>

        <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-gray-500">
          <Lock size={12} />
          By continuing, you agree to My Ulo's{" "}
          <span className="text-primary-800">Terms of service</span> and{" "}
          <span className="text-primary-800">Privacy Policy</span>
        </p>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        Trusted by thousands of Nigerians
      </div>

      <div className="mt-4 flex justify-center gap-8">
        <TrustBadge icon={<ShieldCheck size={18} />} label="PCI DSS COMPLIANT" />
        <TrustBadge icon={<Lock size={18} />} label="256-BIT ENCRYPTION" />
        <TrustBadge icon={<ShieldCheck size={18} />} label="SECURE PAYMENTS" />
      </div>

    </div>
  );
}

export default EnterCardDetails;
