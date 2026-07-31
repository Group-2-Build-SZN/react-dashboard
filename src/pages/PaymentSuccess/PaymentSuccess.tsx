import { useEffect, useState } from "react";
import { Phone, MessageCircle } from "lucide-react";

import Button from "../../components/Button/Button";
import VerifiedBadge from "../../components/VerifiedBadge/VerifiedBadge";

import { getProperty } from "../../api/properties";
import { apiPropertyToProperty } from "../../api/adapters";
import { getPaymentHistory } from "../../api/payments";
import type { Property } from "../../types";
import { UNLOCK_FEE_NGN } from "../../types";

import confetti from "../../assets/branding/confetti-streamers.png";
import checkmark from "../../assets/branding/success-checkmark.png";

type PaymentSuccessProps = {
  propertyId?: string;
  onContactUs?: () => void;
  onBackToHome?: () => void;
};

function PaymentSuccess({
  propertyId,
  onContactUs,
  onBackToHome,
}: PaymentSuccessProps) {
  const [property, setProperty] = useState<Property | null>(null);
  // Was hardcoded to a fake reference/date on every single payment — this
  // pulls the real, most recent entry from /payments/history instead. Falls
  // back to "—" (not a made-up value) if the history call fails or is empty.
  const [payment, setPayment] = useState<{
    paystackReference: string;
    amount: string;
    cardType: string;
    cardLast4: string;
    paidAt: string;
  } | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    getPaymentHistory()
      .then((history) => {
        if (cancelled || history.length === 0) return;
        const latest = [...history].sort(
          (a, b) => new Date(b.paidAt ?? b.createdAt).getTime() - new Date(a.paidAt ?? a.createdAt).getTime()
        )[0];
        setPayment(latest);
      })
      .catch((err) => console.error("Failed to load payment history", err));
    return () => {
      cancelled = true;
    };
  }, []);

  // ContactUsScreen builds the WhatsApp deep link the same way — strip
  // everything but digits, then swap a leading 0 for the 234 country code.
  const whatsappNumber = property?.owner?.phone?.replace(/[^\d]/g, "").replace(/^0/, "234");

  return (
    <div className="flex min-h-screen flex-col bg-secondary-50 px-6 pb-10 pt-12">

      <div className="relative flex h-28 justify-center">
        <img src={confetti} alt="" className="absolute top-0 h-40 w-full object-contain" />
        <img src={checkmark} alt="" className="relative z-10 h-24 w-24" />
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-[28px] font-bold leading-9 text-gray-900">
          Payment Successful!
        </h1>

        <p className="mt-3 text-base leading-6 text-gray-500">
          You have successfully unlocked the property owner's contact
          details.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border-light bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Payment Details
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Property</span>
            <span className="font-semibold text-gray-900">{property?.listingTitle ?? "—"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Amount paid</span>
            <span className="font-semibold text-gray-900">₦{UNLOCK_FEE_NGN.toLocaleString('en-NG')}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-semibold text-gray-900">
              {payment?.cardType && payment?.cardLast4
                ? `${payment.cardType} •••• ${payment.cardLast4}`
                : "Paystack"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-semibold text-gray-900">{payment?.paystackReference ?? "—"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-900">
              {payment?.paidAt
                ? new Date(payment.paidAt).toLocaleString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border-light bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Contact Unlocked
        </h2>

        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <Phone size={18} />
          </span>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {property?.owner?.name ?? "Property Owner"}
            </p>
            <VerifiedBadge text="Verified Owner" />
          </div>
        </div>

        <button
          type="button"
          disabled={!property?.owner?.phone}
          onClick={() => {
            if (property?.owner?.phone) window.location.href = `tel:${property.owner.phone.replace(/\s/g, '')}`;
          }}
          className="mt-5 flex w-full items-center justify-between rounded-xl border border-border-light px-4 py-3 disabled:opacity-50"
        >
          <span className="flex items-center gap-3 text-sm font-semibold text-gray-900">
            <Phone size={16} className="text-gray-500" />
            {property?.owner?.phone ?? "Not available"}
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light">
            <Phone size={14} className="text-gray-700" />
          </span>
        </button>

        <button
          type="button"
          disabled={!whatsappNumber}
          onClick={() => {
            if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer');
          }}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-border-light px-4 py-3 disabled:opacity-50"
        >
          <span className="flex items-center gap-3">
            <MessageCircle size={16} className="text-secondary-600" />
            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Whatsapp
              </span>
              <span className="block text-xs text-gray-500">
                Chat on Whatsapp
              </span>
            </span>
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light text-secondary-600">
            <MessageCircle size={14} />
          </span>
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button variant="primary" size="lg" className="w-full" onClick={onContactUs}>
          Contact Us
        </Button>

        <Button variant="outline" size="lg" className="w-full" onClick={onBackToHome}>
          Back to Home
        </Button>
      </div>

    </div>
  );
}

export default PaymentSuccess;
