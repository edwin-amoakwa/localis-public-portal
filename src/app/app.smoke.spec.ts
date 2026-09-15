import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';
import { describe, expect, it, beforeEach } from 'vitest';

import { routes } from './app.routes';
import { AspPreset } from './core/theme/asp-preset';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionStore } from './core/services/session-store';
import { CURRENT_USER } from './core/data/mock.data';

import { LoginPage } from './auth/login/login';
import { RegisterPage } from './auth/register/register';
import { DashboardPage } from './features/dashboard/dashboard';
import { ServiceListPage } from './features/catalogue/service-list/service-list';
import { ServiceDetailPage } from './features/catalogue/service-detail/service-detail';
import { ApplyPage } from './features/catalogue/apply/apply';
import { ApplicationListPage } from './features/applications/list/application-list';
import { ApplicationDetailPage } from './features/applications/detail/application-detail';
import { PaymentListPage } from './features/payments/list/payment-list';
import { PayPage } from './features/payments/pay/pay';
import { ReceiptPage } from './features/payments/receipt/receipt';
import { DocumentsPage } from './features/documents/documents';
import { AppointmentsPage } from './features/appointments/appointments';
import { NotificationsPage } from './features/notifications/notifications';
import { MessagesPage } from './features/messages/messages';
import { ProfilePage } from './features/profile/profile';
import { HelpPage } from './features/help/help';
import { SettingsPage } from './features/settings/settings';
import { AppShell } from './layout/app-shell/app-shell';

/**
 * Smoke test: every page must mount and render without throwing.
 *
 * The build already type-checks templates; this catches the things it cannot —
 * PrimeNG component APIs used incorrectly at runtime, and anything a
 * constructor or computed signal gets wrong on first render.
 */
describe('ASP pages render', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
        provideNoopAnimations(),
        providePrimeNG({ theme: { preset: AspPreset } }),
        MessageService,
        ConfirmationService,
      ],
    });

    // Every signed-in page assumes a session; API calls go to the testing backend and never resolve.
    SessionStore.write({ token: 'test-token', user: CURRENT_USER });
  });

  const pages: [string, unknown][] = [
    ['LoginPage', LoginPage],
    ['RegisterPage', RegisterPage],
    ['AppShell', AppShell],
    ['DashboardPage', DashboardPage],
    ['ServiceListPage', ServiceListPage],
    ['ApplicationListPage', ApplicationListPage],
    ['PaymentListPage', PaymentListPage],
    ['DocumentsPage', DocumentsPage],
    ['AppointmentsPage', AppointmentsPage],
    ['NotificationsPage', NotificationsPage],
    ['MessagesPage', MessagesPage],
    ['ProfilePage', ProfilePage],
    ['HelpPage', HelpPage],
    ['SettingsPage', SettingsPage],
  ];

  for (const [name, component] of pages) {
    it(`${name} mounts`, () => {
      const fixture = TestBed.createComponent(component as never);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.length).toBeGreaterThan(0);
    });
  }

  // Pages driven by a route parameter, set through their signal inputs.
  it('ServiceDetailPage mounts for a known service', () => {
    const fixture = TestBed.createComponent(ServiceDetailPage);
    fixture.componentRef.setInput('slug', 'business-operating-permit');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Business Operating Permit');
  });

  it('ApplyPage mounts and shows the first step', () => {
    const fixture = TestBed.createComponent(ApplyPage);
    fixture.componentRef.setInput('slug', 'business-operating-permit');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Applicant information');
  });

  it('ApplicationDetailPage mounts for a known application', () => {
    const fixture = TestBed.createComponent(ApplicationDetailPage);
    fixture.componentRef.setInput('id', 'app-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('ASP-2026-000124');
  });

  it('PayPage mounts for an outstanding invoice', () => {
    const fixture = TestBed.createComponent(PayPage);
    fixture.componentRef.setInput('id', 'inv-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Choose how to pay');
  });

  it('ReceiptPage mounts for a known receipt', () => {
    const fixture = TestBed.createComponent(ReceiptPage);
    fixture.componentRef.setInput('id', 'rct-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('GEA/RCT/2026/007713');
  });
});
