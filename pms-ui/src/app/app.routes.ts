import { NgModule } from '@angular/core';
import { Login } from './component/configuration/login/login';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
    { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth', component: AuthLayoutComponent, children: [
            { path: 'login', component: Login }
        ]
    },
    {
        path: '', canActivate: [AuthGuard], loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule)
    }, {
        path: 'home', canActivate: [AuthGuard], loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'configuration', canActivate: [AuthGuard], loadChildren: () => import('./component/configuration/configuration.module').then(m => m.ConfigurationModule)
    }, {
        path: 'appointment', canActivate: [AuthGuard], loadChildren: () => import('./component/appointment/appointment.module').then(m => m.AppointmentModule)
    }, {
        path: 'doctor', canActivate: [AuthGuard], loadChildren: () => import('./component/docter/docter.module').then(m => m.DocterModule)
    }, {
        path: 'patient', canActivate: [AuthGuard], loadChildren: () => import('./component/patient/patient.module').then(m => m.PatientModule)
    }, {
        path: 'pharmacy', canActivate: [AuthGuard], loadChildren: () => import('./component/pharmacy/pharmacy.module').then(m => m.PharmacyModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
