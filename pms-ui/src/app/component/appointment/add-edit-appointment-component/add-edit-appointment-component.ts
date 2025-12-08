import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-add-edit-appointment-component',
  templateUrl: './add-edit-appointment-component.html',
  styleUrls: ['./add-edit-appointment-component.css']
})
export class AddEditAppointmentComponent implements OnInit {

  departments = ['Cardiology', 'Dermatology', 'Neurology'];

  doctorsByDept: { [key: string]: string[] } = {
    'Cardiology': ['Dr. Smith', 'Dr. Allen'],
    'Dermatology': ['Dr. Jones', 'Dr. Patel'],
    'Neurology': ['Dr. Wu', 'Dr. Khan']
  };


  timeslots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];

  appointmentForm!: FormGroup;

  availableDoctors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      department: ['', Validators.required],
      doctor: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
    // If dialog was opened for editing, patch the form with provided data
    if (this.data) {
      try {
        const dateVal = this.data.date ? new Date(this.data.date) : (this.data.dateDisplay ? new Date(this.data.dateDisplay) : null);
        this.appointmentForm.patchValue({
          department: this.data.department || '',
          doctor: this.data.doctor || '',
          date: dateVal,
          time: this.data.time || ''
        });
        // populate available doctors for the department
        const dept = this.data.department;
        this.availableDoctors = dept ? (this.doctorsByDept[dept] || []) : [];
      } catch (e) {
        // ignore parse errors
      }
    }
  }

  onDepartmentChange(): void {
    const dept = this.appointmentForm.get('department')?.value;
    this.availableDoctors = dept ? (this.doctorsByDept[dept] || []) : [];
    // reset doctor when department changed
    this.appointmentForm.get('doctor')?.setValue('');
  }

  confirm(): void {
    if (this.appointmentForm.valid) {
      const v = this.appointmentForm.value;
      const result = {
        department: v.department,
        doctor: v.doctor,
        date: v.date,
        dateDisplay: v.date ? new Date(v.date).toDateString() : '',
        time: v.time
      };
      this.dialogRef.close(result);
    } else {
      this.appointmentForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

}
