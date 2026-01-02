import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA, OnDestroy, PLATFORM_ID } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ConfigurationModule } from './component/configuration/configuration.module';
import { AppointmentModule } from './component/appointment/appointment.module';

import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectMenuDetails } from './store/auth/auth.selectors';
import { ChangePassword } from './component/configuration/change-password/change-password';
import { Profile } from './component/configuration/profile/profile';

declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [ { provide: LocationStrategy, useClass: HashLocationStrategy } ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ConfigurationModule,
    AppointmentModule, 
    MatMenuModule, 
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class App implements OnDestroy {
  sidebarOpen = false;
  showShell = true;
  private destroy$ = new Subject<void>();

  menuItems: { label: string; icon: string; route: string }[] = [];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private prof_dialog: MatDialog, private store: Store) {
    // hide header/sidebar/footer on login route
    this.router.events.subscribe((ev: any) => {
      const navEndName = 'NavigationEnd';
      if (ev && ev.constructor && ev.constructor.name === navEndName) {
        const url = ev.urlAfterRedirects || ev.url;
        // hide shell for any /auth/* routes
        this.showShell = !(url && url.startsWith && url.startsWith('/auth'));
        try { localStorage.setItem('pms_last_route', url); } catch (e) {}
      }
    });
    // initial check
    try {
      const u = this.router.url;
      this.showShell = !(u && u.startsWith && u.startsWith('/auth'));
    } catch (e) { }

    // subscribe to menu details from store and transform into sidebar items
    this.store.select(selectMenuDetails).pipe(takeUntil(this.destroy$)).subscribe((md) => {
      if (md && md.length) {
        this.menuItems = md.map((m: any) => ({
          label: m.displayName || m.menuName || m.accessLevel || 'Menu',
          icon: m.displayIcon || '',
          route: m.routerUrl || '/'
        }));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout_() {
    // clear auth and navigate to login
    try { const { AuthService } = (window as any); } catch {}
    this.router.navigateByUrl("login")
  }
  profile_() {
    if (!this.prof_dialog) {
      console.warn('MatDialog is not available in injector. Cannot open dialog.');
      return;
    }

    this.prof_dialog.open(Profile, {
      width: '500px',
      height: 'auto',
      maxHeight: '80vh',
      autoFocus: false,
      data: {}
    });
  }
  change_pass() {
    if (!this.prof_dialog) {
      console.warn('MatDialog is not available in injector. Cannot open dialog.');
      return;
    }

    this.prof_dialog.open(ChangePassword, {
      width: '500px',
      autoFocus: false,
      data: {}
    });
  }
}
