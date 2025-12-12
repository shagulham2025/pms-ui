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

  // Static role permissions shown in Role Info tab
  roles: Array<{ name: string; view: boolean; edit: boolean; delete: boolean }> = [
    { name: 'Administrator', view: true, edit: true, delete: true },
    { name: 'Doctor', view: true, edit: false, delete: false },
    { name: 'Nurse', view: true, edit: false, delete: false },
    { name: 'Receptionist', view: true, edit: false, delete: false },
    { name: 'Pharmacist', view: true, edit: false, delete: false }
  ];

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

    // Load saved roles from localStorage if present
    try {
      const saved = localStorage.getItem('app_roles');
      if (saved) {
        const parsed = JSON.parse(saved) as Array<{ name: string; view: boolean; edit: boolean; delete: boolean }>;
        // basic validation
        if (Array.isArray(parsed) && parsed.length) {
          this.roles = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved roles', e);
    }
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

  onRoleChange(role: { name: string; view: boolean; edit: boolean; delete: boolean }) {
    // role object mutated via ngModel; we can react here if needed
    console.log('Role changed:', role.name, role);
  }

  saveRoles() {
    try {
      localStorage.setItem('app_roles', JSON.stringify(this.roles));
      console.log('Roles saved');
    } catch (e) {
      console.error('Failed to save roles', e);
    }
  }

  loadDefaultRoles() {
    // reset to built-in defaults
    this.roles = [
      { name: 'Administrator', view: true, edit: true, delete: true },
      { name: 'Doctor', view: true, edit: false, delete: false },
      { name: 'Nurse', view: true, edit: false, delete: false },
      { name: 'Receptionist', view: true, edit: false, delete: false },
      { name: 'Pharmacist', view: true, edit: false, delete: false }
    ];
    // remove persisted override
    try { localStorage.removeItem('app_roles'); } catch { /* ignore */ }
  }



}
