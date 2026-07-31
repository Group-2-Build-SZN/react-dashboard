import { api } from './client';

export interface ContactFormPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export function submitContactForm(payload: ContactFormPayload) {
  return api.post<{ success: boolean; message: string }>('/contact', payload);
}
