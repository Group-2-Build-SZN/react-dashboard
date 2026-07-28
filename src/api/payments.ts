import { api } from './client';
import type { ApiEnvelope, ApiSubscriptionInit, ApiSubscriptionStatus } from './types';

// NOTE: the backend has exactly ONE paywall — a flat ₦7,500/month
// subscription that flips `isPremium` on the user. There is no per-property
// or per-video unlock endpoint. Both the "unlock contact" flow (your
// UnlockContactScreen) and the "unlock video" flow (teammate's
// EnterCardDetails) call this same function — see src/App.tsx.

/** Starts a Paystack checkout. Redirect the user to `authorization_url`. */
export function initSubscription() {
  return api.post<ApiEnvelope<ApiSubscriptionInit>>('/payments/subscribe').then((r) => r.data);
}

export function getSubscriptionStatus() {
  return api.get<ApiEnvelope<ApiSubscriptionStatus>>('/payments/subscription').then((r) => r.data);
}

export function cancelSubscription() {
  return api.post<ApiEnvelope<{ message: string }>>('/payments/cancel').then((r) => r.data);
}

export function getPaymentHistory() {
  return api
    .get<
      ApiEnvelope<
        {
          id: string;
          paystackReference: string;
          amount: string;
          status: string;
          cardType: string;
          cardLast4: string;
          paidAt: string;
          createdAt: string;
        }[]
      >
    >('/payments/history')
    .then((r) => r.data);
}
