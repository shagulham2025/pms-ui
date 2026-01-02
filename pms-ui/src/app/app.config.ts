import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, APP_INITIALIZER, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { UnifiedInterceptor } from './core/interceptors/unified.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { rootReducers } from './store';
import { AuthEffects } from './store/auth/auth.effects';
import * as AuthActions from './store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

const initAuth = () => {
  const platformId = inject(PLATFORM_ID);
  return () => {
    // skip rehydration on server where localStorage is not available
    if (!isPlatformBrowser(platformId)) {
      return Promise.resolve();
    }

    try {
      const store = inject(Store as any) as Store;
      const router = inject(Router);
      const token = localStorage.getItem('pms_token');
      const userJson = localStorage.getItem('pms_user');
      const menuJson = localStorage.getItem('pms_menu');
      const rolesJson = localStorage.getItem('pms_role_names');

      if (token) {
        store.dispatch(AuthActions.loginSuccess({ token }));
      }

      if (userJson || menuJson || rolesJson) {
        const user = userJson ? JSON.parse(userJson) : null;
        const menuDetails = menuJson ? JSON.parse(menuJson) : [];
        const roleNames = rolesJson ? JSON.parse(rolesJson) : [];
        store.dispatch(AuthActions.loadUserDetailsSuccess({ menuDetails, user, roleNames }));
      }

      // attempt to restore last route if present
      try {
        const last = localStorage.getItem('pms_last_route');
        if (last && router && router.navigateByUrl) {
          setTimeout(() => {
            try { router.navigateByUrl(last); } catch (e) {}
          }, 0);
        }
      } catch (e) {}
    } catch (e) {
      console.warn('Failed to rehydrate auth', e);
    }
    return Promise.resolve();
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideHttpClient(withFetch()),
    provideStore(rootReducers),
    provideEffects(AuthEffects),
    { provide: APP_INITIALIZER, useFactory: initAuth, multi: true },
    provideStoreDevtools({ maxAge: 25 }),
    { provide: HTTP_INTERCEPTORS, useClass: UnifiedInterceptor, multi: true }
  ]
};
