import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { PortalService } from '../../../core/services/portal.service';
import {
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_SEVERITY,
  PAYMENT_METHOD_LABEL,
  Severity,
} from '../../../core/services/ui.service';
import { InvoiceStatus, PaymentMethod } from '../../../core/models';

/** Outstanding invoices, settled invoices, receipts and payment history. */
@Component({
  selector: 'app-payment-list',
  imports: [RouterLink, CurrencyPipe, DatePipe, TableModule, TagModule, ButtonModule, TabsModule],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.scss',
})
export class PaymentListPage {
  protected readonly portal = inject(PortalService);

  protected readonly outstanding = this.portal.outstandingInvoices;
  protected readonly paid = this.portal.paidInvoices;
  protected readonly receipts = this.portal.receipts;

  protected statusLabel(status: InvoiceStatus): string {
    return INVOICE_STATUS_LABEL[status];
  }

  protected statusSeverity(status: InvoiceStatus): Severity {
    return INVOICE_STATUS_SEVERITY[status];
  }

  protected methodLabel(method: PaymentMethod): string {
    return PAYMENT_METHOD_LABEL[method];
  }

  protected methodIcon(method: PaymentMethod): string {
    return {
      MOBILE_MONEY: 'pi pi-mobile',
      DEBIT_CARD: 'pi pi-credit-card',
      CREDIT_CARD: 'pi pi-credit-card',
      BANK_TRANSFER: 'pi pi-building-columns',
      QR_CODE: 'pi pi-qrcode',
    }[method];
  }
}
