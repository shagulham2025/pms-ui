import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AddEditUsersComponent } from './add-edit-users-component/add-edit-users-component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../../../model/user';
import { ConfirmDialogData } from '../../../model/confirm-dialog-data';
import { ConfirmationDialog } from '../../shared/confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from './service/users.service';

@Component({
  standalone: false,
  selector: 'app-users-component',
  templateUrl: './users-component.html'
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['userId', 'fullName', 'email', 'role', 'department', 'designation', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  selectedTab: 'user' | 'role' = 'user';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private usersService: UsersService) { }

  openAddUserDialog(data?: Partial<User>): void {
    if (!this.dialog) {
      console.warn('MatDialog is not available in injector. Cannot open dialog.');
      return;
    }

    const dialogRef = this.dialog.open(AddEditUsersComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true,
      data: data ?? null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      // result is Partial<User>
      if (result.userId) {
        // update
        const updated = result as User;
        this.usersService.updateUser(updated).subscribe();
      } else {
        this.usersService.addUser(result).subscribe();
      }
    });
  }

  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      this.dataSource.data = users as User[];
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  deleteUser(userId: number) {
    const dialogData: ConfirmDialogData = {
      title: 'Delete User',
      message: `Are you sure you want to delete user #${userId}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // call service to delete
        this.usersService.deleteUser(userId).subscribe();
      } else {
        // ❌ User cancelled
        console.log('Delete cancelled');
      }
    });
  }



}
