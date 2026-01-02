import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NgClass, CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from "./configuration.routes";
import { PropertiesComponent } from "./properties/properties-component";
import { UsersComponent } from "./users/users-component";
import { Login } from "./login/login";
import { AddEditUsersComponent } from "./users/add-edit-users-component/add-edit-users-component";
import { AddEditPropertiesComponent } from "./properties/add-edit-properties-component/add-edit-properties-component";
import { PrescriptionComponent } from "./prescription/prescription-component";
import { AddEditPrescriptionComponent } from "./prescription/add-edit-prescription-component/add-edit-prescription-component";
import { HasPermissionDirective } from '../shared/directives/has-permission.directive';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmationDialog } from "../shared/confirmation-dialog/confirmation-dialog";

@NgModule({
    declarations: [
        Login,
        PropertiesComponent,
        UsersComponent,
        PrescriptionComponent,
        AddEditUsersComponent,
        AddEditPropertiesComponent,
        AddEditPrescriptionComponent,
    ],
    imports: [
        ConfigurationRoutingModule,
        CommonModule,
        HasPermissionDirective,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDialogModule,
        MatCheckboxModule,
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