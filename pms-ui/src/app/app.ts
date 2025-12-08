import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ConfigurationModule } from './component/configuration/configuration.module';
import { AppointmentModule } from './component/appointment/appointment.module';

import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ChangePassword } from './component/configuration/change-password/change-password';
import { Profile } from './component/configuration/profile/profile';

declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ConfigurationModule,
    AppointmentModule
    , MatMenuModule
    , MatButtonModule,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class App {

  sidebarOpen = false;

  menuItems = [
    { label: 'Dashboard', icon: 'fa fa-bar-chart', route: '/home/dashboard' },
    { label: 'Appointments', icon: 'fa fa-calendar', route: '/appointment/all-appointment' },
    { label: 'Doctor', icon: 'fa fa-user-md', route: '/doctor/all-doctor' },
    { label: 'Prescription', icon: 'fa fa-book', route: '/configuration/prescription' },
    { label: 'Patients', icon: 'fa fa-bed', route: '/patient/all-patient' },
    { label: 'User', icon: 'fa fa-user', route: '/configuration/users' },
    { label: 'Properties', icon: 'fa fa-building', route: '/configuration/properties' },
    { label: 'Pharmacy', icon: 'fa fa-medkit', route: '/pharmacy' }
  ];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private prof_dialog: MatDialog) { }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout_() {
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
