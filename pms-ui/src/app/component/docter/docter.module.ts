import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { DocterRoutingModule } from "./docter.routes";
import { DocterAvailabilityComponent } from "./docter-availability/docter-availability-component";
import { AllDocterDetailComponent } from "./all-docter-detail/all-docter-detail-component";
import { AddEditDocterComponent } from "./add-edit-docter/add-edit-docter-component";

@NgModule({
    declarations: [

    ],
    imports: [
        DocterAvailabilityComponent,
        AllDocterDetailComponent,
        AddEditDocterComponent,
        DocterRoutingModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class DocterModule {

}