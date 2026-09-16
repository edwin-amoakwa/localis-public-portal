import { Injectable, computed, inject, signal } from '@angular/core';
import { readJson, writeJson } from './storage';
import { ApiService } from './api.service';
import { SessionStore } from './session-store';
import { UserProfile } from '../models';

export interface RegistrationDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ghanaCardNo: string;
  password: string;
  confirmPassword: string;
  /** The district chosen at sign-up; the server lists the applicant under it. */
  region: string;
  assembly: string;
  assemblyId: string;
}

/** localis-api's ApplicantResponse. Gson omits null fields, hence the optionals. */
interface ApplicantResponse {
  id: string;
  firstname: string;
  surname: string;
  emailAddress?: string;
  phoneNo: string;
  ghanaCardNo?: string;
  residentialAddress?: string;
  digitalAddress?: string;
}

interface SessionResponse {
  token: string;
  expiresInSeconds: number;
  user: ApplicantResponse;
}

/** What the portal remembers per applicant that the server does not hold. */
type PortalPreferences = Pick<UserProfile, 'region' | 'assembly' | 'accountType'>;

/**
 * Applicant authentication against localis-api. The bearer token and profile
 * are kept in localStorage (SessionStore) so a refresh does not sign you out;
 * authInterceptor attaches the token and signs out on a 401.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly _user = signal<UserProfile | null>(SessionStore.read<UserProfile>()?.user ?? null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly displayName = computed(() => {
    const user = this._user();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  /** @param identifier phone number or email address. Rejects with the server's error. */
  async login(identifier: string, password: string): Promise<UserProfile> {
    const response = await this.api.postAsync<SessionResponse>('/applicants/auth/login', {
      loginId: identifier.trim(),
      password,
    });
    return this.startSession(response.data!);
  }

  /** Creates the account (the server texts a welcome SMS) and signs straight in. */
  async register(details: RegistrationDetails): Promise<UserProfile> {
    const response = await this.api.postAsync<SessionResponse>('/applicants/auth/register', {
      firstname: details.firstName.trim(),
      surname: details.lastName.trim(),
      emailAddress: details.email.trim() || null,
      phoneNo: details.phone.trim(),
      ghanaCardNo: details.ghanaCardNo,
      assemblyId: details.assemblyId,
      password: details.password,
      confirmPassword: details.confirmPassword,
    });

    const session = response.data!;
    this.savePreferences(session.user.id, {
      region: details.region,
      assembly: details.assembly,
      accountType: 'BUSINESS_OWNER',
    });
    return this.startSession(session);
  }

  updateProfile(changes: Partial<UserProfile>): void {
    const current = this._user();
    const token = SessionStore.token();
    if (!current || !token) {
      return;
    }
    const user = { ...current, ...changes };
    this.savePreferences(user.id, { region: user.region, assembly: user.assembly, accountType: user.accountType });
    this._user.set(user);
    SessionStore.write({ token, user });
  }

  logout(): void {
    this._user.set(null);
    SessionStore.clear();
  }

  private startSession(session: SessionResponse): UserProfile {
    const applicant = session.user;
    const preferences = readJson<PortalPreferences>(this.preferencesKey(applicant.id));

    const user: UserProfile = {
      id: applicant.id,
      firstName: applicant.firstname,
      lastName: applicant.surname,
      email: applicant.emailAddress ?? '',
      phone: applicant.phoneNo,
      ghanaCardNo: applicant.ghanaCardNo ?? '',
      region: preferences?.region ?? '',
      assembly: preferences?.assembly ?? '',
      accountType: preferences?.accountType ?? 'BUSINESS_OWNER',
      digitalAddress: applicant.digitalAddress,
      residentialAddress: applicant.residentialAddress,
      avatarInitials: (applicant.firstname.charAt(0) + applicant.surname.charAt(0)).toUpperCase(),
      memberSince: new Date().toISOString().slice(0, 10),
    };

    this._user.set(user);
    SessionStore.write({ token: session.token, user });
    return user;
  }

  private savePreferences(applicantId: string, preferences: PortalPreferences): void {
    writeJson(this.preferencesKey(applicantId), preferences);
  }

  private preferencesKey(applicantId: string): string {
    return `asp.preferences.${applicantId}`;
  }
}
