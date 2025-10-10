import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUsersComponent } from './add-edit-users-component/add-edit-users-component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../model/user';

@Component({
  standalone: false,
  selector: 'app-users-component',
  templateUrl: './users-component.html'
})
export class UsersComponent {

  displayedColumns: string[] = ['userId', 'fullName', 'email', 'role', 'department', 'designation', 'status'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  openAddUserDialog(): void {
    this.dialog.open(AddEditUsersComponent, {
      width: '900px',
      data: {}
    });
  }

  ngOnInit(): void {
    this.http.get<User[]>('assert/mock-data/user-data.json').subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }


}
