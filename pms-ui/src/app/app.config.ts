import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
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
    provideStoreDevtools({ maxAge: 25 }),
    { provide: HTTP_INTERCEPTORS, useClass: UnifiedInterceptor, multi: true }
  ]
};
