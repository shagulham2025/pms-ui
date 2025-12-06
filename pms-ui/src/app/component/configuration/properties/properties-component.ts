import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AddEditPropertiesComponent } from './add-edit-properties-component/add-edit-properties-component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Properties } from '../../../model/properties';
import { ConfirmDialogData } from '../../../model/confirm-dialog-data';
import { ConfirmationDialog } from '../../shared/confirmation-dialog/confirmation-dialog';

@Component({
  standalone: false,
  selector: 'app-properties-component',
  templateUrl: './properties-component.html'
})
export class PropertiesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['key', 'value', 'description', 'actions'];
  dataSource = new MatTableDataSource<Properties>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) { }

  openAddPropertyDialog(data?: any): void {
    if (!this.dialog) {
      console.warn('MatDialog is not available in injector. Cannot open dialog.');
      return;
    }

    const dialogRef = this.dialog.open(AddEditPropertiesComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: true,
      data: data ?? {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      // If editing, replace the existing entry, else add new
      if (result.propertiesId) {
        const idx = this.dataSource.data.findIndex(d => d.propertiesId === result.propertiesId);
        if (idx !== -1) {
          this.dataSource.data[idx] = result;
          this.dataSource._updateChangeSubscription();
        }
      } else {
        // assign id
        const nextId = (this.dataSource.data.length ? Math.max(...this.dataSource.data.map(d => d.propertiesId)) : 1000) + 1;
        result.propertiesId = nextId;
        this.dataSource.data = [result, ...this.dataSource.data];
      }
    });
  }

  ngOnInit(): void {
    this.dataSource.data = Array.from({ length: 12 }, (_, i) => {
      const id = i + 2001;
      return {
        propertiesId: id,
        propertiesKey: `property.key.${id}`,
        propertiesValue: `value-${id}`,
        description: `Sample property ${id}`
      } as Properties;
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

  editProperty(prop: Properties) {
    this.openAddPropertyDialog({ ...prop });
  }

  deleteProperty(propertiesId: number) {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Property',
      message: `Are you sure you want to delete property #${propertiesId}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(d => d.propertiesId !== propertiesId);
      }
    });
  }

}
