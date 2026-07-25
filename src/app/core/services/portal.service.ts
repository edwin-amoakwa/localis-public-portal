import { Injectable, computed, signal } from '@angular/core';
import {
  ACTIVITIES,
  APPLICATIONS,
  APPOINTMENTS,
  BUSINESSES,
  DOCUMENTS,
  FAQS,
  INVOICES,
  MESSAGE_THREADS,
  NEWS,
  NOTIFICATIONS,
  PROPERTIES,
  RECEIPTS,
  REGIONS,
} from '../data/mock.data';
import { SERVICES, SERVICE_CATEGORIES } from '../data/services.data';
import {
  Application,
  ApplicationStatus,
  AssemblyService,
  Invoice,
  PaymentMethod,
  Receipt,
  ServiceCategoryId,
} from '../models';

/**
 * The single source of state for the whole portal.
 *
 * Everything is held in signals seeded from `core/data`. Mutations (submitting
 * an application, paying an invoice) update the signals in place, so the change
 * is reflected across every screen — the dashboard counters, the applications
 * table and the payment list all move together, exactly as they would against a
 * real backend.
 */
@Injectable({ providedIn: 'root' })
export class PortalService {
  // --- Reference data (static) ----------------------------------------------
  readonly categories = SERVICE_CATEGORIES;
  readonly services = SERVICES;
  readonly regions = REGIONS;
  readonly faqs = FAQS;
  readonly news = NEWS;

  // --- Mutable state --------------------------------------------------------
  private readonly _applications = signal<Application[]>([...APPLICATIONS]);
  private readonly _invoices = signal<Invoice[]>([...INVOICES]);
  private readonly _receipts = signal<Receipt[]>([...RECEIPTS]);
  private readonly _notifications = signal([...NOTIFICATIONS]);
  private readonly _appointments = signal([...APPOINTMENTS]);
  private readonly _threads = signal([...MESSAGE_THREADS]);
  private readonly _documents = signal([...DOCUMENTS]);

  readonly applications = this._applications.asReadonly();
  readonly invoices = this._invoices.asReadonly();
  readonly receipts = this._receipts.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  readonly appointments = this._appointments.asReadonly();
  readonly threads = this._threads.asReadonly();
  readonly documents = this._documents.asReadonly();

  readonly businesses = signal([...BUSINESSES]).asReadonly();
  readonly properties = signal([...PROPERTIES]).asReadonly();
  readonly activities = signal([...ACTIVITIES]).asReadonly();

  // --- Derived state --------------------------------------------------------

  readonly submittedCount = computed(
    () => this._applications().filter((a) => a.status !== 'DRAFT').length,
  );

  readonly pendingCount = computed(
    () =>
      this._applications().filter((a) =>
        (['SUBMITTED', 'UNDER_REVIEW', 'AWAITING_PAYMENT', 'INSPECTION_SCHEDULED'] as ApplicationStatus[]).includes(
          a.status,
        ),
      ).length,
  );

  readonly approvedCount = computed(
    () => this._applications().filter((a) => a.status === 'APPROVED' || a.status === 'COMPLETED').length,
  );

  readonly outstandingTotal = computed(() =>
    this._invoices()
      .filter((i) => i.status === 'UNPAID' || i.status === 'PART_PAID')
      .reduce((sum, i) => sum + (i.total - i.paid), 0),
  );

  readonly outstandingInvoices = computed(() =>
    this._invoices().filter((i) => i.status === 'UNPAID' || i.status === 'PART_PAID'),
  );

  readonly paidInvoices = computed(() => this._invoices().filter((i) => i.status === 'PAID'));

  readonly completedPaymentsTotal = computed(() =>
    this._receipts().reduce((sum, r) => sum + r.amount, 0),
  );

  readonly upcomingAppointments = computed(() =>
    this._appointments().filter((a) => a.status === 'SCHEDULED'),
  );

  readonly unreadNotifications = computed(() => this._notifications().filter((n) => !n.read));

  readonly unreadMessageCount = computed(() => this._threads().filter((t) => t.unread).length);

  readonly recentApplications = computed(() =>
    [...this._applications()]
      .sort((a, b) => b.submittedDate.localeCompare(a.submittedDate))
      .slice(0, 5),
  );

  // --- Lookups --------------------------------------------------------------

  serviceBySlug(slug: string): AssemblyService | undefined {
    return this.services.find((s) => s.slug === slug);
  }

