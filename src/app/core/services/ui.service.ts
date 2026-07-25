import { Injectable, effect, signal } from '@angular/core';
import { ApplicationStatus, InvoiceStatus, PaymentMethod } from '../models';
import { readJson, writeJson } from './storage';

const PREF_KEY = 'asp.preferences';

export interface UiPreferences {
  darkMode: boolean;
  language: 'en' | 'tw' | 'ee' | 'ha';
  largeText: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

const DEFAULTS: UiPreferences = {
  darkMode: false,
  language: 'en',
  largeText: false,
  reduceMotion: false,
  highContrast: false,
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
};

/**
 * Theme, accessibility and display preferences, plus the label/severity maps
 * that keep status wording identical everywhere it appears.
 */
@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly _prefs = signal<UiPreferences>(this.restore());
  readonly prefs = this._prefs.asReadonly();

  /** Sidebar state on small screens. */
  readonly mobileMenuOpen = signal(false);

  constructor() {
    // Applying preferences as an effect keeps <html> in step with the signal,
    // including on first load, without every component having to remember to.
    effect(() => {
      const prefs = this._prefs();
      const root = document.documentElement;

      root.classList.toggle('app-dark', prefs.darkMode);
      root.classList.toggle('app-large-text', prefs.largeText);
      root.classList.toggle('app-high-contrast', prefs.highContrast);
      root.classList.toggle('app-reduce-motion', prefs.reduceMotion);
      root.lang = prefs.language;

      writeJson(PREF_KEY, prefs);
    });
  }

  update(changes: Partial<UiPreferences>): void {
    this._prefs.update((prefs) => ({ ...prefs, ...changes }));
  }

  toggleDarkMode(): void {
    this.update({ darkMode: !this._prefs().darkMode });
  }

  private restore(): UiPreferences {
    const stored = readJson<Partial<UiPreferences>>(PREF_KEY);
    return stored ? { ...DEFAULTS, ...stored } : DEFAULTS;
  }
}

// --- Shared display maps ------------------------------------------------------
// Kept next to the UI service so status wording and colour never drift between
// the dashboard, the applications table and the detail page.

/** PrimeNG severity union, shared by Tag, Message and Badge. */
export type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  AWAITING_PAYMENT: 'Awaiting Payment',
  INSPECTION_SCHEDULED: 'Inspection Scheduled',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
};

/** PrimeNG Tag severities. */
export const APPLICATION_STATUS_SEVERITY: Record<ApplicationStatus, Severity> = {
  DRAFT: 'secondary',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'info',
  AWAITING_PAYMENT: 'warn',
  INSPECTION_SCHEDULED: 'warn',
  APPROVED: 'success',
  REJECTED: 'danger',
  COMPLETED: 'success',
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  UNPAID: 'Unpaid',
  PART_PAID: 'Part Paid',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
};

export const INVOICE_STATUS_SEVERITY: Record<InvoiceStatus, Severity> = {
  UNPAID: 'danger',
  PART_PAID: 'warn',
  PAID: 'success',
  CANCELLED: 'secondary',
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  MOBILE_MONEY: 'Mobile Money',
  DEBIT_CARD: 'Debit Card',
  CREDIT_CARD: 'Credit Card',
  BANK_TRANSFER: 'Bank Transfer',
  QR_CODE: 'QR Code',
};
