import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';
import { Observable, of, throwError, Subject } from 'rxjs';
import { catchError, delay, map, tap, finalize, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { API_BASE } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'pms_token';
  private refreshInProgress = false;
  private refreshSubject = new Subject<string | null>();

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    try { return !!localStorage.getItem(this.TOKEN_KEY); } catch (e) { return false; }
  }

  // observable for components to react to auth state
  isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient, private store: Store, private api: ApiService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `/auth/login`;
    const detailsUrl = `/auth/login-user-details`;

    return this.api.post<{ accessToken?: string; refreshToken?: string; tokenType?: string }>(url, { username, password }, { skipAuth: true }).pipe(
      switchMap((res) => {
        // if login didn't return accessToken, treat as failure
        if (!res || !res.accessToken) {
          this.store.dispatch(AuthActions.loginFailure({ error: 'No access token' }));
          return of(false);
        }

        // persist tokens
        try {
          localStorage.setItem(this.TOKEN_KEY, res.accessToken);
          if (res.refreshToken) { localStorage.setItem('pms_refresh_token', res.refreshToken); }
          if (res.tokenType) { localStorage.setItem('pms_token_type', res.tokenType); }
        } catch (e) {}

        this.store.dispatch(AuthActions.loginSuccess({ token: res.accessToken }));

        // now fetch user details using returned token
        this.store.dispatch(AuthActions.loadUserDetails());
        const detailsBody: any = { username };
        return this.api.post<any>(detailsUrl, detailsBody).pipe(
          tap((resp) => {
            if (resp) {
              const envelope = resp as any;
              const output = envelope.outputData ?? envelope;
              const menuDetails = output?.MENU_DETAILS ?? [];
              const userVo = output?.USER_VO ?? output?.user ?? null;
              const roleNames: string[] = (userVo && userVo.roleNames) ? userVo.roleNames : (output?.roleNames ?? []);
              this.store.dispatch(AuthActions.loadUserDetailsSuccess({ menuDetails, user: userVo, roleNames }));
            }
          }),
          map(() => true),
          catchError((err) => {
            // keep login success even if user-details fail, but record failure
            this.store.dispatch(AuthActions.loadUserDetailsFailure({ error: err }));
            return of(true);
          })
        );
      }),
      catchError((err) => {
        this.store.dispatch(AuthActions.loginFailure({ error: err }));
        return throwError(() => err);
      })
    );
  }

  private getStoredToken(): string | null {
    try { return localStorage.getItem(this.TOKEN_KEY); } catch (e) { return null; }
  }

  getStoredRefreshToken(): string | null {
    try { return localStorage.getItem('pms_refresh_token'); } catch (e) { return null; }
  }

  isTokenExpiringWithin(token: string | null, minutes = 15): boolean {
    if (!token) { return true; }
    try {
      const parts = token.split('.');
      if (parts.length < 2) { return true; }
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload && (payload.exp || payload.expiration) ? Number(payload.exp || payload.expiration) : null;
      if (!exp) { return true; }
      const nowSec = Date.now() / 1000;
      return (exp <= (nowSec + minutes * 60));
    } catch (e) {
      return true;
    }
  }

  isTokenExpired(token: string | null, minutes = 15): boolean {
    return this.isTokenExpiringWithin(token, minutes);
  }

  /**
   * Ensure we have a valid (not-about-to-expire) access token.
   * Returns an observable that resolves to true when a valid token is available.
   * If the token is expiring within `minutes` it will call the refresh endpoint.
   */
  ensureValidToken(minutes = 15): Observable<boolean> {
    const token = this.getStoredToken();
    if (!token) {
      return of(false);
    }

    if (!this.isTokenExpiringWithin(token, minutes)) {
      return of(true);
    }

    if (this.refreshInProgress) {
      return this.refreshSubject.asObservable().pipe(
        map(t => !!t)
      );
    }

    this.refreshInProgress = true;
    const refreshUrl = `/auth/refresh`;
    const storedRefresh = this.getStoredRefreshToken();
    const body: any = storedRefresh ? { refreshToken: storedRefresh } : {};
    this.api.post<{ accessToken?: string; refreshToken?: string; tokenType?: string }>(refreshUrl, body, { skipAuth: true, skipRefresh: true }).pipe(
      catchError(() => of(null)),
      finalize(() => { this.refreshInProgress = false; })
    ).subscribe((res) => {
      const newToken = res?.accessToken ?? null;
      if (newToken) {
        try {
          localStorage.setItem(this.TOKEN_KEY, newToken);
          if (res?.refreshToken) { localStorage.setItem('pms_refresh_token', res.refreshToken); }
          if (res?.tokenType) { localStorage.setItem('pms_token_type', res.tokenType); }
        } catch (e) { }
        this.store.dispatch(AuthActions.loginSuccess({ token: newToken }));
        this.refreshSubject.next(newToken);
      } else {
        this.refreshSubject.next(null);
      }
    });

    return this.refreshSubject.asObservable().pipe(map(t => !!t));
  }

  logout(): void {
    const url = `/auth/logout`;
    // call backend logout endpoint (ApiService attaches Authorization header)
    this.api.post<any>(url, {}, { /* default: include auth */ }).pipe(
      catchError(() => of(null))
    ).subscribe(() => {
      this.store.dispatch(AuthActions.logout());
      try {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem('pms_refresh_token');
        localStorage.removeItem('pms_token_type');
      } catch (e) {}
    });
  }
}
