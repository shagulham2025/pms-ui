
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-add-edit-docter-component',
  templateUrl: './add-edit-docter-component.html'
})
export class AddEditDocterComponent implements OnInit {

  form!: FormGroup;
  isReadOnly = false;

  statuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditDocterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isReadOnly = !!data?.readonly;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.id ?? null],
      name: [this.data?.name ?? '', Validators.required],
      specialization: [this.data?.specialization ?? '', Validators.required],
      department: [this.data?.department ?? '', Validators.required],
      experience: [this.data?.experience ?? 0, [Validators.required, Validators.min(0)]],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      phone: [this.data?.phone ?? '', Validators.required],
      status: [this.data?.status ?? 'ACTIVE', Validators.required]
    });
    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  submit() {
    if (this.isReadOnly) {
      this.dialogRef.close(null);
      return;
    }
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
