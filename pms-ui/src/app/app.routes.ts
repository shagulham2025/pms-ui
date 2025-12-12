import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule)
    }, {
        path: 'home', loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'configuration', loadChildren: () => import('./component/configuration/configuration.module').then(m => m.ConfigurationModule)
    }, {
        path: 'appointment', loadChildren: () => import('./component/appointment/appointment.module').then(m => m.AppointmentModule)
    }, {
        path: 'doctor', loadChildren: () => import('./component/docter/docter.module').then(m => m.DocterModule)
    }, {
        path: 'patient', loadChildren: () => import('./component/patient/patient.module').then(m => m.PatientModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
