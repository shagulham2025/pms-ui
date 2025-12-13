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


  // timeslots removed; using a single datetime input instead

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
          const dateTimeVal = this.getDateTimeFromData(this.data);
          this.appointmentForm.patchValue({
            department: this.data.department || '',
            doctor: this.data.doctor || '',
            date: dateTimeVal || '',
            time: dateTimeVal ? this.toTimeInputString(dateTimeVal) : ''
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
      const dateVal: Date | null = v.date ? new Date(v.date) : null;
      let dateObj: Date | null = null;
      if (dateVal) {
        dateObj = new Date(dateVal);
        if (v.time) {
          const parts = (v.time as string).split(':');
          const hh = parseInt(parts[0], 10) || 0;
          const mm = parseInt(parts[1], 10) || 0;
          dateObj.setHours(hh, mm, 0, 0);
        }
      }
      const result = {
        department: v.department,
        doctor: v.doctor,
        date: dateObj ? dateObj.toISOString() : null,
        dateDisplay: dateObj ? dateObj.toDateString() : '',
        time: dateObj ? this.formatTime(dateObj) : ''
      };
      this.dialogRef.close(result);
    } else {
      this.appointmentForm.markAllAsTouched();
    }
  }

  private getDateTimeFromData(data: any): Date | null {
    if (!data) return null;
    if (data.dateTime) return new Date(data.dateTime);
    // if separate date and time provided, combine
    let baseDate: Date | null = null;
    if (data.date) {
      baseDate = new Date(data.date);
    } else if (data.dateDisplay) {
      baseDate = new Date(data.dateDisplay);
    }
    if (!baseDate) return null;
    if (data.time) {
      const t = this.parseTimeString(data.time);
      if (t) {
        baseDate.setHours(t.hours, t.minutes, 0, 0);
      }
    }
    return baseDate;
  }

  private parseTimeString(t: string): { hours: number; minutes: number } | null {
    // expects formats like '2:30 PM' or '14:30'
    if (!t) return null;
    const pm = /pm$/i.test(t.trim());
    const timeOnly = t.replace(/(am|pm)/i, '').trim();
    const parts = timeOnly.split(':');
    if (parts.length < 1) return null;
    let hours = parseInt(parts[0], 10);
    const minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;
    if (isNaN(hours)) return null;
    if (pm && hours < 12) hours += 12;
    if (!pm && hours === 12 && /am/i.test(t)) hours = 0;
    return { hours, minutes: isNaN(minutes) ? 0 : minutes };
  }

  private toDateTimeLocal(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  private formatTime(d: Date): string {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 === 0 ? 12 : hours % 12;
    const mm = minutes.toString().padStart(2, '0');
    return `${h}:${mm} ${ampm}`;
  }

  private toTimeInputString(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

}
