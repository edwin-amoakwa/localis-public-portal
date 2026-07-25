import { Injectable, computed, signal } from '@angular/core';
import { CURRENT_USER } from '../data/mock.data';
import { readJson, remove, writeJson } from './storage';
import { AccountType, UserProfile } from '../models';

const STORAGE_KEY = 'asp.session';

/**
 * Mock authentication.
 *
 * There is no auth server in this build: signing in or registering simply marks
 * the session as authenticated and hands back the demo persona. The session is
 * kept in localStorage so a page refresh does not throw you out mid-demo.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<UserProfile | null>(this.restore());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly displayName = computed(() => {
    const user = this._user();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  /** Any credentials are accepted — this is a UI-only build. */
  login(email?: string): UserProfile {
    const user: UserProfile = { ...CURRENT_USER, email: email?.trim() || CURRENT_USER.email };
    this.persist(user);
    return user;
  }

  /** Registration takes the details given and drops straight into the app. */
  register(details: Partial<UserProfile> & { accountType: AccountType }): UserProfile {
    const first = details.firstName?.trim() || CURRENT_USER.firstName;
    const last = details.lastName?.trim() || CURRENT_USER.lastName;

    const user: UserProfile = {
      ...CURRENT_USER,
      ...details,
      firstName: first,
      lastName: last,
      avatarInitials: (first.charAt(0) + last.charAt(0)).toUpperCase(),
      memberSince: new Date().toISOString().slice(0, 10),
    };

    this.persist(user);
    return user;
  }

  updateProfile(changes: Partial<UserProfile>): void {
    const current = this._user();
    if (!current) {
      return;
    }
    this.persist({ ...current, ...changes });
  }

  logout(): void {
    this._user.set(null);
    remove(STORAGE_KEY);
  }

  private persist(user: UserProfile): void {
    this._user.set(user);
    writeJson(STORAGE_KEY, user);
  }

  private restore(): UserProfile | null {
    return readJson<UserProfile>(STORAGE_KEY);
  }
}
