
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddEditDocterComponent } from '../add-edit-docter/add-edit-docter-component';
import { DocterAvailabilityComponent } from '../docter-availability/docter-availability-component';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  department: string;
  experience: number; // years
  email: string;
  phone: string;
  status: string;
  weeklySchedule?: Array<{
    day: string;
    available: boolean;
    slots: Array<{ startTime: string; endTime: string }>;
  }>;
}

@Component({
  standalone: false,
  selector: 'app-all-docter-detail-component',
  templateUrl: './all-docter-detail-component.html',
  styleUrls: ['./all-docter-detail-component.css']
})
export class AllDocterDetailComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'specialization', 'department', 'experience', 'phone', 'status', 'actions'];
  dataSource = new MatTableDataSource<Doctor>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private nextId = 2001;

  constructor(private dialog: MatDialog) {
    // sample data
    const initial: Doctor[] = [
      { id: 2001, name: 'Dr. Alice Smith', specialization: 'Cardiology', department: 'Cardiology', experience: 10, email: 'alice.smith@example.com', phone: '555-0101', status: 'ACTIVE' },
      { id: 2002, name: 'Dr. Bob Jones', specialization: 'Dermatology', department: 'Dermatology', experience: 6, email: 'bob.jones@example.com', phone: '555-0102', status: 'ACTIVE',
        weeklySchedule: [
          { day: 'Monday', available: true, slots: [{ startTime: '09:00', endTime: '12:00' }, { startTime: '16:00', endTime: '19:00' }] },
          { day: 'Tuesday', available: false, slots: [] },
          { day: 'Wednesday', available: true, slots: [{ startTime: '10:00', endTime: '14:00' }] },
          { day: 'Thursday', available: true, slots: [{ startTime: '09:00', endTime: '12:00' }] },
          { day: 'Friday', available: false, slots: [] },
          { day: 'Saturday', available: true, slots: [{ startTime: '09:00', endTime: '12:00' }] },
          { day: 'Sunday', available: false, slots: [] }
        ]
      }
    ];
    this.nextId = Math.max(...initial.map(d => d.id)) + 1;
    this.dataSource.data = initial;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(ev: Event) {
    const v = (ev.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = v;
  }

  openAddDialog(data?: Partial<Doctor>) {
    const ref = this.dialog.open(AddEditDocterComponent, { width: '700px', data: data ?? null, disableClose: true });
    ref.afterClosed().subscribe((result: Partial<Doctor> | null) => {
      if (!result) return;
      if (result.id) {
        // update existing
        const idx = this.dataSource.data.findIndex(d => d.id === result.id);
        if (idx !== -1) {
          const updated = { ...(this.dataSource.data[idx]), ...(result as Doctor) } as Doctor;
          const copy = this.dataSource.data.slice();
          copy[idx] = updated;
          this.dataSource.data = copy;
        }
      } else {
        // add new
        const newDoctor: Doctor = {
          id: this.nextId++,
          name: result.name ?? '',
          specialization: result.specialization ?? '',
          department: result.department ?? '',
          experience: result.experience ?? 0,
          email: result.email ?? '',
          phone: result.phone ?? '',
          status: result.status ?? 'ACTIVE'
        };
        this.dataSource.data = [newDoctor, ...this.dataSource.data];
      }
    });
  }

  viewDoctor(d: Doctor) {
    // open dialog in read-only mode
    this.dialog.open(AddEditDocterComponent, { width: '700px', data: { ...d, readonly: true } });
  }

  editDoctor(d: Doctor) {
    this.openAddDialog(d);
  }

  viewAvailability(d: Doctor) {
    // open availability dialog/component
    const schedule = d.weeklySchedule ?? [
      { day: 'Monday', available: false, slots: [] },
      { day: 'Tuesday', available: false, slots: [] },
      { day: 'Wednesday', available: false, slots: [] },
      { day: 'Thursday', available: false, slots: [] },
      { day: 'Friday', available: false, slots: [] },
      { day: 'Saturday', available: false, slots: [] },
      { day: 'Sunday', available: false, slots: [] }
    ];

    this.dialog.open(DocterAvailabilityComponent, {
      width: '520px',
      data: { name: d.name, schedule }
    });
  }

  deleteDoctor(d: Doctor) {
    const ok = confirm(`Delete doctor ${d.name} (ID ${d.id})?`);
    if (!ok) return;
    this.dataSource.data = this.dataSource.data.filter(x => x.id !== d.id);
  }

}
