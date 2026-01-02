import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { of, defer } from 'rxjs';
import { mergeMap, tap, catchError, delay } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    defer(() => this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) => {
        // simulate async auth using Observable instead of Promise
        if (username && password) {
          const token = 'FAKE_TOKEN_' + Date.now();
          try {
            localStorage.setItem('pms_token', token);
          } catch (e) {}
          return of(AuthActions.loginSuccess({ token })).pipe(delay(300));
        }

        return of(
          AuthActions.loginFailure({ error: new Error('Invalid credentials') })
        ).pipe(delay(300));
      }),
      catchError((err) => of(AuthActions.loginFailure({ error: err })))
    ))
  );

  logout$ = createEffect(
    () =>
      defer(() => this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          try {
            localStorage.removeItem('pms_token');
            localStorage.removeItem('pms_user');
            localStorage.removeItem('pms_menu');
            localStorage.removeItem('pms_role_names');
          } catch (e) {}
        })
      )),
    { dispatch: false }
  );

  // persist user/menu/roles when loaded so we can rehydrate on reload
  persistUserDetails$ = createEffect(
    () =>
      defer(() =>
        this.actions$.pipe(
          ofType(AuthActions.loadUserDetailsSuccess),
          tap(({ menuDetails, user, roleNames }) => {
            try {
              localStorage.setItem('pms_user', JSON.stringify(user));
              localStorage.setItem('pms_menu', JSON.stringify(menuDetails || []));
              localStorage.setItem('pms_role_names', JSON.stringify(roleNames || []));
            } catch (e) {}
          })
        )
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
