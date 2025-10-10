import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { UsersComponent } from "./users/users-component";
import { PropertiesComponent } from "./properties/properties-component";

const routes: Routes = [
     { path: 'users', component: UsersComponent },
     { path: 'properties', component: PropertiesComponent } 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigurationRoutingModule { }