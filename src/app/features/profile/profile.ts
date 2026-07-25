import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { PortalService } from '../../core/services/portal.service';
import { UiService } from '../../core/services/ui.service';

/** Personal details, businesses, properties, security and notification prefs. */
@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    TabsModule,
    TagModule,
    AvatarModule,
    ToggleSwitchModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly messages = inject(MessageService);
  protected readonly portal = inject(PortalService);
  protected readonly ui = inject(UiService);

  protected readonly user = this.auth.user;
  protected readonly savingProfile = signal(false);
  protected readonly savingPassword = signal(false);

  protected readonly profileForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    ghanaCardNo: [{ value: '', disabled: true }],
    region: [{ value: '', disabled: true }],
    assembly: [{ value: '', disabled: true }],
    residentialAddress: [''],
    digitalAddress: [''],
  });

  protected readonly passwordForm = this.fb.nonNullable.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required],
  });

  constructor() {
    const user = this.auth.user();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        ghanaCardNo: user.ghanaCardNo,
        region: user.region,
        assembly: user.assembly,
        residentialAddress: user.residentialAddress ?? '',
        digitalAddress: user.digitalAddress ?? '',
      });
    }
  }

  protected saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.savingProfile.set(true);

    setTimeout(() => {
      const value = this.profileForm.getRawValue();
      this.auth.updateProfile({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        phone: value.phone,
        residentialAddress: value.residentialAddress,
        digitalAddress: value.digitalAddress,
        avatarInitials: (value.firstName.charAt(0) + value.lastName.charAt(0)).toUpperCase(),
      });

      this.savingProfile.set(false);
      this.messages.add({
        severity: 'success',
        summary: 'Profile updated',
        detail: 'Your details have been saved.',
        life: 3000,
      });
    }, 700);
  }

  protected changePassword(): void {
    const { next, confirm } = this.passwordForm.getRawValue();

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (next !== confirm) {
      this.messages.add({
        severity: 'warn',
        summary: 'Passwords do not match',
        detail: 'The new password and its confirmation must be identical.',
        life: 3500,
      });
      return;
    }

    this.savingPassword.set(true);

    setTimeout(() => {
      this.savingPassword.set(false);
      this.passwordForm.reset();
      this.messages.add({
        severity: 'success',
        summary: 'Password changed',
        detail: 'Use your new password the next time you sign in.',
        life: 3500,
      });
    }, 700);
  }

  protected toggleNotification(key: 'email' | 'sms' | 'push', value: boolean): void {
    this.ui.update({
      emailNotifications: key === 'email' ? value : this.ui.prefs().emailNotifications,
      smsNotifications: key === 'sms' ? value : this.ui.prefs().smsNotifications,
      pushNotifications: key === 'push' ? value : this.ui.prefs().pushNotifications,
    });

    this.messages.add({
      severity: 'success',
      summary: 'Preference saved',
      life: 2000,
    });
  }

  protected accountTypeLabel(): string {
    return (
      {
        CITIZEN: 'Citizen',
        BUSINESS_OWNER: 'Business Owner',
        PROPERTY_OWNER: 'Property Owner',
        ORGANISATION: 'Organisation',
      }[this.user()?.accountType ?? 'CITIZEN'] ?? 'Citizen'
    );
  }
}
