import { api } from './client';

export interface ContactFormPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

// Unlike most endpoints, POST /contact's success response has no `data` key
// — it's just `{ success: true, message: "..." }` — so this doesn't use
// ApiEnvelope<T>.
export function submitContactForm(payload: ContactFormPayload) {
  return api.post<{ success: boolean; message: string }>('/contact', payload);
}
