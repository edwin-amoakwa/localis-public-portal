import { Injectable, inject } from '@angular/core';
import { ApiResponse, ApiService } from './api.service';
import { PermitApplicationRecord } from '../models/permit';

export interface LookupAssembly {
  id: string;
  assemblyName: string;
  assemblyCode: string;
}

export interface LookupRegion {
  id: string;
  regionName: string;
  assemblies: LookupAssembly[];
}

export interface LookupCategory {
  id: string;
  categoryName: string;
  sector?: string;
}

/** Body of POST /applicant/applications — mirrors localis-api's PermitApplicationRequest. */
export interface PermitApplicationRequest {
  assemblyId: string;
  businessCategoryId: string;
  businessName: string;
  ownershipType: string;
  registrationNo?: string;
  tinNo?: string;
  natureOfBusiness?: string;
  coreBusinessDescription?: string;
  yearsInOperation?: number;
  monthsInOperation?: number;
  regionalPresence?: string[];
  location: string;
  postalAddress?: string;
  digitalAddress?: string;
  website?: string;
  noOfEmployees?: number;
}

/** The applicant's Business Operating Permit applications on localis-api. */
@Injectable({ providedIn: 'root' })
export class PermitService {
  private readonly api = inject(ApiService);
  private regionsCache: Promise<LookupRegion[]> | null = null;

  regions(): Promise<LookupRegion[]> {
    this.regionsCache ??= this.api.getData<LookupRegion[]>('/lookup/regions').catch((error) => {
      this.regionsCache = null;
      throw error;
    });
    return this.regionsCache;
  }

  categories(assemblyId: string): Promise<LookupCategory[]> {
    return this.api.getData<LookupCategory[]>(`/lookup/assemblies/${assemblyId}/categories`);
  }

  myApplications(): Promise<PermitApplicationRecord[]> {
    return this.api.getData<PermitApplicationRecord[]>('/applicant/applications');
  }

  application(id: string): Promise<PermitApplicationRecord> {
    return this.api.getData<PermitApplicationRecord>(`/applicant/applications/${id}`);
  }

  submit(request: PermitApplicationRequest): Promise<ApiResponse<PermitApplicationRecord>> {
    return this.api.postAsync<PermitApplicationRecord>('/applicant/applications', request);
  }

  payByMobileMoney(id: string, mobileMoneyNumber: string): Promise<ApiResponse<PermitApplicationRecord>> {
    return this.api.postAsync<PermitApplicationRecord>(`/applicant/applications/${id}/pay`, { mobileMoneyNumber });
  }

  /** The permit PDF, base64-encoded. */
  permitPdf(id: string): Promise<string> {
    return this.api.getData<string>(`/applicant/applications/${id}/permit`);
  }
}
