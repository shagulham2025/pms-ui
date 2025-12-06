import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpInterceptorService {

  constructor() {}

  getAuthToken(): string | null {
    try {
      return localStorage.getItem('auth_token');
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
        // TODO: integrate with a user-facing notification service
      } else {
        console.error('[HTTP] Unknown Error', err);
      }
    } catch (e) {
      // ignore
    }
  }

}
