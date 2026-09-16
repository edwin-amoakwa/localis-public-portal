import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { StepsModule } from 'primeng/steps';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuItem } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, NatureOfBusiness } from '../../../core/models';
import { PermitApplicationRecord } from '../../../core/models/permit';
import { LookupCategory, LookupRegion, PermitService } from '../../../core/services/permit.service';
import { ToastService } from '../../../core/services/toast.service';

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
 *
 * The Business Operating Permit is live: its business step picks the real
 * region, Assembly and category, and submitting files the application on
 * localis-api. Every other service still runs on the portal's mock data.
 */
@Component({
  selector: 'app-apply',
  imports: [
    FormsModule,
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
  private readonly toast = inject(ToastService);
  private readonly permits = inject(PermitService);

  readonly slug = input.required<string>();

  protected readonly service = computed(() => this.portal.serviceBySlug(this.slug()));
  protected readonly user = this.auth.user;
  protected readonly businesses = this.portal.businesses;
  protected readonly properties = this.portal.properties;

  protected readonly stepIndex = signal(0);
  protected readonly submitting = signal(false);
  protected readonly submitted = signal<Application | null>(null);
  protected readonly submittedRecord = signal<PermitApplicationRecord | null>(null);

  /** Services that file on localis-api rather than on mock data. */
  protected readonly isLive = computed(() => this.service()?.id === 'svc-bop');

  protected readonly liveRegions = signal<LookupRegion[]>([]);
  protected readonly regionId = signal<string | null>(null);
  protected readonly liveAssemblies = computed(
    () => this.liveRegions().find((r) => r.id === this.regionId())?.assemblies ?? [],
  );
  protected readonly categories = signal<LookupCategory[]>([]);
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
    assemblyId: [''],
    categoryId: [''],
    businessName: ['', Validators.required],
    ownershipType: ['', Validators.required],
    category: ['', Validators.required],
    registrationNo: [''],
    tinNo: [''],
    natureOfBusiness: ['' as NatureOfBusiness | '', Validators.required],
    coreBusinessDescription: [''],
    yearsInOperation: [0, [Validators.min(0)]],
    monthsInOperation: [0, [Validators.min(0), Validators.max(11)]],
    regionalPresence: [[] as string[]],
    location: ['', Validators.required],
    postalAddress: [''],
    digitalAddress: [''],
    website: [''],
    employees: [1],
  });

  /** Values are localis-api's OwnershipType names. */
  protected readonly ownershipTypes = [
    { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
    { value: 'PARTNERSHIP', label: 'Partnership' },
    { value: 'COMPANY_LIMITED_BY_SHARES', label: 'Company Limited by Shares' },
    { value: 'COMPANY_LIMITED_BY_GUARANTEE', label: 'Company Limited by Guarantee' },
    { value: 'EXTERNAL_COMPANY', label: 'External Company' },
    { value: 'COOPERATIVE', label: 'Co-operative' },
    { value: 'NGO', label: 'Non-Governmental Organisation' },
    { value: 'OTHER', label: 'Other' },
  ];

  protected readonly natureOptions: { value: NatureOfBusiness; label: string }[] = [
    { value: 'PRODUCTS', label: 'Products' },
    { value: 'SERVICES', label: 'Services' },
    { value: 'BOTH', label: 'Products & services' },
    { value: 'OTHER', label: 'Other' },
  ];

  protected readonly regionNames = computed(() =>
    this.liveRegions().length ? this.liveRegions().map((r) => r.regionName) : this.portal.regions.map((r) => r.name),
  );

  protected readonly propertyForm = this.fb.nonNullable.group({
    propertyId: [''],
    description: ['', Validators.required],
    use: ['Residential', Validators.required],
    location: ['', Validators.required],
    digitalAddress: [''],
  });

  protected readonly detailForm = this.fb.nonNullable.group({
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

  /** A renewal carries the business forward, so it must be picked rather than retyped. */
  protected readonly isRenewal = computed(() => this.service()?.isRenewal ?? false);

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

    this.loadRegions();

    // The live service must name a real Assembly and category.
    effect(() => {
      const live = this.isLive();
      for (const control of [this.businessForm.controls.assemblyId, this.businessForm.controls.categoryId]) {
        control.setValidators(live ? Validators.required : null);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });

    this.businessForm.controls.assemblyId.valueChanges.subscribe((assemblyId) => this.loadCategories(assemblyId));
    this.businessForm.controls.categoryId.valueChanges.subscribe((categoryId) => {
      const category = this.categories().find((c) => c.id === categoryId);
      if (category) {
        this.businessForm.controls.category.setValue(category.categoryName);
      }
    });

    // Renewals reuse an existing business record — pick the applicant's own
    // one automatically rather than leaving a blank form for something that,
    // by definition, must already exist.
    effect(() => {
      const businesses = this.businesses();
      if (this.isRenewal() && businesses.length > 0 && !this.businessForm.value.businessId) {
        this.useBusiness(businesses[0].id);
      }
    });
  }

  // --- Navigation -----------------------------------------------------------

  protected next(): void {
    const form = this.formForStep(this.currentStep());

    if (form && form.invalid) {
      form.markAllAsTouched();
      this.toast.warn('Some details are missing', 'Complete the highlighted fields before continuing.');
      return;
    }

    if (this.currentStep() === 'business' && this.isRenewal() && !this.businessForm.value.businessId) {
      this.toast.warn(
        'Select a business',
        'A renewal applies to a business already on file — choose which one you are renewing.',
      );
      return;
    }

    if (this.currentStep() === 'documents' && this.uploads().length === 0) {
      this.toast.warn('No documents attached', 'Attach at least one supporting document before continuing.');
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

  // --- Reference data (live service) ---------------------------------------

  private async loadRegions(): Promise<void> {
    try {
      this.liveRegions.set(await this.permits.regions());
    } catch (error) {
      this.toast.error('Could not load the list of Assemblies', error);
    }
  }

  protected chooseRegion(regionId: string | null): void {
    this.regionId.set(regionId);
    this.businessForm.controls.assemblyId.setValue('');
  }

  private async loadCategories(assemblyId: string): Promise<void> {
    this.categories.set([]);
    this.businessForm.patchValue({ categoryId: '', category: '' }, { emitEvent: false });
    if (!assemblyId) {
      return;
    }
    try {
      this.categories.set(await this.permits.categories(assemblyId));
    } catch (error) {
      this.toast.error('Could not load business categories', error);
    }
  }

  protected ownershipLabel(value?: string): string {
    return this.ownershipTypes.find((o) => o.value === value)?.label ?? '—';
  }

  protected assemblyName(assemblyId?: string): string {
    return this.liveAssemblies().find((a) => a.id === assemblyId)?.assemblyName ?? '—';
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
      ownershipType:
        this.ownershipTypes.find((o) => o.label === business.ownershipType || o.value === business.ownershipType)
          ?.value ?? 'OTHER',
      category: business.category,
      registrationNo: business.registrationNo,
      tinNo: business.tinNo,
      natureOfBusiness: business.natureOfBusiness,
      coreBusinessDescription: business.coreBusinessDescription ?? '',
      yearsInOperation: business.yearsInOperation,
      monthsInOperation: business.monthsInOperation,
      regionalPresence: business.regionalPresence,
      location: business.location,
      postalAddress: business.postalAddress ?? '',
      digitalAddress: business.digitalAddress,
      website: business.website ?? '',
      employees: business.employees,
    });
  }

  /** Toggles a region in the multi-select "also operates in" list. */
  protected toggleRegion(region: string): void {
    const control = this.businessForm.controls.regionalPresence;
    const current = control.value;
    control.setValue(
      current.includes(region) ? current.filter((r) => r !== region) : [...current, region],
    );
  }

  protected hasRegion(region: string): boolean {
    return this.businessForm.value.regionalPresence?.includes(region) ?? false;
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

    this.toast.success('Document attached', file.name);

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

    if (this.isLive()) {
      this.submitLive();
      return;
    }

    setTimeout(() => {
      let businessId: string | undefined;

      if (service.needsBusinessInfo) {
        const { businessId: existingId, ...businessDetails } = this.businessForm.getRawValue();
        const { assemblyId: _assembly, categoryId: _category, ...mockDetails } = businessDetails;
        const business = this.portal.saveBusiness({
          ...mockDetails,
          ownershipType: this.ownershipLabel(mockDetails.ownershipType),
          natureOfBusiness: mockDetails.natureOfBusiness || 'OTHER',
          id: existingId || undefined,
        });
        businessId = business.id;
      }

      const application = this.portal.submitApplication(
        service,
        this.mockSubject(service.name),
        this.uploads().map((u) => u.name),
        businessId,
      );

      this.submitting.set(false);
      this.submitted.set(application);
      this.stepIndex.set(this.steps().length - 1);

      this.toast.success('Application submitted', `Your reference is ${application.applicationNumber}.`);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  }

  /** Mock services still title an application; the live one is identified by its number. */
  private mockSubject(serviceName: string): string {
    const business = this.businessForm.value.businessName?.trim();
    const property = this.propertyForm.value.description?.trim();
    return [business || property, serviceName].filter(Boolean).join(' — ');
  }

  private async submitLive(): Promise<void> {
    const business = this.businessForm.getRawValue();
    try {
      const response = await this.permits.submit({
        assemblyId: business.assemblyId,
        businessCategoryId: business.categoryId,
        businessName: business.businessName,
        ownershipType: business.ownershipType,
        registrationNo: business.registrationNo,
        tinNo: business.tinNo,
        natureOfBusiness: business.natureOfBusiness || undefined,
        coreBusinessDescription: business.coreBusinessDescription,
        yearsInOperation: business.yearsInOperation,
        monthsInOperation: business.monthsInOperation,
        regionalPresence: business.regionalPresence,
        location: business.location,
        postalAddress: business.postalAddress,
        digitalAddress: business.digitalAddress,
        website: business.website,
        noOfEmployees: business.employees,
      });

      this.submittedRecord.set(response.data!);
      this.stepIndex.set(this.steps().length - 1);
      this.toast.success('Application submitted', response.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      this.toast.error('Could not submit the application', error);
    } finally {
      this.submitting.set(false);
    }
  }

  protected payNow(): void {
    const application = this.submitted();
    if (application?.invoiceId) {
      this.router.navigate(['/app/payments/pay', application.invoiceId]);
    }
  }
}
