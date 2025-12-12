import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DocterAvailabilityComponent } from "./docter-availability/docter-availability-component";
import { AllDocterDetailComponent } from "./all-docter-detail/all-docter-detail-component";

const routes: Routes = [
    { path: 'docter-availability', component: DocterAvailabilityComponent },
    { path: 'all-doctor', component: AllDocterDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocterRoutingModule { }