import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // On server, avoid blocking navigation (SSR) — guards should allow render
    if (!isPlatformBrowser(this.platformId)) return true;

    // If app rehydration hasn't completed, wait briefly for it to finish to avoid redirect flicker
    const rehydrated = (window as any).__PMS_REHYDRATED__ === true;
    if (rehydrated) {
      if (this.auth.isAuthenticated()) return true;
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // wait up to 2s for rehydration flag; poll every 50ms
    return new Promise<boolean | UrlTree>((resolve) => {
      const start = Date.now();
      const check = () => {
        const done = (window as any).__PMS_REHYDRATED__ === true;
        if (done) {
          resolve(this.auth.isAuthenticated() ? true : this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
          return;
        }
        if (Date.now() - start > 2000) {
          // timeout — fall back to current auth check
          resolve(this.auth.isAuthenticated() ? true : this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
          return;
        }
        setTimeout(check, 50);
      };
      check();
    });
  }
}
