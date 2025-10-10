import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ConfigurationRoutingModule } from "./configuration.routes";
import { PropertiesComponent } from "./properties/properties-component";
import { UsersComponent } from "./users/users-component";
import { AddEditUsersComponent } from "./users/add-edit-users-component/add-edit-users-component";
import { AddEditPropertiesComponent } from "./properties/add-edit-properties-component/add-edit-properties-component";

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    declarations: [
        PropertiesComponent,
        UsersComponent,
        AddEditUsersComponent,
        AddEditPropertiesComponent,
    ],
    imports: [
        ConfigurationRoutingModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    exports: [
       
    ],
    providers: [],
    bootstrap: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule {

}