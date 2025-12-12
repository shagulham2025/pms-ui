import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-add-edit-inventory-component',
  templateUrl: './add-edit-inventory-component.html'
})
export class AddEditInventoryComponent implements OnInit {
  form!: FormGroup;
  isReadOnly = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.isReadOnly = !!data?.readonly; }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.id ?? null],
      name: [this.data?.name ?? '', Validators.required],
      sku: [this.data?.sku ?? '', Validators.required],
      stock: [this.data?.stock ?? 0, [Validators.required, Validators.min(0)]],
      unitPrice: [this.data?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
      expiry: [this.data?.expiry ? new Date(this.data?.expiry) : null]
    });
    if (this.isReadOnly) this.form.disable();
  }

  submit(){
    if (this.isReadOnly) { this.dialogRef.close(null); return; }
    if (this.form.valid) {
      const v = { ...this.form.value };
      if (v.expiry instanceof Date) v.expiry = v.expiry.toISOString().split('T')[0];
      this.dialogRef.close(v);
    } else this.form.markAllAsTouched();
  }

  cancel(){ this.dialogRef.close(null); }
}
