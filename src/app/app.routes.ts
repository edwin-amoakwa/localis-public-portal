import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

const SUFFIX = ' · Assembly Services Portal';

/**
 * The portal is an application, not a content site — the public-facing
 * information pages live in the separate ASP website. So the index page is the
 * sign-in screen, and everything else sits behind it.
 */
export const routes: Routes = [
  // --- Entry point ----------------------------------------------------------
  {
    path: '',
    pathMatch: 'full',
    title: 'Sign in' + SUFFIX,
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'login',
    title: 'Sign in' + SUFFIX,
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    title: 'Create an account' + SUFFIX,
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.RegisterPage),
  },

  // --- Signed-in application ------------------------------------------------
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard' + SUFFIX,
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardPage),
      },
      {
        path: 'services',
        title: 'Available services' + SUFFIX,
        loadComponent: () =>
          import('./features/catalogue/service-list/service-list').then((m) => m.ServiceListPage),
      },
      {
        path: 'services/:slug',
        title: 'Service details' + SUFFIX,
        loadComponent: () =>
          import('./features/catalogue/service-detail/service-detail').then(
            (m) => m.ServiceDetailPage,
          ),
      },
      {
        path: 'services/:slug/apply',
        title: 'Apply' + SUFFIX,
        loadComponent: () => import('./features/catalogue/apply/apply').then((m) => m.ApplyPage),
      },
      {
        path: 'applications',
        title: 'My applications' + SUFFIX,
        loadComponent: () =>
          import('./features/applications/list/application-list').then((m) => m.ApplicationListPage),
      },
      {
        path: 'applications/:id',
        title: 'Application' + SUFFIX,
        loadComponent: () =>
          import('./features/applications/detail/application-detail').then(
            (m) => m.ApplicationDetailPage,
          ),
      },
      {
        path: 'payments',
        title: 'Payments' + SUFFIX,
        loadComponent: () =>
          import('./features/payments/list/payment-list').then((m) => m.PaymentListPage),
      },
      {
        path: 'payments/pay/:id',
        title: 'Make a payment' + SUFFIX,
        loadComponent: () => import('./features/payments/pay/pay').then((m) => m.PayPage),
      },
      {
        path: 'payments/receipt/:id',
        title: 'Receipt' + SUFFIX,
        loadComponent: () =>
          import('./features/payments/receipt/receipt').then((m) => m.ReceiptPage),
      },
      {
        path: 'documents',
        title: 'Documents' + SUFFIX,
        loadComponent: () => import('./features/documents/documents').then((m) => m.DocumentsPage),
      },
      {
        path: 'appointments',
        title: 'Appointments' + SUFFIX,
        loadComponent: () =>
          import('./features/appointments/appointments').then((m) => m.AppointmentsPage),
      },
      {
        path: 'notifications',
        title: 'Notifications' + SUFFIX,
        loadComponent: () =>
          import('./features/notifications/notifications').then((m) => m.NotificationsPage),
      },
      {
        path: 'messages',
        title: 'Messages' + SUFFIX,
        loadComponent: () => import('./features/messages/messages').then((m) => m.MessagesPage),
      },
      {
        path: 'profile',
        title: 'Profile' + SUFFIX,
        loadComponent: () => import('./features/profile/profile').then((m) => m.ProfilePage),
      },
      {
        path: 'help',
        title: 'Help centre' + SUFFIX,
        loadComponent: () => import('./features/help/help').then((m) => m.HelpPage),
      },
      {
        path: 'settings',
        title: 'Settings' + SUFFIX,
        loadComponent: () => import('./features/settings/settings').then((m) => m.SettingsPage),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
