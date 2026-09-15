import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { PortalService } from '../../core/services/portal.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';

interface ChatLine {
  from: 'ME' | 'AGENT';
  body: string;
  time: string;
}

/** FAQs, a support request form, contact details and a mock live chat. */
@Component({
  selector: 'app-help',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    AccordionModule,
    AvatarModule,
  ],
  templateUrl: './help.html',
  styleUrl: './help.scss',
})
export class HelpPage {
  private readonly fb = inject(FormBuilder);
  private readonly portal = inject(PortalService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly env = environment;
  protected readonly user = this.auth.user;
  protected readonly submitting = signal(false);
  protected readonly term = signal('');

  /** FAQs grouped by topic, filtered by the search box. */
  protected readonly faqGroups = computed(() => {
    const term = this.term().trim().toLowerCase();
    const matching = this.portal.faqs.filter(
      (faq) =>
        !term ||
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term),
    );

    const groups = new Map<string, typeof matching>();
    for (const faq of matching) {
      groups.set(faq.group, [...(groups.get(faq.group) ?? []), faq]);
    }

    return [...groups.entries()].map(([name, faqs]) => ({ name, faqs }));
  });

  protected readonly topics = [
    'Signing in or my account',
    'An application',
    'A payment or receipt',
    'A document or certificate',
    'An inspection appointment',
    'Something else',
  ];

  protected readonly supportForm = this.fb.nonNullable.group({
    topic: ['An application', Validators.required],
    reference: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  // --- Mock live chat -------------------------------------------------------
  protected readonly chatOpen = signal(false);
  protected readonly chatDraft = signal('');
  protected readonly chat = signal<ChatLine[]>([
    {
      from: 'AGENT',
      body: 'Hello! You are through to ASP support. How can I help you today?',
      time: this.now(),
    },
  ]);

  protected submitSupport(): void {
    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    setTimeout(() => {
      this.submitting.set(false);
      this.supportForm.reset({ topic: 'An application', reference: '', message: '' });

      this.toast.success('Support request sent', 'A support officer will respond within one working day.');
    }, 800);
  }

  protected toggleChat(): void {
    this.chatOpen.update((open) => !open);
  }

  protected sendChat(): void {
    const body = this.chatDraft().trim();
    if (!body) {
      return;
    }

    this.chat.update((lines) => [...lines, { from: 'ME', body, time: this.now() }]);
    this.chatDraft.set('');

    // Canned reply, so the mock chat behaves like a conversation rather than a
    // dead end. Clearly labelled as a demonstration in the UI.
    setTimeout(() => {
      this.chat.update((lines) => [
        ...lines,
        {
          from: 'AGENT',
          body:
            'Thanks — a support officer will pick this up shortly. In the meantime, the FAQs on ' +
            'this page cover most account and payment questions.',
          time: this.now(),
        },
      ]);
    }, 1200);
  }

  private now(): string {
    return new Date().toTimeString().slice(0, 5);
  }
}
