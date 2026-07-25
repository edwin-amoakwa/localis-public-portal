import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { PortalService } from '../../../core/services/portal.service';
import { PAYMENT_METHOD_LABEL } from '../../../core/services/ui.service';
import { PaymentMethod } from '../../../core/models';

/** A printable receipt. The print stylesheet strips the app chrome away. */
@Component({
  selector: 'app-receipt',
  imports: [RouterLink, CurrencyPipe, DatePipe, ButtonModule, BreadcrumbModule],
  templateUrl: './receipt.html',
  styleUrl: './receipt.scss',
})
export class ReceiptPage {
  private readonly portal = inject(PortalService);

  readonly id = input.required<string>();

  protected readonly receipt = computed(() => this.portal.receiptById(this.id()));

  protected readonly crumbs = computed<MenuItem[]>(() => [
    { label: 'Payments', routerLink: '/app/payments' },
    { label: this.receipt()?.receiptNumber ?? 'Receipt' },
  ]);

  protected readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/dashboard' };

  protected methodLabel(method: PaymentMethod): string {
    return PAYMENT_METHOD_LABEL[method];
  }

  protected print(): void {
    window.print();
  }
}
