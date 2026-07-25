import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PortalService } from '../../../core/services/portal.service';
import {
  APPLICATION_STATUS_LABEL,
  APPLICATION_STATUS_SEVERITY,
  Severity,
} from '../../../core/services/ui.service';
import { ApplicationStatus } from '../../../core/models';

/** Every application on the account, filterable by status and free text. */
@Component({
  selector: 'app-application-list',
  imports: [
    RouterLink,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './application-list.html',
  styleUrl: './application-list.scss',
})
export class ApplicationListPage {
  private readonly portal = inject(PortalService);

  protected readonly term = signal('');
  protected readonly status = signal<ApplicationStatus | null>(null);

  protected readonly statusOptions = (
    Object.keys(APPLICATION_STATUS_LABEL) as ApplicationStatus[]
  ).map((value) => ({ value, label: APPLICATION_STATUS_LABEL[value] }));

  protected readonly rows = computed(() => {
    const term = this.term().trim().toLowerCase();
    const status = this.status();

    return this.portal
      .applications()
      .filter((a) => (status ? a.status === status : true))
      .filter((a) =>
        term
          ? a.applicationNumber.toLowerCase().includes(term) ||
            a.serviceName.toLowerCase().includes(term) ||
            a.subject.toLowerCase().includes(term) ||
            a.officer.toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) => b.submittedDate.localeCompare(a.submittedDate));
  });

  /** Counts for the status summary strip. */
  protected readonly counts = computed(() => ({
    all: this.portal.applications().length,
    pending: this.portal.pendingCount(),
    approved: this.portal.approvedCount(),
    draft: this.portal.applications().filter((a) => a.status === 'DRAFT').length,
  }));

  protected statusLabel(status: ApplicationStatus): string {
    return APPLICATION_STATUS_LABEL[status];
  }

  protected statusSeverity(status: ApplicationStatus): Severity {
    return APPLICATION_STATUS_SEVERITY[status];
  }

  protected clear(): void {
    this.term.set('');
    this.status.set(null);
  }
}
