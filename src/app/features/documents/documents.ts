import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { PortalService } from '../../core/services/portal.service';
import { Severity } from '../../core/services/ui.service';
import { DocumentKind, StoredDocument } from '../../core/models';
import { ToastService } from '../../core/services/toast.service';

/** Permits, certificates, receipts, letters and notices held on the account. */
@Component({
  selector: 'app-documents',
  imports: [DatePipe, FormsModule, ButtonModule, TagModule, SelectModule, InputTextModule],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class DocumentsPage {
  private readonly portal = inject(PortalService);
  private readonly toast = inject(ToastService);

  protected readonly term = signal('');
  protected readonly kind = signal<DocumentKind | null>(null);

  protected readonly kindOptions: { value: DocumentKind; label: string }[] = [
    { value: 'PERMIT', label: 'Permits' },
    { value: 'CERTIFICATE', label: 'Certificates' },
    { value: 'RECEIPT', label: 'Receipts' },
    { value: 'LETTER', label: 'Letters' },
    { value: 'NOTICE', label: 'Notices' },
  ];

  protected readonly documents = computed(() => {
    const term = this.term().trim().toLowerCase();
    const kind = this.kind();

    return this.portal
      .documents()
      .filter((d) => (kind ? d.kind === kind : true))
      .filter((d) =>
        term
          ? d.name.toLowerCase().includes(term) || d.reference.toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) => b.issuedDate.localeCompare(a.issuedDate));
  });

  /** Documents that need attention soon — surfaced above the list. */
  protected readonly expiring = computed(() =>
    this.portal.documents().filter((d) => d.status === 'EXPIRING'),
  );

  protected icon(kind: DocumentKind): string {
    return {
      PERMIT: 'pi pi-verified',
      CERTIFICATE: 'pi pi-bookmark',
      RECEIPT: 'pi pi-receipt',
      LETTER: 'pi pi-envelope',
      NOTICE: 'pi pi-flag',
    }[kind];
  }

  protected tint(kind: DocumentKind): string {
    return {
      PERMIT: 'tint-blue',
      CERTIFICATE: 'tint-green',
      RECEIPT: 'tint-grey',
      LETTER: 'tint-grey',
      NOTICE: 'tint-gold',
    }[kind];
  }

  protected statusSeverity(status: StoredDocument['status']): Severity {
    const map: Record<StoredDocument['status'], Severity> = {
      VALID: 'success',
      EXPIRING: 'warn',
      EXPIRED: 'danger',
    };
    return map[status];
  }

  protected statusLabel(status: StoredDocument['status']): string {
    return { VALID: 'Valid', EXPIRING: 'Expiring soon', EXPIRED: 'Expired' }[status];
  }

  protected download(document: StoredDocument): void {
    // No file exists behind these entries — say so rather than doing nothing.
    this.toast.info('Demonstration build', `“${document.name}” is sample data. In the live portal this downloads a PDF.`);
  }

  protected clear(): void {
    this.term.set('');
    this.kind.set(null);
  }
}
