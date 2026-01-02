import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError, Subject, of } from 'rxjs';
import { catchError, finalize, tap, filter, take, switchMap, map, retryWhen, mergeMap, delay } from 'rxjs/operators';
import { HttpInterceptorService } from '../http/http-interceptor.service';
import { API_BASE } from '../../config/api.config';

@Injectable()
export class UnifiedInterceptor implements HttpInterceptor {
  private refreshInProgress = false;
  private refreshSubject = new Subject<string | null>();

  constructor(private helper: HttpInterceptorService, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();

    // prepend API_BASE for relative URLs
    const url = req.url.startsWith('http') ? req.url : `${API_BASE}${req.url}`;
    let forwardReq = req.clone({ url });

    // Attach auth header if available
    forwardReq = this.helper.attachAuthHeader(forwardReq);

    // Log request
    this.helper.logRequest(forwardReq);

    return next.handle(forwardReq).pipe(
      // retry transient network/server errors up to 2 times with exponential backoff
      retryWhen((errors) => errors.pipe(
        mergeMap((err: any, i: number) => {
          // do not retry for 401 (handled elsewhere) or client errors
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              return throwError(() => err);
            }
            if (err.status >= 400 && err.status < 500 && err.status !== 0) {
              return throwError(() => err);
            }
          }
          const attempt = i + 1;
          if (attempt > 2) {
            return throwError(() => err);
          }
          const backoff = Math.pow(2, attempt) * 500;
          return of(err).pipe(delay(backoff));
        })
      )),
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const elapsed = Date.now() - started;
            this.helper.logResponse(event, elapsed);
            // capture accessToken from response bodies (if backend returns it)
            try {
              const body: any = event.body as any;
              if (body && body.accessToken) {
                this.helper.setAuthToken(body.accessToken);
              }
            } catch (e) {}
          }
        }
      }),
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // attempt refresh and retry
          return this.handle401(forwardReq, next, err);
        }
        this.helper.handleError(err);
        return throwError(() => err);
      }),
      finalize(() => {
        // reserved for any cleanup or telemetry
      })
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler, originalError: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (this.refreshInProgress) {
      // wait for ongoing refresh
      return this.refreshSubject.pipe(
        filter((token) => token !== undefined),
        take(1),
        switchMap((token) => {
          if (token) {
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
            return next.handle(retryReq);
          }
          return throwError(() => originalError);
        })
      );
    }

    this.refreshInProgress = true;
    // trigger refresh
    const refreshUrl = `${API_BASE}/auth/refresh`;
    this.http.post<{ accessToken: string }>(refreshUrl, {}).pipe(
      map(res => res?.accessToken ?? null),
      catchError(() => of(null)),
      finalize(() => { this.refreshInProgress = false; })
    ).subscribe((token) => {
      if (token) {
        this.helper.setAuthToken(token);
        this.refreshSubject.next(token);
      } else {
        this.helper.setAuthToken(null);
        this.refreshSubject.next(null);
      }
    });

    return this.refreshSubject.pipe(
      take(1),
      switchMap((token) => {
        if (token) {
          const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
          return next.handle(retryReq);
        }
        return throwError(() => originalError);
      })
    );
  }

}
