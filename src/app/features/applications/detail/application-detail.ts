import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuItem, MessageService } from 'primeng/api';
import { PortalService } from '../../../core/services/portal.service';
import {
  APPLICATION_STATUS_LABEL,
  APPLICATION_STATUS_SEVERITY,
  Severity,
} from '../../../core/services/ui.service';
import { ApplicationStatus } from '../../../core/models';

/** One application: its trail, documents, money, inspection and officer notes. */
@Component({
  selector: 'app-application-detail',
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ButtonModule,
    TagModule,
    TimelineModule,
    PanelModule,
    BreadcrumbModule,
    ProgressBarModule,
  ],
  templateUrl: './application-detail.html',
  styleUrl: './application-detail.scss',
})
export class ApplicationDetailPage {
  private readonly portal = inject(PortalService);
  private readonly messages = inject(MessageService);

  readonly id = input.required<string>();

  protected readonly application = computed(() => this.portal.applicationById(this.id()));

  protected readonly invoice = computed(() => {
    const invoiceId = this.application()?.invoiceId;
    return invoiceId ? this.portal.invoiceById(invoiceId) : undefined;
  });

  protected readonly outstanding = computed(() => {
    const app = this.application();
    return app ? Math.max(0, app.amountDue - app.amountPaid) : 0;
  });

  protected readonly paidPercent = computed(() => {
    const app = this.application();
    if (!app || app.amountDue === 0) {
      return 100;
    }
    return Math.round((app.amountPaid / app.amountDue) * 100);
  });

  protected readonly crumbs = computed<MenuItem[]>(() => [
    { label: 'Applications', routerLink: '/app/applications' },
    { label: this.application()?.applicationNumber ?? '' },
  ]);

  protected readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/dashboard' };

  protected statusLabel(status: ApplicationStatus | 'NOTE'): string {
    return status === 'NOTE' ? 'Update' : APPLICATION_STATUS_LABEL[status];
  }

  protected statusSeverity(status: ApplicationStatus): Severity {
    return APPLICATION_STATUS_SEVERITY[status];
  }

  /** Timeline marker colour — greens for progress, gold for money and checks. */
  protected markerClass(status: ApplicationStatus | 'NOTE'): string {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'tint-green';
      case 'AWAITING_PAYMENT':
      case 'INSPECTION_SCHEDULED':
        return 'tint-gold';
      case 'REJECTED':
        return 'tint-danger';
      case 'NOTE':
        return 'tint-grey';
      default:
        return 'tint-blue';
    }
  }

  protected markerIcon(status: ApplicationStatus | 'NOTE'): string {
    switch (status) {
      case 'DRAFT':
        return 'pi pi-pencil';
      case 'SUBMITTED':
        return 'pi pi-send';
      case 'UNDER_REVIEW':
        return 'pi pi-search';
      case 'AWAITING_PAYMENT':
        return 'pi pi-credit-card';
      case 'INSPECTION_SCHEDULED':
        return 'pi pi-calendar';
      case 'APPROVED':
        return 'pi pi-check-circle';
      case 'COMPLETED':
        return 'pi pi-verified';
      case 'REJECTED':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-info-circle';
    }
  }

  protected download(name: string): void {
    // No files exist in this build — say so rather than silently doing nothing.
    this.messages.add({
      severity: 'info',
      summary: 'Demonstration build',
      detail: `“${name}” is sample data and cannot be downloaded.`,
      life: 3500,
    });
  }
}
