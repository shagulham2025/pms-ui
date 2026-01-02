import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE } from '../config/api.config';

export interface ApiOptions {
  skipAuth?: boolean;
  skipRefresh?: boolean; // kept for callers that want to mark refresh requests
  headers?: { [k: string]: string };
  params?: HttpParams | { [k: string]: any };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  private buildUrl(path: string): string {
    if (path.startsWith('http')) { return path; }
    // do not prepend API_BASE for static asset paths (served by the app)
    if (path.startsWith('/assert') || path.startsWith('/assets') || path.startsWith('/public')) {
      return path;
    }
    return `${API_BASE}${path}`;
  }

  private buildHeaders(opts?: ApiOptions): HttpHeaders {
    let hdrs = new HttpHeaders({ 'Content-Type': 'application/json', ...(opts?.headers || {}) });
    if (!opts?.skipAuth) {
      try {
        const token = localStorage.getItem('pms_refresh_token');
        const tokenType = localStorage.getItem('pms_token_type') || 'Bearer';
        if (token) {
          hdrs = hdrs.set('Authorization', `${tokenType} ${token}`);
        }
      } catch (e) {
        // ignore
      }
    }
    if (opts?.skipRefresh) {
      hdrs = hdrs.set('X-Skip-Refresh', '1');
    }
    return hdrs;
  }

  get<T>(path: string, opts?: ApiOptions): Observable<T> {
    const url = this.buildUrl(path);
    return this.http.get<T>(url, { headers: this.buildHeaders(opts), params: opts?.params }).pipe(
      catchError((err) => { throw err; })
    );
  }

  post<T>(path: string, body?: any, opts?: ApiOptions): Observable<T> {
    const url = this.buildUrl(path);
    return this.http.post<T>(url, body, { headers: this.buildHeaders(opts), params: opts?.params }).pipe(
      catchError((err) => { throw err; })
    );
  }

  put<T>(path: string, body?: any, opts?: ApiOptions): Observable<T> {
    const url = this.buildUrl(path);
    return this.http.put<T>(url, body, { headers: this.buildHeaders(opts), params: opts?.params }).pipe(
      catchError((err) => { throw err; })
    );
  }

  delete<T>(path: string, opts?: ApiOptions): Observable<T> {
    const url = this.buildUrl(path);
    return this.http.delete<T>(url, { headers: this.buildHeaders(opts), params: opts?.params }).pipe(
      catchError((err) => { throw err; })
    );
  }
}
