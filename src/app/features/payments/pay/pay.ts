import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { PortalService } from '../../../core/services/portal.service';
import { PaymentMethod } from '../../../core/models';

interface MethodOption {
  value: PaymentMethod;
  label: string;
  hint: string;
  icon: string;
}

/**
 * The mock payment screen. Choosing a channel, entering an amount and
 * confirming issues a receipt and updates the invoice and its application —
 * nothing leaves the browser.
 */
@Component({
  selector: 'app-pay',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    BreadcrumbModule,
  ],
  templateUrl: './pay.html',
  styleUrl: './pay.scss',
})
export class PayPage {
  private readonly fb = inject(FormBuilder);
  private readonly portal = inject(PortalService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);

  readonly id = input.required<string>();

  protected readonly invoice = computed(() => this.portal.invoiceById(this.id()));
  protected readonly balance = computed(() => {
    const invoice = this.invoice();
    return invoice ? invoice.total - invoice.paid : 0;
  });

  protected readonly processing = signal(false);
  protected readonly method = signal<PaymentMethod>('MOBILE_MONEY');

  protected readonly methods: MethodOption[] = [
    {
      value: 'MOBILE_MONEY',
      label: 'Mobile Money',
      hint: 'Approve the prompt on your phone',
      icon: 'pi pi-mobile',
    },
    {
      value: 'DEBIT_CARD',
      label: 'Debit Card',
      hint: 'Ghanaian and international cards',
      icon: 'pi pi-credit-card',
    },
    {
      value: 'CREDIT_CARD',
      label: 'Credit Card',
      hint: 'Visa and Mastercard',
      icon: 'pi pi-credit-card',
    },
    {
      value: 'BANK_TRANSFER',
      label: 'Bank Transfer',
      hint: 'Direct to the Assembly account',
      icon: 'pi pi-building-columns',
    },
    {
      value: 'QR_CODE',
      label: 'QR Code',
      hint: 'Scan the code on your invoice',
      icon: 'pi pi-qrcode',
    },
  ];

  protected readonly form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    momoNumber: ['0241234567'],
    momoNetwork: ['MTN'],
    cardName: [''],
    cardNumber: [''],
    cardExpiry: [''],
    cardCvv: [''],
  });

  constructor() {
    // Default to settling the whole balance — the common case.
    queueMicrotask(() => this.form.controls.amount.setValue(this.balance()));
  }

  protected chooseMethod(method: PaymentMethod): void {
    this.method.set(method);
  }

  protected payFull(): void {
    this.form.controls.amount.setValue(this.balance());
  }

  protected pay(): void {
    const invoice = this.invoice();
    if (!invoice) {
      return;
    }

    const amount = this.form.controls.amount.value;

    if (!amount || amount <= 0) {
      this.messages.add({
        severity: 'warn',
        summary: 'Enter an amount',
        detail: 'The amount must be greater than zero.',
        life: 3500,
      });
      return;
    }

    if (amount > this.balance()) {
      this.messages.add({
        severity: 'warn',
        summary: 'Amount too high',
        detail: 'You cannot pay more than the outstanding balance.',
        life: 3500,
      });
      return;
    }

    this.processing.set(true);

    // Stands in for the round trip to a payment provider.
    setTimeout(() => {
      const receipt = this.portal.payInvoice(
        invoice,
        amount,
        this.method(),
        this.generateReference(),
      );

      this.processing.set(false);

      this.messages.add({
        severity: 'success',
        summary: 'Payment successful',
        detail: `Receipt ${receipt.receiptNumber} has been issued.`,
        life: 5000,
      });

      this.router.navigate(['/app/payments/receipt', receipt.id]);
    }, 1400);
  }

  private generateReference(): string {
    const prefix = { MOBILE_MONEY: 'MM', DEBIT_CARD: 'CD', CREDIT_CARD: 'CC', BANK_TRANSFER: 'BT', QR_CODE: 'QR' }[
      this.method()
    ];
    return `${prefix}-${Math.floor(100000000 + Math.random() * 899999999)}`;
  }

  protected readonly crumbs = computed<MenuItem[]>(() => [
    { label: 'Payments', routerLink: '/app/payments' },
    { label: this.invoice()?.invoiceNumber ?? 'Pay' },
  ]);

  protected readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/dashboard' };
}
