import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { PermitService } from '../../../core/services/permit.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { PHONE_PATTERN } from '../../../core/utils/identifier';
import { ReportData } from '../../../core/report-data';
import { ReportViewer } from '../../../shared/report-viewer/report-viewer';
import {
  PermitApplicationRecord,
  PermitApplicationStatus,
  permitStatusSeverity,
} from '../../../core/models/permit';

/**
 * One Business Operating Permit application: where it has reached, what is
 * owed, the Mobile Money payment once approved for payment, and the permit PDF
 * once generated.
 */
@Component({
  selector: 'app-application-detail',
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    ButtonModule,
    TagModule,
    TimelineModule,
    BreadcrumbModule,
    ProgressBarModule,
    DialogModule,
    InputTextModule,
    ReportViewer,
  ],
  templateUrl: './application-detail.html',
  styleUrl: './application-detail.scss',
})
export class ApplicationDetailPage {
  private readonly permits = inject(PermitService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly id = input.required<string>();

  protected readonly application = signal<PermitApplicationRecord | null>(null);
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);

  protected readonly payOpen = signal(false);
  protected readonly paying = signal(false);
  protected readonly loadingPermit = signal(false);
  protected readonly reportData = new ReportData();
  protected readonly viewerOpen = signal(false);

  protected readonly payForm = this.fb.nonNullable.group({
    mobileMoneyNumber: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
  });

  protected readonly paidPercent = computed(() => {
    const app = this.application();
    if (!app || app.assessedAmount === 0) {
      return 0;
    }
    return Math.min(100, Math.round((app.amountPaid / app.assessedAmount) * 100));
  });

  protected readonly crumbs = computed<MenuItem[]>(() => [
    { label: 'Applications', routerLink: '/app/applications' },
    { label: this.application()?.applicationNumber ?? '' },
  ]);

  protected readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/dashboard' };
  protected readonly severity = permitStatusSeverity;

  /** The assembly's Mobile Money wallet leads, since that is how the portal pays. */
  protected readonly paymentAccounts = computed(() => {
    const accounts = this.application()?.paymentAccounts ?? [];
    return [...accounts].sort((a, b) => Number(b.accountType === 'MOBILE_MONEY') - Number(a.accountType === 'MOBILE_MONEY'));
  });

  /** The wallet the Mobile Money dialog actually pays into, when the assembly has one. */
  protected readonly momoAccount = computed(
    () => this.paymentAccounts().find((account) => account.accountType === 'MOBILE_MONEY') ?? null,
  );

  protected accountIcon(type: string): string {
    return { MOBILE_MONEY: 'pi pi-mobile', BANK: 'pi pi-building-columns', CASH: 'pi pi-wallet' }[type] ?? 'pi pi-wallet';
  }

  constructor() {
    effect(() => {
      this.load(this.id());
    });
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    try {
      this.application.set(await this.permits.application(id));
      this.notFound.set(false);
    } catch (error) {
      this.notFound.set(true);
      this.toast.error('Could not load the application', error);
    } finally {
      this.loading.set(false);
    }
  }

  protected openPay(): void {
    this.payForm.reset({ mobileMoneyNumber: this.auth.user()?.phone ?? '' });
    this.payOpen.set(true);
  }

  /**
   * There is no Mobile Money gateway yet: the server takes the payment as
   * successful and it waits for the Assembly to confirm it.
   */
  protected async pay(): Promise<void> {
    const app = this.application();
    if (!app || this.payForm.invalid) {
      this.payForm.markAllAsTouched();
      return;
    }

    this.paying.set(true);
    try {
      const response = await this.permits.payByMobileMoney(app.id, this.payForm.controls.mobileMoneyNumber.value);
      this.application.set(response.data!);
      this.payOpen.set(false);
      this.toast.success('Payment received', response.message);
    } catch (error) {
      this.toast.error('Payment failed', error);
    } finally {
      this.paying.set(false);
    }
  }

  protected async viewPermit(): Promise<void> {
    const app = this.application();
    if (!app?.permit) {
      return;
    }

    this.loadingPermit.set(true);
    try {
      const pdf = await this.permits.permitPdf(app.id);
      this.reportData.showPdfReport(`Business Operating Permit ${app.permit.permitNumber}`, pdf);
      this.viewerOpen.set(true);
    } catch (error) {
      this.toast.error('Could not open the permit', error);
    } finally {
      this.loadingPermit.set(false);
    }
  }

  /** Timeline marker colour — greens for progress, gold for money. */
  protected markerClass(status?: PermitApplicationStatus): string {
    switch (status) {
      case 'APPROVED':
      case 'ISSUED':
        return 'tint-green';
      case 'AWAITING_PAYMENT':
      case 'PAYMENT_CONFIRMATION':
        return 'tint-gold';
      case 'REJECTED':
      case 'CANCELLED':
        return 'tint-danger';
      default:
        return 'tint-blue';
    }
  }

  protected markerIcon(status?: PermitApplicationStatus): string {
    switch (status) {
      case 'SUBMITTED':
        return 'pi pi-send';
      case 'UNDER_REVIEW':
        return 'pi pi-search';
      case 'AWAITING_PAYMENT':
        return 'pi pi-wallet';
      case 'PAYMENT_CONFIRMATION':
        return 'pi pi-mobile';
      case 'APPROVED':
        return 'pi pi-check-circle';
      case 'ISSUED':
        return 'pi pi-verified';
      case 'REJECTED':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-info-circle';
    }
  }

  protected natureLabel(value?: string): string {
    return (
      { PRODUCTS: 'Products', SERVICES: 'Services', BOTH: 'Products & services', OTHER: 'Other' }[value ?? ''] ??
      '—'
    );
  }
}
