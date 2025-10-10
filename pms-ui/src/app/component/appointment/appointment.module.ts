import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { AppointmentRoutingModule } from "./appointment.routes";
import { AddEditAppointmentComponent } from "./add-edit-appointment-component/add-edit-appointment-component";
import { AllAppointmentComponent } from "./all-appointment-component/all-appointment-component";

@NgModule({
    declarations: [
        
    ],
    imports: [
        AddEditAppointmentComponent,
        AllAppointmentComponent,
        AppointmentRoutingModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppointmentModule {

}