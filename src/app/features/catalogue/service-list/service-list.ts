import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { PortalService } from '../../../core/services/portal.service';
import { ServiceCategoryId } from '../../../core/models';

/** The service catalogue, grouped by category with a live text filter. */
@Component({
  selector: 'app-service-list',
  imports: [RouterLink, FormsModule, ButtonModule, InputTextModule, TagModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss',
})
export class ServiceListPage {
  protected readonly portal = inject(PortalService);

  protected readonly term = signal('');
  protected readonly activeCategory = signal<ServiceCategoryId | 'all'>('all');

  /** Categories with their services, after the search term and chip filter. */
  protected readonly groups = computed(() => {
    const term = this.term().trim().toLowerCase();
    const category = this.activeCategory();

    return this.portal.categories
      .filter((c) => category === 'all' || c.id === category)
      .map((c) => ({
        category: c,
        services: this.portal.servicesByCategory(c.id).filter((s) => {
          if (!term) {
            return true;
          }
          return (
            s.name.toLowerCase().includes(term) ||
            s.summary.toLowerCase().includes(term) ||
            c.name.toLowerCase().includes(term)
          );
        }),
      }))
      .filter((group) => group.services.length > 0);
  });

  protected readonly matchCount = computed(() =>
    this.groups().reduce((sum, group) => sum + group.services.length, 0),
  );

  protected setCategory(id: ServiceCategoryId | 'all'): void {
    this.activeCategory.set(id);
  }

  protected clear(): void {
    this.term.set('');
    this.activeCategory.set('all');
  }
}
