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
import { LookupAssembly, LookupRegion, PermitService } from '../../core/services/permit.service';
import { PHONE_PATTERN } from '../../core/utils/identifier';
import { ToastService } from '../../core/services/toast.service';

/**
 * Registration, live against localis-api: the account is created on the server,
 * which texts the welcome SMS and puts the applicant on the chosen Assembly's
 * list. The account itself is national, so it works with every Assembly.
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
  private readonly permits = inject(PermitService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly submitting = signal(false);
  /** Regions and their assemblies come from localis-api. */
  protected readonly regions = signal<LookupRegion[]>([]);
  protected readonly assemblies = signal<LookupAssembly[]>([]);

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

  protected readonly passwordMismatch = computed(() => false);

  constructor() {
    this.permits
      .regions()
      .then((regions) => this.regions.set(regions.filter((r) => r.assemblies.length > 0)))
      .catch((error) => this.toast.error('Could not load the list of Assemblies', error));

    this.form.controls.region.valueChanges.subscribe((regionId) => {
      const match = this.regions().find((r) => r.id === regionId);
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

  private regionName(regionId: string): string {
    return this.regions().find((r) => r.id === regionId)?.regionName ?? '';
  }

  private assemblyName(assemblyId: string): string {
    return this.assemblies().find((a) => a.id === assemblyId)?.assemblyName ?? '';
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
        region: this.regionName(value.region),
        assembly: this.assemblyName(value.assembly),
        assemblyId: value.assembly,
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
