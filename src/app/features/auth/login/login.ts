import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Mock sign-in. Any credentials are accepted — the form validates shape only,
 * then drops the visitor into the dashboard.
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
  private readonly messages = inject(MessageService);

  protected readonly submitting = signal(false);
  protected readonly forgotOpen = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['akosua.mensah@example.com', [Validators.required, Validators.email]],
    password: ['demo1234', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  protected readonly forgotForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    // A short delay so the button's loading state is visible — this stands in
    // for the round trip a real sign-in would make.
    setTimeout(() => {
      this.auth.login(this.form.controls.email.value);
      this.submitting.set(false);

      this.messages.add({
        severity: 'success',
        summary: 'Signed in',
        detail: 'Welcome back to the Assembly Services Portal.',
        life: 3500,
      });

      this.router.navigate(['/app/dashboard']);
    }, 600);
  }

  protected sendReset(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.forgotOpen.set(false);
    this.messages.add({
      severity: 'info',
      summary: 'Reset code sent',
      detail: `If an account exists for ${this.forgotForm.controls.email.value}, a reset code has been sent to it.`,
      life: 5000,
    });
    this.forgotForm.reset();
  }
}
