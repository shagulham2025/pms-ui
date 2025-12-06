import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Prescription } from '../../../model/prescription';
import { AddEditPrescriptionComponent } from './add-edit-prescription-component/add-edit-prescription-component';
import { ConfirmDialogData } from '../../../model/confirm-dialog-data';
import { ConfirmationDialog } from '../../shared/confirmation-dialog/confirmation-dialog';

@Component({
  standalone: false,
  selector: 'app-prescription-component',
  templateUrl: './prescription-component.html'
})
export class PrescriptionComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['code', 'value', 'description', 'actions'];
  dataSource = new MatTableDataSource<Prescription>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.data = Array.from({ length: 8 }, (_, i) => {
      const id = i + 3001;
      return {
        prescriptionId: id,
        code: `RX-${id}`,
        value: `Prescription Value ${id}`,
        description: `Sample prescription ${id}`
      } as Prescription;
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

  openAddPrescriptionDialog(data?: any): void {
    const ref = this.dialog.open(AddEditPrescriptionComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: true,
      data: data ?? {}
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      if (result.prescriptionId) {
        const idx = this.dataSource.data.findIndex(d => d.prescriptionId === result.prescriptionId);
        if (idx !== -1) {
          this.dataSource.data[idx] = result;
          this.dataSource._updateChangeSubscription();
        }
      } else {
        const nextId = (this.dataSource.data.length ? Math.max(...this.dataSource.data.map(d => d.prescriptionId)) : 3000) + 1;
        result.prescriptionId = nextId;
        this.dataSource.data = [result, ...this.dataSource.data];
      }
    });
  }

  editPrescription(p: Prescription) {
    this.openAddPrescriptionDialog({ ...p });
  }

  deletePrescription(prescriptionId: number) {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Prescription',
      message: `Are you sure you want to delete prescription #${prescriptionId}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    const r = this.dialog.open(ConfirmationDialog, { width: '350px', data: dialogData });
    r.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(d => d.prescriptionId !== prescriptionId);
      }
    });
  }

}
