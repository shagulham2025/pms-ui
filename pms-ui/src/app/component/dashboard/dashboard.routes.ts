import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { Dashboard } from "./dashboard";

const routes: Routes = [
    { path: 'dashboard', component: Dashboard }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }