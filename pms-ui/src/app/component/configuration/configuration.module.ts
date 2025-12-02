import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NgClass, CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from "./configuration.routes";
import { PropertiesComponent } from "./properties/properties-component";
import { UsersComponent } from "./users/users-component";
import { AddEditUsersComponent } from "./users/add-edit-users-component/add-edit-users-component";
import { AddEditPropertiesComponent } from "./properties/add-edit-properties-component/add-edit-properties-component";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmationDialog } from "../shared/confirmation-dialog/confirmation-dialog";

@NgModule({
    declarations: [
        PropertiesComponent,
        UsersComponent,
        AddEditUsersComponent,
        AddEditPropertiesComponent,
    ],
    imports: [
        ConfigurationRoutingModule,
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ConfirmationDialog
    ],
    exports: [

    ],
    providers: [],
    bootstrap: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule {

}