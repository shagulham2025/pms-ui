import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { HttpInterceptorService } from '../http/http-interceptor.service';

@Injectable()
export class UnifiedInterceptor implements HttpInterceptor {

  constructor(private helper: HttpInterceptorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();

    // Attach auth header if available
    const authReq = this.helper.attachAuthHeader(req);

    // Log request
    this.helper.logRequest(authReq);

    return next.handle(authReq).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const elapsed = Date.now() - started;
            this.helper.logResponse(event, elapsed);
          }
        }
      }),
      catchError((err) => {
        this.helper.handleError(err);
        return throwError(() => err);
      }),
      finalize(() => {
        // reserved for any cleanup or telemetry
      })
    );
  }

}
