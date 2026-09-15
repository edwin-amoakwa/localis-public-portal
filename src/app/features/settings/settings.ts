import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { UiService } from '../../core/services/ui.service';
import { environment } from '../../../environments/environment';

/** Language, theme, accessibility and notification settings. */
@Component({
  selector: 'app-settings',
  imports: [FormsModule, ButtonModule, SelectModule, ToggleSwitchModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsPage {
  protected readonly ui = inject(UiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmationService);

  protected readonly env = environment;
  protected readonly user = this.auth.user;

  protected readonly languages = [
    { value: 'en', label: 'English' },
    { value: 'tw', label: 'Twi' },
    { value: 'ee', label: 'Ewe' },
    { value: 'ha', label: 'Hausa' },
  ];

  protected setLanguage(value: 'en' | 'tw' | 'ee' | 'ha'): void {
    this.ui.update({ language: value });

    // Only English content exists in this build — better to say so than to
    // leave someone waiting for a translation that never arrives.
    if (value === 'en') {
      this.toast.success('Language set to English', 'The portal will display in English.');
    } else {
      this.toast.info(
        'Translation not yet available',
        'Your preference has been saved. Translated content is still being prepared.',
      );
    }
  }

  protected setTheme(dark: boolean): void {
    this.ui.update({ darkMode: dark });
  }

  protected toggle(key: 'largeText' | 'highContrast' | 'reduceMotion', value: boolean): void {
    this.ui.update({ [key]: value });
  }

  protected toggleNotification(
    key: 'emailNotifications' | 'smsNotifications' | 'pushNotifications',
    value: boolean,
  ): void {
    this.ui.update({ [key]: value });
  }

  protected resetDefaults(): void {
    this.confirm.confirm({
      header: 'Reset settings?',
      message: 'This returns language, theme, accessibility and notification settings to their defaults.',
      icon: 'pi pi-refresh',
      acceptLabel: 'Reset',
      rejectLabel: 'Cancel',
      accept: () => {
        this.ui.update({
          darkMode: false,
          language: 'en',
          largeText: false,
          reduceMotion: false,
          highContrast: false,
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: false,
        });

        this.toast.success('Settings reset', 'Everything is back to its default.');
      },
    });
  }
}
