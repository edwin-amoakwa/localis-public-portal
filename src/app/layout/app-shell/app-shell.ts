import { Component, computed, inject } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';
import { AuthService } from '../../core/services/auth.service';
import { PortalService } from '../../core/services/portal.service';
import { UiService } from '../../core/services/ui.service';

interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: () => number;
}

/**
 * Chrome for the signed-in application: top bar, sidebar and the routed page.
 * Badge counts read straight off PortalService signals, so they move the moment
 * an application is filed or an invoice paid.
 */
@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LowerCasePipe,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    MenuModule,
    TooltipModule,
    SpeedDialModule,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly portal = inject(PortalService);
  protected readonly ui = inject(UiService);

  protected readonly user = this.auth.user;
  protected readonly unreadCount = computed(() => this.portal.unreadNotifications().length);
  protected readonly messageCount = this.portal.unreadMessageCount;

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-th-large', path: '/app/dashboard' },
    { label: 'Available Services', icon: 'pi pi-sitemap', path: '/app/services' },
    { label: 'My Applications', icon: 'pi pi-file-edit', path: '/app/applications' },
    { label: 'Payments', icon: 'pi pi-credit-card', path: '/app/payments' },
    { label: 'Documents', icon: 'pi pi-folder-open', path: '/app/documents' },
    { label: 'Appointments', icon: 'pi pi-calendar', path: '/app/appointments' },
    {
      label: 'Notifications',
      icon: 'pi pi-bell',
      path: '/app/notifications',
      badge: () => this.unreadCount(),
    },
    {
      label: 'Messages',
      icon: 'pi pi-comments',
      path: '/app/messages',
      badge: () => this.messageCount(),
    },
    { label: 'Support', icon: 'pi pi-question-circle', path: '/app/help' },
    { label: 'Settings', icon: 'pi pi-cog', path: '/app/settings' },
  ];

  /** Quick actions on the floating dial — the three things people do most. */
  protected readonly speedDialItems: MenuItem[] = [
    {
      label: 'Apply for a service',
      icon: 'pi pi-plus',
      command: () => this.router.navigate(['/app/services']),
    },
    {
      label: 'Make a payment',
      icon: 'pi pi-credit-card',
      command: () => this.router.navigate(['/app/payments']),
    },
    {
      label: 'Get help',
      icon: 'pi pi-question-circle',
      command: () => this.router.navigate(['/app/help']),
    },
  ];

  protected readonly profileMenu: MenuItem[] = [
    {
      label: 'My profile',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/app/profile']),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.router.navigate(['/app/settings']),
    },
    {
      label: 'Help centre',
      icon: 'pi pi-question-circle',
      command: () => this.router.navigate(['/app/help']),
    },
    { separator: true },
    { label: 'Sign out', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  protected toggleSidebar(): void {
    this.ui.mobileMenuOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.ui.mobileMenuOpen.set(false);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
