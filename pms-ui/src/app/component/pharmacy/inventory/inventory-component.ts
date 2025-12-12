import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddEditInventoryComponent } from '../add-edit-inventory/add-edit-inventory-component';

interface Medicine {
  id: number;
  name: string;
  sku: string;
  stock: number;
  unitPrice: number;
  expiry: string; // ISO date
}

@Component({
  standalone: false,
  selector: 'app-inventory-component',
  templateUrl: './inventory-component.html'
})
export class InventoryComponent implements AfterViewInit {
  displayedColumns: string[] = ['id','name','sku','stock','unitPrice','expiry','actions'];
  dataSource = new MatTableDataSource<Medicine>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private nextId = 10;

  constructor(private dialog: MatDialog){
    const sample: Medicine[] = [
      { id: 1, name: 'Paracetamol', sku: 'PARA-500', stock: 120, unitPrice: 0.5, expiry: '2026-08-01' },
      { id: 2, name: 'Amoxicillin', sku: 'AMOX-250', stock: 60, unitPrice: 1.2, expiry: '2025-12-31' }
    ];
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

  view(m: Medicine) { console.log('view', m); }
  edit(m: Medicine) { this.openAddDialog(m as any); }
  openAddDialog(data?: Partial<Medicine>){
    const ref = this.dialog.open(AddEditInventoryComponent, { width: '700px', data: data ?? null, disableClose: true });
    ref.afterClosed().subscribe((result: Partial<Medicine> | null) => {
      if (!result) return;
      if (result.id) {
        const idx = this.dataSource.data.findIndex(x => x.id === result.id);
        if (idx !== -1) {
          const copy = this.dataSource.data.slice();
          copy[idx] = { ...(copy[idx]), ...(result as Medicine) };
          this.dataSource.data = copy;
        }
      } else {
        const newRow: Medicine = {
          id: this.nextId++,
          name: result.name ?? '',
          sku: result.sku ?? '',
          stock: result.stock ?? 0,
          unitPrice: result.unitPrice ?? 0,
          expiry: result.expiry ?? ''
        };
        this.dataSource.data = [newRow, ...this.dataSource.data];
      }
    });
  }

  delete(m: Medicine) {
    if (!confirm(`Delete ${m.name}?`)) return;
    this.dataSource.data = this.dataSource.data.filter(x => x.id !== m.id);
  }
}
