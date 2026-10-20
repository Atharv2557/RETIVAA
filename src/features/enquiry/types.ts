/**
 * @file types.ts
 * @description Types for the RETIVAA booking enquiry feature.
 *
 * ARCHITECTURAL RULE:
 * This domain represents an initial booking ENQUIRY via WhatsApp or direct communication.
 * It is never treated as an instant guaranteed reservation, automated booking engine,
 * or payment transaction.
 */

export interface EnquiryFormValues {
  readonly name: string;
  readonly checkIn: string; // ISO date format YYYY-MM-DD
  readonly checkOut: string; // ISO date format YYYY-MM-DD
  readonly adults: number; // >= 1
  readonly children: number; // >= 0
  readonly experienceInterest?: string; // Optional (e.g. Camel Safari, Jeep Safari, Folk Dance)
  readonly message?: string; // Optional guest notes
}

export type EnquiryFieldErrorKey = keyof EnquiryFormValues | "general";

export interface EnquiryValidationErrors {
  name?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: string;
  children?: string;
  experienceInterest?: string;
  message?: string;
  general?: string;
}

export interface EnquiryValidationResult {
  readonly isValid: boolean;
  readonly errors: EnquiryValidationErrors;
}

export interface WhatsAppEnquiryPayload {
  readonly encodedMessage: string;
  readonly fullUrl: string | null;
  readonly isServiceAvailable: boolean;
}
