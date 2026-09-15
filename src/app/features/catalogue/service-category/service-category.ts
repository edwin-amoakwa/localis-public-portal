import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PortalService } from '../../../core/services/portal.service';
import { ServiceCategoryId } from '../../../core/models';

/** One category's services, as a list of names leading to each service's details. */
@Component({
  selector: 'app-service-category',
  imports: [RouterLink, ButtonModule],
  templateUrl: './service-category.html',
  styleUrls: ['./service-category.scss', '../catalogue.scss'],
})
export class ServiceCategoryPage {
  private readonly portal = inject(PortalService);

  /** Bound from the route. */
  readonly categoryId = input.required<string>();

  protected readonly category = computed(() => this.portal.categoryById(this.categoryId() as ServiceCategoryId));

  protected readonly services = computed(() =>
    this.category() ? this.portal.servicesByCategory(this.category()!.id) : [],
  );
}
