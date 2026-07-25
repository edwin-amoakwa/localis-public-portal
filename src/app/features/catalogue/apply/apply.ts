import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { StepsModule } from 'primeng/steps';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuItem, MessageService } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application } from '../../../core/models';

interface UploadedFile {
  name: string;
  size: string;
  requirement: string;
}

/**
 * The application wizard.
 *
 * Steps are built from the service definition, so a service that needs no
 * business or property details simply does not show those steps. Uploads are
 * simulated: choosing a file records its name and size without sending it
 * anywhere.
 */
@Component({
  selector: 'app-apply',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    StepsModule,
    TagModule,
    CheckboxModule,
  ],
  templateUrl: './apply.html',
  styleUrl: './apply.scss',
})
export class ApplyPage {
  private readonly fb = inject(FormBuilder);
  private readonly portal = inject(PortalService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);

  readonly slug = input.required<string>();

  protected readonly service = computed(() => this.portal.serviceBySlug(this.slug()));
  protected readonly user = this.auth.user;
  protected readonly businesses = this.portal.businesses;
  protected readonly properties = this.portal.properties;

  protected readonly stepIndex = signal(0);
  protected readonly submitting = signal(false);
  protected readonly submitted = signal<Application | null>(null);
  protected readonly uploads = signal<UploadedFile[]>([]);

  protected readonly totalFee = computed(() =>
    (this.service()?.fees ?? []).reduce((sum, fee) => sum + fee.amount, 0),
  );

  // --- Forms ----------------------------------------------------------------

  protected readonly applicantForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    ghanaCardNo: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    digitalAddress: [''],
  });

  protected readonly businessForm = this.fb.nonNullable.group({
    businessId: [''],
    businessName: ['', Validators.required],
    category: ['', Validators.required],
    registrationNo: [''],
    tinNo: [''],
    location: ['', Validators.required],
    digitalAddress: [''],
    employees: [1],
  });

  protected readonly propertyForm = this.fb.nonNullable.group({
    propertyId: [''],
    description: ['', Validators.required],
    use: ['Residential', Validators.required],
    location: ['', Validators.required],
    digitalAddress: [''],
  });

  protected readonly detailForm = this.fb.nonNullable.group({
    subject: ['', [Validators.required, Validators.minLength(4)]],
    preferredDate: [null as Date | null],
    notes: [''],
  });

  protected readonly confirmForm = this.fb.nonNullable.group({
    declaration: [false, Validators.requiredTrue],
  });

  protected readonly propertyUses = ['Residential', 'Commercial', 'Industrial', 'Mixed use'];

  /** The steps this particular service needs, in order. */
  protected readonly steps = computed<{ key: string; label: string }[]>(() => {
    const service = this.service();
    const steps = [{ key: 'applicant', label: 'Applicant' }];

    if (service?.needsBusinessInfo) {
      steps.push({ key: 'business', label: 'Business' });
    }
    if (service?.needsPropertyInfo) {
      steps.push({ key: 'property', label: 'Property' });
    }

    steps.push(
      { key: 'details', label: 'Details' },
      { key: 'documents', label: 'Documents' },
      { key: 'review', label: 'Review' },
      { key: 'confirm', label: 'Confirmation' },
    );

    return steps;
  });

  protected readonly stepItems = computed<MenuItem[]>(() =>
    this.steps().map((step) => ({ label: step.label })),
  );

  protected readonly currentStep = computed(() => this.steps()[this.stepIndex()]?.key ?? 'applicant');
  protected readonly isLastInput = computed(() => this.currentStep() === 'review');

  constructor() {
    // Prefill from the signed-in profile — people should not retype what the
    // portal already knows about them.
    const user = this.auth.user();
    if (user) {
      this.applicantForm.patchValue({
        fullName: `${user.firstName} ${user.lastName}`,
        ghanaCardNo: user.ghanaCardNo,
        phone: user.phone,
        email: user.email,
        address: user.residentialAddress ?? '',
        digitalAddress: user.digitalAddress ?? '',
      });
    }
  }

  // --- Navigation -----------------------------------------------------------

  protected next(): void {
    const form = this.formForStep(this.currentStep());

    if (form && form.invalid) {
      form.markAllAsTouched();
      this.messages.add({
        severity: 'warn',
        summary: 'Some details are missing',
        detail: 'Complete the highlighted fields before continuing.',
        life: 3500,
      });
      return;
    }

    if (this.currentStep() === 'documents' && this.uploads().length === 0) {
      this.messages.add({
        severity: 'warn',
        summary: 'No documents attached',
        detail: 'Attach at least one supporting document before continuing.',
        life: 3500,
      });
      return;
    }

    this.stepIndex.update((i) => Math.min(i + 1, this.steps().length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected back(): void {
    this.stepIndex.update((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected goTo(index: number): void {
    // Only allow jumping backwards; forward moves must pass validation.
    if (index <= this.stepIndex()) {
      this.stepIndex.set(index);
    }
  }

  private formForStep(key: string): FormGroup | null {
    switch (key) {
      case 'applicant':
        return this.applicantForm;
      case 'business':
        return this.businessForm;
      case 'property':
        return this.propertyForm;
      case 'details':
        return this.detailForm;
      default:
        return null;
    }
  }

  // --- Prefill helpers ------------------------------------------------------

  protected useBusiness(id: string): void {
    const business = this.businesses().find((b) => b.id === id);
    if (!business) {
      return;
    }

    this.businessForm.patchValue({
      businessId: business.id,
      businessName: business.businessName,
      category: business.category,
      registrationNo: business.registrationNo,
      tinNo: business.tinNo,
      location: business.location,
      digitalAddress: business.digitalAddress,
      employees: business.employees,
    });
  }

  protected useProperty(id: string): void {
    const property = this.properties().find((p) => p.id === id);
    if (!property) {
      return;
    }

    this.propertyForm.patchValue({
      propertyId: property.id,
      description: property.description,
      use: property.use,
      location: property.location,
      digitalAddress: property.digitalAddress,
    });
  }

  // --- Uploads --------------------------------------------------------------

  /** Simulated upload — the file never leaves the browser. */
  protected onFileChosen(event: Event, requirement: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.uploads.update((list) => [
      ...list.filter((u) => u.requirement !== requirement),
      {
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        requirement,
      },
    ]);

    this.messages.add({
      severity: 'success',
      summary: 'Document attached',
      detail: file.name,
      life: 2500,
    });

    input.value = '';
  }

  protected uploadFor(requirement: string): UploadedFile | undefined {
    return this.uploads().find((u) => u.requirement === requirement);
  }

  protected removeUpload(requirement: string): void {
    this.uploads.update((list) => list.filter((u) => u.requirement !== requirement));
  }

  // --- Submission -----------------------------------------------------------

  protected submit(): void {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }

    const service = this.service();
    if (!service) {
      return;
    }

    this.submitting.set(true);

    setTimeout(() => {
      const application = this.portal.submitApplication(
        service,
        this.detailForm.controls.subject.value,
        this.uploads().map((u) => u.name),
      );

      this.submitting.set(false);
      this.submitted.set(application);
      this.stepIndex.set(this.steps().length - 1);

      this.messages.add({
        severity: 'success',
        summary: 'Application submitted',
        detail: `Your reference is ${application.applicationNumber}.`,
        life: 6000,
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  }

  protected payNow(): void {
    const application = this.submitted();
    if (application?.invoiceId) {
      this.router.navigate(['/app/payments/pay', application.invoiceId]);
    }
  }
}
