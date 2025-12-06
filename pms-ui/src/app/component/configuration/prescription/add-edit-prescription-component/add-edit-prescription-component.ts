import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-add-edit-prescription-component',
  templateUrl: './add-edit-prescription-component.html'
})
export class AddEditPrescriptionComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditPrescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.prescriptionId;
    this.form = this.fb.group({
      prescriptionId: [this.data?.prescriptionId ?? null],
      code: [this.data?.code ?? '', Validators.required],
      value: [this.data?.value ?? '', Validators.required],
      description: [this.data?.description ?? '']
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
