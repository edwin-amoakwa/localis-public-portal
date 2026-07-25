import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { PortalService } from '../../core/services/portal.service';
import { AppNotification, NotificationKind } from '../../core/models';

/** Everything the Assembly has told you, newest first, on a timeline. */
@Component({
  selector: 'app-notifications',
  imports: [RouterLink, ButtonModule, TimelineModule, TagModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class NotificationsPage {
  private readonly portal = inject(PortalService);

  protected readonly filter = signal<'all' | 'unread'>('all');

  protected readonly notifications = computed(() => {
    const list = this.portal.notifications();
    return this.filter() === 'unread' ? list.filter((n) => !n.read) : list;
  });

  protected readonly unreadCount = computed(() => this.portal.unreadNotifications().length);

  protected kindLabel(kind: NotificationKind): string {
    return {
      APPLICATION: 'Application',
      PAYMENT: 'Payment',
      INSPECTION: 'Inspection',
      PERMIT: 'Permit',
      ANNOUNCEMENT: 'Announcement',
    }[kind];
  }

  protected kindIcon(kind: NotificationKind): string {
    return {
      APPLICATION: 'pi pi-file-edit',
      PAYMENT: 'pi pi-credit-card',
      INSPECTION: 'pi pi-search',
      PERMIT: 'pi pi-verified',
      ANNOUNCEMENT: 'pi pi-megaphone',
    }[kind];
  }

  protected kindTint(kind: NotificationKind): string {
    return {
      APPLICATION: 'tint-blue',
      PAYMENT: 'tint-green',
      INSPECTION: 'tint-gold',
      PERMIT: 'tint-green',
      ANNOUNCEMENT: 'tint-grey',
    }[kind];
  }

  protected markRead(notification: AppNotification): void {
    if (!notification.read) {
      this.portal.markNotificationRead(notification.id);
    }
  }

  protected markAllRead(): void {
    this.portal.markAllNotificationsRead();
  }

  protected setFilter(value: 'all' | 'unread'): void {
    this.filter.set(value);
  }
}
