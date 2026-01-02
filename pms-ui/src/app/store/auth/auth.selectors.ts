import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
	selectAuthState,
	(s: AuthState | null | undefined): string | null => s?.token ?? null
);

export const selectIsAuthenticated = createSelector(
	selectToken,
	(t: string | null): boolean => !!t
);

export const selectAuthLoading = createSelector(
	selectAuthState,
	(s: AuthState | null | undefined): boolean => !!s && s.loading
);
