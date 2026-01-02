import { Component } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddEditAppointmentComponent } from '../add-edit-appointment-component/add-edit-appointment-component';
import { ConfirmationDialog } from '../../shared/confirmation-dialog/confirmation-dialog';

interface Appointment {
  doctor: string;
  department: string;
  date: string; // ISO or display
  time: string;
  ref?: string;
}

@Component({
  standalone: false,
  selector: 'app-all-appointment-component',
  templateUrl: './all-appointment-component.html',
  styleUrls: ['./all-appointment-component.css']
})
export class AllAppointmentComponent {

  upcomingAppointments: Appointment[] = [
    { doctor: 'Dr. Smith', department: 'Cardiology', time: '10:00 AM', date: 'Oct 26, 2023', ref: '#123456' },
    { doctor: 'Dr. Jones', department: 'Dermatology', time: '2:30 PM', date: 'Nov 1, 2023', ref: '#123457' }
  ];

  bookingQueue: Appointment[] = [];
  processingQueue = false;

  constructor(private dialog: MatDialog) { }

  openBookingDialog(): void {
    if (!this.dialog) return;

    const dialogRef = this.dialog.open(AddEditAppointmentComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      // Expect result to contain appointment details
      const appt: Appointment = {
        doctor: result.doctor,
        department: result.department,
        date: result.dateDisplay || (result.date ? new Date(result.date).toDateString() : ''),
        time: result.time,
        ref: `#${Math.floor(Math.random() * 900000 + 100000)}`
      };
      this.enqueueBooking(appt);
    });
  }

  enqueueBooking(appt: Appointment): void {
    this.bookingQueue.push(appt);
    if (!this.processingQueue) {
      this.processingQueue = true;
      this.processNext();
    }
  }

  private processNext(): void {
    const appt = this.bookingQueue.shift();
    if (!appt) {
      this.processingQueue = false;
      return;
    }

    this.saveAppointment(appt).subscribe({
      next: () => {
        this.upcomingAppointments.unshift(appt);
        this.processNext();
      },
      error: () => {
        // continue processing even if one save fails
        this.processNext();
      }
    });
  }

  private saveAppointment(appt: Appointment) {
    return of(void 0).pipe(delay(300));
  }

  editAppointment(index: number): void {
    const appt = this.upcomingAppointments[index];
    const dialogRef = this.dialog.open(AddEditAppointmentComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        department: appt.department,
        doctor: appt.doctor,
        date: appt.date,
        time: appt.time
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      // update the appointment
      this.upcomingAppointments[index] = {
        doctor: result.doctor,
        department: result.department,
        date: result.dateDisplay || (result.date ? new Date(result.date).toDateString() : ''),
        time: result.time,
        ref: this.upcomingAppointments[index].ref || `#${Math.floor(Math.random() * 900000 + 100000)}`
      };
    });
  }

  deleteAppointment(index: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      data: {
        title: 'Delete Appointment',
        message: `Are you sure you want to delete this appointment?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.upcomingAppointments.splice(index, 1);
      }
    });
  }

}
