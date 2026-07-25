import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { PortalService } from '../../../core/services/portal.service';

/** Everything a person needs to know before starting an application. */
@Component({
  selector: 'app-service-detail',
  imports: [
    RouterLink,
    CurrencyPipe,
    ButtonModule,
    AccordionModule,
    PanelModule,
    TagModule,
    BreadcrumbModule,
  ],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetailPage {
  private readonly portal = inject(PortalService);

  /** Bound from the route through withComponentInputBinding-style `input()`. */
  readonly slug = input.required<string>();

  protected readonly service = computed(() => this.portal.serviceBySlug(this.slug()));
  protected readonly category = computed(() => {
    const service = this.service();
    return service ? this.portal.categoryById(service.categoryId) : undefined;
  });

  protected readonly totalFee = computed(() =>
    (this.service()?.fees ?? []).reduce((sum, fee) => sum + fee.amount, 0),
  );

  protected readonly crumbs = computed<MenuItem[]>(() => [
    { label: 'Services', routerLink: '/app/services' },
    { label: this.category()?.name ?? '' },
    { label: this.service()?.name ?? '' },
  ]);

  protected readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/dashboard' };
}
