import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppointmentRoutingModule } from './appointment.routes';
import { AddEditAppointmentComponent } from './add-edit-appointment-component/add-edit-appointment-component';
import { AllAppointmentComponent } from './all-appointment-component/all-appointment-component';
import { ConfirmationDialog } from '../shared/confirmation-dialog/confirmation-dialog';

@NgModule({
    declarations: [
        AddEditAppointmentComponent,
        AllAppointmentComponent
    ],
    imports: [
        AppointmentRoutingModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatIconModule,
        ConfirmationDialog
    ],
    exports: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppointmentModule { }