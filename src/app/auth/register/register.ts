import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../core/services/auth.service';
import { PortalService } from '../../core/services/portal.service';
import { AccountType } from '../../core/models';
import { PHONE_PATTERN } from '../../core/utils/identifier';
import { ToastService } from '../../core/services/toast.service';

interface AccountTypeOption {
  value: AccountType;
  label: string;
  description: string;
  icon: string;
}

/**
 * Registration, live against localis-api: the account is created on the
 * server, which texts the welcome SMS. Region, assembly and account type stay
 * portal-side for now — the server's Applicant is deliberately not tied to an
 * assembly.
 */
@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    SelectModule,
  ],
  templateUrl: './register.html',
  styleUrl: '../auth.scss',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly portal = inject(PortalService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly submitting = signal(false);
  protected readonly accountType = signal<AccountType>('BUSINESS_OWNER');

  protected readonly accountTypes: AccountTypeOption[] = [
    {
      value: 'CITIZEN',
      label: 'Citizen',
      description: 'Request services, make payments and report community issues.',
      icon: 'pi pi-user',
    },
    {
      value: 'BUSINESS_OWNER',
      label: 'Business Owner',
      description: 'Apply for operating permits, renew licences and pay fees.',
      icon: 'pi pi-briefcase',
    },
    {
      value: 'PROPERTY_OWNER',
      label: 'Property Owner',
      description: 'Pay property rates and view your property records.',
      icon: 'pi pi-home',
    },
    {
      value: 'ORGANISATION',
      label: 'Organisation',
      description: 'Act on behalf of a company, NGO or institution.',
      icon: 'pi pi-building',
    },
  ];

  protected readonly regions = this.portal.regions.map((r) => r.name);

  protected readonly form = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      ghanaCardNo: [
        '',
        [Validators.required, Validators.pattern(/^GHA-\d{9}-\d$/i)],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      region: ['', [Validators.required]],
      assembly: [{ value: '', disabled: true }, [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    {
      validators: (group) =>
        group.get('password')?.value === group.get('confirmPassword')?.value
          ? null
          : { passwordMismatch: true },
    },
  );

  /** Assemblies depend on the region chosen, so the list is derived. */
  protected readonly assemblies = signal<string[]>([]);

  protected readonly passwordMismatch = computed(() => false);

  constructor() {
    this.form.controls.region.valueChanges.subscribe((region) => {
      const match = this.portal.regions.find((r) => r.name === region);
      this.assemblies.set(match?.assemblies ?? []);

      const control = this.form.controls.assembly;
      control.setValue('');
      if (match) {
        control.enable();
      } else {
        control.disable();
      }
    });
  }

  protected chooseType(type: AccountType): void {
    this.accountType.set(type);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warn('Check your details', 'Some required information is missing or not in the expected format.');
      return;
    }

    this.submitting.set(true);
    const value = this.form.getRawValue();

    this.auth
      .register({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        phone: value.phone,
        ghanaCardNo: value.ghanaCardNo.toUpperCase(),
        password: value.password,
        confirmPassword: value.confirmPassword,
        region: value.region,
        assembly: value.assembly,
        accountType: this.accountType(),
      })
      .then((user) => {
        this.portal.sendRegistrationConfirmation(user);
        this.toast.success('Account created', `Welcome, ${user.firstName}. We've sent a confirmation SMS to ${user.phone}.`);
        this.router.navigate(['/app/dashboard']);
      })
      .catch((error) => {
        this.toast.error('Registration failed', error);
      })
      .finally(() => this.submitting.set(false));
  }

  protected invalid(control: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[control];
    return c.touched && c.invalid;
  }
}
