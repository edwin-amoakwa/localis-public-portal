import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { identifierValidator } from '../../core/utils/identifier';

/**
 * Sign-in against localis-api. The identifier field takes either an email
 * address or a phone number, since most applicants register with a mobile
 * number only.
 */
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DialogModule,
  ],
  templateUrl: './login.html',
  styleUrl: '../auth.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  protected readonly submitting = signal(false);
  protected readonly forgotOpen = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, identifierValidator()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  protected readonly forgotForm = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, identifierValidator()]],
  });

  constructor() {
    if (this.route.snapshot.queryParamMap.get('expired')) {
      this.toast.info('Signed out', 'Your session expired. Please sign in again.');
    }
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      const user = await this.auth.login(this.form.controls.identifier.value, this.form.controls.password.value);
      this.toast.success('Signed in', `Welcome back, ${user.firstName}.`);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      this.router.navigateByUrl(returnUrl?.startsWith('/app') ? returnUrl : '/app/dashboard');
    } catch (error) {
      this.toast.error('Sign-in failed', error);
    } finally {
      this.submitting.set(false);
    }
  }

  protected sendReset(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.forgotOpen.set(false);
    this.toast.info(
      'Reset code sent',
      `If an account exists for ${this.forgotForm.controls.identifier.value}, a reset code has been sent to it.`,
    );
    this.forgotForm.reset();
  }
}
