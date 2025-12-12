
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddEditPatientComponent } from '../add-edit-patient/add-edit-patient-component';

interface PatientRow {
  id: number;
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  phone: string;
  emergencyContact: string;
  visitType: string; // OP/IP
  department: string;
  doctor: string;
  lastVisitDate?: string;
  admissionStatus: string;
}

@Component({
  standalone: false,
  selector: 'app-all-patient-component',
  templateUrl: './all-patient-component.html',
  styleUrls: ['./all-patient-component.css']
})
export class AllPatientComponent implements AfterViewInit {

  displayedColumns: string[] = ['id','name','age','height','weight','gender','phone','emergencyContact','visitType','department','doctor','lastVisitDate','admissionStatus','actions'];
  dataSource = new MatTableDataSource<PatientRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private nextId = 3001;

  constructor(private dialog: MatDialog) {
    const sample: PatientRow[] = [
      { id:3001, name: 'John Doe', age: 34, height: 175, weight: 78, gender: 'Male', phone: '555-0201', emergencyContact: '555-0301', visitType: 'OP', department: 'Cardiology', doctor: 'Dr. Alice Smith', lastVisitDate: '2025-11-20', admissionStatus: 'Not Admitted' },
      { id:3002, name: 'Jane Roe', age: 29, height: 165, weight: 60, gender: 'Female', phone: '555-0202', emergencyContact: '555-0302', visitType: 'IP', department: 'Dermatology', doctor: 'Dr. Bob Jones', lastVisitDate: '2025-12-01', admissionStatus: 'Admitted' }
    ];
    this.nextId = Math.max(...sample.map(p => p.id)) + 1;
    this.dataSource.data = sample;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(ev: Event) {
    const v = (ev.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = v;
  }

  openAddDialog(data?: Partial<PatientRow>) {
    const ref = this.dialog.open(AddEditPatientComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: data ?? null,
      disableClose: true
    });
    ref.afterClosed().subscribe((result: Partial<PatientRow> | null) => {
      if (!result) return;
      if (result.id) {
        const idx = this.dataSource.data.findIndex(x => x.id === result.id);
        if (idx !== -1) {
          const copy = this.dataSource.data.slice();
          copy[idx] = { ...(copy[idx]), ...(result as PatientRow) };
          this.dataSource.data = copy;
        }
      } else {
        const newRow: PatientRow = {
          id: this.nextId++,
          name: result.name ?? '',
          age: result.age ?? 0,
          height: result.height ?? 0,
          weight: result.weight ?? 0,
          gender: result.gender ?? '',
          phone: result.phone ?? '',
          emergencyContact: result.emergencyContact ?? '',
          visitType: result.visitType ?? 'OP',
          department: result.department ?? '',
          doctor: result.doctor ?? '',
          lastVisitDate: result.lastVisitDate ?? '',
          admissionStatus: result.admissionStatus ?? 'Not Admitted'
        };
        this.dataSource.data = [newRow, ...this.dataSource.data];
      }
    });
  }

  viewPatient(p: PatientRow) {
    this.dialog.open(AddEditPatientComponent, { width: '800px', data: {...p, readonly: true} });
  }

  editPatient(p: PatientRow) { this.openAddDialog(p); }

  deletePatient(p: PatientRow) {
    if (!confirm(`Delete patient ${p.name} (ID ${p.id})?`)) return;
    this.dataSource.data = this.dataSource.data.filter(x => x.id !== p.id);
  }

}
