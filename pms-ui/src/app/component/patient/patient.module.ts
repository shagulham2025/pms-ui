import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { PatientRoutingModule } from "./patient.routes";
import { AllPatientComponent } from "./all-patient/all-patient-component";
import { AddEditPatientComponent } from "./add-edit-patient/add-edit-patient-component";
import { PatientDetailsComponent } from "./patient-details/patient-details-component";

@NgModule({
    declarations: [
        
    ],
    imports: [
        PatientRoutingModule,
        AllPatientComponent,
        AddEditPatientComponent,
        PatientDetailsComponent
    ],
    exports: [
        
    ],
    providers: [],
    bootstrap: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class PatientModule {

}