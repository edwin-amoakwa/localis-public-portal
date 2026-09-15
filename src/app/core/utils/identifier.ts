import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/** Loose enough to accept the phone formats Ghanaians actually type in. */
export const PHONE_PATTERN = /^[0-9+\s()-]{9,}$/;

export function isEmailValue(value: string): boolean {
  return value.includes('@');
}

/**
 * Accepts either an email address or a phone number for a single sign-in
 * field — most applicants register with just a mobile number, so login can't
 * require an email.
 */
export function identifierValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();
    if (!value) {
      return null;
    }
    if (isEmailValue(value)) {
      return Validators.email(control);
    }
    return PHONE_PATTERN.test(value) ? null : { identifier: true };
  };
}
