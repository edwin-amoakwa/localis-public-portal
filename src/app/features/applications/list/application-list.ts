import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PermitService } from '../../../core/services/permit.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  PermitApplicationRecord,
  PermitApplicationStatus,
  permitStatusSeverity,
} from '../../../core/models/permit';

/** The applicant's Business Operating Permit applications from localis-api. */
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
  private readonly permits = inject(PermitService);
  private readonly toast = inject(ToastService);

  protected readonly applications = signal<PermitApplicationRecord[]>([]);
  protected readonly loading = signal(true);
  protected readonly term = signal('');
  protected readonly status = signal<PermitApplicationStatus | null>(null);

  /** Only the statuses actually present, labelled as the server labels them. */
  protected readonly statusOptions = computed(() => {
    const seen = new Map<PermitApplicationStatus, string>();
    this.applications().forEach((a) => seen.set(a.status, a.statusLabel));
    return [...seen].map(([value, label]) => ({ value, label }));
  });

  protected readonly rows = computed(() => {
    const term = this.term().trim().toLowerCase();
    const status = this.status();

    return this.applications()
      .filter((a) => (status ? a.status === status : true))
      .filter((a) =>
        term
          ? a.applicationNumber.toLowerCase().includes(term) ||
            a.business.businessName.toLowerCase().includes(term) ||
            (a.business.categoryName ?? '').toLowerCase().includes(term) ||
            a.assembly.assemblyName.toLowerCase().includes(term)
          : true,
      );
  });

  protected readonly counts = computed(() => {
    const list = this.applications();
    return {
      all: list.length,
      toPay: list.filter((a) => a.status === 'AWAITING_PAYMENT').length,
      inProgress: list.filter((a) => !['ISSUED', 'REJECTED', 'CANCELLED', 'AWAITING_PAYMENT'].includes(a.status))
        .length,
      issued: list.filter((a) => a.status === 'ISSUED').length,
    };
  });

  protected readonly severity = permitStatusSeverity;

  constructor() {
    this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.applications.set(await this.permits.myApplications());
    } catch (error) {
      this.toast.error('Could not load your applications', error);
    } finally {
      this.loading.set(false);
    }
  }

  protected clear(): void {
    this.term.set('');
    this.status.set(null);
  }
}
