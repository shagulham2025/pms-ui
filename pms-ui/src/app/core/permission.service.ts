import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectRoleNames } from '../store/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private roles$ = new BehaviorSubject<string[]>([]);

  constructor(private store: Store) {
    this.store.select(selectRoleNames).subscribe((r) => this.roles$.next(r || []));
  }

  // build canonical role name e.g. ('APPOINTMENT','CREATE') -> 'ROLE_CREATE_APPOINTMENT'
  buildRole(moduleName: string, action: string): string {
    if (!moduleName || !action) return '';
    return `ROLE_${action.toUpperCase()}_${moduleName.toUpperCase()}`;
  }

  has(permission: string): boolean {
    const current = this.roles$.getValue() || [];
    return current.indexOf(permission) >= 0;
  }

  hasAsync(permission: string): Observable<boolean> {
    return this.roles$.asObservable().pipe(map((r) => (r || []).indexOf(permission) >= 0));
  }

  hasAny(permissions: string[]): boolean {
    const current = this.roles$.getValue() || [];
    return permissions.some(p => current.indexOf(p) >= 0);
  }

  hasAnyAsync(permissions: string[]): Observable<boolean> {
    return this.roles$.asObservable().pipe(map((r) => {
      const curr = r || [];
      return permissions.some(p => curr.indexOf(p) >= 0);
    }));
  }
}
