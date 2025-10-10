import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export const USER_DATA = [
  { name: 'Dr. Ayesha Khan', email: 'ayesha.khan@hospital.com', role: 'Doctor' },
  { name: 'John Doe', email: 'john.doe@hospital.com', role: 'Nurse' },
  { name: 'Rajesh Kumar', email: 'rajesh.kumar@hospital.com', role: 'Admin' },
  { name: 'Emily Smith', email: 'emily.smith@hospital.com', role: 'Receptionist' },
  { name: 'Dr. Vikram Patel', email: 'vikram.patel@hospital.com', role: 'Doctor' },
  { name: 'Sara Ali', email: 'sara.ali@hospital.com', role: 'Nurse' },
  { name: 'Mohammed Irfan', email: 'irfan@hospital.com', role: 'Pharmacist' },
  { name: 'Anita Desai', email: 'anita.desai@hospital.com', role: 'Lab Technician' },
  { name: 'Dr. Neha Verma', email: 'neha.verma@hospital.com', role: 'Doctor' },
  { name: 'Chris Johnson', email: 'chris.johnson@hospital.com', role: 'Admin' },
  { name: 'Priya Nair', email: 'priya.nair@hospital.com', role: 'Nurse' },
  { name: 'David Lee', email: 'david.lee@hospital.com', role: 'Receptionist' },
  { name: 'Dr. Arjun Mehta', email: 'arjun.mehta@hospital.com', role: 'Doctor' },
  { name: 'Fatima Noor', email: 'fatima.noor@hospital.com', role: 'Nurse' },
  { name: 'Kiran Rao', email: 'kiran.rao@hospital.com', role: 'Billing' },
  { name: 'Suresh Reddy', email: 'suresh.reddy@hospital.com', role: 'Admin' },
  { name: 'Jessica Brown', email: 'jessica.brown@hospital.com', role: 'Receptionist' },
  { name: 'Dr. Sameer Shah', email: 'sameer.shah@hospital.com', role: 'Doctor' },
  { name: 'Meena Iyer', email: 'meena.iyer@hospital.com', role: 'Nurse' },
  { name: 'Tom Wilson', email: 'tom.wilson@hospital.com', role: 'Lab Technician' },
  { name: 'Ravi Shankar', email: 'ravi.shankar@hospital.com', role: 'Pharmacist' },
  { name: 'Dr. Kavita Joshi', email: 'kavita.joshi@hospital.com', role: 'Doctor' },
  { name: 'Nina D’Souza', email: 'nina.dsouza@hospital.com', role: 'Nurse' },
  { name: 'Arvind Menon', email: 'arvind.menon@hospital.com', role: 'Admin' }
];

@Component({
  standalone: false,
  selector: 'app-users-component',
  templateUrl: './users-component.html'
})
export class UsersComponent {

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource(USER_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
