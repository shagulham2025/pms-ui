import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: any | null;
  user: any | null;
  menuDetails: any[];
  roleNames: string[];
}

export const initialAuthState: AuthState = {
  token: null,
  loading: false,
  error: null,
  user: null,
  menuDetails: [],
  roleNames: [],
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { token }) => ({ ...state, token, loading: false })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(AuthActions.logout, (state) => ({ ...state, token: null, user: null })),
  on(AuthActions.loadUserDetails, (state) => ({ ...state, loading: true })),
  on(AuthActions.loadUserDetailsSuccess, (state, { menuDetails, user, roleNames }) => ({ ...state, user, menuDetails, roleNames, loading: false })),
  on(AuthActions.loadUserDetailsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