  serviceById(id: string): AssemblyService | undefined {
    return this.services.find((s) => s.id === id);
  }

  servicesByCategory(categoryId: ServiceCategoryId): AssemblyService[] {
    return this.services.filter((s) => s.categoryId === categoryId);
  }

  categoryById(id: ServiceCategoryId) {
    return this.categories.find((c) => c.id === id);
  }

  applicationById(id: string): Application | undefined {
    return this._applications().find((a) => a.id === id);
  }

  invoiceById(id: string): Invoice | undefined {
    return this._invoices().find((i) => i.id === id);
  }

  receiptById(id: string): Receipt | undefined {
    return this._receipts().find((r) => r.id === id);
  }

  threadById(id: string) {
    return this._threads().find((t) => t.id === id);
  }

  // --- Commands -------------------------------------------------------------

  /**
   * Files a new application and raises its invoice, mirroring what the backend
   * would do on submission: number the application, stamp the trail, and bill.
   */
  submitApplication(service: AssemblyService, subject: string, documentNames: string[]): Application {
    const now = new Date();
    const applicationNumber = this.nextApplicationNumber();
    const total = service.fees.reduce((sum, fee) => sum + fee.amount, 0);
    const id = `app-${Math.random().toString(36).slice(2, 8)}`;

    const invoice: Invoice = {
      id: `inv-${Math.random().toString(36).slice(2, 8)}`,
      invoiceNumber: this.nextInvoiceNumber(),
      description: `${service.name} — ${subject}`,
      applicationNumber,
      serviceName: service.name,
      issuedDate: this.isoDate(now),
      dueDate: this.isoDate(new Date(now.getTime() + 30 * 864e5)),
      total,
      paid: 0,
      status: 'UNPAID',
      assembly: 'Ga East Municipal Assembly',
      items: service.fees.map((fee) => ({ name: fee.name, amount: fee.amount })),
    };

    const application: Application = {
      id,
      applicationNumber,
      serviceId: service.id,
      serviceName: service.name,
      categoryId: service.categoryId,
      submittedDate: this.isoDate(now),
      status: 'AWAITING_PAYMENT',
      officer: 'Kofi Boateng',
      assembly: 'Ga East Municipal Assembly',
      amountDue: total,
      amountPaid: 0,
      subject,
      invoiceId: invoice.id,
      documents: documentNames.map((name) => ({
        name,
        type: name.split('.').pop()?.toUpperCase() ?? 'PDF',
        size: `${(120 + Math.random() * 900).toFixed(0)} KB`,
        uploadedOn: this.isoDate(now),
        verified: false,
      })),
      timeline: [
        { date: this.stamp(now), status: 'SUBMITTED', title: 'Application submitted', actor: 'You' },
        {
          date: this.stamp(now),
          status: 'AWAITING_PAYMENT',
          title: `Assessed — GH₵ ${total.toFixed(2)}`,
          detail: `Invoice ${invoice.invoiceNumber} raised. Settle it to move to review.`,
          actor: 'System',
        },
      ],
    };

    this._applications.update((list) => [application, ...list]);
    this._invoices.update((list) => [invoice, ...list]);

    this.pushNotification({
      kind: 'APPLICATION',
      title: `Application ${applicationNumber} received`,
      body: `Your ${service.name} application has been received and assessed at GH₵ ${total.toFixed(2)}.`,
      link: `/app/applications/${id}`,
    });

    return application;
  }

