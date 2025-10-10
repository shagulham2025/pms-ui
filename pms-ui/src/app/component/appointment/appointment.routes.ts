import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AllAppointmentComponent } from "./all-appointment-component/all-appointment-component";

const routes: Routes = [
    { path: 'all-appointment', component: AllAppointmentComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppointmentRoutingModule { }