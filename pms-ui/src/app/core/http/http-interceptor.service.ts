import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../notification.service';

@Injectable({ providedIn: 'root' })
export class HttpInterceptorService {

  constructor(private notification: NotificationService) {}

  getAuthToken(): string | null {
    try {
      // prefer pms_token but fallback to older key if present
      return localStorage.getItem('pms_token') || localStorage.getItem('auth_token');
    } catch (e) {
      return null;
    }
  }

  attachAuthHeader<T>(req: HttpRequest<T>): HttpRequest<T> {
    const token = this.getAuthToken();
    if (token) {
      return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return req;
  }

  setAuthToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem('pms_token', token);
      } else {
        localStorage.removeItem('pms_token');
      }
    } catch (e) {
      // ignore
    }
  }

  logRequest(req: HttpRequest<any>): void {
    try {
      console.debug('[HTTP] Request ->', req.method, req.urlWithParams);
    } catch (e) {
      // ignore
    }
  }

  logResponse(res: HttpResponse<any>, elapsedMs: number): void {
    try {
      console.debug('[HTTP] Response <-', res.status, res.url, `${elapsedMs}ms`);
    } catch (e) {
      // ignore
    }
  }

  handleError(err: unknown): void {
    try {
      if (err instanceof HttpErrorResponse) {
        console.error('[HTTP] Error', err.status, err.message, err.error);
        // network error (status 0) or server errors
        if (err.status === 0) {
          this.notification.showError('Network error — please check your connection.');
        } else if (err.status >= 500) {
          this.notification.showError('Server error occurred. Please try again later.');
        } else if (err.status === 401) {
          // let interceptor handle 401 (refresh/logout)
        } else {
          // show API error message if available
          const msg = (err.error && (err.error.message || err.error.error)) ? (err.error.message || err.error.error) : err.message;
          this.notification.showError(msg || 'Request failed');
        }
      } else {
        console.error('[HTTP] Unknown Error', err);
        this.notification.showError('An unexpected error occurred');
      }
    } catch (e) {
      // ignore
    }
  }

}
