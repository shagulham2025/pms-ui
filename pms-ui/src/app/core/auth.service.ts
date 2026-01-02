import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { API_BASE } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'pms_token';

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // observable for components to react to auth state
  isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient, private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${API_BASE}/auth/login`;
    return this.http.post<{ accessToken: string }>(url, { username, password }).pipe(
      tap((res) => {
        if (res && res.accessToken) {
          try { localStorage.setItem(this.TOKEN_KEY, res.accessToken); } catch (e) {}
          this.store.dispatch(AuthActions.loginSuccess({ token: res.accessToken }));
        }
      }),
      map((res) => !!(res && res.accessToken)),
      catchError((err) => {
        this.store.dispatch(AuthActions.loginFailure({ error: err }));
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    try { localStorage.removeItem(this.TOKEN_KEY); } catch (e) {}
  }
}
