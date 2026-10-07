import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, shareReplay, tap } from 'rxjs';

const AUTH_URL = 'https://dummyjson.com/auth';
const STORAGE_KEY = 'webshop.auth';
const EXPIRES_IN_MINS = 30;

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = signal<AuthResponse | null>(this.restore());
  private refreshing$: Observable<AuthResponse> | null = null;

  readonly isLoggedIn = computed(() => this.tokens() !== null);

  get accessToken(): string | null {
    return this.tokens()?.accessToken ?? null;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${AUTH_URL}/login`, { username, password, expiresInMins: EXPIRES_IN_MINS })
      .pipe(tap((res) => this.store(res)));
  }

  // Concurrent callers share one refresh request.
  refresh(): Observable<AuthResponse> {
    if (!this.refreshing$) {
      this.refreshing$ = this.http
        .post<AuthResponse>(`${AUTH_URL}/refresh`, {
          refreshToken: this.tokens()?.refreshToken,
          expiresInMins: EXPIRES_IN_MINS,
        })
        .pipe(
          tap((res) => this.store(res)),
          finalize(() => (this.refreshing$ = null)),
          shareReplay(1),
        );
    }
    return this.refreshing$;
  }

  logout(): void {
    this.tokens.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private store({ accessToken, refreshToken }: AuthResponse): void {
    const value = { accessToken, refreshToken };
    this.tokens.set(value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

  private restore(): AuthResponse | null {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
