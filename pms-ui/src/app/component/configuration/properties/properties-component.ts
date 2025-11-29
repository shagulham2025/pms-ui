import { Component, OnInit, ViewChild, AfterViewInit, Optional } from '@angular/core';
import { AddEditPropertiesComponent } from './add-edit-properties-component/add-edit-properties-component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Properties } from '../../../model/properties';
import { ConfirmDialogData } from '../../../model/confirm-dialog-data';
import { ConfirmationDialog } from '../../shared/confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-properties-component',
  templateUrl: './properties-component.html'
})
export class PropertiesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['propertiesId', 'propertiesName', 'description','actions'];
  dataSource = new MatTableDataSource<Properties>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private http: HttpClient) { }

  openAddUserDialog(): void {
    if (!this.dialog) {
      console.warn('MatDialog is not available in injector. Cannot open dialog.');
      return;
    }

    this.dialog.open(AddEditPropertiesComponent, {
      width: '900px',
      data: {}
    });
  }

  ngOnInit(): void {
    this.dataSource.data = Array.from({ length: 100 }, (_, i) => {
        const id = i + 1001;
        return {
          propertiesId: id,
          propertiesName: `Prop ${id}`,
          description: `Description${id}`,
          actions: "Edit | Delete"
        };
      }) as any;
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
        // ✅ User confirmed
        console.log('Deleting user:', userId);
      } else {
        // ❌ User cancelled
        console.log('Delete cancelled');
      }
    });
  }



}
