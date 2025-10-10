import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routes";
import { Dashboard } from "./dashboard";

@NgModule({
    declarations: [

    ],
    imports: [
        DashboardRoutingModule,
        Dashboard
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class DashboardModule {

}