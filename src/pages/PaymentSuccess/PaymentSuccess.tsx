import { Phone, MessageCircle } from "lucide-react";

import Button from "../../components/Button/Button";
import VerifiedBadge from "../../components/VerifiedBadge/VerifiedBadge";

import { properties } from "../../data/properties";

import confetti from "../../assets/branding/confetti-streamers.png";
import checkmark from "../../assets/branding/success-checkmark.png";

type PaymentSuccessProps = {
  propertyId?: number;
  transactionId?: string;
  date?: string;
  onContactUs?: () => void;
  onBackToHome?: () => void;
};

function PaymentSuccess({
  propertyId = 1,
  transactionId = "psk_8f7g2h9k3l",
  date = "11 Jul 2026, 10:30 AM",
  onContactUs,
  onBackToHome,
}: PaymentSuccessProps) {
  const property = properties.find((p) => p.id === propertyId) ?? properties[0];

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
            <span className="font-semibold text-gray-900">{property.name}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Amount paid</span>
            <span className="font-semibold text-gray-900">{property.unlockPrice}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-semibold text-gray-900">Card</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-semibold text-gray-900">{transactionId}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-900">{date}</span>
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
              {property.owner.name}
            </p>
            <VerifiedBadge text="Verified Owner" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl border border-border-light px-4 py-3">
          <span className="flex items-center gap-3 text-sm font-semibold text-gray-900">
            <Phone size={16} className="text-gray-500" />
            {property.owner.phone}
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light">
            <Phone size={14} className="text-gray-700" />
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-border-light px-4 py-3">
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
        </div>
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
