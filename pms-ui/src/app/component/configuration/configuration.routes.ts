import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { UsersComponent } from "./users/users-component";
import { PropertiesComponent } from "./properties/properties-component";
import { PrescriptionComponent } from "./prescription/prescription-component";
import { Profile } from "./profile/profile";
import { ChangePassword } from "./change-password/change-password";

const routes: Routes = [
    { path: 'users', component: UsersComponent },
    { path: 'properties', component: PropertiesComponent } ,
    { path: 'prescription', component: PrescriptionComponent } ,
    // { path: 'profile', component: Profile },
    // { path: 'change-password', component: ChangePassword },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigurationRoutingModule { }