import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PortalService } from '../../../core/services/portal.service';
import { AssemblyService } from '../../../core/models';

/**
 * The service catalogue: a search box and one tile per category. Typing swaps
 * the tiles for a flat list of matching services. The search term lives in the
 * URL (?q=) so coming back from a service restores the results.
 */
@Component({
  selector: 'app-service-list',
  imports: [RouterLink, InputTextModule],
  templateUrl: './service-list.html',
  styleUrls: ['./service-list.scss', '../catalogue.scss'],
})
export class ServiceListPage {
  protected readonly portal = inject(PortalService);
  private readonly router = inject(Router);

  /** Bound from the ?q= query parameter. */
  readonly q = input<string>();

  protected readonly term = computed(() => (this.q() ?? '').trim());

  protected readonly tiles = computed(() =>
    this.portal.categories.map((category) => ({
      category,
      count: this.portal.servicesByCategory(category.id).length,
    })),
  );

  protected readonly results = computed(() => {
    const term = this.term().toLowerCase();
    if (!term) {
      return [];
    }
    return this.portal.services.filter(
      (s) => s.name.toLowerCase().includes(term) || s.summary.toLowerCase().includes(term),
    );
  });

  protected search(value: string): void {
    this.router.navigate([], {
      queryParams: { q: value ? value : null },
      replaceUrl: true,
    });
  }

  protected categoryName(service: AssemblyService): string {
    return this.portal.categoryById(service.categoryId)?.name ?? '';
  }

  /** Splits a name around the search term so the match can be highlighted safely. */
  protected parts(text: string): { text: string; match: boolean }[] {
    const term = this.term();
    if (!term) {
      return [{ text, match: false }];
    }
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index < 0) {
      return [{ text, match: false }];
    }
    return [
      { text: text.slice(0, index), match: false },
      { text: text.slice(index, index + term.length), match: true },
      { text: text.slice(index + term.length), match: false },
    ].filter((p) => p.text);
  }
}