  /**
   * Settles an invoice (in full or in part), issues the receipt and moves any
   * linked application on once it is fully paid.
   */
  payInvoice(invoice: Invoice, amount: number, method: PaymentMethod, reference: string): Receipt {
    const now = new Date();
    const receipt: Receipt = {
      id: `rct-${Math.random().toString(36).slice(2, 8)}`,
      receiptNumber: this.nextReceiptNumber(),
      invoiceNumber: invoice.invoiceNumber,
      description: invoice.description,
      paidDate: this.isoDate(now),
      amount,
      method,
      reference,
      payer: 'Akosua Mensah',
      assembly: invoice.assembly,
    };

    this._receipts.update((list) => [receipt, ...list]);

    const paid = invoice.paid + amount;
    const status = paid >= invoice.total ? 'PAID' : 'PART_PAID';

    this._invoices.update((list) =>
      list.map((i) => (i.id === invoice.id ? { ...i, paid, status } : i)),
    );

    this._applications.update((list) =>
      list.map((application) => {
        if (application.invoiceId !== invoice.id) {
          return application;
        }

        const advanced: Application = {
          ...application,
          amountPaid: paid,
          timeline: [
            ...application.timeline,
            {
              date: this.stamp(now),
              status: 'NOTE',
              title: `Payment received — GH₵ ${amount.toFixed(2)}`,
              detail: `Receipt ${receipt.receiptNumber}, ${this.methodLabel(method)}.`,
              actor: 'System',
            },
          ],
        };

        // Only a fully settled invoice releases the application to review.
        if (status === 'PAID' && application.status === 'AWAITING_PAYMENT') {
          advanced.status = 'UNDER_REVIEW';
          advanced.timeline = [
            ...advanced.timeline,
            {
              date: this.stamp(now),
              status: 'UNDER_REVIEW',
              title: 'Moved to review',
              detail: 'Payment confirmed. The application is now with the reviewing officer.',
              actor: 'System',
            },
          ];
        }

        return advanced;
      }),
    );

    this.pushNotification({
      kind: 'PAYMENT',
      title: `Payment received — GH₵ ${amount.toFixed(2)}`,
      body: `Receipt ${receipt.receiptNumber} has been issued for invoice ${invoice.invoiceNumber}.`,
      link: '/app/payments',
    });

    return receipt;
  }

  markNotificationRead(id: string): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  markAllNotificationsRead(): void {
    this._notifications.update((list) => list.map((n) => ({ ...n, read: true })));
  }

  replyToThread(threadId: string, body: string): void {
    const now = new Date();
    this._threads.update((list) =>
      list.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              unread: false,
              lastMessageDate: this.stamp(now),
              messages: [
                ...thread.messages,
                {
                  id: `m-${Math.random().toString(36).slice(2, 8)}`,
                  from: 'ME' as const,
                  author: 'You',
                  date: this.stamp(now),
                  body,
                },
              ],
            }
          : thread,
      ),
    );
  }

  markThreadRead(threadId: string): void {
    this._threads.update((list) =>
      list.map((t) => (t.id === threadId ? { ...t, unread: false } : t)),
    );
  }

  // --- Helpers --------------------------------------------------------------

  private pushNotification(input: {
    kind: 'APPLICATION' | 'PAYMENT' | 'INSPECTION' | 'PERMIT' | 'ANNOUNCEMENT';
    title: string;
    body: string;
    link?: string;
  }): void {
    this._notifications.update((list) => [
      {
        id: `ntf-${Math.random().toString(36).slice(2, 8)}`,
        date: this.stamp(new Date()),
        read: false,
        ...input,
      },
      ...list,
    ]);
  }

  /**
   * Application numbers run ASP-{year}-{000000}, continuing from the highest
   * number already on the account so the series never repeats itself.
   */
  private nextApplicationNumber(): string {
    const year = new Date().getFullYear();
    const highest = this._applications()
      .map((a) => Number(a.applicationNumber.split('-')[2] ?? 0))
      .reduce((max, n) => (n > max ? n : max), 0);

    return `ASP-${year}-${String(highest + 1).padStart(6, '0')}`;
  }

  private nextInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const highest = this._invoices()
      .map((i) => Number(i.invoiceNumber.split('/').pop() ?? 0))
      .reduce((max, n) => (n > max ? n : max), 0);

    return `GEA/INV/${year}/${String(highest + 1).padStart(6, '0')}`;
  }

  private nextReceiptNumber(): string {
    const year = new Date().getFullYear();
    const highest = this._receipts()
      .map((r) => Number(r.receiptNumber.split('/').pop() ?? 0))
      .reduce((max, n) => (n > max ? n : max), 0);

    return `GEA/RCT/${year}/${String(highest + 1).padStart(6, '0')}`;
  }

  private methodLabel(method: PaymentMethod): string {
    return {
      MOBILE_MONEY: 'Mobile Money',
      DEBIT_CARD: 'Debit Card',
      CREDIT_CARD: 'Credit Card',
      BANK_TRANSFER: 'Bank Transfer',
      QR_CODE: 'QR Code',
    }[method];
  }

  private isoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private stamp(date: Date): string {
    return `${this.isoDate(date)} ${date.toTimeString().slice(0, 5)}`;
  }
}
