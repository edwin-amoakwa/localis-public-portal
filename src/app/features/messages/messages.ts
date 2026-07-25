import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { PortalService } from '../../core/services/portal.service';
import { AuthService } from '../../core/services/auth.service';

/** A simple inbox: threads on the left, the conversation on the right. */
@Component({
  selector: 'app-messages',
  imports: [FormsModule, ButtonModule, TextareaModule, AvatarModule],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class MessagesPage {
  private readonly portal = inject(PortalService);
  private readonly auth = inject(AuthService);
  private readonly messages = inject(MessageService);

  protected readonly threads = this.portal.threads;
  protected readonly user = this.auth.user;

  protected readonly selectedId = signal<string>(this.portal.threads()[0]?.id ?? '');
  protected readonly draft = signal('');

  /** Shown on small screens, where list and conversation cannot sit together. */
  protected readonly showConversation = signal(false);

  protected readonly selected = computed(() =>
    this.threads().find((t) => t.id === this.selectedId()),
  );

  protected select(id: string): void {
    this.selectedId.set(id);
    this.showConversation.set(true);
    this.portal.markThreadRead(id);
  }

  protected backToList(): void {
    this.showConversation.set(false);
  }

  protected send(): void {
    const body = this.draft().trim();
    const thread = this.selected();

    if (!body || !thread) {
      return;
    }

    this.portal.replyToThread(thread.id, body);
    this.draft.set('');

    this.messages.add({
      severity: 'success',
      summary: 'Reply sent',
      detail: `Your message has been sent to ${thread.officer}.`,
      life: 3000,
    });
  }

  protected initials(author: string): string {
    return author
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }
}
