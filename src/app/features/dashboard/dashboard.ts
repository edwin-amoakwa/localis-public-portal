import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { AuthService } from '../../core/services/auth.service';
import { PortalService } from '../../core/services/portal.service';
import {
  APPLICATION_STATUS_LABEL,
  APPLICATION_STATUS_SEVERITY,
  Severity,
} from '../../core/services/ui.service';
import { ApplicationStatus } from '../../core/models';

/**
 * The landing screen: where things stand, what needs attention, and the
 * quickest route to the three things people come here to do.
 */
@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    TimelineModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage {
  protected readonly portal = inject(PortalService);
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.user;

  protected readonly recent = this.portal.recentApplications;
  protected readonly activities = this.portal.activities;
  protected readonly notifications = this.portal.notifications;
  protected readonly appointments = this.portal.upcomingAppointments;

  protected readonly quickActions = [
    {
      label: 'Apply for a service',
      detail: 'Permits, licences and requests',
      icon: 'pi pi-plus-circle',
      tint: 'tint-blue',
      link: '/app/services',
    },
    {
      label: 'Pay an invoice',
      detail: 'Mobile money, card or bank',
      icon: 'pi pi-credit-card',
      tint: 'tint-green',
      link: '/app/payments',
    },
    {
      label: 'Track an application',
      detail: 'See where your file has reached',
      icon: 'pi pi-search',
      tint: 'tint-gold',
      link: '/app/applications',
    },
    {
      label: 'Download a document',
      detail: 'Permits, receipts and certificates',
      icon: 'pi pi-download',
      tint: 'tint-grey',
      link: '/app/documents',
    },
  ];

  protected statusLabel(status: ApplicationStatus): string {
    return APPLICATION_STATUS_LABEL[status];
  }

  protected statusSeverity(status: ApplicationStatus): Severity {
    return APPLICATION_STATUS_SEVERITY[status];
  }

  /** Greeting that matches the time of day the user actually signs in. */
  protected greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
}
