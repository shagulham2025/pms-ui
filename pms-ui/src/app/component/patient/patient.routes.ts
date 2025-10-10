import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AllPatientComponent } from "./all-patient/all-patient-component";
import { PatientDetailsComponent } from "./patient-details/patient-details-component";

const routes: Routes = [
    { path: 'all-patient', component: AllPatientComponent },
    { path: 'patient-details', component: PatientDetailsComponent } // Placeholder, replace with actual component
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatientRoutingModule { }